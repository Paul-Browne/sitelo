import { a, h1, h2, img, p, section } from 'javascript-to-html'
import { getRecipe, getRecipes } from './lib/api.js'
import { escapeHtml } from './lib/escape.js'
import { layout } from './lib/layout.js'
import { recipeCard, totalTime } from './lib/recipe-card.js'
import { slugify } from './lib/slug.js'

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
      a({ class: 'button', href: '/recipes' }, 'Browse all recipes'),
    ),
    section({ class: 'pick' },
      h2('Recipe of the day'),
      p(
        a({ href: `/recipes/${slugify(data.pick.name)}` }, escapeHtml(data.pick.name)),
        `: ${totalTime(data.pick)} minutes, serves ${data.pick.servings}.`,
      ),
    ),
    section(
      h2('Top rated'),
      section({ class: 'grid' }, data.topRated.map(recipeCard)),
    ),
  )
