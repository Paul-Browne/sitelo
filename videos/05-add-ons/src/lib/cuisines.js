import { getRecipes } from './api.js'
import { slugify } from './slug.js'

/** Recipes grouped by cuisine, then by meal type within each cuisine. */
export async function getCuisines() {
  const cuisines = new Map()

  for (const recipe of await getRecipes()) {
    const slug = slugify(recipe.cuisine)
    if (!cuisines.has(slug)) {
      cuisines.set(slug, { slug, name: recipe.cuisine, recipes: [], meals: new Map() })
    }
    const cuisine = cuisines.get(slug)
    cuisine.recipes.push(recipe)

    for (const name of recipe.mealType) {
      const mealSlug = slugify(name)
      if (!cuisine.meals.has(mealSlug)) {
        cuisine.meals.set(mealSlug, { slug: mealSlug, name, recipes: [] })
      }
      cuisine.meals.get(mealSlug).recipes.push(recipe)
    }
  }

  return [...cuisines.values()]
    .map((cuisine) => ({ ...cuisine, meals: [...cuisine.meals.values()] }))
    .sort((a, b) => a.name.localeCompare(b.name))
}
