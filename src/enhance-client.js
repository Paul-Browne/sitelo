/**
 * Browser loader for sitelo enhancements.
 *
 * Finds the `[data-sitelo-enhance]` wrappers that `enhance()` from
 * `sitelo/enhance` writes into a page. For each one it imports the
 * module registered under that name and calls the module's default
 * export with the element and its props.
 *
 * The map of names to modules is written by hand in a script the page
 * links:
 *
 *     mountEnhancements({ counter: () => import('./client/counter.js') })
 *
 * Each `import()` is a dynamic import, so the build gives every module
 * its own chunk and the browser fetches one only when a page uses it.
 */

import {
  DEFAULT_ROOT_MARGIN,
  ISLAND_LOAD_EVENT,
  whenDue,
} from './client-schedule.js'

const STATE = 'data-sitelo-enhance-state'

/**
 * Wrappers that have not been scheduled yet. Each one gets a state the
 * moment it is scheduled, so calling `mountEnhancements()` again never
 * runs a module on the same element twice.
 */
const UNMOUNTED = `[data-sitelo-enhance]:not([${STATE}])`

/**
 * The function a registered module provides. A loader may resolve to the
 * module (its `default` export) or to the function itself.
 */
function enhancerFrom(loaded) {
  if (typeof loaded === 'function') return loaded

  return typeof loaded?.default === 'function' ? loaded.default : null
}

async function runEnhancement(element, { modules, onError }) {
  const name = element.getAttribute('data-sitelo-enhance')

  element.setAttribute(STATE, 'loading')

  try {
    // Own keys only: a page that says `__proto__` gets an error, not
    // Object.prototype.
    const load = Object.hasOwn(modules, name) ? modules[name] : undefined

    if (typeof load !== 'function') {
      throw new Error(
        `No module registered for enhancement "${name}". Add it to mountEnhancements({ '${name}': () => import('./…') }).`,
      )
    }

    const enhancer = enhancerFrom(await load())

    if (!enhancer) {
      throw new Error(
        `The module for enhancement "${name}" has no default export function.`,
      )
    }

    const props = element.getAttribute('data-sitelo-props')

    await enhancer(element, props ? JSON.parse(props) : {})
    element.setAttribute(STATE, 'ready')
  } catch (error) {
    element.setAttribute(STATE, 'error')

    if (onError) {
      onError(error, element)
    } else {
      console.error('[sitelo] enhancement failed:', error)
    }
  }
}

/** Schedule every unmounted wrapper under `root`; the immediate ones' promises. */
function mountWithin(root, context) {
  const pending = []

  for (const element of root.querySelectorAll(UNMOUNTED)) {
    element.setAttribute(STATE, 'pending')

    const promise = whenDue(element, context.rootMargin, () =>
      runEnhancement(element, context),
    )

    if (promise) pending.push(promise)
  }

  return pending
}

/**
 * Run the registered module for every enhancement under `root`.
 *
 * The returned promise settles once the enhancements that run straight
 * away are done. Those marked `when: 'idle'` or `when: 'visible'` run
 * later and are deliberately not awaited.
 *
 * Enhancements inside a server island are mounted when the island's
 * HTML arrives, so one call covers those too.
 *
 * @param {Record<string, () => unknown>} modules - Enhancement name to a
 *   function that loads its module, usually `() => import('./x.js')`.
 * @param {object} [options]
 * @param {ParentNode} [options.root] - Where to look. Default `document`.
 * @param {(error: unknown, element: Element) => void} [options.onError]
 *   Called for each enhancement that fails to load or throws.
 * @param {string} [options.rootMargin] - Default IntersectionObserver
 *   margin for `when: 'visible'`. Default `'200px'`.
 * @returns {Promise<void>}
 */
export async function mountEnhancements(
  modules,
  { root = document, onError, rootMargin = DEFAULT_ROOT_MARGIN } = {},
) {
  if (!modules || typeof modules !== 'object') {
    throw new TypeError(
      "mountEnhancements() takes a map of names to loaders, e.g. { counter: () => import('./client/counter.js') }.",
    )
  }

  const context = { modules, onError, rootMargin }

  if (typeof root.addEventListener === 'function') {
    root.addEventListener(ISLAND_LOAD_EVENT, (event) => {
      if (event.target && 'querySelectorAll' in event.target) {
        mountWithin(/** @type {ParentNode} */ (event.target), context)
      }
    })
  }

  await Promise.all(mountWithin(root, context))
}
