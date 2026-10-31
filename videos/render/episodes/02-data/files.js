// The states episode 2's files pass through. New files and the finished
// versions come straight from the snapshots; the in-between states of the
// home page are spelled out here.

import { snapshot } from '../../lib/capture-kit.js'

const replace = (text, from, to) => {
  if (!text.includes(from)) throw new Error(`Expected to find: ${from}`)
  return text.replace(from, to)
}

export const start = {
  index: snapshot('01-setup', 'src/index.ht.js'),
  layout: snapshot('01-setup', 'src/lib/layout.js'),
  styles: snapshot('01-setup', 'src/styles.css'),
}

export const api = snapshot('02-data', 'src/lib/api.js')
export const escape = snapshot('02-data', 'src/lib/escape.js')
export const card = snapshot('02-data', 'src/lib/recipe-card.js')
export const recipes = snapshot('02-data', 'src/recipes.ht.js')
export const layout = snapshot('02-data', 'src/lib/layout.js')
export const styles = snapshot('02-data', 'src/styles.css')

const final = snapshot('02-data', 'src/index.ht.js')

/** data() is in, and the page shows the pick's name as it came from the API. */
const data = `import { a, h1, h2, img, p, section } from 'javascript-to-html'
import { getRecipe, getRecipes } from './lib/api.js'
import { layout } from './lib/layout.js'

export async function data() {
  const recipes = await getRecipes()
  const topRated = recipes.toSorted((a, b) => b.rating - a.rating).slice(0, 6)

  // A different recipe each day... but only when the site is rebuilt.
  const day = Math.floor(Date.now() / 86_400_000)
  const pick = await getRecipe((day % recipes.length) + 1)

  return { topRated, pick }
}

export default ({ page, data }) =>
  layout({
    title: 'Home',
    description: 'Quick, reliable recipes for busy weeknights.',
    path: page.routePath,
  },
    section({ class: 'hero' },
      img({ src: '/images/hero.jpg', alt: 'A bowl of pasta with tomatoes and basil on a wooden table' }),
      h1('Dinner, sorted.'),
      p({ class: 'lead' }, 'Fifty recipes you can actually cook on a Tuesday.'),
      a({ class: 'button', href: '/about' }, 'Meet the kitchen'),
    ),
    section({ class: 'pick' },
      h2('Recipe of the day'),
      p(data.pick.name),
    ),
  )
`

/** data() alone, before the page reads it: typed in two steps on screen. */
const dataOnly = replace(data, `    section({ class: 'pick' },
      h2('Recipe of the day'),
      p(data.pick.name),
    ),
`, '')

const escaped = replace(
  replace(data, "import { layout } from './lib/layout.js'", "import { escapeHtml } from './lib/escape.js'\nimport { layout } from './lib/layout.js'"),
  'p(data.pick.name)',
  'p(escapeHtml(data.pick.name))',
)

/** Cards and the top-rated grid, before the recipes page exists to link to. */
const cards = replace(
  final,
  "a({ class: 'button', href: '/recipes' }, 'Browse all recipes')",
  "a({ class: 'button', href: '/about' }, 'Meet the kitchen')",
)

export const index = { dataOnly, data, escaped, cards, final }
