import fs from 'node:fs'
import path from 'node:path'

import { pageInfo } from './markdown.js'
import { pageUrl } from './site-paths.js'

const FILE = 'sitemap.xml'

/** The protocol's limit on URLs in one sitemap file. */
const MAX_URLS = 50_000

/**
 * The W3C Datetime profile the protocol takes for `<lastmod>`: a year,
 * down to a time with seconds and a zone. Anything else is left out
 * rather than guessed at.
 */
const W3C_DATETIME =
  /^\d{4}(?:-\d{2}(?:-\d{2}(?:T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:\d{2}))?)?)?$/

const JSON_LD = /<script\b[^>]*\btype\s*=\s*["']?application\/ld\+json["']?[^>]*>([\s\S]*?)<\/script\s*>/gi

/** Schema.org types that describe a page, rather than the site or a person. */
const PAGE_TYPE = /(?:Page|Article|Posting)$/

/**
 * The page's own dates from its JSON-LD: the node whose `url` or `@id` is
 * the page, or failing that the one node typed as a page or an article. A
 * graph usually describes the site, its software and its author too, and
 * their dates are not the page's.
 *
 * @param {string} html
 * @param {string[]} urls the addresses the page goes by
 * @returns {{ modified?: string, published?: string }}
 */
function jsonLdDates(html, urls) {
  /** @type {Record<string, unknown>[]} */
  const nodes = []
  const collect = (value) => {
    if (Array.isArray(value)) value.forEach(collect)
    else if (value && typeof value === 'object') {
      nodes.push(/** @type {Record<string, unknown>} */ (value))
      collect(/** @type {Record<string, unknown>} */ (value)['@graph'])
    }
  }

  for (const [, json] of html.matchAll(JSON_LD)) {
    try {
      collect(JSON.parse(json))
    } catch {
      // Not JSON; a crawler would skip it too.
    }
  }

  const dated = nodes.filter((node) => node.dateModified || node.datePublished)
  const isThisPage = (node) =>
    [node.url, node['@id'], node.mainEntityOfPage].some(
      (value) => typeof value === 'string' && urls.some((url) => value === url || value.startsWith(`${url}#`)),
    )
  const types = (node) => [node['@type']].flat().filter((type) => typeof type === 'string')
  const pageTyped = dated.filter((node) => types(node).some((type) => PAGE_TYPE.test(type)))

  const node = dated.find(isThisPage) ?? (pageTyped.length === 1 ? pageTyped[0] : undefined)
  if (!node) return {}

  const text = (value) => (typeof value === 'string' ? value.trim() : undefined)
  return { modified: text(node.dateModified), published: text(node.datePublished) }
}

/** @param {string} value */
const escapeXml = (value) =>
  value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[char])

/**
 * @typedef {{ loc: string, lastmod?: string }} SitemapEntry
 */

/**
 * The sitemap's entries for a build's pages, sorted, so a rebuild with
 * nothing changed writes the same file.
 *
 * - **The URL a page is served at.** `about/index.html` is `/about/`, not
 *   `/about`, which a static host answers with a redirect, and a sitemap
 *   of redirects is one a search console complains about. A page's own
 *   `<link rel="canonical">` wins, when it is on the site.
 * - **Indexable pages only.** A 404 page, and one that says
 *   `<meta name="robots" content="noindex">`, are left out: listing a page
 *   that asks not to be indexed is a contradiction crawlers report.
 * - **`<lastmod>` from the page.** Its `article:modified_time`, or the
 *   `dateModified` of its JSON-LD, or failing both the published date from
 *   either, when it is a valid W3C Datetime. The page is the one place
 *   that knows; a build's clock does not, and a wrong date is worse than
 *   none, since Google stops believing a sitemap's dates once it has
 *   caught one out.
 *
 * @param {Array<{ file: string, html: string }>} pages built HTML, by path
 *   in the output directory
 * @param {string} siteUrl the `site` option, without a trailing slash
 * @returns {SitemapEntry[]}
 */
