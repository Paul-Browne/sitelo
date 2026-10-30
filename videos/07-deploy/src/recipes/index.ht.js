import * as ui from 'sitelo/ui'
import { getRecipes } from '../lib/api.js'
import { layout } from '../lib/layout.js'
import { recipeGrid } from '../lib/recipe-card.js'

export async function data() {
  return { recipes: await getRecipes() }
}

export default ({ page, data }) =>
  layout({
    title: 'Recipes',
    description: 'Every recipe in the kitchen.',
    path: page.routePath,
  },
    ui.stack({ gap: 'lg', class: 'section' },
      ui.heading({ level: 1 }, 'All recipes'),
      ui.text({ variant: 'lead', tone: 'muted' },
        'In a hurry? ',
        ui.link({ href: '/recipes/quick' }, 'These take 30 minutes or less'),
        '.',
      ),
      ui.heading({ level: 2, size: 'h5' }, `${data.recipes.length} recipes`),
      recipeGrid(data.recipes),
    ),
  )
