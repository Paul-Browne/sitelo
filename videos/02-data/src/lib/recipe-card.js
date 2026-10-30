import { article, h3, img, p } from 'javascript-to-html'
import { escapeHtml } from './escape.js'

export const totalTime = (recipe) => recipe.prepTimeMinutes + recipe.cookTimeMinutes

export const recipeCard = (recipe) =>
  article({ class: 'card' },
    img({ src: recipe.image, alt: '' }),
    h3(escapeHtml(recipe.name)),
    p({ class: 'meta' },
      `${escapeHtml(recipe.cuisine)} · ${totalTime(recipe)} min · ★ ${recipe.rating}`,
    ),
  )
