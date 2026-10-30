# Episode 4: Server islands

**Length:** ~12 min · **Starts from:** `03-routing` · **Ends at:** this folder

The home page's "recipe of the day" was frozen at build time. We replace it
with a server island that picks a recipe for the time of day on every
request, then add comments to each recipe page that load only when you
scroll to them.

## YouTube

**Title:** Fresh HTML inside a static page: server islands (sitelo, ep. 4)

**Description:** A static page can't know what time it is when you visit.
A server island can: it's a function that renders a fragment of HTML on
the server, per request, inside an otherwise static page. No client
framework, about 1.7 kB of JavaScript.

**Chapters**

```
0:00 The problem with build time
1:00 What an island is
1:45 The first island
4:15 Placing it in a page
5:30 Seeing it work
7:00 Props, and loading on scroll
9:15 Props are untrusted
10:15 What the build ships
11:30 Next time
```

## 1. The problem with build time (0:00–1:00)

**Show:** the "Recipe of the day" from episode 2 and its comment:
`// A different recipe each day... but only when the site is rebuilt.`

**Say:** everything so far happens once, at build time. That's why it's
fast and cheap to host. But some things depend on *when* someone visits.

## 2. What an island is (1:00–1:45)

**Say:**
- An island is a function that returns HTML, like a page, but it runs on
  the server when the page is requested, not when it's built.
- The page ships with a placeholder and some fallback HTML. A small script
  asks the server for the island and swaps it in.
- If the server isn't there, the fallback stays. The page still works.

## 3. The first island (1:45–4:15)

**Do:** create `src/islands/whats-cooking.js` (in this folder).

**Say:**
- Islands live in `src/islands/`. Plain `.js`, not `.ht.js`: they're
  fragments, not pages.
- It picks a meal from the server's clock (breakfast, lunch, snack or
  dinner), fetches recipes for it, and returns a random one as a card.
- Same `recipeCard` function the pages use. Components don't care when
  they run.
- Notice it uses plain `fetch`, not `getRecipes()` from `lib/api.js`.
  Two reasons. An island should get fresh data; that's the point of it.
  And in production this runs in a serverless function, so it should
  import as little as possible. `fetchWithCache` comes from sitelo's main
  entry, which brings the whole build toolchain with it.

## 4. Placing it in a page (4:15–5:30)

**Do:**
- Create `src/islands.js`, the client loader:

  ```js
  import { mountIslands } from 'sitelo/islands/client'

  mountIslands()
  ```

- In `src/lib/layout.js`, add an `islands` option that links it, so only
  pages with islands load it.
- In `src/index.ht.js`, delete the recipe-of-the-day code (and the
  `getRecipe` import) and drop the island in:

  ```js
  section({ class: 'pick' },
    h2('What should I cook right now?'),
    island('whats-cooking', {}, p('Hungry? Try one of our ', a({ href: '/recipes/quick' }, 'quick recipes'), '.')),
  ),
  ```

**Say:** `island(name, props, fallback)`. The fallback is real HTML,
something useful, not a spinner. It's what a visitor sees if JavaScript is
off or the island fails.

## 5. Seeing it work (5:30–7:00)

**Show:**
1. The home page in dev. Refresh a few times: a different recipe each time.
2. View source: the placeholder with the fallback inside, no recipe.

   ```html
   <div data-sitelo-island="whats-cooking"><p>Hungry? Try one of our …</p></div>
   ```

3. DevTools → Network: `GET /_sitelo/islands/whats-cooking` returning a
   fragment of HTML.

**Say:** the page is the same static file for everyone. Only the island is
rendered per request.

## 6. Props, and loading on scroll (7:00–9:15)

**Do:** create `src/islands/comments.js` (in this folder) and add it to
the bottom of `src/recipes/[slug].ht.js`:

```js
island('comments', { recipeId: recipe.id }, p({ class: 'meta' }, 'Loading comments…'), {
  when: 'visible',
}),
```

Pass `islands: true` to the layout there too, and add the `.comments`
styles.

**Show:** a recipe page with the Network tab open. No comments request
until you scroll down, then `/_sitelo/islands/comments?props=…`. Try a
recipe with none (Mango Salsa Chicken, for example) to see the empty state.

**Say:**
- The second argument is props, serialized into the placeholder and sent
  back with the request.
- `when: 'visible'` waits until the island scrolls into view. There's also
  `'idle'`. The default, `'load'`, fetches straight away.

## 7. Props are untrusted (9:15–10:15)

**Show:** the request URL. Copy it, change `"recipeId":1` to `2`, and open
it in a new tab. Different comments.

**Say:**
- Props travel through the browser, so anyone can change them. Treat them
  like a query string: check the type (`Number.isInteger`) and escape what
  comes back.
- Here that's fine: they're public comments. If props ever pick something
  private, set `SITELO_ISLANDS_SECRET` and sitelo signs every placeholder
  at build time and rejects anything else with a 403. We turn that on when
  we deploy in episode 7.

## 8. What the build ships (10:15–11:30)

**Do:**

```bash
npm run build
ls dist
npm run preview
```

**Show:** the build report (`js  1 file  1.7 kB`) and `dist/`:
`islands.js` is there, `src/islands/` isn't. Then the islands working in
preview.

**Say:**
- 1.7 kB of JavaScript for the whole feature.
- The island modules never reach `dist/`: they're server code.
- `sitelo preview` serves islands from `src/islands/` too. A static host
  can't run them on its own. Episode 7 adds the small function that does.

> ⚠️ Until the preview clean-URL bug is fixed (see the README), open recipe
> pages in preview with a trailing slash, e.g.
> `/recipes/classic-margherita-pizza/`.

## Recap (11:30–12:00)

- Islands are functions in `src/islands/` that render on the server, per
  request.
- `island(name, props, fallback, { when })` places one; `mountIslands()`
  loads them.
- Props are untrusted input. Validate them, and sign them when it matters.

**Next time:** add-ons. Lighthouse tells us what's slow, image optimization
fixes it, Pagefind adds search, and knip finds code we no longer need.

## Files changed in this episode

```
src/islands/whats-cooking.js   new
src/islands/comments.js        new
src/islands.js                 new (client loader)
src/lib/layout.js              islands option
src/index.ht.js                recipe of the day → whats-cooking island
src/recipes/[slug].ht.js       comments island
src/styles.css                 island styles
```
