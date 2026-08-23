# Elisa kauppa → static with sitelo

A catalog clone of [elisa.fi/kauppa](https://elisa.fi/kauppa): rip
`/rest/products/devices`, generate category pages from `categories.js`,
and one product page per HANDSET group (color variants on the same URL).

Not a checkout, and not a pixel-perfect Elisa skin — real product data,
static HTML.

## Run locally

```bash
npm install
ELISA_LIMIT=20 npm run build   # smoke: 20 HANDSET groups
npm run preview
```

Full rip (large first fetch, ~40MB devices catalog):

```bash
npm run build
```

## What's inside

- `src/index.ht.js` — department home
- `src/laitteet/[...path].ht.js` — one page per category
- `src/tuote/[slug].ht.js` — HANDSET groups via `generateStaticParams`
- `src/lib/elisa.js` — cached `/rest/products/devices` rip, HANDSET grouping, category filters
- `src/js/product.js` — client variant picker (inline `import()`)
- `categories.js` — category id lists (Elisa taxonomy)

## Env

| Variable       | Default                   | Purpose                                            |
| -------------- | ------------------------- | -------------------------------------------------- |
| `ELISA_URL`    | `https://elisa.fi/kauppa` | API origin                                         |
| `ELISA_LIMIT`  | _(none — all groups)_     | Cap HANDSET product pages                          |
| `ELISA_RETRIES`| `6`                       | Retries on HTTP 429 / 503 with exponential backoff |

The catalog is a **single** fetch of `/rest/products/devices` — variant pages
reuse that payload (no per-SKU requests). Content from Elisa remains © Elisa.
