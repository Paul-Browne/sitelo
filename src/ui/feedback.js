import { button, div, p as pEl, span } from 'javascript-to-html'

import { handler } from './handlers.js'
import { icon } from './icons.js'
import { attrs, colorClass, cx, oneOf, parseArgs, space } from './internal.js'

/**
 * Default glyph per alert color.
 *
 * `neutral` deliberately shares the informational glyph: a quiet alert
 * is still telling you something, and there is no drawing for "no
 * particular sentiment" that reads as anything but noise.
 */
const ALERT_ICONS = {
  primary: icon('info'),
  neutral: icon('info'),
  success: icon('check-circle'),
  warning: icon('alert-triangle'),
  danger: icon('x-circle'),
}

const ALERT_VARIANTS = ['soft', 'outline', 'solid']

/**
 * A message about the state of something.
 *
 * The default `role` follows the color: `danger` and `warning` announce
 * themselves as alerts, everything quieter is a polite status.
 *
 * @param {...any} args - `alert({ color, variant, title, icon, dismissible }, ...children)`
 * @returns {string}
 */
export function alert(...args) {
  const { props, children } = parseArgs(args)
  const {
    color = 'primary',
    variant = 'soft',
    title,
    icon,
    dismissible = false,
    dismissLabel = 'Dismiss',
    ...rest
  } = props

  const palette = colorClass(color)
  const glyph = icon === false ? '' : icon || ALERT_ICONS[palette.slice('su-c-'.length)]
  const urgent = color === 'danger' || color === 'warning'

  return div(
    { role: urgent ? 'alert' : 'status' },
    attrs(rest, {
      class: cx(
        'su-alert',
        `su-alert--${oneOf(variant, ALERT_VARIANTS, 'soft')}`,
        palette,
      ),
    }),
    glyph ? span({ class: 'su-alert-icon' }, glyph) : '',
    div(
      { class: 'su-alert-content' },
      title == null ? '' : div({ class: 'su-alert-title' }, title),
      ...children,
    ),
    dismissible
      ? // The button fetches its own handler on the first click. With no
        // JavaScript — or a request that never lands — it does nothing
        // and the alert stays, which is what the server rendered.
        button(
          {
            type: 'button',
            class: 'su-alert-dismiss',
            'data-su-dismiss': '',
            onclick: handler('alert', 'dismiss(this)'),
            'aria-label': String(dismissLabel),
          },
          '&times;',
        )
      : '',
  )
}

/**
 * Determinate or indeterminate progress bar.
 *
 * Omit `value` for the indeterminate animation. Pass `label` to give it
 * an accessible name — without one the bar is marked `aria-hidden`,
 * because a progressbar role with no name is both useless to a screen
 * reader and invalid. Exported as both `progress` and `progressBar`.
 *
 * A `<span>` in a `<div>` rather than a native `<progress>`, which
 * makes this the odd one out in a library that takes `<details>`,
 * `popover` and a real range input wherever it can. Determinate, a
 * native bar styles up identically. Indeterminate, it has nothing to
 * show: styling one at all means `appearance: none`, that takes the
 * platform's animation with it, `::-webkit-progress-value` is not
 * rendered while there is no value, and the element's own content is
 * legacy fallback no browser draws — so there is nowhere to put a
 * stripe of our own. It would be the platform's look or a dead track,
 * and no way to stand the animation down under
 * `prefers-reduced-motion`. Two elements buy the state back.
 *
 * The bill for that is the `role` and `aria-value*` attributes written
 * out below, and the runtime that keeps them in step — all of which a
 * native element would carry for free and could never drift from.
 *
 * @param {object} [props] - `{ value, max, color, label, showValue, height }`
 * @returns {string}
 */
