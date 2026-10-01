/**
 * Opening and closing a `<dialog>` where the browser does not do it itself.
 *
 * `modal()` and `drawer()` are dialogs. A button with `commandfor` naming
 * one and `command="show-modal"` opens it modally — the page behind goes
 * inert, focus stays inside — and `command="close"` shuts it, with no
 * script at all: those are the browser's invoker commands. Every current
 * browser has them; this is for the ones from before (Chrome before 135,
 * Firefox before 144, Safari before 26.2), and only those ever fetch it.
 * `button()`, `menuItem()` and `closeButton()` guard the import behind
 * the same test the browser would answer:
 *
 * ```html
 * <button commandfor="confirm" command="show-modal"
 *   onclick="'command' in HTMLButtonElement.prototype||import('/su/dialog.js').then(m=>m.invoke(this))">
 * ```
 *
 * It also does what `closedby="any"` asks for — close on a click outside
 * the dialog — in a browser that has dialogs but not that attribute, which
 * at the time of writing is Safari.
 *
 * Doing a command twice is harmless by construction: each one checks the
 * state it is about to change, so a browser that both ran the command
 * itself and fetched this would still end up where it should.
 */

/**
 * Carry out a button's `command` on the element its `commandfor` names.
 *
 * The commands the browser defines, and only those: a custom `--command`
 * is a `command` event for the page's own script, which an old browser
 * has no way to dispatch.
 *
 * @param {Element} button
 */
export function invoke(button) {
  const target = /** @type {any} */ (
    document.getElementById(button.getAttribute('commandfor') ?? '')
  )

  if (!target) return

  // A button's value becomes the dialog's `returnValue`, as it would natively.
  const value = button.hasAttribute('value') ? button.getAttribute('value') : undefined
  const showing = () => target.matches?.(':popover-open') ?? false

  switch (button.getAttribute('command')) {
    case 'show-modal':
      if (!target.open) target.showModal()
      break
    case 'close':
      if (target.open) target.close(value)
      break
    case 'request-close':
      if (target.open) (target.requestClose ?? target.close).call(target, value)
      break
    case 'toggle-popover':
      target.togglePopover?.()
      break
    case 'show-popover':
      if (!showing()) target.showPopover?.()
      break
    case 'hide-popover':
      if (showing()) target.hidePopover?.()
      break
  }
}

/**
 * Close a dialog that was clicked outside, as `closedby="any"` would.
 *
 * A click on the backdrop is dispatched to the dialog itself, and so is
 * one on the dialog's own padding or border; the box tells the two apart.
 *
 * @param {HTMLDialogElement} dialog
 * @param {MouseEvent} event
 */
export function dismiss(dialog, event) {
  if (!dialog.open || event.target !== dialog) return
  // The attribute still decides: a page that asked for less is not overruled.
  if (dialog.getAttribute('closedby') !== 'any') return

  const box = dialog.getBoundingClientRect()
  const inside =
    event.clientX >= box.left &&
    event.clientX <= box.right &&
    event.clientY >= box.top &&
    event.clientY <= box.bottom

  if (!inside) dialog.close()
}
