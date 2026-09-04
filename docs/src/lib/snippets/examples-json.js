/**
 * Code samples for the "Local JSON" example.
 *
 * The JSON data files are copy-paste artefacts, so their keys and values are
 * never translated — only comments, doc lines, and the strings a visitor sees
 * on the rendered page.
 */
const T = {
  en: {
    siteComment: 'site-wide settings',
    productsComment: 'one file per product',
    categoriesComment: 'one object, keyed by slug',
    libComment: 'the only module that touches sitelo/data',
    indexComment: '/ — categories and every product',
    productComment: '/products/:slug — one page per JSON file',
    categoryComment: '/categories/:slug — one page per key',
    siteDoc: 'Site-wide settings: one JSON file, parsed as-is.',
    productsDoc: 'One entry per file, slug taken from the filename.',
    categoriesDoc: 'One file holding an object keyed by slug — the key becomes the slug.',
    inCategoryDoc: 'Products in one category, cheapest first.',
    categories: 'Categories',
    allProducts: 'All products',
    category: 'Category',
    released: 'Released',
    availability: 'Availability',
    inStock: 'In stock',
    outOfStock: 'Out of stock',
  },
  es: {
    siteComment: 'ajustes globales del sitio',
    productsComment: 'un archivo por producto',
    categoriesComment: 'un objeto, indexado por slug',
    libComment: 'el único módulo que toca sitelo/data',
    indexComment: '/ — categorías y todos los productos',
    productComment: '/products/:slug — una página por archivo JSON',
    categoryComment: '/categories/:slug — una página por clave',
    siteDoc: 'Ajustes globales: un archivo JSON, analizado tal cual.',
    productsDoc: 'Una entrada por archivo, con el slug tomado del nombre del archivo.',
    categoriesDoc: 'Un archivo con un objeto indexado por slug — la clave pasa a ser el slug.',
    inCategoryDoc: 'Productos de una categoría, del más barato al más caro.',
    categories: 'Categorías',
    allProducts: 'Todos los productos',
    category: 'Categoría',
    released: 'Lanzamiento',
    availability: 'Disponibilidad',
    inStock: 'En stock',
    outOfStock: 'Agotado',
  },
  fr: {
    siteComment: 'réglages globaux du site',
    productsComment: 'un fichier par produit',
    categoriesComment: 'un objet, indexé par slug',
    libComment: 'le seul module qui touche à sitelo/data',
    indexComment: '/ — catégories et tous les produits',
    productComment: '/products/:slug — une page par fichier JSON',
    categoryComment: '/categories/:slug — une page par clé',
    siteDoc: 'Réglages globaux : un fichier JSON, analysé tel quel.',
    productsDoc: 'Une entrée par fichier, slug tiré du nom de fichier.',
    categoriesDoc: 'Un fichier contenant un objet indexé par slug — la clé devient le slug.',
    inCategoryDoc: 'Les produits d’une catégorie, du moins cher au plus cher.',
    categories: 'Catégories',
    allProducts: 'Tous les produits',
    category: 'Catégorie',
    released: 'Sortie',
    availability: 'Disponibilité',
    inStock: 'En stock',
    outOfStock: 'Épuisé',
  },
  de: {
    siteComment: 'seitenweite Einstellungen',
    productsComment: 'eine Datei pro Produkt',
    categoriesComment: 'ein Objekt, nach Slug indiziert',
    libComment: 'das einzige Modul, das sitelo/data anfasst',
    indexComment: '/ — Kategorien und alle Produkte',
    productComment: '/products/:slug — eine Seite pro JSON-Datei',
    categoryComment: '/categories/:slug — eine Seite pro Schlüssel',
    siteDoc: 'Seitenweite Einstellungen: eine JSON-Datei, unverändert geparst.',
    productsDoc: 'Ein Eintrag pro Datei, Slug aus dem Dateinamen.',
    categoriesDoc: 'Eine Datei mit einem nach Slug indizierten Objekt — der Schlüssel wird zum Slug.',
    inCategoryDoc: 'Produkte einer Kategorie, günstigste zuerst.',
    categories: 'Kategorien',
    allProducts: 'Alle Produkte',
    category: 'Kategorie',
    released: 'Erschienen',
    availability: 'Verfügbarkeit',
    inStock: 'Auf Lager',
    outOfStock: 'Ausverkauft',
  },
  ru: {
    siteComment: 'общие настройки сайта',
    productsComment: 'по файлу на товар',
    categoriesComment: 'один объект, ключи — слаги',
    libComment: 'единственный модуль, который обращается к sitelo/data',
    indexComment: '/ — категории и все товары',
    productComment: '/products/:slug — по странице на JSON-файл',
    categoryComment: '/categories/:slug — по странице на ключ',
    siteDoc: 'Общие настройки: один JSON-файл, разобранный как есть.',
    productsDoc: 'По записи на файл, slug берётся из имени файла.',
    categoriesDoc: 'Один файл с объектом, ключи которого — слаги; ключ и становится слагом.',
    inCategoryDoc: 'Товары одной категории, сначала самые дешёвые.',
    categories: 'Категории',
    allProducts: 'Все товары',
    category: 'Категория',
    released: 'Выпущен',
    availability: 'Наличие',
    inStock: 'В наличии',
    outOfStock: 'Нет в наличии',
  },
  zh: {
    siteComment: '全站设置',
    productsComment: '每个产品一个文件',
    categoriesComment: '一个对象，以 slug 为键',
    libComment: '唯一接触 sitelo/data 的模块',
    indexComment: '/ —— 分类和全部产品',
    productComment: '/products/:slug —— 每个 JSON 文件一个页面',
    categoryComment: '/categories/:slug —— 每个键一个页面',
    siteDoc: '全站设置：一个 JSON 文件，原样解析。',
    productsDoc: '每个文件一条记录，slug 取自文件名。',
    categoriesDoc: '一个文件，内容是以 slug 为键的对象 —— 键即 slug。',
    inCategoryDoc: '某个分类下的产品，最便宜的排在前面。',
    categories: '分类',
    allProducts: '全部产品',
    category: '分类',
    released: '发布日期',
    availability: '库存',
    inStock: '有货',
    outOfStock: '缺货',
  },
  pt: {
    siteComment: 'definições globais do site',
    productsComment: 'um ficheiro por produto',
    categoriesComment: 'um objeto, indexado por slug',
    libComment: 'o único módulo que toca em sitelo/data',
    indexComment: '/ — categorias e todos os produtos',
    productComment: '/products/:slug — uma página por ficheiro JSON',
    categoryComment: '/categories/:slug — uma página por chave',
    siteDoc: 'Definições globais: um ficheiro JSON, analisado tal como está.',
    productsDoc: 'Uma entrada por ficheiro, slug tirado do nome do ficheiro.',
    categoriesDoc: 'Um ficheiro com um objeto indexado por slug — a chave passa a ser o slug.',
    inCategoryDoc: 'Produtos de uma categoria, do mais barato para o mais caro.',
    categories: 'Categorias',
    allProducts: 'Todos os produtos',
    category: 'Categoria',
    released: 'Lançamento',
    availability: 'Disponibilidade',
    inStock: 'Em stock',
    outOfStock: 'Esgotado',
  },
}

