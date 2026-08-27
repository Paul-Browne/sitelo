/**
 * Browser loader for sitelo server islands.
 *
 * Finds `[data-sitelo-island]` placeholders (emitted by `island()` from
 * `sitelo/islands`), fetches each rendered fragment from the islands
 * endpoint, and swaps the HTML in place. The placeholder's fallback
 * content stays visible until the fragment arrives, and is kept if the
 * request fails.
 */

export const DEFAULT_ISLANDS_ENDPOINT = '/_sitelo/islands'

/** Give up on an island that never responds. */
const DEFAULT_TIMEOUT_MS = 10_000

/** Start loading `when: 'visible'` islands slightly before they scroll in. */
const DEFAULT_ROOT_MARGIN = '200px'

function requestIdle(callback) {
  if (typeof requestIdleCallback === 'function') {
    return requestIdleCallback(callback, { timeout: 2000 })
  }

  return setTimeout(callback, 1)
}

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
 * Wire up one placeholder according to its `data-sitelo-when` strategy.
 *
 * Returns a promise for islands that load straight away, and `null` for
 * deferred ones — the caller should not wait on something that may not
 * happen until the reader scrolls.
 */
function scheduleIsland(element, context) {
  const when = element.getAttribute('data-sitelo-when') ?? 'load'

  if (when === 'idle') {
    requestIdle(() => loadIsland(element, context))
    return null
  }

  if (when === 'visible') {
    // No IntersectionObserver (or no layout to observe): load it now
    // rather than never.
    if (typeof IntersectionObserver === 'undefined') {
      return loadIsland(element, context)
    }

    const rootMargin =
      element.getAttribute('data-sitelo-root-margin') ?? context.rootMargin

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          observer.disconnect()
          loadIsland(element, context)
        }
      },
      { rootMargin },
    )

    observer.observe(element)
    return null
  }

  return loadIsland(element, context)
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
    const promise = scheduleIsland(element, context)
    if (promise) pending.push(promise)
  }

  await Promise.all(pending)
}
