import {
  formatPrice,
  getCategories,
  getProducts,
  getSite,
} from './lib/catalogue.js'

export async function data() {
  return {
    site: await getSite(),
    categories: await getCategories(),
    products: await getProducts(),
  }
}

export default ({ data }) => `
  <html lang="en">
    <head>
      <title>${data.site.title}</title>
      <meta name="description" content="${data.site.description}">
      <link rel="stylesheet" href="/css/styles.css">
    </head>
    <body>
      <h1>${data.site.title}</h1>
      <p class="lede">${data.site.description}</p>

      <h2>Categories</h2>
      <ul class="categories">
        ${data.categories
          .map(
            (category) => `
          <li>
            <a href="/categories/${category.slug}">${category.name}</a>
            <p>${category.description}</p>
          </li>`,
          )
          .join('')}
      </ul>

      <h2>All products</h2>
      <ul class="products">
        ${data.products
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

      <footer>
        <p><a href="mailto:${data.site.email}">${data.site.email}</a></p>
      </footer>
    </body>
  </html>
`
