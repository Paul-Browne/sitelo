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
- **Small enough to build fast.** The full site is 121 pages and builds in
  well under a second once the cache is warm.
- **Something to fetch at request time.** `/recipes/meal-type/{meal}` and
  `/comments/post/{id}` (0–5 comments per recipe, so the empty state shows
  up too) feed the two islands in episode 4.
- No API key, no sign-up, CORS-enabled.

The data has real-world wrinkles worth leaving in. "Snack" and "Snacks" are
both meal types, and "Cocktail" and "Smoothie" are cuisines.

## Bugs the series turned up

Building the series turned up eight sitelo bugs, all fixed by sitelo 2.9.16
(with vite-plugin-html-pages 2.6.6), which every snapshot uses:

- `sitelo preview` served the home page for every clean URL.
- Optional catch-alls (`[...path]?.ht.js`) didn't build. Episode 3 now
  uses one for `/cuisines`.
- sitelo-ui card images stretched to 1000px once images were optimized.
- sitelo-ui footer links failed Lighthouse's `target-size` audit.
- A custom `404.ht.js` was also written to `dist/404/index.html`, and `/404`
  was listed in `sitemap.xml`.
- `fetchWithCache` cached to `node_modules/.cache/vite-plugin-html-pages/`
  instead of the documented `node_modules/.cache/sitelo/`.
- `sitelo build --logLevel silent` still printed image progress lines.
- The dev server answered an unknown URL with an empty 404, not
  `404.ht.js`, so episode 3 had to show its 404 page in preview. It shows
  it in the dev server now.

So record with 2.9.16 or later.

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
- Every snapshot was built and checked on 2026-10-31 with sitelo 2.9.16.
  Episodes 5–7 pass knip and their Lighthouse thresholds, and every
  lockfile passes `npm ci`.

## The stand-in photos

`src/images/hero.jpg` (3000×2000, 1.76 MB) and `kitchen.jpg` (2400×1600,
516 kB) are generated illustrations, saved as heavy JPEGs so they behave
like camera photos in episode 5. A real photo straight off a phone makes an
even better before/after. Swap one in under the same name if you have one.
