# Episode 2: Fetching data

**Length:** ~10 min · **Starts from:** `01-setup` · **Ends at:** this folder

We pull 50 recipes from DummyJSON at build time: the six best-rated on the
home page, all of them on a new `/recipes` page, plus a "recipe of the day".

## YouTube

**Title:** Fetch API data at build time (sitelo, ep. 2)

**Description:** A sitelo page can export a `data()` function. It runs at
build time, and whatever it returns is handed to the page. We use it to
load recipes from a public API, cache the requests, and render them through
a card component, which is just another function.

**Chapters**

```
0:00 Where the data comes from
1:00 An API module
2:45 data() on the home page
4:15 Escape what you didn't write
5:15 A card component
6:30 A page with every recipe
7:45 The cache, and dev vs build
9:15 Next time
```

## 1. Where the data comes from (0:00–1:00)

**Show:** `https://dummyjson.com/recipes?limit=1` in the browser.

**Say:**
- DummyJSON is a free fake-data API. No key, no sign-up.
- Each recipe has a name, cuisine, meal types, times, a rating and a
  photo. We'll use every one of those fields by episode 6.

## 2. An API module (1:00–2:45)

**Do:** create `src/lib/api.js` (in this folder).

**Say:**
- `fetchWithCache` comes from sitelo. Same arguments as `fetch`, plus
  options: here, keep responses for an hour.
- Why cache? In dev, pages render on every request, and at build time lots
  of pages ask for the same URL. One request is enough.
- `?limit=0` asks DummyJSON for everything: 50 recipes.
- This file is in `src/lib/` and no page links it with a `<script>`, so it
  is never shipped to the browser. That matters when the module holds an
  API key.

## 3. `data()` on the home page (2:45–4:15)

**Do:** add to `src/index.ht.js`:

```js
export async function data() {
  const recipes = await getRecipes()
  const topRated = recipes.toSorted((a, b) => b.rating - a.rating).slice(0, 6)

  // A different recipe each day... but only when the site is rebuilt.
  const day = Math.floor(Date.now() / 86_400_000)
  const pick = await getRecipe((day % recipes.length) + 1)

  return { topRated, pick }
}
```

and read `data` in the page function:
`export default ({ page, data }) => …`.

**Say:**
- `data()` runs before the page renders, at build time, or on every request
  in dev. Whatever it returns arrives as `data`.
- It's async, so it can fetch, read files, query a database. None of that
  code reaches the browser.
- Read the comment on the "recipe of the day" out loud. It's only "of the
  day" if we rebuild every day. Episode 4 fixes that properly.

## 4. Escape what you didn't write (4:15–5:15)

**Do:** create `src/lib/escape.js` (in this folder).

**Say:**
- Children in javascript-to-html are inserted as HTML, because that's how
  elements nest. Attribute values are escaped for you.
- So text from an API goes through `escapeHtml` before it becomes a child.
  If the API ever returns `<script>`, it shows as text.
- Rule of thumb: escape anything you didn't write yourself.

## 5. A card component (5:15–6:30)

**Do:** create `src/lib/recipe-card.js` (in this folder), and render the
top six on the home page:

```js
section({ class: 'grid' }, data.topRated.map(recipeCard)),
```

Add the `.grid` and `.card` rules to `src/styles.css`.

**Say:**
- A component is a function that takes data and returns HTML. No props
  system, no framework.
- `map(recipeCard)` returns an array, and javascript-to-html flattens it.

## 6. A page with every recipe (6:30–7:45)

**Do:** create `src/recipes.ht.js` (in this folder) and add Recipes to the
nav in `src/lib/layout.js`.

**Show:** `/recipes` with all 50 cards. Open DevTools → Network → Img and
scroll to the bottom.

**Say:** 50 photos straight from the API, 100 to 480 kB each, several
megabytes for one page. We'll fix that in episode 5.

## 7. The cache, and dev vs build (7:45–9:15)

**Do:** clear the cache and build twice.

```bash
rm -rf node_modules/.cache
npm run build
npm run build
```

**Show:** the timings. On the recording machine the first build took about
300 ms and the second about 70 ms, with no network the second time.

```bash
ls node_modules/.cache/vite-plugin-html-pages/fetch
```

**Say:**
- During a build the cache goes to disk, so the next build reuses it. In
  dev it's kept in memory.
- Error responses are never cached, so one flaky build doesn't poison the
  next one.

> ⚠️ The README says the disk cache is `node_modules/.cache/sitelo/fetch`.
> It's really `node_modules/.cache/vite-plugin-html-pages/fetch`. Fix the
> docs (or the folder) before recording, and use whichever is right.

**Aside (optional, 20 s):** if your content lives in the repo rather than
an API, `readJson` and `readJsonCollection` from `sitelo/data` do the same
job for JSON files. My CoderLegion tutorial builds a blog that way.

## Recap (9:15–10:00)

- `export async function data()` loads what the page needs. It runs at
  build time and never ships.
- `fetchWithCache` stops the build asking for the same thing twice.
- Escape text from the API. Components are just functions.

**Next time:** routing. One file becomes 50 recipe pages, then we add
cuisines, a catch-all route, a 404 page and a sitemap.

## Files changed in this episode

```
src/lib/api.js           new
src/lib/escape.js        new
src/lib/recipe-card.js   new
src/recipes.ht.js        new
src/index.ht.js          data(), top rated, recipe of the day
src/lib/layout.js        Recipes link
src/styles.css           grid, card, pick
```
