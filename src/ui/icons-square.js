/**
 * The square icon set: every built-in glyph redrawn in straight lines.
 *
 * Drawn for the presets set in hairlines and monospace — `blueprint` and
 * `terminal` — and chosen with `iconSet('square')`. The rules that make
 * it one set rather than a pile of drawings:
 *
 * - Straight strokes only, horizontal, vertical or at 45° wherever the
 *   thing drawn allows it. A circle becomes a square where it is only a
 *   container (the status glyphs, a dot) and an octagon where being round
 *   is the point (a lens, a clock, a coin, a head).
 * - Square ends and mitred corners, set on the `<svg>` by the set's own
 *   attributes in `icons.js`, so the drawings carry geometry and nothing
 *   else — the same split as the round set.
 * - A thinner line than the round set's: 1.5 on the 24 grid, about a
 *   pixel at body size, to sit beside the presets' 1px rules.
 *
 * The brand marks are not redrawn: a logo is the brand's shape, not this
 * set's, so the round set's reproductions are used whichever is chosen.
 *
 * Internal: `icons.js` is the only importer.
 */

/** A dot: a small filled square, opting out of the shared stroke. */
const dot = (x, y, size = 2.2) =>
  `<rect x="${x - size / 2}" y="${y - size / 2}" width="${size}" height="${size}" fill="currentColor" stroke="none"/>`

/** Two decimals at most, so a computed vertex prints the way a drawn one would. */
const num = (value) => String(Math.round(value * 100) / 100)

/**
 * An octagon standing in for a circle: `r` from the centre to each flat
 * side, with the corners cut at 45°. A regular octagon cuts each corner
 * back by r(2 − √2); `cut` overrides it, smaller for a squarer shape.
 */
const octagon = (cx, cy, r, cut = r * (2 - Math.SQRT2)) => {
  const near = r - cut
  return `<path d="M${num(cx - near)} ${num(cy - r)}H${num(cx + near)}L${num(cx + r)} ${num(cy - near)}V${num(cy + near)}L${num(cx + near)} ${num(cy + r)}H${num(cx - near)}L${num(cx - r)} ${num(cy + near)}V${num(cy - near)}z"/>`
}

/**
 * A spoke out from (cx, cy) at `angle` degrees clockwise from twelve
 * o'clock, between two distances from the centre.
 */
const spoke = (cx, cy, angle, from, to) => {
  const radians = (angle * Math.PI) / 180
  const x = Math.sin(radians)
  const y = -Math.cos(radians)
  return `M${num(cx + x * from)} ${num(cy + y * from)}L${num(cx + x * to)} ${num(cy + y * to)}`
}

/** The square every status glyph is drawn in. */
const BOX = '<path d="M3 3h18v18H3z"/>'

