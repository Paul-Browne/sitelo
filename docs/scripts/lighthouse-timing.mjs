/**
 * Summarize where `sitelo lighthouse` spent its time, from the JSON
 * reports it saved.
 *
 * Diagnostic, and temporary. The docs audit costs ~4s a page on a laptop
 * and ~55s on a GitHub runner, where `lh:driver:navigate` pins to
 * Lighthouse's load ceiling on every page — it never decides the page is
 * quiet. Lighthouse logs the whole navigation as one entry, so the reason
 * has to come from the run's own diagnostics: a pegged main thread, a
 * slow server, or a request that never finished.
 *
 *   node docs/scripts/lighthouse-timing.mjs [reportDir]
 */
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

/** Phases worth naming; the rest rolls up into the total. */
const PHASES = [
  ['navigate', 'lh:driver:navigate'],
  ['benchmark', 'lh:gather:getBenchmarkIndex'],
  ['a11y', 'lh:gather:getArtifact:Accessibility'],
  ['gather', 'lh:runner:gather'],
  ['audit', 'lh:runner:audit'],
]

async function collectReports(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const full = path.join(dir, entry.name)

    if (entry.isDirectory()) files.push(...(await collectReports(full)))
    else if (entry.name.endsWith('.report.json')) files.push(full)
  }

  return files.sort()
}

const dir = path.resolve(process.argv[2] ?? 'docs/.sitelo/lighthouse')

let files = []

try {
  files = await collectReports(dir)
} catch {
  // Reported below.
}

if (files.length === 0) {
  console.error(`no lighthouse reports under ${dir}`)
  process.exit(0)
}

const rows = []
const warnings = []

for (const file of files) {
  const lhr = JSON.parse(await readFile(file, 'utf8'))
  const page = path.relative(dir, file).replace(/\.report\.json$/, '')

  /** A phase can appear more than once (about:blank, then the page). */
  const byName = new Map()

  for (const entry of lhr.timing?.entries ?? []) {
    byName.set(entry.name, Math.max(byName.get(entry.name) ?? 0, entry.duration))
  }

  rows.push({
    page,
    total: lhr.timing?.total ?? 0,
    phases: PHASES.map(([, name]) => byName.get(name) ?? 0),
    diagnostics: lhr.audits?.diagnostics?.details?.items?.[0] ?? {},
    longTasks: lhr.audits?.['long-tasks']?.details?.items ?? [],
    requests: lhr.audits?.['network-requests']?.details?.items ?? [],
  })

  for (const warning of lhr.runWarnings ?? []) warnings.push(`${page}: ${warning}`)
}

const ms = (value) => `${Math.round(value)}`
const width = Math.max(4, ...rows.map((row) => row.page.length))
const cells = (values) => values.map((value) => String(value).padStart(11)).join('')

console.log(`\nlighthouse phase timings (ms) — ${rows.length} reports\n`)
console.log(`  ${'page'.padEnd(width)}  ${cells(['total', ...PHASES.map(([label]) => label)])}`)

for (const row of rows) {
  console.log(`  ${row.page.padEnd(width)}  ${cells([ms(row.total), ...row.phases.map(ms)])}`)
}

/*
 * Why the navigation would not settle. A page that never goes quiet is
 * either busy (task time, tasks over 50ms), waiting on a slow server, or
 * waiting on a request that never came back.
 */
console.log(`\nload diagnostics\n`)
console.log(
  `  ${'page'.padEnd(width)}  ${cells(['taskTime', '>50ms', 'maxLatency', 'requests', 'unfinished'])}`,
)

for (const row of rows) {
  const unfinished = row.requests.filter((request) => !(request.networkEndTime > 0))

  console.log(
    `  ${row.page.padEnd(width)}  ${cells([
      `${ms(row.diagnostics.totalTaskTime ?? 0)}ms`,
      row.diagnostics.numTasksOver50ms ?? 0,
      `${ms(row.diagnostics.maxServerLatency ?? 0)}ms`,
      row.diagnostics.numRequests ?? row.requests.length,
      unfinished.length,
    ])}`,
  )
}

const total = rows.reduce((sum, row) => sum + row.total, 0)
console.log(
  `\n  ${rows.length} pages, ${(total / 1000).toFixed(1)}s of Lighthouse time, ` +
    `${(total / rows.length / 1000).toFixed(1)}s a page`,
)

console.log(
  warnings.length > 0
    ? `\n  lighthouse run warnings\n${warnings.map((w) => `    ${w}`).join('\n')}`
    : '\n  no lighthouse run warnings',
)

/** The worst page in detail: what held the main thread, and what stalled. */
const worst = rows.reduce((a, b) => (b.total > a.total ? b : a))

console.log(`\n  worst page: ${worst.page}`)

if (worst.longTasks.length > 0) {
  console.log('    longest main-thread tasks')
  for (const task of [...worst.longTasks].sort((a, b) => b.duration - a.duration).slice(0, 5)) {
    console.log(
      `      ${ms(task.duration).padStart(7)}ms  ${String(task.url ?? '').replace(/^https?:\/\/[^/]+/, '').slice(0, 60)}`,
    )
  }
} else {
  console.log('    no long tasks recorded')
}

const spent = (request) =>
  request.networkEndTime > 0 ? request.networkEndTime - request.networkRequestTime : Infinity

const slowest = [...worst.requests].sort((a, b) => spent(b) - spent(a)).slice(0, 5)

if (slowest.length > 0) {
  console.log('    longest requests')
  for (const request of slowest) {
    const took = spent(request)
    console.log(
      `      ${(took === Infinity ? 'unfinished' : `${ms(took)}ms`).padStart(9)}  ` +
        `${String(request.statusCode ?? '-').padStart(3)}  ` +
        `${String(request.url ?? '').replace(/^https?:\/\/[^/]+/, '').slice(0, 60)}`,
    )
  }
}
