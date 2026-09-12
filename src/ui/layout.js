import { a, div, h3, img as imgEl, p as pEl } from 'javascript-to-html'

import { attrs, el, oneOf, parseArgs, space } from './internal.js'
import { DEFAULTS, isDefault, tile } from './runtime/grain.js'

const CONTAINER_SIZES = ['sm', 'md', 'lg', 'xl', 'full']

/**
 * Centered, width-limited page column.
 *
 * @param {...any} args - `container({ size, gutter, as }, ...children)`
 * @returns {string}
 */
export function container(...args) {
  const { props, children } = parseArgs(args)
  const { size = 'lg', width, gutter, as, ...rest } = props

  return el(as, div)(
    attrs(rest, {
      class: `su-container su-container--${oneOf(size, CONTAINER_SIZES, 'lg')}`,
      style: {
        '--su-container-width': width,
        '--su-container-gutter': space(gutter),
      },
    }),
    ...children,
  )
}

/**
 * Wrapper that lays a film grain over whatever it contains.
 *
 * The texture is a static noise tile drawn on `::after`, so it costs
 * one paint and never re-rasterises when the content under it changes —
 * unlike a `filter`, which has to be recomputed whenever anything
 * beneath it moves. It sits above the children and ignores the pointer,
 * and it takes the box's own `border-radius`, so wrapping a rounded
 * surface does not square its corners off.
 *
 * It has no width or padding of its own: put a {@link container} inside
 * for a textured full-bleed band, or wrap a card, a hero or a section
 * to grain just that.
 *
 * `type`, `frequency`, `octaves`, `seed` and `color` are the turbulence
 * itself, and touching any of them builds the tile here rather than
 * using the stylesheet's. `opacity` is how far it is pushed once drawn;
 * left alone, the theme sets it, and that is the value the two themes
 * are balanced on. The SVG itself is written in `runtime/grain.js`, so
 * that `setGrain()` in the browser draws exactly what this does.
 *
 * @param {...any} args - `grain({ opacity, type, frequency, octaves, seed, color, blend, as }, ...children)`
 * @returns {string}
 */
export function grain(...args) {
  const { props, children } = parseArgs(args)
  const { opacity, type, frequency, octaves, seed, color, blend, as, ...rest } = props

  const noise = { ...DEFAULTS, color }

  for (const [key, value] of Object.entries({ type, frequency, octaves, seed })) {
    if (value != null) noise[key] = value
  }

  return el(as, div)(
    attrs(rest, {
      class: 'su-grain',
      style: {
        '--su-grain-opacity': opacity,
        '--su-grain-blend': blend,
        // Only a call that changed something pays for an image of its own;
        // a colour the filter cannot read counts as no change.
        '--su-grain-image': isDefault(noise) ? undefined : tile(noise),
      },
    }),
    ...children,
  )
}

/**
 * Flex row or column with a spacing token for the gap.
 *
 * @param {...any} args - `stack({ direction, gap, align, justify, wrap, inline, as }, ...children)`
 * @returns {string}
 */
export function stack(...args) {
  const { props, children } = parseArgs(args)
  const {
    direction = 'column',
    gap = 'md',
    align,
    justify,
    wrap,
    inline = false,
    as,
    ...rest
  } = props

  const row = direction === 'row'

  return el(as, div)(
    attrs(rest, {
      class: `su-stack${row ? ' su-stack--row' : ''}${inline ? ' su-stack--inline' : ''}`,
      style: {
        '--su-stack-gap': space(gap),
        '--su-stack-align': align,
        '--su-stack-justify': justify,
        '--su-stack-wrap': wrap === true ? 'wrap' : wrap || undefined,
        '--su-stack-direction': row || direction === 'column' ? undefined : direction,
      },
    }),
    ...children,
  )
}

/**
 * Responsive grid.
 *
 * With no `columns` it auto-fits as many tracks of at least `min` as
 * will fit, which is the behaviour a card list wants and needs no media
 * queries. Pass `columns` for a fixed count, or any raw
 * `grid-template-columns` value.
 *
 * @param {...any} args - `grid({ columns, min, gap, align, as }, ...children)`
 * @returns {string}
 */
export function grid(...args) {
  const { props, children } = parseArgs(args)
  const { columns, min, gap = 'md', align, as, ...rest } = props

  const template =
    typeof columns === 'number'
      ? `repeat(${columns}, minmax(0, 1fr))`
      : typeof columns === 'string'
        ? columns
        : undefined

  return el(as, div)(
    attrs(rest, {
      class: 'su-grid',
      style: {
        '--su-grid-columns': template,
        '--su-grid-min': min,
        '--su-grid-gap': space(gap),
        '--su-grid-align': align,
      },
    }),
    ...children,
  )
}

