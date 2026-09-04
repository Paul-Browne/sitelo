import {
  formatPrice,
  getCategories,
  getCategory,
  getProductsInCategory,
  getSite,
} from '../lib/catalogue.js'

export async function generateStaticParams() {
  const categories = await getCategories()
  return categories.map((category) => ({ slug: category.slug }))
}

export async function data({ params }) {
  const category = await getCategory(params.slug)
  if (!category) throw new Error(`Unknown category: ${params.slug}`)

  return {
    site: await getSite(),
    category,
    products: await getProductsInCategory(params.slug),
  }
}

export default ({ data }) => {
  const { category, products, site } = data

  return `
    <html lang="en">
      <head>
        <title>${category.name} — ${site.title}</title>
        <meta name="description" content="${category.description}">
        <link rel="stylesheet" href="/css/styles.css">
      </head>
      <body>
        <p><a href="/">← ${site.title}</a></p>
        <h1>${category.name}</h1>
        <p class="lede">${category.description}</p>
        <ul class="products">
          ${products
            .map(
              (product) => `
            <li>
              <a href="/products/${product.slug}">${product.name}</a>
              <span class="price">${formatPrice(product.price)}</span>
              <p>${product.summary}</p>
            </li>`,
            )
            .join('')}
        </ul>
      </body>
    </html>
  `
}
