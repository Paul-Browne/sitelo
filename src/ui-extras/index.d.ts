/**
 * Type definitions for sitelo-ui's extras.
 *
 * The same open props as the core: anything a component does not name
 * falls through to the rendered element as an HTML attribute.
 */

import type { Args, BaseProps, StyleOptions, StylesUrlOptions } from '../ui/index.d.ts'

/* -------------------------------------------------------------- *
 * Grain
 * -------------------------------------------------------------- */

export interface GrainProps extends BaseProps {
  /** Opacity of the texture. Left alone, the theme sets it. */
  opacity?: number | string
  /** `mix-blend-mode` for the texture, e.g. `'overlay'`. Default `'normal'`. */
  blend?: string
  /**
   * Which turbulence to draw: `'fractal'` is film grain, `'turbulence'`
   * is cloudier and veined. Default `'fractal'`.
   */
  type?: 'fractal' | 'turbulence'
  /** Cycles per pixel — higher is finer. Default `0.57`. */
  frequency?: number
  /** Layers of noise summed together, 1–8. Default `3`. */
  octaves?: number
  /** Which noise to draw. Any number; the same one always looks the same. */
  seed?: number
  /**
   * Tints the noise. Baked into the filter, so it must be a colour this
   * can resolve — `#rgb`, `#rrggbb`, `#rrggbbaa`, `rgb()` or `rgba()`;
   * alpha is how much of the tint, so `#ff880080` is half of `#ff8800`.
   * Anything else (a named colour, `currentColor`, `var()`) leaves the
   * noise grey, as do white and alpha zero.
   */
  color?: string
  as?: string
}

export function grain(...args: Args<GrainProps>): string

/**
 * The grain stylesheet for `head()`, beside `styles()` — a `<link>`
 * sitelo's plugin serves in dev and writes into the build, or the CSS
 * itself with `inline`.
 */
export function grainStyles(options?: StyleOptions): string

/** The grain stylesheet as raw CSS. */
export function grainStylesheet(options?: { minify?: boolean }): string

/** The URL the grain stylesheet is served from, for a `<link>` of your own. */
export function grainStylesUrl(options?: StylesUrlOptions): string

/* -------------------------------------------------------------- *
 * Default export
 * -------------------------------------------------------------- */

declare const extras: {
  [name: string]: (...args: any[]) => string
}

export default extras
