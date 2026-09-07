/**
 * The icon set for sitelo-ui.
 *
 * Icons render as inline SVG, for the same reason {@link stylesheet} is
 * inlined rather than linked: nothing to emit into `dist`, nothing to
 * point a base path at, and no second request before the page is
 * legible. A sprite file referenced with `<use>` would save on the order
 * of a hundred gzipped bytes of HTML per page and cost a round trip to
 * do it — repeated markup is the case gzip is best at, so the
 * duplication a sprite exists to remove has mostly been removed already.
 *
 * ```js
 * import { icon, button } from 'sitelo/ui'
 *
 * button({ color: 'danger' }, icon('trash'), 'Delete')
 * ```
 *
 * Every glyph is drawn on a 24x24 grid as unfilled strokes in
 * `currentColor`, so an icon takes the color and the font size of
 * whatever it sits in and needs no styling of its own.
 */

import { attrs, cx, oneOf, parseArgs, SIZES } from './internal.js'

/**
 * Attributes shared by every glyph, so the individual drawings carry
 * geometry and nothing else.
 */
const BASE = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': '1.8',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
}

/** A dot, which has to opt out of the shared stroke to read as solid. */
const dot = (x, y, r = 1.05) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="currentColor" stroke="none"/>`

/**
 * The glyphs, as the inner markup of a 24x24 `<svg>`.
 *
 * Names are the thing drawn rather than the job it does — `x-circle`,
 * not `error` — because the same drawing gets used for unrelated jobs,
 * and a name that describes the picture stays true when it does. The
 * aliases below cover the common intents.
 */
const ICONS = {
  /* Direction ----------------------------------------------------- */
  'chevron-up': '<path d="m6 15 6-6 6 6"/>',
  'chevron-down': '<path d="m6 9 6 6 6-6"/>',
  'chevron-left': '<path d="m15 6-6 6 6 6"/>',
  'chevron-right': '<path d="m9 6 6 6-6 6"/>',
  'chevrons-left': '<path d="m11 6-6 6 6 6"/><path d="m18 6-6 6 6 6"/>',
  'chevrons-right': '<path d="m6 6 6 6-6 6"/><path d="m13 6 6 6-6 6"/>',
  'arrow-up': '<path d="M12 20V4"/><path d="m5 11 7-7 7 7"/>',
  'arrow-down': '<path d="M12 4v16"/><path d="m5 13 7 7 7-7"/>',
  'arrow-left': '<path d="M20 12H4"/><path d="m11 5-7 7 7 7"/>',
  'arrow-right': '<path d="M4 12h16"/><path d="m13 5 7 7-7 7"/>',
  'external-link':
    '<path d="M13 3.5h7.5V11"/><path d="M20.5 3.5 10 14"/><path d="M18 13.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5.5"/>',
  menu: '<path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/>',

  /* Actions ------------------------------------------------------- */
  close: '<path d="m6 6 12 12"/><path d="m18 6-12 12"/>',
  check: '<path d="m4.5 12.5 5 5 10-11"/>',
  plus: '<path d="M12 4v16"/><path d="M4 12h16"/>',
  minus: '<path d="M4 12h16"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m20 20-4.9-4.9"/>',
  copy:
    '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M6 15H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1"/>',
  download:
    '<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M4 18v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1"/>',
  upload:
    '<path d="M12 15V3"/><path d="m7 8 5-5 5 5"/><path d="M4 18v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1"/>',
  trash:
    '<path d="M4 7h16"/><path d="M10 4h4a1 1 0 0 1 1 1v2H9V5a1 1 0 0 1 1-1z"/><path d="M6 7v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7"/><path d="M10 11v6"/><path d="M14 11v6"/>',
  edit: '<path d="M4 20h4L18 10a2.83 2.83 0 0 0-4-4L4 16z"/><path d="m14 6 4 4"/>',
  filter: '<path d="M4 5h16l-6 7v6.5l-4 2V12z"/>',
  refresh:
    '<path d="M3.5 12A8.5 8.5 0 0 1 12 3.5c3 0 5.6 1.6 7.1 4"/><path d="M19.5 3.5v4h-4"/><path d="M20.5 12A8.5 8.5 0 0 1 12 20.5c-3 0-5.6-1.6-7.1-4"/><path d="M4.5 20.5v-4h4"/>',
  'more-horizontal': `${dot(5, 12, 1.4)}${dot(12, 12, 1.4)}${dot(19, 12, 1.4)}`,
  'more-vertical': `${dot(12, 5, 1.4)}${dot(12, 12, 1.4)}${dot(12, 19, 1.4)}`,

  /* Status -------------------------------------------------------- */
  info: `<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5"/>${dot(12, 7.8)}`,
  'check-circle': '<circle cx="12" cy="12" r="9"/><path d="m7.8 12.3 2.9 2.9 5.5-6.1"/>',
  'alert-triangle': `<path d="M12 3.4 21.6 20H2.4z"/><path d="M12 9.6v4.4"/>${dot(12, 17)}`,
  'x-circle':
    '<circle cx="12" cy="12" r="9"/><path d="m8.8 8.8 6.4 6.4"/><path d="m15.2 8.8-6.4 6.4"/>',
  help: `<circle cx="12" cy="12" r="9"/><path d="M9.4 9.3a2.7 2.7 0 0 1 5.2.9c0 1.8-2.6 2.3-2.6 3.9"/>${dot(12, 17.2)}`,
  spinner:
    '<circle cx="12" cy="12" r="8.5" opacity="0.25"/><path d="M20.5 12A8.5 8.5 0 0 0 12 3.5"/>',
  bell:
    '<path d="M18 9a6 6 0 1 0-12 0c0 5-2 6.5-2 6.5h16S18 14 18 9z"/><path d="M13.7 19.5a2 2 0 0 1-3.4 0"/>',
  star: '<path d="m12 3.5 2.7 5.5 6.1.9-4.4 4.3 1 6-5.4-2.8-5.4 2.8 1-6-4.4-4.3 6.1-.9z"/>',
  zap: '<path d="M13 2.5 4.5 13.5H10l-1 8 10.5-12H13z"/>',

  /* Content ------------------------------------------------------- */
  file:
    '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/>',
  folder: '<path d="M3 7a2 2 0 0 1 2-2h4l2.5 2.5H19a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  image:
    '<circle cx="5.8" cy="5" r="2.4"/><path d="M2.5 17.5 6.4 12.2a1.9 1.9 0 0 1 2.8 0l2.1 3 2.5-7.3a2.1 2.1 0 0 1 3.2 0l4.5 9.6a2 2 0 0 1-2 2h-15a2 2 0 0 1-2-2z"/>',
  code: '<path d="m9 8-5 4 5 4"/><path d="m15 8 5 4-5 4"/>',
  bold: '<path d="M7 4.5h6a3.75 3.75 0 0 1 0 7.5H7z"/><path d="M7 12h7a4 4 0 0 1 0 8H7z"/>',
  italic: '<path d="M10.5 4.5H18"/><path d="M6 19.5h7.5"/><path d="m15 4.5-6 15"/>',
  terminal: '<path d="m5 7 5 5-5 5"/><path d="M12.5 17H19"/>',
  database:
    '<ellipse cx="12" cy="6" rx="7.5" ry="3"/><path d="M4.5 6v12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3V6"/><path d="M4.5 12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3"/>',
  layers: '<path d="m12 3 9 4.8-9 4.8-9-4.8z"/><path d="m3 12.5 9 4.8 9-4.8"/><path d="m3 17 9 4.8 9-4.8"/>',
  package:
    '<path d="m12 3 8.5 4.6v8.8L12 21l-8.5-4.6V7.6z"/><path d="m3.5 7.6 8.5 4.6 8.5-4.6"/><path d="M12 12.2V21"/>',
  calendar:
    '<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 10h17"/><path d="M8 3v4"/><path d="M16 3v4"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 6.8V12l3.6 2.2"/>',
  mail:
    '<rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="m3 7 8.1 5.6a1.6 1.6 0 0 0 1.8 0L21 7"/>',
  link:
    '<path d="M10.5 13.5a4.5 4.5 0 0 0 6.4 0l2.6-2.6a4.5 4.5 0 0 0-6.4-6.4l-1.4 1.4"/><path d="M13.5 10.5a4.5 4.5 0 0 0-6.4 0l-2.6 2.6a4.5 4.5 0 0 0 6.4 6.4l1.4-1.4"/>',
  bookmark: '<path d="M6.5 3.5h11a1 1 0 0 1 1 1V21l-6.5-4.2L5.5 21V4.5a1 1 0 0 1 1-1z"/>',
  tag:
    '<path d="M20.5 4v8.2a1 1 0 0 1-.3.7l-7.3 7.3a1 1 0 0 1-1.4 0l-7.7-7.7a1 1 0 0 1 0-1.4l7.3-7.3a1 1 0 0 1 .7-.3H20a.5.5 0 0 1 .5.5z"/><circle cx="16.3" cy="7.7" r="1.3"/>',

  /* People and system --------------------------------------------- */
  user: '<circle cx="12" cy="8" r="4"/><path d="M4.5 20.5a7.5 7.5 0 0 1 15 0"/>',
  users:
    '<circle cx="9.5" cy="8" r="3.7"/><path d="M2.5 20.5a7 7 0 0 1 14 0"/><path d="M16.5 4.6a3.7 3.7 0 0 1 0 6.9"/><path d="M18.2 14.2a7 7 0 0 1 3.3 6.3"/>',
  settings:
    '<path d="M4 7h9"/><path d="M19 7h1"/><path d="M4 17h5"/><path d="M15 17h5"/><circle cx="16" cy="7" r="2.6"/><circle cx="12" cy="17" r="2.6"/>',
  lock:
    '<rect x="4.5" y="10.5" width="15" height="10" rx="2"/><path d="M8 10.5v-3a4 4 0 0 1 8 0v3"/>',
  unlock:
    '<rect x="4.5" y="10.5" width="15" height="10" rx="2"/><path d="M8 10.5v-3a4 4 0 0 1 7.6-1.8"/>',
  eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3.2"/>',
  'eye-off':
    '<path d="m4 4 16 16"/><path d="M9.9 5.9A9.6 9.6 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-3.4 4.2"/><path d="M6.4 7.9A17 17 0 0 0 2.5 12S6 18.5 12 18.5a9.4 9.4 0 0 0 3.6-.7"/><path d="M9.8 10a3.2 3.2 0 0 0 4.3 4.3"/>',
  home:
    '<path d="m3.5 10.5 8.5-7 8.5 7"/><path d="M5.5 9v10.5a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V9"/><path d="M9.8 20.5v-6h4.4v6"/>',
  globe:
    '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z"/>',
  heart: '<path d="M12 20.3 4.6 13a4.7 4.7 0 0 1 6.6-6.7l.8.8.8-.8A4.7 4.7 0 0 1 19.4 13z"/>',

  /* Theme --------------------------------------------------------- */
  sun:
    '<circle cx="12" cy="12" r="4.2"/><path d="M12 2.2v2.2M12 19.6v2.2M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M2.2 12h2.2M19.6 12h2.2M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6"/>',
  moon: '<path d="M20.8 13.1A8.6 8.6 0 1 1 10.9 3.2a6.9 6.9 0 0 0 9.9 9.9z"/>',
}

