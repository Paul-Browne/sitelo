import fsSync from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import { mergeConfig, preview } from 'vite'

import { installCommand } from './package-manager.js'
import { collectHtmlFiles, matchesGlob, pageUrl, toPosix } from './site-paths.js'

/** Category ids Lighthouse scores, in the order they are reported. */
export const CATEGORIES = ['performance', 'accessibility', 'best-practices', 'seo']

/** Column headings, short enough for a terminal table. */
const CATEGORY_LABELS = {
  performance: 'perf',
  accessibility: 'a11y',
  'best-practices': 'best',
  seo: 'seo',
}

const OUTPUT_FORMATS = ['html', 'json', 'csv']
const DEFAULT_INCLUDE = ['**/*.html']
const DEFAULT_OUTPUT_DIR = '.sitelo/lighthouse'

/**
 * Lighthouse's own desktop preset, inlined.
 *
 * The preset lives at `lighthouse/core/config/desktop-config.js`, a deep
 * import into a package that makes no promises about that path. These are
 * the settings it applies; `emulatedUserAgent: false` keeps the real
 * (desktop) Chrome UA rather than pinning a Chrome version here.
 */
const DESKTOP_SETTINGS = {
  formFactor: 'desktop',
  screenEmulation: {
    mobile: false,
    width: 1350,
    height: 940,
    deviceScaleFactor: 1,
    disabled: false,
  },
  throttling: {
    rttMs: 40,
    throughputKbps: 10 * 1024,
    cpuSlowdownMultiplier: 1,
    requestLatencyMs: 0,
    downloadThroughputKbps: 0,
    uploadThroughputKbps: 0,
  },
  emulatedUserAgent: false,
}

/**
 * @typedef {object} LighthouseOptions
 * @property {Array<string | RegExp>} include
 * @property {Array<string | RegExp>} exclude
 * @property {string[]} categories
 * @property {Record<string, number>} thresholds scores as 0–1 fractions
 * @property {'warn' | 'error'} mode
 * @property {'mobile' | 'desktop'} formFactor
 * @property {number} runs
 * @property {string | false} output
 * @property {string[]} formats
 * @property {boolean} headless
 * @property {string[]} chromeFlags
 * @property {number | undefined} port
 * @property {Record<string, unknown>} flags
 * @property {object | undefined} config
 * @property {boolean} onBuild
 */

/**
 * A Lighthouse score written the way people say it (`90`) or the way
 * Lighthouse stores it (`0.9`).
 *
 * Anything above 1 is a percentage; `0` and `1` mean the same thing on
 * either scale, so the two never collide.
 *
 * @param {unknown} value
 * @param {string} label for the error message
 * @returns {number} 0–1
 */
export function normalizeScore(value, label) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 100) {
    throw new Error(`"${label}" must be a number between 0 and 100`)
  }

  return value <= 1 ? value : value / 100
}

/**
 * @param {unknown} value
 * @param {string} label
 * @returns {Array<string | RegExp>}
 */
function toPatterns(value, label) {
  const list = Array.isArray(value) ? value : [value]

  return list.map((entry) => {
    if (entry instanceof RegExp) return entry
    if (typeof entry === 'string') return entry
    throw new Error(`"${label}" entries must be strings or regular expressions`)
  })
}

/**
 * @param {unknown} value
 * @param {string} label
 * @param {number} fallback
 */
function toPositiveInteger(value, label, fallback) {
  if (value == null) return fallback

  if (!Number.isInteger(value) || value < 1) {
    throw new Error(`"${label}" must be a positive integer`)
  }

  return value
}

/**
 * Normalize the sitelo.config.js `lighthouse` option.
 *
 * @param {unknown} lighthouse
 * @returns {LighthouseOptions | null}
 */
