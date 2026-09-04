import {
  a,
  button as buttonEl,
  div,
  input as inputEl,
  label as labelEl,
  option as optionEl,
  select as selectEl,
  span,
  textarea as textareaEl,
} from 'javascript-to-html'

import { spinner } from './feedback.js'
import {
  attrs,
  colorClass,
  cx,
  el,
  oneOf,
  parseArgs,
  SIZES,
} from './internal.js'

const BUTTON_VARIANTS = ['solid', 'soft', 'outline', 'ghost', 'link']

/**
 * Button, or a link that looks like one.
 *
 * Passing `href` renders an `<a>` — the right element for something
 * that navigates — and `disabled` on that form becomes
 * `aria-disabled`, since anchors have no disabled state.
 *
 * @param {...any} args - `button({ variant, color, size, href, startIcon, endIcon, loading, disabled, block }, ...children)`
 * @returns {string}
 */
export function button(...args) {
  const { props, children } = parseArgs(args)
  const {
    variant = 'solid',
    color = 'primary',
    size = 'md',
    href,
    startIcon,
    endIcon,
    loading = false,
    disabled = false,
    block = false,
    type,
    ...rest
  } = props

  const own = {
    class: cx(
      'su-btn',
      `su-btn--${oneOf(variant, BUTTON_VARIANTS, 'solid')}`,
      `su-btn--${oneOf(size, SIZES, 'md')}`,
      block && 'su-btn--block',
      loading && 'su-btn--loading',
      colorClass(color),
    ),
  }

  const leading = loading
    ? span({ class: 'su-btn-icon' }, spinner({ size: 'sm' }))
    : startIcon
      ? span({ class: 'su-btn-icon' }, startIcon)
      : ''

  const trailing = endIcon ? span({ class: 'su-btn-icon' }, endIcon) : ''
  const body = children.length ? span({ class: 'su-btn-label' }, ...children) : ''

  if (href) {
    return a(
      {
        href,
        ...(disabled ? { 'aria-disabled': 'true', tabindex: -1 } : {}),
        ...(loading ? { 'aria-busy': 'true' } : {}),
      },
      attrs(rest, own),
      leading,
      body,
      trailing,
    )
  }

  return buttonEl(
    {
      // Unset `type` on a button inside a form means submit, which is
      // rarely what a component consumer meant.
      type: type || 'button',
      ...(disabled ? { disabled: true } : {}),
      ...(loading ? { 'aria-busy': 'true' } : {}),
    },
    attrs(rest, own),
    leading,
    body,
    trailing,
  )
}

/**
 * Square button holding a single icon. `label` is required — it becomes
 * the accessible name the icon cannot provide.
 *
 * @param {object} props - `{ label, icon, ...button props }`
 * @returns {string}
 */
export function iconButton(props = {}) {
  const { label, icon, class: className, ...rest } = props

  return button({
    'aria-label': label,
    ...(label ? { title: label } : {}),
    startIcon: icon,
    class: cx('su-icon-btn', className),
    ...rest,
  })
}

/**
 * Row of buttons joined into one control.
 *
 * @param {...any} args
 * @returns {string}
 */
export function buttonGroup(...args) {
  const { props, children } = parseArgs(args)
  const { label, ...rest } = props

  return div(
    { role: 'group', ...(label ? { 'aria-label': String(label) } : {}) },
    attrs(rest, { class: 'su-btn-group' }),
    ...children,
  )
}

/**
 * Turn a name or label into a stable id.
 *
 * Deterministic on purpose: a counter would make the same page render
 * differently depending on what else the build rendered first.
 *
 * @param {object} props
 * @returns {string | undefined}
 */
function controlId({ id, name, label }) {
  if (id) return String(id)

  const source = name ?? label

  if (source == null) return undefined

  const slug = String(source)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return slug ? `su-${slug}` : undefined
}

/**
 * Label, help text and error message around a control.
 *
 * Wires `for` and `aria-describedby` for you when the control carries a
 * matching id — which {@link textField} and friends arrange.
 *
 * @param {...any} args - `field({ label, help, error, required, for }, ...control)`
 * @returns {string}
 */
