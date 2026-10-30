import { a, h1, li, nav, p, section, ul } from 'javascript-to-html'
import { getCuisines } from '../lib/cuisines.js'
import { escapeHtml } from '../lib/escape.js'
import { layout } from '../lib/layout.js'
import { recipeCard } from '../lib/recipe-card.js'

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

const breadcrumbs = (...crumbs) =>
  nav({ class: 'breadcrumbs', 'aria-label': 'Breadcrumbs' },
    crumbs.map(([label, href], i) => [
      i > 0 ? ' / ' : '',
      href ? a({ href }, escapeHtml(label)) : escapeHtml(label),
    ]),
  )

export default ({ page, data: { cuisine, meal } }) => {
  const recipes = meal ? meal.recipes : cuisine.recipes
  const name = meal ? `${cuisine.name} ${meal.name.toLowerCase()}` : cuisine.name

  return layout({ title: escapeHtml(name), description: `${name} recipes.`, path: page.routePath },
    meal
      ? breadcrumbs(['Cuisines', '/cuisines'], [cuisine.name, `/cuisines/${cuisine.slug}`], [meal.name])
      : breadcrumbs(['Cuisines', '/cuisines'], [cuisine.name]),
    h1(escapeHtml(name)),
    meal
      ? ''
      : ul({ class: 'pills' },
          cuisine.meals.map((meal) =>
            li(a({ href: `/cuisines/${cuisine.slug}/${meal.slug}` }, escapeHtml(meal.name))),
          ),
        ),
    p({ class: 'lead' }, `${recipes.length} ${recipes.length === 1 ? 'recipe' : 'recipes'}`),
    section({ class: 'grid' }, recipes.map(recipeCard)),
  )
}
