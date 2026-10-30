# Episode 5: Add-ons (Lighthouse, images, search, knip)

**Length:** ~18 min · **Starts from:** `04-islands` · **Ends at:** this folder

Four optional extras, each an `npm install -D` and a line of config. The
episode has a shape: measure with Lighthouse, fix what it finds, measure
again, then add search and clean up.

If the edit runs long, split after section 4: **5a "Measure and fix"**
(Lighthouse, images) and **5b "Search and cleanup"** (Pagefind, knip).

## YouTube

**Title:** Lighthouse, image optimization, search and dead code in one config file (sitelo, ep. 5)

**Description:** We audit the site with Lighthouse, find a 14-second
Largest Contentful Paint and a heading-order bug, fix both, and add
Pagefind search and knip. Every add-on is an optional peer dependency
and one line in sitelo.config.js.

**Chapters**

```
0:00 The plan
0:45 Lighthouse: the baseline
3:30 Fixing the heading order
4:45 Image optimization
8:45 Lighthouse again, now with thresholds
10:15 Search with Pagefind
14:30 Dead code with knip
17:15 Next time
```

## 1. The plan (0:00–0:45)

**Say:** sitelo keeps these out of the default install (sharp alone is a
native image library). Install the ones you want, switch them on in
`sitelo.config.js`, and the build does the rest.

## 2. Lighthouse: the baseline (0:45–3:30)

**Do:**

```bash
npm install -D lighthouse
```

```js
// sitelo.config.js
lighthouse: {
  include: ['index.html', 'recipes/**', 'cuisines/**'],
  sample: 2,
},
```

```bash
npm run build
npx sitelo lighthouse
```

**Show:** the table. On the recording machine, before any fixes:

```
  page                                 perf  a11y  best  seo
  /                                      75   100   100  100
  /recipes/                              82    98   100  100
  /cuisines/italian/                     96    98   100  100
```

(`sample` picks pages at random, so set `include` to these three for the
take if you want the same rows.)

**Say:**
- It audits the real build, through the same server as `sitelo preview`,
  in headless Chrome. Mobile by default.
- `sample: 2` audits two random pages from each `include` pattern. 120
  pages at a few seconds each adds up.
- Two problems: performance on the home page, and 98 for accessibility on
  the listing pages.

**Do:** to see why, keep the reports:

```js
lighthouse: { …, output: true }
```

**Show:** `.sitelo/lighthouse/index.report.html`: Largest Contentful Paint
13.9 s (the 1.76 MB hero). Then `recipes/index.report.html`: "Heading
elements are not in a sequentially-descending order".

## 3. Fixing the heading order (3:30–4:45)

**Say:** the cards use `h3`, which is right on the home page, where they
sit under "Top rated". On the listing pages they come straight after the
`h1`. A screen reader user jumping by heading skips a level.

**Do:** give each grid a heading. In `src/recipes/index.ht.js`,
`src/recipes/quick.ht.js` and `src/cuisines/[...path].ht.js`, the count
becomes an `h2`:

```js
h2(`${data.recipes.length} recipes`),
section({ class: 'grid' }, data.recipes.map(recipeCard)),
```

## 4. Image optimization (4:45–8:45)

**Do:**

```bash
npm install -D sharp
```

```js
// sitelo.config.js
images: {
  remote: true,
},
```

```bash
rm -rf node_modules/.sitelo
npm run build
```

**Show:** the progress, then:

```
[sitelo] images optimized 52 sources → 158 variants across 247 tags
[sitelo] images pruned 2 unreferenced originals (2.2 MB)

  vite 220ms · images 10.29s · pagefind 668ms · …
```

then the rewritten hero tag in `dist/index.html`:

```html
<img src="/assets/img/hero.6ca9c3fc-3000.webp" … width="3000" height="2000"
     srcset="…hero.422ebf95-400.webp 400w, …-800.webp 800w, …-1200.webp 1200w, …-3000.webp 3000w">
```

**Say:**
- Every `<img>` in the built HTML gets resized to a ladder of widths
  (400, 800, 1200 and the original), converted to WebP, and given a
  `srcset`, `width`, `height` and lazy loading.
- `remote: true` does the same for the API's photos: downloaded once at
  build time and served from our own site.
- The hero goes from a 1.76 MB JPEG to 9 kB at 400px and 33 kB at
  1200px. A phone downloads the small one.
- "9.4 MB → 11.0 MB" is every size of every image added up. No visitor
  downloads all of them; each `<img>` fetches one.
- The originals nothing points at any more are pruned from `dist/`.

**Do:** build again.

**Show:** `images 218ms`. Encodes are cached by content hash, in dev too.

**Then:** two attributes that make the ladder work better.

- In `src/lib/recipe-card.js`, tell the browser how wide a card is:

  ```js
  img({ src: recipe.image, alt: '', sizes: '(min-width: 64rem) 15rem, (min-width: 32rem) 50vw, 100vw' }),
  ```