export function field(...args) {
  const { props, children } = parseArgs(args)
  const { label, help, error, required = false, for: htmlFor, ...rest } = props

  return div(
    attrs(rest, { class: cx('su-field', error && 'su-field--invalid') }),
    label == null
      ? ''
      : labelEl(
          { class: 'su-label', ...(htmlFor ? { for: htmlFor } : {}) },
          label,
          required ? span({ class: 'su-label-required', 'aria-hidden': 'true' }, '*') : '',
        ),
    ...children,
    help == null
      ? ''
      : div({ class: 'su-help', ...(htmlFor ? { id: `${htmlFor}-help` } : {}) }, help),
    error == null || error === false
      ? ''
      : div({ class: 'su-error', ...(htmlFor ? { id: `${htmlFor}-error` } : {}) }, error),
  )
}

/**
 * `aria-describedby` pointing at whichever of help/error exists.
 *
 * @param {string | undefined} id
 * @param {unknown} help
 * @param {unknown} error
 * @returns {string | undefined}
 */
function describedBy(id, help, error) {
  if (!id) return undefined

  const parts = [help != null && `${id}-help`, error != null && error !== false && `${id}-error`]
    .filter(Boolean)

  return parts.length ? parts.join(' ') : undefined
}

/**
 * Text input control. Exported as both `input` and `textInput`.
 *
 * This is the bare control; {@link textField} wraps it in a label,
 * help text and error message.
 *
 * @param {object} [props] - `{ type, size, startAdornment, endAdornment, invalid, ... }`
 * @returns {string}
 */
export function input(props = {}) {
  const {
    type = 'text',
    size = 'md',
    startAdornment,
    endAdornment,
    invalid = false,
    ...rest
  } = props

  const control = inputEl(
    { type, ...(invalid ? { 'aria-invalid': 'true' } : {}) },
    attrs(rest, {
      class: cx('su-input', size !== 'md' && `su-input--${oneOf(size, SIZES, 'md')}`),
    }),
  )

  if (startAdornment == null && endAdornment == null) return control

  return div(
    { class: 'su-input-group' },
    startAdornment == null
      ? ''
      : span({ class: 'su-adornment su-adornment--start' }, startAdornment),
    control,
    endAdornment == null
      ? ''
      : span({ class: 'su-adornment su-adornment--end' }, endAdornment),
  )
}

export { input as textInput }

/**
 * Multi-line text control.
 *
 * @param {object} [props] - `{ size, rows, invalid, ... }`
 * @returns {string}
 */
export function textarea(props = {}) {
  const { size = 'md', invalid = false, value, ...rest } = props

  return textareaEl(
    { ...(invalid ? { 'aria-invalid': 'true' } : {}) },
    attrs(rest, {
      class: cx('su-textarea', size !== 'md' && `su-textarea--${oneOf(size, SIZES, 'md')}`),
    }),
    // A textarea's value is its content, not an attribute.
    value == null ? '' : value,
  )
}

/**
 * Select control. Exported as both `select` and `selectField`'s
 * building block.
 *
 * `options` accepts strings, `{ value, label, disabled }` objects, or
 * `{ label, options }` for an optgroup. Anything you would rather build
 * by hand can be passed as children instead.
 *
 * @param {...any} args - `select({ options, value, placeholder, size, invalid }, ...children)`
 * @returns {string}
 */
export function select(...args) {
  const { props, children } = parseArgs(args)
  const {
    options = [],
    value,
    placeholder,
    size = 'md',
    invalid = false,
    ...rest
  } = props

  const renderOption = (entry) => {
    if (entry != null && typeof entry === 'object' && Array.isArray(entry.options)) {
      return `<optgroup label="${String(entry.label ?? '').replace(/"/g, '&#34;')}">${entry.options
        .map(renderOption)
        .join('')}</optgroup>`
    }

    const item = typeof entry === 'object' && entry != null ? entry : { value: entry }
    const optionValue = item.value ?? ''

    return optionEl(
      {
        value: optionValue,
        ...(item.disabled ? { disabled: true } : {}),
        ...(value != null && String(value) === String(optionValue) ? { selected: true } : {}),
      },
      item.label ?? String(optionValue),
    )
  }

  return selectEl(
    { ...(invalid ? { 'aria-invalid': 'true' } : {}) },
    attrs(rest, {
      class: cx('su-select', size !== 'md' && `su-select--${oneOf(size, SIZES, 'md')}`),
    }),
    placeholder == null
      ? ''
      : optionEl(
          { value: '', disabled: true, ...(value == null ? { selected: true } : {}) },
          placeholder,
        ),
    ...options.map(renderOption),
    ...children,
  )
}

