import {
  a,
  code as codeEl,
  div,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  kbd as kbdEl,
  p as pEl,
  span,
} from 'javascript-to-html'

import { attrs, colorClass, cx, el, escapeHtml, oneOf, parseArgs } from './internal.js'

const VARIANTS = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'lead',
  'body',
  'small',
  'caption',
  'overline',
]

/** The element each variant renders as when `as` is not given. */
const VARIANT_TAGS = {
  h1: h1,
  h2: h2,
  h3: h3,
  h4: h4,
  h5: h5,
  h6: h6,
  lead: pEl,
  body: pEl,
  small: pEl,
  caption: span,
  overline: span,
}

const TONES = ['default', 'muted', 'subtle']
const ALIGNMENTS = ['start', 'center', 'end']

/**
 * Text at one of the library's type scales.
 *
 * The variant picks a sensible element — `h2` renders an `<h2>` — so
 * the document outline follows the visual one by default. Override it
 * with `as` when they need to differ.
 *
 * @param {...any} args - `text({ variant, tone, align, truncate, lines, as }, ...children)`
 * @returns {string}
 */
export function text(...args) {
  const { props, children } = parseArgs(args)
  const { variant = 'body', tone, align, truncate = false, lines, as, ...rest } = props

  const resolved = oneOf(variant, VARIANTS, 'body')
  const tag = el(as, VARIANT_TAGS[resolved])

  return tag(
    attrs(rest, {
      class: cx(
        'su-text',
        `su-text--${resolved}`,
        tone && tone !== 'default' && `su-text--${oneOf(tone, TONES, 'default')}`,
        align && `su-text--${oneOf(align, ALIGNMENTS, 'start')}`,
        truncate && 'su-text--truncate',
        lines && 'su-text--clamp',
      ),
      style: { '--su-clamp-lines': lines },
    }),
    ...children,
  )
}

/**
 * Heading at a given outline level, sized to match by default.
 *
 * `size` decouples the two — `heading({ level: 1, size: 'h3' })` is an
 * `<h1>` that looks like an h3.
 *
 * @param {...any} args - `heading({ level, size }, ...children)`
 * @returns {string}
 */
export function heading(...args) {
  const { props, children } = parseArgs(args)
  const { level = 2, size, ...rest } = props

  const tag = `h${Math.min(6, Math.max(1, Number(level) || 2))}`

  return text({ variant: oneOf(size, VARIANTS, tag), as: tag, ...rest }, ...children)
}

/**
 * Styled anchor.
 *
 * Exported as both `link` and `textLink`; the second name exists
 * because `link` is also javascript-to-html's `<link>` element, and
 * importing both under one name is a syntax error.
 *
 * @param {...any} args - `link({ href, color, subtle, external }, ...children)`
 * @returns {string}
 */
export function link(...args) {
  const { props, children } = parseArgs(args)
  const { color = 'primary', subtle = false, external = false, ...rest } = props

  return a(
    // An external link gets the security attributes it needs, unless the
    // caller set their own.
    external ? { target: '_blank', rel: 'noopener noreferrer' } : {},
    attrs(rest, {
      class: cx('su-link', subtle && 'su-link--subtle', colorClass(color)),
    }),
    ...children,
  )
}

export { link as textLink }

/**
 * Inline code. Also exported as `inlineCode`.
 *
 * Children render as HTML, like everywhere else in this library — which
 * is what you want for pre-highlighted output, and what you do not want
 * for a sample containing tags. Pass `text` for the second case and the
 * markup is escaped rather than built:
 *
 * ```js
 * code({ text: '<h1>Hello</h1>' })   // shows the tags
 * code(highlighted)                  // renders the spans
 * ```
 *
 * @param {...any} args
 * @returns {string}
 */
export function code(...args) {
  const { props, children } = parseArgs(args)
  const { text: literal, ...rest } = props

  return codeEl(
    attrs(rest, { class: 'su-code' }),
    literal == null ? '' : escapeHtml(literal),
    ...children,
  )
}

export { code as inlineCode }

/**
 * A key on a keyboard.
 *
 * @param {...any} args
 * @returns {string}
 */
export function kbd(...args) {
  const { props, children } = parseArgs(args)

  return kbdEl(attrs(props, { class: 'su-kbd' }), ...children)
}

/**
 * Content that stays in the accessibility tree but not on screen —
 * the label a screen reader needs and sighted users get from context.
 *
 * @param {...any} args
 * @returns {string}
 */
export function visuallyHidden(...args) {
  const { props, children } = parseArgs(args)

  return span(attrs(props, { class: 'su-visually-hidden' }), ...children)
}

/**
 * Style a block of HTML you did not write.
 *
 * Markdown renderers and CMS fields hand back bare tags — `<h2>`, `<p>`,
 * `<ul>`, `<blockquote>` — with no classes to hook onto. Everywhere else
 * in this library styling is class-scoped precisely so it never reaches
 * markup you did not opt in; `prose` is the one deliberate exception,
 * and it only applies inside its own wrapper.
 *
 * @param {...any} args - `prose({ size, as }, ...children)`
 * @returns {string}
 */
export function prose(...args) {
  const { props, children } = parseArgs(args)
  const { size = 'md', as, ...rest } = props

  return el(as, div)(
    attrs(rest, {
      class: cx('su-prose', size !== 'md' && `su-prose--${oneOf(size, ['sm', 'md', 'lg'], 'md')}`),
    }),
    ...children,
  )
}
