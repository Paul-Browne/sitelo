/**
 * The part of a dropdown the browser does not do for you.
 *
 * `menu()` is a `<details>`, so opening and closing it needs no script
 * at all. What is missing is closing it *again* — when you click
 * elsewhere, choose an item, or press Escape — and moving through it the
 * way `role="menu"` tells a screen reader it can: Up and Down between
 * the items, Home and End to either end.
 *
 * Reached from the `ontoggle` attribute the component renders, which
 * fires in both directions: the listeners exist only while a menu is
 * actually open.
 */

/** The keys that move between items. */
const ARROWS = new Set(['ArrowDown', 'ArrowUp', 'Home', 'End'])

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
    if (event.key === 'Escape') {
      // Read before closing: the item holding focus is about to be hidden.
      const held = menu.contains(document.activeElement)

      menu.open = false

      if (held) /** @type {HTMLElement | null} */ (menu.querySelector('summary'))?.focus()
      return
    }

    if (!ARROWS.has(event.key) || !menu.contains(document.activeElement)) return

    const items = /** @type {HTMLElement[]} */ ([
      ...menu.querySelectorAll('[role="menuitem"]'),
    ]).filter((item) => !item.hasAttribute('disabled') && item.getAttribute('aria-disabled') !== 'true')

    if (!items.length) return

    // From the trigger, down is the first item and up the last.
    const at = items.indexOf(/** @type {HTMLElement} */ (document.activeElement))
    const next =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? items.length - 1
          : event.key === 'ArrowDown'
            ? (at + 1) % items.length
            : at <= 0
              ? items.length - 1
              : at - 1

    // The page would otherwise scroll as well.
    event.preventDefault()
    items[next].focus()
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
