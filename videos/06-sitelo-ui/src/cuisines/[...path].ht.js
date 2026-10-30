import * as ui from 'sitelo/ui'
import { getCuisines } from '../lib/cuisines.js'
import { escapeHtml } from '../lib/escape.js'
import { layout } from '../lib/layout.js'
import { recipeGrid } from '../lib/recipe-card.js'

// One file, any depth below /cuisines:
//   /cuisines/italian         params.path = ['italian']
//   /cuisines/italian/dinner  params.path = ['italian', 'dinner']
export async function generateStaticParams() {
  const cuisines = await getCuisines()
  return [
    ...cuisines.map((cuisine) => ({ path: [cuisine.slug] })),
    ...cuisines.flatMap((cuisine) =>
      cuisine.meals.map((meal) => ({ path: [cuisine.slug, meal.slug] })),
    ),
  ]
}

export async function data({ params }) {
  const [cuisineSlug, mealSlug, ...rest] = params.path
  const cuisines = await getCuisines()

  const cuisine = cuisines.find((cuisine) => cuisine.slug === cuisineSlug)
  if (!cuisine || rest.length > 0) throw new Error(`No such page: /cuisines/${params.path.join('/')}`)
  if (!mealSlug) return { cuisine }

  const meal = cuisine.meals.find((meal) => meal.slug === mealSlug)
  if (!meal) throw new Error(`No ${mealSlug} recipes in ${cuisine.name}`)
  return { cuisine, meal }
}

export default ({ page, data: { cuisine, meal } }) => {
  const recipes = meal ? meal.recipes : cuisine.recipes
  const name = meal ? `${cuisine.name} ${meal.name.toLowerCase()}` : cuisine.name

  return layout({ title: escapeHtml(name), description: `${name} recipes.`, path: page.routePath },
    ui.stack({ gap: 'lg', class: 'section' },
      ui.breadcrumbs({
        items: meal
          ? [{ label: 'Cuisines', href: '/cuisines' }, { label: escapeHtml(cuisine.name), href: `/cuisines/${cuisine.slug}` }, escapeHtml(meal.name)]
          : [{ label: 'Cuisines', href: '/cuisines' }, escapeHtml(cuisine.name)],
      }),
      ui.heading({ level: 1 }, escapeHtml(name)),
      meal
        ? ''
        : ui.stack({ direction: 'row', gap: 'xs', wrap: true },
            cuisine.meals.map((meal) =>
              ui.chip({ href: `/cuisines/${cuisine.slug}/${meal.slug}`, variant: 'outline' }, escapeHtml(meal.name)),
            ),
          ),
      ui.heading({ level: 2, size: 'h5' }, `${recipes.length} ${recipes.length === 1 ? 'recipe' : 'recipes'}`),
      recipeGrid(recipes),
    ),
  )
}
