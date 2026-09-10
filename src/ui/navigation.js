import {
  a,
  button as buttonEl,
  div,
  header,
  input,
  label as labelEl,
  li,
  nav,
  ol,
  section,
  span,
} from 'javascript-to-html'

import { handler } from './handlers.js'
import { icon } from './icons.js'
import { attrs, colorClass, cx, el, parseArgs, space } from './internal.js'

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
 * Give each item an `href` and they are links — one page per tab,
 * `aria-current` on the active one. Give each item a `panel` and they
 * become a radio group whose panels swap in place: the label a click
 * lands on checks a radio the stylesheet keeps out of sight, and the
 * panel that follows that radio is the one CSS shows. No script — and
 * arrow keys move between the tabs because a radio group already does.
 *
 * Give the panelled items a fragment `href` as well and the radios give
 * way to links: the URL names the tab, `:target` picks it out, and the
 * choice can be linked to and walked back through history. The id goes
 * on the tab rather than on the panel it shows, because the browser
 * scrolls whatever the URL names to the top of the window — naming the
 * panel would push the tabs off the screen you just clicked them on.
 * One element per document can be `:target`, so this form is for one
 * set of tabs on a page rather than several.
 *
 * The two layouts differ for that reason. Links alone sit in a
 * `.su-tablist` row that scrolls sideways when there are many of them;
 * panels cannot, because each one has to follow its own tab for
 * `:checked + .su-tab + .su-tabpanel` — and for `.su-tab:has(+
 * .su-tabpanel:target)` — to reach it, so a long row of them wraps
 * instead.
 *
 * @param {...any} args - `tabs({ items, value, variant, color, label, name, scrollMargin }, ...children)`
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
    name,
    scrollMargin,
    ...rest
  } = props

  const normalized = items.map((entry, index) => {
    const item = typeof entry === 'object' && entry != null ? entry : { label: entry }

    return { id: item.id ?? `tab-${index + 1}`, ...item }
  })

  const panelled = normalized.some((item) => item.panel != null)
  /*
   * Every panelled item has to carry a fragment for this form, not just
   * one: a set where half the tabs move the URL and half do not has no
   * state a browser could keep.
   */
  const targeted =
    panelled &&
    normalized.every((item) => {
      const href = String(item.href ?? '')

      /* A bare `#` names nothing, so it cannot pick out a tab. */
      return href.startsWith('#') && href.length > 1
    })
  const active =
    normalized.find((item) => item.id === value) ??
    normalized.find((item) => item.active) ??
    normalized[0]

  const className = cx(
    'su-tabs',
    panelled && 'su-tabs--panels',
    targeted && 'su-tabs--target',
    variant === 'pills' && 'su-tabs--pills',
    colorClass(color),
  )

  if (!panelled) {
    return div(
      attrs(rest, { class: className }),
      div(
        { class: 'su-tablist' },
        ...normalized.map((item) =>
          a(
            {
              class: 'su-tab',
              href: item.href ?? '#',
              ...(item === active ? { 'aria-current': 'page' } : {}),
            },
            item.label,
          ),
        ),
      ),
      ...children,
    )
  }

  if (targeted) {
    /*
     * No `aria-current` here. It would be written once and be wrong the
     * moment you picked another tab, and CSS cannot correct it — the
     * same reason this component is not an ARIA tablist. The tab that
     * is current is the one the URL names.
     */
    return div(
      attrs(
        { role: 'group', 'aria-label': String(label), ...rest },
        {
          class: className,
          /*
           * How far above the tab the window stops. A site whose header
           * is sticky needs at least its height here, or the tab it just
           * scrolled to arrives underneath it.
           */
          style: { '--su-tab-scroll-margin': space(scrollMargin) },
        },
      ),
      ...normalized.flatMap((item) => {
        const fragment = item.href.slice(1)

        return [
          a(
            {
              class: cx('su-tab', item === active && 'su-tab--default'),
              id: fragment,
              /* A link with nowhere to go: not clickable, not focusable. */
              ...(item.disabled ? { 'aria-disabled': 'true' } : { href: item.href }),
            },
            item.label,
          ),
          section(
            {
              class: cx('su-tabpanel', item === active && 'su-tabpanel--default'),
              id: `${item.id}-panel`,
              'aria-labelledby': fragment,
            },
            item.panel ?? '',
          ),
        ]
      }),
      ...children,
    )
  }

  /*
   * What makes the radios one group, and what keeps two sets of tabs on
   * the same page from becoming one. It is derived from the first id so
   * that the same page builds to the same HTML; a page that gives its
   * items ids — and the ids are in the markup either way — gets
   * distinct groups without asking for them.
   */
  const group = String(name ?? `su-${normalized[0]?.id ?? 'tabs'}`)

  return div(
    attrs({ role: 'group', 'aria-label': String(label), ...rest }, { class: className }),
    ...normalized.flatMap((item) => [
      input({
        class: 'su-tab-input',
        type: 'radio',
        name: group,
        id: `${item.id}-tab`,
        'aria-controls': `${item.id}-panel`,
        ...(item === active ? { checked: true } : {}),
        ...(item.disabled ? { disabled: true } : {}),
      }),
      labelEl({ class: 'su-tab', id: `${item.id}-label`, for: `${item.id}-tab` }, item.label),
      section(
        { class: 'su-tabpanel', id: `${item.id}-panel`, 'aria-labelledby': `${item.id}-label` },
        item.panel ?? '',
      ),
    ]),
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
