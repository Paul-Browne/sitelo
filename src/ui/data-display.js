import { createHash } from 'node:crypto'

import {
  a,
  caption as captionEl,
  div,
  figcaption,
  figure as figureEl,
  img as imgEl,
  li,
  nav,
  span,
  table as tableEl,
  tbody,
  td,
  th,
  thead,
  tr,
  ul,
} from 'javascript-to-html'

import { handler } from './handlers.js'
import { attrs, colorClass, cx, el, oneOf, parseArgs, SIZES, space } from './internal.js'

/**
 * Initials, an image, or an icon in a circle.
 *
 * With `name` and no `src` it renders the initials, which is the useful
 * fallback for a user list where only some people have a photo.
 *
 * @param {...any} args - `avatar({ src, alt, name, size, square, color }, ...children)`
 * @returns {string}
 */
export function avatar(...args) {
  const { props, children } = parseArgs(args)
  const { src, alt, name, size = 'md', square = false, color, ...rest } = props

  const initials = name
    ? String(name)
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((word) => word[0])
        .join('')
        .toUpperCase()
    : ''

  return span(
    ...(name && !src ? [{ title: String(name) }] : []),
    attrs(rest, {
      class: cx(
        'su-avatar',
        size !== 'md' && `su-avatar--${oneOf(size, SIZES, 'md')}`,
        square && 'su-avatar--square',
        color && colorClass(color),
      ),
    }),
    src ? imgEl({ src, alt: alt ?? String(name ?? '') }) : initials,
    ...children,
  )
}

/**
 * Overlapping row of avatars, with an optional `+n` at the end.
 *
 * @param {...any} args - `avatarGroup({ max, size }, ...avatars)`
 * @returns {string}
 */
export function avatarGroup(...args) {
  const { props, children } = parseArgs(args)
  const { max, size = 'md', ...rest } = props

  const shown = max ? children.slice(0, Number(max)) : children
  const hidden = children.length - shown.length

  return div(
    attrs(rest, { class: 'su-avatar-group' }),
    ...shown,
    hidden > 0 ? avatar({ size, color: 'neutral' }, `+${hidden}`) : '',
  )
}

/**
 * Count or dot pinned to the corner of whatever it wraps.
 *
 * @param {...any} args - `badge({ content, color, dot, max }, ...children)`
 * @returns {string}
 */
export function badge(...args) {
  const { props, children } = parseArgs(args)
  const { content, color = 'danger', dot = false, max = 99, label, ...rest } = props

  const numeric = Number(content)
  const display = dot
    ? ''
    : Number.isFinite(numeric) && numeric > Number(max)
      ? `${max}+`
      : content == null
        ? ''
        : String(content)

  /*
   * A label becomes visually hidden text rather than `aria-label`:
   * `aria-label` is only valid on an element with a role, and a badge is
   * a plain span. The visible value is hidden from the accessibility
   * tree so the count is not announced twice.
   */
  return span(
    attrs(rest, { class: 'su-badge-root' }),
    ...children,
    span(
      {
        class: cx('su-badge', dot && 'su-badge--dot', colorClass(color, 'danger')),
        ...(!label && (dot || display === '') ? { 'aria-hidden': 'true' } : {}),
        // A count that is not the default clamp is written down for
        // `/su/badge.js`, which otherwise has no way to know where a
        // number it is given turns into `max+`.
        ...(Number(max) === 99 ? {} : { 'data-su-badge-max': max }),
      },
      // Always a span, never a bare text node: it is what the runtime
      // writes the new count into, and it has to be there to be found.
      span({ 'data-su-badge-value': '', ...(label ? { 'aria-hidden': 'true' } : {}) }, display),
      label ? span({ class: 'su-visually-hidden' }, label) : '',
    ),
  )
}

const CHIP_VARIANTS = ['soft', 'outline', 'solid']

/**
 * Compact label — a tag, a status, a filter.
 *
 * Passing `href` makes it a link; passing `onclick` (or `as: 'button'`)
 * makes it a button.
 *
 * @param {...any} args - `chip({ color, variant, size, href, dot }, ...children)`
 * @returns {string}
 */
export function chip(...args) {
  const { props, children } = parseArgs(args)
  const {
    color = 'neutral',
    variant = 'soft',
    size = 'md',
    href,
    dot = false,
    as,
    ...rest
  } = props

  const own = {
    class: cx(
      'su-chip',
      `su-chip--${oneOf(variant, CHIP_VARIANTS, 'soft')}`,
      size !== 'md' && `su-chip--${oneOf(size, SIZES, 'md')}`,
      colorClass(color, 'neutral'),
    ),
  }

  const body = [dot ? span({ class: 'su-chip-dot', 'aria-hidden': 'true' }) : '', ...children]

  if (href) return a(attrs({ href, ...rest }, own), ...body)

  return el(as, span)(attrs(rest, own), ...body)
}

