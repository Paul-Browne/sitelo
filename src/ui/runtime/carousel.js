/**
 * Keeping a carousel's dots and its scroll position in step.
 *
 * Where the browser has shipped `::scroll-marker` this is never
 * fetched: the stylesheet asks for the dots, the browser draws them and
 * tracks the scroll itself, and the carousel's handlers are guarded by
 * the same `CSS.supports()` test the stylesheet's `@supports` uses.
 *
 * Everywhere else the dots are rendered links, and this is what makes
 * them behave. It arrives on the first scroll or the first tap, the way
 * every other module here arrives — from an event attribute, with
 * nothing loaded until something happens:
 *
 * ```html
 * <div class="su-carousel-track" onscroll="…import('/su/carousel.js').then(m=>m.sync(this))">
 * <a class="su-carousel-dot" onclick="import('/su/carousel.js').then(m=>m.go(this,event))">
 * ```
 *
 * Both directions matter. `sync` marks the dot for whichever slide the
 * scroll has come to rest on, so swiping moves the dots. `go` scrolls
 * the track to a dot's slide and calls off the link, so tapping a dot
 * moves the track — and, unlike the fragment it falls back to, leaves
 * the page where it was.
 *
 * A page can drive the same thing itself:
 *
 * ```js
 * import { setSlide, getSlide } from 'sitelo/ui/client'
 *
 * setSlide('gallery', 2)
 * ```
 */

import { find, part } from './helpers.js'

/**
 * Whether the browser draws the dots itself.
 *
 * This is the JavaScript half of `@supports (scroll-marker-group:
 * after)` in `ui.css`, and the two have to agree: where the stylesheet
 * hides the rendered dots in favour of the native markers, there is
 * nothing here left to mark.
 *
 * @returns {boolean}
 */
export function native() {
  return typeof CSS !== 'undefined' && CSS.supports?.('scroll-marker-group', 'after')
}

/** The slides of one track, in order. */
function slides(track) {
  return [...track.children].filter((node) =>
    node.classList?.contains('su-carousel-slide'),
  )
}

/** The rendered dots of one carousel, in order. */
function dots(carousel) {
  const row = carousel?.querySelector?.('.su-carousel-dots')

  return row ? [...row.children] : []
}

/**
 * Which edge of a slide has to line up for it to be the one showing.
 *
 * Read off `scroll-snap-align` rather than passed in, because the
 * stylesheet already knows: the `align` prop sets it, and a media query
 * of the page's own may have changed it since. The shorthand takes the
 * block axis first, so a second value is the one that matters here.
 *
 * @param {Element} slide
 * @returns {'start' | 'center' | 'end'}
 */
function alignOf(slide) {
  const parts = getComputedStyle(slide).scrollSnapAlign.split(/\s+/)
  const inline = parts[1] ?? parts[0]

  return inline === 'center' || inline === 'end' ? inline : 'start'
}

/**
 * The index of the slide the track has come to rest on.
 *
 * Measured from live geometry rather than from `scrollLeft` and widths,
 * so it needs to know nothing about the gap, the per-view count or
 * which way the writing direction runs — only which slide is nearest to
 * where a snapped slide would sit.
 *
 * @param {Element} track
 * @returns {number} -1 when there are no slides
 */
function currentIndex(track) {
  const list = slides(track)

  if (!list.length) return -1

  const box = track.getBoundingClientRect()
  let best = 0
  let closest = Infinity

  list.forEach((slide, at) => {
    const rect = slide.getBoundingClientRect()
    const align = alignOf(slide)
    const gap = Math.abs(
      align === 'center'
        ? (rect.left + rect.right) / 2 - (box.left + box.right) / 2
        : align === 'end'
          ? rect.right - box.right
          : rect.left - box.left,
    )

    /*
     * Strictly closer, by more than a rounding error: two slides an
     * equal distance apart means the scroll is between them, and the
     * earlier one is the one being read.
     */
    if (gap < closest - 0.5) {
      closest = gap
      best = at
    }
  })

  return best
}

