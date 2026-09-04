/**
 * Page sections — the blocks a page is assembled from, rather than the
 * controls inside it. A hero, a footer, a row of numbers, a set of
 * steps, a timeline, a screenshot in a frame.
 */

import {
  div,
  footer as footerEl,
  h1,
  li,
  ol,
  p as pEl,
  section,
  span,
  ul,
} from 'javascript-to-html'

import { attrs, colorClass, cx, el, oneOf, parseArgs, SIZES } from './internal.js'

/**
 * The top of a landing page: a headline, a sentence, and the actions
 * that follow from them.
 *
 * Passing `media` puts it beside the text on a wide screen and above it
 * on a narrow one. Children are the action row.
 *
 * @param {...any} args - `hero({ eyebrow, title, description, media, align, level, as }, ...actions)`
 * @returns {string}
 */
export function hero(...args) {
  const { props, children } = parseArgs(args)
  const {
    eyebrow,
    title,
    description,
    media,
    align = 'center',
    level = 1,
    as,
    ...rest
  } = props

  /*
   * A hero is usually the page's h1 — but not when it is a section part
   * way down one, so the level is a prop rather than baked in.
   */
  const titleTag = el(`h${Math.min(6, Math.max(1, Number(level) || 1))}`, h1)

  const content = div(
    { class: 'su-hero-content' },
    eyebrow == null ? '' : pEl({ class: 'su-hero-eyebrow' }, eyebrow),
    title == null ? '' : titleTag({ class: 'su-hero-title' }, title),
    description == null ? '' : pEl({ class: 'su-hero-description' }, description),
    children.length ? div({ class: 'su-hero-actions' }, ...children) : '',
  )

  return el(as, section)(
    attrs(rest, {
      class: cx(
        'su-hero',
        `su-hero--${oneOf(align, ['center', 'start'], 'center')}`,
        media && 'su-hero--split',
      ),
    }),
    content,
    media == null ? '' : div({ class: 'su-hero-media' }, media),
  )
}

/**
 * Site footer: a row of columns, and a bottom line under them.
 *
 * Exported as both `footer` and `siteFooter`; the second name exists
 * because `footer` is also javascript-to-html's `<footer>` element.
 *
 * @param {...any} args - `footer({ columns }, ...children)`
 * @returns {string}
 */
export function footer(...args) {
  const { props, children } = parseArgs(args)
  const { columns, as, ...rest } = props

  return el(as, footerEl)(
    attrs(rest, {
      class: 'su-footer',
      style: { '--su-footer-columns': columns },
    }),
    ...children,
  )
}

export { footer as siteFooter }

/**
 * One column of links in a footer.
 *
 * @param {...any} args - `footerColumn({ title }, ...links)`
 * @returns {string}
 */
export function footerColumn(...args) {
  const { props, children } = parseArgs(args)
  const { title, ...rest } = props

  return div(
    attrs(rest, { class: 'su-footer-column' }),
    title == null ? '' : pEl({ class: 'su-footer-column-title' }, title),
    ul({ class: 'su-footer-links' }, ...children.map((child) => li(child))),
  )
}

/**
 * The line under the columns — copyright, a licence, a locale switch.
 *
 * @param {...any} args
 * @returns {string}
 */
export function footerBottom(...args) {
  const { props, children } = parseArgs(args)

  return div(attrs(props, { class: 'su-footer-bottom' }), ...children)
}

/**
 * A single number worth looking at, with what it means.
 *
 * @param {object} [props] - `{ label, value, change, color, icon, help }`
 * @returns {string}
 */
export function stat(props = {}) {
  const { label, value, change, color, icon, help, ...rest } = props

  return div(
    attrs(rest, { class: cx('su-stat', color && colorClass(color)) }),
    icon == null ? '' : div({ class: 'su-stat-icon', 'aria-hidden': 'true' }, icon),
    label == null ? '' : pEl({ class: 'su-stat-label' }, label),
    value == null ? '' : pEl({ class: 'su-stat-value' }, value),
    change == null ? '' : pEl({ class: 'su-stat-change' }, change),
    help == null ? '' : pEl({ class: 'su-stat-help' }, help),
  )
}

/**
 * A row of stats, joined into one surface.
 *
 * @param {...any} args - `statGroup({ columns }, ...stats)`
 * @returns {string}
 */
export function statGroup(...args) {
  const { props, children } = parseArgs(args)
  const { columns, ...rest } = props

  return div(
    attrs(rest, {
      class: 'su-stat-group',
      style: { '--su-stat-columns': columns },
    }),
    ...children,
  )
}

