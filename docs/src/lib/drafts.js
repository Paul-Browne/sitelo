import { LOCALES } from './i18n.js'

/**
 * Pages that are written but not published yet.
 *
 * Keyed by the English path, like `TRANSLATED_PATHS`. A draft keeps its page
 * files in every locale, but `sitelo.config.js` leaves them out of the build
 * and every sidebar, gallery and reference table that would list them skips
 * them. Publishing one is deleting its line here.
 */
export const DRAFTS = new Set(['/ui/carousel'])

/** Exported names whose only documentation is a draft page. */
export const DRAFT_EXPORTS = new Set(['carousel'])

/**
 * Is this path, in any locale, a draft?
 *
 * @param {string} href e.g. `/ui/carousel` or `/de/ui/carousel`
 */
export function isDraft(href) {
  const locale = href.split('/')[1]
  return DRAFTS.has(LOCALES.includes(locale) ? href.slice(locale.length + 1) : href)
}

/** Globs for `exclude` in `sitelo.config.js`: every locale's page file. */
export function draftPageGlobs(pagesDir = 'src') {
  return [...DRAFTS].map((draft) => `${pagesDir}/**${draft}.ht.js`)
}
