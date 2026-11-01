import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'

import { docNav, exampleNav, uiExtrasNav, uiNav } from '../src/lib/nav.js'
import { SITE_URL } from '../src/lib/seo.js'
import { pageToMarkdown } from '../../src/markdown.js'

const require = createRequire(import.meta.url)
const pkg = require('../../package.json')

/**
 * The files the docs write for answer engines rather than readers: a
 * Markdown copy of each English page, and the two `llms` files that point
 * at them.
 *
 * All of it is read back out of the rendered pages, so the page head stays
 * the one place a page says what it is. A page with
 * `<link rel="alternate" type="text/markdown">` gets a Markdown copy at
 * that address, and one with `<meta name="robots" content="noindex">` gets
 * none. `pageShell()` in `src/lib/layout.js` decides both.
 *
 * The sitemap is sitelo's own (`src/sitemap.js`), which reads the same
 * heads: canonical URLs, noindex pages left out, and `<lastmod>` from the
 * `article:modified_time` the layout writes from `src/lib/last-modified.js`.
 *
 * sitelo's `llms` option writes the same three kinds of file for any site,
 * with the same converter (`src/markdown.js`). The docs keep this plugin
 * for what that option does not do: list pages in sidebar order under the
 * site's own sections, and copy only the pages that advertise a Markdown
 * twin.
 *
 * @returns {import('vite').Plugin}
 */
export function machineReadable() {
  /** @type {string} */
  let publicDir

  return {
    name: 'sitelo-docs:machine-readable',
    apply: 'build',
    enforce: 'post',

    configResolved(config) {
      publicDir = config.publicDir
    },

    generateBundle: {
      order: 'post',
      handler(_, bundle) {
        const pages = readPages(bundle)

        const twins = markdownTwins(pages)
        for (const twin of twins) {
          this.emitFile({ type: 'asset', fileName: twin.href.slice(1), source: twin.markdown })
        }

        this.emitFile({ type: 'asset', fileName: 'llms-full.txt', source: llmsFull(twins) })

        /*
         * The hand-written part of llms.txt stays in `public/`, where the dev
         * server serves it as is. The build writes this fuller copy over the
         * one Vite copies from there.
         */
        const intro = readFileSync(path.join(publicDir, 'llms.txt'), 'utf8')
        this.emitFile({ type: 'asset', fileName: 'llms.txt', source: llmsIndex(intro, twins) })
      },
    },
  }
}

/**
 * @typedef {{
 *   url: string,
 *   route: string,
 *   html: string,
 *   noindex: boolean,
 *   markdownHref?: string,
 *   description?: string,
 * }} Page
 */

const decodeAttribute = (value) =>
  value
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')

/**
 * Every rendered page with a canonical address, and what its head says
 * about it. The patterns match the layout's own attribute order; this reads
 * markup the site wrote, not markup in general.
 *
 * @param {import('vite').Rolldown.OutputBundle} bundle
 * @returns {Page[]}
 */
function readPages(bundle) {
  /** @type {Page[]} */
  const pages = []

  for (const [fileName, output] of Object.entries(bundle)) {
    if (output.type !== 'asset' || !fileName.endsWith('.html')) continue

    const html = String(
      typeof output.source === 'string' ? output.source : Buffer.from(output.source),
    )
    const head = html.slice(0, html.indexOf('</head>'))
    const canonical = /<link rel="canonical" href="([^"]+)"/.exec(head)?.[1]
    if (!canonical) continue

    const description = /<meta name="description" content="([^"]*)"/.exec(head)?.[1]

    pages.push({
      url: canonical,
      route: new URL(canonical).pathname,
      html,
      noindex: /<meta name="robots" content="[^"]*noindex/.test(head),
      markdownHref: /<link rel="alternate" type="text\/markdown" href="([^"]+)"/.exec(head)?.[1],
      description: description && decodeAttribute(description),
    })
  }

  return pages
}

