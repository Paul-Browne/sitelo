import fs from 'node:fs'
import path from 'node:path'

import { pageInfo, pageToMarkdown } from './markdown.js'
import { matchesGlob, pageUrl } from './site-paths.js'

const INDEX = 'llms.txt'
const FULL = 'llms-full.txt'

/**
 * The `llms` option, checked and with its defaults filled in, or `null`
 * when it is off.
 *
 * @param {unknown} llms
 * @returns {{ exclude: string[], full: boolean } | null}
 */
export function normalizeLlmsOptions(llms) {
  if (!llms) return null
  if (llms === true) return { exclude: [], full: true }

  if (typeof llms !== 'object' || Array.isArray(llms)) {
    throw new Error('"llms" must be true or an object')
  }

  const { exclude, full } = /** @type {Record<string, unknown>} */ (llms)
  const globs = exclude == null ? [] : Array.isArray(exclude) ? exclude : [exclude]

  if (!globs.every((glob) => typeof glob === 'string')) {
    throw new Error('"llms.exclude" must be a string or an array of strings')
  }
  if (full != null && typeof full !== 'boolean') {
    throw new Error('"llms.full" must be a boolean')
  }

  return { exclude: /** @type {string[]} */ (globs), full: full !== false }
}

/**
 * @typedef {{
 *   url: string,
 *   route: string,
 *   mdFile: string,
 *   title: string,
 *   description?: string,
 *   markdown: string,
 * }} LlmsPage
 */

/**
 * Write the files the llms.txt convention (https://llmstxt.org) asks for:
 * a Markdown copy of each page beside it, `llms.txt` listing them, and
 * `llms-full.txt` holding all of them, for a reader that would rather
 * take the site in one request.
 *
 * Everything is read back out of the built pages, after html-pages has
 * emitted them. A page leaves the list for being a 404 page, for saying
 * `<meta name="robots" content="noindex">`, for matching `exclude`, or
 * for having no content to convert.
 *
 * A site's own `llms.txt`, in `public/` or the pages directory, is not
 * replaced but kept as the top of the file — a title, a summary, notes
 * for a reader — with the list of pages after it. That is the part the
 * convention means a person to write, and the dev server serves it as is.
 *
 * @param {{ site?: string, exclude?: string[], full?: boolean }} options
 * @returns {import('vite').Plugin}
 */
export function llmsTxt({ site, exclude = [], full = true }) {
  const siteUrl = (site ?? '').replace(/\/+$/, '')
  /** Vite's `public/`, absolute, or `''` when a build copies none of it. */
  let publicDir = ''

  return {
    name: 'sitelo:llms',
    apply: 'build',

    configResolved(config) {
      publicDir = config.build.copyPublicDir === false ? '' : config.publicDir

      // Every link in the files is absolute, as they are read away from
      // the site, so there is nothing to write without the site's URL.
      if (!siteUrl) {
        throw new Error('"llms" needs "site", the absolute URL the site is served at, to link its pages')
      }
    },

    generateBundle: {
      // After html-pages has emitted the pages.
      order: 'post',
      handler(_options, bundle) {
        const pages = readPages(bundle, { siteUrl, exclude })
        const inPublic = (file) => Boolean(publicDir) && fs.existsSync(path.join(publicDir, file))

        for (const page of pages) {
          // A file of the site's own by that name stands.
          if (bundle[page.mdFile] || inPublic(page.mdFile)) continue
          this.emitFile({ type: 'asset', fileName: page.mdFile, source: page.markdown })
        }

        const intro = ownIntro(bundle, publicDir) ?? generatedIntro(bundle, siteUrl)
        const index = llmsIndex(intro, pages, { siteUrl, full })

        // Written over the copy html-pages or Vite would otherwise ship.
        const existing = bundle[INDEX]
        if (existing?.type === 'asset') existing.source = index
        else this.emitFile({ type: 'asset', fileName: INDEX, source: index })

        if (full && !bundle[FULL] && !inPublic(FULL)) {
          this.emitFile({ type: 'asset', fileName: FULL, source: llmsFull(intro, pages, siteUrl) })
        }
      },
    },
  }
}

/** @param {string | Uint8Array} source */
function text(source) {
  return typeof source === 'string' ? source : Buffer.from(source).toString('utf8')
}

/**
 * Where a page's Markdown copy goes: beside the page, named for its URL,
 * so `/blog/hello/` has `/blog/hello.md`. The home page's is `/index.md`.
 *
 * @param {string} route
 */
export function markdownPath(route) {
  const trimmed = route.replace(/\/+$/, '')
  return `${trimmed || '/index'}.md`
}

/**
 * Every built page worth listing, in URL order, with its Markdown copy.
 *
 * @param {import('vite').Rolldown.OutputBundle} bundle
 * @param {{ siteUrl: string, exclude: string[] }} options
 * @returns {LlmsPage[]}
 */
