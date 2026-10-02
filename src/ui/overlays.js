import {
  a,
  button as buttonEl,
  details,
  dialog,
  div,
  h2,
  li,
  span,
  summary,
  ul,
} from 'javascript-to-html'

import { commandFallback, dismissFallback, handler } from './handlers.js'
import { icon } from './icons.js'
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
 * Modal dialog: a `<dialog>`, opened modally.
 *
 * A button with `commandfor` naming the modal's `id` and
 * `command="show-modal"` opens it, and that is the browser's job rather
 * than a script's — the top layer and backdrop, the page behind it going
 * inert so focus and a screen reader both stay inside, Escape, and with
 * `closedby="any"` a click outside.
 *
 * ```js
 * button({ commandfor: 'confirm', command: 'show-modal' }, 'Delete…')
 * modal({ id: 'confirm', title: 'Delete this page?' }, 'This cannot be undone.')
 * ```
 *
 * Every current browser has those invoker commands. For one that does
 * not, `button()` adds an `onclick` that fetches `/su/dialog.js` there
 * and nowhere else; the dialog carries the same kind of guard for a
 * click outside, which Safari does not yet do natively. Pass
 * `closedby: 'closerequest'` to keep it open on outside clicks.
 *
 * It used to be a `popover`, opened with `popovertarget` — which put it on
 * top of the page without making the page inert, so Tab walked out of it.
 *
 * While it is open the page behind it does not scroll — the class this
 * renders is what the stylesheet keys that off, so it holds without a
 * script too. `lockScroll: false` gives the background its scroll back.
 *
 * @param {...any} args - `modal({ id, title, size, footer, closeLabel, lockScroll }, ...children)`
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
    lockScroll = true,
    ...rest
  } = props

  if (!id) {
    throw new Error('modal() needs an `id` — it is what a trigger\'s commandfor points at.')
  }

  const titleId = `${id}-title`

  return dialog(
    {
      id,
      closedby: 'any',
      ...(title == null ? {} : { 'aria-labelledby': titleId }),
      onclick: dismissFallback(),
    },
    attrs(rest, {
      class: cx(
        'su-modal',
        size !== 'md' && `su-modal--${size}`,
        lockScroll && 'su-modal--lock',
      ),
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
 * The cross that closes a modal or drawer: `command="close"` on the dialog
 * `target` names, with the same fallback `button()` adds for a browser
 * without invoker commands.
 *
 * @param {object} props - `{ target, label }`
 * @returns {string}
 */
export function closeButton({ target, label = 'Close', ...rest } = {}) {
  const wiring = target ? { commandfor: target, command: 'close' } : {}

  return buttonEl(
    {
      type: 'button',
      'aria-label': String(label),
      ...wiring,
      ...commandFallback({ ...wiring, ...rest }),
    },
    attrs(rest, { class: 'su-modal-close' }),
    // The icon rather than `&times;`: a font puts that glyph wherever its
    // designer chose, usually below the middle of the line, so it sat low
    // in the square. The drawing is centred on its own grid.
    icon('close'),
  )
}

/**
 * Panel that slides in from the edge: a `<dialog>` opened modally, the
 * same as {@link modal} — the same `command="show-modal"` trigger, the
 * same inert page behind it and the same scroll lock, in another shape.
 *
 * @param {...any} args - `drawer({ id, title, side, width, closeLabel, lockScroll }, ...children)`
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
    lockScroll = true,
    ...rest
  } = props

  if (!id) {
    throw new Error('drawer() needs an `id` — it is what a trigger\'s commandfor points at.')
  }

  const titleId = `${id}-title`

  return dialog(
    {
      id,
      closedby: 'any',
      ...(title == null ? {} : { 'aria-labelledby': titleId }),
      onclick: dismissFallback(),
    },
    attrs(rest, {
      class: cx(
        'su-drawer',
        side === 'start' && 'su-drawer--start',
        lockScroll && 'su-drawer--lock',
      ),
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
 * anchor positioning. This opens and closes with no script at all; the
 * `ontoggle` import below adds close-on-outside-click and Escape, and
 * only once a menu has actually been opened.
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
    { ontoggle: handler('menu', 'toggled(this)') },
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
        { type: 'button', role: 'menuitem', ...commandFallback(rest) },
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

/**
 * A single disclosure: a trigger, and content that folds away.
 *
 * The same `<details>` an accordion is built from, without the
 * accordion's borders and grouping — for one "show more" in the middle
 * of a page. Keep the trigger to text and icons: a `<summary>` is
 * already interactive, so a button or link inside it nests two controls
 * where there is one.
 *
 * @param {...any} args - `collapsible({ trigger, open }, ...children)`
 * @returns {string}
 */
export function collapsible(...args) {
  const { props, children } = parseArgs(args)
  const { trigger, open = false, ...rest } = props

  return details(
    open ? { open: true } : {},
    attrs(rest, { class: 'su-collapsible' }),
    summary({ class: 'su-collapsible-trigger' }, trigger ?? ''),
    div({ class: 'su-collapsible-content' }, ...children),
  )
}
