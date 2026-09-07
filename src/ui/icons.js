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
 * filled into. Two kinds need one. A status glyph's mark sits inside its
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
  help: `<path stroke="none" d="${STATUS_DISC}M8.5 8.6a3.5 3.5 0 0 1 7 0 .9.9 0 0 1-.12.44l-2.6 4.6a.9.9 0 0 1-1.56-.88L13.82 8.16l-.12.44a1.7 1.7 0 0 0-3.4 0 .9.9 0 0 1-1.8 0zM12 16.15a1.05 1.05 0 1 1 0 2.1 1.05 1.05 0 0 1 0-2.1z"/>`,
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
  })}>${markup}</svg>`
}
