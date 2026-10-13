# Configuration

`sitelo.config.js` (or `sitelo.config.mjs`) at the project root exports an
object. Everything in it is optional. Vite options go under `vite`. CLI
flags override both.

```js
// sitelo.config.js
export default {
  site: 'https://example.com',
  vite: {
    publicDir: 'static',
    build: { outDir: 'public' },
    server: { port: 8888 },
  },
}
```

A `vite.config.js` is still auto-loaded and merged. It can hold Vite
options while sitelo injects the plugin, or it can register the plugin
itself:

```js
// vite.config.js
import sitelo from 'sitelo'

export default { plugins: [sitelo({ site: 'https://example.com' })] }
```

Plugin options belong in **one** place. sitelo errors if both files
register them. Features marked *CLI only* below run in `sitelo build`, not
`vite build`.

## Plugin options

| Option | Default | Meaning |
| --- | --- | --- |
| `pagesDir` | `'src'` | Directory holding pages and assets |
| `pageExtensions` | `.ht.js`, `.html.js`, `.ht.ts`, `.html.ts`, `.ht.jsx`, `.html.jsx`, `.ht.tsx`, `.html.tsx` | Which suffixes are pages |
| `include` / `exclude` | derived / `[]` | Globs for page discovery |
| `root` | Vite root | Project root |
| `cleanUrls` | `true` | `about/index.html` rather than `about.html` |
| `site` | none | Base URL. Turns on `sitemap.xml` |
| `rss` | none | `{ site, title, description, routePrefix }` writes `rss.xml` with every page under `routePrefix` |
| `pagefind` | none | `true` or options. Indexes the build (*CLI only*, needs `pagefind`) |
| `images` | none | `true` or options. See [images.md](images.md) (*CLI only* for the build, needs `sharp`) |
| `missingAssets` | `'error'` | `'warn'` to log broken script and stylesheet references instead of failing |
| `linkCheck` | off | `true`, `'warn'`, `'error'` or `{ mode, exclude, checkFragments }` (*CLI only*) |
| `lighthouse` | none | `true` or options. See [lighthouse.md](lighthouse.md) (*CLI only*, needs `lighthouse`) |
| `mapOutputPath` | none | `(page) => string` to choose output filenames |
| `generatedTypesDir` | `'.sitelo/types'` | Where page helper `.d.ts` files go |
| `displayName` | `'sitelo'` | Label in console and overlay messages |
| `devToolbar` | `true` | The dev-only toolbar showing route, file, params, islands and viewport presets. `false` hides it |
| `devToolbarDocsUrl` | sitelo docs | The toolbar's docs link |
| `renderConcurrency` | `8` | Pages rendered in parallel |
| `renderBatchSize` | `max(concurrency, 32)` | Pages per render batch |
| `buildReport` | `true` | The post-build size and timing summary. `false`, or `{ top: 10 }` (*CLI only*) |
| `uiClient` | `{ base: '/su/' }` | Where the `sitelo/ui` runtime and stylesheet are served |
| `pruneCss` | `false` | `true` or `{ keep: [...] }`. Trims the `sitelo/ui` sheet to the classes the build uses |
| `debug` | `false` | Verbose discovery, routing and emit logging |

## Sitemap and RSS

Set `site` and `dist/sitemap.xml` lists every static route. `rss` writes
`dist/rss.xml`:

```js
export default {
  site: 'https://example.com',
  rss: { site: 'https://example.com', title: 'My Blog', description: 'Latest posts', routePrefix: '/blog' },
}
```

## Link checking

```js
export default {
  linkCheck: {
    mode: 'error',                        // 'warn' (the default) logs, 'error' fails the build
    checkFragments: true,                 // also check #ids in the target page
    exclude: ['/api/**', /^\/legacy\//],  // hrefs to skip
  },
}
```

It runs against `dist/` after images and Pagefind, resolving each internal
`<a href>` the way a static host would: `/about` tries `about`, then
`about/index.html`, then `about.html`. External links are never fetched.
On a site with a `base`, a root-relative link without the base is
reported. `checkFragments` is off by default because ids that client
scripts add are not in the HTML.

## Pagefind search

`npm install -D pagefind`, then set `pagefind: true`. `sitelo build` indexes
into `dist/pagefind/` and syncs a copy to `public/pagefind/` (gitignore it)
so that dev and preview can search without rebuilding. Mark the searchable
region with `data-pagefind-body`, then load the UI from a client script:

```js
// src/search.js, linked from the page with <script type="module" src="/search.js">
const css = Object.assign(document.createElement('link'), { rel: 'stylesheet', href: '/pagefind/pagefind-ui.css' })
document.head.append(css)
await new Promise((resolve, reject) => {
  const script = Object.assign(document.createElement('script'), { src: '/pagefind/pagefind-ui.js', onload: resolve, onerror: reject })
  document.body.append(script)
})
new PagefindUI({ element: '#search', showImages: false })
```

## Build report

`sitelo build` ends with file counts and sizes by kind (pages, js, css,
images, other), the largest files, and timings per phase. A slow build is
usually image encoding. `--logLevel silent` hides the report.

## Unused code (knip)

Nothing imports pages or islands, so knip reports them as unused unless it
is told about them:

```js
// knip.js
import { knipConfig } from 'sitelo/knip'

export default knipConfig({
  entry: ['src/js/app.js!'],   // scripts pages reference by URL, not import
})
```

`knipConfig()` reads `sitelo.config.js` (`pagesDir`, `pageExtensions`,
`include`, `exclude`) and marks every page and island as an entry. Other
knip options are spread into the result.

## Performance

For large sites raise `renderConcurrency` (say 16) and `renderBatchSize`
(say 128).

Docs: https://sitelo.dev/docs/configuration.md and https://sitelo.dev/docs/cli.md