export function sitemapEntries(pages, siteUrl) {
  /** @type {Map<string, SitemapEntry & { self: boolean }>} */
  const entries = new Map()

  for (const { file, html } of pages) {
    if (path.posix.basename(file) === '404.html') continue

    const info = pageInfo(html)
    if (info.noindex) continue

    const served = `${siteUrl}${pageUrl(file)}`
    const loc = onSite(info.canonical, siteUrl) ? /** @type {string} */ (info.canonical) : served

    // Most specific first, and a change before a first publication.
    const ld = jsonLdDates(html, [...new Set([loc, served])])
    const date = [info.modified, ld.modified, info.published, ld.published].find(
      (value) => value && W3C_DATETIME.test(value),
    )

    // Two pages naming one canonical are one entry; the page that is
    // itself at that URL says when it changed.
    const existing = entries.get(loc)
    if (existing && (existing.self || loc !== served)) continue
    entries.set(loc, { loc, ...(date ? { lastmod: date } : {}), self: loc === served })
  }

  return [...entries.values()]
    .map(({ loc, lastmod }) => (lastmod ? { loc, lastmod } : { loc }))
    .sort((a, b) => a.loc.localeCompare(b.loc))
}

/**
 * Whether a canonical URL may stand in a sitemap at `siteUrl`: the
 * protocol allows only URLs under the sitemap's own location.
 *
 * @param {string | undefined} canonical
 * @param {string} siteUrl
 */
function onSite(canonical, siteUrl) {
  return Boolean(canonical) && (canonical === siteUrl || String(canonical).startsWith(`${siteUrl}/`))
}

/** @param {SitemapEntry[]} entries */
function urlset(entries) {
  const urls = entries.map(({ loc, lastmod }) => {
    const date = lastmod ? `<lastmod>${escapeXml(lastmod)}</lastmod>` : ''
    return `  <url><loc>${escapeXml(loc)}</loc>${date}</url>`
  })

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n')
}

/**
 * The files for a set of entries: `sitemap.xml` alone, or past `max` URLs
 * a sitemap index at `sitemap.xml` over `sitemap-1.xml`, `sitemap-2.xml`
 * and on, so `robots.txt` and a search console still point at one URL.
 *
 * @param {SitemapEntry[]} entries
 * @param {string} siteUrl
 * @param {number} [max]
 * @returns {Array<{ fileName: string, source: string }>}
 */
export function sitemapFiles(entries, siteUrl, max = MAX_URLS) {
  if (entries.length <= max) return [{ fileName: FILE, source: urlset(entries) }]

  /** @type {Array<{ fileName: string, source: string }>} */
  const parts = []
  for (let start = 0; start < entries.length; start += max) {
    parts.push({ fileName: `sitemap-${parts.length + 1}.xml`, source: urlset(entries.slice(start, start + max)) })
  }

  const index = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...parts.map(({ fileName }) => `  <sitemap><loc>${escapeXml(`${siteUrl}/${fileName}`)}</loc></sitemap>`),
    '</sitemapindex>',
    '',
  ].join('\n')

  return [{ fileName: FILE, source: index }, ...parts]
}

/**
 * Rewrite the `sitemap.xml` html-pages emits, from the pages as built.
 *
 * html-pages lists every route as written, so it names `/about` for a page
 * served at `/about/`, and a page that asks not to be indexed, and gives
 * no dates. This reads the built HTML instead; see {@link sitemapEntries}.
 * A `public/sitemap.xml` of the site's own is shipped instead, untouched.
 *
 * @param {{ site?: string }} options
 * @returns {import('vite').Plugin}
 */
export function sitemap({ site }) {
  const siteUrl = (site ?? '').replace(/\/+$/, '')
  /** Vite's `public/`, absolute, or `''` when a build copies none of it. */
  let publicDir = ''

  return {
    name: 'sitelo:sitemap',
    apply: 'build',

    configResolved(config) {
      publicDir = config.build.copyPublicDir === false ? '' : config.publicDir
    },

    generateBundle: {
      // After html-pages has emitted the pages and its own sitemap.
      order: 'post',
      handler(_options, bundle) {
        if (!siteUrl) return

        // Vite copies the site's own before the bundle is written, so the
        // generated one would land on top of it.
        if (publicDir && fs.existsSync(path.join(publicDir, FILE))) {
          delete bundle[FILE]
          return
        }

        const pages = []
        for (const [file, output] of Object.entries(bundle)) {
          if (output.type !== 'asset' || !file.endsWith('.html')) continue
          const { source } = output
          pages.push({ file, html: typeof source === 'string' ? source : Buffer.from(source).toString('utf8') })
        }

        const entries = sitemapEntries(pages, siteUrl)
        if (entries.length === 0) {
          delete bundle[FILE]
          return
        }

        for (const { fileName, source } of sitemapFiles(entries, siteUrl)) {
          const existing = bundle[fileName]
          if (existing?.type === 'asset') existing.source = source
          else this.emitFile({ type: 'asset', fileName, source })
        }
      },
    },
  }
}
