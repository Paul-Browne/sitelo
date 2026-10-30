import { a, h1, h2, img, p, section } from 'javascript-to-html'
import { island } from 'sitelo/islands'
import { getRecipes } from './lib/api.js'
import { layout } from './lib/layout.js'
import { recipeCard } from './lib/recipe-card.js'

export async function data() {
  const recipes = await getRecipes()
  const topRated = recipes.toSorted((a, b) => b.rating - a.rating).slice(0, 6)
  return { topRated }
}

export default ({ page, data }) =>
  layout({
    title: 'Home',
    description: 'Quick, reliable recipes for busy weeknights.',
    path: page.routePath,
    islands: true,
  },
    section({ class: 'hero' },
      img({
        src: '/images/hero.jpg',
        alt: 'A bowl of pasta with tomatoes and basil on a wooden table',
        // Above the fold: load it first, and at the width it is shown
        sizes: '(min-width: 64rem) 61.5rem, 100vw',
        loading: 'eager',
        fetchpriority: 'high',
      }),
      h1('Dinner, sorted.'),
      p({ class: 'lead' }, 'Fifty recipes you can actually cook on a Tuesday.'),
      a({ class: 'button', href: '/recipes' }, 'Browse all recipes'),
    ),
    section({ class: 'pick' },
      h2('What should I cook right now?'),
      island('whats-cooking', {}, p('Hungry? Try one of our ', a({ href: '/recipes/quick' }, 'quick recipes'), '.')),
    ),
    section(
      h2('Top rated'),
      section({ class: 'grid' }, data.topRated.map(recipeCard)),
    ),
  )