function readPages(bundle, { siteUrl, exclude }) {
  /** @type {LlmsPage[]} */
  const pages = []

  for (const [fileName, output] of Object.entries(bundle)) {
    if (output.type !== 'asset' || !fileName.endsWith('.html')) continue
    if (path.posix.basename(fileName) === '404.html') continue
    if (exclude.some((glob) => matchesGlob(fileName, glob))) continue

    const html = text(output.source)
    const info = pageInfo(html)
    if (info.noindex) continue

    const route = pageUrl(fileName)
    const url = `${siteUrl}${route}`
    const body = pageToMarkdown(html, { pageUrl: url })
    if (!body?.trim()) continue

    // The page's own heading names it, then its description, which is
    // its one-line answer to "what is this?" and the line most worth
    // quoting.
    const [first, ...rest] = body.split('\n')
    const heading = first.startsWith('# ') ? first.slice(2) : undefined
    const title = heading || info.title || route
    const lead = info.description ? `\n\n> ${info.description}` : ''
    const markdown = heading
      ? `${first}${lead}\n${rest.join('\n')}`
      : `# ${title}${lead}\n\n${body}`

    pages.push({
      url,
      route,
      mdFile: markdownPath(route).slice(1),
      title,
      description: info.description,
      markdown,
    })
  }

  return pages.sort((a, b) => a.route.localeCompare(b.route))
}

/**
 * The top of the site's own `llms.txt`: the copy html-pages took from the
 * pages directory, or the one in `public/`.
 *
 * @param {import('vite').Rolldown.OutputBundle} bundle
 * @param {string} publicDir
 */
function ownIntro(bundle, publicDir) {
  const copied = bundle[INDEX]
  if (copied?.type === 'asset') return text(copied.source)

  const file = publicDir && path.join(publicDir, INDEX)
  return file && fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : undefined
}

/**
 * A title and summary for a site with no `llms.txt` of its own, from the
 * home page's `<title>` and description.
 *
 * @param {import('vite').Rolldown.OutputBundle} bundle
 * @param {string} siteUrl
 */
function generatedIntro(bundle, siteUrl) {
  const home = bundle['index.html']
  const info = home?.type === 'asset' ? pageInfo(text(home.source)) : {}
  const title = info.title || new URL(siteUrl).host

  return info.description ? `# ${title}\n\n> ${info.description}\n` : `# ${title}\n`
}

/**
 * Which section of `llms.txt` a page is listed under: its first path
 * segment, when another page shares it — `/blog/` and `/blog/hello/` go
 * under "Blog" — and "Pages" otherwise, so a lone `/about/` does not get
 * a heading to itself.
 *
 * @param {LlmsPage[]} pages
 */
function sections(pages) {
  const first = (page) => page.route.split('/').filter(Boolean)[0]
  /** @type {Map<string, number>} */
  const counts = new Map()
  for (const page of pages) {
    const segment = first(page)
    if (segment && page.route !== `/${segment}/` && page.route !== `/${segment}`) {
      counts.set(segment, (counts.get(segment) ?? 0) + 1)
    }
  }

  /** @type {Map<string, LlmsPage[]>} */
  const grouped = new Map([['Pages', []]])
  const named = []

  for (const page of pages) {
    const segment = first(page)
    if (!segment || !counts.get(segment)) {
      grouped.get('Pages')?.push(page)
      continue
    }

    const name = sectionName(segment)
    if (!grouped.has(name)) {
      grouped.set(name, [])
      named.push(name)
    }
    grouped.get(name)?.push(page)
  }

  return [
    ['Pages', grouped.get('Pages') ?? []],
    ...named.sort((a, b) => a.localeCompare(b)).map((name) => [name, grouped.get(name) ?? []]),
  ].filter(([, list]) => list.length > 0)
}

/** `getting-started` → `Getting started`. */
function sectionName(segment) {
  let words = segment
  try {
    words = decodeURIComponent(segment)
  } catch {
    // Not percent-encoded after all; used as written.
  }
  words = words.replace(/[-_]+/g, ' ').trim()
  return words.charAt(0).toUpperCase() + words.slice(1)
}

/** Text for inside a Markdown link's brackets, which a `]` would end. */
const linkText = (value) => value.replace(/[\\[\]]/g, '\\$&')

/** The site's intro with a link to every page's Markdown copy after it. */
function llmsIndex(intro, pages, { siteUrl, full }) {
  const lists = sections(pages).map(([name, list]) => {
    const lines = /** @type {LlmsPage[]} */ (list).map((page) => {
      const note = page.description ? `: ${page.description}` : ''
      return `- [${linkText(page.title)}](${siteUrl}/${page.mdFile})${note}`
    })
    return `## ${name}\n\n${lines.join('\n')}`
  })

  // "Optional" is the convention's name for what a reader short of
  // context can skip.
  if (full) {
    lists.push(
      `## Optional\n\n- [Everything in one file](${siteUrl}/${FULL}): every page listed here, as Markdown, in this order`,
    )
  }

  return `${[intro.trimEnd(), ...lists].join('\n\n')}\n`
}

/**
 * Every page's Markdown copy in one file, under the intro's title and
 * summary — the part before its first `##` section.
 */
function llmsFull(intro, pages, siteUrl) {
  const preamble = intro.split(/^## /m)[0].trimEnd()
  const header = [
    preamble,
    `Every page of ${siteUrl}, as Markdown. ${siteUrl}/${INDEX} is the shorter index, and each page below also has a copy of its own beside it.`,
  ].join('\n\n')

  const bodies = pages.map((page) => `URL: ${page.url}\n\n${page.markdown.trimEnd()}`)

  return `${[header, ...bodies].join('\n\n---\n\n')}\n`
}
