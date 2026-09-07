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
  share: '<circle cx="17.5" cy="5.5" r="2.8"/><circle cx="17.5" cy="18.5" r="2.8"/><circle cx="6.5" cy="12" r="2.8"/><path d="m9 10.6 6-3.2"/><path d="m9 13.4 6 3.2"/>',
  'log-in':
    '<path d="M15.5 3.5h3a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2h-3"/><path d="m10 8 4 4-4 4"/><path d="M14 12H3.5"/>',
  'log-out':
    '<path d="M9.5 3.5h-3a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h3"/><path d="m16 8 4 4-4 4"/><path d="M20 12H9.5"/>',
  print:
    '<path d="M7 9V3.5h10V9"/><path d="M7 17H5.5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H17"/><rect x="7" y="13.5" width="10" height="7" rx="1"/>',
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
  'thumbs-up':
    '<path d="M7 10.5h2.3l3.3-6.9a2.2 2.2 0 0 1 3.2 2.8l-1.4 4.1h4.4a2.1 2.1 0 0 1 2.1 2.5l-1.3 6.3a2.2 2.2 0 0 1-2.2 1.7H7z"/><rect x="2.5" y="10.5" width="4.5" height="11" rx="1.2"/>',
  'thumbs-down':
    '<path d="M7 13.5h2.3l3.3 6.9a2.2 2.2 0 0 0 3.2-2.8l-1.4-4.1h4.4a2.1 2.1 0 0 0 2.1-2.5l-1.3-6.3A2.2 2.2 0 0 0 17.4 2.5H7z"/><rect x="2.5" y="2.5" width="4.5" height="11" rx="1.2"/>',
  sparkles:
    '<path d="M10 3.5 11.8 8.2 16.5 10 11.8 11.8 10 16.5 8.2 11.8 3.5 10 8.2 8.2z"/><path d="M17.5 14.2 18.5 16.8 21.1 17.8 18.5 18.8 17.5 21.4 16.5 18.8 13.9 17.8 16.5 16.8z"/>',
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
  camera:
    '<path d="M3 8.5a2 2 0 0 1 2-2h2.6l1.5-2.2h5.8l1.5 2.2H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><circle cx="12" cy="13" r="3.6"/>',
  video: '<rect x="2.5" y="6" width="13" height="12" rx="2.5"/><path d="m15.5 10.5 5-3.2v9.4l-5-3.2z"/>',
  'comment-bubble':
    '<path d="M5.5 4h13A2.5 2.5 0 0 1 21 6.5v8a2.5 2.5 0 0 1-2.5 2.5H9.6L6 20.8V17h-.5A2.5 2.5 0 0 1 3 14.5v-8A2.5 2.5 0 0 1 5.5 4z"/>',
  feather:
    '<path d="M20.3 12.3a6 6 0 0 0-8.5-8.5L5 10.6v8.5h8.5z"/><path d="M16 8 2.5 21.5"/><path d="M17.4 15.1H9.1"/>',
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

  /* Commerce ------------------------------------------------------ */
  'shopping-cart':
    '<path d="M2.5 4h2.2l2.6 11.6h10.4"/><path d="M6.6 11.9h11.3l1.7-5.9H5.4"/><circle cx="9.6" cy="18.8" r="1.5"/><circle cx="17.4" cy="18.8" r="1.5"/>',
  'shopping-bag':
    '<path d="M4.6 7.5h14.8l-1.1 11.6a1.8 1.8 0 0 1-1.8 1.6H7.5a1.8 1.8 0 0 1-1.8-1.6z"/><path d="M8.6 10.5V6.4a3.4 3.4 0 0 1 6.8 0v4.1"/>',
  'credit-card':
    '<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M2.5 9.5h19"/><path d="M6 14.8h3.6"/>',
  coins:
    '<circle cx="9.4" cy="9.4" r="5.6"/><circle cx="9.4" cy="9.4" r="2.6"/><path d="M15 9a5.6 5.6 0 1 1-6 6"/>',
  banknote:
    '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.6"/><path d="M5.8 10.2v3.6"/><path d="M18.2 10.2v3.6"/>',
  wallet:
    '<path d="M20 8.4V7.2a1.9 1.9 0 0 0-1.9-1.9H5.3A2.3 2.3 0 0 0 3 7.6v8.8a2.3 2.3 0 0 0 2.3 2.3h12.8a1.9 1.9 0 0 0 1.9-1.9v-1.2"/><path d="M21.5 9.8h-4a2.2 2.2 0 0 0 0 4.4h4a.5.5 0 0 0 .5-.5v-3.4a.5.5 0 0 0-.5-.5z"/>',
  truck:
    '<path d="M2.5 16.4V7.4a1.9 1.9 0 0 1 1.9-1.9h8.2a1.9 1.9 0 0 1 1.9 1.9v9"/><path d="M14.5 9.9h3.2a2 2 0 0 1 1.7 1l2.1 3.4v2.1"/><path d="M5.3 16.4H2.5"/><path d="M15.5 16.4H9.1"/><path d="M21.5 16.4h-2.2"/><circle cx="7.2" cy="18.2" r="1.9"/><circle cx="17.4" cy="18.2" r="1.9"/>',
  receipt:
    '<path d="M4.5 3.2h15v17.6l-3.75-1.6-3.75 1.6-3.75-1.6-3.75 1.6z"/><path d="M8 8.2h8"/><path d="M8 12.4h4.8"/>',
  store:
    '<path d="M2.5 9.5h19l-2-5H4.5z"/><path d="M4.2 9.5V19a1.5 1.5 0 0 0 1.5 1.5h12.6a1.5 1.5 0 0 0 1.5-1.5V9.5"/><path d="M9.5 20.5V15h5v5.5"/>',
  percent:
    '<path d="M5 19 19 5"/><circle cx="7.5" cy="7.5" r="2.8"/><circle cx="16.5" cy="16.5" r="2.8"/>',
  gift:
    '<rect x="3" y="9.4" width="18" height="4.6" rx="1"/><path d="M4.8 14v5.6a1.5 1.5 0 0 0 1.5 1.5h11.4a1.5 1.5 0 0 0 1.5-1.5V14"/><path d="M12 9.4v11.7"/><path d="M12 9.4H7.8a2.6 2.6 0 0 1 0-5.2C10.9 4.2 12 9.4 12 9.4z"/><path d="M12 9.4h4.2a2.6 2.6 0 0 0 0-5.2C13.1 4.2 12 9.4 12 9.4z"/>',

  /* People and system --------------------------------------------- */
  user: '<circle cx="12" cy="8" r="4"/><path d="M4.5 20.5a7.5 7.5 0 0 1 15 0"/>',
  /*
   * Proportioned off the standard symbol, measured against the ring's
   * outer edge: feet 0.25 out and 0.61 down, head 0.14 across. The arms
   * are two straight segments meeting in a shallow V, not an arc — the
   * hands sit about a unit above the shoulders, and curving them reads
   * as a shrug. They run a seventh shorter than the symbol's own, which
   * reaches nearer the ring than looks right at this size.
   */
  'universal-access': `<circle cx="12" cy="12" r="9"/>${dot(12, 6.85, 1.45)}<path d="M7.6 9.05 12 9.85 16.4 9.05"/><path d="M12 9.85v4.2"/><path d="m9.5 18 2.5-3.95 2.5 3.95"/>`,
  users:
    '<circle cx="9.5" cy="8" r="3.7"/><path d="M2.5 20.5a7 7 0 0 1 14 0"/><path d="M16.5 4.6a3.7 3.7 0 0 1 0 6.9"/><path d="M18.2 14.2a7 7 0 0 1 3.3 6.3"/>',
  location:
    '<path d="M12 21.5s7.5-6.9 7.5-11.8a7.5 7.5 0 0 0-15 0c0 4.9 7.5 11.8 7.5 11.8z"/><circle cx="12" cy="9.7" r="2.8"/>',
  pin: '<path d="M9.4 3.5h5.2l-.8 5.3 3.4 3.1v1.6H6.8v-1.6l3.4-3.1z"/><path d="M12 13.5V21"/>',
  smartphone: '<rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M10.6 18.4h2.8"/>',
  key: '<circle cx="7" cy="12" r="4.5"/><path d="M11.5 12h9"/><path d="M17 12v3.5"/><path d="M20 12v2.5"/>',
  gear:
    '<circle cx="12" cy="12" r="6.4"/><circle cx="12" cy="12" r="2.6"/><path d="M18.4 12h1.8M5.6 12H3.8M12 18.4v1.8M12 5.6V3.8M16.53 16.53l1.27 1.27M7.47 7.47 6.2 6.2M16.53 7.47 17.8 6.2M7.47 16.53 6.2 17.8"/>',
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

  /* Brands ---------------------------------------------------------
   *
   * Reproductions of other people's marks rather than drawings in this
   * library's style, so they break two of its rules: they are solid
   * shapes rather than strokes, which is what a logo is, and their
   * proportions are the brand's rather than this grid's. `filled` means
   * nothing to them — they already are.
   *
   * The artwork is from Simple Icons (CC0), which is why it is here
   * rather than from Font Awesome: Font Awesome Free's icons are
   * CC BY 4.0, and an attribution clause would follow this package to
   * everyone who installs it. `linkedin` is drawn here because Simple
   * Icons carries no LinkedIn mark at all.
   *
   * CC0 covers the artwork, not the trademark. These are for pointing
   * at the thing they name — a profile link, a share button — which is
   * what nominative use means; they are not yours to put on a product.
   *
   * `x-twitter` rather than `x`, because `x` already aliases `close`
   * and a close button turning into a logo would be a nasty surprise.
   * ---------------------------------------------------------------- */
  'facebook':
    '<path fill="currentColor" stroke="none" d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z"/>',
  'google':
    '<path fill="currentColor" stroke="none" d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>',
  'instagram':
    '<path fill="currentColor" stroke="none" d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077"/>',
  'linkedin':
    '<path fill="currentColor" stroke="none" d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM2.4 21.5h5.16V9.5H2.4v12zM9.6 9.5h4.95v1.64a5.42 5.42 0 0 1 4.88-2.14c3.3 0 5.17 2.06 5.17 5.9v6.6h-5.16v-5.85c0-1.6-.57-2.7-2-2.7-1.09 0-1.74.74-2.02 1.45-.1.26-.13.61-.13.97v6.13H9.6s.07-10.9 0-12z"/>',
  'tiktok':
    '<path fill="currentColor" stroke="none" d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>',
  'whatsapp':
    '<path fill="currentColor" stroke="none" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>',
  'x-twitter':
    '<path fill="currentColor" stroke="none" d="M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z"/>',
  'youtube':
    '<path fill="currentColor" stroke="none" d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>',

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
  cog: 'gear',
  gears: 'gear',
  login: 'log-in',
  'sign-in': 'log-in',
  logout: 'log-out',
  'sign-out': 'log-out',
  'map-pin': 'location',
  marker: 'location',
  mobile: 'smartphone',
  like: 'thumbs-up',
  dislike: 'thumbs-down',
  comment: 'comment-bubble',
  message: 'comment-bubble',
  chat: 'comment-bubble',
  ai: 'sparkles',
  magic: 'sparkles',
  printer: 'print',
  twitter: 'x-twitter',
  accessibility: 'universal-access',
  a11y: 'universal-access',
  'trash-can': 'trash',
  delete: 'trash',
  pencil: 'edit',
  notification: 'bell',
  dots: 'more-horizontal',
  cart: 'shopping-cart',
  bag: 'shopping-bag',
  card: 'credit-card',
  cash: 'banknote',
  money: 'banknote',
  delivery: 'truck',
  shipping: 'truck',
  shop: 'store',
  discount: 'percent',
  sale: 'percent',
  bolt: 'zap',
  lightning: 'zap',
  'arrow-back': 'arrow-left',
  'arrow-forward': 'arrow-right',
}

