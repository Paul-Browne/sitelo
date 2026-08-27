import path from 'node:path'
import { readdir, readFile, stat } from 'node:fs/promises'

/** Schemes that never point at a page in this build. */
const EXTERNAL_SCHEME = /^[a-z][a-z0-9+.-]*:/i

/** Attributes we follow. Assets are covered by the plugin's own check. */
const ANCHOR_PATTERN =
  /<a\b[^>]*?\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi

/** `id="…"` on any element, for fragment checking. */
const ID_PATTERN = /\bid\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi

/** `name="…"` on anchors still works as a fragment target. */
const ANCHOR_NAME_PATTERN =
  /<a\b[^>]*?\bname\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi

/**
 * @param {unknown} linkCheck `false`, `true`, `'warn'`, `'error'`, or options.
 * @returns {{ mode: 'warn' | 'error', exclude: RegExp[], checkFragments: boolean } | null}
 */
export function normalizeLinkCheckOptions(linkCheck) {
  if (linkCheck == null || linkCheck === false) return null

  const raw =
    linkCheck === true
      ? {}
      : typeof linkCheck === 'string'
        ? { mode: linkCheck }
        : linkCheck

  if (typeof raw !== 'object' || Array.isArray(raw)) {
    throw new Error(
      '"linkCheck" must be a boolean, \'warn\', \'error\', or an options object',
    )
  }

  const { mode = 'warn', exclude = [], checkFragments = false } = raw

  if (mode !== 'warn' && mode !== 'error') {
    throw new Error(
      `"linkCheck.mode" must be 'warn' or 'error', got ${JSON.stringify(mode)}`,
    )
  }

  const patterns = (Array.isArray(exclude) ? exclude : [exclude]).map(
    (entry) => {
      if (entry instanceof RegExp) return entry
      if (typeof entry === 'string') return globToRegExp(entry)
      throw new Error(
        '"linkCheck.exclude" entries must be strings or regular expressions',
      )
    },
  )

  return { mode, exclude: patterns, checkFragments: Boolean(checkFragments) }
}

/** Minimal glob support: `*` within a segment, `**` across segments. */
function globToRegExp(glob) {
  const escaped = glob
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    // One pass so `**` is never re-matched by the single-`*` rule.
    .replace(/\*\*|\*/g, (match) => (match === '**' ? '.*' : '[^/]*'))

  return new RegExp(`^${escaped}$`)
}

function decodeEntities(value) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
}

function matchValues(html, pattern) {
  const out = []
  for (const match of html.matchAll(pattern)) {
    const value = match[1] ?? match[2] ?? match[3]
    if (value != null) out.push(decodeEntities(value))
  }
  return out
}

/**
 * Split a href into the part that addresses a document and its fragment.
 * Returns null for anything that does not address this build.
 */
export function parseInternalLink(href) {
  const trimmed = href.trim()

  if (trimmed === '') return null
  // Protocol-relative (//cdn.example.com) is external.
  if (trimmed.startsWith('//')) return null
  if (EXTERNAL_SCHEME.test(trimmed)) return null

  const hashIndex = trimmed.indexOf('#')
  let fragment = ''

  if (hashIndex !== -1) {
    const raw = trimmed.slice(hashIndex + 1)
    try {
      fragment = decodeURIComponent(raw)
    } catch {
      fragment = raw
    }
  }

  const withoutHash = hashIndex === -1 ? trimmed : trimmed.slice(0, hashIndex)

  // Same-page fragment (`#section`).
  if (withoutHash === '') return { pathname: '', fragment }

  const queryIndex = withoutHash.indexOf('?')
  const pathname =
    queryIndex === -1 ? withoutHash : withoutHash.slice(0, queryIndex)

  return { pathname, fragment }
}

/**
 * Resolve a link to a path relative to the output root.
 *
 * @param {string} pathname from {@link parseInternalLink}
 * @param {string} fromPage output-relative path of the page holding the link
 * @param {string} base Vite `base`, e.g. `/` or `/repo/`
 * @returns {string | null | 'outside-base'} normalized output-relative
 *   path; `null` if it escapes the output directory; `'outside-base'` if
 *   the site is deployed under a base the link does not start with.
 */
