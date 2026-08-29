# WordPress → static with sitelo (Speckyboy)

A runnable example that treats [Speckyboy](https://speckyboy.com) as a
headless CMS: paginate through `/wp-json/wp/v2/posts`, generate one HTML
file per slug, and cache API responses between builds.

Speckyboy currently publishes ~2 000 posts — enough to prove the approach
at real scale.

## Run locally

```bash
npm install
npm run build          # full Speckyboy rip (~2k pages; first run is slow)
npm run preview
```

For a quicker smoke build while iterating:

```bash
WP_LIMIT=50 npm run build
npm run preview
```

Or point at another WordPress site:

```bash
WP_URL=https://your-wordpress-site.com npm run build
```

`WP_URL` defaults to `https://speckyboy.com`. Confirm any site’s API at
`https://your-site.com/wp-json/wp/v2/posts`.

## What's inside

- `src/index.ht.js` — home page listing recent Speckyboy posts
- `src/blog/index.ht.js` — full archive of every ripped post
- `src/blog/[slug].ht.js` — one static page per post via `generateStaticParams`
- `src/lib/wordpress.js` — REST helpers that walk every page of `/posts`
  (WordPress caps `per_page` at 100) using `fetchWithCache`, so rebuilds
  reuse cached responses instead of re-downloading everything
- `sitelo.config.js` — `renderConcurrency` renders page HTML in parallel
  (default here: 32). The list rip fills an in-memory cache so each
  `/blog/[slug]` page doesn’t hit the API again during render.

## Env

| Variable         | Default                   | Purpose                                      |
| ---------------- | ------------------------- | -------------------------------------------- |
| `WP_URL`         | `https://speckyboy.com`   | WordPress origin                             |
| `WP_LIMIT`       | _(none — rip everything)_ | Cap how many posts `getAllPosts()` returns   |
| `WP_CONCURRENCY` | `32`                      | Parallel list-page fetches after page 1      |

### Faster cold cache

First build downloads every post body. Helpers already trim Speckyboy
payloads with `_fields` (drops Yoast etc. — ~3× smaller) and embed only
`wp:featuredmedia`. To go faster still:

```bash
rm -rf node_modules/.cache          # force cold
WP_CONCURRENCY=40 npm run build     # more parallel list pages
```

Or skip featured images for a leaner rip (`embed: false` in
`generateStaticParams`) — content is still cached for render.

Full walkthrough: [sitelo.dev/examples/wordpress](https://sitelo.dev/examples/wordpress).

Content from Speckyboy remains © Speckyboy; this example only demonstrates
static generation against a public REST API.
