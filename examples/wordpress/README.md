# WordPress → static with sitelo

Treat WordPress as a headless CMS: paginate through `/wp-json/wp/v2/posts`,
generate one HTML file per slug, and cache API responses between builds.
Works at thousands of posts.

## Run

```bash
npm install
WP_URL=https://your-wordpress-site.com npm run build
npm run dev   # optional: live preview
```

`WP_URL` defaults to a placeholder — point it at any WordPress site with the
REST API enabled (it's on by default; confirm at
`https://your-site.com/wp-json/wp/v2/posts`).

## What's inside

- `src/index.ht.js` — home page listing recent posts
- `src/blog/index.ht.js` — full archive of every post
- `src/blog/[slug].ht.js` — one static page per post via `generateStaticParams`
- `src/lib/wordpress.js` — REST helpers that walk every page of `/posts`
  (WordPress caps `per_page` at 100) using `fetchWithCache`, so rebuilds
  reuse cached responses instead of re-downloading everything

Full walkthrough: [sitelo.js.org/examples/wordpress](https://sitelo.js.org/examples/wordpress).