/**
 * Second names for glyphs whose job is not what they depict.
 *
 * Resolved at lookup rather than copied into {@link ICONS}, so
 * {@link iconNames} lists each drawing once.
 */
const ALIASES = {
  x: 'close',
  cross: 'close',
  success: 'check-circle',
  warning: 'alert-triangle',
  danger: 'x-circle',
  error: 'x-circle',
  question: 'help',
  loading: 'spinner',
  cog: 'settings',
  gear: 'settings',
  'trash-can': 'trash',
  delete: 'trash',
  pencil: 'edit',
  notification: 'bell',
  dots: 'more-horizontal',
  bolt: 'zap',
  lightning: 'zap',
  'arrow-back': 'arrow-left',
  'arrow-forward': 'arrow-right',
}

/** Icons added by {@link registerIcons}, checked before the built-ins. */
const custom = new Map()

/**
 * Add your own glyphs, or replace a built-in.
 *
 * The markup is the *inside* of the `<svg>` — paths and shapes drawn on
 * the same 24x24 grid, left unfilled so `currentColor` reaches them:
 *
 * ```js
 * registerIcons({ logo: '<path d="M4 20 12 4l8 16z"/>' })
 * icon('logo')
 * ```
 *
 * Call it once from a module your pages import. A name registered twice
 * keeps the last one, which is what makes this the way to restyle a
 * built-in rather than fork the library. Passing `null` drops a
 * registration, so a built-in you overrode comes back.
 *
 * @param {Record<string, string | null>} glyphs
 */
