import { readFileSync } from 'node:fs'
import { style } from 'javascript-to-html'

const CSS_URL = new URL('./ui.css', import.meta.url)

/** Cache keyed by whether the sheet was minified — reads once per build. */
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
 * file in `public/`, an existing bundle — than inline it. Most pages
 * want {@link styles} instead.
 *
 * @param {object} [options]
 * @param {boolean} [options.minify=true]
 * @returns {string}
 */
export function stylesheet({ minify = true } = {}) {
  const key = minify ? 'min' : 'raw'

  if (!cache.has(key)) {
    const source = readFileSync(CSS_URL, 'utf8')
    cache.set(key, minify ? minifyCss(source) : source)
  }

  return cache.get(key)
}

/**
 * The stylesheet as a `<style>` element, for dropping straight into
 * `head()`.
 *
 * Inline rather than linked on purpose: it is a single small sheet, it
 * cannot go missing from `dist`, and it costs no extra request on a
 * static page. If you would rather link it, import
 * `sitelo/ui/styles.css` from a bundled entry file instead and let Vite
 * emit it.
 *
 * @param {object} [options]
 * @param {boolean} [options.minify=true]
 * @param {string} [options.nonce] - CSP nonce, if your host sets one.
 * @returns {string}
 */
export function styles({ minify = true, nonce } = {}) {
  return style(
    { 'data-sitelo-ui': '', ...(nonce ? { nonce } : {}) },
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
 * @param {object} [options]
 * @param {string} [options.nonce]
 * @returns {string}
 */
export function themeScript({ nonce } = {}) {
  const source =
    "(function(){try{var t=localStorage.getItem('sitelo-ui-theme');" +
    "if(t==='light'||t==='dark')document.documentElement.setAttribute('data-su-theme',t)}catch(e){}})()"

  return `<script${nonce ? ` nonce="${nonce}"` : ''}>${source}</script>`
}