export function normalizeLighthouseOptions(lighthouse) {
  if (lighthouse == null || lighthouse === false) return null

  if (lighthouse !== true && (typeof lighthouse !== 'object' || Array.isArray(lighthouse))) {
    throw new Error('"lighthouse" must be true or an object')
  }

  const options = lighthouse === true ? {} : lighthouse

  const categories = options.categories ?? CATEGORIES

  if (!Array.isArray(categories) || categories.length === 0) {
    throw new Error('"lighthouse.categories" must be a non-empty array')
  }

  for (const category of categories) {
    if (!CATEGORIES.includes(category)) {
      throw new Error(
        `"lighthouse.categories" contains an unknown category: ${category} (expected ${CATEGORIES.join(', ')})`,
      )
    }
  }

  // Report in a fixed order, whatever order they were configured in.
  const selected = CATEGORIES.filter((category) => categories.includes(category))

  const rawThresholds = options.thresholds ?? {}

  if (typeof rawThresholds !== 'object' || Array.isArray(rawThresholds)) {
    throw new Error('"lighthouse.thresholds" must be an object of category scores')
  }

  /** @type {Record<string, number>} */
  const thresholds = {}

  for (const [category, value] of Object.entries(rawThresholds)) {
    if (!CATEGORIES.includes(category)) {
      throw new Error(
        `"lighthouse.thresholds" contains an unknown category: ${category} (expected ${CATEGORIES.join(', ')})`,
      )
    }

    if (!selected.includes(category)) {
      throw new Error(
        `"lighthouse.thresholds.${category}" is set but "${category}" is not in "lighthouse.categories"`,
      )
    }

    thresholds[category] = normalizeScore(value, `lighthouse.thresholds.${category}`)
  }

  const mode = options.mode ?? 'error'

  if (mode !== 'warn' && mode !== 'error') {
    throw new Error(
      `"lighthouse.mode" must be 'warn' or 'error', got ${JSON.stringify(mode)}`,
    )
  }

  const formFactor = options.formFactor ?? 'mobile'

  if (formFactor !== 'mobile' && formFactor !== 'desktop') {
    throw new Error(
      `"lighthouse.formFactor" must be 'mobile' or 'desktop', got ${JSON.stringify(formFactor)}`,
    )
  }

  const output =
    options.output === true
      ? DEFAULT_OUTPUT_DIR
      : (options.output ?? false)

  if (output !== false && typeof output !== 'string') {
    throw new Error('"lighthouse.output" must be a boolean or a directory path')
  }

  const formats = options.formats ?? ['html']

  if (!Array.isArray(formats) || formats.length === 0) {
    throw new Error('"lighthouse.formats" must be a non-empty array')
  }

  for (const format of formats) {
    if (!OUTPUT_FORMATS.includes(format)) {
      throw new Error(
        `"lighthouse.formats" contains an unsupported format: ${format} (expected ${OUTPUT_FORMATS.join(', ')})`,
      )
    }
  }

  const chromeFlags = options.chromeFlags ?? []

  if (!Array.isArray(chromeFlags) || chromeFlags.some((flag) => typeof flag !== 'string')) {
    throw new Error('"lighthouse.chromeFlags" must be an array of strings')
  }

  const flags = options.flags ?? {}

  if (typeof flags !== 'object' || Array.isArray(flags)) {
    throw new Error('"lighthouse.flags" must be an object of Lighthouse flags')
  }

  if (options.config != null && (typeof options.config !== 'object' || Array.isArray(options.config))) {
    throw new Error('"lighthouse.config" must be a Lighthouse config object')
  }

  if (options.port != null && (!Number.isInteger(options.port) || options.port < 0)) {
    throw new Error('"lighthouse.port" must be a port number')
  }

  return {
    include: toPatterns(options.include ?? DEFAULT_INCLUDE, 'lighthouse.include'),
    exclude: toPatterns(options.exclude ?? [], 'lighthouse.exclude'),
    categories: selected,
    thresholds,
    mode,
    formFactor,
    runs: toPositiveInteger(options.runs, 'lighthouse.runs', 1),
    output,
    formats: [...new Set(formats)],
    headless: options.headless !== false,
    chromeFlags,
    port: options.port ?? undefined,
    flags,
    config: options.config ?? undefined,
    onBuild: options.onBuild === true,
  }
}

/**
 * @param {string} relativePath build-relative path
 * @param {Array<string | RegExp>} patterns
 */
function matchesAny(relativePath, patterns) {
  const file = toPosix(relativePath)

  return patterns.some((pattern) =>
    pattern instanceof RegExp ? pattern.test(file) : matchesGlob(file, pattern),
  )
}

/**
 * The pages to audit, in build order.
 *
 * @param {string[]} files build-relative `.html` paths
 * @param {Pick<LighthouseOptions, 'include' | 'exclude'>} options
 * @returns {string[]}
 */
export function selectPages(files, options) {
  return files.filter(
    (file) => matchesAny(file, options.include) && !matchesAny(file, options.exclude),
  )
}

