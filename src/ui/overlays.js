import {
  a,
  button as buttonEl,
  details,
  div,
  h2,
  li,
  span,
  summary,
  ul,
} from 'javascript-to-html'

import {
  attrs,
  BUTTON_VARIANTS,
  colorClass,
  cx,
  el,
  oneOf,
  parseArgs,
  SIZES,
} from './internal.js'

/**
 * Modal dialog built on the popover API.
 *
 * Opening and closing it — the backdrop, click-outside, Escape, focus
 * containment — is the browser's job here, not a script's: any button
 * with `popovertarget` pointing at the modal's `id` toggles it.
 *
 * ```js
 * button({ popovertarget: 'confirm' }, 'Delete…')
 * modal({ id: 'confirm', title: 'Delete this page?' }, 'This cannot be undone.')
 * ```
 *
 * @param {...any} args - `modal({ id, title, size, footer, closeLabel }, ...children)`
 * @returns {string}
 */
export function modal(...args) {
  const { props, children } = parseArgs(args)
  const {
    id,
    title,
    size = 'md',
    footer,
    closable = true,
    closeLabel = 'Close',
    ...rest
  } = props

  if (!id) {
    throw new Error('modal() needs an `id` — it is what a trigger\'s popovertarget points at.')
  }

  const titleId = `${id}-title`

  return div(
    {
      id,
      popover: 'auto',
      role: 'dialog',
      'aria-modal': 'true',
      ...(title == null ? {} : { 'aria-labelledby': titleId }),
    },
    attrs(rest, {
      class: cx('su-modal', size !== 'md' && `su-modal--${size}`),
    }),
    title == null && !closable
      ? ''
      : div(
          { class: 'su-modal-header' },
          title == null ? '' : h2({ class: 'su-modal-title', id: titleId }, title),
          closable ? closeButton({ target: id, label: closeLabel }) : '',
        ),
    div({ class: 'su-modal-body' }, ...children),
    footer == null ? '' : div({ class: 'su-modal-footer' }, footer),
  )
}

/**
 * The `×` that closes a modal or drawer.
 *
 * @param {object} props - `{ target, label }`
 * @returns {string}
 */
export function closeButton({ target, label = 'Close', ...rest } = {}) {
  return buttonEl(
    {
      type: 'button',
      'aria-label': String(label),
      ...(target ? { popovertarget: target, popovertargetaction: 'hide' } : {}),
    },
    attrs(rest, { class: 'su-modal-close' }),
    '&times;',
  )
}

/**
 * Panel that slides in from the edge. Same popover mechanics as
 * {@link modal}, which is what makes it work with the script absent.
 *
 * @param {...any} args - `drawer({ id, title, side, width, closeLabel }, ...children)`
 * @returns {string}
 */
export function drawer(...args) {
  const { props, children } = parseArgs(args)
  const {
    id,
    title,
    side = 'end',
    width,
    closable = true,
    closeLabel = 'Close',
    ...rest
  } = props

  if (!id) {
    throw new Error('drawer() needs an `id` — it is what a trigger\'s popovertarget points at.')
  }

  const titleId = `${id}-title`

  return div(
    {
      id,
      popover: 'auto',
      role: 'dialog',
      'aria-modal': 'true',
      ...(title == null ? {} : { 'aria-labelledby': titleId }),
    },
    attrs(rest, {
      class: cx('su-drawer', side === 'start' && 'su-drawer--start'),
      style: { '--su-drawer-width': width },
    }),
    title == null && !closable
      ? ''
      : div(
          { class: 'su-drawer-header' },
          title == null
            ? ''
            : h2({ class: 'su-modal-title', id: titleId }, title),
          closable ? closeButton({ target: id, label: closeLabel }) : '',
        ),
    div({ class: 'su-drawer-body' }, ...children),
  )
}