/**
 * Build a labelled field around one of the controls above.
 *
 * @param {Function} control
 * @param {object} props
 * @returns {string}
 */
function labelledField(control, props) {
  const { label, help, error, required, fieldClass, ...rest } = props
  const id = controlId({ id: rest.id, name: rest.name, label })

  return field(
    { label, help, error, required, for: id, class: fieldClass },
    control({
      ...rest,
      ...(id ? { id } : {}),
      ...(required ? { required: true } : {}),
      ...(error != null && error !== false ? { invalid: true } : {}),
      ...(describedBy(id, help, error) ? { 'aria-describedby': describedBy(id, help, error) } : {}),
    }),
  )
}

/**
 * Labelled text input — label, control, help text and error in one call.
 *
 * @param {object} [props]
 * @returns {string}
 */
export function textField(props = {}) {
  return labelledField(input, props)
}

/**
 * Labelled multi-line input.
 *
 * @param {object} [props]
 * @returns {string}
 */
export function textareaField(props = {}) {
  return labelledField(textarea, props)
}

/**
 * Labelled select.
 *
 * @param {object} [props]
 * @returns {string}
 */
export function selectField(props = {}) {
  return labelledField((p) => select(p), props)
}

/**
 * Checkbox with its label.
 *
 * @param {object} [props] - `{ label, color, checked, disabled, ... }`
 * @returns {string}
 */
export function checkbox(props = {}) {
  return check('checkbox', props)
}

/**
 * Radio button with its label.
 *
 * @param {object} [props]
 * @returns {string}
 */
export function radio(props = {}) {
  return check('radio', props)
}

/**
 * @param {'checkbox' | 'radio'} type
 * @param {object} props
 * @returns {string}
 */
function check(type, props) {
  const { label, color = 'primary', checked = false, class: className, ...rest } = props

  return labelEl(
    {
      class: cx('su-check', type === 'radio' && 'su-check--radio', colorClass(color), className),
    },
    inputEl({ type, ...(checked ? { checked: true } : {}), ...rest }),
    span({ class: 'su-check-box', 'aria-hidden': 'true' }),
    label == null ? '' : span({ class: 'su-check-label' }, label),
  )
}

/**
 * On/off switch.
 *
 * Named `toggle` rather than `switch` because `switch` is a reserved
 * word and cannot be an import binding.
 *
 * @param {object} [props] - `{ label, color, checked, disabled, ... }`
 * @returns {string}
 */
export function toggle(props = {}) {
  const { label, color = 'primary', checked = false, class: className, ...rest } = props

  return labelEl(
    { class: cx('su-switch', colorClass(color), className) },
    inputEl({
      type: 'checkbox',
      role: 'switch',
      ...(checked ? { checked: true } : {}),
      ...rest,
    }),
    span(
      { class: 'su-switch-track', 'aria-hidden': 'true' },
      span({ class: 'su-switch-thumb' }),
    ),
    label == null ? '' : span({ class: 'su-switch-label' }, label),
  )
}

/**
 * Group of checkboxes or radios with a shared legend.
 *
 * @param {...any} args - `choiceGroup({ legend, name, options, type, value }, ...children)`
 * @returns {string}
 */
export function choiceGroup(...args) {
  const { props, children } = parseArgs(args)
  const {
    legend,
    name,
    options = [],
    type = 'radio',
    value,
    help,
    direction = 'column',
    as,
    ...rest
  } = props

  const control = type === 'checkbox' ? checkbox : radio
  const selected = Array.isArray(value) ? value.map(String) : value == null ? [] : [String(value)]

  const items = options.map((entry) => {
    const item = typeof entry === 'object' && entry != null ? entry : { value: entry }

    return control({
      name,
      value: item.value,
      label: item.label ?? String(item.value),
      checked: selected.includes(String(item.value)),
      ...(item.disabled ? { disabled: true } : {}),
    })
  })

  return el(as, div)(
    { role: type === 'radio' ? 'radiogroup' : 'group' },
    attrs(rest, {
      class: cx('su-choice-group', direction === 'row' && 'su-choice-group--row'),
    }),
    legend == null ? '' : div({ class: 'su-label' }, legend),
    ...items,
    ...children,
    help == null ? '' : div({ class: 'su-help' }, help),
  )
}
