# Sitelo video series: Weeknight Kitchen

Seven videos that build one site, a recipe site called **Weeknight Kitchen**,
from an empty folder to a deployed site with search, optimized images,
server islands and a component library.

Each folder is the finished code for that episode, so the change an episode
makes is a plain diff:

```bash
diff -ru 03-routing/src 04-islands/src
```

| # | Folder | Video | Length | Covers |
|---|--------|-------|--------|--------|
| 1 | [01-setup](01-setup/SCRIPT.md) | Your first sitelo site | ~10 min | install, pages as functions, javascript-to-html, a layout function, CSS, images, dev/build/preview |
| 2 | [02-data](02-data/SCRIPT.md) | Fetching data | ~10 min | `data()`, `fetchWithCache`, escaping, components as functions |
| 3 | [03-routing](03-routing/SCRIPT.md) | Routing | ~14 min | index routes, `[slug]`, `generateStaticParams`, static beats dynamic, catch-all, route groups, 404, sitemap, link checking |
| 4 | [04-islands](04-islands/SCRIPT.md) | Server islands | ~12 min | request-time HTML in a static page, props, `when: 'visible'`, fallbacks, untrusted props |
| 5 | [05-add-ons](05-add-ons/SCRIPT.md) | Add-ons | ~18 min | Lighthouse, image optimization, Pagefind search, knip |
| 6 | [06-sitelo-ui](06-sitelo-ui/SCRIPT.md) | sitelo-ui | ~15 min | components, theming, dark mode, presets, `pruneCss` |
| 7 | [07-deploy](07-deploy/SCRIPT.md) | Deploying | ~12 min | Netlify, an islands function, signed props, scheduled rebuilds, CI |

Episode 5 is the longest. If it runs past 20 minutes in the edit, split it
after the second Lighthouse run: 5a "Measure and fix" (Lighthouse, images)
and 5b "Search and cleanup" (Pagefind, knip).

## The data: DummyJSON recipes

The series uses [DummyJSON's recipes](https://dummyjson.com/docs/recipes)
rather than its posts:

- **Photos.** Every recipe has a 1000×1000 image (105–480 kB each), so
  episode 5 has real images to optimize. Posts have none.
- **Things to route on.** 50 recipes across 21 cuisines and 9 meal types
  give episode 3 a natural catch-all (`/cuisines/italian/dinner`).
- **Small enough to build fast.** The full site is 122 pages and builds in
  well under a second once the cache is warm.
- **Something to fetch at request time.** `/recipes/meal-type/{meal}` and
  `/comments/post/{id}` (0–5 comments per recipe, so the empty state shows
  up too) feed the two islands in episode 4.
- No API key, no sign-up, CORS-enabled.

The data has real-world wrinkles worth leaving in. "Snack" and "Snacks" are
both meal types, and "Cocktail" and "Smoothie" are cuisines.

## Before recording

Building this series turned up some sitelo bugs. Four of them show on
camera, so fix them (or plan around them) first:

1. **`sitelo preview` serves the home page for every clean URL.** `/about`,
   `/recipes` and `/nope` all return `index.html` with a 200. Only
   `/about/` works. `previewInlineConfig` in `bin/sitelo.js` keeps Vite's
   default `appType: 'spa'`, whose fallback never tries `about/index.html`.
   `sitelo lighthouse` already does the right thing (`appType: 'mpa'` plus
   `staticHostPlugin` in `src/lighthouse.js`). Episodes 1, 4 and 5 use
   `npm run preview`.
2. **Optional catch-all routes don't build.** `src/cuisines/[...path]?.ht.js`
   fails with `Failed to load url /src/cuisines/[...path]?.ht.js`, because
   vite-plugin-html-pages passes the file path to Vite's module runner,
   which reads the `?` as a query string. Encoding it as `%3F` doesn't help.
   Episode 3 uses `cuisines/index.ht.js` plus `cuisines/[...path].ht.js`
   instead, and does not mention optional catch-alls.
3. **sitelo-ui card images stretch once images are optimized.** The
   optimizer adds `width`/`height` attributes, and `.su-card-media` sets
   `aspect-ratio` without `height: auto`, so every card image renders 1000px
   tall.
4. **sitelo-ui footer links fail Lighthouse's `target-size` audit.**
   `.su-footer-links` puts a 4px gap between 17px-tall links, under WCAG
   2.2's 24px minimum, so the README's own `siteFooter` example scores 95
   for accessibility on mobile.

`06-sitelo-ui/src/styles.css` and `07-deploy/src/styles.css` carry a
two-line workaround for 3 and 4, marked `TODO(Paul)`. Delete it once
`ui.css` has the fixes. Episode 6 runs Lighthouse on camera, and without
the fix the footer fails it.

Smaller things noticed along the way:

- With the default `cleanUrls`, a custom `src/404.ht.js` is also written to
  `dist/404/index.html`, and `/404` is listed in `sitemap.xml`.
- The README and `skills/sitelo/references/data.md` say `fetchWithCache`
  persists to `node_modules/.cache/sitelo/fetch/`. It actually writes to
  `node_modules/.cache/vite-plugin-html-pages/fetch/`.
- `sitelo build --logLevel silent` still prints the `[sitelo] images: n/123
  pages…` progress lines.

## Recording setup

- Node 22 (`node -v`). sitelo needs 20.19+ or 22.12+.
- Terminal at 18–20 pt, editor at 18 pt, browser zoom 125%.
- Run each episode from the previous folder's code, typed or pasted in
  segment by segment. The scripts list each file as it should look when
  that segment ends.
- To show cold-cache timings (episodes 2 and 5), clear the caches first:

  ```bash
  rm -rf node_modules/.cache node_modules/.sitelo dist
  ```

- The islands print the server's local time, so record episode 4 at a time
  of day whose meal you want on screen (before 11:00 breakfast, before
  15:00 lunch, before 17:00 snack, otherwise dinner).
- Every snapshot was built and checked on 2026-10-30 with sitelo 2.9.13.
  Episodes 5–7 pass knip and their Lighthouse thresholds, and every
  lockfile passes `npm ci`.

## The stand-in photos

`src/images/hero.jpg` (3000×2000, 1.76 MB) and `kitchen.jpg` (2400×1600,
516 kB) are generated illustrations, saved as heavy JPEGs so they behave
like camera photos in episode 5. A real photo straight off a phone makes an
even better before/after. Swap one in under the same name if you have one.
