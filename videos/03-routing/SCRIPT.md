# Episode 3: Routing

**Length:** ~14 min · **Starts from:** `02-data` · **Ends at:** this folder

Four pages become 122. Every recipe gets its own page, cuisines get a
drill-down (`/cuisines/italian/dinner`), and the site gains a 404 page, a
sitemap and a link checker.

## YouTube

**Title:** File-based routing, from one page to 122 (sitelo, ep. 3)

**Description:** Dynamic routes, generateStaticParams, catch-all routes,
route groups and a custom 404, all from file names. Then we turn on the
sitemap and a link checker that fails the build on a dead link.

**Chapters**

```
0:00 The plan
0:45 Index routes
1:45 Slugs
3:00 A page per recipe: [slug]
5:30 Dev renders anything, build renders what you list
6:30 Static beats dynamic
7:45 Cuisines: a catch-all route
10:30 Route groups and a 404
11:45 Sitemap and link checking
13:30 Next time
```

## 1. The plan (0:00–0:45)

**Show:** the routing table from the README (or draw it on screen):

| File | URL |
|------|-----|
| `recipes/index.ht.js` | `/recipes` |
| `recipes/[slug].ht.js` | `/recipes/classic-margherita-pizza` |
| `recipes/quick.ht.js` | `/recipes/quick` |
| `cuisines/index.ht.js` | `/cuisines` |
| `cuisines/[...path].ht.js` | `/cuisines/italian`, `/cuisines/italian/dinner` |
| `(legal)/privacy.ht.js` | `/privacy` |
| `404.ht.js` | `404.html` |

## 2. Index routes (0:45–1:45)

**Do:**

```bash
mkdir src/recipes
mv src/recipes.ht.js src/recipes/index.ht.js
```

Fix the imports to `../lib/…`.

**Say:** `recipes.ht.js` and `recipes/index.ht.js` are the same URL. Use
the folder once a section has more than one page.

## 3. Slugs (1:45–3:00)

**Do:** create `src/lib/slug.js` (in this folder) and give every recipe a
`slug` in `getRecipes()`:

```js
return recipes.map((recipe) => ({ ...recipe, slug: slugify(recipe.name) }))
```

Make the card a link: `a({ class: 'card', href: `/recipes/${recipe.slug}` }, …)`.

**Say:** "Classic Margherita Pizza" becomes `classic-margherita-pizza`. URLs
people can read, and the same function builds the link and the route, so
they can't disagree.

## 4. A page per recipe: `[slug]` (3:00–5:30)

**Do:** create `src/recipes/[slug].ht.js` (in this folder). Build it up in
three steps on camera:

1. `generateStaticParams` returns `[{ slug }, …]`, one per recipe.
2. `data({ params })` finds the recipe with `params.slug`.
3. The page renders it: image, meta line, ingredients, method.

**Say:**
- Square brackets make a parameter. The file name is the route.
- `generateStaticParams` tells the build which pages to write: 50 here.
- Each of those 50 `data()` calls asks for the recipe list again, and
  `fetchWithCache` answers 49 of them from memory. 50 pages, one request.
- If no recipe matches, `data()` throws. That only happens in dev, as we'll
  see next.

## 5. Dev renders anything, build renders what you list (5:30–6:30)

**Show:** `http://localhost:5173/recipes/beans-on-toast` in dev. The page
errors, and the terminal says:

```
Failed to render "src/recipes/[slug].ht.js" at route "/recipes/beans-on-toast": No recipe called "beans-on-toast"
```

**Say:**
- The dev server renders any param you give it. Handy while building a
  page, and you don't have to list params first.
- The build only writes what `generateStaticParams` returns. Check the
  build, not just dev: a page you forgot to list works in dev and is
  missing in `dist/`.

## 6. Static beats dynamic (6:30–7:45)

**Do:** create `src/recipes/quick.ht.js` (in this folder) and link it from
the recipes page.

**Say:** `/recipes/quick` could match `[slug]` too. A static file name
always wins over a parameter, and a parameter wins over a catch-all. Two
files writing the same URL is a build error, not a silent overwrite.

