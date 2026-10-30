import { recipeCard } from '../lib/recipe-card.js'
import { slugify } from '../lib/slug.js'

const mealFor = (hour) =>
  hour < 11 ? 'Breakfast' : hour < 15 ? 'Lunch' : hour < 17 ? 'Snack' : 'Dinner'

// Runs on the server for every request, so every visitor can get a
// different recipe even though the page around it was built once.
export default async function whatsCooking() {
  const now = new Date()
  const meal = mealFor(now.getHours())

  // A plain fetch, not lib/api.js: islands run in production too, so they
  // stay away from build-time helpers (and the build tooling behind them).
  const res = await fetch(`https://dummyjson.com/recipes/meal-type/${meal.toLowerCase()}`)
  if (!res.ok) throw new Error(`Recipes failed with ${res.status}`)
  const { recipes } = await res.json()

  const pick = recipes[Math.floor(Math.random() * recipes.length)]
  const time = now.toTimeString().slice(0, 5)

  return `
    <p class="meta">It's ${time} on the server. How about ${meal.toLowerCase()}?</p>
    ${recipeCard({ ...pick, slug: slugify(pick.name) })}
  `
}
