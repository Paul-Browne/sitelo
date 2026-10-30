import { a, h3, img, p } from 'javascript-to-html'
import { escapeHtml } from './escape.js'

export const totalTime = (recipe) => recipe.prepTimeMinutes + recipe.cookTimeMinutes

export const recipeCard = (recipe) =>
  a({ class: 'card', href: `/recipes/${recipe.slug}` },
    img({ src: recipe.image, alt: '' }),
    h3(escapeHtml(recipe.name)),
    p({ class: 'meta' },
      `${escapeHtml(recipe.cuisine)} · ${totalTime(recipe)} min · ★ ${recipe.rating}`,
    ),
  )
