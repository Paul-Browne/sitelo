/**
 * Where sitelo-ui's inline event handlers import from.
 *
 * A component that needs a script does not ask the page to load one.
 * It renders the import into the event attribute itself:
 *
 * ```html
 * <button onclick="import('/su/alert.js').then(m=>m.dismiss(this))">
 * ```
 *
 * so the code arrives on the first interaction, only for the components
 * actually on the page, and only if there is an interaction at all. The
 * files under `runtime/` are the other half; sitelo's Vite plugin
 * serves them at {@link uiClientBase} in dev and copies the ones your
 * pages reference into the build.
 */

/** Where the plugin serves `runtime/` from unless told otherwise. */
export const DEFAULT_UI_CLIENT_BASE = '/su/'

/**
 * Every module under `runtime/`, which is what the plugin will serve.
 *
 * Not all of them are things a handler names: `helpers` is imported by
 * the ones that are, and rides along because the plugin follows those
 * imports when it copies.
 */
export const RUNTIME_MODULES = [
  'alert',
  'badge',
  'helpers',
  'menu',
  'pressed',
  'progress',
  'slider',
  'steps',
  'tabs',
  'theme',
  'toast',
]

/** Set by {@link configureUiClient}; falls back to the environment. */
let configured

/**
 * Serve the runtime from somewhere other than `/su/`.
 *
 * Call it once, from a module your pages import, when the site is
 * deployed under a sub-path or the runtime lives on a CDN. Passing the
 * same value as the plugin's `uiClient.base` option is equivalent —
 * that sets `SITELO_UI_BASE`, which this reads.
 *
 * ```js
 * configureUiClient({ base: '/assets/su/' })
 * ```
 *
 * @param {{ base?: string | null }} [options]
 */
export function configureUiClient({ base } = {}) {
  configured = base == null ? undefined : String(base)

  /*
   * Pages are loaded in their own module graph, so `configured` is not
   * the copy the Vite plugin reads. The environment is what both halves
   * share — setting it here is what makes the plugin serve and copy the
   * modules to wherever the pages have decided to point.
   */
  if (configured === undefined) delete process.env.SITELO_UI_BASE
  else process.env.SITELO_UI_BASE = configured
}

/**
 * The base every handler imports from, with a trailing slash.
 * @returns {string}
 */
export function uiClientBase() {
  const base = configured ?? process.env.SITELO_UI_BASE ?? DEFAULT_UI_CLIENT_BASE

  return base.endsWith('/') ? base : `${base}/`
}

/**
 * The body of an inline event attribute.
 *
 * ```js
 * handler('alert', 'dismiss(this)')
 * // "import('/su/alert.js').then(m=>m.dismiss(this))"
 * ```
 *
 * The URL is single-quoted because javascript-to-html writes attribute
 * values in double quotes, so an apostrophe in a configured base — a
 * path nobody should have, but paths are user input — would otherwise
 * end the string and not the attribute.
 *
 * @param {string} module - a name from {@link RUNTIME_MODULES}
 * @param {string} call - the export to call, with its arguments
 * @returns {string}
 */
export function handler(module, call) {
  const url = `${uiClientBase()}${module}.js`.replaceAll('\\', '\\\\').replaceAll("'", "\\'")

  return `import('${url}').then(m=>m.${call})`
}

/**
 * Keys the tablist handles, tested in the attribute so that
 * `preventDefault()` happens before the module has loaded.
 *
 * Awaiting the import first would let ArrowDown scroll the page out
 * from under the tab it is about to move focus to.
 */
const TABLIST_KEYS = "/^(Arrow(Left|Right|Up|Down)|Home|End)$/"

/** The `onkeydown` for a tablist: roving focus, without the scroll. */
export function tablistKeydown() {
  return `if(${TABLIST_KEYS}.test(event.key)){event.preventDefault();${handler('tabs', 'key(event.target,event.key)')}}`
}
