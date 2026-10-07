import { script } from 'javascript-to-html'
import { createRequire } from 'node:module'

import { LOCALES, LOCALE_TAGS } from './i18n.js'

const require = createRequire(import.meta.url)
const pkg = require('../../../package.json')

export const SITE_URL = 'https://sitelo.dev'
export const SITE_NAME = 'sitelo'

const REPOSITORY = 'https://github.com/paul-browne/sitelo'

/**
 * The link preview every page shares: the wordmark on the site's dark
 * plaque, at the 1200×630 that Open Graph and X both crop to without losing
 * an edge. Regenerate it with `npm run docs:og`.
 */
export const OG_IMAGE = {
  url: `${SITE_URL}/og.png`,
  width: 1200,
  height: 630,
  type: 'image/png',
  alt: 'sitelo',
}

/*
 * Stable ids for the nodes every page shares, so a crawler reading two pages
 * merges them into one site, one author and one piece of software rather
 * than collecting a copy from each.
 */
const ID = {
  website: `${SITE_URL}/#website`,
  author: `${SITE_URL}/#author`,
  software: `${SITE_URL}/#software`,
}

const ref = (id) => ({ '@id': id })

const SITE_NODES = [
  {
    '@type': 'WebSite',
    '@id': ID.website,
    url: `${SITE_URL}/`,
    name: SITE_NAME,
    inLanguage: LOCALES.map((locale) => LOCALE_TAGS[locale]),
    publisher: ref(ID.author),
    about: ref(ID.software),
  },
  {
    '@type': 'Person',
    '@id': ID.author,
    name: pkg.author,
    url: 'https://github.com/paul-browne',
  },
  /*
   * `SoftwareSourceCode` rather than `SoftwareApplication`: sitelo is a
   * package you install into a project, not an app you run, and Google
   * reads `SoftwareApplication` as a rich-result candidate that then fails
   * for want of ratings and a price. The description stays the package's
   * own English one on every locale — it is the same fact in each.
   */
  {
    '@type': 'SoftwareSourceCode',
    '@id': ID.software,
    name: SITE_NAME,
    description: pkg.description,
    url: `${SITE_URL}/`,
    codeRepository: REPOSITORY,
    programmingLanguage: ['JavaScript', 'TypeScript'],
    runtimePlatform: 'Node.js',
    license: 'https://opensource.org/licenses/MIT',
    version: pkg.version,
    keywords: pkg.keywords.join(', '),
    author: ref(ID.author),
    sameAs: [REPOSITORY, 'https://www.npmjs.com/package/sitelo'],
  },
]

/** schema.org type for each kind of page the layouts render. */
const PAGE_TYPES = {
  home: 'WebPage',
  article: 'TechArticle',
  about: 'AboutPage',
}

/**
 * The page's JSON-LD: the shared site nodes, the page itself, and its trail
 * back to the home page.
 *
 * Every field here repeats something the page already says — its title, its
 * description, its place in the sidebar — because structured data that
 * disagrees with the visible page is the kind search engines discard.
 *
 * @param {{
 *   kind: 'home' | 'article' | 'about',
 *   url: string,
 *   lang: string,
 *   title: string,
 *   heading?: string,
 *   description: string,
 *   dates?: { published: string, modified: string },
 *   crumbs: { name: string, url: string }[],
 * }} page
 */
export function structuredData({ kind, url, lang, title, heading, description, dates, crumbs }) {
  const pageId = `${url}#webpage`
  const breadcrumbId = `${url}#breadcrumb`
  const isArticle = kind === 'article'

  const pageNode = {
    '@type': PAGE_TYPES[kind],
    '@id': pageId,
    url,
    name: title,
    ...(isArticle ? { headline: heading ?? title } : {}),
    description,
    inLanguage: LOCALE_TAGS[lang],
    isPartOf: ref(ID.website),
    about: ref(ID.software),
    ...(kind === 'home' ? { mainEntity: ref(ID.software) } : {}),
    ...(isArticle ? { author: ref(ID.author), publisher: ref(ID.author) } : {}),
    image: OG_IMAGE.url,
    ...(dates ? { datePublished: dates.published, dateModified: dates.modified } : {}),
    ...(crumbs.length > 1 ? { breadcrumb: ref(breadcrumbId) } : {}),
  }

  const graph = [...SITE_NODES, pageNode]

  if (crumbs.length > 1) {
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': breadcrumbId,
      itemListElement: crumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: crumb.url,
      })),
    })
  }

  /*
   * `<` escaped so no string in the graph — a description quoting
   * `<details>`, say — can close the script element early.
   */
  const json = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(
    /</g,
    '\\u003c',
  )

  return script({ type: 'application/ld+json' }, json)
}