/**
 * Hover and focus tooltip, drawn from a data attribute so it needs no
 * script and cannot be left behind in the DOM.
 *
 * The wrapped control still needs its own accessible name — the tooltip
 * text is decoration, so pass `label` to have it repeated for screen
 * readers.
 *
 * @param {...any} args - `tooltip({ content, placement, label }, ...children)`
 * @returns {string}
 */
export function tooltip(...args) {
  const { props, children } = parseArgs(args)
  const { content, placement = 'top', label = false, ...rest } = props

  return span(
    content == null ? {} : { 'data-su-tooltip': content },
    attrs(rest, {
      class: cx('su-tooltip', placement === 'bottom' && 'su-tooltip--bottom'),
    }),
    ...children,
    label && content ? span({ class: 'su-visually-hidden' }, content) : '',
  )
}

/**
 * Table with a scroll container around it.
 *
 * Pass `columns` and `rows` for the common case, or children for full
 * control. A column is `{ key, header, align, render }`; `render`
 * receives the row and returns HTML.
 *
 * @param {...any} args - `table({ columns, rows, caption, striped, hover, dense }, ...children)`
 * @returns {string}
 */
export function table(...args) {
  const { props, children } = parseArgs(args)
  const {
    columns,
    rows = [],
    caption,
    striped = false,
    hover = false,
    dense = false,
    ...rest
  } = props

  const alignClass = (align) =>
    align === 'end' || align === 'right'
      ? 'su-align-end'
      : align === 'center'
        ? 'su-align-center'
        : undefined

  const head = columns
    ? thead(
        tr(
          ...columns.map((column) =>
            th(
              { scope: 'col', ...(alignClass(column.align) ? { class: alignClass(column.align) } : {}) },
              column.header ?? column.key ?? '',
            ),
          ),
        ),
      )
    : ''

  const body = columns
    ? tbody(
        ...rows.map((row) =>
          tr(
            ...columns.map((column) =>
              td(
                alignClass(column.align) ? { class: alignClass(column.align) } : {},
                column.render ? column.render(row) : (row?.[column.key] ?? ''),
              ),
            ),
          ),
        ),
      )
    : ''

  return div(
    { class: 'su-table-wrap' },
    tableEl(
      attrs(rest, {
        class: cx(
          'su-table',
          striped && 'su-table--striped',
          hover && 'su-table--hover',
          dense && 'su-table--dense',
        ),
      }),
      caption == null ? '' : captionEl(caption),
      head,
      body,
      ...children,
    ),
  )
}

export { table as dataTable }

/**
 * Vertical list of rows.
 *
 * @param {...any} args - `list({ plain, as }, ...items)`
 * @returns {string}
 */
export function list(...args) {
  const { props, children } = parseArgs(args)
  const { plain = false, as, ...rest } = props

  return el(as, ul)(
    attrs(rest, { class: cx('su-list', plain && 'su-list--plain') }),
    ...children,
  )
}

/**
 * One row of a {@link list}.
 *
 * `title` and `description` render the usual two-line layout; `start`
 * and `end` take an avatar, icon or button on either side.
 *
 * @param {...any} args - `listItem({ title, description, start, end, href }, ...children)`
 * @returns {string}
 */
export function listItem(...args) {
  const { props, children } = parseArgs(args)
  const { title, description, start, end, href, interactive = false, as, ...rest } = props

  const content =
    title == null && description == null
      ? children
      : [
          div(
            { class: 'su-list-item-content' },
            title == null ? '' : div({ class: 'su-list-item-title' }, title),
            description == null
              ? ''
              : div({ class: 'su-list-item-description' }, description),
          ),
          ...children,
        ]

  const own = {
    class: cx('su-list-item', interactive && 'su-list-item--interactive'),
  }

  const body = [
    start == null ? '' : div({ class: 'su-list-item-start' }, start),
    ...content,
    end == null ? '' : div({ class: 'su-list-item-end' }, end),
  ]

  // A linked row is still a list item, so the anchor goes inside the <li>.
  if (href) return li(a(attrs({ href, ...rest }, own), ...body))

  return el(as, li)(attrs(rest, own), ...body)
}

