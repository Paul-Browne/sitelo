# Episode 6: sitelo-ui

**Length:** ~15 min · **Starts from:** `05-add-ons` · **Ends at:** this folder

We replace most of the hand-written markup and CSS with sitelo-ui, the
component library that ships with sitelo: an app bar, hero, cards, chips,
stats, breadcrumbs, a footer, dark mode, an orange theme, and only the CSS
the site uses.

## YouTube

**Title:** A component library that's just functions returning HTML (sitelo, ep. 6)

**Description:** sitelo-ui is 87 components (buttons, cards, forms, modals,
heroes) as plain functions. They nest inside javascript-to-html with nothing
in between. We restyle the whole recipe site with it, theme it, add dark
mode, try a few presets and prune the CSS to what we use.

**Chapters**

```
0:00 What sitelo-ui is
1:00 styles() and the app bar
3:15 Theming: a palette has nine slots
4:45 Cards and grids
6:45 The home page hero
8:00 The recipe page
10:00 Islands render components too
11:00 Presets
12:15 Shipping only the CSS you use
14:30 Next time
```

## 1. What sitelo-ui is (0:00–1:00)

**Show:** sitelo.dev/ui, the component gallery.

**Say:**
- Already installed: it ships with sitelo, at `sitelo/ui`.
- Every component is a function that returns HTML, with the same calling
  convention as javascript-to-html: optional props object first, children
  after.
- Most need no JavaScript. Modals are `<dialog>`, accordions are
  `<details>`, tabs are radio buttons.

## 2. `styles()` and the app bar (1:00–3:15)

**Do:** in `src/lib/layout.js`:

```js
import * as ui from 'sitelo/ui'
```

**Say:** import it as a namespace. A few names (`button`, `link`, `input`,
`table`) are also javascript-to-html elements, and `ui.link` next to
`link` keeps them apart.

**Do:** in `head`, before our own stylesheet:

```js
ui.styles(),
ui.themeScript(),
```

Replace the header with:

```js
ui.appBar({
  brand: [img({ src: '/images/logo.svg', alt: '', width: 28, height: 28 }), 'Weeknight Kitchen'],
  sticky: true,
  blur: true,
},
  ui.appBarSpacer(),
  ui.appBarNav(
    links.map(({ href, label }) => ui.navLink({ href, current: isCurrent(href, path) }, label)),
  ),
  ui.appBarActions(ui.themeToggle()),
),
```

and the `main` with `ui.container({ as: 'main' }, ...children)`. Then the
footer: `ui.siteFooter` with three `ui.footerColumn`s and a
`ui.footerBottom` (final version in this folder).

**Show:** the dev server. Click the moon: dark mode. Reload: it stays.

**Say:**
- `styles()` links one stylesheet that sitelo serves in dev and writes into
  the build. Nothing to copy.
- `themeToggle()` loads its own tiny script the first time it's clicked.
  `themeScript()` applies the saved choice before the first paint, so dark
  mode doesn't flash.

## 3. Theming: a palette has nine slots (3:15–4:45)

**Do:** first, the obvious version:

```js
ui.theme({ primary: { base: '#c2410c', hover: '#9a3412', fg: '#ffffff' } }),
```

**Show:** the solid button is orange, but the outline button and the
eyebrow text are still blue.

**Say:** each palette has nine slots: base, hover, active, fg, soft,
soft-hover, soft-fg, border and ring. The ones you leave out keep the
default.

**Do:** create `src/lib/theme.js` (in this folder) with all nine, light and
dark, and use it:

```js
ui.theme(orange, { dark: orangeDark }),
```

**Say:** the built-in palettes are checked for WCAG AA contrast. Your own
colours aren't, so check `fg` against `base`.

## 4. Cards and grids (4:45–6:45)

**Do:** rewrite `src/lib/recipe-card.js` (in this folder):

```js
const recipeCard = (recipe) =>
  ui.card({ href: `/recipes/${recipe.slug}` },
    ui.cardMedia({ src: recipe.image, alt: '', ratio: '4 / 3', sizes: '…' }),
    ui.cardHeader({
      title: escapeHtml(recipe.name),
      subtitle: `${escapeHtml(recipe.cuisine)} · ${totalTime(recipe)} min · ★ ${recipe.rating}`,
    }),
  )

export const recipeGrid = (recipes) =>
  ui.grid({ columns: 'repeat(auto-fill, minmax(min(100%, 14rem), 1fr))', gap: 'lg' },
    recipes.map(recipeCard),
  )
```

and use `recipeGrid(recipes)` on every listing page.

**Say:**
- `href` makes the whole card a link, with a hover lift.
- Props a component doesn't know pass through as attributes. `sizes` lands
  on the `<img>`, so image optimization still works.
- `auto-fill` rather than the grid's default `auto-fit`, so a cuisine with
  one recipe gets one card-sized card, not one stretched across the page.
- Children are still raw HTML, so escaping still matters.

