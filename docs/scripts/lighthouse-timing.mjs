/**
 * Summarize where `sitelo lighthouse` spent its time, from the JSON
 * reports it saved.
 *
 * Diagnostic, and temporary. The docs audit costs ~4s a page on a laptop
 * and ~56s a page on a GitHub runner, and a 14x gap is too big to explain
 * by "the runner is slower" without looking. Lighthouse times its own
 * phases; this prints them per page so the difference has a name.
 *
 *   node docs/scripts/lighthouse-timing.mjs [reportDir]
 */
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

/** The phases worth naming; everything else lands in the total. */
const PHASES = [
  ['navigate', 'lh:driver:navigate'],
  ['benchmark', 'lh:gather:getBenchmarkIndex'],
  ['screenshot', 'lh:gather:getArtifact:FullPageScreenshot'],
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

let files

try {
  files = await collectReports(dir)
} catch {
  console.error(`no lighthouse reports under ${dir}`)
  process.exit(0)
}

if (files.length === 0) {
  console.error(`no lighthouse reports under ${dir}`)
  process.exit(0)
}

const rows = []
const warnings = []

for (const file of files) {
  const lhr = JSON.parse(await readFile(file, 'utf8'))
  const byName = new Map(
    (lhr.timing?.entries ?? []).map((entry) => [entry.name, entry.duration]),
  )

  rows.push({
    page: path.relative(dir, file).replace(/\.report\.json$/, ''),
    total: lhr.timing?.total ?? 0,
    phases: PHASES.map(([, name]) => byName.get(name) ?? 0),
  })

  for (const warning of lhr.runWarnings ?? []) {
    warnings.push(`${path.relative(dir, file)}: ${warning}`)
  }
}

const ms = (value) => `${Math.round(value)}`
const width = Math.max(4, ...rows.map((row) => row.page.length))
const columns = ['total', ...PHASES.map(([label]) => label)]

console.log(`\nlighthouse phase timings (ms) — ${rows.length} reports\n`)
console.log(
  `  ${'page'.padEnd(width)}  ${columns.map((c) => c.padStart(10)).join('')}`,
)

for (const row of rows) {
  const cells = [ms(row.total), ...row.phases.map(ms)]
  console.log(`  ${row.page.padEnd(width)}  ${cells.map((c) => c.padStart(10)).join('')}`)
}

const total = rows.reduce((sum, row) => sum + row.total, 0)
console.log(
  `\n  ${rows.length} pages, ${(total / 1000).toFixed(1)}s of Lighthouse time, ` +
    `${(total / rows.length / 1000).toFixed(1)}s a page`,
)

if (warnings.length > 0) {
  console.log('\n  lighthouse run warnings')
  for (const warning of warnings) console.log(`    ${warning}`)
} else {
  console.log('\n  no lighthouse run warnings')
}
