import { a, div, h3, img as imgEl, p as pEl } from 'javascript-to-html'

import { attrs, el, oneOf, parseArgs, space } from './internal.js'

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