export function jsonSnippets(lang = 'en') {
  const t = T[lang] ?? T.en
  const htmlLang = T[lang] ? lang : 'en'

  return {
    structure: `my-site/
  sitelo.config.js
  data/
    site.json              # ${t.siteComment}
    categories.json        # ${t.categoriesComment}
    products/              # ${t.productsComment}
      aeron-chair.json
      jarvis-desk.json
      tolomeo-lamp.json
  src/
    lib/
      catalogue.js         # ${t.libComment}
    index.ht.js            # ${t.indexComment}
    products/
      [slug].ht.js         # ${t.productComment}
    categories/
      [slug].ht.js         # ${t.categoryComment}`,

    product: `{
  "name": "Aeron Chair",
  "category": "seating",
  "price": 1395,
  "released": "2022-04-01",
  "summary": "Mesh task chair with adjustable lumbar support.",
  "inStock": true
}`,

    categories: `{
  "seating": {
    "name": "Seating",
    "description": "Chairs and stools for long working days."
  },
  "desks": {
    "name": "Desks",
    "description": "Fixed-height and sit-stand work surfaces."
  }
}`,

    lib: `import { readJson, readJsonCollection } from 'sitelo/data'

/** ${t.siteDoc} */
export function getSite() {
  return readJson('data/site.json')
}

/** ${t.productsDoc} */
export function getProducts() {
  return readJsonCollection('data/products', { sort: 'name' })
}

/** ${t.categoriesDoc} */
export function getCategories() {
  return readJsonCollection('data/categories.json')
}

/** ${t.inCategoryDoc} */
export async function getProductsInCategory(slug) {
  const products = await readJsonCollection('data/products', { sort: 'price' })
  return products.filter((product) => product.category === slug)
}`,

    indexTemplate: `import { getCategories, getProducts, getSite } from './lib/catalogue.js'

export async function data() {
  return {
    site: await getSite(),
    categories: await getCategories(),
    products: await getProducts(),
  }
}

export default ({ data }) => \`
  <html lang="${htmlLang}">
    <head>
      <title>\${data.site.title}</title>
      <link rel="stylesheet" href="/css/styles.css">
    </head>
    <body>
      <h1>\${data.site.title}</h1>
      <h2>${t.categories}</h2>
      <ul>
        \${data.categories
          .map(
            (category) =>
              \`<li><a href="/categories/\${category.slug}">\${category.name}</a></li>\`,
          )
          .join('')}
      </ul>
      <h2>${t.allProducts}</h2>
      <ul>
        \${data.products
          .map(
            (product) =>
              \`<li><a href="/products/\${product.slug}">\${product.name}</a></li>\`,
          )
          .join('')}
      </ul>
    </body>
  </html>
\``,

    indexHt: `import { html, head, title, link, body, h1, h2, ul, li, a } from 'javascript-to-html'
import { getCategories, getProducts, getSite } from './lib/catalogue.js'

export async function data() {
  return {
    site: await getSite(),
    categories: await getCategories(),
    products: await getProducts(),
  }
}

export default ({ data }) =>
  html({ lang: '${htmlLang}' },
    head(
      title(data.site.title),
      link({ rel: 'stylesheet', href: '/css/styles.css' }),
    ),
    body(
      h1(data.site.title),
      h2('${t.categories}'),
      ul(
        ...data.categories.map((category) =>
          li(a({ href: \`/categories/\${category.slug}\` }, category.name)),
        ),
      ),
      h2('${t.allProducts}'),
      ul(
        ...data.products.map((product) =>
          li(a({ href: \`/products/\${product.slug}\` }, product.name)),
        ),
      ),
    ),
  )`,

    indexJsx: `import { getCategories, getProducts, getSite } from './lib/catalogue.js'

export async function data() {
  return {
    site: await getSite(),
    categories: await getCategories(),
    products: await getProducts(),
  }
}

export default function Home({ data }) {
  return (
    <html lang="${htmlLang}">
      <head>
        <title>{data.site.title}</title>
        <link rel="stylesheet" href="/css/styles.css" />
      </head>
      <body>
        <h1>{data.site.title}</h1>
        <h2>${t.categories}</h2>
        <ul>
          {data.categories.map((category) => (
            <li key={category.slug}>
              <a href={\`/categories/\${category.slug}\`}>{category.name}</a>
            </li>
          ))}
        </ul>
        <h2>${t.allProducts}</h2>
        <ul>
          {data.products.map((product) => (
            <li key={product.slug}>
              <a href={\`/products/\${product.slug}\`}>{product.name}</a>
            </li>
          ))}
        </ul>
      </body>
    </html>
  )
}`,

    slugTemplate: `import { getProduct, getProducts } from '../lib/catalogue.js'

export async function generateStaticParams() {
  const products = await getProducts()
  return products.map((product) => ({ slug: product.slug }))
}

export async function data({ params }) {
  const product = await getProduct(params.slug)
  if (!product) throw new Error(\`Unknown product: \${params.slug}\`)
  return { product }
}

export default ({ data }) => \`
  <html lang="${htmlLang}">
    <head>
      <title>\${data.product.name}</title>
      <link rel="stylesheet" href="/css/styles.css">
    </head>
    <body>
      <h1>\${data.product.name}</h1>
      <p>\${data.product.summary}</p>
      <dl>
        <dt>${t.category}</dt>
        <dd>\${data.product.category}</dd>
        <dt>${t.released}</dt>
        <dd>\${data.product.released}</dd>
        <dt>${t.availability}</dt>
        <dd>\${data.product.inStock ? '${t.inStock}' : '${t.outOfStock}'}</dd>
      </dl>
    </body>
  </html>
\``,

    slugHt: `import { html, head, title, link, body, h1, p, dl, dt, dd } from 'javascript-to-html'
import { getProduct, getProducts } from '../lib/catalogue.js'

export async function generateStaticParams() {
  const products = await getProducts()
  return products.map((product) => ({ slug: product.slug }))
}

export async function data({ params }) {
  const product = await getProduct(params.slug)
  if (!product) throw new Error(\`Unknown product: \${params.slug}\`)
  return { product }
}

export default ({ data }) =>
  html({ lang: '${htmlLang}' },
    head(
      title(data.product.name),
      link({ rel: 'stylesheet', href: '/css/styles.css' }),
    ),
    body(
      h1(data.product.name),
      p(data.product.summary),
      dl(
        dt('${t.category}'),
        dd(data.product.category),
        dt('${t.released}'),
        dd(data.product.released),
        dt('${t.availability}'),
        dd(data.product.inStock ? '${t.inStock}' : '${t.outOfStock}'),
      ),
    ),
  )`,

    slugJsx: `import { getProduct, getProducts } from '../lib/catalogue.js'

export async function generateStaticParams() {
  const products = await getProducts()
  return products.map((product) => ({ slug: product.slug }))
}

export async function data({ params }) {
  const product = await getProduct(params.slug)
  if (!product) throw new Error(\`Unknown product: \${params.slug}\`)
  return { product }
}

export default function Product({ data }) {
  return (
    <html lang="${htmlLang}">
      <head>
        <title>{data.product.name}</title>
        <link rel="stylesheet" href="/css/styles.css" />
      </head>
      <body>
        <h1>{data.product.name}</h1>
        <p>{data.product.summary}</p>
        <dl>
          <dt>${t.category}</dt>
          <dd>{data.product.category}</dd>
          <dt>${t.released}</dt>
          <dd>{data.product.released}</dd>
          <dt>${t.availability}</dt>
          <dd>{data.product.inStock ? '${t.inStock}' : '${t.outOfStock}'}</dd>
        </dl>
      </body>
    </html>
  )
}`,

    build: `npm install
npm run build`,
  }
}