/**
 * An image with a caption, as one figure.
 *
 * Pass `src` for the common case, or children for anything else worth
 * captioning — a table, a code block, a chart. `ratio` holds the space
 * before the image loads, so a caption never jumps down the page.
 *
 * @param {...any} args - `figure({ src, alt, caption, ratio }, ...children)`
 * @returns {string}
 */
export function figure(...args) {
  const { props, children } = parseArgs(args)
  const { src, alt, caption, ratio, ...rest } = props

  const media = src
    ? imgEl({ src, alt: alt ?? '', class: 'su-figure-media' })
    : ''

  return figureEl(
    attrs(rest, { class: 'su-figure' }),
    ratio && media
      ? div({ class: 'su-aspect', style: `--su-aspect: ${ratio}` }, media)
      : media,
    ...children,
    caption == null ? '' : figcaption({ class: 'su-figure-caption' }, caption),
  )
}

const CAROUSEL_ALIGN = ['start', 'center', 'end']

/*
 * The test that decides whether the browser draws the dots itself. It is
 * the same condition as `@supports (scroll-marker-group: after)` in
 * `ui.css`, and it sits in front of the import so that a browser with
 * the native markers never fetches a module it has no use for — the
 * handler costs a `CSS.supports()` call and nothing else.
 */
const CAROUSEL_NATIVE = "CSS.supports('scroll-marker-group','after')"

/**
 * Quote a value for a CSS string custom property.
 *
 * The label a slide carries ends up as generated content's alt text,
 * which is a CSS string — so an apostrophe in it has to be escaped or
 * it closes the string early. The attribute itself is already the
 * renderer's problem: it escapes the double quotes on the way out.
 *
 * @param {unknown} value
 * @returns {string}
 */
function cssString(value) {
  return `'${String(value).replace(/[\\']/g, '\\$&').replace(/\s+/g, ' ')}'`
}

/**
 * Slides in a row you scroll through, with no script at all.
 *
 * The component is a scroll container and a flex row that snaps, which
 * is the part every browser already knows how to do: swiping, a
 * trackpad, shift-wheel and the arrow keys all work on the first paint,
 * with nothing loaded and nothing to hydrate.
 *
 * On top of that the browser is asked for two things a stylesheet
 * cannot draw for itself: `::scroll-marker` on each slide and
 * `::scroll-button()` on the track. Where an engine has them it draws
 * the dots and the arrows, names them, wires them to the scroll
 * position, marks the slide that is showing and disables the arrows at
 * the ends — all of it from CSS, with no markup and no state of ours.
 *
 * Where it does not, the dots below fill in: one real link per slide,
 * pointing at its id, which works on its own with nothing loaded. On
 * the first scroll or the first tap they reach for `/su/carousel.js`
 * and start behaving properly instead — the dots follow the scroll, and
 * tapping one scrolls the track without taking the page with it, which
 * a bare fragment cannot help doing. The link is what happens if that
 * module never arrives, and `scrollMargin` is where the window lands
 * when it doesn't.
 *
 * What neither form does is loop back to the first slide or advance on
 * its own. Auto-advancing moves what someone is reading out from under
 * them, and looping cannot be done without cloning slides, so a page
 * that wants either should say so itself.
 *
 * `perView` is a custom property, so a media query of your own can
 * change it without touching the markup:
 * `@media (min-width: 48em) { .gallery { --su-carousel-per-view: 3 } }`.
 *
 * @param {...any} args - `carousel({ items, perView, min, gap, align, snap, dots, arrows, color, label, name, scrollMargin }, ...slides)`
 * @returns {string}
 */
