import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

/** The same names the CLI looks for, in the same order. */
const CONFIG_FILES = ['sitelo.config.js', 'sitelo.config.mjs']

const DEFAULT_PAGES_DIR = 'src'

/** vite-plugin-html-pages' defaults; it does not export them. */
const DEFAULT_PAGE_EXTENSIONS = [
  '.ht.js',
  '.html.js',
  '.ht.ts',
  '.html.ts',
  '.ht.jsx',
  '.html.jsx',
  '.ht.tsx',
  '.html.tsx',
]

/**
 * Every extension an island can be written in: what the dev endpoint
 * serves (`.js`, `.mjs`, `.ts`) and what `createIslandsFromDirectory`
 * loads in production (`.js`, `.mjs`, `.cjs`).
 */
const ISLAND_MODULES = 'islands/*.{js,mjs,cjs,ts}'

/** Whatever a caller passed for a list option, as a list. */
function toArray(value) {
  if (value == null) return []

  return Array.isArray(value) ? value : [value]
}

function toPosix(value) {
  return value.split(path.sep).join('/')
}

/**
 * A production entry pattern: prefixed with `base` and suffixed with
 * knip's `!`.
 *
 * A negation keeps its leading `!` and gets no suffix. knip reads `!x!`
 * only in production mode and drops it otherwise, which would leave an
 * excluded page counting as a page; `!x` takes it out of the entries in
 * both modes.
 *
 * @param {string} base posix, `''` for the current directory
 * @param {string} pattern
 */
function production(base, pattern) {
  const negated = pattern.startsWith('!')
  const bare = negated ? pattern.slice(1) : pattern
  const joined = base ? path.posix.join(base, bare) : bare

  return negated ? `!${joined}` : `${joined}!`
}

/**
 * The page options from `sitelo.config.js`, and the file they came from.
 *
 * @param {string} root
 * @returns {Promise<{ configFile: string | undefined, options: Record<string, unknown> }>}
 */
async function loadSiteloOptions(root) {
  for (const fileName of CONFIG_FILES) {
    const configFile = path.join(root, fileName)
    if (!fs.existsSync(configFile)) continue

    const mod = await import(pathToFileURL(configFile).href)
    const options = mod.default ?? mod

    if (options && typeof options !== 'object') {
      throw new Error(`[sitelo] ${fileName} must export a configuration object`)
    }

    return { configFile, options: options ?? {} }
  }

  return { configFile: undefined, options: {} }
}

/**
 * A knip configuration that knows where sitelo's entry points are.
 *
 * Pages and islands are discovered from the filesystem, so nothing
 * imports them and knip would otherwise report the whole site as unused.
 * This reads `sitelo.config.js` (if there is one) and turns `pagesDir`,
 * `pageExtensions`, `include` and `exclude` into knip `production` entry
 * patterns, the same way the build discovers pages.
 *
 * ```js
 * // knip.js
 * import { knipConfig } from 'sitelo/knip'
 *
 * export default knipConfig()
 * ```
 *
 * Client scripts that pages reference by URL rather than import — a
 * `<script src="/js/app.js">` — are the one thing this cannot see, so
 * list them yourself. Anything else passed through is spread into the
 * result, so the whole of knip's configuration stays available.
 *
 * ```js
 * export default knipConfig({ entry: ['src/js/app.js!'] })
 * ```
 *
 * @param {object} [options]
 * @param {string} [options.root] - where `sitelo.config.js` lives.
 *   Defaults to the current directory, which is where knip runs from.
 * @param {string | string[]} [options.entry] - extra entry files, on top
 *   of the pages, islands and config file. Suffix one with `!` to mark
 *   it as production code, the way knip does.
 * @returns {Promise<Record<string, unknown>>}
 */
export async function knipConfig({ root = process.cwd(), entry, ...rest } = {}) {
  const resolvedRoot = path.resolve(root)
  const { configFile, options } = await loadSiteloOptions(resolvedRoot)

  /*
   * Patterns are relative to where knip runs, which is normally the site
   * root too; when it is not, every pattern gets the way there prepended.
   * The site's own `root` option moves the pages, not the config file.
   */
  const siteRoot = options.root
    ? path.resolve(resolvedRoot, String(options.root))
    : resolvedRoot
  const base = toPosix(path.relative(process.cwd(), siteRoot))

  const pagesDir = toPosix(String(options.pagesDir ?? DEFAULT_PAGES_DIR))
  const pageExtensions = toArray(options.pageExtensions)
  const include = toArray(options.include)
  const exclude = toArray(options.exclude)

  /*
   * One pattern for every extension rather than one each: knip suggests
   * refining any pattern that matches nothing, and most sites write their
   * pages in one of the eight. Same reason the islands pattern is only
   * added when there is an islands directory.
   */
  const extensions = (pageExtensions.length > 0 ? pageExtensions : DEFAULT_PAGE_EXTENSIONS).map(
    (extension) => String(extension).replace(/^\./, ''),
  )
  const pages =
    include.length > 0
      ? include.map(String)
      : [`${pagesDir}/**/*.${extensions.length === 1 ? extensions[0] : `{${extensions.join(',')}}`}`]
  const islands = fs.existsSync(path.join(siteRoot, pagesDir, 'islands'))
    ? [`${pagesDir}/${ISLAND_MODULES}`]
    : []

  return {
    entry: [
      ...pages.map((pattern) => production(base, pattern)),
      ...exclude.map((pattern) => production(base, `!${pattern}`)),
      ...islands.map((pattern) => production(base, pattern)),
      ...(configFile ? [toPosix(path.relative(process.cwd(), configFile))] : []),
      ...toArray(entry),
    ],
    ...rest,
  }
}