/**
 * @param {number[]} values
 * @returns {number}
 */
export function median(values) {
  const sorted = [...values].sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)

  return sorted.length % 2 === 1
    ? sorted[middle]
    : (sorted[middle - 1] + sorted[middle]) / 2
}

/**
 * Per-category median across repeated runs, plus which run to keep the
 * report for — the one whose scores sit in the middle overall.
 *
 * Lighthouse's performance score moves between runs on the same page, so
 * `runs > 1` is the honest way to compare against a threshold.
 *
 * @param {Array<Record<string, number | null>>} runs one entry per run
 * @param {string[]} categories
 * @returns {{ scores: Record<string, number | null>, index: number }}
 */
export function summarizeRuns(runs, categories) {
  /** @type {Record<string, number | null>} */
  const scores = {}

  for (const category of categories) {
    const values = runs
      .map((run) => run[category])
      .filter((value) => typeof value === 'number')

    scores[category] = values.length ? median(values) : null
  }

  const means = runs.map((run) => {
    const values = categories
      .map((category) => run[category])
      .filter((value) => typeof value === 'number')

    return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0
  })

  const ranked = means
    .map((mean, index) => ({ mean, index }))
    .sort((a, b) => a.mean - b.mean || a.index - b.index)

  return { scores, index: ranked[Math.floor((ranked.length - 1) / 2)].index }
}

/** A 0–1 score as Lighthouse displays it. */
export function formatScore(score) {
  return typeof score === 'number' ? String(Math.round(score * 100)) : '-'
}

/**
 * Column widths for the score table, so rows can be printed as they finish.
 *
 * @param {string[]} urls
 * @param {string[]} categories
 */
export function tableLayout(urls, categories) {
  return {
    page: Math.max('page'.length, ...urls.map((url) => url.length)),
    // Room for a 3-digit score under every heading.
    columns: categories.map((category) =>
      Math.max(CATEGORY_LABELS[category].length, 3),
    ),
  }
}

/**
 * @param {string[]} categories
 * @param {ReturnType<typeof tableLayout>} layout
 */
export function formatTableHeader(categories, layout) {
  const cells = categories.map((category, index) =>
    CATEGORY_LABELS[category].padStart(layout.columns[index]),
  )

  return `  ${'page'.padEnd(layout.page)}  ${cells.join('  ')}`
}

/**
 * @param {string} url
 * @param {Record<string, number | null>} scores
 * @param {string[]} categories
 * @param {ReturnType<typeof tableLayout>} layout
 */
export function formatTableRow(url, scores, categories, layout) {
  const cells = categories.map((category, index) =>
    formatScore(scores[category]).padStart(layout.columns[index]),
  )

  return `  ${url.padEnd(layout.page)}  ${cells.join('  ')}`
}

/**
 * Every category score that came in under its threshold.
 *
 * @param {Array<{ page: string, scores: Record<string, number | null> }>} pages
 * @param {Record<string, number>} thresholds
 * @returns {Array<{ page: string, category: string, score: number | null, threshold: number }>}
 */
export function collectFailures(pages, thresholds) {
  const failures = []

  for (const page of pages) {
    for (const [category, threshold] of Object.entries(thresholds)) {
      const score = page.scores[category]

      if (typeof score !== 'number' || score < threshold) {
        failures.push({ page: page.page, category, score: score ?? null, threshold })
      }
    }
  }

  return failures
}

/**
 * @param {ReturnType<typeof collectFailures>} failures
 * @returns {string}
 */
export function formatFailures(failures) {
  const byPage = new Map()

  for (const failure of failures) {
    const list = byPage.get(failure.page) ?? []
    list.push(failure)
    byPage.set(failure.page, list)
  }

  // No `[sitelo]` prefix: the warn path adds one, and the CLI's error
  // handler already prefixes anything thrown.
  const lines = [
    `${failures.length} lighthouse score${failures.length === 1 ? '' : 's'} below threshold on ${byPage.size} page${byPage.size === 1 ? '' : 's'}`,
    '',
  ]

  for (const [page, entries] of byPage) {
    lines.push(`  ${page}`)

    const width = Math.max(...entries.map((entry) => entry.category.length))

    for (const entry of entries) {
      lines.push(
        `    ${entry.category.padEnd(width)}  ${formatScore(entry.score)} < ${formatScore(entry.threshold)}`,
      )
    }

    lines.push('')
  }

  return lines.join('\n').trimEnd()
}