> ⚠️ In 2.9.13 the card images come out 1000px tall, because the image
> optimizer adds `height="1000"` and `.su-card-media` has no
> `height: auto`. This folder's `styles.css` works around it (marked
> `TODO(Paul)`). Fix sitelo-ui before recording and drop the workaround.

## 5. The home page hero (6:45–8:00)

**Do:** in `src/index.ht.js` (final version in this folder):

```js
ui.hero({
  eyebrow: 'Weeknight Kitchen',
  title: 'Dinner, sorted.',
  description: 'Fifty recipes you can actually cook on a Tuesday.',
  align: 'start',
  media: img({ src: '/images/hero.jpg', … }),
},
  ui.button({ href: '/recipes', size: 'lg' }, 'Browse all recipes'),
  ui.button({ href: '/recipes/quick', size: 'lg', variant: 'outline' }, 'Ready in 30 minutes'),
),
```

**Show:** resize the window: the image moves beside the text when it's
wide, above it when it's narrow.

**Say:** the hero image now displays at about 540px, so its `sizes` changes
to `(min-width: 64rem) 34rem, 100vw`, and the browser picks a smaller
file.

## 6. The recipe page (8:00–10:00)

**Do:** rewrite `src/recipes/[slug].ht.js` (in this folder). Walk through
the pieces:

- `ui.breadcrumbs({ items: [...] })`. The last item is the current page.
- `ui.chip({ href, 'data-pagefind-filter': 'cuisine' }, …)`: the Pagefind
  attribute passes straight through.
- `ui.statGroup(ui.stat({ label: 'Prep', value: '20 min' }), …)`
- `ui.prose(h2('Ingredients'), ul(…), h2('Method'), ol(…))`: styles plain
  HTML you didn't build from components.

Do the same on the cuisines pages (cards with a photo per cuisine), and use
`ui.prose` on about, privacy and terms, and `ui.empty` for the 404.

**Then:** delete almost all of `src/styles.css`. What's left (about 30
lines, down from 143) uses the theme's tokens, `var(--su-bg)`,
`var(--su-radius-lg)`, so it follows dark mode too.

## 7. Islands render components too (10:00–11:00)

**Do:** rewrite both islands with components (this folder): the pick uses
`recipeGrid([pick])`, and comments become a `ui.list` of `ui.listItem`s with
a `ui.avatar`, or `ui.empty` when there are none. Their fallbacks become
`ui.skeleton(...)`.

**Say:** an island is server code like a page, so the same component
functions work there.

## 8. Presets (11:00–12:15)

**Do:** a quick montage. Change one line and reload each time:

```js
ui.styles({ preset: 'neubrutalism' })
ui.styles({ preset: 'superneon' })
ui.styles({ preset: 'terminal' })     // pair with ui.iconSet('square')
```

Go back to `ui.styles()`.

**Say:** a preset restyles every component at once, and `theme()` still
works on top.

## 9. Shipping only the CSS you use (12:15–14:30)

**Do:**

```js
// sitelo.config.js
pruneCss: true,
```

```bash
npm run build
```

**Show:** the stylesheet in `dist/su/`. On the recording machine: 67 kB
(11.8 kB gzipped) for the whole library, 26.6 kB (5.3 kB gzipped) pruned.

**Then:** `npm run preview`, open a recipe page, scroll to the comments:
unstyled.

**Say:**
- The build reads the classes off the pages it just wrote and drops every
  rule nothing uses.
- The comments island renders at request time, so the build never saw its
  list and avatar classes, and pruned them.
- Name what islands need:

```js
pruneCss: {
  keep: ['su-list*', 'su-avatar*', 'su-text*'],
},
```

Build again: comments are styled.

**Do:** finish with `npx sitelo lighthouse`. Still 100s.

> ⚠️ In 2.9.13 the footer from `ui.siteFooter` fails Lighthouse's
> `target-size` audit on mobile (accessibility 95): its links are 17px tall
> with 4px between them. This folder's `styles.css` works around it. Fix
> sitelo-ui before recording and drop the workaround.

## Recap (14:30–15:00)

- `import * as ui from 'sitelo/ui'`, `ui.styles()` in the head, then
  components wherever HTML goes, islands included.
- `ui.theme()` takes a whole palette; dark mode is a toggle and one script.
- `pruneCss` ships what you use; islands need a `keep` list.

**Next time:** the last one. We put Weeknight Kitchen on the internet,
islands and all.

## Files changed in this episode

```
src/lib/layout.js                 app bar, container, footer, theme
src/lib/theme.js                  new: orange palette, light and dark
src/lib/recipe-card.js            ui.card, recipeGrid
src/index.ht.js                   hero, sections
src/recipes/*.ht.js               components throughout
src/cuisines/*.ht.js              photo cards, chips, breadcrumbs
src/about.ht.js, (legal)/*        ui.prose
src/404.ht.js                     ui.empty
src/search.ht.js                  components
src/islands/*.js                  components
src/styles.css                    143 lines → about 30, on theme tokens
sitelo.config.js                  pruneCss with keep
```
