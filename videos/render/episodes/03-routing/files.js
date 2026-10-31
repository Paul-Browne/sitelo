// The states episode 3's files pass through. Finished files come from the
// snapshot; in-between states are the finished ones with later steps taken
// out, so they can't drift from what viewers download.

import { snapshot } from '../../lib/capture-kit.js'

const replace = (text, from, to) => {
  if (!text.includes(from)) throw new Error(`Expected to find: ${from}`)
  return text.replace(from, to)
}
const before = (file) => snapshot('02-data', file)
const after = (file) => snapshot('03-routing', file)

export const start = {
  index: before('src/index.ht.js'),
  api: before('src/lib/api.js'),
  card: before('src/lib/recipe-card.js'),
  layout: before('src/lib/layout.js'),
  styles: before('src/styles.css'),
  recipes: before('src/recipes.ht.js'),
}

// recipes.ht.js, moved into recipes/ with its imports fixed.
const recipesFinal = after('src/recipes/index.ht.js')
const recipesMoved = start.recipes.replaceAll("from './lib/", "from '../lib/")
const recipesBroken = replace(recipesFinal, "href: '/recipes/quick'", "href: '/recipes/quik'")
export const recipes = { moved: recipesMoved, final: recipesFinal, broken: recipesBroken }

export const slug = after('src/lib/slug.js')
export const api = after('src/lib/api.js')
export const card = after('src/lib/recipe-card.js')
export const index = after('src/index.ht.js')
export const styles = after('src/styles.css')
export const quick = after('src/recipes/quick.ht.js')
export const cuisines = after('src/lib/cuisines.js')
export const privacy = after('src/(legal)/privacy.ht.js')
export const terms = after('src/(legal)/terms.ht.js')
export const notFound = after('src/404.ht.js')
export const config = after('sitelo.config.js')

// [slug].ht.js in the three steps it's typed in.
const slugFinal = after('src/recipes/[slug].ht.js')
const slugParams = slugFinal.slice(0, slugFinal.indexOf('export async function data'))
const slugData = slugFinal.slice(0, slugFinal.indexOf('export default'))
export const recipePage = { params: slugParams, data: slugData, final: slugFinal }

// The catch-all, first for cuisine and meal pages only, then /cuisines too.
const catchAllFinal = after('src/cuisines/[...path]?.ht.js')
const indexBlock = catchAllFinal.slice(
  catchAllFinal.indexOf('// /cuisines itself'),
  catchAllFinal.indexOf('export default'),
)
let catchAllDeep = replace(catchAllFinal, '    { path: [] },\n', '')
catchAllDeep = replace(catchAllDeep, '//   /cuisines                 params.path = [] (or missing)\n', '')
catchAllDeep = replace(catchAllDeep, '  if (!cuisineSlug) return { cuisines }\n', '')
catchAllDeep = replace(catchAllDeep, indexBlock, '')
catchAllDeep = replace(catchAllDeep, '  if (cuisines) return cuisineIndex(page, cuisines)\n\n', '')
catchAllDeep = replace(catchAllDeep, 'data: { cuisines, cuisine, meal }', 'data: { cuisine, meal }')
export const catchAll = { deep: catchAllDeep, final: catchAllFinal }

// The layout gains the Cuisines link with the cuisines, and footer links with the legal pages.
const layoutFinal = after('src/lib/layout.js')
const footerLinks = "        p(a({ href: '/privacy' }, 'Privacy'), ' · ', a({ href: '/terms' }, 'Terms')),\n"
export const layout = { cuisines: replace(layoutFinal, footerLinks, ''), final: layoutFinal }
