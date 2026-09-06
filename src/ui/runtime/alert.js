/**
 * The close button on a dismissible alert.
 *
 * Reached from the `onclick` attribute `alert({ dismissible: true })`
 * renders. With the file never fetched — no JavaScript, a failed
 * request — the button is inert and the alert stays, which is the
 * state the server rendered.
 */

/**
 * Remove whatever this button dismisses.
 *
 * `data-su-dismiss` names an element by id when the button sits outside
 * the thing it closes; empty, it closes the alert it is inside.
 *
 * @param {Element} button
 */
export function dismiss(button) {
  const id = button.getAttribute('data-su-dismiss')
  const node = id ? document.getElementById(id) : button.closest('.su-alert')

  node?.remove()
}
