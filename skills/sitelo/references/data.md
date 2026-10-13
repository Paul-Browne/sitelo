# Data loading

## `data()`

Export `data` from a page, or put it in a structured module. It receives
`{ params, dev }`, and what it returns becomes `ctx.data` in the render
function. It runs once per generated page at build time, and on every
request in the dev server.

```js
export async function data({ params, dev }) {
  const res = await fetch(`https://api.example.com/posts/${params.slug}`)
  if (!res.ok) throw new Error(`post ${params.slug}: ${res.status}`)
  return res.json()
}

export default ({ data }) => `<html><body><h1>${data.title}</h1>${data.body}</body></html>`
```

Throwing fails the build and names the page, which is usually better than
rendering an empty page. Modules that only `data()` imports never reach
`dist/`, so API keys can live there. Read them from `process.env`.

## `fetchWithCache` (from `sitelo`)

```js
import { fetchWithCache } from 'sitelo'

const res = await fetchWithCache(url, { /* fetch init */ }, { maxAge: 3600 })
const json = await res.json()
```

| Option | Default | Meaning |
| --- | --- | --- |
| `maxAge` | `3600` | Cache TTL in seconds |
| `cacheKey` | hash of URL, method, headers and body | Custom key. Needed to cache anything other than GET |
| `forceRefresh` | `false` | Skip the cache and fetch again |
| `cache` | `'auto'` | `'auto'` uses memory in dev and the filesystem in builds. Also `'memory'`, `'fs'` (`node_modules/.cache/sitelo/fetch/`) or `'none'` |

Only GET is cached by default. Error responses are never cached.

A common pattern lists the pages in `generateStaticParams` and fetches each
one in `data()`. Both go through `fetchWithCache`, so a 500-page build makes
one request per URL.

## Local JSON (`sitelo/data`)

```js
import { readJson, readJsonCollection } from 'sitelo/data'

const site = await readJson('data/site.json')
const posts = await readJsonCollection('data/posts', { sort: '-date' })
```

`readJsonCollection(source, options)` returns an array of entries, each with
a `slug`. The source can be:

- a **directory** of `.json` files, one per entry, slugged by filename
  (`data/posts/hello.json` gives `slug: 'hello'`);
- a **file** holding an array of entries (each slugged by its own `slug` or
  `id`);
- a **file** holding an object keyed by slug.

| Option | Meaning |
| --- | --- |
| `slug` | A field name, or `(entry) => string`, to slug by |
| `sort` | A field name (`'date'` ascending, `'-date'` descending) or a compare function |
| `recursive` | Also read subdirectories, slugged by path (`guide/intro`) |
| `root` | The directory relative paths resolve from (default: the project root) |
| `cache` | `'auto'`, `'memory'` or `'none'` |

- Relative paths resolve from the **project root**, not from the page file.
  To anchor at the module, use `new URL('../data/', import.meta.url)`.
- Reads are memoized per file. In dev they are revalidated by mtime, and
  editing a JSON file reloads the browser.
- Each call returns a fresh array, so sorting it is safe. The entry objects
  are shared, so copy one before mutating it.
- A duplicate slug, a missing file and malformed JSON are all build errors.

### Collection page pattern

```js
// src/blog/[slug].ht.js
import { readJsonCollection } from 'sitelo/data'

const posts = () => readJsonCollection('data/posts', { sort: '-date' })

export async function generateStaticParams() {
  return (await posts()).map(({ slug }) => ({ slug }))
}

export async function data({ params }) {
  return (await posts()).find((post) => post.slug === params.slug)
}

export default ({ data }) => `<html><body><h1>${data.title}</h1>${data.body}</body></html>`
```

For an index page, call `posts()` in its own `data()` and render the list.
`examples/json` in the sitelo repo shows all three source shapes.

## Markdown content

sitelo has no Markdown loader. Read files with `node:fs` in `data()`, render
them with any Markdown library (`marked`, `markdown-it`) and return the
HTML. The library only runs at build time, so none of it ships to the
browser. `examples/blog` in the sitelo repo does this.

Docs: https://sitelo.dev/docs/data.md
