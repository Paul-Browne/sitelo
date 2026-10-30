import { a, h1, p, section } from 'javascript-to-html'
import { getRecipes } from '../lib/api.js'
import { layout } from '../lib/layout.js'
import { recipeCard } from '../lib/recipe-card.js'

export async function data() {
  return { recipes: await getRecipes() }
}

export default ({ page, data }) =>
  layout({
    title: 'Recipes',
    description: 'Every recipe in the kitchen.',
    path: page.routePath,
  },
    h1('All recipes'),
    p({ class: 'lead' },
      `${data.recipes.length} recipes. In a hurry? `,
      a({ href: '/recipes/quick' }, 'These take 30 minutes or less'),
      '.',
    ),
    section({ class: 'grid' }, data.recipes.map(recipeCard)),
  )
