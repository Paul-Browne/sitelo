/**
 * Grain — a film-grain texture over whatever it wraps.
 *
 * ```js
 * import { styles } from 'sitelo/ui'
 * import { grain, grainStyles } from 'sitelo/ui-extras'
 *
 * head(styles(), grainStyles())
 * body(grain({ as: 'section' }, container(hero({ title: 'Hello' }))))
 * ```
 *
 * The component and its sheet come as a pair: `grain.css` is not part of
 * `ui.css`, so a page that uses this links it — {@link grainStyles} does
 * for it exactly what `styles()` does for the core sheet.
 */

import { div } from 'javascript-to-html'

import { attrs, el, parseArgs } from '../ui/internal.js'
import { DEFAULTS, isDefault, tile } from '../ui/runtime/grain.js'
import { createSheet } from '../ui/sheet.js'

const sheet = createSheet('grain', new URL('./grain.css', import.meta.url))

/**
 * The grain stylesheet as a string, for writing somewhere yourself.
 *
 * @param {object} [options]
 * @param {boolean} [options.minify=true]
 * @returns {string}
 */
export const grainStylesheet = sheet.stylesheet

/**
 * The URL the grain stylesheet is served from — the `href`
 * {@link grainStyles} carries, for a `<link>`, a preload or a CSP of
 * your own.
 *
 * @param {object} [options]
 * @param {string} [options.base]
 * @param {boolean} [options.hash=true]
 * @returns {string}
 */
export const grainStylesUrl = sheet.stylesUrl

/**
 * The grain stylesheet, ready to drop into `head()` beside `styles()`.
 *
 * ```js
 * head(styles(), grainStyles())
 * // <link rel="stylesheet" href="/su/grain-3f1c9a2e.css">
 * ```
 *
 * Served and copied by sitelo's plugin on the same terms as the core
 * sheet, from the same base. Takes the same options: `inline` for a
 * `<style>` instead, `base`, `hash`, `minify` and `nonce`.
 *
 * @param {object} [options]
 * @param {boolean} [options.inline=false]
 * @param {string} [options.base]
 * @param {boolean} [options.hash=true]
 * @param {boolean} [options.minify=true]
 * @param {string} [options.nonce]
 * @returns {string}
 */
export const grainStyles = sheet.styles

/**
 * Wrapper that lays a film grain over whatever it contains.
 *
 * The texture is a static noise tile drawn on `::after`, so it costs
 * one paint and never re-rasterises when the content under it changes —
 * unlike a `filter`, which has to be recomputed whenever anything
 * beneath it moves. It sits above the children and ignores the pointer,
 * and it takes the box's own `border-radius`, so wrapping a rounded
 * surface does not square its corners off.
 *
 * It has no width or padding of its own: put a `container()` inside
 * for a textured full-bleed band, or wrap a card, a hero or a section
 * to grain just that.
 *
 * `type`, `frequency`, `octaves`, `seed` and `color` are the turbulence
 * itself, and touching any of them builds the tile here rather than
 * using the stylesheet's. `opacity` is how far it is pushed once drawn;
 * left alone, the theme sets it, and that is the value the two themes
 * are balanced on. The SVG itself is written in `ui/runtime/grain.js`,
 * so that `setGrain()` in the browser draws exactly what this does.
 *
 * @param {...any} args - `grain({ opacity, type, frequency, octaves, seed, color, blend, as }, ...children)`
 * @returns {string}
 */
export function grain(...args) {
  const { props, children } = parseArgs(args)
  const { opacity, type, frequency, octaves, seed, color, blend, as, ...rest } = props

  const noise = { ...DEFAULTS, color }

  for (const [key, value] of Object.entries({ type, frequency, octaves, seed })) {
    if (value != null) noise[key] = value
  }

  return el(as, div)(
    attrs(rest, {
      class: 'su-grain',
      style: {
        '--su-grain-opacity': opacity,
        '--su-grain-blend': blend,
        // Only a call that changed something pays for an image of its own;
        // a colour the filter cannot read counts as no change.
        '--su-grain-image': isDefault(noise) ? undefined : tile(noise),
      },
    }),
    ...children,
  )
}