export function registerIcons(glyphs = {}) {
  for (const [name, markup] of Object.entries(glyphs)) {
    if (markup === null) custom.delete(name)
    else if (typeof markup === 'string') custom.set(name, markup)
  }
}

/**
 * Every icon name, built-ins and registered alike, sorted.
 *
 * Aliases are left out — they resolve to a drawing already listed.
 *
 * @returns {string[]}
 */
export function iconNames() {
  return [...new Set([...Object.keys(ICONS), ...custom.keys()])].sort()
}

/**
 * Whether a name resolves to a glyph, following aliases.
 *
 * @param {unknown} name
 * @returns {boolean}
 */
export function hasIcon(name) {
  return glyph(name) != null
}

/** The markup for a name, or `undefined`. Registered icons win. */
function glyph(name) {
  if (typeof name !== 'string') return undefined

  const key = ALIASES[name] ?? name

  return custom.get(name) ?? custom.get(key) ?? ICONS[key]
}

/**
 * Serialize attributes the way javascript-to-html does, since there is
 * no `svg()` element function to hand them to: `true` renders bare,
 * `false` and nullish drop out, and `"` becomes an entity so a value
 * cannot close the attribute early.
 */
function serialize(attributes) {
  let out = ''

  for (const [name, value] of Object.entries(attributes)) {
    if (value == null || value === false) continue

    out += value === true ? ` ${name}` : ` ${name}="${String(value).replaceAll('"', '&#34;')}"`
  }

  return out
}