/**
 * Lazily load lighthouse with an actionable error when it is not installed.
 *
 * lighthouse is an optional peer dependency — only sites that enable
 * `lighthouse` need to install it.
 */
async function loadLighthouse() {
  let mod

  try {
    mod = await import('lighthouse')
  } catch (error) {
    const code = error?.code
    const missing = code === 'ERR_MODULE_NOT_FOUND' || code === 'MODULE_NOT_FOUND'

    throw new Error(
      missing
        ? '"lighthouse" requires the lighthouse package, which is an optional peer dependency.\n' +
          `Install it to enable audits: ${installCommand('lighthouse')}\n` +
          '(or remove `lighthouse` from sitelo.config.js)'
        : 'found lighthouse but could not load it.\n' +
          `(original error: ${error instanceof Error ? error.message : error})`,
    )
  }

  const lighthouse = mod.default ?? mod

  if (typeof lighthouse !== 'function') {
    throw new Error('found lighthouse but its default export is not callable')
  }

  return { lighthouse, launch: await loadChromeLauncher() }
}

/**
 * chrome-launcher is lighthouse's own dependency rather than sitelo's, so
 * resolve it from lighthouse. A bare import only works where the installer
 * hoisted it, which Yarn PnP and pnpm deliberately do not.
 */
async function loadChromeLauncher() {
  /** @type {string[]} */
  const specifiers = []

  try {
    const require = createRequire(fileURLToPath(import.meta.resolve('lighthouse')))
    specifiers.push(pathToFileURL(require.resolve('chrome-launcher')).href)
  } catch {
    // Fall through to the bare specifier below.
  }

  specifiers.push('chrome-launcher')

  for (const specifier of specifiers) {
    try {
      const mod = await import(specifier)
      const launch = mod.launch ?? mod.default?.launch

      if (typeof launch === 'function') return launch
    } catch {
      continue
    }
  }

  throw new Error(
    '"lighthouse" found lighthouse but not chrome-launcher, which it normally installs alongside itself.\n' +
      `Try reinstalling: ${installCommand('lighthouse')}`,
  )
}

/**
 * @param {(options: object) => Promise<{ port: number, kill: () => Promise<void> }>} launch
 * @param {LighthouseOptions} options
 */
async function launchChrome(launch, options) {
  const chromeFlags = [
    ...(options.headless ? ['--headless'] : []),
    ...options.chromeFlags,
  ]

  try {
    return await launch({ chromeFlags })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)

    throw new Error(
      `"lighthouse" could not start Chrome: ${message}\n` +
        'Lighthouse drives a real Chrome — install one, or point CHROME_PATH at an existing binary.',
    )
  }
}

/** Where a saved report lands, mirroring the site’s own structure. */
function reportPath(outputDir, file, format) {
  return path.join(outputDir, `${toPosix(file).replace(/\.html$/, '')}.report.${format}`)
}

/**
 * @param {{ root: string, options: LighthouseOptions, file: string, report: string | string[] }} args
 * @returns {Promise<string[]>} the paths written
 */
async function writeReports({ root, options, file, report }) {
  if (options.output === false) return []

  const outputDir = path.resolve(root, options.output)
  const reports = Array.isArray(report) ? report : [report]

  return Promise.all(
    options.formats.map(async (format, index) => {
      const target = reportPath(outputDir, file, format)
      await mkdir(path.dirname(target), { recursive: true })
      await writeFile(target, reports[index] ?? '')
      return target
    }),
  )
}

/**
 * Flags handed to every Lighthouse run.
 *
 * User `flags` sit on top of the preset — that is the escape hatch for
 * anything the CLI exposes (`--throttling-method`, `--max-wait-for-load`,
 * `--block-url-pattern`, …).
 *
 * The last three are sitelo's: the debugging port and the report formats
 * are plumbing, and the audited categories have to stay in step with the
 * `categories` option the score table is built from.
 *
 * @param {LighthouseOptions} options
 * @param {number} port
 */
export function lighthouseFlags(options, port) {
  return {
    logLevel: 'error',
    ...(options.formFactor === 'desktop' ? DESKTOP_SETTINGS : {}),
    ...options.flags,
    port,
    output: options.output === false ? 'json' : options.formats,
    onlyCategories: options.categories,
  }
}

