/**
 * The extras' runtime, for calling yourself.
 *
 * ```js
 * import { setGrain } from 'sitelo/ui-extras/client'
 * ```
 */

export interface GrainState {
  type: 'fractal' | 'turbulence'
  /** Cycles per pixel. */
  frequency: number
  octaves: number
  seed: number
  /** `#rrggbb`, or `null` when the noise is grey. */
  color: string | null
  opacity: number
  blend: string
}

export interface SetGrainOptions {
  type?: 'fractal' | 'turbulence'
  frequency?: number
  octaves?: number
  seed?: number
  /** `#rgb`, `#rrggbb`, `#rrggbbaa`, `rgb()` or `rgba()` — alpha is how much; `null` takes a tint off. */
  color?: string | null
  /** `null` hands it back to the theme. */
  opacity?: number | null
  /** A `mix-blend-mode`; `null` returns to `normal`. */
  blend?: string | null
}

/**
 * Redraw a `grain()`, addressed by element or by `id`. Only what is
 * passed changes. Returns what it is showing now, or `null` when there
 * is no such grain on the page.
 */
export function setGrain(target: Element | string, options?: SetGrainOptions): GrainState | null

/** What a grain is showing — the theme's opacity when nothing set one. */
export function getGrain(target: Element | string): GrainState | null
