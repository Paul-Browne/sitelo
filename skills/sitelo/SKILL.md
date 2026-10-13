---
name: sitelo
description: Build and maintain static sites with sitelo, the Vite-powered static site generator whose pages are JavaScript or TypeScript functions that return HTML. Use when a project depends on `sitelo`, has `*.ht.js` / `*.ht.ts` / `*.ht.jsx` / `*.ht.tsx` pages or a `sitelo.config.js`, or when the user asks to create, route, load data into, configure, optimize images for, add server islands to, audit, or deploy a sitelo site.
license: MIT
---

# sitelo

sitelo turns modules that return HTML strings into a static site. It has
file-based routing, build-time data loading, an asset pipeline, and a Vite
dev server. Nothing ships to the browser unless a page links a script.

It is **not** React, Next.js, Astro or Eleventy. Do not invent
`getStaticProps`, `_app`, `layout.ht.js`, hydration, client components or a
template language. A page is a function that returns a string, and a layout
is a function you call.

## Before writing code

1. Read `package.json` for the sitelo version, and `sitelo.config.js` for
   `pagesDir` (default `src`) and which features are on.
2. Open two or three existing pages. Match how they write markup (template
   literals, [javascript-to-html](https://ht.js.org), or JSX) and reuse the
   layout helpers they import, usually from `src/lib/`.
3. If the pages import from `sitelo/ui`, also use the **sitelo-ui** skill.

## Commands

| Command | Does |
| --- | --- |
| `sitelo` (or `sitelo dev`) | Dev server. Pages render on request, any dynamic param works |
| `sitelo build` | Writes the static site to `dist/` |
| `sitelo preview` | Serves `dist/` (and server islands) like a static host would |
| `sitelo lighthouse` | Audits the built site (needs the `lighthouse` peer) |

Useful flags: `--root <dir>`, `--base /repo/`, `--outDir`, `--port`,
`--host`, `--logLevel silent`. Install with `npm install -D sitelo`; Node
20.19+ or 22.12+. Vite comes bundled, so do not add `vite` as a dependency.

## Pages

A page is any file under `pagesDir` ending in `.ht.js`, `.html.js`,
`.ht.ts`, `.html.ts`, `.ht.jsx`, `.html.jsx`, `.ht.tsx` or `.html.tsx`.
Every other file is an asset or a plain module. The default export can take
any of these forms:

```js
// 1. A function returning HTML (the usual form)
export default ({ params, data, page, dev }) => `<html><body><h1>Hi</h1></body></html>`

// 2. A string
export default `<html><body><h1>Static</h1></body></html>`

// 3. A structured module, with everything in one object
export default {
  generateStaticParams: () => [{ slug: 'hello' }],
  data: ({ params }) => ({ title: params.slug }),
  render: ({ data }) => `<html><body><h1>${data.title}</h1></body></html>`,
}
```

In form 1, `data` and `generateStaticParams` are named exports beside the
default.

- Output that starts with `<html` gets `<!DOCTYPE html>` prepended.
- The render context is `{ params, data, page, dev }`. `page` holds route
  metadata (`routePath`, `relativePath`) and `dev` is `true` only in the
  dev server.
- **JSX/TSX pages** (`*.ht.jsx`, `*.ht.tsx`) are rendered once, to static
  HTML, with `react-dom/server`, so the project needs `react` and
  `react-dom`. No React runtime ships. `onClick`, hooks, `window` and
  `document` do nothing. For interactivity use a client script or a server
  island.
- **javascript-to-html** (`import { html, head, body, h1 } from 'javascript-to-html'`)
  is the recommended way to build markup from functions:
  `html({ lang: 'en' }, head(title('Hi')), body(h1('Hi')))`.

### Escape what you did not write

Template literals and element children are inserted as raw HTML, both in
javascript-to-html and in `sitelo/ui`. Only attribute values are escaped.
Escape any text from an API, CMS, JSON file, query or island props before it
goes into a child position:

```js
// src/lib/escape.js
export const escapeHtml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
```

Leave HTML you deliberately render alone, such as a CMS body or Markdown
output.

### Layouts

There is no layout convention. Write a function, put it in `src/lib/`, and
call it from every page:

```js
// src/lib/layout.js (not a page: no .ht.js, and never emitted unless a page links it)
import { escapeHtml } from './escape.js'

export const layout = ({ title, children }) => `
  <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>${escapeHtml(title)}</title>
      <link rel="stylesheet" href="/styles.css">
    </head>
    <body>${children}</body>
  </html>`
```

## Routing

| File | URL |
| --- | --- |
| `index.ht.js` | `/` |
| `about.ht.js` | `/about` |
| `blog/index.ht.js` | `/blog` |
| `blog/[slug].ht.js` | `/blog/:slug` |
| `blog/[year]/[slug].ht.js` | `/blog/2026/my-post` |
| `docs/[...path].ht.js` | `/docs/a/b/c` (catch-all, `params.path` is an array) |
| `docs/[...path]?.ht.js` | `/docs` as well as `/docs/a/b` (optional catch-all) |
| `(admin)/users.ht.js` | `/users` (a route group, the folder name is dropped) |
| `404.ht.js` | `dist/404.html` (a default is generated when it is missing) |

Static segments beat dynamic ones, and dynamic ones beat catch-alls. Two
files producing the same URL is a build error.

A dynamic route must export `generateStaticParams` for the build to emit
anything:

```js
// src/blog/[slug].ht.js
export function generateStaticParams() {
  return [{ slug: 'hello-world' }, { slug: 'second-post' }]
}

export default ({ params }) => `<html><body><h1>${params.slug}</h1></body></html>`
```

Values can be strings, numbers or booleans. Catch-alls take an array
(`{ path: ['a', 'b'] }`) or `'a/b'`. **The dev server renders any param
whether it is listed or not**, so a page that works in dev can still be
missing from `dist/`. A dynamic route that yields zero params gets a build
warning. Check the build, not just dev.

`cleanUrls` (on by default) writes `about/index.html`. Internal links are
root-relative (`/about`), and on a site built with `--base /repo/` they
must carry the base.

## Data

`data()` runs at build time, and per request in dev. Its return value
becomes `ctx.data`:

```js
import { fetchWithCache } from 'sitelo'
import { readJsonCollection } from 'sitelo/data'

export async function data({ params, dev }) {
  const res = await fetchWithCache(`https://api.example.com/posts/${params.slug}`)
  return res.json()
}

// or, from JSON files in the repo
const posts = () => readJsonCollection('data/posts', { sort: '-date' })
```

`fetchWithCache` caches GET responses: in memory in dev, on disk during a
build. `readJson` / `readJsonCollection` read local JSON, and relative paths
resolve from the project root. Options and caching rules are in
[references/data.md](references/data.md).

## TypeScript

`.ht.ts` and `.ht.tsx` need no config. For typed params, use the helpers in
`sitelo/page`:

```ts
// src/blog/[slug].ht.ts
import { definePageModule } from 'sitelo/page'

export default definePageModule({
  generateStaticParams: () => [{ slug: 'hello' }],
  data: ({ params }) => ({ title: params.slug }), // params: { slug: string }
  render: ({ data }) => `<h1>${data.title}</h1>`,
})
```

`definePage`, `defineData` and `defineStaticParams` also exist. Param types
come from the filename: `[slug]` gives `string`, `[...path]` gives
`string[]`, and `[...path]?` an optional `string[]`. Declarations are
generated into `.sitelo/types/`. Add `.sitelo/` to `.gitignore`.

## Assets

Reference assets from HTML with root-relative URLs, mapped from `pagesDir`:

```html
<link rel="stylesheet" href="/styles.css">         <!-- src/styles.css -->
<script type="module" src="/main.js"></script>      <!-- src/main.js -->
<script type="module" src="/app.ts"></script>       <!-- src/app.ts -->
```

- JS, TS and CSS that a page references are bundled and minified. Their
  imports are inlined, so npm packages work in client scripts.
- Link a TypeScript entry by its source name, `/app.ts`. The dev server
  serves it as is; the build emits `app.js` and rewrites the page's URL to
  match. Linking `/app.js` for `src/app.ts` fails the build.
- Relative URLs resolve against the page's own URL: `href="styles.css"`
  on `/blog/hello/` asks for `/blog/hello/styles.css`. Stay root-relative.
- **Code no page references is never emitted.** Modules that only `data()`
  or an island imports stay on the server, along with any secrets in them.
  Never link a script that contains secrets.
- Images, fonts and other files are copied. `public/` is copied verbatim.
- A `<script src>` or stylesheet `href` that matches no file fails the
  build (`missingAssets: 'warn'` downgrades it).

## Configuration

`sitelo.config.js` (or `.mjs`) is optional:

```js
export default {
  site: 'https://example.com',      // sitemap.xml
  rss: { site: 'https://example.com', title: 'Blog', description: 'Posts', routePrefix: '/blog' },
  images: true,                     // needs `sharp`
  pagefind: true,                   // needs `pagefind`
  linkCheck: 'error',               // dead internal links fail the build
  vite: { server: { port: 8888 } }, // any Vite config goes under `vite`
}
```

An existing `vite.config.js` is still loaded and merged. If it registers
the plugin itself (`import sitelo from 'sitelo'`), put the plugin options
there and not in `sitelo.config.js` as well. Doing both is an error. The
full option list is in [references/configuration.md](references/configuration.md).

## Feature references

Read the reference before you work on that feature:

| Task | Read |
| --- | --- |
| `data()`, `fetchWithCache`, `readJson`, `readJsonCollection` | [references/data.md](references/data.md) |
| Every config option; sitemap, RSS, Pagefind, link checking, build report, dev toolbar, knip | [references/configuration.md](references/configuration.md) |
| `images: true`, `srcset`, `?w=400&h=400` thumbnails, `data-no-optimize` | [references/images.md](references/images.md) |
| Server islands: request-time regions, `island()`, `mountIslands()`, production handlers, signed props | [references/islands.md](references/islands.md) |
| `sitelo lighthouse`, score thresholds, CI | [references/lighthouse.md](references/lighthouse.md) |
| Hosting on Netlify, Vercel, Cloudflare, GitHub Pages, containers or your own server | [references/deployment.md](references/deployment.md) |
| Components: buttons, cards, forms, modals, theming, icons | the **sitelo-ui** skill |

## Mistakes to avoid

- Adding React, a router or a hydration layer to "make it interactive".
  Link a small client script instead, or use a server island.
- Writing a `layout.ht.js` and expecting it to wrap the other pages. It
  becomes a page at `/layout`. Layouts belong in `src/lib/`.
- Testing a dynamic route only in dev and forgetting `generateStaticParams`.
- Interpolating fetched strings into HTML without escaping them.
- Linking an asset with a relative path from a nested page (`styles.css`
  on `/blog/post`). The build does not catch it, and the browser asks for
  `/blog/post/styles.css`. Use `/styles.css`.
- Running `vite build` without the plugin registered. Use `sitelo build`.
- Turning on `images`, `pagefind` or `lighthouse` without installing the
  optional peer (`sharp`, `pagefind`, `lighthouse`).

## Verify

After changing pages, run `sitelo build`. It fails on missing assets and
route conflicts, and it warns about empty dynamic routes and, when
`linkCheck` is on, dead links. Read the build report for unexpected sizes.
Then run `sitelo preview` and request the changed URLs. For a quick look
during development, `sitelo` renders any page on request.

## Further docs

- https://sitelo.dev/llms.txt is a compact API summary.
- Every docs page has a Markdown copy at the same URL plus `.md`, for
  example https://sitelo.dev/docs/routing.md.
  https://sitelo.dev/llms-full.txt is all of them in one file.
- https://github.com/Paul-Browne/sitelo/tree/main/examples has runnable
  sites: `basic`, `blog`, `json`, `islands`, `todo`, `ui` and `wordpress`.
