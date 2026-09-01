import path from 'node:path'
import { readdir } from 'node:fs/promises'

/**
 * Shared helpers for talking about the files a build emitted: which of them
 * a glob covers, what URL each page is actually reached at, and how to walk
 * the output directory.
 *
 * Both `pagefind` and `lighthouse` work off the built site rather than the
 * source pages, and both have to agree with the URLs the site links — a
 * result or a report that points at `/docs.html` is wrong wherever every
 * link, canonical tag and sitemap entry says `/docs`.
 */

/**
 * Result URL for one HTML file, matching how the site actually links it.
 *
 * `index.html` keeps the directory form, so a `cleanUrls` site is addressed
 * exactly as it is served. Flat `cleanUrls: false` output is linked without
 * the extension — `docs/routing.html` is only ever reached as
 * `/docs/routing` — so that is the URL to use for it.
 *
 * @param {string} relativePath path within the build, relative to its root
 * @param {{ keepIndexUrl?: boolean }} [options]
 */
export function pageUrl(relativePath, options = {}) {
  const file = toPosix(relativePath)
  const isIndex = file === 'index.html' || file.endsWith('/index.html')

  if (isIndex) {
    if (options.keepIndexUrl) return `/${file}`
    return `/${file.slice(0, -'index.html'.length)}`
  }

  return `/${file.replace(/\.html$/, '')}`
}

/** @param {string} value */
export function toPosix(value) {
  return value.split(path.sep).join('/')
}

/**
 * Compile the glob subset pagefind's own `glob` option is written in —
 * `**`, `*`, `?` and `{a,b}` alternation — to a regular expression.
 *
 * @param {string} glob
 */
export function globToRegExp(glob) {
  let source = ''
  let braces = 0

  for (let i = 0; i < glob.length; i += 1) {
    const char = glob[i]

    if (char === '*' && glob[i + 1] === '*') {
      i += 1
      /*
       * `**\/` spans zero or more directories, so `**\/*.html` still matches a
       * file sitting at the root. A trailing `**` takes the rest of the path.
       */
      if (glob[i + 1] === '/') {
        i += 1
        source += '(?:[^/]*/)*'
      } else {
        source += '.*'
      }
    } else if (char === '*') source += '[^/]*'
    else if (char === '?') source += '[^/]'
    else if (char === '{') {
      braces += 1
      source += '(?:'
    } else if (char === '}' && braces > 0) {
      braces -= 1
      source += ')'
    } else if (char === ',' && braces > 0) source += '|'
    else source += char.replace(/[.+^${}()|[\]\\]/g, '\\$&')
  }

  return new RegExp(`^${source}$`)
}

/**
 * Whether a build-relative path is covered by a `glob`.
 *
 * @param {string} relativePath
 * @param {string} glob
 */
export function matchesGlob(relativePath, glob) {
  return globToRegExp(glob).test(toPosix(relativePath))
}

/**
 * Every `.html` file under `dir`, as sorted paths relative to it.
 *
 * `pagefind/` is skipped by default for the same reason pagefind skips it:
 * with `syncPublic`, the previous build's bundle is copied back out of
 * `public/` into the output directory before this runs.
 *
 * @param {string} dir
 * @param {{ skip?: string[] }} [options]
 * @returns {Promise<string[]>}
 */
export async function collectHtmlFiles(dir, options = {}) {
  const skip = new Set(options.skip ?? ['pagefind'])

  async function walk(current) {
    const entries = await readdir(current, { withFileTypes: true })
    const files = []

    for (const entry of entries) {
      const full = path.join(current, entry.name)

      if (entry.isDirectory()) {
        if (skip.has(entry.name)) continue
        files.push(...(await walk(full)))
      } else if (entry.isFile() && entry.name.endsWith('.html')) {
        files.push(path.relative(dir, full))
      }
    }

    return files
  }

  return (await walk(dir)).sort()
}
