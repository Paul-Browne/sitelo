import { fetchWithCache } from 'sitelo'

const API = 'https://dummyjson.com'

async function get(path) {
  const res = await fetchWithCache(`${API}${path}`, {}, { maxAge: 60 * 60 })
  if (!res.ok) throw new Error(`GET ${API}${path} failed with ${res.status}`)
  return res.json()
}

export async function getRecipes() {
  const { recipes } = await get('/recipes?limit=0')
  return recipes
}

export async function getRecipe(id) {
  return get(`/recipes/${id}`)
}
