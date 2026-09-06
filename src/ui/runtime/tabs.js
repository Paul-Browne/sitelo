/**
 * Tabs whose panels swap in place.
 *
 * Reached from the `onclick` and `onkeydown` attributes `tabs()`
 * renders, so a page with no tabs never fetches this file. Everything
 * here corrects what the server already drew: the panel it marked
 * active is on screen before this module arrives.
 */

/**
 * The tabs belonging to one tablist, ignoring any nested inside a
 * tablist of their own.
 *
 * @param {Element} tablist
 * @param {boolean} [focusable] - skip disabled tabs, for keyboard moves
 * @returns {HTMLElement[]}
 */
function tabsIn(tablist, focusable = false) {
  const selector = focusable ? '[role="tab"]:not([disabled])' : '[role="tab"]'

  return [...tablist.querySelectorAll(selector)].filter(
    (tab) => tab.closest('[role="tablist"]') === tablist,
  )
}

/**
 * Show the panel this tab controls and hide its siblings'.
 *
 * @param {Element} target - the tab, or anything inside one
 */
export function select(target) {
  const tab = target?.closest?.('[role="tab"]')
  const tablist = tab?.closest('[role="tablist"]')

  if (!tab || !tablist) return

  for (const candidate of tabsIn(tablist)) {
    const selected = candidate === tab
    const panel = document.getElementById(candidate.getAttribute('aria-controls') ?? '')

    candidate.setAttribute('aria-selected', String(selected))
    candidate.setAttribute('tabindex', selected ? '0' : '-1')

    if (panel) panel.hidden = !selected
  }
}

const STEP = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }

/**
 * Roving focus across a tablist: arrows move, Home and End jump.
 *
 * The attribute has already called `preventDefault()` — it has to,
 * synchronously, or the page has scrolled by the time this module
 * finishes loading. All that is left is deciding where to go.
 *
 * @param {Element} target - the focused tab, or anything inside one
 * @param {string} name - `event.key`
 */
export function key(target, name) {
  const tab = target?.closest?.('[role="tab"]')
  const tablist = tab?.closest('[role="tablist"]')

  if (!tab || !tablist) return

  const tabs = tabsIn(tablist, true)
  const index = tabs.indexOf(/** @type {HTMLElement} */ (tab))

  if (index < 0) return

  const step = STEP[name]
  const next = step
    ? tabs[(index + step + tabs.length) % tabs.length]
    : name === 'Home'
      ? tabs[0]
      : name === 'End'
        ? tabs[tabs.length - 1]
        : undefined

  if (!next) return

  select(next)
  next.focus()
}
