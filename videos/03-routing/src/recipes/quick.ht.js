import { h1, p, section } from 'javascript-to-html'
import { getRecipes } from '../lib/api.js'
import { layout } from '../lib/layout.js'
import { recipeCard, totalTime } from '../lib/recipe-card.js'

export async function data() {
  const recipes = await getRecipes()
  return { recipes: recipes.filter((recipe) => totalTime(recipe) <= 30) }
}

export default ({ page, data }) =>
  layout({
    title: 'Quick recipes',
    description: 'Recipes that take 30 minutes or less.',
    path: page.routePath,
  },
    h1('Ready in 30 minutes'),
    p({ class: 'lead' }, `${data.recipes.length} recipes, prep and cooking included.`),
    section({ class: 'grid' }, data.recipes.map(recipeCard)),
  )
