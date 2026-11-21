/**
 * Browser loader for sitelo server islands.
 *
 * Finds `[data-sitelo-island]` placeholders (emitted by `island()` from
 * `sitelo/islands`), fetches each rendered fragment from the islands
 * endpoint, and swaps the HTML in place. The placeholder's fallback
 * content stays visible until the fragment arrives, and is kept if the
 * request fails.
 */

import {
  DEFAULT_ROOT_MARGIN,
  ISLAND_LOAD_EVENT,
  whenDue,
} from './client-schedule.js'

export { ISLAND_LOAD_EVENT }

export const DEFAULT_ISLANDS_ENDPOINT = '/_sitelo/islands'

/** Give up on an island that never responds. */
const DEFAULT_TIMEOUT_MS = 10_000

/**
 * Abort signal that fires after `ms`, without assuming
 * `AbortSignal.timeout` exists.
 */
function timeoutSignal(ms) {
  if (!ms) return undefined

  if (typeof AbortSignal !== 'undefined' && AbortSignal.timeout) {
    return AbortSignal.timeout(ms)
  }

  if (typeof AbortController === 'undefined') return undefined

  const controller = new AbortController()
  setTimeout(() => controller.abort(), ms)
  return controller.signal
}

async function loadIsland(element, { endpoint, onError, timeout }) {
  const name = element.getAttribute('data-sitelo-island')
  const props = element.getAttribute('data-sitelo-props')
  const signature = element.getAttribute('data-sitelo-sig')

  element.setAttribute('data-sitelo-island-state', 'loading')

  const query = new URLSearchParams()
  if (props) query.set('props', props)
  if (signature) query.set('sig', signature)

  const search = query.toString()

  try {
    const response = await fetch(
      `${endpoint}/${name}${search ? `?${search}` : ''}`,
      {
        headers: { Accept: 'text/html' },
        signal: timeoutSignal(timeout),
      },
    )

    if (!response.ok) {
      throw new Error(`island "${name}" responded ${response.status}`)
    }

    element.innerHTML = await response.text()
    element.setAttribute('data-sitelo-island-state', 'loaded')
    announceLoad(element)
  } catch (error) {
    element.setAttribute('data-sitelo-island-state', 'error')
    if (onError) {
      onError(error, element)
    } else {
      console.error('[sitelo] island failed to load:', error)
    }
  }
}

/**
 * Tell the page an island's HTML is in, so code that wires up markup,
 * `mountEnhancements()` included, can reach what just arrived.
 */
function announceLoad(element) {
  if (typeof CustomEvent !== 'function') return
  if (typeof element.dispatchEvent !== 'function') return

  element.dispatchEvent(new CustomEvent(ISLAND_LOAD_EVENT, { bubbles: true }))
}

/**
 * Load every island placeholder under `root`.
 *
 * The returned promise settles once the islands that load immediately
 * have finished. Islands marked `when: 'idle'` or `when: 'visible'` load
 * later on their own schedule and are deliberately not awaited.
 *
 * @param {object} [options]
 * @param {string} [options.endpoint] - Islands endpoint base path/URL.
 * @param {ParentNode} [options.root] - Where to look for placeholders.
 * @param {(error: unknown, element: Element) => void} [options.onError]
 * @param {number} [options.timeout] - Per-island timeout in ms. Default
 *   10000; `0` disables it.
 * @param {string} [options.rootMargin] - Default IntersectionObserver
 *   margin for `when: 'visible'` islands. Default `'200px'`.
 * @returns {Promise<void>}
 */
export async function mountIslands({
  endpoint = DEFAULT_ISLANDS_ENDPOINT,
  root = document,
  onError,
  timeout = DEFAULT_TIMEOUT_MS,
  rootMargin = DEFAULT_ROOT_MARGIN,
} = {}) {
  const context = {
    endpoint: endpoint.replace(/\/+$/, ''),
    onError,
    timeout,
    rootMargin,
  }

  const elements = root.querySelectorAll(
    '[data-sitelo-island]:not([data-sitelo-island-state])',
  )

  const pending = []

  for (const element of elements) {
    const promise = whenDue(element, context.rootMargin, () =>
      loadIsland(element, context),
    )
    if (promise) pending.push(promise)
  }

  await Promise.all(pending)
}
