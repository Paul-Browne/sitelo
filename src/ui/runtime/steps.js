/**
 * Moving a `steps()` flow along.
 *
 * The state is three classes and one `aria-current`: everything before
 * `current` is complete, everything after is still to come. A wizard
 * that advances in the browser has to move all of them together, which
 * is what this does:
 *
 * ```js
 * import { setStep } from 'sitelo/ui/client'
 *
 * setStep('checkout', 2)
 * ```
 *
 * or from an event attribute, the way the components reach their own
 * modules:
 *
 * ```js
 * button({ onclick: "import('/su/steps.js').then(m=>m.set('checkout',2))" }, 'Next')
 * ```
 *
 * Each marker carries both its number and its tick, and the stylesheet
 * shows whichever the step's state calls for — so nothing here has to
 * know how a completed step is drawn.
 */

const STATES = ['su-step--complete', 'su-step--current', 'su-step--upcoming']

/** Resolve a target: an element, an id, or failing that a selector. */
function find(target) {
  if (target == null) return null
  if (typeof target !== 'string') return target

  const byId = document.getElementById(target)

  if (byId) return byId

  try {
    return document.querySelector(target)
  } catch {
    return null
  }
}

/** The steps of one flow, in order. */
function items(target) {
  const node = find(target)

  if (!node) return null

  const list = node.classList?.contains('su-steps') ? node : node.querySelector?.('.su-steps')

  return list ? [...list.querySelectorAll('.su-step')] : null
}

/**
 * Mark step `index` as the one in progress.
 *
 * An index past the last step leaves every step complete, which is what
 * a finished flow looks like.
 *
 * @param {Element | string} target - the flow, or the id of one
 * @param {number} index - zero-based, like the `current` prop
 * @returns {number | null} the index applied, or `null` for no such flow
 */
export function set(target, index) {
  const steps = items(target)

  if (!steps) return null

  const active = Number(index)

  // Same rule the component follows: a value that is not a number is
  // not an index, and step zero is the sensible thing to fall back to.
  const current = Number.isFinite(active) ? Math.max(0, Math.trunc(active)) : 0

  steps.forEach((step, at) => {
    const state = at < current ? 'complete' : at === current ? 'current' : 'upcoming'

    step.classList.remove(...STATES)
    step.classList.add(`su-step--${state}`)

    if (state === 'current') step.setAttribute('aria-current', 'step')
    else step.removeAttribute('aria-current')
  })

  return current
}

/**
 * The index of the step in progress, or the number of steps once they
 * are all complete.
 *
 * @param {Element | string} target
 * @returns {number | null}
 */
export function get(target) {
  const steps = items(target)

  if (!steps) return null

  const at = steps.findIndex((step) => step.classList.contains('su-step--current'))

  return at === -1 ? steps.length : at
}
