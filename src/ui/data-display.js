import {
  a,
  caption as captionEl,
  div,
  img as imgEl,
  li,
  span,
  table as tableEl,
  tbody,
  td,
  th,
  thead,
  tr,
  ul,
} from 'javascript-to-html'

import { attrs, colorClass, cx, el, oneOf, parseArgs, SIZES } from './internal.js'

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

  return span(
    attrs(rest, { class: 'su-badge-root' }),
    ...children,
    span(
      {
        class: cx('su-badge', dot && 'su-badge--dot', colorClass(color, 'danger')),
        ...(label ? { 'aria-label': String(label) } : {}),
        ...(dot && !label ? { 'aria-hidden': 'true' } : {}),
      },
      display,
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
