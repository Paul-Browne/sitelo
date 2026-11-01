import fs from 'node:fs'
import path from 'node:path'

const FILE = 'robots.txt'

/**
 * The robots.txt sitelo writes for a site that has none of its own:
 * every crawler may fetch everything, and where the sitemap is when the
 * build has one.
 *
 * The sitemap's URL is `site` with `/sitemap.xml` after it — the same
 * place html-pages writes it, whose entries are `site` plus each route.
 * The protocol wants an absolute URL there, so without `site` there is
 * no line rather than a relative one.
 *
 * @param {{ site?: string, sitemap?: boolean }} [options]
 * @returns {string}
 */
export function robotsTxtSource({ site, sitemap = false } = {}) {
  const lines = ['User-agent: *', 'Allow: /']
  const siteUrl = (site ?? '').replace(/\/+$/, '')

  if (siteUrl && sitemap) lines.push('', `Sitemap: ${siteUrl}/sitemap.xml`)

  return `${lines.join('\n')}\n`
}

/**
 * Write `robots.txt` on a build, and answer `/robots.txt` in dev, unless
 * the site ships its own.
 *
 * A site's own is a `robots.txt` in `public/` or in the pages directory.
 * Vite copies the first and html-pages the second, so on a build either
 * one stands as written.
 *
 * A static host answers a missing `/robots.txt` with the 404 page. That is
 * harmless to a crawler, which then fetches everything, but it is also
 * the one place the sitemap can be announced, and Lighthouse's SEO audit
 * asks for the file on every run.
 *
 * @param {{ site?: string, root?: string, pagesDir?: string }} [options]
 * @returns {import('vite').Plugin}
 */
export function robotsTxt({ site, root: pagesRoot, pagesDir = 'src' } = {}) {
  /** Vite's `public/`, absolute, or `''` when there is none. */
  let publicDir = ''
  /** Whether a build copies `public/` into the output. */
  let copyPublicDir = true
  /** The pages directory, absolute, resolved the way html-pages does. */
  let pagesPath = ''

  return {
    name: 'sitelo:robots',

    configResolved(config) {
      publicDir = config.publicDir
      copyPublicDir = config.build.copyPublicDir !== false
      pagesPath = path.join(pagesRoot ? path.resolve(config.root, pagesRoot) : config.root, pagesDir)
    },

    /*
     * Ahead of html-pages' middleware, and of Vite's: html-pages routes
     * any URL not ending in an extension it knows as a page, `.txt`
     * included, so a catch-all page would render `/robots.txt` as HTML,
     * and otherwise its 404 page answers the miss.
     */
    configureServer: {
      order: 'pre',
      handler(server) {
        server.middlewares.use((req, res, next) => {
          if (req.method !== 'GET' && req.method !== 'HEAD') return next()

          // Vite's base, the way html-pages reads it: a server in
          // middleware mode may also be mounted with the base taken off.
          const url = (req.url ?? '').split(/[?#]/)[0]
          const { base, server: { middlewareMode } } = server.config
          const wanted = url === `${base}${FILE}` || (middlewareMode && url === `/${FILE}`)

          if (!wanted) return next()

          // `public/` is Vite's to serve, which it does next.
          if (publicDir && fs.existsSync(path.join(publicDir, FILE))) return next()

          // One in the pages directory is what a build copies out, but
          // html-pages does not serve it in dev, so that falls to here too.
          const own = path.join(pagesPath, FILE)
          const body = fs.existsSync(own)
            ? fs.readFileSync(own)
            : // A dev server renders no sitemap, but the line says where a
              // build will put one.
              robotsTxtSource({ site, sitemap: true })

          res.setHeader('Content-Type', 'text/plain; charset=utf-8')
          res.setHeader('Cache-Control', 'no-cache')
          res.end(req.method === 'HEAD' ? undefined : body)
        })
      },
    },

    /*
     * After html-pages' own `generateBundle`, which emits the copy of a
     * `robots.txt` from the pages directory, and `sitemap.xml`.
     */
    generateBundle: {
      order: 'post',
      handler(_options, bundle) {
        if (bundle[FILE]) return
        if (copyPublicDir && publicDir && fs.existsSync(path.join(publicDir, FILE))) return

        this.emitFile({
          type: 'asset',
          fileName: FILE,
          source: robotsTxtSource({ site, sitemap: Boolean(bundle['sitemap.xml']) }),
        })
      },
    },
  }
}