export const SQUARE = {
  /* Direction ----------------------------------------------------- */
  'chevron-up': '<path d="M6 15 12 9 18 15"/>',
  'chevron-down': '<path d="M6 9 12 15 18 9"/>',
  'chevron-left': '<path d="M15 6 9 12 15 18"/>',
  'chevron-right': '<path d="M9 6 15 12 9 18"/>',
  'chevrons-left': '<path d="M11 6 5 12 11 18"/><path d="M18 6 12 12 18 18"/>',
  'chevrons-right': '<path d="M6 6 12 12 6 18"/><path d="M13 6 19 12 13 18"/>',
  'arrow-up': '<path d="M12 20V5"/><path d="M5 11 12 4 19 11"/>',
  'arrow-down': '<path d="M12 4v15"/><path d="M5 13 12 20 19 13"/>',
  'arrow-left': '<path d="M20 12H5"/><path d="M11 5 4 12 11 19"/>',
  'arrow-right': '<path d="M4 12h15"/><path d="M13 5 20 12 13 19"/>',
  'external-link': '<path d="M10 4H4v16h16v-6"/><path d="M14 4h6v6"/><path d="M20 4 11 13"/>',
  menu: '<path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/>',

  /* Actions ------------------------------------------------------- */
  close: '<path d="M6 6 18 18"/><path d="M18 6 6 18"/>',
  check: '<path d="M4 12 9 17 20 6"/>',
  plus: '<path d="M12 4v16"/><path d="M4 12h16"/>',
  minus: '<path d="M4 12h16"/>',
  search: `${octagon(10, 10, 6.5)}<path d="M15 15 20.5 20.5"/>`,
  copy: '<path d="M9 9h11v11H9z"/><path d="M15 9V4H4v11h5"/>',
  download: '<path d="M12 3v12"/><path d="M7 10 12 15 17 10"/><path d="M4 16v4h16v-4"/>',
  upload: '<path d="M12 15V4"/><path d="M7 8 12 3 17 8"/><path d="M4 16v4h16v-4"/>',
  trash: '<path d="M3 6h18"/><path d="M9 6V3h6v3"/><path d="M5 6v15h14V6"/><path d="M10 10v7"/><path d="M14 10v7"/>',
  edit: '<path d="M4 20v-4L16 4l4 4L8 20z"/><path d="M13 7 17 11"/>',
  filter: '<path d="M3 4h18l-7 7v9h-4v-9z"/>',
  refresh: '<path d="M5 10V5h14v5"/><path d="M16.5 7.5 19 10 21.5 7.5"/><path d="M19 14v5H5v-5"/><path d="M2.5 16.5 5 14 7.5 16.5"/>',
  'more-horizontal': `${dot(5, 12, 2.6)}${dot(12, 12, 2.6)}${dot(19, 12, 2.6)}`,
  share: '<path d="M3.5 9.5h5v5h-5z"/><path d="M15.5 3.5h5v5h-5z"/><path d="M15.5 15.5h5v5h-5z"/><path d="M8.5 12H12"/><path d="M15.5 6H12v12h3.5"/>',
  'log-in': '<path d="M14 4h6v16h-6"/><path d="M3 12h11"/><path d="M10 8 14 12 10 16"/>',
  'log-out': '<path d="M10 4H4v16h6"/><path d="M9 12h11"/><path d="M16 8 20 12 16 16"/>',
  print: '<path d="M7 9V3h10v6"/><path d="M7 17H3V9h18v8h-4"/><path d="M7 14h10v7H7z"/>',
  'more-vertical': `${dot(12, 5, 2.6)}${dot(12, 12, 2.6)}${dot(12, 19, 2.6)}`,

  /* Status -------------------------------------------------------- */
  info: `${BOX}<path d="M12 11v6"/>${dot(12, 7.5)}`,
  'check-circle': `${BOX}<path d="M7.5 12 10.5 15 16.5 9"/>`,
  'alert-triangle': `<path d="M12 3.5 21.5 20h-19z"/><path d="M12 10v4"/>${dot(12, 17)}`,
  'x-circle': `${BOX}<path d="M9 9 15 15"/><path d="M15 9 9 15"/>`,
  help: `${BOX}<path d="M9 9V7h6v4.5h-3V14"/>${dot(12, 17)}`,
  /*
   * A braille cell, two dots across and three down, as a terminal draws
   * its spinner: ⠋ ⠙ ⠹ ⠸ ⠼ ⠴ ⠦ ⠧ ⠇ ⠏. The dots are listed in the order
   * the run of lit ones comes round them — along the top, down the
   * right, back up the left — because the core sheet animates them by
   * position: under `spin` each is lit for its own stretch of the cycle,
   * and the cell is not turned. At rest it shows the first frame, ⠋, so
   * the three dots that frame leaves dark start hidden.
   */
  spinner: `<g class="su-icon-braille">${[
    { x: 8, y: 4, lit: true },
    { x: 16, y: 4, lit: true },
    { x: 16, y: 12, lit: false },
    { x: 16, y: 20, lit: false },
    { x: 8, y: 20, lit: false },
    { x: 8, y: 12, lit: true },
  ]
    .map(({ x, y, lit }) => `<rect x="${x - 2}" y="${y - 2}" width="4" height="4" fill="currentColor" stroke="none"${lit ? '' : ' opacity="0"'}/>`)
    .join('')}</g>`,
  'thumbs-up': '<path d="M3 10h4v11H3z"/><path d="M7 10 10 3h2v6h8l-2 12H7"/>',
  'thumbs-down': '<path d="M3 3h4v11H3z"/><path d="M7 14l3 7h2v-6h8L18 3H7"/>',
  sparkles: '<path d="M10 3 11.8 8.2 17 10 11.8 11.8 10 17 8.2 11.8 3 10 8.2 8.2z"/><path d="M17.5 14 18.5 16.5 21 17.5 18.5 18.5 17.5 21 16.5 18.5 14 17.5 16.5 16.5z"/>',
  bell: '<path d="M4 17h16v-1l-2-2V9l-3-4H9L6 9v5l-2 2z"/><path d="M10 20h4"/>',
  star: '<path d="M12 3.5 14.7 9 20.8 9.9 16.4 14.2 17.4 20.2 12 17.4 6.6 20.2 7.6 14.2 3.2 9.9 9.3 9z"/>',
  zap: '<path d="M13 2.5 4.5 13.5H10l-1 8 10.5-12H13z"/>',

  /* Content ------------------------------------------------------- */
  file: '<path d="M14 3H5v18h14V8z"/><path d="M14 3v5h5"/>',
  folder: '<path d="M3 5h6l2 2h10v13H3z"/>',
  image: '<path d="M3 4h18v16H3z"/><path d="M3 17 8 12 13 17 16 14 21 19"/><path d="M15 7h3v3h-3z"/>',
  camera: `<path d="M3 7h4l2-3h6l2 3h4v13H3z"/>${octagon(12, 13.5, 3.5)}`,
  video: '<path d="M2.5 6h13v12h-13z"/><path d="M15.5 10 21 7v10l-5.5-3z"/>',
  'comment-bubble': '<path d="M3 4h18v13H10l-4 4v-4H3z"/>',
  feather: '<path d="M20 4 11 6 6 14v4h4l8-5z"/><path d="M4 20 14 10"/><path d="M9 15h6"/>',
  code: '<path d="M9 7 4 12 9 17"/><path d="M15 7 20 12 15 17"/>',
  bold: '<path d="M7 4h6.5L16 6.5v2L13.5 11H7z"/><path d="M7 11h7.5L17 13.5v4L14.5 20H7z"/>',
  italic: '<path d="M10 4h8"/><path d="M6 20h8"/><path d="M15 4 9 20"/>',
  terminal: '<path d="M5 7 10 12 5 17"/><path d="M12 17h7"/>',
  database: '<path d="M4 6 7 4h10l3 2-3 2H7z"/><path d="M4 6v12l3 2h10l3-2V6"/><path d="M4 12l3 2h10l3-2"/>',
  layers: '<path d="M12 3 21 8 12 13 3 8z"/><path d="M3 12.5 12 17.5 21 12.5"/><path d="M3 17 12 22 21 17"/>',
  package: '<path d="M12 3 20.5 7.5v9L12 21l-8.5-4.5v-9z"/><path d="M3.5 7.5 12 12 20.5 7.5"/><path d="M12 12v9"/>',
  calendar: '<path d="M3 5h18v16H3z"/><path d="M3 10h18"/><path d="M8 3v4"/><path d="M16 3v4"/>',
  clock: `${octagon(12, 12, 9)}<path d="M12 7v5h4"/>`,
  mail: '<path d="M3 5h18v14H3z"/><path d="M3 6 12 13 21 6"/>',
  link: '<path d="M10 8H4v8h6"/><path d="M14 8h6v8h-6"/><path d="M8 12h8"/>',
  bookmark: '<path d="M6 3h12v18l-6-5-6 5z"/>',
  tag: '<path d="M12 3h9v9l-9 9-9-9z"/><path d="M16 6h2v2h-2z"/>',

  /* Commerce ------------------------------------------------------ */
  'shopping-cart': `<path d="M2 4h3l3 11h10l2-8H6"/>${dot(9.5, 19.5, 2.6)}${dot(17, 19.5, 2.6)}`,
  'shopping-bag': '<path d="M5 8h14l-1 13H6z"/><path d="M9 11V5h6v6"/>',
  'credit-card': '<path d="M3 5h18v14H3z"/><path d="M3 10h18"/><path d="M6 15h4"/>',
  coins: `${octagon(9.5, 9.5, 6)}${octagon(9.5, 9.5, 2.5)}<path d="M15.5 8.5h2.5l2.5 2.5v7L18 20.5h-7L8.5 18v-2.5"/>`,
  banknote: `<path d="M2 6h20v12H2z"/>${octagon(12, 12, 2.6)}<path d="M6 10v4"/><path d="M18 10v4"/>`,
  wallet: '<path d="M19 8V5H4v14h15v-3"/><path d="M14 10h7v4h-7z"/>',
  truck: `<path d="M14 16V5H2v11h2.5"/><path d="M14 8h4l3 4v4h-1.5"/><path d="M8.5 16h7"/>${octagon(6.5, 17.5, 2)}${octagon(17.5, 17.5, 2)}`,
  receipt: '<path d="M5 3h14v17l-2 2-2-2-2 2-2-2-2 2-2-2-2 2z"/><path d="M8 8h8"/><path d="M8 12h5"/>',
  store: '<path d="M3 9h18l-2-5H5z"/><path d="M4 9v12h16V9"/><path d="M10 21v-6h4v6"/>',
  percent: '<path d="M5 19 19 5"/><path d="M5 5h4v4H5z"/><path d="M15 15h4v4h-4z"/>',
  gift: '<path d="M3 9h18v4H3z"/><path d="M5 13v8h14v-8"/><path d="M12 9v12"/><path d="M12 9H8L6 7V5h2l4 4z"/><path d="M12 9h4l2-2V5h-2l-4 4z"/>',

  /* People and system --------------------------------------------- */
  user: `${octagon(12, 8, 4)}<path d="M4 21v-2l4-4h8l4 4v2"/>`,
  'universal-access': `${octagon(12, 12, 9)}${dot(12, 6.9, 2.6)}<path d="M7.5 9 12 10l4.5-1"/><path d="M12 10v4"/><path d="M9.5 18 12 14l2.5 4"/>`,
  users: `${octagon(9, 8, 3.5)}<path d="M2 21v-2l3.5-3.5h7L16 19v2"/><path d="M15 4.5h2l2 2v3l-2 2h-2"/><path d="M18 15.5l3.5 3.5v2"/>`,
  location: '<path d="M12 22 5 15V6l3-3h8l3 3v9z"/><path d="M10 8h4v4h-4z"/>',
  pin: '<path d="M9 3h6l-1 6 3 3v2H7v-2l3-3z"/><path d="M12 14v7"/>',
  smartphone: '<path d="M6 2h12v20H6z"/><path d="M10 18h4"/>',
  key: `${octagon(7, 12, 4)}<path d="M11 12h10"/><path d="M17 12v3.5"/><path d="M20 12v2.5"/>`,
  gear: `${octagon(12, 12, 6.5)}${octagon(12, 12, 2.6)}<path d="${[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => spoke(12, 12, angle, 6.5, 9)).join('')}"/>`,
  settings: '<path d="M4 7h9.5"/><path d="M18.5 7H20"/><path d="M4 17h5.5"/><path d="M14.5 17H20"/><path d="M13.5 4.5h5v5h-5z"/><path d="M9.5 14.5h5v5h-5z"/>',
  lock: '<path d="M4 11h16v10H4z"/><path d="M8 11V6l2-2h4l2 2v5"/>',
  unlock: '<path d="M4 11h16v10H4z"/><path d="M8 11V6l2-2h4l2 2"/>',
  eye: `<path d="M2 12 6 7h12l4 5-4 5H6z"/>${octagon(12, 12, 3)}`,
  'eye-off': `<path d="M2 12 6 7h12l4 5-4 5H6z"/>${octagon(12, 12, 3)}<path d="M4 4 20 20"/>`,
  home: '<path d="M3 12 12 3 21 12"/><path d="M5 10v11h14V10"/><path d="M10 21v-6h4v6"/>',
  globe: `${octagon(12, 12, 9)}<path d="M3 12h18"/><path d="M12 3 8 8v8l4 5 4-5V8z"/>`,
  heart: '<path d="M12 20 4 12V7l3-3h3l2 2 2-2h3l3 3v5z"/>',

  /* Theme --------------------------------------------------------- */
  sun: `${octagon(12, 12, 4.2)}<path d="${[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => spoke(12, 12, angle, 7.5, 10)).join('')}"/>`,
  moon: '<path d="M10 3H8L3 8v8l5 5h8l5-5v-2l-2 2h-8l-3-3V5z"/>',
}

