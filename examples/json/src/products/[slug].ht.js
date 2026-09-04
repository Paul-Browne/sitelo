import {
  formatPrice,
  getCategory,
  getProduct,
  getProducts,
  getSite,
} from '../lib/catalogue.js'

export async function generateStaticParams() {
  const products = await getProducts()
  return products.map((product) => ({ slug: product.slug }))
}

export async function data({ params }) {
  const product = await getProduct(params.slug)
  if (!product) throw new Error(`Unknown product: ${params.slug}`)

  return {
    site: await getSite(),
    product,
    category: await getCategory(product.category),
  }
}

export default ({ data }) => {
  const { product, category, site } = data

  return `
    <html lang="en">
      <head>
        <title>${product.name} — ${site.title}</title>
        <meta name="description" content="${product.summary}">
        <link rel="stylesheet" href="/css/styles.css">
      </head>
      <body>
        <p><a href="/">← ${site.title}</a></p>
        <article>
          <h1>${product.name}</h1>
          <p class="price">${formatPrice(product.price)}</p>
          <p class="lede">${product.summary}</p>
          <dl>
            <dt>Category</dt>
            <dd><a href="/categories/${category.slug}">${category.name}</a></dd>
            <dt>Released</dt>
            <dd><time datetime="${product.released}">${product.released}</time></dd>
            <dt>Availability</dt>
            <dd>${product.inStock ? 'In stock' : 'Out of stock'}</dd>
          </dl>
        </article>
      </body>
    </html>
  `
}