/** The circle every round status glyph is filled with: `r` 9 plus the
 * 0.9 the outline's stroke adds, so filled and outline end at the same
 * edge. */
const STATUS_DISC = 'M12 2.1a9.9 9.9 0 1 1 0 19.8 9.9 9.9 0 0 1 0-19.8z'

/**
 * The filled form of a glyph, where it has one.
 *
 * `true` means the outline path already *is* the silhouette, so filling
 * is the single `fill` attribute and the two forms cannot drift apart.
 *
 * A string is a second drawing, for glyphs the outline path cannot be
 * filled into. `help`'s is the outline glyph's own centreline offset by
 * half the stroke and closed up — drawing that question mark freehand
 * put it a size too big and a shade too heavy against its siblings. Two kinds need one. A status glyph's mark sits inside its
 * shape, so painting it would swallow the tick — the mark is knocked
 * back out with `fill-rule: evenodd`, which wants it as a closed outline
 * rather than the stroked line the outline form uses; those drop their
 * stroke, and draw the outer shape at the outline's outer edge so the
 * silhouettes still agree. A chevron is an open line with no inside at
 * all, and fills to the triangle its own three points describe — it
 * keeps the stroke, which is what rounds the corners.
 */
const FILLED = {
  bell: true,
  bookmark: true,
  folder: true,
  heart: true,
  star: true,

  'chevron-up': '<path d="M6 15 12 9 18 15z"/>',
  'chevron-down': '<path d="M6 9 12 15 18 9z"/>',
  'chevron-left': '<path d="M15 6 9 12 15 18z"/>',
  'chevron-right': '<path d="M9 6 15 12 9 18z"/>',

  'check-circle': `<path stroke="none" d="${STATUS_DISC}M8.44 11.66 10.67 13.89 15.53 8.5a.9.9 0 0 1 1.34 1.2L11.37 15.8a.9.9 0 0 1-1.31.04L7.16 12.94a.9.9 0 0 1 1.28-1.28z"/>`,
  'x-circle': `<path stroke="none" d="${STATUS_DISC}M12 10.73 14.57 8.16a.9.9 0 0 1 1.27 1.27L13.27 12l2.57 2.57a.9.9 0 0 1-1.27 1.27L12 13.27l-2.57 2.57a.9.9 0 0 1-1.27-1.27L10.73 12 8.16 9.43a.9.9 0 0 1 1.27-1.27z"/>`,
  info: `<path stroke="none" d="${STATUS_DISC}M12 10.1a.9.9 0 0 1 .9.9v5.5a.9.9 0 0 1-1.8 0V11a.9.9 0 0 1 .9-.9zM12 6.75a1.05 1.05 0 1 1 0 2.1 1.05 1.05 0 0 1 0-2.1z"/>`,
  help: `<path stroke="none" d="${STATUS_DISC}M12 16.15a1.05 1.05 0 1 1 0 2.1 1.05 1.05 0 0 1 0-2.1zM10.21 9.69L10.41 9.31L10.64 9.03L10.93 8.8L11.26 8.63L11.62 8.54L11.98 8.52L12.35 8.57L12.69 8.7L13.01 8.89L13.27 9.15L13.48 9.45L13.62 9.79L13.69 10.13L13.68 10.41L13.56 10.68L13.33 10.97L13.01 11.29L12.6 11.64L12.15 12.03L11.68 12.53L11.27 13.23L11.11 13.99A0.9 0.9 0 0 0 12.89 14.21L12.94 13.89L13.1 13.64L13.39 13.34L13.77 13L14.21 12.63L14.67 12.17L15.11 11.59L15.42 10.84L15.49 10.01L15.35 9.27L15.06 8.59L14.64 7.98L14.11 7.47L13.49 7.08L12.79 6.83L12.06 6.72L11.33 6.76L10.62 6.95L9.96 7.28L9.38 7.74L8.91 8.31L8.59 8.91A0.9 0.9 0 0 0 10.21 9.69Z"/>`,
  'alert-triangle':
    '<path stroke="none" d="M11.22 2.95a.9.9 0 0 1 1.56 0l9.6 16.6a.9.9 0 0 1-.78 1.35H2.4a.9.9 0 0 1-.78-1.35zM12 8.7a.9.9 0 0 1 .9.9v4.4a.9.9 0 0 1-1.8 0V9.6a.9.9 0 0 1 .9-.9zM12 15.95a1.05 1.05 0 1 1 0 2.1 1.05 1.05 0 0 1 0-2.1z"/>',
}

