/**
 * The part of a dropdown the browser does not do for you.
 *
 * `menu()` is a `<details>`, so opening and closing it needs no script
 * at all. What is missing is closing it *again* — when you click
 * elsewhere, choose an item, or press Escape — and that is all this is.
 *
 * Reached from the `ontoggle` attribute the component renders, which
 * fires in both directions: the listeners exist only while a menu is
 * actually open.
 */

/** Open menu -> the function that takes its listeners back off. */
const cleanups = new WeakMap()

/**
 * @param {HTMLDetailsElement} menu
 */
export function toggled(menu) {
  cleanups.get(menu)?.()
  cleanups.delete(menu)

  if (!menu.open) return

  /*
   * A click on an item is a choice, so the menu closes — a menu still
   * standing after you have picked something is the bug this exists to
   * prevent. Any other click *inside* is left alone, so a menu can hold
   * a form.
   */
  const onClick = (event) => {
    const target = /** @type {Element | null} */ (event.target)
    const inside = target != null && menu.contains(target)

    if (inside && !target.closest?.('[role="menuitem"]')) return

    menu.open = false
  }

  const onKeydown = (event) => {
    if (event.key !== 'Escape') return

    // Read before closing: the item holding focus is about to be hidden.
    const held = menu.contains(document.activeElement)

    menu.open = false

    if (held) /** @type {HTMLElement | null} */ (menu.querySelector('summary'))?.focus()
  }

  /*
   * `toggle` fires asynchronously, so the click that opened this menu
   * has finished dispatching by now — adding the listener here cannot
   * close the menu on the way in.
   */
  document.addEventListener('click', onClick)
  document.addEventListener('keydown', onKeydown)

  cleanups.set(menu, () => {
    document.removeEventListener('click', onClick)
    document.removeEventListener('keydown', onKeydown)
  })
}
