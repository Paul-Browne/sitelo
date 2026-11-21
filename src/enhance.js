import { escapeHtml } from './page.js'

/** The same names `island()` accepts. A name is not a path. */
const NAME_PATTERN = /^[A-Za-z0-9][A-Za-z0-9_-]*$/

/** Loading strategies understood by `sitelo/enhance/client`. */
const LOADING_STRATEGIES = new Set(['load', 'idle', 'visible'])

/**
 * Mark a region of a page for a browser module to enhance.
 *
 * The page renders `html` as usual. It is complete without JavaScript.
 * In the browser, `mountEnhancements()` from `sitelo/enhance/client`
 * imports the module registered under `name`, when `when` says to, and
 * calls its default export with the wrapper element and `props`.
 *
 * There is no hydration and no framework runtime: the module gets the
 * DOM the server rendered and adds behaviour to it.
 *
 * Props are written into the page as JSON and read back in the browser.
 * Unlike island props they never travel back to a server, so they are
 * not signed. Keep secrets out of them all the same: they are in the
 * page source.
 *
 * @param {string} name - Key of the module in `mountEnhancements()`.
 * @param {Record<string, unknown>} [props] - JSON-serializable props.
 * @param {string} [html] - Markup to render inside the wrapper.
 * @param {object} [options]
 * @param {'load' | 'idle' | 'visible'} [options.when] - When the module
 *   is imported. `load` (default) as soon as the page loads, `idle` on an
 *   idle callback, `visible` when the wrapper scrolls into view.
 * @param {string} [options.rootMargin] - IntersectionObserver margin for
 *   `when: 'visible'`, e.g. `'400px'` to start loading early.
 * @returns {string}
 */
export function enhance(name, props = {}, html = '', options = {}) {
  if (typeof name !== 'string' || !NAME_PATTERN.test(name)) {
    throw new Error(
      `Invalid enhancement name "${name}". Use letters, digits, "-" or "_" (must start with a letter or digit).`,
    )
  }

  const { when = 'load', rootMargin } = options

  if (!LOADING_STRATEGIES.has(when)) {
    throw new Error(
      `Invalid enhancement loading strategy "${when}" for "${name}". Use 'load', 'idle', or 'visible'.`,
    )
  }

  if (rootMargin != null && typeof rootMargin !== 'string') {
    throw new Error(
      `Enhancement "${name}" rootMargin must be a string, e.g. '400px'.`,
    )
  }

  const json = JSON.stringify(props ?? {})

  let attributes = ''

  if (json && json !== '{}') {
    attributes += ` data-sitelo-props="${escapeHtml(json)}"`
  }

  if (when !== 'load') attributes += ` data-sitelo-when="${when}"`

  if (rootMargin && when === 'visible') {
    attributes += ` data-sitelo-root-margin="${escapeHtml(rootMargin)}"`
  }

  return `<div data-sitelo-enhance="${name}"${attributes}>${html}</div>`
}
