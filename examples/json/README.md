# Local JSON as data with sitelo

A product catalogue built entirely from JSON files in the repo — no API, no
database, no client-side JavaScript.

## Run

```bash
npm install
npm run dev     # live preview
npm run build   # static site + sitemap.xml in dist/
```

## What's inside

- `data/site.json` — one object, read with `readJson`
- `data/products/*.json` — one file per product; `readJsonCollection` slugs each
  entry by its filename, so `aeron-chair.json` becomes `/products/aeron-chair`
- `data/categories.json` — one file holding an object keyed by slug, the third
  shape `readJsonCollection` accepts
- `src/lib/catalogue.js` — thin wrappers around `sitelo/data` (server-only;
  never shipped to the browser)
- `src/index.ht.js` — categories and every product, sorted by name
- `src/products/[slug].ht.js` — one static page per product JSON
- `src/categories/[slug].ht.js` — one page per category, its products cheapest
  first via `sort: 'price'`

Data lives outside `src/`, so sitelo never treats it as pages or assets.

## Editing

`sitelo` watches the JSON files pages actually read: change a price in
`data/products/aeron-chair.json` and the open page reloads. Adding
`data/products/new-thing.json` adds `/products/new-thing` to the next build,
with no route to register.

Duplicate slugs, missing files, and malformed JSON fail the build with the
offending path named.

Full walkthrough: [sitelo.dev/examples/json](https://sitelo.dev/examples/json).