/**
 * The file a static host would answer a request with, or `null` for a
 * path with nothing behind it.
 *
 * By the time this runs, Vite has already rewritten the pretty URLs, so
 * `/docs` arrives as `/docs.html`; only a trailing slash still has to be
 * turned into a directory index.
 *
 * @param {string} siteDir
 * @param {string} url the request URL, base already stripped
 * @returns {string | null}
 */
export function resolveStaticFile(siteDir, url) {
  const withoutQuery = url.split('?')[0].split('#')[0]

  let pathname

  try {
    pathname = decodeURIComponent(withoutQuery)
  } catch {
    return null
  }

  const relative = pathname.endsWith('/')
    ? `${pathname}index.html`
    : pathname

  const target = path.resolve(siteDir, `.${relative}`)

  // `.%2e/` and friends: anything that climbs out of the build is a miss,
  // not something to go looking for on disk.
  if (target !== siteDir && !target.startsWith(siteDir + path.sep)) return null

  try {
    return fsSync.statSync(target).isFile() ? target : null
  } catch {
    return null
  }
}

/**
 * Answer like a static host: 404 for a path with no file behind it.
 *
 * Vite's preview server falls back to `index.html` for anything it cannot
 * resolve. A static host does not, and the difference is measurable —
 * Lighthouse asks for `/robots.txt`, gets a 200 and a page of HTML, and
 * reports the site's robots.txt as malformed. Every audited site would
 * lose the same SEO point for a file that is correctly absent in
 * production.
 *
 * Returning a function registers this *after* Vite's own static and
 * html-fallback middlewares, so a rewritten `/docs.html` still resolves
 * and only genuine misses land here.
 *
 * @param {string} siteDir
 */
export function staticHostPlugin(siteDir) {
  /** @type {Buffer | null | undefined} */
  let notFoundPage

  return {
    name: 'sitelo:lighthouse-static-host',

    configurePreviewServer(server) {
      return () => {
        server.middlewares.use((req, res, next) => {
          if (resolveStaticFile(siteDir, req.url ?? '/')) return next()

          if (notFoundPage === undefined) {
            const custom = path.join(siteDir, '404.html')

            try {
              notFoundPage = fsSync.readFileSync(custom)
            } catch {
              notFoundPage = null
            }
          }

          // A build's own 404.html, served with a 404 — what GitHub Pages,
          // Netlify and Cloudflare Pages all do with it.
          res.statusCode = 404

          if (notFoundPage) {
            res.setHeader('Content-Type', 'text/html; charset=utf-8')
            res.end(notFoundPage)
          } else {
            res.end('Not found')
          }
        })
      }
    },
  }
}

/**
 * Run Lighthouse over the built site, printing a score table and holding
 * the scores against `thresholds`.
 *
 * The pages are served by a Vite preview server over the real build, so
 * what is audited is what ships.
 *
 * @param {{
 *   root: string
 *   outDir: string
 *   options: LighthouseOptions
 *   previewConfig?: object
 *   log?: (message: string) => void
 *   warn?: (message: string) => void
 * }} args
 * @returns {Promise<{
 *   pages: Array<{ file: string, page: string, url: string, scores: Record<string, number | null> }>
 *   failures: ReturnType<typeof collectFailures>
 * }>}
 */
