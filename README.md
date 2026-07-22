# sitelo

[![npm version](https://img.shields.io/npm/v/sitelo.svg)](https://www.npmjs.com/package/sitelo)
[![npm downloads](https://img.shields.io/npm/dm/sitelo.svg)](https://www.npmjs.com/package/sitelo)
[![license](https://img.shields.io/npm/l/sitelo.svg)](LICENSE)
[![vite](https://img.shields.io/badge/vite-plugin-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)

**Static site generation for Vite — no framework, no components, no magic.**

Write JavaScript (or TypeScript, or JSX) functions that return HTML.
Get a complete static site with file-based routing, dynamic pages, data
loading, an asset pipeline, sitemap, RSS, and a live dev server.

⭐ If this project helps you, please consider starring it.

---

## TL;DR

Write a function that returns HTML:

```js
// src/index.ht.js

export default () => `
  <html lang="en">
    <head>
      <title>My website</title>
      <link rel="stylesheet" href="/styles.css">
    </head>
    <body>
      <h1>Hello world</h1>
    </body>
  </html>
`
```

Run:

```bash
vite build
```

Get:

```
dist/
  index.html      ← rendered, with <!DOCTYPE html> added for you
  styles.css      ← bundled + minified, because your page referenced it
  404.html        ← generated automatically
```

That's the whole mental model. Everything else is convenience on top.

---

## Features

- **File-based routing** — `src/about.ht.js` → `/about`
- **Dynamic routes** — `[slug]`, `[year]/[slug]`, catch-all `[...path]`, optional catch-all `[...path]?`
- **Route groups** — `(admin)/users.ht.js` → `/users`
- **Bring your own HTML** — template literals, [javascript-to-html](https://www.npmjs.com/package/javascript-to-html), or JSX/TSX
- **Data loading** — `data()` runs at build time, with built-in fetch caching
- **Typed pages** — per-route param types inferred from the filename
- **Smart asset pipeline** — JS/TS/CSS referenced by your HTML is bundled and minified; server-only code never leaks into `dist`
- **Asset validation** — broken `<script src>` / stylesheet links fail the build
- **Real dev server** — pages render on request (dynamic routes included, no `generateStaticParams` needed in dev) with full reload and readable error frames
- **Parallel static generation** — renders large sites concurrently
- **`404.html`, `sitemap.xml`, RSS** — generated for you

---

## Why this exists

Modern static site tools are powerful, but they bring frameworks,
component systems, hydration strategies, and opinionated conventions.

Sometimes you just want to:

- write HTML
- organize pages in folders
- run `vite build`

`sitelo` exists for exactly that. Pages are plain
functions that return a string of HTML. No runtime ships to the
browser unless *you* add a script.

---

## Installation

```bash
npm install -D sitelo
```

Requires **Node 18+** and **Vite 8+**.

```js
// vite.config.js
import { defineConfig } from "vite"
import htmlPages from "sitelo"

export default defineConfig({
  plugins: [htmlPages()]
})
```

```bash
vite        # dev server with live rendering
vite build  # static site in dist/
```

Add the generated helper types to your `.gitignore`:

```
.sitelo/
```

---

## Project structure

```
src/
  index.ht.js            → /
  about.ht.js            → /about
  styles.css             → bundled if referenced
  main.js                → bundled if referenced
  lib/
    api.js               → build-time only (never emitted unless referenced)

  blog/
    index.ht.js          → /blog
    [slug].ht.js         → /blog/:slug

  docs/
    [...path]?.ht.js     → /docs, /docs/a, /docs/a/b, ...

  (admin)/
    users.ht.js          → /users

  404.ht.js              → dist/404.html
```

Any file ending in a page extension is a page. Everything else in
`src/` is treated as an asset (see [Assets](#assets--styling)).

Default page extensions: `.ht.js`, `.html.js`, `.ht.ts`, `.html.ts`,
`.ht.jsx`, `.html.jsx`, `.ht.tsx`, `.html.tsx`.

---

## Writing pages

A page module's **default export** can be any of the following.

### 1. A function returning an HTML string

```js
export default ({ params, data, dev }) => `
  <html>
    <body><h1>Hello</h1></body>
  </html>
`
```

### 2. A plain string

```js
export default `<html><body><h1>Static as it gets</h1></body></html>`
```

### 3. A structured module

Keeps `render`, `data`, and `generateStaticParams` together in one object:

```js
export default {
  generateStaticParams: () => [{ slug: "hello" }],
  data: ({ params }) => ({ title: params.slug }),
  render: ({ data }) => `<html><body><h1>${data.title}</h1></body></html>`,
}
```

### 4. JSX / TSX

Name the file `*.ht.jsx` or `*.ht.tsx` and return JSX — it is rendered
to **static HTML** at build time with `react-dom/server`:

```tsx
// src/index.ht.tsx
export default function Home() {
  return (
    <html lang="en">
      <head><title>My site</title></head>
      <body><h1>Hello from TSX</h1></body>
    </html>
  )
}
```

JSX pages require `react` and `react-dom` in your project (they are
optional peer dependencies — string-based pages don't need them).
Since output is static, event-handler props like `onClick` won't do
anything in the browser; the dev server warns you if it finds any.

### 5. javascript-to-html

Prefer composable functions over template strings? The companion
library [javascript-to-html](https://www.npmjs.com/package/javascript-to-html)
works great:

```js
import { html, head, title, body, h1 } from 'javascript-to-html'

export default () =>
  html({ lang: 'en' },
    head(title('My website')),
    body(h1('Hello world'))
  )
```

> If a page's output starts with `<html>`, `<!DOCTYPE html>` is
> prepended automatically.

### Render context

Every page function receives one argument:

| Property | Type | Description |
|----------|------|-------------|
| `params` | `Record<string, string \| string[]>` | Route params for this page |
| `data`   | `unknown` | Whatever your `data()` returned |
| `page`   | `object` | Route metadata (`routePath`, `relativePath`, ...) |
| `dev`    | `boolean` | `true` in the dev server, `false` at build |

---

## Routing

Routes come straight from the filesystem:

| Feature | File | URL |
|---------|------|-----|
| Static routes | `index.ht.js` | `/` |
| Nested routes | `blog/index.ht.js` | `/blog` |
| Dynamic routes | `blog/[slug].ht.js` | `/blog/my-post` |
| Multiple params | `blog/[year]/[slug].ht.js` | `/blog/2026/my-post` |
| Catch-all | `docs/[...path].ht.js` | `/docs/api/auth/login` |
| Optional catch-all | `docs/[...path]?.ht.js` | `/docs` and `/docs/anything/below` |
| Index routes | `products/[id]/index.ht.js` | `/products/iphone-18` |
| Route groups | `(admin)/users.ht.js` | `/users` |

More specific routes always win: static segments beat dynamic ones,
dynamic beat catch-alls. Two files generating the same URL is a build
error, not a silent overwrite.

### Static params

Dynamic routes declare their pages by exporting `generateStaticParams`:

```js
// src/blog/[slug].ht.js
export function generateStaticParams() {
  return [
    { slug: 'hello-world' },
    { slug: 'my-first-post' },
  ]
}

export default ({ params }) => `
  <html><body><h1>${params.slug}</h1></body></html>
`
```

Values can be strings, numbers, or booleans — they are stringified and
URL-encoded for you. Catch-all params accept arrays (`{ path: ['a', 'b'] }`)
or slash-separated strings (`{ path: 'a/b' }`).

A dynamic page that generates zero routes prints a warning so it can't
silently vanish from your site.

---

## Data loading

Export a `data()` function and its result appears as `ctx.data` in your
render function. It runs at build time (and per-request in dev):

```js
export async function data({ params, dev }) {
  const res = await fetch(`https://api.example.com/posts/${params.slug}`)
  return await res.json()
}

export default ({ data }) => `
  <html><body>
    <h1>${data.title}</h1>
    ${data.body}
  </body></html>
`
```

### fetchWithCache

Building 500 pages against the same API? Cache the responses:

```js
import { fetchWithCache } from 'sitelo'

export async function data({ params }) {
  const res = await fetchWithCache(
    `https://api.example.com/posts/${params.slug}`,
    { /* standard fetch options */ },
    { maxAge: 3600 }
  )
  return { post: await res.json() }
}
```

| Option | Description |
|--------|-------------|
| `maxAge` | Cache TTL in seconds (default: `3600`) |
| `cacheKey` | Custom cache key (default: hash of URL + method + headers + body) |
| `forceRefresh` | Bypass the cache and fetch fresh |
| `cache` | `'auto'` \| `'memory'` \| `'fs'` \| `'none'` |

Cache modes:

- **`auto`** (default) — memory in dev, filesystem in production builds
- **`memory`** — in-process, cleared when the process exits
- **`fs`** — persisted in `node_modules/.cache/sitelo/fetch/`
- **`none`** — always fetch

Only `GET` requests are cached by default (pass a `cacheKey` to cache
other methods), and error responses are never cached — a flaky API
during one build won't poison the next one.

---

## TypeScript & typed params

Pages can be written in TypeScript (`.ht.ts` / `.ht.tsx`) with zero
configuration.

Helper functions give your page modules full type inference:

```ts
// src/blog/[slug].ht.ts
import { definePageModule } from 'sitelo/page'

export default definePageModule({
  generateStaticParams: () => [{ slug: 'hello' }],
  data: ({ params }) => ({ title: params.slug }),
  render: ({ data }) => `<html><body><h1>${data.title}</h1></body></html>`,
})
```

Individual helpers (`definePage`, `defineData`, `defineStaticParams`)
are also exported. At build time this import is transparently swapped
for a **per-route generated module** whose `PageParams` are inferred
from the filename: `[slug]` → `{ slug: string }`, `[...path]` →
`{ path: string[] }`, `[...path]?` → `{ path?: string[] }`.

Matching type declarations are generated into
`.sitelo/types/` whenever the dev server or a build
runs — add that folder to `.gitignore`.

---

## Assets & styling

Reference assets from your HTML with root-relative URLs and the plugin
handles the rest:

```js
export default () => `
  <html>
    <head>
      <link rel="stylesheet" href="/styles.css">
      <script type="module" src="/main.js"></script>
    </head>
    <body>...</body>
  </html>
`
```

At build time:

- **Referenced JS / TS / CSS is bundled** with esbuild — imports are
  inlined, output is minified, and `.ts` files compile to `.js`.
- **Unreferenced code files are not emitted.** A helper like
  `src/lib/api.ts` that you only import from `data()` stays out of
  `dist/` — server-only code (and its secrets) never ships by accident.
- **Everything else is copied** (images, fonts, videos, ...), so CSS
  `url()` references keep working.
- **`public/` behaves like normal Vite** — copied verbatim.

In dev, the same URLs are served through Vite's transform pipeline, so
TypeScript and CSS work identically without a build.

### Missing-asset validation

Every generated page is checked: a `<script src="/x.js">` or stylesheet
`href` pointing at a file that exists in neither `src/` nor `public/`
**fails the build** with the exact paths that were checked. Prefer a
warning instead?

```js
htmlPages({ missingAssets: 'warn' })
```

---

## Dev server

`vite dev` gives you the real site, not an approximation:

- Pages render **on request** through Vite's SSR module runner — edit a
  page, its `data()`, or any imported module and reload.
- **Dynamic routes render on demand.** Visit `/blog/anything` and
  `blog/[slug].ht.js` renders with `params.slug = 'anything'` — no need
  to list every param in `generateStaticParams` while developing.
  (`vite build` still only emits the pages you list there.)
- File changes inside your pages directory trigger an automatic
  **full-reload** in the browser.
- Errors show a **source-mapped code frame** in the terminal pointing
  at the exact line in your page — the server stays alive while you fix it.

```
── PAGE RELOAD ERROR ───────────────────── src/index.ht.js:6:20

ReferenceError: title is not defined

> 6 │     head(title('My website')),
    │          ^

Fix the error and save again.
Watching for file changes...
```

---

## Generated extras

### 404 page

Create `src/404.ht.js` and it's emitted as `dist/404.html` (the
convention GitHub Pages, Netlify, and Cloudflare Pages all understand).
No 404 page? A clean default is generated.

### Sitemap

Set your site URL and `dist/sitemap.xml` is generated from all static
routes, correctly escaped:

```js
htmlPages({ site: 'https://example.com' })
```

### RSS feed

```js
htmlPages({
  rss: {
    site: 'https://example.com',
    title: 'My Blog',
    description: 'Latest posts',
    routePrefix: '/blog',   // which routes become feed items
  }
})
```

Produces `dist/rss.xml` with an item for every page under `routePrefix`.

---

## Plugin options

```js
htmlPages({
  pagesDir: 'src',
  cleanUrls: true,
  site: 'https://example.com',
  missingAssets: 'error',
  debug: false,
})
```

| Option | Default | Description |
|--------|---------|-------------|
| `pagesDir` | `'src'` | Directory containing pages and assets |
| `pageExtensions` | `['.ht.js', '.html.js', ...]` | Which file suffixes are pages |
| `include` | derived from `pagesDir` | Custom glob(s) for page discovery |
| `exclude` | `[]` | Glob(s) to exclude from discovery |
| `root` | Vite root | Override the project root |
| `cleanUrls` | `true` | `/about/index.html` (`/about`) instead of `/about.html` |
| `site` | — | Base URL; enables `sitemap.xml` |
| `rss` | — | RSS config (`site`, `title`, `description`, `routePrefix`) |
| `missingAssets` | `'error'` | `'error'` or `'warn'` for broken asset references |
| `mapOutputPath` | — | `(page) => string` to customize output filenames |
| `renderConcurrency` | `8` | Pages rendered in parallel |
| `renderBatchSize` | `max(concurrency, 32)` | Pages per render batch |
| `debug` | `false` | Verbose logging of discovery, routing, and emission |

### Performance

Large sites can raise the parallelism:

```js
htmlPages({
  renderConcurrency: 16,
  renderBatchSize: 128,
})
```

---

## Comparison

| Tool | What it is |
|------|------------|
| Astro | Component-based SSG with its own compiler and islands |
| Next.js | Full React framework with SSR/ISR |
| Eleventy | Template-language SSG (Nunjucks, Liquid, ...) |
| **sitelo** | **Functions returning HTML, powered by plain Vite** |

If you want components, hydration, and a framework — use a framework.
If you want HTML files out of JavaScript functions with the Vite dev
experience, this is the smallest tool that does the whole job.

## Good fits

- Marketing and landing pages
- Blogs and documentation sites
- HTML-first projects with a sprinkle of JS
- API-driven static sites (with `fetchWithCache`)
- Any site where "view source" should show exactly what you wrote

---

## License

MIT
