/**
 * Moving a progress bar after the server has rendered it.
 *
 * `progress()` writes its value into the HTML twice — a percentage in a
 * CSS custom property on the fill, and a number in `aria-valuenow` —
 * and nothing on the page changes either on its own. This is the half a
 * page drives itself, from an upload's `progress` event, a fetch, or a
 * step counter:
 *
 * ```js
 * import { setProgress } from 'sitelo/ui/client'
 *
 * xhr.upload.onprogress = (e) => setProgress('upload', e.loaded, { max: e.total })
 * ```
 *
 * or straight from an event attribute, the way the components reach
 * their own modules:
 *
 * ```js
 * button({ onclick: "import('/su/progress.js').then(m=>m.set('upload',100))" }, 'Finish')
 * ```
 *
 * Give the bar an `id` — it falls through to the wrapper like any other
 * attribute — and that id is the handle everything here takes.
 */

import { limit, part } from './helpers.js'

/**
 * The pieces of one bar: the element the value is announced on, the one
 * it is drawn on, and the label span that spells it out.
 */
function parts(target) {
  const bar = part(target, 'su-progress-bar')

  if (!bar) return null

  // Aiming at the bar itself is allowed, so the wrapper may be above it —
  // and when the caller aimed at the wrapper, this walks back to the same one.
  const root = bar.closest?.('.su-progress') ?? bar

  return {
    bar,
    fill: bar.querySelector('.su-progress-fill'),
    shown: root.querySelector('[data-su-progress-value]'),
  }
}

/** What counts as complete on this bar, however it came to be known. */
function scaleOf(bar, max) {
  return limit(
    max,
    [bar.getAttribute('data-su-progress-max'), bar.getAttribute('aria-valuemax')],
    100,
  )
}

/**
 * Move a bar to `value`, or back to the indeterminate animation.
 *
 * `null` — or anything that is not a finite number — is the same "we do
 * not know" the component treats a missing `value` as, so a bar can go
 * determinate and back without the caller special-casing it.
 *
 * @param {Element | string} target - the bar, or the id of one
 * @param {number | null} [value]
 * @param {{ max?: number }} [options] - remembered for later calls
 * @returns {Element | null} the bar, or `null` when there is no such bar
 */
export function set(target, value, { max } = {}) {
  const found = parts(target)

  if (!found) return null

  const { bar, fill, shown } = found
  const numeric = Number(value)
  const scale = scaleOf(bar, max)
  const indeterminate = value == null || !Number.isFinite(numeric)
  const pct = indeterminate ? 0 : Math.max(0, Math.min(100, (numeric / scale) * 100))

  // A scale the caller had to tell us is one the markup did not carry;
  // record it so the next call can be `set(el, 40)` on its own.
  if (max != null && scale !== 100) bar.setAttribute('data-su-progress-max', String(scale))

  bar.classList.toggle('su-progress-bar--indeterminate', indeterminate)

  if (indeterminate) fill?.style.removeProperty('--su-progress-value')
  else fill?.style.setProperty('--su-progress-value', `${pct}%`)

  /*
   * An unlabelled bar was rendered `aria-hidden` on purpose: a
   * progressbar with no accessible name is invalid and says nothing.
   * Announcing a value on it now would undo that, so only a bar the
   * server already gave a name to gets the numbers.
   */
  if (bar.getAttribute('role') === 'progressbar') {
    if (indeterminate) {
      for (const name of ['aria-valuenow', 'aria-valuemin', 'aria-valuemax']) {
        bar.removeAttribute(name)
      }
    } else {
      bar.setAttribute('aria-valuenow', String(numeric))
      bar.setAttribute('aria-valuemin', '0')
      bar.setAttribute('aria-valuemax', String(scale))
    }
  }

  // Present only when the bar was rendered with `showValue`, and empty
  // while there is no value to show.
  if (shown) shown.textContent = indeterminate ? '' : `${Math.round(pct)}%`

  return bar
}

/**
 * The value a bar is showing, on its own scale.
 *
 * `null` for an indeterminate bar, and for a target that is not one.
 *
 * @param {Element | string} target
 * @returns {number | null}
 */
export function get(target) {
  const found = parts(target)

  if (!found) return null

  const { bar, fill } = found

  if (bar.classList.contains('su-progress-bar--indeterminate')) return null

  const announced = Number(bar.getAttribute('aria-valuenow'))

  if (bar.getAttribute('aria-valuenow') != null && Number.isFinite(announced)) return announced

  // An unlabelled bar announces nothing, so the drawing is the only
  // record of where it got to.
  const drawn = Number.parseFloat(fill?.style.getPropertyValue('--su-progress-value') ?? '')

  return Number.isFinite(drawn) ? (drawn / 100) * scaleOf(bar) : null
}
