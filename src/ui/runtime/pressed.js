/**
 * The pressed state of `toggleButton()` and `toggleGroup()`.
 *
 * `aria-pressed` is the whole of it — there is no hidden input — so a
 * server-rendered toggle shows a setting rather than changing one. This
 * is what changes it:
 *
 * ```js
 * import { setPressed } from 'sitelo/ui/client'
 *
 * setPressed('bold')          // flip it
 * setPressed('bold', true)    // or say which way
 * ```
 *
 * or from the button itself, the way the components reach their own
 * modules:
 *
 * ```js
 * toggleButton({ id: 'bold', onclick: "import('/su/pressed.js').then(m=>m.set(this))" }, 'Bold')
 * ```
 *
 * A button inside a single-select `toggleGroup()` clears its siblings
 * when it goes on, because that is what the server did when it rendered
 * one `value` rather than an array.
 *
 * Not for `toggle()`, the switch — that is a real checkbox, and the
 * browser owns its state.
 */

import { find } from './helpers.js'

/**
 * Press a toggle button, or let go of it.
 *
 * @param {Element | string} target - the button, or the id of one
 * @param {boolean} [on] - omit to flip whatever it is now
 * @returns {boolean | null} the state it ended in, or `null` for no such button
 */
export function set(target, on) {
  const button = find(target)

  if (!button?.hasAttribute?.('aria-pressed')) return null

  const next = on == null ? button.getAttribute('aria-pressed') !== 'true' : Boolean(on)

  button.setAttribute('aria-pressed', String(next))

  /*
   * One `value` on a group meant one choice; an array meant several, and
   * that is what `data-su-multiple` records. Only the single-choice case
   * has siblings to let go of.
   */
  const group = button.closest?.('.su-toggle-group')

  if (next && group && !group.hasAttribute('data-su-multiple')) {
    for (const other of group.querySelectorAll('[aria-pressed="true"]')) {
      if (other !== button) other.setAttribute('aria-pressed', 'false')
    }
  }

  return next
}

/**
 * Whether a toggle button is pressed, or which of a group's are.
 *
 * Given a group it answers with the pressed buttons' `value` attributes,
 * so a single-choice group reads as a one-element array.
 *
 * @param {Element | string} target
 * @returns {boolean | string[] | null}
 */
export function get(target) {
  const node = find(target)

  if (!node) return null
  if (node.hasAttribute('aria-pressed')) return node.getAttribute('aria-pressed') === 'true'
  if (!node.classList?.contains('su-toggle-group')) return null

  return [...node.querySelectorAll('[aria-pressed="true"]')].map(
    (button) => button.getAttribute('value') ?? button.textContent.trim(),
  )
}
