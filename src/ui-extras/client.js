/**
 * The extras' runtime, for calling yourself.
 *
 * The same shape as `sitelo/ui/client`, for the components under
 * `sitelo/ui-extras`: what a page drives rather than a click.
 *
 * ```js
 * import { setGrain } from 'sitelo/ui-extras/client'
 *
 * setGrain('hero', { type: 'turbulence', seed: 7 })
 * ```
 *
 * Nothing here is bundled by a component: they reach the same modules
 * through inline imports in their own event attributes.
 */

export { get as getGrain, set as setGrain } from '../ui/runtime/grain.js'