- On the hero (and the recipe page's photo), which are above the fold:

  ```js
  sizes: '(min-width: 64rem) 61.5rem, 100vw',
  loading: 'eager',
  fetchpriority: 'high',
  ```

**Say:**
- Without `sizes`, the browser assumes the image fills the screen and picks
  a bigger file than a card needs.
- Lazy loading is right for cards and wrong for the hero, which is the
  first thing on screen. Attributes you write yourself are kept.
- In dev the same rewriting happens, so what you test is what you ship.

## 5. Lighthouse again, now with thresholds (8:45–10:15)

**Do:**

```bash
npm run build
npx sitelo lighthouse
```

**Show:** 100 across the board.

**Do:** turn the report into a check:

```js
lighthouse: {
  include: ['index.html', 'recipes/**', 'cuisines/**'],
  sample: 2,
  thresholds: {
    accessibility: 100,
    'best-practices': 100,
    seo: 100,
  },
},
```

and add `"lighthouse": "sitelo lighthouse"` to the scripts.

**Say:**
- A score under its threshold now fails the command. That's what we'll run
  in CI in episode 7.
- Performance has no threshold on purpose. It depends on the machine: the
  same page that scores 100 here scores around 60 on a CI runner. The other
  three are properties of the HTML and score the same anywhere.

## 6. Search with Pagefind (10:15–14:30)

**Do:**

```bash
npm install -D pagefind
```

```js
// sitelo.config.js
pagefind: true,
```

Mark what gets indexed, on the recipe page's `<article>`:

```js
article({ class: 'recipe', 'data-pagefind-body': true },
```

Filters, on the cuisine and meal links:

```js
a({ href: …, 'data-pagefind-filter': 'cuisine' }, escapeHtml(recipe.cuisine)),
```

A thumbnail for each result, on the recipe image:

```js
'data-pagefind-meta': 'image[src], image_alt[alt]',
```

Then create `src/search.ht.js` and `src/search.js` (in this folder), add
Search to the nav, and add `public/pagefind/` to `.gitignore`.

```bash
npm run build
npm run preview
```

**Show:** `[sitelo] pagefind indexed … → dist/pagefind`, then `/search`.
Type "curry". Three results, each with a photo. Open the Cuisine filter.

**Say:**
- Pagefind indexes the built HTML after the build, and search runs in the
  browser against a static index. No server, no API key.
- Once one page has `data-pagefind-body`, only those pages are indexed: 50
  recipes, not 120 pages of lists.
- `search.js` loads Pagefind's UI at runtime, because `/pagefind/` only
  exists after a build. Linking it straight from the page would fail the
  missing-asset check on a clean checkout.
- The build also copies the index to `public/pagefind/` so `sitelo` and
  `sitelo preview` can search without rebuilding. Gitignore it.

## 7. Dead code with knip (14:30–17:15)

**Do:**

```bash
npm install -D knip
```

```js
// knip.js
import { knipConfig } from 'sitelo/knip'

export default knipConfig({
  // Client scripts that pages link by URL, which knip cannot see
  entry: ['src/islands.js!', 'src/search.js!'],
})
```

```bash
npx knip
```

**Show:**

```
Unused exports (1)
getRecipe  function  src/lib/api.js:17:23
```

**Say:**
- knip finds files, exports and dependencies nothing uses.
- On its own it would report the whole site as unused, since nothing
  imports a page. `knipConfig()` reads `sitelo.config.js` and marks pages
  and islands as entry points.
- Scripts a page links by URL are the one thing it can't see, so we list
  them. The `!` marks them as production code.
- And it found something real: `getRecipe` fetched the recipe of the day,
  which the island replaced last episode. Delete it.

**Do:** delete `getRecipe` from `src/lib/api.js`, run `npx knip` again
(no output), and add `"knip": "knip"` to the scripts.

## Recap (17:15–18:00)

- `sitelo lighthouse` audits the real build; thresholds make it a check.
- `images: { remote: true }` resized, converted and lazy-loaded every image.
  The home page's LCP went from 13.9 s to a perfect score.
- `pagefind: true` plus `data-pagefind-body` is search with no server.
- `knipConfig()` makes knip understand a sitelo site.

**Next time:** sitelo-ui. We swap almost all of our CSS for components,
add dark mode and a theme, and ship only the CSS we use.

## Files changed in this episode

```
sitelo.config.js            images, pagefind, lighthouse
knip.js                     new
src/search.ht.js            new
src/search.js               new
src/lib/api.js              getRecipe removed
src/lib/recipe-card.js      sizes on the card image
src/lib/layout.js           Search link
src/index.ht.js             hero: sizes, eager, fetchpriority
src/recipes/[slug].ht.js    pagefind body, filters and image; eager image
src/recipes/index.ht.js     h2 above the grid
src/recipes/quick.ht.js     h2 above the grid
src/cuisines/[...path].ht.js  h2 above the grid
src/styles.css              Pagefind colours
package.json                lighthouse, sharp, pagefind, knip; scripts
.gitignore                  public/pagefind/
```