/**
 * Mark one dot as the slide showing and clear the rest.
 *
 * `aria-current` is both the state a screen reader reads and the hook
 * the stylesheet colours, so there is one thing to set rather than two
 * that could disagree.
 *
 * @param {Element} carousel
 * @param {number} index
 */
function mark(carousel, index) {
  dots(carousel).forEach((dot, at) => {
    if (at === index) dot.setAttribute('aria-current', 'true')
    else dot.removeAttribute('aria-current')
  })
}

/*
 * One pass per frame. A scroll fires its handler many times a second and
 * every pass measures each slide, which is layout work that only has to
 * land once before the next paint.
 */
const queued = new WeakSet()

/**
 * Bring the dots into line with where the track is scrolled to.
 *
 * What the track's `onscroll` calls, so it runs for a swipe, a
 * trackpad, the arrow keys, a scrollbar drag and a programmatic scroll
 * alike — every way a carousel can move.
 *
 * @param {Element | string} target - the track, or the carousel round it
 */
export function sync(target) {
  if (native()) return

  const track = part(target, 'su-carousel-track')
  const carousel = track?.closest?.('.su-carousel')

  if (!track || !carousel || queued.has(track)) return

  queued.add(track)

  requestAnimationFrame(() => {
    queued.delete(track)
    mark(carousel, currentIndex(track))
  })
}

/** Whether to animate a scroll this page asked for. */
function smooth() {
  return matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
}

/**
 * Scroll a slide into view without moving the page.
 *
 * `block: 'nearest'` is the whole reason this is worth a script: the
 * fragment these dots fall back to would scroll the window to the slide
 * as well as the track, and a carousel that jumps the page out from
 * under the thumb tapping it is not what anyone meant by a dot.
 *
 * @param {Element} slide
 */
function reveal(slide) {
  slide.scrollIntoView({ behavior: smooth(), block: 'nearest', inline: alignOf(slide) })
}

/**
 * Go to the slide a dot points at.
 *
 * What a dot's `onclick` calls. The dot is a real link to a real id, so
 * this calls the navigation off rather than adding it: the href is what
 * happens when this module never arrives.
 *
 * @param {Element} dot - the link that was clicked
 * @param {Event} [event]
 * @returns {number | null} the index gone to, or `null` if there was none
 */
export function go(dot, event) {
  const carousel = dot?.closest?.('.su-carousel')
  const track = carousel?.querySelector?.('.su-carousel-track')

  if (!track) return null

  const id = decodeURIComponent(String(dot.getAttribute('href') ?? '').slice(1))
  const slide = id ? document.getElementById(id) : null

  if (!slide || !track.contains(slide)) return null

  event?.preventDefault?.()
  reveal(slide)

  /*
   * Marked here as well as from the scroll it starts: a smooth scroll
   * reports its first position a frame later, and a dot that waits that
   * long to light up feels like it missed the tap.
   */
  const index = slides(track).indexOf(slide)

  mark(carousel, index)

  return index
}

/**
 * Go to slide `index` of a carousel.
 *
 * @param {Element | string} target - the carousel, or the id of one
 * @param {number} index - zero-based, counting the slides as rendered
 * @returns {number | null} the index applied, or `null` for no such carousel
 */
export function set(target, index) {
  const carousel = find(target)?.closest?.('.su-carousel') ?? find(target)
  const track = part(carousel, 'su-carousel-track')

  if (!track) return null

  const list = slides(track)

  if (!list.length) return null

  const wanted = Number(index)
  // The same rule `steps()` follows: something that is not a number is
  // not an index, and the first slide is the sensible thing to land on.
  const at = Math.min(
    Math.max(0, Number.isFinite(wanted) ? Math.trunc(wanted) : 0),
    list.length - 1,
  )

  reveal(list[at])
  if (!native()) mark(track.closest('.su-carousel'), at)

  return at
}

/**
 * Which slide a carousel is showing.
 *
 * @param {Element | string} target
 * @returns {number | null}
 */
export function get(target) {
  const track = part(find(target)?.closest?.('.su-carousel') ?? find(target), 'su-carousel-track')

  if (!track) return null

  const at = currentIndex(track)

  return at === -1 ? null : at
}