/**
 * A numbered flow, with the steps behind you marked done.
 *
 * `current` is the index of the step in progress; everything before it
 * is complete and everything after is still to come.
 *
 * @param {object} [props] - `{ items, current, direction }`
 * @returns {string}
 */
export function steps(props = {}) {
  const { items = [], current = 0, direction = 'horizontal', label, ...rest } = props
  const active = Number(current)

  const rendered = items.map((entry, index) => {
    const item = typeof entry === 'object' && entry != null ? entry : { title: entry }
    const state = index < active ? 'complete' : index === active ? 'current' : 'upcoming'

    return li(
      {
        class: `su-step su-step--${state}`,
        ...(state === 'current' ? { 'aria-current': 'step' } : {}),
      },
      span(
        { class: 'su-step-marker', 'aria-hidden': 'true' },
        // A tick reads faster than a number for something already done.
        state === 'complete' ? '✓' : String(index + 1),
      ),
      div(
        { class: 'su-step-content' },
        pEl({ class: 'su-step-title' }, item.title ?? ''),
        item.description == null
          ? ''
          : pEl({ class: 'su-step-description' }, item.description),
      ),
    )
  })

  return ol(
    { ...(label ? { 'aria-label': String(label) } : {}) },
    attrs(rest, {
      class: cx('su-steps', direction === 'vertical' && 'su-steps--vertical'),
    }),
    ...rendered,
  )
}

/**
 * Entries in order, down a line.
 *
 * Build it from `items`, or from {@link timelineItem} children when the
 * entries are not uniform enough for an array.
 *
 * @param {...any} args - `timeline({ items }, ...children)`
 * @returns {string}
 */
export function timeline(...args) {
  const { props, children } = parseArgs(args)
  const { items = [], ...rest } = props

  const rendered = items.map((entry) =>
    timelineItem(typeof entry === 'object' && entry != null ? entry : { title: entry }),
  )

  return ol(attrs(rest, { class: 'su-timeline' }), ...rendered, ...children)
}

/**
 * One entry on a timeline.
 *
 * @param {...any} args - `timelineItem({ title, description, time, icon, color }, ...children)`
 * @returns {string}
 */
export function timelineItem(...args) {
  const { props, children } = parseArgs(args)
  const { title, description, time, icon, color, ...rest } = props

  return li(
    attrs(rest, { class: cx('su-timeline-item', color && colorClass(color)) }),
    span({ class: 'su-timeline-marker', 'aria-hidden': 'true' }, icon ?? ''),
    div(
      { class: 'su-timeline-content' },
      time == null ? '' : pEl({ class: 'su-timeline-time' }, time),
      title == null ? '' : pEl({ class: 'su-timeline-title' }, title),
      description == null
        ? ''
        : pEl({ class: 'su-timeline-description' }, description),
      ...children,
    ),
  )
}

const MOCKUP_VARIANTS = ['browser', 'window', 'phone', 'code']

/**
 * A screenshot in a frame.
 *
 * Four frames: a browser with an address bar, a bare window, a phone,
 * and a terminal. The frame is decoration — it is `aria-hidden`, so a
 * screen reader gets the content and not a description of chrome.
 *
 * @param {...any} args - `mockup({ variant, url, size }, ...children)`
 * @returns {string}
 */
export function mockup(...args) {
  const { props, children } = parseArgs(args)
  const { variant = 'browser', url, size = 'md', ...rest } = props

  const kind = oneOf(variant, MOCKUP_VARIANTS, 'browser')
  const dots = span(
    { class: 'su-mockup-dots', 'aria-hidden': 'true' },
    span({ class: 'su-mockup-dot' }),
    span({ class: 'su-mockup-dot' }),
    span({ class: 'su-mockup-dot' }),
  )

  const bar =
    kind === 'browser'
      ? div(
          { class: 'su-mockup-bar' },
          dots,
          span({ class: 'su-mockup-url' }, url ?? ''),
        )
      : kind === 'window' || kind === 'code'
        ? div({ class: 'su-mockup-bar' }, dots)
        : ''

  return div(
    attrs(rest, {
      class: cx('su-mockup', `su-mockup--${kind}`, size !== 'md' && `su-mockup--${oneOf(size, SIZES, 'md')}`),
    }),
    kind === 'phone' ? span({ class: 'su-mockup-notch', 'aria-hidden': 'true' }) : '',
    bar,
    div({ class: 'su-mockup-body' }, ...children),
  )
}