/**
 * One icon, as an inline `<svg>`.
 *
 * ```js
 * icon('check')                        // decorative, hidden from AT
 * icon('trash', { label: 'Delete' })   // announced as an image
 * icon({ name: 'spinner', spin: true })
 * ```
 *
 * It is `aria-hidden` unless you give it a `label`, which is right far
 * more often than not: an icon next to the word "Delete" should not be
 * read out a second time. Give it a label only when the icon is the
 * whole of the meaning, as in an icon-only button.
 *
 * Sizing follows the surrounding text — `1em` square — so an icon in a
 * button matches the button's label without being told what size that
 * is. `size` overrides it with a token or any CSS length.
 *
 * An unknown name renders nothing at all rather than throwing, for the
 * same reason {@link oneOf} falls back: a cosmetic prop should not be
 * able to fail a build.
 *
 * @param {...any} args - `icon(name, { size, label, spin, color })`
 * @returns {string}
 */
export function icon(...args) {
  const { props, children } = parseArgs(args)
  const { name = children[0], size, label, spin = false, ...rest } = props

  const markup = glyph(name)

  if (markup == null) return ''

  const sized = size == null || size === '' ? undefined : oneOf(size, SIZES, '')

  return `<svg${serialize({
    ...BASE,
    ...attrs(rest, {
      class: cx(
        'su-icon',
        sized && sized !== 'md' && `su-icon--${sized}`,
        spin && 'su-icon--spin',
      ),
      // A length that is not a token becomes the size directly.
      style: sized === '' ? { '--su-icon-size': String(size) } : undefined,
    }),
    ...(label == null
      ? { 'aria-hidden': 'true' }
      : { role: 'img', 'aria-label': String(label) }),
  })}>${markup}</svg>`
}
