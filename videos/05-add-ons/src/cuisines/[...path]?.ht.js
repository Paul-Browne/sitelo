import { a, h1, h2, li, nav, section, ul } from 'javascript-to-html'
import { getCuisines } from '../lib/cuisines.js'
import { escapeHtml } from '../lib/escape.js'
import { layout } from '../lib/layout.js'
import { recipeCard } from '../lib/recipe-card.js'

// One file, every depth of /cuisines:
//   /cuisines                 params.path = [] (or missing)
//   /cuisines/italian         params.path = ['italian']
//   /cuisines/italian/dinner  params.path = ['italian', 'dinner']
export async function generateStaticParams() {
  const cuisines = await getCuisines()
  return [
    { path: [] },
    ...cuisines.map((cuisine) => ({ path: [cuisine.slug] })),
    ...cuisines.flatMap((cuisine) =>
      cuisine.meals.map((meal) => ({ path: [cuisine.slug, meal.slug] })),
    ),
  ]
}

export async function data({ params }) {
  const [cuisineSlug, mealSlug, ...rest] = params.path ?? []
  const cuisines = await getCuisines()
  if (!cuisineSlug) return { cuisines }

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

// /cuisines itself: every cuisine, with a count
const cuisineIndex = (page, cuisines) =>
  layout({ title: 'Cuisines', description: 'Browse recipes by cuisine.', path: page.routePath },
    h1('Cuisines'),
    ul({ class: 'pills' },
      cuisines.map((cuisine) =>
        li(a({ href: `/cuisines/${cuisine.slug}` }, `${escapeHtml(cuisine.name)} (${cuisine.recipes.length})`)),
      ),
    ),
  )

export default ({ page, data: { cuisines, cuisine, meal } }) => {
  if (cuisines) return cuisineIndex(page, cuisines)

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
    h2(`${recipes.length} ${recipes.length === 1 ? 'recipe' : 'recipes'}`),
    section({ class: 'grid' }, recipes.map(recipeCard)),
  )
}