export async function runLighthouse({
  root,
  outDir,
  options,
  previewConfig = {},
  log = console.log,
  warn = console.warn,
}) {
  const siteDir = path.resolve(root, outDir)

  let files

  try {
    files = await collectHtmlFiles(siteDir)
  } catch {
    throw new Error(
      `"lighthouse" found no build output at ${path.relative(root, siteDir) || siteDir} - run \`sitelo build\` first`,
    )
  }

  const pages = selectPages(files, options)

  if (pages.length === 0) {
    throw new Error(
      `"lighthouse" matched no pages in ${path.relative(root, siteDir) || siteDir} (check "lighthouse.include" / "lighthouse.exclude")`,
    )
  }

  const { lighthouse, launch } = await loadLighthouse()

  const server = await preview(
    // `root` pairs with the `outDir` below: the server has to serve the
    // very directory the pages were read from. An explicit root in
    // `previewConfig` — what the CLI passes — still wins.
    mergeConfig(mergeConfig({ root }, previewConfig), {
      build: { outDir },
      // A built site is a multi-page one. Vite's default `appType: 'spa'`
      // rewrites every unmatched path to `index.html`, which no static
      // host does — see `staticHostPlugin`.
      appType: 'mpa',
      plugins: [staticHostPlugin(siteDir)],
      preview: {
        open: false,
        ...(options.port != null ? { port: options.port } : {}),
      },
    }),
  )

  const startedAt = performance.now()

  try {
    const origin = server.resolvedUrls?.local[0] ?? server.resolvedUrls?.network[0]

    if (!origin) {
      throw new Error('"lighthouse" could not determine the preview server URL')
    }

    // `pageUrl` gives the path the site itself links; resolving it against
    // the server URL keeps any Vite `base` in front of it.
    const paths = pages.map((file) => pageUrl(file))
    const urls = paths.map((page) => new URL(page.replace(/^\//, ''), origin).href)
    const layout = tableLayout(paths, options.categories)

    log(
      `[sitelo] lighthouse ${options.formFactor} - ${pages.length} page${pages.length === 1 ? '' : 's'}` +
        `${options.runs > 1 ? ` x ${options.runs} runs` : ''}\n`,
    )
    log(formatTableHeader(options.categories, layout))

    const results = await auditPages({
      pages,
      paths,
      urls,
      layout,
      root,
      options,
      lighthouse,
      launch,
      log,
    })

    const elapsed = (performance.now() - startedAt) / 1000

    log(
      `\n[sitelo] lighthouse audited ${pages.length} page${pages.length === 1 ? '' : 's'} in ${elapsed.toFixed(1)}s`,
    )

    const failures = collectFailures(results, options.thresholds)

    if (failures.length > 0) {
      const message = formatFailures(failures)

      if (options.mode === 'error') throw new Error(message)

      warn(`[sitelo] ${message}`)
    }

    return { pages: results, failures }
  } finally {
    await server.close()
  }
}

/**
 * Audit every page in turn, through one Chrome.
 *
 * Serially, and deliberately: Lighthouse measures a page by loading it in
 * a browser it controls exclusively, so a second audit running alongside
 * would compete for the same CPU and skew the very numbers being measured.
 * Its Node API is not re-entrant either — parallel runs in one process
 * trip over each other's global performance marks.
 */
async function auditPages({
  pages,
  paths,
  urls,
  layout,
  root,
  options,
  lighthouse,
  launch,
  log,
}) {
  /** @type {Array<{ file: string, page: string, url: string, scores: Record<string, number | null> }>} */
  const results = []

  const chrome = await launchChrome(launch, options)

  try {
    for (const [index, file] of pages.entries()) {
      const result = await auditPage({
        file,
        page: paths[index],
        url: urls[index],
        chromePort: chrome.port,
        root,
        options,
        lighthouse,
      })

      results.push(result)
      log(formatTableRow(paths[index], result.scores, options.categories, layout))
    }
  } finally {
    // chrome-launcher's kill() is synchronous in v1 and a promise in
    // older releases; either way a browser that already exited is fine.
    try {
      await chrome.kill()
    } catch {
      // ignore
    }
  }

  return results
}

/**
 * One page: `runs` Lighthouse runs, median scores, and the median run's
 * report saved when `output` is on.
 */
async function auditPage({ file, page, url, chromePort, root, options, lighthouse }) {
  /** @type {Array<Record<string, number | null>>} */
  const runs = []
  /** @type {Array<string | string[]>} */
  const reports = []

  for (let run = 0; run < options.runs; run += 1) {
    let result

    try {
      result = await lighthouse(url, lighthouseFlags(options, chromePort), options.config)
    } catch (error) {
      throw new Error(
        `"lighthouse" failed on ${url}: ${error instanceof Error ? error.message : error}`,
      )
    }

    if (!result?.lhr) {
      throw new Error(`"lighthouse" returned no result for ${url}`)
    }

    const { runtimeError } = result.lhr

    if (runtimeError && runtimeError.code !== 'NO_ERROR') {
      throw new Error(
        `"lighthouse" could not audit ${url}: ${runtimeError.message ?? runtimeError.code}`,
      )
    }

    runs.push(
      Object.fromEntries(
        options.categories.map((category) => [
          category,
          result.lhr.categories?.[category]?.score ?? null,
        ]),
      ),
    )
    reports.push(result.report)
  }

  const { scores, index } = summarizeRuns(runs, options.categories)

  await writeReports({ root, options, file, report: reports[index] })

  return { file, page, url, scores }
}
