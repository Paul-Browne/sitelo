/**
 * A slider's `<output>`, and moving the slider from your own code.
 *
 * `slider({ showValue: true })` renders the number the page was built
 * with and wires `sync` into its own `oninput`, so the output follows
 * the thumb without the page importing anything. With the module never
 * fetched the number is simply the one the server rendered, which is
 * the state a slider with no script was always in.
 *
 * `set` is the other half — the one a page drives rather than a drag:
 *
 * ```js
 * import { setSlider } from 'sitelo/ui/client'
 *
 * setSlider('volume', 50)
 * ```
 *
 * or straight from an event attribute, the way the components reach
 * their own modules:
 *
 * ```js
 * button({ onclick: "import('/su/slider.js').then(m=>m.set('volume',50))" }, 'Half')
 * ```
 *
 * Give the slider an `id` — it falls through to the input like any
 * other attribute — and that id is the handle both of them take.
 */

import { part } from './helpers.js'

/**
 * Copy the input's value into the output beside it.
 *
 * @param {HTMLInputElement} input
 */
export function sync(input) {
  const output = input.parentElement?.querySelector('.su-slider-output')

  // `<output>.value` is the text, but assigning textContent works on
  // the same node without depending on the element interface.
  if (output) output.textContent = input.value
}

/**
 * Move a slider to `value`.
 *
 * What lands is the browser's business: a number outside `min` and
 * `max` is clamped, and one off the `step` grid snaps onto it. So what
 * comes back is where the slider ended up, not what it was handed.
 *
 * @param {Element | string} target - the slider, or the id of one
 * @param {number} value
 * @returns {number | null} the value it took, or `null` for no such slider
 */
export function set(target, value) {
  const input = part(target, 'su-slider')
  const numeric = Number(value)

  if (!input || value == null || !Number.isFinite(numeric)) return null

  input.value = String(numeric)
  sync(input)

  /*
   * Assigning `value` changes nothing else on the page: a preview
   * listening for `input`, or a form watching for `change`, would go on
   * showing the old number. A move nobody can hear is worse than no
   * setter, so this says out loud what a drag would have.
   */
  for (const type of ['input', 'change']) {
    input.dispatchEvent?.(new Event(type, { bubbles: true }))
  }

  return get(input)
}

/**
 * Where a slider stands.
 *
 * @param {Element | string} target - the slider, or the id of one
 * @returns {number | null} its value, or `null` for no such slider
 */
export function get(target) {
  const input = part(target, 'su-slider')
  const numeric = Number(input?.value)

  return input && input.value !== '' && Number.isFinite(numeric) ? numeric : null
}
