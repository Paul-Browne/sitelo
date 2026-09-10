/**
 * Inline SVG for the landing page — shared by every locale, since none of it
 * carries text.
 *
 * All but two are sitelo-ui's own icons, asked for by name. The lighthouse and
 * the components grid are not: each illustrates one feature on one page, and a
 * shared icon set is the wrong home for them. They stay local rather than going
 * through `registerIcons()`, which would put them in `iconNames()` and so on
 * the `/ui/icons` page, documenting them as part of the library.
 */
import { icon } from 'sitelo/ui'

/** The same 24x24 grid and stroke weight the built-in set is drawn on. */
const featureIcon = (paths) =>
  `<svg class="feature-icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`

export const arrowIcon = icon('arrow-right', { class: 'btn-arrow' })

const feature = (name) => icon(name, { class: 'feature-icon' })

export const icons = {
  routing: feature('folder'),
  code: feature('code'),
  data: feature('database'),
  pipeline: feature('package'),
  components: featureIcon(
    '<rect x="3.5" y="3.5" width="7" height="7" rx="1.4"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.4"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.4"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.4"/>',
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
