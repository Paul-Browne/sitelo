import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'

import {
  CATEGORIES,
  collectFailures,
  formatFailures,
  formatScore,
  formatTableHeader,
  formatTableRow,
  lighthouseFlags,
  median,
  normalizeLighthouseOptions,
  normalizeScore,
  selectPages,
  summarizeRuns,
  tableLayout,
} from '../src/lighthouse.js'
import { createFixture } from './helpers/fixture.js'

const execFileAsync = promisify(execFile)
const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const cliPath = path.join(rootDir, 'bin', 'sitelo.js')

test('normalizeLighthouseOptions: falsey → null', () => {
  assert.equal(normalizeLighthouseOptions(undefined), null)
  assert.equal(normalizeLighthouseOptions(null), null)
  assert.equal(normalizeLighthouseOptions(false), null)
})

test('normalizeLighthouseOptions: true → defaults', () => {
  assert.deepEqual(normalizeLighthouseOptions(true), {
    include: ['**/*.html'],
    exclude: [],
    categories: CATEGORIES,
    thresholds: {},
    mode: 'error',
    formFactor: 'mobile',
    runs: 1,
    output: false,
    formats: ['html'],
    headless: true,
    chromeFlags: [],
    port: undefined,
    flags: {},
    config: undefined,
    onBuild: false,
  })
})

test('normalizeLighthouseOptions: single patterns are wrapped', () => {
  const options = normalizeLighthouseOptions({
    include: 'docs/**/*.html',
    exclude: /^404\.html$/,
  })

  assert.deepEqual(options.include, ['docs/**/*.html'])
  assert.deepEqual(options.exclude, [/^404\.html$/])
})

test('normalizeLighthouseOptions: categories keep the reporting order', () => {
  const options = normalizeLighthouseOptions({
    categories: ['seo', 'performance'],
  })

  assert.deepEqual(options.categories, ['performance', 'seo'])
})

test('normalizeLighthouseOptions: output true → default directory', () => {
  assert.equal(normalizeLighthouseOptions({ output: true }).output, '.sitelo/lighthouse')
  assert.equal(normalizeLighthouseOptions({ output: 'reports' }).output, 'reports')
  assert.equal(normalizeLighthouseOptions({}).output, false)
})

test('normalizeLighthouseOptions: rejects invalid values', () => {
  assert.throws(() => normalizeLighthouseOptions('yes'), /must be true or an object/)
  assert.throws(() => normalizeLighthouseOptions([]), /must be true or an object/)
  assert.throws(
    () => normalizeLighthouseOptions({ categories: ['perf'] }),
    /unknown category: perf/,
  )
  assert.throws(
    () => normalizeLighthouseOptions({ categories: [] }),
    /must be a non-empty array/,
  )
  assert.throws(
    () => normalizeLighthouseOptions({ thresholds: { speed: 90 } }),
    /unknown category: speed/,
  )
  assert.throws(
    () => normalizeLighthouseOptions({ mode: 'shout' }),
    /must be 'warn' or 'error'/,
  )
  assert.throws(
    () => normalizeLighthouseOptions({ formFactor: 'tablet' }),
    /must be 'mobile' or 'desktop'/,
  )
  assert.throws(
    () => normalizeLighthouseOptions({ formats: ['pdf'] }),
    /unsupported format: pdf/,
  )
  assert.throws(() => normalizeLighthouseOptions({ runs: 0 }), /positive integer/)
  assert.throws(
    () => normalizeLighthouseOptions({ chromeFlags: '--headless' }),
    /array of strings/,
  )
  assert.throws(
    () => normalizeLighthouseOptions({ include: [42] }),
    /strings or regular expressions/,
  )
})

test('normalizeLighthouseOptions: a threshold outside the audited categories is a mistake', () => {
  assert.throws(
    () =>
      normalizeLighthouseOptions({
        categories: ['seo'],
        thresholds: { performance: 90 },
      }),
    /is set but "performance" is not in "lighthouse.categories"/,
  )
})

test('normalizeScore: reads both the 0-100 and the 0-1 scale', () => {
  assert.equal(normalizeScore(90, 'x'), 0.9)
  assert.equal(normalizeScore(0.9, 'x'), 0.9)
  // The scales only overlap where they agree.
  assert.equal(normalizeScore(100, 'x'), 1)
  assert.equal(normalizeScore(1, 'x'), 1)
  assert.equal(normalizeScore(0, 'x'), 0)
})

