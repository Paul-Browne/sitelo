/**
 * When to start work tied to an element. Shared by the two browser
 * loaders: `sitelo/islands/client` fetching a server island, and
 * `sitelo/enhance/client` importing an enhancement's module.
 *
 * Both read the same attributes, `data-sitelo-when` and
 * `data-sitelo-root-margin`, which `island()` and `enhance()` write the
 * same way.
 */

/** Start `when: 'visible'` work slightly before the element scrolls in. */
export const DEFAULT_ROOT_MARGIN = '200px'

/**
 * Dispatched on an island's element, bubbling, once its HTML is in the
 * page. `mountEnhancements()` listens for it, so an enhancement rendered
 * inside a server island is wired up when it arrives.
 */
export const ISLAND_LOAD_EVENT = 'sitelo:island-load'

/** @param {() => void} callback */
function requestIdle(callback) {
  if (typeof requestIdleCallback === 'function') {
    requestIdleCallback(callback, { timeout: 2000 })
  } else {
    setTimeout(callback, 1)
  }
}

/**
 * Call `run` when the element's `data-sitelo-when` says to.
 *
 * Returns what `run` returns if it ran straight away, and `null` if it
 * was deferred. Callers should not wait for deferred work, which might
 * not happen until the reader scrolls.
 *
 * @template T
 * @param {Element} element
 * @param {string} rootMargin - Default margin for `visible`. The
 *   element's own `data-sitelo-root-margin` wins.
 * @param {() => T} run
 * @returns {T | null}
 */
export function whenDue(element, rootMargin, run) {
  const when = element.getAttribute('data-sitelo-when') ?? 'load'

  if (when === 'idle') {
    requestIdle(run)
    return null
  }

  if (when === 'visible') {
    // No IntersectionObserver (or no layout to observe): run it now
    // rather than never.
    if (typeof IntersectionObserver === 'undefined') return run()

    const observer = new IntersectionObserver(
      (entries) => {
        // One batch can report the element more than once. Run it once.
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        run()
      },
      {
        rootMargin:
          element.getAttribute('data-sitelo-root-margin') ?? rootMargin,
      },
    )

    observer.observe(element)
    return null
  }

  return run()
}
