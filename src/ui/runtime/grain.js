/**
 * A grain's noise: building it, and changing it from your own code.
 *
 * `grain()` draws the noise as an SVG filter in a `url()`, and this is
 * the one place that SVG is written — the component imports {@link tile}
 * from here for the build, and the browser imports it to redraw.
 *
 * `set` is the half a page drives:
 *
 * ```js
 * import { setGrain } from 'sitelo/ui/client'
 *
 * setGrain('hero', { type: 'turbulence', seed: 7 })
 * ```
 *
 * or straight from an event attribute, the way the components reach
 * their own modules:
 *
 * ```js
 * button({ onclick: "import('/su/grain.js').then(m=>m.set('hero',{seed:7}))" }, 'Reroll')
 * ```
 *
 * Give the grain an `id` — it falls through to the wrapper like any
 * other attribute — and that id is the handle both halves take.
 */

import { part } from './helpers.js'

/** The noise the stylesheet carries, as numbers. */
export const DEFAULTS = { type: 'fractal', frequency: 0.57, octaves: 3, seed: 0 }

/** `type` in the component's words, and in the filter's. */
const TYPES = { fractal: 'fractalNoise', turbulence: 'turbulence' }

/**
 * A colour as filter coefficients, or null if it cannot be read.
 *
 * The value is baked into the SVG, so it has to be resolvable here:
 * `#rgb`, `#rrggbb`, `#rrggbbaa` and `rgb()`/`rgba()` are, and
 * `currentColor`, a named colour and `var(--x)` are not. Callers treat
 * null as "leave it grey" rather than an error, so a typo in a colour
 * never fails a build.
 *
 * The tint multiplies, so a coefficient of 1 leaves a channel alone.
 * Alpha is how far to go from that: `#ff880080` is half the tint of
 * `#ff8800`. White at any alpha, or anything at alpha zero, changes
 * nothing and reads as null — which is what lets a colour picker, which
 * has no "none", offer one anyway.
 *
 * @param {unknown} color
 * @returns {number[] | null}
 */
export function tint(color) {
  const parsed = channelsOf(color)

  if (!parsed) return null

  const { channels, alpha } = parsed
  const mixed = channels.map((c) => +(1 - alpha * (1 - c)).toFixed(3))

  return mixed.some((c) => c < 1) ? mixed : null
}

/**
 * @param {unknown} color
 * @returns {{ channels: number[], alpha: number } | null}
 */
function channelsOf(color) {
  if (typeof color !== 'string') return null

  const hex = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.exec(color.trim())

  if (hex) {
    const digits = hex[1].length <= 4 ? [...hex[1]].map((d) => d + d) : hex[1].match(/../g)
    const values = digits.map((pair) => +(parseInt(pair, 16) / 255).toFixed(3))

    return { channels: values.slice(0, 3), alpha: values[3] ?? 1 }
  }

  const rgb = /^rgba?\(([^)]+)\)$/i.exec(color.trim())

  if (!rgb) return null

  const parts = rgb[1].split(/[\s,/]+/).filter(Boolean)

  if (parts.length < 3) return null

  const channel = (p) => (p.endsWith('%') ? parseFloat(p) / 100 : parseFloat(p) / 255)
  const alpha = parts[3] == null ? 1 : parts[3].endsWith('%') ? parseFloat(parts[3]) / 100 : parseFloat(parts[3])
  const channels = parts.slice(0, 3).map(channel)

  return channels.some(Number.isNaN) || Number.isNaN(alpha)
    ? null
    : { channels: channels.map((c) => +c.toFixed(3)), alpha: Math.min(1, Math.max(0, alpha)) }
}

/**
 * Percent-encode an SVG for a `url()`: only the characters that would
 * end the value or start a fragment. `%` first, or it escapes the escapes.
 *
 * @param {string} svg
 * @returns {string}
 */
function encode(svg) {
  return svg.replaceAll('%', '%25').replaceAll('<', '%3C').replaceAll('>', '%3E').replaceAll('#', '%23')
}

/**
 * The noise, as a `url()` value.
 *
 * There is deliberately no viewBox and no size: an SVG with neither has
 * no intrinsic dimensions, so as a background it is drawn at the box's
 * own size, once, with one user unit to the pixel. Nothing repeats and
 * nothing stretches, and `frequency` is cycles per pixel whatever the
 * box measures.
 *
 * The `feComponentTransfer` stretches the noise's contrast around its
 * midpoint, and every tile gets it: raw turbulence is a narrow band of
 * light greys that reads as haze over a dark surface and as nothing
 * over a light one. Stretched, it has dark specks as well as light, and
 * both themes take it at roughly the same strength.
 *
 * @param {object} [options]
 * @param {'fractal' | 'turbulence'} [options.type]
 * @param {number} [options.frequency] - cycles per pixel
 * @param {number} [options.octaves]
 * @param {number} [options.seed]
 * @param {string} [options.color] - `#rgb`, `#rrggbb`, `#rrggbbaa`, `rgb()` or `rgba()`
 * @returns {string}
 */
