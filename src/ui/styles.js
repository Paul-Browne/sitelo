import { createHash } from 'node:crypto'
import { readFileSync, statSync } from 'node:fs'
import { link, style } from 'javascript-to-html'

import { uiClientBase } from './handlers.js'

const CSS_URL = new URL('./ui.css', import.meta.url)

/**
 * Cache keyed by minified-or-not *and* the file's modification time.
 *
 * A build renders hundreds of pages in one process and should read the
 * sheet once; a dev server is one process that outlives edits to it.
 * Keying on mtime satisfies both — a `stat` per call, and a re-read only
 * when the file has actually changed.
 */
const cache = new Map()

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
function minifyCss(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{};,])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim()
}

/**
 * The sitelo-ui stylesheet as a string.
 *
 * Use this when you would rather write the CSS somewhere yourself — a
 * file in `public/`, an existing bundle — than have sitelo emit it.
 * Most pages want {@link styles} instead.
 *
 * @param {object} [options]
 * @param {boolean} [options.minify=true]
 * @returns {string}
 */
export function stylesheet({ minify = true } = {}) {
  const stamp = statSync(CSS_URL).mtimeMs
  const key = `${minify ? 'min' : 'raw'}:${stamp}`

  if (!cache.has(key)) {
    const source = readFileSync(CSS_URL, 'utf8')

    // Entries for older revisions can never be hit again.
    for (const stale of cache.keys()) {
      if (!stale.endsWith(`:${stamp}`)) cache.delete(stale)
    }

    cache.set(key, minify ? minifyCss(source) : source)
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
 * @param {boolean} [options.hash=true] - false for a plain `ui.css`,
 *   when something else already versions the URL.
 * @returns {string}
 */
function fileName({ hash = true } = {}) {
  if (!hash) return 'ui.css'

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

  return `ui-${digest.value}.css`
}

/** Memoised {@link fileName} digest, keyed on the string it describes. */
const digest = { css: null, value: '' }

/**
 * The URL the stylesheet is served from.
 *
 * What {@link styles} puts in its `href`, on its own — for a `<link>`
 * of your own carrying `media` or `integrity`, a `rel="preload"` hint, a
 * `style-src` in a CSP, a service worker's precache list.
 *
 * @param {object} [options]
 * @param {string} [options.base]
 * @param {boolean} [options.hash=true]
 * @returns {string}
 */
export function stylesUrl({ base, hash = true } = {}) {
  const root = base ?? uiClientBase()

  return `${root.endsWith('/') ? root : `${root}/`}${fileName({ hash })}`
}

/**
 * The stylesheet, ready to drop into `head()`.
 *
 * ```js
 * head(title('My site'), styles())
 * // <link rel="stylesheet" href="/su/ui-c9428b65.css">
 * ```
 *
 * A `<link>` by default: one file the browser caches across every page
 * of the site. There is nothing to configure and nothing to copy —
 * sitelo's plugin serves it in dev and writes it into the build, at the
 * same base as the component runtime, so `configureUiClient({ base })`
 * moves both together.
 *
 * `inline` puts the whole sheet in a `<style>` instead. That costs no
 * round trip and cannot go missing from `dist`, which is the better
 * trade for a single page; the link buys its request back on the second
 * page a visitor reads, which is most sites.
 *
 * @param {object} [options]
 * @param {boolean} [options.inline=false] - emit the CSS itself rather
 *   than a link to it.
 * @param {string} [options.base] - point the link somewhere else. Only
 *   the runtime's base is one the plugin writes to, so a copy at any
 *   other is yours to put there, with {@link stylesheet} for the bytes.
 *   Linked only.
 * @param {boolean} [options.hash=true] - linked only.
 * @param {boolean} [options.minify=true] - inline only.
 * @param {string} [options.nonce] - CSP nonce, if your host sets one.
 * @returns {string}
 * @see {@link stylesUrl} for the href alone.
 */
export function styles({
  inline = false,
  base,
  hash = true,
  minify = true,
  nonce,
} = {}) {
  const attributes = nonce ? { nonce } : {}

  if (!inline) {
    return link({
      rel: 'stylesheet',
      href: stylesUrl({ base, hash }),
      ...attributes,
    })
  }

  return style(
    { 'data-sitelo-ui': '', ...attributes },
    stylesheet({ minify }),
  )
}

/**
 * A token value can carry no markup — everything here ends up inside a
 * `<style>`, where an unescaped `<` would end the element early.
 *
 * @param {unknown} value
 * @returns {string}
 */
function tokenValue(value) {
  return String(value).replace(/[<>]/g, '')
}

/**
 * Flatten `{ primary: { base, hover } }` into `--su-primary` and
 * `--su-primary-hover`, and `{ radiusMd: x }` into `--su-radius-md`.
 *
 * A key already starting with `--` is used exactly as written, which is
 * the escape hatch for anything this mapping does not cover.
 *
 * @param {Record<string, unknown>} tokens
 * @param {string} [prefix]
 * @returns {string[]}
 */
function declarations(tokens, prefix = '') {
  const out = []

  for (const [key, value] of Object.entries(tokens)) {
    if (value == null) continue

    const name = key.startsWith('--')
      ? key
      : `--su-${prefix}${key.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}`

    if (typeof value === 'object' && !Array.isArray(value)) {
      const { base, ...rest } = /** @type {Record<string, unknown>} */ (value)

      if (base != null) out.push(`${name}: ${tokenValue(base)}`)
      out.push(...declarations(rest, `${name.slice('--su-'.length)}-`))
      continue
    }

    out.push(`${name}: ${tokenValue(value)}`)
  }

  return out
}

/**
 * Override design tokens.
 *
 * ```js
 * theme({
 *   primary: { base: '#5b5bd6', hover: '#4a4ac4', fg: '#fff' },
 *   radiusMd: '2px',
 *   fontSans: '"Inter", system-ui, sans-serif',
 * })
 * ```
 *
 * Emit it after {@link styles} so the overrides win, and pass `dark`
 * for values that should only apply once the dark tokens are in play.
 *
 * @param {Record<string, unknown>} [tokens]
 * @param {object} [options]
 * @param {string} [options.selector=':root'] - Scope the overrides to a
 *   subtree, e.g. `'.marketing'`.
 * @param {Record<string, unknown>} [options.dark] - Overrides applied
 *   only in dark mode.
 * @param {string} [options.nonce]
 * @returns {string}
 */
export function theme(tokens = {}, { selector = ':root', dark, nonce } = {}) {
  const blocks = []
  const light = declarations(tokens)

  if (light.length) blocks.push(`${selector}{${light.join(';')}}`)

  if (dark) {
    const darkDecls = declarations(dark)

    if (darkDecls.length) {
      const body = `{${darkDecls.join(';')}}`
      const scope = selector === ':root' ? '' : `${selector} `

      blocks.push(
        `${scope}[data-theme='dark']${body}`,
        `${scope}[data-su-theme='dark']${body}`,
        `@media (prefers-color-scheme: dark){${selector}:not([data-theme='light']):not([data-su-theme='light'])${body}}`,
      )
    }
  }

  if (!blocks.length) return ''

  return style(
    { 'data-sitelo-ui-theme': '', ...(nonce ? { nonce } : {}) },
    blocks.join(''),
  )
}

/**
 * Blocking inline script that applies a stored theme choice before the
 * first paint.
 *
 * Put it in `head()` if you use {@link themeToggle}: without it a
 * visitor who chose light sees a dark flash on every navigation, because
 * the choice lives in `localStorage` and the server cannot read it.
 *
 * It also marks the toggles `aria-pressed` once the body has parsed —
 * the flip itself is handled by the button's own inline import, but
 * nothing has been pressed yet on a fresh page load, and a toggle that
 * announces the wrong state until you use it is worse than the ~150
 * bytes this costs.
 *
 * @param {object} [options]
 * @param {string} [options.nonce]
 * @returns {string}
 */
export function themeScript({ nonce } = {}) {
  const source =
    "(function(){var d=document,r=d.documentElement;" +
    "try{var t=localStorage.getItem('sitelo-ui-theme');" +
    "if(t==='light'||t==='dark')r.setAttribute('data-su-theme',t)}catch(e){}" +
    "function p(){var v=r.getAttribute('data-su-theme')||r.getAttribute('data-theme');" +
    "if(v!=='light'&&v!=='dark')v=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';" +
    "for(var b of d.querySelectorAll('[data-su-theme-toggle]'))" +
    "b.setAttribute('aria-pressed',v==='dark')}" +
    "d.readyState==='loading'?d.addEventListener('DOMContentLoaded',p,{once:true}):p()})()"

  return `<script${nonce ? ` nonce="${nonce}"` : ''}>${source}</script>`
}
