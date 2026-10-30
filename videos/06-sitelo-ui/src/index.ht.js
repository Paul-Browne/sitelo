import { img } from 'javascript-to-html'
import { island } from 'sitelo/islands'
import * as ui from 'sitelo/ui'
import { getRecipes } from './lib/api.js'
import { layout } from './lib/layout.js'
import { recipeGrid } from './lib/recipe-card.js'

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
    ui.hero({
      eyebrow: 'Weeknight Kitchen',
      title: 'Dinner, sorted.',
      description: 'Fifty recipes you can actually cook on a Tuesday.',
      align: 'start',
      media: img({
        src: '/images/hero.jpg',
        alt: 'A bowl of pasta with tomatoes and basil on a wooden table',
        // Above the fold: load it first, and at the width it is shown
        sizes: '(min-width: 64rem) 34rem, 100vw',
        loading: 'eager',
        fetchpriority: 'high',
      }),
    },
      ui.button({ href: '/recipes', size: 'lg' }, 'Browse all recipes'),
      ui.button({ href: '/recipes/quick', size: 'lg', variant: 'outline' }, 'Ready in 30 minutes'),
    ),
    ui.stack({ gap: 'md', as: 'section', class: 'section' },
      ui.heading({ level: 2 }, 'What should I cook right now?'),
      island('whats-cooking', {}, ui.skeleton({ variant: 'rect', height: '18rem', width: '14rem' })),
    ),
    ui.stack({ gap: 'md', as: 'section', class: 'section' },
      ui.heading({ level: 2 }, 'Top rated'),
      recipeGrid(data.topRated),
    ),
  )