export function tile(options = {}) {
  const { type, frequency, octaves, seed, color } = { ...DEFAULTS, ...options }
  const stretch = ['R', 'G', 'B']
    .map((channel) => `<feFunc${channel} type='linear' slope='6' intercept='-2.5'/>`)
    .join('')
  const coefficients = tint(color)

  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg'>` +
    `<filter id='suGrain'>` +
    `<feTurbulence type='${TYPES[type] ?? TYPES.fractal}' baseFrequency='${frequency}' numOctaves='${octaves}' seed='${seed}'/>` +
    `<feColorMatrix type='matrix' values='0.33 0.33 0.33 0 0 0.33 0.33 0.33 0 0 0.33 0.33 0.33 0 0 0 0 0 1 0'/>` +
    `<feComponentTransfer>${stretch}</feComponentTransfer>` +
    (coefficients
      ? `<feColorMatrix type='matrix' values='${coefficients[0]} 0 0 0 0 ${coefficients[1]} 0 0 0 0 ${coefficients[2]} 0 0 0 0 0 0 0 1 0'/>`
      : '') +
    `</filter>` +
    `<rect width='100%' height='100%' filter='url(#suGrain)'/>` +
    `</svg>`

  return `url("data:image/svg+xml,${encode(svg)}")`
}

/**
 * Whether these options describe the stylesheet's own tile, in which
 * case an element needs no image of its own.
 *
 * @param {object} options
 * @returns {boolean}
 */
export function isDefault(options) {
  return (
    Object.keys(DEFAULTS).every((key) => options[key] === DEFAULTS[key]) &&
    tint(options.color) == null
  )
}

/**
 * Read a tile back into the options that made it.
 *
 * The attributes are the ones {@link tile} writes, in the order it
 * writes them, so a grain the server rendered and one `set` redrew
 * read the same way.
 *
 * @param {string} url
 * @returns {{ type: string, frequency: number, octaves: number, seed: number, color: string | null }}
 */
function parse(url) {
  const text = decodeURIComponent(url)
  const type = /type='(fractalNoise|turbulence)'/.exec(text)?.[1]
  const number = (name) => Number(new RegExp(`${name}='([^']+)'`).exec(text)?.[1])

  // The tint is the matrix whose second coefficient is zero; the
  // luminance one before it has 0.33 there.
  const matrices = [...text.matchAll(/values='([^']+)'/g)].map((m) => m[1].split(' ').map(Number))
  const tinted = matrices.find((m) => m.length === 20 && m[1] === 0)
  const hex = (v) => Math.round(v * 255).toString(16).padStart(2, '0')

  return {
    type: type === 'turbulence' ? 'turbulence' : 'fractal',
    frequency: number('baseFrequency'),
    octaves: number('numOctaves'),
    seed: number('seed'),
    // Rows are five wide: the R, G and B coefficients sit at 0, 5 and 10.
    color: tinted ? `#${hex(tinted[0])}${hex(tinted[5])}${hex(tinted[10])}` : null,
  }
}

/**
 * What a grain is showing.
 *
 * Everything comes from the element rather than from memory: the noise
 * from whichever `--su-grain-image` applies — its own, or the sheet's —
 * and the opacity and blend the same way, so a grain nothing has
 * touched reports the theme's opacity rather than `undefined`.
 *
 * @param {Element | string} target - the grain, or the id of one
 * @returns {{ type: string, frequency: number, octaves: number, seed: number, color: string | null, opacity: number, blend: string } | null}
 */
export function get(target) {
  const el = part(target, 'su-grain')

  if (!el) return null

  const computed = getComputedStyle(el)
  const read = (name) => el.style.getPropertyValue(name).trim() || computed.getPropertyValue(name).trim()

  return {
    ...parse(read('--su-grain-image')),
    opacity: Number(read('--su-grain-opacity')),
    blend: read('--su-grain-blend') || 'normal',
  }
}

/**
 * Redraw a grain.
 *
 * Only what is passed changes; the rest stays as it was. Pass `null`
 * for `opacity` or `blend` to hand them back to the stylesheet, and
 * `null` for `color` to take a tint off. Options that land back on the
 * defaults drop the element's own image, so it costs no more than a
 * grain the server rendered plain.
 *
 * @param {Element | string} target - the grain, or the id of one
 * @param {object} options
 * @param {'fractal' | 'turbulence'} [options.type]
 * @param {number} [options.frequency]
 * @param {number} [options.octaves]
 * @param {number} [options.seed]
 * @param {string | null} [options.color]
 * @param {number | null} [options.opacity]
 * @param {string | null} [options.blend]
 * @returns {ReturnType<typeof get>} what it is showing now
 */
export function set(target, options = {}) {
  const el = part(target, 'su-grain')

  if (!el) return null

  const current = get(el)
  const next = { ...current, ...options }
  const noise = {
    type: next.type,
    frequency: next.frequency,
    octaves: next.octaves,
    seed: next.seed,
    color: next.color,
  }

  if (isDefault(noise)) el.style.removeProperty('--su-grain-image')
  else el.style.setProperty('--su-grain-image', tile(noise))

  if ('opacity' in options) {
    if (options.opacity == null) el.style.removeProperty('--su-grain-opacity')
    else el.style.setProperty('--su-grain-opacity', String(options.opacity))
  }

  if ('blend' in options) {
    if (options.blend == null) el.style.removeProperty('--su-grain-blend')
    else el.style.setProperty('--su-grain-blend', options.blend)
  }

  return get(el)
}