export function carousel(...args) {
  const { props, children } = parseArgs(args)
  const {
    items,
    perView = 1,
    min,
    gap = 'md',
    align = 'start',
    snap = 'mandatory',
    dots = true,
    arrows = true,
    color = 'primary',
    label = 'Carousel',
    previousLabel = 'Previous slide',
    nextLabel = 'Next slide',
    slideLabel,
    name,
    scrollMargin,
    as,
    ...rest
  } = props

  const entries = [...(Array.isArray(items) ? items : []), ...children]
  const nameOf =
    typeof slideLabel === 'function' ? slideLabel : (index) => String(index + 1)

  /*
   * What the fallback dots point at, so it has to be unique on the page.
   * An `id` on the carousel is the readable way to set it and `name` the
   * explicit one; failing both it is a digest of the slides, which is
   * deterministic — the same page builds to the same HTML every time —
   * and which differs between two carousels without either of them
   * having to be told about the other.
   */
  const group = String(
    name ??
      rest.id ??
      `su-c${createHash('sha256').update(JSON.stringify(entries)).digest('hex').slice(0, 6)}`,
  )

  /*
   * Every slide is wrapped here rather than left to the caller, because
   * the wrapper is what carries the id its dot links to and the label
   * its dot is named by — and a dot with no name is a link a screen
   * reader can only read out as its own URL. Passing an object instead
   * of a child is how a slide names itself something better than its
   * number, or takes an id of its own worth linking to.
   */
  const slides = entries.map((entry, index) => {
    const item =
      entry != null && typeof entry === 'object' && !Array.isArray(entry)
        ? entry
        : { content: entry }
    const { content, label: own, ...slideRest } = item
    const id = slideRest.id ?? `${group}-${index + 1}`
    const slideName = String(own ?? nameOf(index, entries.length))

    return {
      id,
      label: slideName,
      markup: div(
        attrs(
          { ...slideRest, id },
          {
            class: 'su-carousel-slide',
            style: { '--su-carousel-label': cssString(slideName) },
          },
        ),
        content ?? '',
      ),
    }
  })

  const count = Number(perView)

  return el(as, div)(
    attrs(rest, {
      class: cx(
        'su-carousel',
        dots && 'su-carousel--dots',
        arrows && 'su-carousel--arrows',
        colorClass(color),
      ),
      style: {
        '--su-carousel-per-view': count > 0 ? count : undefined,
        '--su-carousel-min': min,
        '--su-carousel-gap': space(gap),
        '--su-carousel-align': oneOf(align, CAROUSEL_ALIGN, 'start'),
        /*
         * The whole `scroll-snap-type` value, not just the strictness:
         * `x none` is not a thing you can write, so turning snapping off
         * has to replace the axis as well.
         */
        '--su-carousel-snap': snap === false || snap === 'none'
          ? 'none'
          : snap === 'proximity'
            ? 'x proximity'
            : undefined,
        // Only the arrows read these, and only their names are ours to
        // set: the glyph is the stylesheet's, the way `‹` and `›` are
        // pagination's.
        '--su-carousel-previous': arrows ? cssString(previousLabel) : undefined,
        '--su-carousel-next': arrows ? cssString(nextLabel) : undefined,
        '--su-carousel-scroll-margin': space(scrollMargin),
      },
    }),
    div(
      {
        class: 'su-carousel-track',
        /*
         * A scrollable region needs a name and a place in the tab order,
         * or a keyboard is the one way through it that does not work.
         * Chrome now focuses scrollers on its own; every other engine
         * needs this said out loud.
         */
        role: 'group',
        'aria-label': String(label),
        tabindex: '0',
        /*
         * Every way a carousel can move ends in a scroll event — a
         * swipe, a trackpad, the arrow keys, a scrollbar drag, a
         * fragment on the way in — so this one attribute is the whole
         * of "the dots follow the scroll". The module is fetched once
         * and comes from the cache on every event after.
         */
        ...(dots ? { onscroll: `${CAROUSEL_NATIVE}||${handler('carousel', 'sync(this)')}` } : {}),
      },
      ...slides.map((slide) => slide.markup),
    ),
    /*
     * Hidden by the stylesheet wherever `::scroll-marker` exists, so
     * nobody sees two rows of dots — and hidden with `display: none`,
     * which takes the links out of the accessibility tree along with the
     * picture, because there the native markers are the dots.
     *
     * The first dot is marked here because at rest that is the slide
     * showing, so the mark is right before anything has run and on a
     * page where nothing ever does. From the first scroll onwards
     * `carousel.js` owns it. `aria-current` is both the state a screen
     * reader reads and the hook the stylesheet colours, so there is one
     * thing to keep true rather than two that could disagree.
     */
    dots
      ? nav(
          { class: 'su-carousel-dots', 'aria-label': String(label) },
          ...slides.map((slide, index) =>
            a({
              class: 'su-carousel-dot',
              href: `#${slide.id}`,
              'aria-label': slide.label,
              ...(index === 0 ? { 'aria-current': 'true' } : {}),
              /*
               * `preventDefault()` has to run before the import, not
               * inside it: a dynamic import settles a microtask later,
               * by which time the browser has already followed the
               * fragment and the cancel is too late to mean anything.
               * Cancelling first is what keeps a tap from scrolling the
               * page, and the rejection path puts the plain link back if
               * the module never loads.
               */
              onclick: `event.preventDefault();${handler(
                'carousel',
                'go(this,event),()=>{location.hash=this.hash}',
              )}`,
            }),
          ),
        )
      : '',
  )
}
