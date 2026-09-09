/**
 * The few things every runtime module that takes a target needs.
 *
 * Unlike its neighbours this one is never named by an event attribute —
 * nothing imports it from a page. It is imported by the modules that
 * are, and sitelo's Vite plugin follows those imports when it decides
 * what to copy into a build, so it lands beside them without anything
 * having to list it.
 *
 * The cost of sharing rather than repeating is one more request the
 * first time a handler runs: the browser fetches `badge.js`, sees this
 * import, and fetches it too. Both are a few hundred bytes and both are
 * then cached for every other component on the page.
 */

/**
 * Resolve a target: an element, an id, or failing that a selector.
 *
 * `set('upload')`, `set('#upload')` and `set(element)` are all things a
 * caller will reasonably write, so all three work.
 *
 * @param {Element | string | null | undefined} target
 * @returns {Element | null}
 */
export function find(target) {
  if (target == null) return null
  if (typeof target !== 'string') return target

  const byId = document.getElementById(target)

  if (byId) return byId

  /*
   * A string that is neither an id nor valid selector syntax throws
   * rather than returning null, so the fallback has to be guarded.
   */
  try {
    return document.querySelector(target)
  } catch {
    return null
  }
}

/**
 * The element carrying `className` — the target itself, or the one
 * inside it.
 *
 * Every component here can be aimed at either way: at the wrapper the
 * `id` landed on, or at the part that holds the state.
 *
 * @param {Element | string} target
 * @param {string} className - without the leading dot
 * @returns {Element | null}
 */
export function part(target, className) {
  const node = find(target)

  if (!node) return null

  return node.classList?.contains(className)
    ? node
    : (node.querySelector?.(`.${className}`) ?? null)
}

/**
 * The scale to measure against: what this call said, what an earlier one
 * wrote into the markup, what the server announced, and finally the
 * default.
 *
 * Anything that is not a positive finite number is not a scale, and is
 * skipped rather than propagated — a `NaN` maximum silently produced
 * `NaN%` widths and `aria-valuemax="NaN"` before this was checked.
 *
 * @param {unknown} explicit - the value passed to this call
 * @param {unknown[]} recorded - attribute values, most trusted first
 * @param {number} fallback
 * @returns {number}
 */
export function limit(explicit, recorded, fallback) {
  for (const candidate of [explicit, ...recorded]) {
    const numeric = Number(candidate)

    if (candidate != null && candidate !== '' && Number.isFinite(numeric) && numeric > 0) {
      return numeric
    }
  }

  return fallback
}
