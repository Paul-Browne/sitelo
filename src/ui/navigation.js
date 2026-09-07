import { a, button as buttonEl, div, header, li, nav, ol, span } from 'javascript-to-html'

import { handler, tablistKeydown } from './handlers.js'
import { icon } from './icons.js'
import { attrs, colorClass, cx, el, parseArgs } from './internal.js'

/**
 * Trail of ancestors ending at the current page.
 *
 * The last item is marked `aria-current="page"` and rendered as plain
 * text, because a link to the page you are on is noise.
 *
 * @param {...any} args - `breadcrumbs({ items, separator, label }, ...children)`
 * @returns {string}
 */
export function breadcrumbs(...args) {
  const { props, children } = parseArgs(args)
  const { items = [], separator = '/', label = 'Breadcrumb', ...rest } = props

  const rendered = items.map((entry, index) => {
    const item = typeof entry === 'object' && entry != null ? entry : { label: entry }
    const isLast = index === items.length - 1

    return li(
      {
        class: 'su-breadcrumb-item',
        ...(isLast ? { 'aria-current': 'page' } : {}),
      },
      index > 0
        ? span({ class: 'su-breadcrumb-separator', 'aria-hidden': 'true' }, separator)
        : '',
      isLast || !item.href ? span(item.label) : a({ href: item.href }, item.label),
    )
  })

  return nav(
    { 'aria-label': String(label) },
    attrs(rest, {}),
    ol({ class: 'su-breadcrumbs' }, ...rendered, ...children),
  )
}

/**
 * Which page numbers to show around the current one.
 *
 * Always the first and last page, a window around the current one, and
 * an ellipsis wherever the sequence jumps.
 *
 * @param {number} page
 * @param {number} count
 * @param {number} siblings
 * @returns {(number | 'gap')[]}
 */
function pageWindow(page, count, siblings) {
  const pages = new Set([1, count])

  for (let offset = -siblings; offset <= siblings; offset += 1) {
    const candidate = page + offset

    if (candidate >= 1 && candidate <= count) pages.add(candidate)
  }

  const sorted = [...pages].sort((left, right) => left - right)
  const out = []

  sorted.forEach((value, index) => {
    if (index > 0 && value - sorted[index - 1] > 1) out.push('gap')
    out.push(value)
  })

  return out
}

/**
 * Numbered pagination.
 *
 * `href` is a function from page number to URL, so this works for
 * `/blog/2` and `/blog?page=2` alike. Without it the numbers render as
 * buttons carrying `data-su-page`, for a script to pick up.
 *
 * @param {object} [props] - `{ page, count, href, siblings, color, label, previousLabel, nextLabel }`
 * @returns {string}
 */
export function pagination(props = {}) {
  const {
    page = 1,
    count = 1,
    href,
    siblings = 1,
    color = 'primary',
    label = 'Pagination',
    previousLabel = '‹',
    nextLabel = '›',
    ...rest
  } = props

  const current = Math.min(Math.max(1, Number(page) || 1), Math.max(1, Number(count) || 1))
  const total = Math.max(1, Number(count) || 1)

  const link = (target, content, extra = {}) => {
    const disabled = target == null

    if (disabled || !href) {
      return buttonEl(
        {
          type: 'button',
          class: cx('su-page-link', disabled && 'su-page-link--disabled'),
          ...(disabled ? { disabled: true } : { 'data-su-page': target }),
          ...extra,
        },
        content,
      )
    }

    return a({ href: href(target), class: 'su-page-link', ...extra }, content)
  }

  const items = pageWindow(current, total, Number(siblings) || 0).map((entry) =>
    entry === 'gap'
      ? li({ class: 'su-page-ellipsis', 'aria-hidden': 'true' }, '…')
      : li(
          link(entry, String(entry), {
            ...(entry === current ? { 'aria-current': 'page' } : {}),
            'aria-label': `Page ${entry}`,
          }),
        ),
  )

  return nav(
    { 'aria-label': String(label) },
    attrs(rest, { class: colorClass(color) }),
    ol(
      { class: 'su-pagination' },
      li(link(current > 1 ? current - 1 : null, previousLabel, { 'aria-label': 'Previous page' })),
      ...items,
      li(link(current < total ? current + 1 : null, nextLabel, { 'aria-label': 'Next page' })),
    ),
  )
}

/**
 * Tabs, in either of the two shapes a static site actually needs.
 *
 * Give each item an `href` and they are links — one page per tab, no
 * script, `aria-current` on the active one. Give each item a `panel`
 * and they become a real tablist whose panels swap in place; that form
 * needs `sitelo/ui/client`, and with the script absent the active panel
 * is simply the one that shows.
 *
 * @param {...any} args - `tabs({ items, value, variant, color, label }, ...children)`
 * @returns {string}
 */
