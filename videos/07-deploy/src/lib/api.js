import { fetchWithCache } from 'sitelo'
import { slugify } from './slug.js'

const API = 'https://dummyjson.com'

async function get(path) {
  const res = await fetchWithCache(`${API}${path}`, {}, { maxAge: 60 * 60 })
  if (!res.ok) throw new Error(`GET ${API}${path} failed with ${res.status}`)
  return res.json()
}

export async function getRecipes() {
  const { recipes } = await get('/recipes?limit=0')
  return recipes.map((recipe) => ({ ...recipe, slug: slugify(recipe.name) }))
}
