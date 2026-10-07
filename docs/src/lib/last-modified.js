import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const SRC = fileURLToPath(new URL('../', import.meta.url))

/**
 * When each page was first published and last changed, from git.
 *
 * Read by the layout for `dateModified` / `article:modified_time` and by the
 * build for the sitemap's `<lastmod>`, so the two can never disagree.
 *
 * A page's date is its own file's, or that of a code snippet it imports if
 * one changed later — the samples live in `lib/snippets/` and are as much the
 * page's content as its prose. The shared chrome (layout, nav, i18n) is left
 * out on purpose: a new nav link is not a change to every page, and a sitemap
 * that says otherwise teaches crawlers to stop believing its dates.
 */

/** @type {Map<string, { first: string, last: string }> | null | undefined} */
let commitDates

/**
 * One `git log` over the whole of `src/`, newest first, read once.
 *
 * `null` — and so no dates at all — outside a repository or in a shallow
 * clone. A shallow clone has one commit, so every file would claim it, and a
 * wrong date is worse than none: Google ignores `<lastmod>` on a site whose
 * dates it has caught out.
 */
function loadCommitDates() {
  const git = (/** @type {string[]} */ ...args) =>
    execFileSync('git', args, {
      cwd: SRC,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
      maxBuffer: 64 * 1024 * 1024,
    })

  try {
    if (git('rev-parse', '--is-shallow-repository').trim() === 'true') return null

    const top = git('rev-parse', '--show-toplevel').trim()
    const log = git('log', '--format=%x00%cI', '--name-only', '--', '.')

    /** @type {Map<string, { first: string, last: string }>} */
    const dates = new Map()
    let date = ''

    for (const line of log.split('\n')) {
      if (line.startsWith('\0')) {
        date = line.slice(1)
      } else if (line) {
        const file = path.join(top, line)
        const seen = dates.get(file)
        // Newest first: the first sighting is the last change, and every
        // later one pushes the first publication further back.
        if (seen) seen.first = date
        else dates.set(file, { first: date, last: date })
      }
    }

    return dates
  } catch {
    return null
  }
}

/** `/docs/routing` → `src/docs/routing.ht.js`, `/de` → `src/de/index.ht.js`. */
function pageFile(route) {
  const base = route === '/' ? '' : route
  return [path.join(SRC, `${base}.ht.js`), path.join(SRC, base, 'index.ht.js')].find(
    (file) => existsSync(file),
  )
}

/** The page's own snippet imports: `../lib/snippets/routing.js` and the like. */
function snippetFiles(file) {
  const source = readFileSync(file, 'utf8')
  return [...source.matchAll(/from\s+'(\.{1,2}\/[^']*snippets\/[^']+)'/g)].map(
    ([, specifier]) => path.resolve(path.dirname(file), specifier),
  )
}

/**
 * First and latest commit dates for the page at `route`, as ISO 8601 strings,
 * or `undefined` when git cannot say — a page not committed yet, or a build
 * without history.
 *
 * @param {string} route root-relative, e.g. `/docs/routing` or `/de/ui/card`
 * @returns {{ published: string, modified: string } | undefined}
 */
export function pageDates(route) {
  if (commitDates === undefined) commitDates = loadCommitDates()
  if (!commitDates) return undefined

  const file = pageFile(route)
  const own = file && commitDates.get(file)
  if (!own) return undefined

  let modified = own.last
  for (const snippet of snippetFiles(file)) {
    const last = commitDates.get(snippet)?.last
    if (last && Date.parse(last) > Date.parse(modified)) modified = last
  }

  return { published: own.first, modified }
}