## 7. Cuisines: a catch-all route (7:45–10:30)

**Do:**
- Create `src/lib/cuisines.js` (in this folder): recipes grouped by
  cuisine, then by meal type.
- Create `src/cuisines/index.ht.js`: every cuisine with a count.
- Create `src/cuisines/[...path].ht.js`.
- Add Cuisines to the nav, and link the cuisine and meal types on the
  recipe page.

**Show:** `/cuisines` → Italian → Dinner, then the breadcrumbs back up.

**Say:**
- Three dots make a catch-all. `params.path` is an array:
  `['italian']` or `['italian', 'dinner']`.
- One file serves two depths. `generateStaticParams` returns both kinds:
  `{ path: ['italian'] }` and `{ path: ['italian', 'dinner'] }`.
- Destructuring the array reads like the URL:
  `const [cuisineSlug, mealSlug] = params.path`.

> ⚠️ sitelo documents an optional catch-all, `[...path]?.ht.js`, that would
> serve `/cuisines` from the same file. It doesn't build in 2.9.13 (see the
> README), so this episode uses `index.ht.js` beside the catch-all. If the
> fix ships first, it's a nice 30-second aside: rename the file and delete
> `index.ht.js`.

## 8. Route groups and a 404 (10:30–11:45)

**Do:**
- Create `src/(legal)/privacy.ht.js` and `src/(legal)/terms.ht.js`, and
  link them from the footer.
- Create `src/404.ht.js`.

**Say:**
- A folder in parentheses is just for you. It keeps files together without
  adding to the URL, so this is `/privacy`, not `/legal/privacy`.
- `404.ht.js` replaces the default `404.html`. Netlify, Cloudflare and
  GitHub Pages all serve it for unknown URLs.

## 9. Sitemap and link checking (11:45–13:30)

**Do:** create `sitelo.config.js`:

```js
export default {
  site: 'https://weeknight-kitchen.example',
  linkCheck: 'error',
}
```

```bash
npm run build
```

**Show:**

```
[sitelo] checked 1340 internal links - all good

  pages   122 files  206.0 kB
```

and `dist/sitemap.xml`.

**Then:** break a link on purpose. In `src/recipes/index.ht.js`, change
`/recipes/quick` to `/recipes/quik` and build again. The build fails:

```
[sitelo] 1 broken internal link

  recipes/index.html
    /recipes/quik  -> no such page
```

Put it back. (Don't break a nav link for this: that's one broken link on
each of 122 pages, and the list scrolls for a while.)

**Say:**
- `site` turns on `sitemap.xml`. We set the real URL when we deploy in
  episode 7.
- The link checker reads the built HTML, so it sees exactly what a visitor
  could click, catch-all pages included.

> ⚠️ With a custom `404.ht.js`, 2.9.13 also writes `dist/404/index.html`
> and lists `/404` in the sitemap. Fix it first, or don't zoom into the
> sitemap.

## Recap (13:30–14:00)

- The file name is the route: `[slug]` for a parameter, `[...path]` for
  any depth, `(group)` for folders that don't count.
- `generateStaticParams` decides what the build writes. Dev renders
  anything.
- `site` gives you a sitemap; `linkCheck: 'error'` keeps links honest.

**Next time:** "recipe of the day" only changes when we rebuild. Server
islands let one part of a static page render fresh on every request.

## Files changed in this episode

```
src/recipes.ht.js → src/recipes/index.ht.js   moved
src/recipes/[slug].ht.js                     new
src/recipes/quick.ht.js                      new
src/cuisines/index.ht.js                     new
src/cuisines/[...path].ht.js                 new
src/(legal)/privacy.ht.js, terms.ht.js       new
src/404.ht.js                                new
src/lib/slug.js, cuisines.js                 new
src/lib/api.js                               slug on every recipe
src/lib/recipe-card.js                       card is a link
src/lib/layout.js                            Cuisines link, footer links, current section
src/index.ht.js                              recipe of the day links to its page
src/styles.css                               recipe page, pills, breadcrumbs
sitelo.config.js                             new
```
