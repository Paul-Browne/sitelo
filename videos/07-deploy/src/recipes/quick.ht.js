import * as ui from 'sitelo/ui'
import { getRecipes } from '../lib/api.js'
import { layout } from '../lib/layout.js'
import { recipeGrid, totalTime } from '../lib/recipe-card.js'

export async function data() {
  const recipes = await getRecipes()
  return { recipes: recipes.filter((recipe) => totalTime(recipe) <= 30) }
}

export default ({ page, data }) =>
  layout({
    title: 'Quick recipes',
    description: 'Recipes that take 30 minutes or less.',
    path: page.routePath,
  },
    ui.stack({ gap: 'lg', class: 'section' },
      ui.heading({ level: 1 }, 'Ready in 30 minutes'),
      ui.text({ variant: 'lead', tone: 'muted' }, 'Prep and cooking included.'),
      ui.heading({ level: 2, size: 'h5' }, `${data.recipes.length} recipes`),
      recipeGrid(data.recipes),
    ),
  )