export function tabs(...args) {
  const { props, children } = parseArgs(args)
  const {
    items = [],
    value,
    variant = 'underline',
    color = 'primary',
    label = 'Tabs',
    ...rest
  } = props

  const normalized = items.map((entry, index) => {
    const item = typeof entry === 'object' && entry != null ? entry : { label: entry }

    return { id: item.id ?? `tab-${index + 1}`, ...item }
  })

  const panelled = normalized.some((item) => item.panel != null)
  const active =
    normalized.find((item) => item.id === value) ??
    normalized.find((item) => item.active) ??
    normalized[0]

  const tablist = div(
    {
      class: 'su-tablist',
      ...(panelled
        ? {
            role: 'tablist',
            'aria-label': String(label),
            /*
             * Roving focus is a property of the list, not of one tab, so
             * this is the one handler the component delegates: it reads
             * `event.target` rather than `this`.
             */
            onkeydown: tablistKeydown(),
          }
        : {}),
    },
    ...normalized.map((item) => {
      const selected = item === active

      if (!panelled) {
        return a(
          {
            class: 'su-tab',
            href: item.href ?? '#',
            ...(selected ? { 'aria-current': 'page' } : {}),
          },
          item.label,
        )
      }

      return buttonEl(
        {
          type: 'button',
          class: 'su-tab',
          role: 'tab',
          id: `${item.id}-tab`,
          'aria-controls': `${item.id}-panel`,
          'aria-selected': selected ? 'true' : 'false',
          tabindex: selected ? 0 : -1,
          ...(item.disabled
            ? { disabled: true }
            : { onclick: handler('tabs', 'select(this)') }),
        },
        item.label,
      )
    }),
  )

  const panels = panelled
    ? normalized.map((item) =>
        div(
          {
            id: `${item.id}-panel`,
            role: 'tabpanel',
            'aria-labelledby': `${item.id}-tab`,
            tabindex: 0,
            class: 'su-tabpanel',
            ...(item === active ? {} : { hidden: true }),
          },
          item.panel ?? '',
        ),
      )
    : []

  return div(
    attrs(rest, {
      class: cx('su-tabs', variant === 'pills' && 'su-tabs--pills', colorClass(color)),
    }),
    tablist,
    ...panels,
    ...children,
  )
}

/**
 * Top bar: brand on one side, actions on the other.
 *
 * @param {...any} args - `appBar({ brand, sticky, blur }, ...children)`
 * @returns {string}
 */
export function appBar(...args) {
  const { props, children } = parseArgs(args)
  const { brand, href = '/', sticky = false, blur = false, as, ...rest } = props

  return el(as, header)(
    attrs(rest, {
      class: cx('su-appbar', sticky && 'su-appbar--sticky', blur && 'su-appbar--blur'),
    }),
    brand == null ? '' : a({ class: 'su-appbar-brand', href }, brand),
    ...children,
  )
}

/**
 * Navigation cluster for an {@link appBar}.
 *
 * @param {...any} args
 * @returns {string}
 */
export function appBarNav(...args) {
  const { props, children } = parseArgs(args)

  return nav(attrs(props, { class: 'su-appbar-nav' }), ...children)
}

/** Flexible gap that pushes what follows to the far end of the bar. */
export function appBarSpacer(props = {}) {
  return div(attrs(props, { class: 'su-appbar-spacer' }))
}

/**
 * Trailing action cluster for an {@link appBar}.
 *
 * @param {...any} args
 * @returns {string}
 */
export function appBarActions(...args) {
  const { props, children } = parseArgs(args)

  return div(attrs(props, { class: 'su-appbar-actions' }), ...children)
}

/**
 * Link styled for a navigation bar. `current` marks the active page.
 *
 * @param {...any} args - `navLink({ href, current, color }, ...children)`
 * @returns {string}
 */
export function navLink(...args) {
  const { props, children } = parseArgs(args)
  const { current = false, color = 'primary', ...rest } = props

  return a(
    current ? { 'aria-current': 'page' } : {},
    attrs(rest, { class: cx('su-nav-link', colorClass(color)) }),
    ...children,
  )
}

/*
 * Stroke-width 2 rather than the set's 1.8: these render at 1.15em on a
 * toggle, small enough that the default weight goes spindly next to the
 * button's own text.
 */
const SUN_ICON = icon('sun', {
  class: 'su-theme-icon su-theme-icon-sun',
  'stroke-width': 2,
})

const MOON_ICON = icon('moon', {
  class: 'su-theme-icon su-theme-icon-moon',
  'stroke-width': 2,
})

/**
 * Light/dark toggle.
 *
 * Wires itself: the button imports `theme.js` when it is first pressed.
 * Put `themeScript()` in the head as well, so the stored choice
 * survives a navigation without a flash and the button starts out
 * saying which theme is on. The icon itself is pure CSS, so it is right
 * on the first paint.
 *
 * @param {object} [props] - `{ label, size, variant, color }`
 * @returns {string}
 */
export function themeToggle(props = {}) {
  const {
    label = 'Toggle dark mode',
    variant = 'ghost',
    color = 'neutral',
    ...rest
  } = props

  return buttonEl(
    {
      type: 'button',
      'data-su-theme-toggle': '',
      onclick: handler('theme', 'toggle(this)'),
      'aria-label': String(label),
      title: String(label),
    },
    attrs(rest, {
      class: cx('su-btn', `su-btn--${variant}`, 'su-btn--md', 'su-icon-btn', 'su-theme-toggle', colorClass(color, 'neutral')),
    }),
    span({ class: 'su-btn-icon' }, SUN_ICON, MOON_ICON),
  )
}