/**
 * Dropdown menu.
 *
 * A `<details>` rather than a popover, because a popover lives in the
 * top layer and cannot be positioned against its trigger without
 * anchor positioning. This opens and closes with no script at all;
 * loading `sitelo/ui/client` adds close-on-outside-click and Escape.
 *
 * The trigger is the `<summary>` itself, styled as a button — pass the
 * label as `trigger` and the button props alongside it, rather than
 * passing a rendered `button()`.
 *
 * @param {...any} args - `menu({ trigger, icon, label, variant, color, size, align }, ...items)`
 * @returns {string}
 */
export function menu(...args) {
  const { props, children } = parseArgs(args)
  const {
    trigger,
    icon,
    label,
    variant = 'outline',
    color = 'neutral',
    size = 'md',
    align = 'start',
    triggerClass,
    ...rest
  } = props

  /*
   * The summary *is* the trigger, so it takes the button styling rather
   * than containing a button. A `<summary>` is already interactive, and
   * putting a `<button>` inside one nests two controls where there is
   * one action — invalid markup, and two tab stops for a single thing.
   */
  const iconOnly = trigger == null || trigger === ''

  return details(
    attrs(rest, { class: cx('su-menu', align === 'end' && 'su-menu--end') }),
    summary(
      {
        class: cx(
          'su-btn',
          `su-btn--${oneOf(variant, BUTTON_VARIANTS, 'outline')}`,
          `su-btn--${oneOf(size, SIZES, 'md')}`,
          iconOnly && icon && 'su-icon-btn',
          colorClass(color, 'neutral'),
          triggerClass,
        ),
        'aria-haspopup': 'menu',
        ...(label ? { 'aria-label': String(label), title: String(label) } : {}),
      },
      icon ? span({ class: 'su-btn-icon' }, icon) : '',
      iconOnly ? '' : span({ class: 'su-btn-label' }, trigger),
    ),
    ul({ class: 'su-menu-list', role: 'menu' }, ...children),
  )
}

/**
 * One row of a {@link menu}. Renders an `<a>` when given `href`.
 *
 * @param {...any} args - `menuItem({ href, icon }, ...children)`
 * @returns {string}
 */
export function menuItem(...args) {
  const { props, children } = parseArgs(args)
  const { href, icon, as, ...rest } = props

  const inner = href
    ? a(
        { href, role: 'menuitem' },
        attrs(rest, { class: 'su-menu-item' }),
        icon ?? '',
        ...children,
      )
    : el(as, buttonEl)(
        { type: 'button', role: 'menuitem' },
        attrs(rest, { class: 'su-menu-item' }),
        icon ?? '',
        ...children,
      )

  return li({ role: 'none' }, inner)
}

/** Hairline between groups of menu items. */
export function menuSeparator(props = {}) {
  return li(
    { role: 'separator' },
    attrs(props, { class: 'su-menu-separator' }),
  )
}

/**
 * Stack of collapsible sections.
 *
 * Pass `name` to make them mutually exclusive — that is the browser's
 * own accordion behaviour for `<details name>`, no script involved.
 *
 * @param {...any} args - `accordion({ items, name }, ...children)`
 * @returns {string}
 */
export function accordion(...args) {
  const { props, children } = parseArgs(args)
  const { items = [], name, ...rest } = props

  const rendered = items.map((entry) => {
    const item = typeof entry === 'object' && entry != null ? entry : { title: entry }

    return accordionItem(
      { title: item.title, open: item.open, ...(name ? { name } : {}) },
      item.content ?? '',
    )
  })

  return div(attrs(rest, { class: 'su-accordion' }), ...rendered, ...children)
}

/**
 * One section of an {@link accordion}.
 *
 * @param {...any} args - `accordionItem({ title, open, name }, ...children)`
 * @returns {string}
 */
export function accordionItem(...args) {
  const { props, children } = parseArgs(args)
  const { title, open = false, ...rest } = props

  return details(
    open ? { open: true } : {},
    attrs(rest, { class: 'su-accordion-item' }),
    summary(title ?? ''),
    div({ class: 'su-accordion-panel' }, ...children),
  )
}
