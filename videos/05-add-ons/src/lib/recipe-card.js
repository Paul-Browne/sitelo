import { a, h3, img, p } from 'javascript-to-html'
import { escapeHtml } from './escape.js'

export const totalTime = (recipe) => recipe.prepTimeMinutes + recipe.cookTimeMinutes

export const recipeCard = (recipe) =>
  a({ class: 'card', href: `/recipes/${recipe.slug}` },
    // The grid is 4 columns wide on a desktop, 1 or 2 on a phone
    img({ src: recipe.image, alt: '', sizes: '(min-width: 64rem) 15rem, (min-width: 32rem) 50vw, 100vw' }),
    h3(escapeHtml(recipe.name)),
    p({ class: 'meta' },
      `${escapeHtml(recipe.cuisine)} · ${totalTime(recipe)} min · ★ ${recipe.rating}`,
    ),
  )