/**
 * Rule between sections, optionally with a centered label.
 *
 * @param {...any} args - `divider({ orientation, spacing }, ...label)`
 * @returns {string}
 */
export function divider(...args) {
  const { props, children } = parseArgs(args)
  const { orientation = 'horizontal', spacing, ...rest } = props
  const vertical = orientation === 'vertical'

  // Defaults first: javascript-to-html merges attribute objects left to
  // right, so anything the caller passed still wins.
  return div(
    { role: 'separator', ...(vertical ? { 'aria-orientation': 'vertical' } : {}) },
    attrs(rest, {
      class: `su-divider${vertical ? ' su-divider--vertical' : ''}`,
      style: { '--su-divider-space': space(spacing) },
    }),
    ...children,
  )
}

const CARD_VARIANTS = ['outlined', 'elevated', 'flat']

/**
 * Surface for grouped content.
 *
 * Passing `href` makes the whole card a link, with the hover lift that
 * goes with it.
 *
 * @param {...any} args - `card({ variant, href, padding }, ...children)`
 * @returns {string}
 */
export function card(...args) {
  const { props, children } = parseArgs(args)
  const { variant = 'outlined', href, padding, ...rest } = props
  const resolved = oneOf(variant, CARD_VARIANTS, 'outlined')

  const own = {
    class: `su-card su-card--${resolved}${href ? ' su-card--interactive' : ''}`,
    style: { '--su-card-padding': space(padding) },
  }

  return href
    ? a(attrs({ href, ...rest }, own), ...children)
    : div(attrs(rest, own), ...children)
}

/**
 * Card header. Give it a `title` and `subtitle`, children, or both.
 *
 * @param {...any} args - `cardHeader({ title, subtitle }, ...children)`
 * @returns {string}
 */
export function cardHeader(...args) {
  const { props, children } = parseArgs(args)
  const { title, subtitle, ...rest } = props

  const text =
    title == null && subtitle == null
      ? ''
      : div(
          { class: 'su-card-header-text' },
          title == null ? '' : cardTitle(title),
          subtitle == null ? '' : cardSubtitle(subtitle),
        )

  return div(attrs(rest, { class: 'su-card-header' }), text, ...children)
}

/** @param {...any} args @returns {string} */
export function cardTitle(...args) {
  const { props, children } = parseArgs(args)
  const { as, ...rest } = props

  return el(as, h3)(attrs(rest, { class: 'su-card-title' }), ...children)
}

/** @param {...any} args @returns {string} */
export function cardSubtitle(...args) {
  const { props, children } = parseArgs(args)

  return pEl(attrs(props, { class: 'su-card-subtitle' }), ...children)
}

/** @param {...any} args @returns {string} */
export function cardBody(...args) {
  const { props, children } = parseArgs(args)

  return div(attrs(props, { class: 'su-card-body' }), ...children)
}

/**
 * Card footer. `divided` adds the hairline above it.
 *
 * @param {...any} args
 * @returns {string}
 */
export function cardFooter(...args) {
  const { props, children } = parseArgs(args)
  const { divided = false, ...rest } = props

  return div(
    attrs(rest, {
      class: `su-card-footer${divided ? ' su-card-footer--divided' : ''}`,
    }),
    ...children,
  )
}

/**
 * Image that fills the top of a card at a fixed aspect ratio.
 *
 * @param {object} props - `{ src, alt, ratio, ... }`
 * @returns {string}
 */
export function cardMedia(props = {}) {
  const { ratio, alt = '', ...rest } = props

  return imgEl(
    attrs({ alt, ...rest }, {
      class: 'su-card-media',
      style: { '--su-card-media-ratio': ratio },
    }),
  )
}

/**
 * Hold a box at a fixed aspect ratio.
 *
 * The child fills it and is cropped rather than letterboxed, which is
 * what an embed or a cover image wants — and because the height is
 * known before the content loads, nothing on the page shifts when it
 * arrives.
 *
 * @param {...any} args - `aspectRatio({ ratio }, ...children)`
 * @returns {string}
 */
export function aspectRatio(...args) {
  const { props, children } = parseArgs(args)
  const { ratio, as, ...rest } = props

  return el(as, div)(
    attrs(rest, {
      class: 'su-aspect',
      style: { '--su-aspect': ratio },
    }),
    ...children,
  )
}
