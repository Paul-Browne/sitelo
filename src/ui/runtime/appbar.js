/**
 * Getting an app bar out of the way while the page scrolls down.
 *
 * `appBar({ sticky: 'auto' })` has to know which way its scroller last
 * moved. Where the browser can say — `@container scroll-state(scrolled)`
 * — the stylesheet asks it directly and this module is never fetched.
 *
 * Everywhere else this is what keeps count. It cannot arrive the way the
 * carousel's module does, from an `onscroll` of the component's own:
 * scrolling the page scrolls the document, not the bar, and the bar
 * hears nothing. So the stylesheet gives the bar a one-off animation
 * instead — 1ms long, cancelled by the same container query that turns
 * the native path on — and the bar's `onanimationstart` imports this:
 *
 * ```html
 * <header class="su-appbar su-appbar--sticky su-appbar--auto"
 *   onanimationstart="event.animationName=='su-appbar-watch'&&import('/su/appbar.js').then(m=>m.watch(this))">
 * ```
 *
 * That makes the stylesheet the one place the decision is made. A test
 * of the browser written out here as well could only ever disagree with
 * it, and the cost of a disagreement is a bar that never hides.
 *
 * From then on it listens to the scroller and marks the bar
 * `data-su-scrolled="down"` while the last move was downward and the top
 * is out of sight, which the stylesheet reads exactly as it reads the
 * container query.
 */

/** Bars already being watched, so a restarted animation adds no listener. */
const watched = new WeakSet()

/**
 * What the bar sticks to: the nearest ancestor that is a scroll
 * container, which is what `position: sticky` measures against, or
 * `null` for the page.
 *
 * The body is where the walk stops rather than an element it tests: an
 * `overflow` set on it is handed to the viewport, so it is the page's
 * scroll whatever its computed style says.
 *
 * @param {HTMLElement} bar
 * @returns {HTMLElement | null}
 */
function scrollerOf(bar) {
  for (let node = bar.parentElement; node && node !== document.body; node = node.parentElement) {
    if (!/^(?:visible|clip)$/.test(getComputedStyle(node).overflowY)) return node
  }

  return null
}

/**
 * How far down a scroller is, held inside the range it can rest in.
 *
 * Safari rubber-bands past both ends, reporting a negative offset at
 * the top and one past the end at the bottom, and then springs back. Read
 * raw, the spring back at the bottom is an upward scroll, and the bar
 * would come back at the foot of every page. Clamped, the overshoot reads as
 * standing still.
 *
 * @param {HTMLElement | null} scroller
 * @returns {number}
 */
function offset(scroller) {
  const box = scroller ?? document.scrollingElement ?? document.documentElement
  const end = Math.max(0, box.scrollHeight - box.clientHeight)

  return Math.min(Math.max(box.scrollTop, 0), end)
}

/**
 * Start following the scroll for one bar.
 *
 * The bar is left as it was rendered until the first move: a page
 * restored halfway down has no direction yet, and showing the bar is
 * what the native query does with no direction too.
 *
 * @param {HTMLElement} bar
 */
export function watch(bar) {
  if (!bar || watched.has(bar)) return

  watched.add(bar)

  const scroller = scrollerOf(bar)
  /*
   * The page's own scroll is dispatched at the document, an element's at
   * the element — neither bubbles to the other, so this has to listen on
   * whichever one the bar sticks to.
   */
  const source = scroller ?? document
  let last = offset(scroller)

  source.addEventListener(
    'scroll',
    () => {
      const now = offset(scroller)

      if (now <= 0 || now < last) bar.removeAttribute('data-su-scrolled')
      else if (now > last) bar.setAttribute('data-su-scrolled', 'down')

      last = now
    },
    { passive: true },
  )
}
