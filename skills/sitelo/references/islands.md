# Server islands

An island is a region of a static page that the server renders at request
time: fresh comments, stock levels, a signed-in greeting. The build ships a
fallback, and a small client loader swaps in the server's HTML.

## 1. Write the island

Islands live in `src/islands/<name>.js` (or `.mjs` / `.ts`). They are
fragments, so do **not** name them `.ht.js`. The default export receives
`{ name, props, request }` and returns an HTML string:

```js
// src/islands/comments.js
import { escapeHtml } from '../lib/escape.js'

export default async function comments({ props, request }) {
  const postId = typeof props.postId === 'string' ? props.postId : ''
  if (!/^[a-z0-9-]+$/.test(postId)) return '<p>No comments.</p>'

  const list = await loadComments(postId) // a server-only module: DB, API key, etc.
  return `<ul>${list.map((c) => `<li>${escapeHtml(c.text)}</li>`).join('')}</ul>`
}
```

Island modules and their imports are never emitted to `dist/`.

## 2. Place it in a page

```js
// src/blog/[slug].ht.js
import { island } from 'sitelo/islands'

export default ({ params }) => `
  <html><body>
    <article>…</article>
    ${island('comments', { postId: params.slug }, '<p>Loading comments…</p>', { when: 'visible' })}
    <script type="module" src="/islands.js"></script>
  </body></html>`
```

The signature is `island(name, props, fallbackHtml, { when, rootMargin })`.

| `when` | Loads |
| --- | --- |
| `'load'` (default) | Immediately, in parallel with the page's other islands |
| `'idle'` | On `requestIdleCallback` |
| `'visible'` | When it scrolls into view. `rootMargin` defaults to `'200px'` |

## 3. Add the client loader

```js
// src/islands.js
import { mountIslands } from 'sitelo/islands/client'

mountIslands() // options: { endpoint, root, timeout: 10000, rootMargin, onError }
```

A failed or timed-out island keeps its fallback and gets
`data-sitelo-island-state="error"`.

## Dev and preview

`sitelo` and `sitelo preview` both serve `/_sitelo/islands/<name>` from
`src/islands/` with nothing to configure. `preview` loads native `.js` and
`.mjs` only. TypeScript islands work in dev.

## Production

The static host serves the pages. Something that runs server code must
answer `/_sitelo/islands/*`. Without it the fallback stays, so the page
still works.

Fetch-style (serverless, edge, Bun, Deno, Workers):

```js
import { fileURLToPath } from 'node:url'
import { createIslandsHandler, createIslandsFromDirectory } from 'sitelo/islands/server'

const handle = createIslandsHandler({
  islands: createIslandsFromDirectory(fileURLToPath(new URL('./src/islands', import.meta.url))),
  // endpoint: '/_sitelo/islands', cacheControl: 'no-store', secret: process.env.SITELO_ISLANDS_SECRET
})

export default { fetch: async (request) => (await handle(request)) ?? new Response('Not found', { status: 404 }) }
```

`handle(request)` returns `null` for requests outside the endpoint. Node
`http` and Express use `createIslandsNodeHandler(options)`, with the same
options and a `(req, res, next)` signature. `islands` can also be an
explicit map, `{ comments: () => import('./src/islands/comments.js') }`,
which bundlers trace more reliably than a directory scan.

On Netlify or Vercel, rewrite `/_sitelo/islands/*` to the function and
normalize the path back. `examples/islands` in the sitelo repo has working
`netlify.toml` + `netlify/functions/islands.mjs`, `vercel.json` +
`api/islands/[...path].js`, and a plain Node `server.js`. If the endpoint
lives on another origin or path, pass it to both
`mountIslands({ endpoint })` and the handler's `endpoint`.

## Props are untrusted

Props are JSON in the page, sent back in the query string, and anyone can
edit them. Validate them like query parameters, keep them small, and never
put secrets in them. When props select data that only some viewers should
see, sign them:

```bash
SITELO_ISLANDS_SECRET=$(openssl rand -hex 32) sitelo build
```

The build signs each placeholder with an HMAC of the island name and its
props, and the handler rejects anything else with a 403. Give dev, preview
and the production handler the same secret, either through the environment
variable or `createIslandsHandler({ secret })`. You can also call
`configureIslands({ secret })` from `sitelo/islands`, in a module your pages
import. Signing proves the props came from your build. It does not hide
them.

Docs: https://sitelo.dev/docs/islands.md
