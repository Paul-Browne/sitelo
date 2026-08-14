# WordPress → static with Astro (Speckyboy)

Astro twin of [`examples/wordpress`](../wordpress): treat
[Speckyboy](https://speckyboy.com) as a headless CMS, paginate through
`/wp-json/wp/v2/posts`, generate one HTML file per slug, and cache API
responses between builds.

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

- `src/pages/index.astro` — home page listing recent Speckyboy posts
- `src/pages/blog/index.astro` — full archive of every ripped post
- `src/pages/blog/[slug].astro` — one static page per post via `getStaticPaths`
- `src/lib/wordpress.js` — REST helpers that walk every page of `/posts`
  (WordPress caps `per_page` at 100) with parallel fetches + a small disk
  cache so rebuilds reuse responses

## Env

| Variable         | Default                   | Purpose                                      |
| ---------------- | ------------------------- | -------------------------------------------- |
| `WP_URL`         | `https://speckyboy.com`   | WordPress origin                             |
| `WP_LIMIT`       | _(none — rip everything)_ | Cap how many posts `getAllPosts()` returns   |
| `WP_CONCURRENCY` | `25`                      | Parallel list-page fetches after page 1      |

Sitelo version of the same recipe: [`examples/wordpress`](../wordpress).

Content from Speckyboy remains © Speckyboy; this example only demonstrates
static generation against a public REST API.
