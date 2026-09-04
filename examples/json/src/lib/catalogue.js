import { readJson, readJsonCollection } from 'sitelo/data'

/*
 * Every read goes through `sitelo/data`, which memoizes per file — these
 * helpers are called once per page and still parse each JSON file once for
 * the whole build.
 */

/** Site-wide settings: one JSON file, parsed as-is. */
export function getSite() {
  return readJson('data/site.json')
}

/** One entry per file in `data/products/`, slug taken from the filename. */
export function getProducts() {
  return readJsonCollection('data/products', { sort: 'name' })
}

export async function getProduct(slug) {
  const products = await getProducts()
  return products.find((product) => product.slug === slug) ?? null
}

/** One file holding an object keyed by slug — the key becomes the slug. */
export function getCategories() {
  return readJsonCollection('data/categories.json')
}

export async function getCategory(slug) {
  const categories = await getCategories()
  return categories.find((category) => category.slug === slug) ?? null
}

/** Products in one category, cheapest first. */
export async function getProductsInCategory(slug) {
  const products = await readJsonCollection('data/products', { sort: 'price' })
  return products.filter((product) => product.category === slug)
}

/** `1395` → `$1,395`. */
export function formatPrice(price) {
  return `$${price.toLocaleString('en-US')}`
}