export function resolveLinkTarget(pathname, fromPage, base = '/') {
  let target

  if (pathname.startsWith('/')) {
    const normalizedBase = base.endsWith('/') ? base : `${base}/`

    if (normalizedBase === '/') {
      target = pathname.slice(1)
    } else if (pathname.startsWith(normalizedBase)) {
      // A root-relative link on a based site carries the base prefix.
      target = pathname.slice(normalizedBase.length)
    } else {
      // `/about` on a site served from `/repo/` sends the browser to the
      // host root, not into this site. Resolving it against the output
      // anyway would hide exactly the mistake worth catching.
      return 'outside-base'
    }
  } else {
    target = path.posix.join(path.posix.dirname(toPosix(fromPage)), pathname)
  }

  const hadTrailingSlash = pathname.endsWith('/')
  const normalized = path.posix.normalize(target)

  if (normalized === '..' || normalized.startsWith('../')) return null
  if (normalized === '.' || normalized === './') return ''

  const cleaned = normalized.replace(/^\.\//, '')

  // path.posix.normalize keeps a trailing slash, but join('a', '..') can
  // drop one the author wrote; preserve the author's intent either way.
  return hadTrailingSlash && !cleaned.endsWith('/') ? `${cleaned}/` : cleaned
}

function toPosix(value) {
  return value.split(path.sep).join('/')
}

/**
 * Candidate files a static host would try for a given link target.
 * Mirrors how `cleanUrls` output is actually served.
 */
export function candidatePaths(target) {
  const trimmed = target.replace(/\/+$/, '')

  if (trimmed === '') return ['index.html']

  // A trailing slash only ever means a directory index.
  if (target.endsWith('/')) return [`${trimmed}/index.html`]

  return [trimmed, `${trimmed}/index.html`, `${trimmed}.html`]
}

/**
 * Read every emitted file, note the HTML ones, and collect their links.
 *
 * @param {{ root: string, outDir: string, checkFragments?: boolean }} args
 */
async function readOutput({ root, outDir, checkFragments }) {
  const siteDir = path.resolve(root, outDir)

  /** Every emitted file, output-relative with posix separators. */
  const files = new Set()
  /** page path -> hrefs found in it */
  const pages = new Map()
  /** page path -> fragment ids it defines */
  const fragments = new Map()

  async function walk(dir) {
    let entries
    try {
      entries = await readdir(dir, { withFileTypes: true })
    } catch {
      return
    }

    await Promise.all(
      entries.map(async (entry) => {
        const full = path.join(dir, entry.name)

        if (entry.isDirectory()) return walk(full)
        if (!entry.isFile()) return

        const relative = toPosix(path.relative(siteDir, full))
        files.add(relative)

        if (!/\.html?$/i.test(entry.name)) return

        let html
        try {
          html = await readFile(full, 'utf8')
        } catch {
          return
        }

        pages.set(relative, matchValues(html, ANCHOR_PATTERN))

        if (checkFragments) {
          fragments.set(
            relative,
            new Set([
              ...matchValues(html, ID_PATTERN),
              ...matchValues(html, ANCHOR_NAME_PATTERN),
            ]),
          )
        }
      }),
    )
  }

  try {
    if (!(await stat(siteDir)).isDirectory()) return null
  } catch {
    return null
  }

  await walk(siteDir)

  return { files, pages, fragments }
}

/**
 * Check every internal `<a href>` in the build against what was emitted.
 *
 * @param {{
 *   root: string,
 *   outDir: string,
 *   base?: string,
 *   options: { mode: 'warn' | 'error', exclude: RegExp[], checkFragments: boolean },
 * }} args
 * @returns {Promise<{
 *   checked: number,
 *   broken: Array<{ page: string, href: string, reason: string }>,
 * } | null>}
 */
export async function collectBrokenLinks({
  root,
  outDir,
  base = '/',
  options,
}) {
  const output = await readOutput({
    root,
    outDir,
    checkFragments: options.checkFragments,
  })

  if (!output) return null

  const { files, pages, fragments } = output
  const broken = []
  let checked = 0

  for (const [page, hrefs] of pages) {
    for (const href of hrefs) {
      const link = parseInternalLink(href)
      if (!link) continue
      if (options.exclude.some((pattern) => pattern.test(href))) continue

      checked += 1

      let resolved

      if (link.pathname === '') {
        // `#section` on the current page.
        resolved = page
      } else {
        const target = resolveLinkTarget(link.pathname, page, base)

        if (target === null) {
          broken.push({ page, href, reason: 'escapes the output directory' })
          continue
        }

        if (target === 'outside-base') {
          broken.push({
            page,
            href,
            reason: `outside the site base (${base})`,
          })
          continue
        }

        resolved = candidatePaths(target).find((candidate) =>
          files.has(candidate),
        )
      }

      if (!resolved) {
        broken.push({ page, href, reason: 'no such page' })
        continue
      }

      if (!options.checkFragments || link.fragment === '') continue

      // Fragments are only checkable when the target is a page we parsed.
      const ids = fragments.get(resolved)
      if (!ids) continue

      if (!ids.has(link.fragment)) {
        broken.push({ page, href, reason: 'no such fragment' })
      }
    }
  }

  // Plain comparison, not localeCompare: ICU collation varies by platform
  // and Node build, and the report should be byte-for-byte reproducible.
  const compare = (a, b) => (a < b ? -1 : a > b ? 1 : 0)

  broken.sort(
    (a, b) => compare(a.page, b.page) || compare(a.href, b.href),
  )

  return { checked, broken }
}

/**
 * @param {Array<{ page: string, href: string, reason: string }>} broken
 * @returns {string}
 */
export function formatBrokenLinks(broken) {
  const byPage = new Map()

  for (const entry of broken) {
    const list = byPage.get(entry.page) ?? []
    list.push(entry)
    byPage.set(entry.page, list)
  }

  // No `[sitelo]` prefix: the warn path adds one, and the CLI's error
  // handler already prefixes anything thrown.
  const lines = [
    `${broken.length} broken internal link${broken.length === 1 ? '' : 's'}`,
    '',
  ]

  for (const [page, entries] of byPage) {
    lines.push(`  ${page}`)

    const width = Math.max(...entries.map((entry) => entry.href.length))

    for (const entry of entries) {
      lines.push(`    ${entry.href.padEnd(width)}  -> ${entry.reason}`)
    }

    lines.push('')
  }

  return lines.join('\n').trimEnd()
}

/**
 * Run the check and report according to `options.mode`.
 *
 * @returns {Promise<{ checked: number, broken: number }>}
 */
export async function runLinkCheck({
  root,
  outDir,
  base,
  options,
  log = console.log,
  warn = console.warn,
}) {
  const result = await collectBrokenLinks({ root, outDir, base, options })

  if (!result) return { checked: 0, broken: 0 }

  const { checked, broken } = result

  if (broken.length === 0) {
    log(
      `[sitelo] checked ${checked} internal link${checked === 1 ? '' : 's'} - all good`,
    )
    return { checked, broken: 0 }
  }

  const message = formatBrokenLinks(broken)

  if (options.mode === 'warn') {
    warn(`[sitelo] ${message}`)
    return { checked, broken: broken.length }
  }

  throw new Error(message)
}
