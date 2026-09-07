/**
 * Inline SVG for the landing page — shared by every locale, since none of it
 * carries text.
 *
 * Most of these are sitelo-ui's own icons, asked for by name. The four below
 * are not: they illustrate one feature apiece on one page, and a shared icon
 * set is the wrong home for a lighthouse. They stay local rather than going
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
  feather: featureIcon(
    '<path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/><path d="M16 8 2 22"/><path d="M17.5 15H9"/>',
  ),
  terminal: feature('terminal'),
  search: feature('search'),
  layers: feature('layers'),
  sparkles: featureIcon(
    '<path d="m12 3 1.9 4.6 4.6 1.9-4.6 1.9L12 16l-1.9-4.6-4.6-1.9 4.6-1.9z"/><path d="m19 15 .9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9z"/>',
  ),
  lighthouse: featureIcon(
    '<path d="M8.4 5.5 12 2l3.6 3.5"/><path d="M9.7 5.5h4.6v3.2H9.7z"/><path d="M8 8.7h8"/><path d="M9.7 8.7 8 20.5"/><path d="M14.3 8.7 16 20.5"/><path d="M5.5 20.5h13"/><path d="M8.9 14.5h6.2"/><path d="M9 7H5.5"/><path d="M15 7H18.5"/>',
  ),
  gift: featureIcon(
    '<polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>',
  ),
  image: feature('image'),
}
