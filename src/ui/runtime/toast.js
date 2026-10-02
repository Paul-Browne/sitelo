/**
 * Transient messages, shown in the region `toasts()` renders.
 *
 * Nothing on a page triggers this on its own, so unlike its neighbours
 * it is usually imported rather than reached from an attribute — either
 * from your own bundle:
 *
 * ```js
 * import { toast } from 'sitelo/ui/client'
 * ```
 *
 * or straight from a handler, the same way the components do it:
 *
 * ```js
 * button({ onclick: "import('/su/toast.js').then(m=>m.toast('Saved'))" }, 'Save')
 * ```
 */

/** Most toasts on screen at once; the oldest is dropped past this. */
const MAX_TOASTS = 5

/**
 * @param {string} message
 * @param {object} [options]
 * @param {'primary' | 'neutral' | 'success' | 'warning' | 'danger'} [options.color]
 * @param {number} [options.duration] - Milliseconds; `0` keeps it up.
 * @param {string} [options.dismissLabel] - What a screen reader calls the
 *   close button, in the page's language. Default `'Dismiss'`.
 * @returns {HTMLElement | null} `null` when the region is not on the page.
 */
export function toast(message, { color = 'neutral', duration = 4000, dismissLabel = 'Dismiss' } = {}) {
  const region = document.getElementById('su-toasts')

  if (!region) return null

  const node = document.createElement('div')

  node.className = `su-alert su-alert--soft su-c-${color}`
  node.append(
    Object.assign(document.createElement('div'), {
      className: 'su-alert-content',
      textContent: message,
    }),
  )

  const dismiss = document.createElement('button')

  dismiss.type = 'button'
  dismiss.className = 'su-alert-dismiss'
  dismiss.setAttribute('aria-label', String(dismissLabel))
  /*
   * The `close` icon written out, rather than imported from the icon set
   * and with it every other glyph, and not `&times;`, which a font sets
   * below the middle of the line. A test holds it to `icon('close')`.
   */
  dismiss.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="su-icon" aria-hidden="true"><path d="m6 6 12 12"/><path d="m18 6-12 12"/></svg>'
  /*
   * A listener rather than the inline import the server-rendered alerts
   * use: this button is built by a module that is already running, so
   * there is nothing left to go and fetch.
   */
  dismiss.addEventListener('click', () => node.remove())
  node.append(dismiss)

  region.append(node)

  // A flood of toasts would otherwise fill the screen with a stack
  // nobody can scroll — the region is fixed-position.
  while (region.children.length > MAX_TOASTS) region.firstElementChild?.remove()

  if (duration > 0) setTimeout(() => node.remove(), duration)

  return node
}
