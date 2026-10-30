# Episode 1: Your first sitelo site

**Length:** ~10 min · **Starts from:** an empty folder · **Ends at:** this folder

By the end there is a two-page site (home and about) with a shared layout,
a stylesheet and two images, running in the dev server and built to
`dist/`. No data and no image optimization yet.

## YouTube

**Title:** Build a static site with plain JavaScript functions (sitelo, ep. 1)

**Description:** sitelo turns JavaScript functions that return HTML into a
static site, with Vite underneath. In this first episode we install it, write
two pages with javascript-to-html, share a layout between them, and build
the site. Code for every episode: <repo link>/videos

**Chapters**

```
0:00 What we're building
0:45 Install
2:00 The first page
3:30 javascript-to-html
5:00 A layout is just a function
6:15 Styles and images
7:30 A second page
8:15 Build and preview
9:30 Next time
```

## Cold open (0:00–0:45)

**Show:** the finished Weeknight Kitchen site from episode 7, scrolled
quickly: home, a recipe, search, dark mode.

**Say:**
- Over seven videos we build this: a recipe site with 120 pages, search,
  optimized images and a few bits rendered on the server per request.
- Every page is a JavaScript function that returns a string of HTML. That's
  the whole model.
- Today: an empty folder to a two-page site.

## 1. Install (0:45–2:00)

**Do:**

```bash
node -v                       # 20.19+ or 22.12+
mkdir weeknight-kitchen && cd weeknight-kitchen
npm init -y
npm pkg set type=module
npm install sitelo javascript-to-html
```

Then add the scripts to `package.json`:

```json
"scripts": {
  "dev": "sitelo",
  "build": "sitelo build",
  "preview": "sitelo preview"
}
```

**Say:**
- Two packages. sitelo brings Vite with it, so there is no Vite to install
  and no Vite config to write.
- javascript-to-html is optional. Pages can be template literals, JSX or
  this. I'll show why I like it in a minute.

## 2. The first page (2:00–3:30)

**Do:** create `src/index.ht.js` as a template literal first:

```js
export default () => `
  <html lang="en">
    <head><title>Weeknight Kitchen</title></head>
    <body><h1>Dinner, sorted.</h1></body>
  </html>
`
```

```bash
npm run dev
```

**Show:** the page at `http://localhost:5173`, then the dev toolbar at the
bottom. Hover the file name (`src/index.ht.js`) and the island count.

**Say:**
- Any file ending in `.ht.js` under `src/` is a page. `index.ht.js` is `/`.
- The default export is a function that returns HTML. sitelo calls it and
  adds the doctype for you.
- The toolbar only exists in dev. It never ships.

## 3. javascript-to-html (3:30–5:00)

**Do:** rewrite the page with element functions:

```js
import { body, h1, head, html, title } from 'javascript-to-html'

export default () =>
  html({ lang: 'en' },
    head(title('Weeknight Kitchen')),
    body(h1('Dinner, sorted.')),
  )
```

**Say:**
- Every HTML element is a function. The first argument can be an object of
  attributes; everything after it is children.
- Arrays are flattened, so `ul(items.map((item) => li(item)))` just works.
  We'll lean on that in episode 2.
- It's still just strings. Nothing runs in the browser.

**Then:** break it on purpose. Remove `title` from the import and save.

**Show:** the terminal:

```
── PAGE RELOAD ERROR ───────────────────── src/index.ht.js:5:10

ReferenceError: title is not defined
```

Put the import back and save. The page reloads; the server never stopped.

## 4. A layout is just a function (5:00–6:15)

**Do:** create `src/lib/layout.js` (in this folder) and switch
`src/index.ht.js` to use it.

**Say:**
- No layout convention, no `_app`, no slots. A layout is a function you
  call, with the page's content as its children.
- It lives in `src/lib/` and isn't called `.ht.js`, so it isn't a page.
  If you named it `layout.ht.js` you'd get a page at `/layout`.
- `page.routePath` tells the layout which page it's rendering, so the nav
  can mark the current link with `aria-current`.
- Note `title: pageTitle` in the parameters: `title` is also the element
  function we imported.

## 5. Styles and images (6:15–7:30)

**Do:**
- Create `src/styles.css`. The layout already links `/styles.css`.
- Put `hero.jpg`, `kitchen.jpg` and `logo.svg` in `src/images/`.
- Add the hero section to `src/index.ht.js` (final version in this folder).

**Say:**
- URLs are root-relative and map onto `src/`: `/styles.css` is
  `src/styles.css`.
- Linked CSS and JS are bundled and minified at build time. Other files,
  like images, are copied.
- If a page links a stylesheet or script that doesn't exist,
  `sitelo build` fails instead of shipping a broken page.

## 6. A second page (7:30–8:15)

**Do:** create `src/about.ht.js` (in this folder).

**Show:** click About in the nav. The highlight moves.

**Say:** `about.ht.js` is `/about`. That's all routing is for now.
Episode 3 goes much further.

## 7. Build and preview (8:15–9:30)

**Do:**

```bash
npm run build
```

**Show:** the build report.

```
  pages   3 files   2.8 kB
  css      1 file   1.3 kB
  images  3 files  2.28 MB
```

Then the `dist/` folder: `index.html`, `about/index.html`, `404.html`,
`styles.css` and `images/`.

**Say:**
- Three pages: our two plus a `404.html` sitelo generated, because we
  didn't write one.
- `about/index.html` is a clean URL. The link stays `/about`.
- 2.28 MB of images for two pages, mostly one 1.76 MB JPEG. Remember that
  number for episode 5.

```bash
npm run preview
```

**Say:** `preview` serves `dist/` the way a static host would.

> ⚠️ Before recording, fix the `sitelo preview` clean-URL bug (see the
> README). Until then `/about` in preview shows the home page. Only
> `/about/` works.

## Recap (9:30–10:00)

- Pages are functions in `src/*.ht.js` that return HTML.
- A layout is a function in `src/lib/`.
- `npm run dev` to work, `npm run build` to ship `dist/`.

**Next time:** real data. We pull 50 recipes from an API at build time and
put them on the page.

## Files at the end of this episode

```
package.json
src/
  index.ht.js
  about.ht.js
  lib/layout.js
  styles.css
  images/hero.jpg, kitchen.jpg, logo.svg
```