/** Icons added by {@link registerIcons}, checked before the built-ins. */
const custom = new Map()

/** Filled forms from {@link registerIcons}, same shape as {@link FILLED}. */
const customFilled = new Map()

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
 * Pass `{ markup, fillable: true }` instead of a bare string when the
 * drawing is one closed silhouette and should answer to `filled`, or
 * `{ markup, filled }` to give it a second drawing for the filled form.
 *
 * Call it once from a module your pages import. A name registered twice
 * keeps the last one, which is what makes this the way to restyle a
 * built-in rather than fork the library. Passing `null` drops a
 * registration, so a built-in you overrode comes back.
 *
 * @param {Record<string, string | { markup: string, fillable?: boolean, filled?: string } | null>} glyphs
 */
export function registerIcons(glyphs = {}) {
  for (const [name, value] of Object.entries(glyphs)) {
    if (value === null) {
      custom.delete(name)
      customFilled.delete(name)
      continue
    }

    const markup = typeof value === 'string' ? value : value?.markup

    if (typeof markup !== 'string') continue

    custom.set(name, markup)
    customFilled.delete(name)

    if (typeof value !== 'object') continue

    if (typeof value.filled === 'string') customFilled.set(name, value.filled)
    else if (value.fillable) customFilled.set(name, true)
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
 * The glyphs that answer to `filled`, sorted.
 *
 * @returns {string[]}
 */
export function fillableIcons() {
  return iconNames().filter((name) => resolve(name)?.filled != null)
}

/**
 * Whether a name resolves to a glyph, following aliases.
 *
 * @param {unknown} name
 * @returns {boolean}
 */
export function hasIcon(name) {
  return resolve(name) != null
}

/**
 * Look a name up, following aliases. Registered icons win over
 * built-ins, and the same lookup answers both what to draw and whether
 * it can be filled, so the two cannot disagree.
 *
 * @param {unknown} name
 * @returns {{ markup: string, filled?: true | string } | undefined}
 */
function resolve(name) {
  if (typeof name !== 'string') return undefined

  const key = ALIASES[name] ?? name

  for (const candidate of [name, key]) {
    if (custom.has(candidate)) {
      return { markup: custom.get(candidate), filled: customFilled.get(candidate) }
    }
  }

  return ICONS[key] ? { markup: ICONS[key], filled: FILLED[key] } : undefined
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
 * `filled` paints the glyph instead of outlining it, for the ones whose
 * drawing is a single closed shape — `heart`, `star`, `bookmark` and
 * friends, listed by {@link fillableIcons}. It is a prop rather than a
 * second name because the filled state is nearly always a *state*:
 *
 * ```js
 * icon('heart', { filled: liked })
 * ```
 *
 * Asking to fill a glyph that cannot be filled leaves it outlined, for
 * the same reason an unknown name renders nothing: a cosmetic prop
 * should not be able to fail a build.
 *
 * @param {...any} args - `icon(name, { size, label, spin, filled })`
 * @returns {string}
 */
export function icon(...args) {
  const { props, children } = parseArgs(args)
  const { name = children[0], size, label, spin = false, filled = false, ...rest } = props

  const found = resolve(name)

  if (found == null) return ''

  /*
   * `evenodd` is what turns a knocked-out mark into a hole rather than
   * something painted over. Whether the drawing keeps the stroke is its
   * own business: a solid shape carrying a cut-out mark sets
   * `stroke="none"` on itself, while a chevron's triangle keeps it and
   * gets the set's rounded corners for free.
   */
  const solid = filled ? found.filled : undefined
  const own = typeof solid === 'string'
  const markup = own ? solid : found.markup
  const paint = own
    ? { fill: 'currentColor', 'fill-rule': 'evenodd' }
    : solid
      ? { fill: 'currentColor' }
      : {}

  const sized = size == null || size === '' ? undefined : oneOf(size, SIZES, '')

  /*
   * A spinning icon turns an inner group rather than the `<svg>` itself.
   * Rotating the element means CSS resolves the origin in CSS pixels,
   * and an `em`-sized icon lands on a fraction of one — 7.4375px inside
   * a default button. WebKit does not keep that fraction, so the glyph
   * orbits a point slightly off its centre and the spin wobbles. Inside
   * the group the origin is (12, 12) in the viewBox's own units, which
   * is exact whatever size the icon is drawn at.
   */
  const content = spin ? `<g>${markup}</g>` : markup

  return `<svg${serialize({
    ...BASE,
    ...paint,
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
  })}>${content}</svg>`
}
