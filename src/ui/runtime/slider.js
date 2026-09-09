/**
 * Keeping a slider's `<output>` in step with its thumb.
 *
 * `slider({ showValue: true })` renders the number the page was built
 * with and wires this into its own `oninput`, so the output follows the
 * thumb without the page importing anything. With the module never
 * fetched the number is simply the one the server rendered, which is
 * the state a slider with no script was always in.
 *
 * Nothing here is worth calling yourself: setting `input.value` from
 * your own code and dispatching an `input` event runs this for you.
 */

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
