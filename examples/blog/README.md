# Markdown blog with sitelo

A folder of markdown files → a static blog with an RSS feed. No client-side
JavaScript ships at all.

## Run

```bash
npm install
npm run dev     # live preview
npm run build   # static site + rss.xml + sitemap.xml in dist/
```

## What's inside

- `content/*.md` — posts with `title` / `date` / `description` frontmatter
- `src/lib/posts.js` — reads the folder, parses frontmatter, renders markdown
  with [marked](https://marked.js.org) (server-only; never shipped to the browser)
- `src/index.ht.js` — post list, newest first
- `src/blog/[slug].ht.js` — one static page per post via `generateStaticParams`
- `sitelo.config.js` — `rss` config generates `dist/rss.xml` with an item for
  every page under `/blog`; `site` enables `sitemap.xml`

Full walkthrough: [sitelo.dev/examples/blog](https://sitelo.dev/examples/blog).
