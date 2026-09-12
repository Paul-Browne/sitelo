/**
 * One stylesheet, served the way `styles()` serves sitelo-ui's own.
 *
 * `ui.css` is the core sheet, and every page links it. The extras under
 * `sitelo/ui-extras` each carry a sheet of their own — `grain.css` for
 * `grain()` — so a page pays only for the components it uses. All of
 * them are read, hashed, linked and copied by the same code, which is
 * what lives here; `styles.js` and each extra bind it to their file.
 *
 * Internal: nothing here is exported from `sitelo/ui`.
 */

import { createHash } from 'node:crypto'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { link, style } from 'javascript-to-html'

import { uiClientBase } from './handlers.js'

const CORE = new URL('./ui.css', import.meta.url)
const EXTRAS = new URL('../ui-extras/', import.meta.url)

/** A sheet is named the way its file is, before the hash. */
const NAME = /^[a-z][a-z0-9-]*$/

/**
 * Where the sheet called `name` lives, or `null` if there is none.
 *
 * `ui` is the core sheet; anything else is one of the extras, and only
 * if a file by that name is actually there — the name comes off a URL
 * the plugin is answering, and this is what keeps it off the rest of
 * the disk.
 *
 * @param {string} name
 * @returns {URL | null}
 */
export function sheetSource(name) {
  if (name === 'ui') return CORE
  if (!NAME.test(name)) return null

  const url = new URL(`${name}.css`, EXTRAS)

  return existsSync(url) ? url : null
}

/**
 * A deliberately conservative minifier: comments out, whitespace
 * collapsed, and the padding around braces, semicolons and commas
 * removed. It never touches the space after a colon, because that space
 * is load-bearing inside selectors, and the handful of bytes it would
 * save is not worth a rule that silently stops matching.
 *
 * @param {string} css
 * @returns {string}
 */
export function minifyCss(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{};,])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim()
}

/**
 * The three functions a sheet is used through, bound to one file.
 *
 * @param {string} name - what the file is served as, before the hash
 * @param {URL} source - the CSS on disk
 */
export function createSheet(name, source) {
  /**
   * Cache keyed by minified-or-not *and* the file's modification time.
   *
   * A build renders hundreds of pages in one process and should read the
   * sheet once; a dev server is one process that outlives edits to it.
   * Keying on mtime satisfies both — a `stat` per call, and a re-read only
   * when the file has actually changed.
   */
  const cache = new Map()

  /** Memoised {@link fileName} digest, keyed on the string it describes. */
  const digest = { css: null, value: '' }

  /**
   * The sheet as a string.
   *
   * @param {object} [options]
   * @param {boolean} [options.minify=true]
   * @returns {string}
   */
  function stylesheet({ minify = true } = {}) {
    const stamp = statSync(source).mtimeMs
    const key = `${minify ? 'min' : 'raw'}:${stamp}`

    if (!cache.has(key)) {
      const css = readFileSync(source, 'utf8')

      // Entries for older revisions can never be hit again.
      for (const stale of cache.keys()) {
        if (!stale.endsWith(`:${stamp}`)) cache.delete(stale)
      }

      cache.set(key, minify ? minifyCss(css) : css)
    }

    return cache.get(key)
  }

  /**
   * The file name the sheet is served under.
   *
   * The hash is of the bytes {@link stylesheet} returns, so the file it
   * names can be served `immutable` and still change when the package
   * does.
   *
   * @param {object} [options]
   * @param {boolean} [options.hash=true] - false for a plain `<name>.css`,
   *   when something else already versions the URL.
   * @returns {string}
   */
  function fileName({ hash = true } = {}) {
    if (!hash) return `${name}.css`

    const css = stylesheet()

    /*
     * `stylesheet()` hands back its cached string, so the identity check
     * is enough to know the digest still describes it — and it keeps a
     * build of a few hundred pages to one hash rather than one per page.
     */
    if (css !== digest.css) {
      digest.css = css
      digest.value = createHash('sha256').update(css).digest('hex').slice(0, 8)
    }

    return `${name}-${digest.value}.css`
  }

  /**
   * The URL the sheet is served from.
   *
   * @param {object} [options]
   * @param {string} [options.base]
   * @param {boolean} [options.hash=true]
   * @returns {string}
   */
  function stylesUrl({ base, hash = true } = {}) {
    const root = base ?? uiClientBase()

    return `${root.endsWith('/') ? root : `${root}/`}${fileName({ hash })}`
  }

  /**
   * The sheet, ready to drop into `head()`: a `<link>` sitelo's plugin
   * serves in dev and writes into the build, or the CSS itself with
   * `inline`.
   *
   * @param {object} [options]
   * @param {boolean} [options.inline=false]
   * @param {string} [options.base] - linked only.
   * @param {boolean} [options.hash=true] - linked only.
   * @param {boolean} [options.minify=true] - inline only.
   * @param {string} [options.nonce] - CSP nonce, if your host sets one.
   * @returns {string}
   */
  function styles({ inline = false, base, hash = true, minify = true, nonce } = {}) {
    const attributes = nonce ? { nonce } : {}

    if (!inline) {
      return link({
        rel: 'stylesheet',
        href: stylesUrl({ base, hash }),
        ...attributes,
      })
    }

    // `data-sitelo-ui` for the core sheet, `data-sitelo-ui-grain` for an
    // extra: one marker per sheet, so a page can find each one it inlined.
    return style(
      { [name === 'ui' ? 'data-sitelo-ui' : `data-sitelo-ui-${name}`]: '', ...attributes },
      stylesheet({ minify }),
    )
  }

  return { stylesheet, stylesUrl, styles }
}

/** One {@link createSheet} per name, so every caller shares a cache. */
const sheets = new Map()

/**
 * The sheet called `name`, or `null` if there is none — what the plugin
 * reaches for when a page asks for `/su/<name>-<hash>.css`.
 *
 * @param {string} name
 * @returns {ReturnType<typeof createSheet> | null}
 */
export function sheetNamed(name) {
  if (!sheets.has(name)) {
    const source = sheetSource(name)

    if (!source) return null

    sheets.set(name, createSheet(name, source))
  }

  return sheets.get(name)
}
