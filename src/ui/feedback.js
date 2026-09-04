import { button, div, span } from 'javascript-to-html'

import { attrs, colorClass, cx, oneOf, parseArgs, SIZES, space } from './internal.js'

/** Default glyph per alert color — plain SVG, no icon dependency. */
const ALERT_ICONS = {
  primary:
    '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="10" cy="10" r="8"/><path d="M10 9v5" stroke-linecap="round"/><circle cx="10" cy="6.2" r="0.9" fill="currentColor" stroke="none"/></svg>',
  neutral:
    '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="10" cy="10" r="8"/><path d="M10 9v5" stroke-linecap="round"/><circle cx="10" cy="6.2" r="0.9" fill="currentColor" stroke="none"/></svg>',
  success:
    '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="10" cy="10" r="8"/><path d="m6.4 10.3 2.4 2.4 4.8-5.1" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  warning:
    '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M10 2.8 18.2 17H1.8z" stroke-linejoin="round"/><path d="M10 8v3.6" stroke-linecap="round"/><circle cx="10" cy="14.2" r="0.9" fill="currentColor" stroke="none"/></svg>',
  danger:
    '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="10" cy="10" r="8"/><path d="m7.2 7.2 5.6 5.6M12.8 7.2l-5.6 5.6" stroke-linecap="round"/></svg>',
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
      ? // `data-su-dismiss` is picked up by sitelo/ui/client; without
        // that script the button simply does nothing, so the alert
        // still renders correctly with JavaScript off.
        button(
          {
            type: 'button',
            class: 'su-alert-dismiss',
            'data-su-dismiss': '',
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
 * Omit `value` for the indeterminate animation. Exported as both
 * `progress` and `progressBar`.
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

  const indeterminate = value == null
  const pct = indeterminate
    ? 0
    : Math.max(0, Math.min(100, (Number(value) / Number(max)) * 100))

  return div(
    attrs(rest, { class: cx('su-progress', colorClass(color)) }),
    label == null && !showValue
      ? ''
      : div(
          { class: 'su-progress-label' },
          span(label == null ? '' : label),
          showValue && !indeterminate ? span(`${Math.round(pct)}%`) : '',
        ),
    div(
      {
        role: 'progressbar',
        ...(indeterminate
          ? {}
          : {
              'aria-valuenow': Number(value),
              'aria-valuemin': 0,
              'aria-valuemax': Number(max),
            }),
        ...(label == null ? {} : { 'aria-label': String(label) }),
        class: cx(
          'su-progress-bar',
          indeterminate && 'su-progress-bar--indeterminate',
        ),
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
 * Spinning ring, sized in `em` so it matches the text it sits beside.
 *
 * @param {object} [props] - `{ size, label }`
 * @returns {string}
 */
export function spinner(props = {}) {
  const { size = 'md', label, ...rest } = props

  return span(
    { role: 'status', ...(label ? { 'aria-label': String(label) } : { 'aria-hidden': 'true' }) },
    attrs(rest, {
      class: cx('su-spinner', size !== 'md' && `su-spinner--${oneOf(size, SIZES, 'md')}`),
    }),
  )
}

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
