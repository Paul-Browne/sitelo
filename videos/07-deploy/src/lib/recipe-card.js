import * as ui from 'sitelo/ui'
import { escapeHtml } from './escape.js'

export const totalTime = (recipe) => recipe.prepTimeMinutes + recipe.cookTimeMinutes

const recipeCard = (recipe) =>
  ui.card({ href: `/recipes/${recipe.slug}` },
    ui.cardMedia({
      src: recipe.image,
      alt: '',
      ratio: '4 / 3',
      // The grid is 4 columns wide on a desktop, 1 or 2 on a phone
      sizes: '(min-width: 64rem) 15rem, (min-width: 32rem) 50vw, 100vw',
    }),
    ui.cardHeader({
      title: escapeHtml(recipe.name),
      subtitle: `${escapeHtml(recipe.cuisine)} · ${totalTime(recipe)} min · ★ ${recipe.rating}`,
    }),
  )

// auto-fill rather than auto-fit, so a single card keeps its width
export const recipeGrid = (recipes) =>
  ui.grid({ columns: 'repeat(auto-fill, minmax(min(100%, 14rem), 1fr))', gap: 'lg' },
    recipes.map(recipeCard),
  )
