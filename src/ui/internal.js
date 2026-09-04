/**
 * Shared plumbing for sitelo-ui components.
 *
 * Every component follows the same calling convention as
 * `javascript-to-html`: an optional props object followed by children.
 * Props the component understands are pulled off by name; everything
 * else falls through to the rendered element as an HTML attribute, so
 * `id`, `data-*`, `aria-*` and friends work without the library having
 * to enumerate them.
 */

import * as elements from 'javascript-to-html'

const SPACE_TOKENS = new Set(['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'])

/** Flatten a child the way javascript-to-html does: arrays splice in. */
function pushChild(children, child) {
  if (Array.isArray(child)) {
    for (const item of child) pushChild(children, item)
    return
  }

  children.push(child)
}

/**
 * Split `(...args)` into props and children.
 *
 * Plain objects merge into props wherever they appear — the same rule
 * javascript-to-html uses for attributes — and everything else is a
 * child, with arrays flattened.
 *
 * @param {unknown[]} args
 * @returns {{ props: Record<string, any>, children: any[] }}
 */
export function parseArgs(args) {
  const children = []
  let props = {}

  for (const arg of args) {
    if (arg != null && typeof arg === 'object' && !Array.isArray(arg)) {
      props = { ...props, ...arg }
    } else {
      pushChild(children, arg)
    }
  }

  return { props, children }
}

/**
 * Join class names, dropping anything falsy.
 * @param {...(string | false | null | undefined)} parts
 * @returns {string}
 */
export function cx(...parts) {
  return parts.filter(Boolean).join(' ')
}

/**
 * Resolve a spacing value to CSS.
 *
 * A token name (`'md'`) becomes its custom property, a number becomes
 * that many spacing units, and anything else is passed through as a raw
 * CSS length so `gap: '3.5rem'` still works.
 *
 * @param {string | number | undefined} value
 * @returns {string | undefined}
 */
export function space(value) {
  if (value == null || value === '') return undefined
  if (typeof value === 'number') return `calc(var(--su-space-unit) * ${value})`
  if (SPACE_TOKENS.has(value)) return `var(--su-space-${value})`

  return String(value)
}

/**
 * Serialize a declaration map to an inline style string.
 * @param {Record<string, string | number | undefined | null>} declarations
 * @returns {string}
 */
export function css(declarations) {
  return Object.entries(declarations)
    .filter(([, value]) => value != null && value !== '')
    .map(([property, value]) => `${property}: ${value}`)
    .join('; ')
}

/**
 * Build the attribute object handed to a javascript-to-html element.
 *
 * Component classes come first so a caller's own `class` wins the
 * cascade tie, and a caller's `style` is appended to the component's for
 * the same reason.
 *
 * @param {Record<string, any>} rest - props the component did not consume
 * @param {object} [own]
 * @param {string} [own.class]
 * @param {Record<string, string | number | undefined | null>} [own.style]
 * @returns {Record<string, any>}
 */
export function attrs(rest = {}, own = {}) {
  const { class: ownClass, style: ownStyle } = own
  const { class: userClass, style: userStyle, ...others } = rest

  const className = cx(ownClass, userClass)
  const serialize = (value) =>
    value == null || value === '' ? '' : typeof value === 'object' ? css(value) : String(value)
  const inline = [serialize(ownStyle), serialize(userStyle)].filter(Boolean).join('; ')

  return {
    ...others,
    ...(className ? { class: className } : {}),
    ...(inline ? { style: inline } : {}),
  }
}

/**
 * Constrain a prop to a known set, falling back rather than throwing —
 * a typo in a variant name should not fail a build.
 *
 * @param {unknown} value
 * @param {readonly string[]} allowed
 * @param {string} fallback
 * @returns {string}
 */
export function oneOf(value, allowed, fallback) {
  return typeof value === 'string' && allowed.includes(value) ? value : fallback
}

/** Colors every themed component accepts. */
export const COLORS = ['primary', 'neutral', 'success', 'warning', 'danger']

/** Button variants, shared with `menu()` whose trigger is a button. */
export const BUTTON_VARIANTS = ['solid', 'soft', 'outline', 'ghost', 'link']

/** Sizes every sized component accepts. */
export const SIZES = ['sm', 'md', 'lg']

/**
 * `su-c-primary` etc. — the class that binds a palette to the local
 * `--su-c-*` variables the component styles read.
 *
 * @param {unknown} color
 * @param {string} [fallback]
 * @returns {string}
 */
export function colorClass(color, fallback = 'primary') {
  return `su-c-${oneOf(color, COLORS, fallback)}`
}

/**
 * Resolve an `as` prop to a javascript-to-html element function.
 *
 * Unknown names fall back rather than throwing, for the same reason
 * {@link oneOf} does: a component library should not be able to fail a
 * build over a cosmetic prop.
 *
 * @param {unknown} name
 * @param {Function} fallback
 * @returns {Function}
 */
export function el(name, fallback) {
  const fn = typeof name === 'string' ? elements[name] : undefined

  return typeof fn === 'function' ? fn : fallback
}