test('normalizeScore: rejects anything off the scale', () => {
  assert.throws(() => normalizeScore(101, 'thresholds.seo'), /"thresholds.seo"/)
  assert.throws(() => normalizeScore(-1, 'x'), /between 0 and 100/)
  assert.throws(() => normalizeScore('90', 'x'), /must be a number/)
  assert.throws(() => normalizeScore(Number.NaN, 'x'), /must be a number/)
})

test('selectPages: include and exclude are globs over build-relative paths', () => {
  const files = ['404.html', 'docs/index.html', 'docs/routing.html', 'index.html']

  assert.deepEqual(selectPages(files, { include: ['**/*.html'], exclude: [] }), files)
  assert.deepEqual(
    selectPages(files, { include: ['**/*.html'], exclude: ['404.html'] }),
    ['docs/index.html', 'docs/routing.html', 'index.html'],
  )
  assert.deepEqual(selectPages(files, { include: ['docs/**'], exclude: [] }), [
    'docs/index.html',
    'docs/routing.html',
  ])
  assert.deepEqual(
    selectPages(files, { include: ['**/*.html'], exclude: [/^docs\//] }),
    ['404.html', 'index.html'],
  )
})

test('selectPages: normalizes Windows separators before matching', () => {
  const file = ['docs', 'routing.html'].join(path.sep)

  assert.deepEqual(selectPages([file], { include: ['docs/*.html'], exclude: [] }), [
    file,
  ])
})

test('median: odd and even counts', () => {
  assert.equal(median([0.5]), 0.5)
  assert.equal(median([0.9, 0.5, 0.7]), 0.7)
  assert.equal(median([0.4, 0.6]), 0.5)
})

test('summarizeRuns: medians each category and keeps the middle run', () => {
  const runs = [
    { performance: 0.5, seo: 1 },
    { performance: 0.9, seo: 1 },
    { performance: 0.7, seo: 1 },
  ]

  const { scores, index } = summarizeRuns(runs, ['performance', 'seo'])

  assert.deepEqual(scores, { performance: 0.7, seo: 1 })
  // 0.7 is the middle run, so its report is the one worth keeping.
  assert.equal(index, 2)
})

test('summarizeRuns: a category that never scored stays null', () => {
  const { scores } = summarizeRuns(
    [{ performance: null }, { performance: null }],
    ['performance'],
  )

  assert.equal(scores.performance, null)
})

test('formatScore: 0-1 scores print the way Lighthouse shows them', () => {
  assert.equal(formatScore(1), '100')
  assert.equal(formatScore(0.945), '95')
  assert.equal(formatScore(0), '0')
  assert.equal(formatScore(null), '-')
})

test('formatTableHeader/Row: columns line up', () => {
  const categories = ['performance', 'seo']
  const layout = tableLayout(['/', '/docs/routing'], categories)

  const header = formatTableHeader(categories, layout)
  const row = formatTableRow('/', { performance: 0.98, seo: 1 }, categories, layout)

  assert.equal(header, '  page           perf  seo')
  assert.equal(row, '  /                98  100')
  assert.equal(header.length, row.length)
})

test('collectFailures: only scores under their threshold', () => {
  const pages = [
    { page: '/', scores: { performance: 0.98, seo: 1 } },
    { page: '/docs', scores: { performance: 0.5, seo: 0.8 } },
  ]

  assert.deepEqual(collectFailures(pages, { performance: 0.9 }), [
    { page: '/docs', category: 'performance', score: 0.5, threshold: 0.9 },
  ])
  assert.deepEqual(collectFailures(pages, {}), [])
})

test('collectFailures: a missing score fails the threshold', () => {
  assert.deepEqual(
    collectFailures([{ page: '/', scores: { seo: null } }], { seo: 0.9 }),
    [{ page: '/', category: 'seo', score: null, threshold: 0.9 }],
  )
})

test('formatFailures: groups by page, no log prefix', () => {
  const message = formatFailures([
    { page: '/docs', category: 'performance', score: 0.5, threshold: 0.9 },
    { page: '/docs', category: 'seo', score: 0.8, threshold: 1 },
  ])

  assert.equal(
    message,
    [
      '2 lighthouse scores below threshold on 1 page',
      '',
      '  /docs',
      '    performance  50 < 90',
      '    seo          80 < 100',
    ].join('\n'),
  )
  assert.ok(!message.includes('[sitelo]'))
})

test('lighthouseFlags: port, formats and categories stay sitelo-owned', () => {
  const options = normalizeLighthouseOptions({
    categories: ['seo'],
    output: true,
    formats: ['html', 'json'],
    flags: {
      port: 1,
      output: 'csv',
      onlyCategories: ['performance'],
      maxWaitForLoad: 1000,
    },
  })

  const flags = lighthouseFlags(options, 9222)

  assert.equal(flags.port, 9222)
  assert.deepEqual(flags.output, ['html', 'json'])
  assert.deepEqual(flags.onlyCategories, ['seo'])
  // Everything else the user passes still wins.
  assert.equal(flags.maxWaitForLoad, 1000)
})

test('lighthouseFlags: desktop applies the preset, mobile leaves defaults', () => {
  const desktop = lighthouseFlags(
    normalizeLighthouseOptions({ formFactor: 'desktop' }),
    9222,
  )
  const mobile = lighthouseFlags(normalizeLighthouseOptions(true), 9222)

  assert.equal(desktop.formFactor, 'desktop')
  assert.equal(desktop.screenEmulation.mobile, false)
  assert.equal(desktop.throttling.cpuSlowdownMultiplier, 1)
  assert.equal(mobile.formFactor, undefined)
  assert.equal(mobile.screenEmulation, undefined)
})

test('lighthouseFlags: a user preset overrides the desktop defaults', () => {
  const flags = lighthouseFlags(
    normalizeLighthouseOptions({
      formFactor: 'desktop',
      flags: { throttlingMethod: 'provided', screenEmulation: { disabled: true } },
    }),
    9222,
  )

  assert.equal(flags.throttlingMethod, 'provided')
  assert.deepEqual(flags.screenEmulation, { disabled: true })
})

/**
 * The real thing: build a site, audit it, keep the report.
 *
 * Lighthouse drives an actual Chrome, so this only runs where both are
 * available — it is an optional peer dependency, and a headless browser is
 * not a given on every machine.
 */
test('sitelo lighthouse audits the build', async (t) => {
  const unavailable = await lighthouseUnavailable()

  if (unavailable) {
    t.skip(unavailable)
    return
  }

  const fixtureDir = createFixture('basic')
  const configPath = path.join(fixtureDir, 'sitelo.config.js')

  t.after(() => {
    fs.rmSync(path.join(fixtureDir, 'dist'), { recursive: true, force: true })
    fs.rmSync(path.join(fixtureDir, '.sitelo'), { recursive: true, force: true })
  })

  fs.writeFileSync(
    configPath,
    `export default {
  site: 'https://example.com',
  buildReport: false,
  lighthouse: {
    exclude: ['404.html'],
    categories: ['seo'],
    thresholds: { seo: 50 },
    output: true,
  },
}
`,
  )

  await execFileAsync(process.execPath, [cliPath, 'build'], { cwd: fixtureDir })

  const { stdout } = await execFileAsync(process.execPath, [cliPath, 'lighthouse'], {
    cwd: fixtureDir,
  })

  assert.match(stdout, /lighthouse mobile - 1 page/)
  // The page column carries the URL the site links, not the file path.
  assert.match(stdout, /\n {2}\/ +\d+\n/)
  assert.ok(
    fs.existsSync(path.join(fixtureDir, '.sitelo', 'lighthouse', 'index.report.html')),
    'expected a saved HTML report',
  )
})

/** @returns {Promise<string | null>} why the audit cannot run, if it cannot */
async function lighthouseUnavailable() {
  try {
    await import('lighthouse')
  } catch {
    return 'lighthouse is not installed'
  }

  try {
    const { Launcher } = await import('chrome-launcher')
    if (!Launcher.getFirstInstallation()) return 'no Chrome installation found'
  } catch {
    return 'chrome-launcher is not installed'
  }

  return null
}
