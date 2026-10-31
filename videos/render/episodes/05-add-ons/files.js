// The states episode 5's files pass through. The config grows one add-on at
// a time, so its stages are the finished file with later add-ons taken out.

import { snapshot } from '../../lib/capture-kit.js'

const replace = (text, from, to) => {
  if (!text.includes(from)) throw new Error(`Expected to find: ${from}`)
  return text.replace(from, to)
}
const before = (file) => snapshot('04-islands', file)
const after = (file) => snapshot('05-add-ons', file)

const RECIPES = 'src/recipes/index.ht.js'
const QUICK = 'src/recipes/quick.ht.js'
const CATCH = 'src/cuisines/[...path]?.ht.js'
const SLUG = 'src/recipes/[slug].ht.js'

export const start = Object.fromEntries(
  ['src/index.ht.js', 'src/lib/api.js', 'src/lib/recipe-card.js', 'src/lib/layout.js', SLUG, RECIPES, QUICK, CATCH, 'src/styles.css', '.gitignore', 'package.json', 'sitelo.config.js'].map((f) => [f, before(f)]),
)

// sitelo.config.js, add-on by add-on.
const configFinal = after('sitelo.config.js')
const pagefindBlock = '  // Index the recipe pages for search\n  pagefind: true,\n\n'
const thresholdsBlock = configFinal.slice(configFinal.indexOf('    // Performance still prints'), configFinal.indexOf('  },\n}'))
const imagesBlock = configFinal.slice(configFinal.indexOf('  // Resize and convert'), configFinal.indexOf('  // Index the recipe pages'))
const thresholds = replace(configFinal, pagefindBlock, '')
const images = replace(thresholds, thresholdsBlock, '')
const lighthouse = replace(images, imagesBlock, '')
const withOutput = (text) => replace(text, '    sample: 2,\n', '    sample: 2,\n    // Keep the HTML reports, in .sitelo/lighthouse/\n    output: true,\n')
export const config = {
  lighthouse: withOutput(lighthouse),
  images: withOutput(images),
  thresholds,
  final: configFinal,
}

// Headings above each grid.
export const headings = { [RECIPES]: after(RECIPES), [QUICK]: after(QUICK), [CATCH]: after(CATCH) }

// The recipe page: image hints first, Pagefind attributes later.
const slugFinal = after(SLUG)
let slugImages = replace(slugFinal, "    // Only what is inside data-pagefind-body gets indexed\n    article({ class: 'recipe', 'data-pagefind-body': true },", "    article({ class: 'recipe' },")
slugImages = replace(slugImages, "        // Pagefind shows this image next to the search result\n        'data-pagefind-meta': 'image[src], image_alt[alt]',\n", '')
slugImages = replace(slugImages, ", 'data-pagefind-filter': 'cuisine' }", ' }')
slugImages = replace(slugImages, ", 'data-pagefind-filter': 'meal' }", ' }')
export const slug = { images: slugImages, final: slugFinal }

export const card = after('src/lib/recipe-card.js')
export const index = after('src/index.ht.js')
export const layout = after('src/lib/layout.js')
export const styles = after('src/styles.css')
export const searchPage = after('src/search.ht.js')
export const searchScript = after('src/search.js')
export const gitignore = after('.gitignore')
export const api = after('src/lib/api.js')
export const knip = after('knip.js')

// package.json after the four installs, then with the two new scripts.
const pkgFinal = after('package.json')
export const pkg = {
  installed: replace(pkgFinal, ',\n    "lighthouse": "sitelo lighthouse",\n    "knip": "knip"', ''),
  final: pkgFinal,
}
