/**
 * The count on a `badge()`.
 *
 * A badge is the one number on a page most likely to change while the
 * page is open — unread messages, items in a cart — and getting it right
 * is more than writing a digit: the count is clamped to `max+`, the
 * announced text has to follow it, and a badge with nothing to say drops
 * out of the accessibility tree.
 *
 * ```js
 * import { setBadge } from 'sitelo/ui/client'
 *
 * setBadge('inbox', 7, { label: '7 unread messages' })
 * ```
 *
 * or from an event attribute, the way the components reach their own
 * modules:
 *
 * ```js
 * button({ onclick: "import('/su/badge.js').then(m=>m.set('inbox',0))" }, 'Mark all read')
 * ```
 */

import { limit, part } from './helpers.js'

/** The badge itself, wherever the caller aimed — root, badge, or id. */
function parts(target) {
  const badge = part(target, 'su-badge')

  if (!badge) return null

  return {
    badge,
    value: badge.querySelector('[data-su-badge-value]'),
    label: badge.querySelector('.su-visually-hidden'),
  }
}

/**
 * Give the badge its announced text, adding or removing the hidden span
 * the way the component would have rendered it.
 *
 * A badge that says something out loud hides its digits from the
 * accessibility tree, so the count is not announced twice — the rule the
 * server follows, and the reason this cannot just write a string.
 */
function say(badge, { value, label }, text) {
  if (text) {
    let node = label

    if (!node) {
      node = document.createElement('span')
      node.className = 'su-visually-hidden'
      badge.append(node)
    }

    node.textContent = text
    value?.setAttribute('aria-hidden', 'true')

    return
  }

  label?.remove()
  value?.removeAttribute('aria-hidden')
}

/**
 * Set the count a badge is showing.
 *
 * `null` empties it, which is how a badge disappears: an empty badge
 * with nothing announced is decoration, and says so.
 *
 * The visible number is the site's, but the announced text is its
 * prose — "7 unread messages" is not something this can write for you —
 * so pass `label` whenever the badge has one.
 *
 * @param {Element | string} target - the badge, or the id of one
 * @param {number | string | null} content
 * @param {{ max?: number, label?: string }} [options]
 * @returns {Element | null} the badge, or `null` when there is no such badge
 */
export function set(target, content, { max, label } = {}) {
  const found = parts(target)

  if (!found) return null

  const { badge, value } = found
  const numeric = Number(content)
  const ceiling = limit(max, [badge.getAttribute('data-su-badge-max')], 99)

  const display =
    Number.isFinite(numeric) && content !== '' && numeric > ceiling
      ? `${ceiling}+`
      : content == null
        ? ''
        : String(content)

  if (max != null) badge.setAttribute('data-su-badge-max', String(ceiling))
  if (value) value.textContent = display

  const announced = label === undefined ? (found.label?.textContent ?? '') : String(label)

  if (label !== undefined) say(badge, found, announced)

  /*
   * Same rule the component renders by: a badge showing nothing and
   * announcing nothing is decoration. A dot is deliberately nothing to
   * show, and stays hidden unless it was given something to say.
   */
  const dot = badge.classList.contains('su-badge--dot')

  if (!announced && (dot || display === '')) badge.setAttribute('aria-hidden', 'true')
  else badge.removeAttribute('aria-hidden')

  return badge
}

/**
 * The count a badge is showing, as a number where it is one.
 *
 * A clamped badge reads back as the clamp — `'99+'` — because that is
 * all the page knows; the real figure never reached the browser.
 *
 * @param {Element | string} target
 * @returns {number | string | null}
 */
export function get(target) {
  const found = parts(target)

  if (!found?.value) return null

  const text = found.value.textContent.trim()

  if (text === '') return null

  const numeric = Number(text)

  return Number.isFinite(numeric) ? numeric : text
}
