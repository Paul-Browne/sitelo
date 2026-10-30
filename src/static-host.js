import fs from 'node:fs'
import path from 'node:path'

/**
 * The file a static host would answer a request with, or `null` for a
 * path with nothing behind it.
 *
 * By the time this runs, Vite has already rewritten the pretty URLs, so
 * `/docs` arrives as `/docs.html`; only a trailing slash still has to be
 * turned into a directory index.
 *
 * @param {string} siteDir
 * @param {string} url the request URL, base already stripped
 * @returns {string | null}
 */
export function resolveStaticFile(siteDir, url) {
  const withoutQuery = url.split('?')[0].split('#')[0]

  let pathname

  try {
    pathname = decodeURIComponent(withoutQuery)
  } catch {
    return null
  }

  const relative = pathname.endsWith('/')
    ? `${pathname}index.html`
    : pathname

  const target = path.resolve(siteDir, `.${relative}`)

  // `.%2e/` and friends: anything that climbs out of the build is a miss,
  // not something to go looking for on disk.
  if (target !== siteDir && !target.startsWith(siteDir + path.sep)) return null

  try {
    return fs.statSync(target).isFile() ? target : null
  } catch {
    return null
  }
}

/**
 * Serve the build the way a static host does. `sitelo preview` and
 * `sitelo lighthouse` both run their server through this.
 *
 * - **No SPA fallback.** Vite's preview server is an SPA server by
 *   default: it answers every path it cannot resolve with `index.html`
 *   and a 200. A built sitelo site is a multi-page one, so the app type
 *   is `mpa`, and a path with no file behind it gets the build's
 *   `404.html` with a 404. Lighthouse notices the difference: it asks for
 *   `/robots.txt`, and a page of HTML with a 200 is a malformed one.
 * - **A directory without its slash is redirected.** With `cleanUrls`,
 *   `/about` is `about/index.html`, and Netlify, Cloudflare Pages and
 *   GitHub Pages all redirect `/about` to `/about/` rather than serve it
 *   in place, so the page's relative URLs resolve against its own
 *   directory. The redirect here is a temporary one where theirs are
 *   permanent: a browser keeps a permanent redirect for the origin, and
 *   every site previewed shares `localhost:4173`.
 *
 * The middleware is registered *after* Vite's own static and
 * html-fallback middlewares, and after other plugins' (`order: 'post'`),
 * so a rewritten `/docs.html` still resolves and only genuine misses land
 * here.
 *
 * @returns {import('vite').Plugin}
 */
export function staticHostPlugin() {
  return {
    name: 'sitelo:static-host',

    config: () => ({ appType: 'mpa' }),

    configurePreviewServer: {
      order: 'post',
      handler(server) {
        // The directory Vite itself serves the preview from.
        const siteDir = path.resolve(
          server.config.root,
          server.config.environments.client.build.outDir,
        )

        return () => {
          server.middlewares.use((req, res, next) => {
            const url = req.url ?? '/'

            if (resolveStaticFile(siteDir, url)) return next()

            const pathname = url.split('?')[0]

            if (
              (req.method === 'GET' || req.method === 'HEAD') &&
              !pathname.endsWith('/') &&
              resolveStaticFile(siteDir, `${pathname}/`)
            ) {
              // The URL as asked for, so the base is kept. Leading slashes
              // collapse: `//example.com` would be another host.
              const location = (req.originalUrl ?? url).replace(
                /^[^?]*/,
                (asked) => `${asked.replace(/^[/\\]+/, '/')}/`,
              )

              res.statusCode = 307
              res.setHeader('Location', location)
              res.end()
              return
            }

            /** @type {Buffer | null} */
            let notFoundPage = null

            // Read per miss rather than once: a preview server outlives
            // the build it started on.
            try {
              notFoundPage = fs.readFileSync(path.join(siteDir, '404.html'))
            } catch {
              // No 404 page in this build; answered in plain text below.
            }

            // A build's own 404.html, served with a 404 — what GitHub Pages,
            // Netlify and Cloudflare Pages all do with it.
            res.statusCode = 404

            if (notFoundPage) {
              res.setHeader('Content-Type', 'text/html; charset=utf-8')
              res.end(notFoundPage)
            } else {
              res.end('Not found')
            }
          })
        }
      },
    },
  }
}
