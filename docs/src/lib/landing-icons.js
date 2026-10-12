/**
 * Inline SVG for the landing page — shared by every locale, since none of it
 * carries text.
 *
 * All but two are sitelo-ui's own icons, asked for by name from the square set
 * the blueprint preset is drawn with. The lighthouse and
 * the components grid are not: each illustrates one feature on one page, and a
 * shared icon set is the wrong home for them. They stay local rather than going
 * through `registerIcons()`, which would put them in `iconNames()` and so on
 * the `/ui/icons` page, documenting them as part of the library.
 */
import { siteIcon } from './ui-theme.js'

/** The same 24x24 grid, stroke and square ends the square set is drawn in. */
const featureIcon = (paths) =>
  `<svg class="feature-icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true">${paths}</svg>`

export const arrowIcon = siteIcon('arrow-right', { class: 'btn-arrow' })

const feature = (name) => siteIcon(name, { class: 'feature-icon' })

export const icons = {
  routing: feature('folder'),
  code: feature('code'),
  data: feature('database'),
  pipeline: feature('package'),
  components: featureIcon(
    '<path d="M3.5 3.5h7v7h-7zM13.5 3.5h7v7h-7zM3.5 13.5h7v7h-7zM13.5 13.5h7v7h-7z"/>',
  ),
  terminal: feature('terminal'),
  search: feature('search'),
  layers: feature('layers'),
  sparkles: feature('sparkles'),
  lighthouse: featureIcon(
    '<path d="M8.4 5.5 12 2l3.6 3.5"/><path d="M9.7 5.5h4.6v3.2H9.7z"/><path d="M8 8.7h8"/><path d="M9.7 8.7 8 20.5"/><path d="M14.3 8.7 16 20.5"/><path d="M5.5 20.5h13"/><path d="M8.9 14.5h6.2"/><path d="M9 7H5.5"/><path d="M15 7H18.5"/>',
  ),
  gift: feature('gift'),
  image: feature('image'),
}
