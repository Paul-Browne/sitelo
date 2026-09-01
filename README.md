# sitelo

[![npm version](https://img.shields.io/npm/v/sitelo.svg)](https://www.npmjs.com/package/sitelo)
[![npm downloads](https://img.shields.io/npm/dm/sitelo.svg)](https://www.npmjs.com/package/sitelo)
[![license](https://img.shields.io/npm/l/sitelo.svg)](LICENSE)
[![vite](https://img.shields.io/badge/vite-plugin-646CFF?logo=vite&logoColor=white)](https://vite.dev)

**Static site generation for Vite — no framework, no components, no magic.**

Write JavaScript (or TypeScript, or JSX) functions that return HTML.
Get a complete static site with file-based routing, dynamic pages, data
loading, an asset pipeline, sitemap, RSS, Pagefind search, and a live
dev server.

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
sitelo build
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
- **Link checking** — dead internal `<a href>` links reported against the real output
- **Lighthouse audits** — score the real build against per-category thresholds, on demand or in CI
- **Image optimization** — `<img>` tags get resized, converted, and turned into a `srcset`, in dev and in the build
- **Real dev server** — pages render on request (dynamic routes included, no `generateStaticParams` needed in dev) with full reload and readable error frames
- **Server islands** — static pages with regions rendered on the server at
  request time, loaded eagerly, on idle, or on scroll, with optional
  signed props
- **Parallel static generation** — renders large sites concurrently
- **`404.html`, `sitemap.xml`, RSS, Pagefind** — generated for you

---

## Why this exists

Modern static site tools are powerful, but they bring frameworks,
component systems, hydration strategies, and opinionated conventions.

Sometimes you just want to:

- write HTML
- organize pages in folders
- run `sitelo build`

`sitelo` exists for exactly that. Pages are plain
functions that return a string of HTML. No runtime ships to the
browser unless *you* add a script.

---

## Installation

```bash
npm install -D sitelo
```

Requires **Node 20.19+** (or 22.12+). Vite is bundled — you don't install
it separately.

Create pages in `src/` and run:

```bash
sitelo             # dev server with live rendering
sitelo build       # static site in dist/
sitelo preview     # preview the production build
sitelo lighthouse  # audit the production build
```

### Configuration (optional)

Add a `sitelo.config.js` for plugin options and optional Vite settings:

```js
// sitelo.config.js
export default {
  site: 'https://example.com',
  rss: {
    site: 'https://example.com',
    title: 'My Blog',
    description: 'Latest posts',
    routePrefix: '/blog',
  },

  // any Vite config goes under `vite`
  vite: {
    publicDir: 'static',
    build: {
      emptyOutDir: true,
      outDir: 'public',
    },
    server: {
      port: 8888,
    },
  },
}
```

No `vite.config.js` is required. If you already have one, sitelo still
auto-loads it and merges your settings. CLI flags (e.g. `--port`) override
both.

### Using with an existing Vite config

Prefer a separate Vite config file? You can still use `vite.config.js` —
either for Vite-only options (plugin stays auto-injected), or by registering
the plugin yourself:

```js
// vite.config.js — Vite options only; sitelo still injects the plugin
export default {
  publicDir: 'static',
  server: { port: 8888 },
}
```

```js
// vite.config.js — full control, including the plugin
import htmlPages from "sitelo"

export default {
  plugins: [htmlPages({
    site: 'https://example.com',
  })]
}
```

Then you can run `vite` / `vite build` if you prefer. If the plugin is already
in your Vite config, put plugin options there — not also in `sitelo.config.js`
(sitelo will error if both register plugin options).

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

This is build-time rendering only. React is designed for the browser —
mounting, hydration, events — and sitelo does not ship a React runtime
with your pages. It renders JSX to a static HTML string, writes the
file, and stops. Event-handler props like `onClick` won't do anything
in the browser (the dev server warns if it finds any); hooks and
`window`/`document` are not available as a client app would expect.
For interactivity, add a normal client script or a server island.

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
// sitelo.config.js
export default {
  missingAssets: 'warn',
}
```

### Internal link checking

Assets are checked against your source tree; **links** are checked
against what the build actually emitted. Turn it on:

```js
// sitelo.config.js
export default {
  linkCheck: true,          // 'warn' (default), 'error', or an options object
}
```

Every internal `<a href>` in `dist/` is resolved the way a static host
would resolve it, and anything with no page behind it is reported,
grouped by the page it appears on:

```
[sitelo] 3 broken internal links

  index.html
    ../escape           -> escapes the output directory
    /abuot              -> no such page
    /blog/missing-post  -> no such page
```

Because it runs against the output rather than the route table, it
accounts for `cleanUrls`, route groups, `mapOutputPath`, files copied
from `public/`, and pages generated by dynamic routes. It also runs after
image optimization and Pagefind, so it sees exactly what ships. A link is
valid when a real file answers it, tried in the order a static host
would:

| Link | Resolved against |
|------|------------------|
| `/about` | `about`, then `about/index.html`, then `about.html` |
| `/blog/` | `blog/index.html` — a trailing slash only ever means a directory index |
| `/` | `index.html` |

Relative links (`../about`) resolve against the page holding them, and
one that climbs out of the output directory is reported.

External links are never fetched. `https://`, protocol-relative `//`,
`mailto:`, `tel:` and friends are skipped, as are query strings
(`/about?utm=x` checks `/about`).

| Option | Default | Description |
|--------|---------|-------------|
| `mode` | `'warn'` | `'warn'` logs and continues; `'error'` fails the build |
| `exclude` | `[]` | Globs or RegExps of hrefs to skip |
| `checkFragments` | `false` | Also verify `#fragment` targets exist in the linked page |

```js
export default {
  linkCheck: {
    mode: 'error',                       // fail CI on a dead link
    checkFragments: true,
    exclude: ['/api/**', /^\/legacy\//],
  },
}
```

`checkFragments` is off by default because ids added by client-side
JavaScript aren't in the HTML, and would be reported as missing.

**On a site with a `base`**, a root-relative link that doesn't carry the
base (`/about` on a site served from `/repo/`) is reported: the browser
would leave your site entirely. Use `exclude` if that's deliberate.

---

## Image optimization

Point `<img>` at a big source image and let sitelo do the rest:

```js
// sitelo.config.js
export default {
  images: true,
}
```

```js
// src/index.ht.js
export default () => `<img src="/images/hero.png" alt="Sunrise">`
```

A 3000×2000 PNG becomes a resized, modern-format ladder, and the tag is
rewritten in place:

```html
<img src="/assets/img/hero.a1b2c3d4-1200.webp"
     alt="Sunrise"
     sizes="(max-width: 1200px) 100vw, 1200px"
     width="1200" height="800"
     loading="lazy" decoding="async"
     srcset="/assets/img/hero.9f8e7d6c-400.webp 400w,
             /assets/img/hero.5b4a3c2d-800.webp 800w,
             /assets/img/hero.a1b2c3d4-1200.webp 1200w">
```

Encoding is done by [sharp](https://sharp.pixelplumbing.com), an optional
peer dependency — install it alongside sitelo when you enable `images`:

```bash
npm install -D sharp     # or: pnpm add -D sharp / yarn add -D sharp
```

It stays out of the install for sites that don't optimize images. npm,
pnpm, Yarn (Classic and Berry, including Plug'n'Play) and Bun all work —
sitelo declares sharp as an optional peer dependency, so your copy is the
one it resolves.

### What it does

- **Resizes** to each configured width, and **never upscales**. A 600px
  source with `widths: [400, 800, 1200]` emits 400 and 600, nothing more.
- **Converts** to modern formats. One format gives you a plain
  `<img srcset>`; two or more wrap it in `<picture>` with a `<source>` per
  format and a fallback in the original format.
- **Adds `width`/`height`** so the page doesn't shift while images load,
  plus `loading="lazy"` and `decoding="async"`.
- **Works in dev too.** `sitelo dev` rewrites pages the same way and serves
  variants from the cache, so what you see is what you ship.
- **Caches by content hash** in `node_modules/.sitelo/images`. Rebuilds and
  dev share it, so nothing is encoded twice.

Images in both `src/` and `public/` are covered — the rewrite runs over the
built HTML, so it doesn't matter where the file came from.

### Options

```js
// sitelo.config.js
export default {
  images: {
    widths: [400, 800, 1200],
    formats: ['avif', 'webp'],
    quality: { avif: 55, webp: 78, jpeg: 82 },
    exclude: ['**/og/**'],
  },
}
```

| Option | Default | Description |
|--------|---------|-------------|
| `widths` | `[400, 800, 1200]` | Ladder of widths; the largest is also the cap |
| `formats` | `['webp']` | `avif`, `webp`, `jpeg`, `png`. 2+ formats → `<picture>` |
| `quality` | `{ avif: 55, webp: 78, jpeg: 82 }` | Per-format encoder quality |
| `sizes` | derived | `sizes` attribute; a `sizes` on the tag always wins |
| `dimensions` | `true` | Add `width`/`height` (completes whichever you left off) |
| `lazy` | `true` | Add `loading="lazy"` and `decoding="async"` |
| `exclude` | `[]` | Glob(s) or RegExp(s) of image URLs to leave alone |
| `assetsDir` | `'assets/img'` | Where variants are written inside `dist/` |
| `cacheDir` | `'node_modules/.sitelo/images'` | Shared dev/build encode cache |
| `remote` | `false` | Download and optimize `https://` images at build time |
| `prune` | `false` | Delete originals nothing references after rewriting |
| `dev` | `true` | Set `false` to serve untouched originals in dev |
| `concurrency` | CPUs − 1 (max 8); **1** when `remote: true` | Parallel encodes |

### Opting out

Tags that already carry a `srcset`, sit inside a `<picture>`, point at an
SVG, an animated GIF, or a remote URL (unless `remote: true`) are left
exactly as they are. For anything else, mark it:

```html
<img src="/images/exact.png" alt="Pixel art" data-no-optimize>
```

Social-card and favicon images live in `<meta>` and `<link>`, which this
never touches — they keep their fixed URL.

---

## Dev server

`sitelo dev` gives you the real site, not an approximation:

- Pages render **on request** through Vite's SSR module runner — edit a
  page, its `data()`, or any imported module and reload.
- **Dynamic routes render on demand.** Visit `/blog/anything` and
  `blog/[slug].ht.js` renders with `params.slug = 'anything'` — no need
  to list every param in `generateStaticParams` while developing.
  (`sitelo build` still only emits the pages you list there.)
- File changes inside your pages directory trigger an automatic
  **full-reload** in the browser.
- A small **dev toolbar** on every page shows the source file, params,
  and server-island count — plus a Desktop/Tablet/Mobile viewport preview
  (real iframe so CSS media queries apply), Copy debug info, and Docs.
  Disable with `devToolbar: false` in `sitelo.config.js`. Production
  builds never include it.
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

## Server islands

Keep the page static, but render marked regions **on the server at
request time** — fresh comments on a cached blog post, a stock badge on
a product page. An island is just another function that returns HTML.

**1. Write the island** — a fragment module under `src/islands/`
(plain `.js`/`.ts`, *not* `.ht.js` — islands are fragments, not pages):

```js
// src/islands/comments.js
export default async function comments({ props, request }) {
  const comments = await fetchComments(props.postId)
  return `<ul>${comments.map((c) => `<li>${c.text}</li>`).join('')}</ul>`
}
```

**2. Place it in a page** with `island()` — the build ships the fallback:

```js
// src/blog/[slug].ht.js
import { island } from 'sitelo/islands'

export default ({ params }) => `
  <html>
    <body>
      <article>…static content…</article>
      ${island('comments', { postId: params.slug }, '<p>Loading comments…</p>')}
      <script type="module" src="/islands.js"></script>
    </body>
  </html>
`
```

**3. Add the client loader** (bundled by the normal asset pipeline):

```js
// src/islands.js
import { mountIslands } from 'sitelo/islands/client'

mountIslands()
```

In **dev** and **preview** this already works — `sitelo` / `sitelo preview`
serve islands at `/_sitelo/islands/<name>` using the modules in
`src/islands/` (preview loads native `.js` / `.mjs`; TypeScript islands
work in `sitelo` via Vite).

In **production** the static host serves the page; you mount a tiny
handler wherever you run server code and it renders the same modules:

```js
// e.g. a Node server, or a serverless/edge function
import {
  createIslandsFromDirectory,
  createIslandsHandler,
} from 'sitelo/islands/server'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))

const handleIslands = createIslandsHandler({
  islands: createIslandsFromDirectory(path.join(root, 'src/islands')),
})

// Web Request → Response | null (null = not an island request)
export default { fetch: (request) => handleIslands(request) }
```

Plain Node http/express? Use `createIslandsNodeHandler(options)` —
same options, `(req, res, next)` signature. For Netlify / Vercel rewrite
stubs, see [`examples/islands`](./examples/islands).

### Loading strategies

By default every island fetches as soon as the page loads. A page with
eight islands then makes eight simultaneous requests during first paint.
Pass `when` to defer the ones that aren't immediately visible:

```js
// Load as soon as the page does — the default.
island('cart', { id }, '<p>…</p>')

// Wait for an idle callback: nice-to-have content that shouldn't
// compete with first paint.
island('recommendations', { id }, '<p>…</p>', { when: 'idle' })

// Wait until it scrolls into view.
island('comments', { postId }, '<p>Loading comments…</p>', {
  when: 'visible',
  rootMargin: '400px',   // start loading 400px early
})
```

| `when` | Loads |
|--------|-------|
| `'load'` (default) | Immediately, in parallel with every other island |
| `'idle'` | On `requestIdleCallback` (falls back to a timeout) |
| `'visible'` | When it scrolls into view, via IntersectionObserver |

`rootMargin` applies to `'visible'` only and defaults to `200px`. Set the
default for a whole page through `mountIslands({ rootMargin })`.

Islands also time out rather than spinning forever — 10s by default:

```js
mountIslands({ timeout: 5000 })   // or 0 to disable
```

`mountIslands()` resolves once the immediate islands have settled;
deferred ones load later on their own and are deliberately not awaited.
A failed or timed-out island keeps its fallback HTML and sets
`data-sitelo-island-state="error"`.

### Props are untrusted input

**Island props are client-supplied.** They are embedded in the page, sent
back on the request, and anyone can edit them before doing so:

```
GET /_sitelo/islands/profile?props={"userId":"someone-else"}
```

Treat the `props` your island receives exactly like a query parameter —
validate them, and never use them to look up data the viewer isn't
already entitled to see.

When props select privileged data, sign them. Set a secret and sitelo
signs each placeholder at build time and rejects anything else with a
403:

```bash
SITELO_ISLANDS_SECRET=$(openssl rand -hex 32) sitelo build
```

The same variable is read by `sitelo`, `sitelo preview`, and
`createIslandsHandler`, so dev, preview, and production all agree. Give
your production host the same secret. Prefer to set it in code?

```js
import { configureIslands } from 'sitelo/islands'

configureIslands({ secret: process.env.MY_SECRET })
```

Signatures are HMAC-SHA256 over the island name *and* its props, so a
signature issued for one island can't be replayed against another.
Signing proves the props came from your build — it does not hide them.
They are still visible in the HTML, so they must still be non-secret.

Without a secret, props are accepted as-is and validating them is
entirely your island module's job.

Notes:

- Island modules receive `{ name, props, request }` and must return an
  HTML string. Props are JSON, embedded in the placeholder and sent back
  on the request — keep them small and non-secret.
- Islands are **server-only**: unreferenced code under `src/` is never
  emitted to `dist/`, so island modules (and their imports) don't ship
  to the browser.
- No island endpoint in production? The fallback HTML simply stays —
  pages degrade gracefully.

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
// sitelo.config.js
export default {
  site: 'https://example.com',
}
```

### RSS feed

```js
// sitelo.config.js
export default {
  rss: {
    site: 'https://example.com',
    title: 'My Blog',
    description: 'Latest posts',
    routePrefix: '/blog',   // which routes become feed items
  },
}
```

Produces `dist/rss.xml` with an item for every page under `routePrefix`.

### Pagefind search

[Pagefind](https://pagefind.app) is an optional peer dependency — install
it when you enable search:

```bash
npm install -D pagefind  # or: pnpm add -D pagefind / yarn add -D pagefind
```

Then `sitelo build` indexes your site into `dist/pagefind/` (and syncs a
copy to `public/pagefind/` so the next `sitelo` / `sitelo preview` can
serve search without rebuilding):

```js
// sitelo.config.js
export default {
  pagefind: true,
}
```

Mark content with `data-pagefind-body`, add a mount point, and load the UI:

```html
<main data-pagefind-body>…</main>
<div id="search"></div>
```

```js
// src/main.js — after sitelo build has produced /pagefind/
const style = document.createElement('link')
style.rel = 'stylesheet'
style.href = '/pagefind/pagefind-ui.css'
document.head.appendChild(style)

await new Promise((resolve, reject) => {
  const script = document.createElement('script')
  script.src = '/pagefind/pagefind-ui.js'
  script.onload = resolve
  script.onerror = reject
  document.body.appendChild(script)
})

new PagefindUI({ element: '#search', showImages: false })
```

Gitignore `public/pagefind/`. Full walkthrough:
[sitelo.dev/docs/configuration#pagefind-search](https://sitelo.dev/docs/configuration#pagefind-search).

### Build report

`sitelo build` ends with a summary of what it actually produced:

```
[sitelo] build report

  pages    22 files  254.0 kB
  js        7 files  479.1 kB
  css       4 files   85.0 kB
  images    5 files  788.7 kB
  other   101 files  702.2 kB
  ───────────────────────────
  total   139 files   2.31 MB

  largest
    logo.png                           753.6 kB
    pagefind/pagefind-component-ui.js  175.5 kB
    pagefind/pagefind-ui.js            120.0 kB

  vite 161ms · images 35ms · pagefind 63ms · total 260ms
```

Vite's own table lists the modules it bundled; this covers the whole
output directory — files copied from `public/`, post-build image
variants, and generated extras included — so the totals are what you
actually ship. The phase timings make the post-build work visible:
a slow build is usually image encoding, not rendering.

Turn it off, or show more (or fewer) of the largest files:

```js
// sitelo.config.js
export default {
  buildReport: false,          // or { top: 10 }
}
```

`--logLevel silent` suppresses it as well.

---

## Lighthouse audits

[Lighthouse](https://github.com/GoogleChrome/lighthouse) is an optional
peer dependency — install it only if you want audits:

```bash
npm install -D lighthouse  # or: pnpm add -D lighthouse / yarn add -D lighthouse
```

Then audit the build you already have:

```bash
sitelo build
sitelo lighthouse
```

sitelo starts the same preview server `sitelo preview` uses, points a
headless Chrome at every page in `dist/`, and prints the scores:

```
[sitelo] lighthouse mobile - 3 pages

  page           perf  a11y  best   seo
  /                98   100   100   100
  /docs            95   100   100   100
  /docs/routing    97   100   100   100

[sitelo] lighthouse audited 3 pages in 31.4s
```

Pages are audited at the URL your site actually links — `/docs`, never
`dist/docs.html` — so `cleanUrls`, route groups, `mapOutputPath` and a
`base` are all accounted for, and islands answer exactly as they do in
`sitelo preview`.

### Thresholds

With no config, the audit is a report. Give it thresholds and it becomes
a check:

```js
// sitelo.config.js
export default {
  lighthouse: {
    exclude: ['404.html'],
    thresholds: {
      performance: 90,
      accessibility: 100,
      'best-practices': 95,
      seo: 100,
    },
  },
}
```

Anything under its threshold fails the command with a non-zero exit code,
grouped by page:

```
[sitelo] 2 lighthouse scores below threshold on 1 page

  /docs
    performance    78 < 90
    accessibility  93 < 100
```

Scores are written the way Lighthouse displays them (`0`–`100`); its own
`0`–`1` fractions work too. Use `mode: 'warn'` to log instead of fail.

### Options

| Option | Default | Description |
|--------|---------|-------------|
| `include` | `'**/*.html'` | Glob(s) or RegExps of pages to audit, relative to the output directory |
| `exclude` | `[]` | Glob(s) or RegExps to skip — `'404.html'` is the usual one |
| `categories` | all four | Any of `performance`, `accessibility`, `best-practices`, `seo` |
| `thresholds` | `{}` | Minimum score per category |
| `mode` | `'error'` | `'error'` fails the run; `'warn'` logs and continues |
| `formFactor` | `'mobile'` | `'desktop'` applies Lighthouse's desktop preset |
| `runs` | `1` | Runs per page; the reported score is the median |
| `output` | `false` | `true` for `.sitelo/lighthouse/`, or a directory path |
| `formats` | `['html']` | Report formats to write: `html`, `json`, `csv` |
| `headless` | `true` | `false` opens a visible Chrome — useful when a page misbehaves |
| `chromeFlags` | `[]` | Extra Chrome flags, e.g. `['--no-sandbox']` inside a container |
| `port` | — | Port for the preview server |
| `flags` | `{}` | Passed straight to Lighthouse (see below) |
| `config` | — | A full Lighthouse config object |
| `onBuild` | `false` | Also audit at the end of `sitelo build` |

### Lighthouse's own options

`flags` is the escape hatch: it is handed to Lighthouse untouched, so
anything its CLI accepts works here in camelCase.

```js
// sitelo.config.js
export default {
  lighthouse: {
    formFactor: 'desktop',
    flags: {
      throttlingMethod: 'provided',           // --throttling-method=provided
      maxWaitForLoad: 60_000,                 // --max-wait-for-load=60000
      blockedUrlPatterns: ['**/analytics.js'], // --blocked-url-patterns=…
      extraHeaders: { Cookie: 'preview=1' },
      logLevel: 'info',
    },
  },
}
```

Three flags stay sitelo's: `port` and `output` are plumbing, and
`onlyCategories` follows the `categories` option so the score table and
the audit can't drift apart. For anything bigger than flags — custom
audits, budgets, a different gatherer set — pass a whole Lighthouse
`config` object.

### Reports

`output` keeps Lighthouse's full report per page, mirroring the site's
structure:

```js
export default {
  lighthouse: {
    output: true,                // → .sitelo/lighthouse/
    formats: ['html', 'json'],
  },
}
```

```
.sitelo/lighthouse/
  index.report.html
  docs/routing.report.html
```

With `runs > 1` the saved report is the median run, so it matches the
score in the table.

### In CI, and in the build

`sitelo lighthouse` is a separate command because an audit costs a few
seconds of real browser time per page. To spend that on every build
anyway:

```js
export default {
  lighthouse: {
    onBuild: true,
    thresholds: { performance: 90 },
  },
}
```

It runs last — after image optimization, Pagefind and the link check — so
it measures exactly what ships, and its phase time shows up in the build
report.

Two things worth knowing before you gate a pipeline on this:

- **Lighthouse drives a real Chrome.** Install one on the runner (GitHub's
  `ubuntu-latest` already has it) or point `CHROME_PATH` at a binary.
  Containers usually need `chromeFlags: ['--no-sandbox']`.
- **Performance scores move between runs**, more so on a busy CI box.
  `runs: 3` medians the noise away; thresholds on `accessibility`, `seo`
  and `best-practices` are steady enough to pin at `100`.
- **Pages are audited one at a time**, through a single Chrome. Running
  them in parallel would compete for the CPU Lighthouse is measuring, so
  budget a few seconds per page.

---

## Plugin options

Set these in `sitelo.config.js` (or pass them to `htmlPages()` in a Vite
config):

```js
// sitelo.config.js
export default {
  pagesDir: 'src',
  cleanUrls: true,
  site: 'https://example.com',
  missingAssets: 'error',
  debug: false,
}
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
| `pagefind` | — | `true` or options object; indexes after `sitelo build` (CLI only). Requires the `pagefind` peer dependency |
| `images` | — | `true` or options object; optimizes images in dev and after `sitelo build` (CLI only). Requires the `sharp` peer dependency |
| `missingAssets` | `'error'` | `'error'` or `'warn'` for broken asset references |
| `linkCheck` | — | `true`, `'warn'`, `'error'`, or `{ mode, exclude, checkFragments }`; checks internal `<a href>` against the build (CLI only) |
| `lighthouse` | — | `true` or options object; audits the build via `sitelo lighthouse` (CLI only). Requires the `lighthouse` peer dependency |
| `mapOutputPath` | — | `(page) => string` to customize output filenames |
| `generatedTypesDir` | `'.sitelo/types'` | Where generated page helper `.d.ts` files are written |
| `displayName` | `'sitelo'` | Label used in console / overlay messages |
| `devToolbar` | `true` | Dev-only bottom toolbar (route, file, params, islands). Set `false` to hide |
| `devToolbarDocsUrl` | sitelo docs | Docs link in the toolbar |
| `renderConcurrency` | `8` | Pages rendered in parallel |
| `renderBatchSize` | `max(concurrency, 32)` | Pages per render batch |
| `buildReport` | `true` | Post-build summary. `false` to disable, or `{ top }` for how many large files to list (CLI only) |
| `debug` | `false` | Verbose logging of discovery, routing, and emission |

### Performance

Large sites can raise the parallelism:

```js
// sitelo.config.js
export default {
  renderConcurrency: 16,
  renderBatchSize: 128,
}
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

## Docs site

The documentation at [sitelo.dev](https://sitelo.dev) lives in
[`docs/`](docs/) and is itself built with sitelo +
[javascript-to-html](https://www.npmjs.com/package/javascript-to-html):

```bash
npm run docs:dev
npm run docs:build
```