/**
 * The square every filled status glyph is painted in: the outline's box
 * grown by half its stroke, so filled and outlined end at the same edge.
 */
const STATUS_BOX = 'M2.25 2.25h19.5v19.5H2.25z'

/**
 * The filled forms, for the same glyphs as the round set's, so
 * `fillableIcons()` is one list whichever set is chosen.
 *
 * `true` paints the outline's own closed path. A string is a second
 * drawing: a chevron's triangle, which keeps the stroke and with it the
 * set's sharp corners, or a status glyph's shape with its mark knocked
 * out under `evenodd`. Those marks are the exact outlines of the strokes
 * the outline form draws — square ends, mitred corners, a hairline
 * wide — so the hole is the mark, not a likeness of it.
 */
export const SQUARE_FILLED = {
  bell: true,
  bookmark: true,
  folder: true,
  heart: true,
  star: true,

  'chevron-up': '<path d="M6 15 12 9 18 15z"/>',
  'chevron-down': '<path d="M6 9 12 15 18 9z"/>',
  'chevron-left': '<path d="M15 6 9 12 15 18z"/>',
  'chevron-right': '<path d="M9 6 15 12 9 18z"/>',

  'check-circle': `<path stroke="none" d="${STATUS_BOX}M6.44 12 10.5 16.06 17.56 9 16.5 7.94 10.5 13.94 7.5 10.94z"/>`,
  'x-circle': `<path stroke="none" d="${STATUS_BOX}M15 16.06 12 13.06 9 16.06 7.94 15 10.94 12 7.94 9 9 7.94 12 10.94 15 7.94 16.06 9 13.06 12 16.06 15z"/>`,
  info: `<path stroke="none" d="${STATUS_BOX}M11.25 10.25h1.5v7.5h-1.5zM10.9 6.4h2.2v2.2h-2.2z"/>`,
  help: `<path stroke="none" d="${STATUS_BOX}M9.75 9.75V7.75h4.5v3h-3v4h1.5v-2.5h3v-6h-7.5v3.5zM10.9 15.9h2.2v2.2h-2.2z"/>`,
  'alert-triangle':
    '<path stroke="none" d="M12 2 22.8 20.75H1.2zM11.25 9.25h1.5v5.5h-1.5zM10.9 15.9h2.2v2.2h-2.2z"/>',
}
