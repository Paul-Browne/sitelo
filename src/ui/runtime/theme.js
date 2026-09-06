/**
 * Light/dark switching.
 *
 * Reached from the `onclick` attribute `themeToggle()` renders, and
 * importable directly when a page wants to set the theme itself.
 *
 * The choice lives in `localStorage`, which the server cannot read — so
 * `themeScript()` in the head is what stops a dark flash on the next
 * navigation. This module only handles the flip.
 */

const KEY = 'sitelo-ui-theme'

/**
 * The theme in effect right now, resolved rather than stored.
 * @returns {'light' | 'dark'}
 */
export function get() {
  const root = document.documentElement

  /*
   * The stylesheet honours both attributes, so this must too. Reading
   * only `data-su-theme` made the toggle disagree with what was on
   * screen on any site that sets `data-theme` itself.
   */
  for (const attribute of ['data-su-theme', 'data-theme']) {
    const value = root.getAttribute(attribute)

    if (value === 'light' || value === 'dark') return value
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/**
 * Apply a theme and remember it.
 *
 * `'system'` clears the override, handing the decision back to
 * `prefers-color-scheme`.
 *
 * @param {'light' | 'dark' | 'system'} value
 */
export function set(value) {
  const root = document.documentElement

  if (value === 'system') root.removeAttribute('data-su-theme')
  else root.setAttribute('data-su-theme', value)

  try {
    if (value === 'system') localStorage.removeItem(KEY)
    else localStorage.setItem(KEY, value)
  } catch {
    // Private browsing, or storage disabled. The theme still applies for
    // this page view, which is the part that matters.
  }

  const pressed = String(get() === 'dark')

  for (const button of document.querySelectorAll('[data-su-theme-toggle]')) {
    button.setAttribute('aria-pressed', pressed)
  }
}

/**
 * Flip between light and dark.
 *
 * The attribute hands it the button that was pressed; it is ignored,
 * because the state that matters is the document's, not one button's.
 */
export function toggle() {
  set(get() === 'dark' ? 'light' : 'dark')
}