/**
 * @typedef {{ href: string, url: string, title: string, description?: string, markdown: string }} Twin
 */

/**
 * The Markdown copies, in the order the sidebars list them — guides, then
 * components, then examples — so `llms-full.txt` reads front to back the way
 * the site does. A page no sidebar lists comes last.
 *
 * Each opens with its heading and then its description, which is the page's
 * one-sentence answer to "what is this?" and the line most worth quoting.
 *
 * @param {Page[]} pages
 * @returns {Twin[]}
 */
function markdownTwins(pages) {
  const order = [...docNav(), ...uiNav(), ...exampleNav(), ...uiExtrasNav()]
    .map((item) => item.href)
    .filter(Boolean)
  const rank = (route) => {
    const index = order.indexOf(route)
    return index === -1 ? order.length : index
  }

  return pages
    .filter((page) => page.markdownHref && !page.noindex)
    .sort((a, b) => rank(a.route) - rank(b.route) || a.route.localeCompare(b.route))
    .flatMap((page) => {
      const body = pageToMarkdown(page.html, { pageUrl: page.url, siteUrl: SITE_URL })
      if (!body) return []

      const [first, ...rest] = body.split('\n')
      const title = first.startsWith('# ') ? first.slice(2) : page.route
      const lead = page.description ? `\n\n> ${page.description}` : ''
      const markdown = first.startsWith('# ')
        ? `${first}${lead}\n${rest.join('\n')}`
        : `# ${title}${lead}\n\n${body}`

      return [{
        href: /** @type {string} */ (page.markdownHref),
        url: page.url,
        title,
        description: page.description,
        markdown,
      }]
    })
}

/** Which `llms.txt` section a page is listed under. */
function sectionOf(route) {
  if (route === '/docs' || route.startsWith('/docs/')) return 'Docs'
  if (route === '/ui' || route.startsWith('/ui/')) return 'Components'
  if (route === '/examples' || route.startsWith('/examples/')) return 'Examples'
  return 'Optional'
}

/**
 * The hand-written llms.txt with a link to every page's Markdown copy after
 * it, one section per part of the site.
 *
 * "Optional" is the llms.txt convention for what a reader short of context
 * can skip, which is the right place for the extras, the about page and the
 * whole-site file.
 *
 * @param {string} intro
 * @param {Twin[]} twins
 */
function llmsIndex(intro, twins) {
  /** @type {Map<string, string[]>} */
  const sections = new Map([['Docs', []], ['Components', []], ['Examples', []], ['Optional', []]])

  for (const twin of twins) {
    const route = new URL(twin.url).pathname
    const note = twin.description ? `: ${twin.description}` : ''
    sections.get(sectionOf(route))?.push(`- [${twin.title}](${SITE_URL}${twin.href})${note}`)
  }

  sections
    .get('Optional')
    ?.push(
      `- [Everything in one file](${SITE_URL}/llms-full.txt): every page listed here, as Markdown, in this order`,
    )

  const generated = [...sections]
    .filter(([, lines]) => lines.length > 0)
    .map(([name, lines]) => `## ${name}\n\n${lines.join('\n')}`)
    .join('\n\n')

  return `${intro.trimEnd()}\n\n${generated}\n`
}

/**
 * Every page's Markdown copy in one file, for a reader that would rather
 * take the whole site in one request than follow the index.
 *
 * @param {Twin[]} twins
 */
function llmsFull(twins) {
  const header = [
    `# ${pkg.name}`,
    '',
    `> ${pkg.description}`,
    '',
    `The whole of ${SITE_URL} as Markdown: the guides, the component reference and the examples, in the order the site lists them. ${SITE_URL}/llms.txt is the shorter index, and each page below also has a copy of its own at the URL above it.`,
  ].join('\n')

  const sections = twins.map((twin) => `URL: ${twin.url}\n\n${twin.markdown.trimEnd()}`)

  return `${[header, ...sections].join('\n\n---\n\n')}\n`
}