export function progress(props = {}) {
  const {
    value,
    max = 100,
    color = 'primary',
    label,
    showValue = false,
    height,
    ...rest
  } = props

  /*
   * A value that is not a finite number is treated as no value at all.
   * Coercing it produced `aria-valuenow="NaN"` and a CSS width of
   * `NaN%` — invalid on both counts, and silent.
   */
  const numeric = Number(value)
  const limit = Number(max)
  const scale = Number.isFinite(limit) && limit > 0 ? limit : 100
  const indeterminate = value == null || !Number.isFinite(numeric)
  const pct = indeterminate ? 0 : Math.max(0, Math.min(100, (numeric / scale) * 100))

  return div(
    attrs(rest, { class: cx('su-progress', colorClass(color)) }),
    label == null && !showValue
      ? ''
      : div(
          { class: 'su-progress-label' },
          span(label == null ? '' : label),
          /*
           * The span is rendered whenever `showValue` is on, empty while
           * the bar is indeterminate: `/su/progress.js` fills it in, and
           * it cannot fill in something that is not there.
           */
          showValue
            ? span({ 'data-su-progress-value': '' }, indeterminate ? '' : `${Math.round(pct)}%`)
            : '',
        ),
    div(
      {
        /*
         * A progressbar with no accessible name tells a screen reader
         * nothing, and is invalid besides — so an unlabelled bar is
         * decoration, and says so. Same rule `icon()` follows.
         */
        ...(label == null
          ? { 'aria-hidden': 'true' }
          : {
              role: 'progressbar',
              'aria-label': String(label),
              ...(indeterminate
                ? {}
                : {
                    'aria-valuenow': numeric,
                    'aria-valuemin': 0,
                    'aria-valuemax': scale,
                  }),
            }),
        class: cx(
          'su-progress-bar',
          indeterminate && 'su-progress-bar--indeterminate',
        ),
        /*
         * An unlabelled bar announces no `aria-valuemax`, and a labelled
         * indeterminate one announces nothing either — so a scale that is
         * not the default is written down here, where `set()` can find it
         * without being told the maximum again on every call.
         */
        ...(scale === 100 ? {} : { 'data-su-progress-max': scale }),
        ...(height ? { style: `--su-progress-height: ${space(height)}` } : {}),
      },
      span({
        class: 'su-progress-fill',
        ...(indeterminate ? {} : { style: `--su-progress-value: ${pct}%` }),
      }),
    ),
  )
}

export { progress as progressBar }

/**
 * Placeholder block for content that has not arrived.
 *
 * @param {object} [props] - `{ variant, width, height, lines }`
 * @returns {string}
 */
export function skeleton(props = {}) {
  const { variant = 'rect', width, height, lines, ...rest } = props

  if (Number(lines) > 1) {
    const rows = Array.from({ length: Number(lines) }, (_, index) =>
      skeleton({
        variant: 'text',
        // A ragged last line reads as a paragraph rather than a block.
        width: index === Number(lines) - 1 ? '60%' : width,
        height,
      }),
    )

    return div(attrs(rest, { class: 'su-skeleton-group' }), ...rows)
  }

  return span(
    { 'aria-hidden': 'true' },
    attrs(rest, {
      class: cx('su-skeleton', variant !== 'rect' && `su-skeleton--${variant}`),
      style: { width, height },
    }),
  )
}

/**
 * Fixed region for transient messages.
 *
 * It is a live region, so anything `sitelo/ui/client` (or your own
 * script) appends to it is announced.
 *
 * @param {...any} args
 * @returns {string}
 */
export function toasts(...args) {
  const { props, children } = parseArgs(args)

  return div(
    { id: 'su-toasts', role: 'region', 'aria-live': 'polite', 'aria-label': 'Notifications' },
    attrs(props, { class: 'su-toasts' }),
    ...children,
  )
}

/**
 * The state a list is in before it has anything in it.
 *
 * A blank space reads as a bug; this says which space is blank and what
 * to do about it. Children become the action — usually a button.
 *
 * @param {...any} args - `empty({ icon, title, description }, ...actions)`
 * @returns {string}
 */
export function empty(...args) {
  const { props, children } = parseArgs(args)
  const { icon, title, description, ...rest } = props

  return div(
    attrs(rest, { class: 'su-empty' }),
    // The icon is decoration: the title already says what is going on.
    icon ? div({ class: 'su-empty-icon', 'aria-hidden': 'true' }, icon) : '',
    title == null ? '' : pEl({ class: 'su-empty-title' }, title),
    description == null ? '' : pEl({ class: 'su-empty-description' }, description),
    children.length ? div({ class: 'su-empty-actions' }, ...children) : '',
  )
}
