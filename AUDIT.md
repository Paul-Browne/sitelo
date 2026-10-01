# Sitelo codebase audit

**Scope:** the published package only: `src/` (core, `sitelo/ui`, `sitelo/ui-extras`, runtime modules, presets) and `bin/sitelo.js`. `docs/` and `examples/` were not audited.
**Baseline:** `npm test` passes (431 pass, 1 skipped because `chrome-launcher` isn't installed), `npm run typecheck` is clean, and the exports in `sitelo/ui`, `sitelo/ui/client` and `sitelo/ui-extras` match their `.d.ts` files exactly.
**Method:** I read every module. Each finding marked **verified** was reproduced in this environment: with a real `sitelo build` / `sitelo dev` on a scratch site, by rendering in headless Chromium (Playwright), or by calling the module directly. Findings marked **by reading** come from the code alone.

---

## Summary

| # | Severity | Area | Finding | Status |
|---|----------|------|---------|--------|
| 1 | **High** | images | `sitelo dev` deletes source images from `public/`/`src/` whenever the project path contains a `remote` folder and an image fails to process | Fixed |
| 2 | **High** | images | `prune` is on by default and deletes files that are still referenced: relative URLs, `.webmanifest` icons, `apple-touch-icon.png` | Fixed |
| 3 | **High** | islands | One malformed request crashes any plain-Node / Express 4 server using `createIslandsNodeHandler` | Fixed |
| 4 | **Medium** | CLI | One malformed request crashes `sitelo dev` (`/_sitelo/islands/%E0`) | Fixed |
| 5 | **Medium** | images | `images.assetsDir` isn't validated, so `'../x'` makes `sitelo build` `rm -rf` a folder outside `dist/` | Fixed |
| 6 | **Medium** | images | The `<img>` rewriter corrupts any tag with `>` in an attribute (for example `alt="a > b"`) | Fixed |
| 7 | **Medium** | ui | `textarea({ value })` is written unescaped, so `</textarea>` breaks out (XSS when the value is user data) | Fixed |
| 8 | **Medium** | ui | `theme({ dark })` ignores the user's light choice, and with `selector` the dark block is inverted | Fixed |
| 9 | **Medium** | ui | Two panel `tabs()` on one page share ids, so clicking one set switches the other; `name` doesn't help | Fixed |
| 10 | **Medium** | ui | `modal()` / `drawer()` claim `aria-modal="true"` and "focus containment", but Tab walks out into the page | Fixed (`aria-modal` dropped) |
| 11 | **Medium** | images | The dev image pipeline never invalidates, so an edited image keeps its old variant until restart | Fixed |
| 12 | Low | CLI | A mistyped command (`sitelo biuld`) silently starts the dev server | Fixed |
| 13 | Low | CLI | `sitelo preview` and `sitelo lighthouse` resolve Vite config in `development` mode | Fixed |
| 14 | Low | CLI | `--port` isn't validated, `--clearScreen` can't be turned off, and default `logLevel` overrides config | Fixed |
| 15 | Low | islands | Island lookup reads inherited object keys (`/_sitelo/islands/toString` returns 200) | Fixed |
| 16 | Low | islands | Notes on how props signing is enforced | Partly (see below) |
| 17 | Low | images | JPEGs with trailing bytes are rejected as "not decodable" (this is also the trigger for #1) | Fixed |
| 18 | Low | images | Relative `<img src>` resolves against the site root, and a full-URL or `./` `base` gives broken variant URLs | Fixed |
| 19 | Low | ui | `slider({ showValue })` with no `value` shows the minimum while the thumb sits at the midpoint | Fixed |
| 20 | Low | ui | The `choiceGroup()` radiogroup has no accessible name | Fixed |
| 21 | Low | ui | `menu()` uses `role="menu"` but has no arrow-key support | Fixed |
| 22 | Low | ui | Accessible names are hard-coded in English (pagination, toast) | Fixed |
| 23 | Low | ui | `controlId()` produces duplicate ids, and no id at all for non-Latin labels | Partly (see below) |
| 24 | Low | ui | `chip()` docs say `onclick` makes a button, but it renders a `<span>` | Fixed |
| 25 | Low | ui | `registerIcons()` doesn't reach alert icons or the theme toggle | Fixed |
| 26 | Low | ui | `select()` ignores an array `value` (`multiple`), and option labels from values are unescaped | Fixed |
| 27 | Low | ui | `steps()` and `/su/steps.js` disagree on a non-numeric `current` | Fixed |
| 28 | Low | ui | `theme()` and `themeScript()` sanitising is thin | Fixed |
| 29 | Low | links | Percent-encoded paths are reported as broken, and `data-href` / `data-id` are mistaken for `href` / `id` | Fixed |
| 30 | Low | misc | Smaller items: data cache shared object, locale-dependent sort, pagefind `close()`, Lighthouse rounding | Partly (see below) |

## Resolution

Every finding was fixed on this branch, except the parts listed below. Each fix has a regression test that fails on the code as audited and passes now. The exceptions are `--clearScreen false` and `runPagefind` closing Pagefind when it fails; neither could be observed from a test without mocking the package. The suite went from 432 to 468 tests, all passing (one skip, as before, because `chrome-launcher` isn't installed). The reproductions above were re-run against the fixed code, and the UI fixes were re-checked in Chromium.

Where a fix involved a judgement call:

- **#2.** `prune` stays on by default, but it now considers only the originals that a tag was actually rewritten from. One of those is kept if its file name appears anywhere in the build's text files.
- **#9.** Tab sets without item ids now get ids derived from `name`, the set's `id`, or a digest of the items. A `value` that names an old default id (`tab-2`) still selects its tab.
- **#10.** `modal()` and `drawer()` no longer claim `aria-modal`. Making them truly modal means `<dialog>` with `showModal()`, which changes how triggers are written (`popovertarget` becomes `command`/`commandfor`), so it's left as a follow-up API decision.

Left as they were:

- **#16.** A request without props still skips signature checking, which is by design: prop-less islands have nothing to sign. `configureIslands()` is now shared across module copies, so the dev endpoint enforces it. `sitelo preview` and production handlers still need the environment variable or `createIslandsHandler({ secret })`; the README now says so.
- **#23.** Two fields with the same `name` on one page still get the same generated id, because ids are deterministic on purpose. The docs now say to pass an `id`. Non-Latin labels now get an id.
- **#30.** `pagefind.syncPublic` still defaults to writing `public/pagefind/`, and `sitelo:ui-runtime` still uses `process.env.SITELO_UI_BASE`. Both are design choices rather than bugs.

---

## High

### 1. `sitelo dev` can permanently delete source images (verified)

`src/images.js:805-808`

```js
}).catch(async (error) => {
  if (sourcePath.includes(`${path.sep}remote${path.sep}`)) {
    await fs.unlink(sourcePath).catch(() => {})
  }
```

This is meant to drop a bad *download* from `<cacheDir>/remote/`. But it tests whether the absolute path contains a `remote` segment *anywhere*. In dev, `sourcePath` is the user's own file under `src/`, `public/` or the project root.

- **Failure:** take a project at `~/work/remote/my-site` (or one with a `public/remote/` folder) and an image that fails processing (see #17: any JPEG with bytes after the EOI marker, such as a phone "motion photo"). The first `sitelo dev` page load **deletes the original from `public/`**.
- **In a build**, it deletes the copy in `dist/`, while the `<img>` is left pointing at it. The result is a broken image in production.
- **Verified:** a site at `scratchpad/remote/site` with a valid 800×800 JPEG plus 28 trailing bytes. `sharp` decodes it fine. After a single dev request, `public/motion.jpg` was gone. After `sitelo build`, `dist/motion.jpg` was gone.
- **Fix:** delete only when `sourcePath` is inside `path.join(cacheDir, 'remote')` (use `path.relative` and check that it doesn't start with `..`).

### 2. Default-on `prune` deletes files that are still referenced (verified)

`src/images.js:1291-1319` (`pruneOriginals`), enabled by default at `:187`

Pruning walks *every* raster in `dist/`, not only the originals it replaced. It deletes each one whose root-relative URL doesn't appear literally in a `.html/.css/.xml/.json/.js` file. The README says "Only genuinely unreferenced files go", but in a test build it deleted:

- `dist/icons/icon-192.png`, referenced only from `site.webmanifest` (`.webmanifest` isn't scanned).
- `dist/apple-touch-icon.png`, which iOS requests by convention without any `<link>`.
- `dist/blog/post/cover.png`, referenced as `<img src="cover.png">` on `/blog/post/`. A relative URL never matches the root-relative needle, and the rewriter skipped it too (#18). **The page ships with a broken image.**

The same logic (by reading) also catches any URL written percent-encoded (`/my%20photo.jpg` doesn't match the on-disk `my photo.jpg`), `.txt` / `.rss` / `.atom` / `.webmanifest` feeds, and images meant for outside consumers.

**Fix:** prune only the originals that the rewriter actually replaced, by tracking them in `rewriteHtmlImages`/`generate`, instead of "every raster nobody mentions". Failing that, resolve relative and encoded URLs, scan every text file, and consider defaulting `prune` to `false`.

### 3. One request can crash a server using `createIslandsNodeHandler` (verified)

`src/islands-server.js:165, 233`

The README says "Plain Node http/express? Use `createIslandsNodeHandler(options)`". The handler builds a `Request` and decodes the name with no guard, and it returns a promise that plain `http.createServer` and Express 4 never `.catch()`. Node's default for unhandled rejections is to exit.

With `http.createServer((req, res) => handler(req, res))`, each of these single requests killed the process (exit 1):

| Request | Thrown by |
|---|---|
| `TRACE / HTTP/1.1` | `new Request(..., { method: 'TRACE' })`: "'TRACE' HTTP method is unsupported" (also CONNECT, TRACK) |
| `GET /` with `Host: [` | `new Request()`: "Failed to parse URL" |
| `GET /_sitelo/islands/%E0` | `decodeURIComponent`: "URI malformed" |

The first two hit **every route**, not only island URLs, because the `Request` is built before the endpoint check. The fetch-style `createIslandsHandler` also throws on `%E0` instead of returning a 400.

**Fix:** check the path prefix on `req.url` before building a `Request`. Wrap the `Request` construction and `decodeURIComponent` in try/catch (return 400). Make the Node adapter catch its own errors and answer 500, or call `next(err)`.

---

## Medium

### 4. `sitelo dev` dies on a malformed island URL (verified)

`bin/sitelo.js:401`. `decodeURIComponent` sits outside the `try` in an `async` connect middleware, so the rejection goes unhandled. `curl localhost:5173/_sitelo/islands/%E0` prints `URIError: URI malformed` and the dev server exits. With `--host`, anyone on the LAN can do this. (`sitelo preview` survives because it wraps its handler in `.catch(next)`.)

### 5. `images.assetsDir` can delete folders outside `dist/` (verified)

`bin/sitelo.js:749-755` runs `fsp.rm(path.join(root, outDir, imageOptions.assetsDir), { recursive: true, force: true })` before every build. `normalizeImageOptions` (`src/images.js:157-160, 184`) only trims slashes.

`images: { assetsDir: '../keep' }` deleted the project's `keep/` directory. `'..'` would delete the project root, and `''` or `'/'` deletes all of `dist/`, including an `outDir` that Vite deliberately won't empty.

**Fix:** reject an `assetsDir` that is absolute, empty, or resolves outside `outDir`.

### 6. The image rewriter corrupts tags containing `>` (verified)

`src/images.js:921` matches tags with `/<img\b[^>]*>/`. javascript-to-html doesn't escape `>` in attribute values, so `img({ src: '/hero.png', alt: 'Revenue > costs' })` is common output. The build produced:

```html
<img src="/assets/img/hero…webp" alt revenue sizes="100vw" … srcset="…"> costs, 2025">
```

The alt text is lost and `costs, 2025">` is rendered as visible text. **Fix:** use a quote-aware tag scanner (the attribute regex at `:819` already understands quotes).

### 7. `textarea({ value })` isn't escaped (verified)

`src/ui/inputs.js:268`

```js
textarea({ value: '</textarea><img src=x onerror=alert(1)>' })
// <textarea class="su-textarea"></textarea><img src=x onerror=alert(1)></textarea>
```

`input({ value })` is safe because it's an attribute and `"` gets escaped. Callers will reasonably expect `textarea`'s `value` to behave the same way. Pre-filling an edit form from user data (a server island, say) gives XSS, and `&amp;` in a value is silently decoded. **Fix:** `escapeHtml(value)` (it's a *value* prop, not children). The same applies to `select()` options whose label falls back to `String(value)` (`:310`), which render `x<b>y</b>` as markup.

### 8. `theme({ dark })` applies dark tokens in the wrong states (verified in Chromium)

`src/ui/styles.js:203-208`

1. **The user's light choice is ignored when the host sets `data-theme="dark"`.** The core sheet deliberately uses `[data-theme='dark']:not([data-su-theme='light'])` (see the comment at `ui.css:168-173`, and every preset copies it), but `theme()` emits a bare `[data-theme='dark']`. With `<html data-theme="dark" data-su-theme="light">`, `--su-primary` resolved to the **dark** override (`#00ff00`) on a light page.
2. **A scoped `selector` inverts the logic.** For `selector: '.mk'` it emits `.mk [data-su-theme='dark']`, meaning a *descendant* carrying the attribute, while the toggle sets it on `<html>`. The media block tests `:not([data-su-theme='light'])` on `.mk` itself rather than on the root. Measured:
   - System light, user toggled dark: the light value (`#ff0000`); the dark override is never applied.
   - System dark, user chose light: the dark value (`#00ff00`).

**Fix:** mirror the core selectors: `[data-theme='dark']:not([data-su-theme='light']) ${selector}`, `[data-su-theme='dark'] ${selector}`, and `:root:not([data-theme='light']):not([data-su-theme='light']) ${selector}` inside the media query.

### 9. Two panel `tabs()` on one page break each other (verified in Chromium)

`src/ui/navigation.js:202, 306-327`. Default item ids are `tab-1`, `tab-2`, …, and the radio/label/panel ids derive from them. Two sets on one page produce six duplicate ids. Each `<label for="tab-2-tab">` in the second set points at the *first* set's radio. Clicking set B's second tab switched **set A** and left B alone, and this happened even with distinct `name`s (`set-a`, `set-b`). `TabsProps.name` documents `name` as the fix for this case, but it isn't one. **Fix:** prefix the default ids with the group (`${group}-${index}`) and derive `group` from a content digest, as `carousel()` already does.

### 10. `modal()` / `drawer()` advertise modality the browser doesn't provide (verified in Chromium)

`src/ui/overlays.js:28-30, 63-70, 135-142`. The docstring says "focus containment — is the browser's job here", and the element carries `role="dialog" aria-modal="true"`. But a `popover` doesn't make the page inert or trap focus. With the modal open, Tab went close button → inside button → **the page's own buttons behind it** → … while the modal stayed open (`inert` false). Screen readers honour `aria-modal` by hiding the background from the virtual cursor, so keyboard focus can land on content AT users can't perceive.

**Fix:** use `<dialog>` opened with `showModal()`, which can be scriptless via invoker commands (`commandfor` / `command="show-modal"`), or drop `aria-modal` and correct the docs.

### 11. The dev image pipeline serves stale variants (verified)

`src/images.js:1478-1494` creates one processor per dev server. Its `sources` and `inFlight` maps (`:710`, `:761`) cache by path forever, including rejections. Overwriting `public/a.png` with a different image and re-transforming returned the identical variant URL (`a.f6e12518-500.webp`). An image that failed once stays failed until restart. **Fix:** key the caches on `mtime`/size, the way `src/data.js` does.

---

## Low

**12. A mistyped command starts the dev server (verified).** `bin/sitelo.js:114-129` pushes an unknown first word into `positional`, which nothing reads, and leaves `command: 'dev'`. `sitelo biuld` printed `➜ Local: http://localhost:…` and never exits, so in CI that's a hung job. The `default: Unknown command` branch in `main()` is unreachable.

**13. `preview` and `lighthouse` resolve Vite config in `development` mode (verified).** `bin/sitelo.js:610` defaults every non-`build` command to `development`. A `vite.config.js` that logs its mode printed `build production` for the build but `serve development` for the preview server. Mode-dependent `base`, `define` or `.env.*` therefore differ between what's built and what's previewed or audited. `vite preview` uses `production`.

**14. CLI flags (by reading).** `--port abc` becomes `NaN` (`:188`). `--clearScreen` can only be set to true (`:182`) and `allowClearScreen` is always true, although the help text says "Allow/disable". `logLevel` is always written to the CLI layer (`:611`, default `'info'`), so `vite.logLevel` in `sitelo.config.js` and `vite.config.js` never takes effect.

**15. Island lookup reads inherited keys (verified).** `src/islands-server.js:171` uses `islands[name]` on a plain object. `GET /_sitelo/islands/toString` returns **200 `[object Undefined]`**. `constructor`, `valueOf` and `hasOwnProperty` return 500 and log an error. Use `Object.hasOwn(islands, name)`.

**16. Islands signing notes (by reading).**
- With a secret set, a request *without* `props` skips verification (`:182`) and renders with `{}`, so islands must cope with being called propless.
- `configureIslands({ secret })` from a page module sets the secret only in the page's module graph. The dev middleware and `sitelo preview` handler read their own copy, so they don't enforce it. `sitelo/ui` solved the same problem by also writing to `process.env` (`handlers.js:63-70`).

**17. Valid JPEGs with trailing data are rejected (verified).** `looksLikeCompleteRaster` (`src/images.js:490-508`) requires the file to *end* in `FFD9`. Motion photos and some editors append data after the EOI marker. `sharp` decodes such a file fine, but sitelo skips it with "not a decodable raster image".

**18. URL resolution in the image pipeline (by reading).** `createSourceResolver` (`:1061-1088`) strips the leading `/` and resolves every `src` against the site root, so a relative `src="cover.png"` on `/blog/post/` looks for `dist/cover.png`. That can optimize a different file of the same name. `joinUrl(base, assetsDir)` (`:516`, `:1373`) turns a Vite `base` of `https://cdn.example.com/` into `/https://cdn.example.com/assets/img/…` and `./` into `/./assets/img/…`.

**19. `slider({ showValue: true })` with no `value` (verified).** The `<output>` shows `min` (`inputs.js:546`) while the browser places the thumb at the midpoint: Chromium reported thumb `50`, output `0`. Render `(min + max) / 2` instead, snapped to `step`.

**20. The `choiceGroup()` radiogroup has no name (verified).** The legend is a bare `<div class="su-label">` (`inputs.js:485-489`). Chromium's accessibility tree shows `radiogroup:` with no name, and `help` isn't linked with `aria-describedby`. Use `<fieldset><legend>`, or `aria-labelledby`.

**21. `menu()` uses `role="menu"` but has no menu keyboard model (by reading).** `overlays.js:221, 237, 243` declare `menu` / `menuitem`. `runtime/menu.js` handles only outside clicks and Escape, with no Up/Down/Home/End and no roving tabindex. Screen readers switch to application mode for `role="menu"` and expect arrow keys. Either implement the pattern or drop the roles; a disclosure is the recommended pattern for navigation menus.

**22. Accessible names are hard-coded in English (verified).** `pagination()` lets you change the visible `‹ ›` but always announces "Previous page", "Next page" and "Page N" (`navigation.js:140, 150, 152`). The toast close button is always "Dismiss" (`runtime/toast.js:48`).

**23. `controlId()` duplicates and gaps (verified).** Two `textField({ name: 'q' })` on one page both get `id="su-q"`, so the second label points at the first input. A label-only field with a non-Latin label (`'Имя'`) slugs to nothing, so it has no `id` and no `for`, and the label isn't associated with its input.

**24. `chip()` docs vs behaviour (verified).** The doc (`data-display.js:133`) says "passing `onclick` … makes it a button". It renders `<span onclick>`, which isn't focusable or keyboard-operable. `as: 'button'` renders `<button>` without `type="button"`, so inside a form it submits.

**25. `registerIcons()` doesn't reach precomputed glyphs (verified).** `ALERT_ICONS` (`feedback.js:14`), `SUN_ICON` / `MOON_ICON` (`navigation.js:400`) and `STEP_TICK` (`sections.js`) are rendered at import time. After `registerIcons({ info })`, `icon('info')` changes but `alert()`'s default icon doesn't, and the theme toggle ignores a registered `sun`. That contradicts "the way to restyle a built-in".

**26. `select()` with an array `value` (verified).** `String(value) === String(optionValue)` (`inputs.js:308`) means `select({ multiple: true, value: ['a','b'] })` selects nothing. `choiceGroup` and `toggleGroup` both accept arrays.

**27. `steps()` vs `/su/steps.js` (verified).** For `current: 'x'` the server marks every step upcoming (`sections.js:182`), while the runtime falls back to step 0, with a comment claiming it uses the "Same rule the component follows" (`runtime/steps.js:55`).

**28. `theme()` / `themeScript()` sanitising (by reading).** `tokenValue` strips only `<` and `>` (`styles.js:129`), so a value containing `}` closes the rule and injects CSS if theme values ever come from user data. Keys and `selector` are inserted raw. `themeScript({ nonce })` interpolates `nonce` unescaped (`:249`), unlike `styles({ nonce })`, which goes through javascript-to-html.

**29. Link checker false results (by reading).** `parseInternalLink` decodes the fragment but not the path (`links.js:121`), so `/my%20post/` and `/caf%C3%A9/` are reported broken, which fails builds in `mode: 'error'`. `ANCHOR_PATTERN` and `ID_PATTERN` use `\bhref` and `\bid`, which also match `data-href=` and `data-id=`.

**30. Smaller items (by reading).**
- `readJson` returns the cached object itself in production (`data.js:85`), so one page mutating it changes it for every later page. Collections document this; `readJson` doesn't.
- `sort: 'title'` uses `localeCompare` with the machine's default locale (`data.js:451`), so order can differ between machines. `links.js:342` avoids exactly this for reproducibility.
- `runPagefind` only calls `close()` on success (`pagefind.js:238`).
- Lighthouse prints `90 < 90` when a score rounds to its threshold (`lighthouse.js:542`).
- `syncPublic: true` (default) writes `public/pagefind/` into the source tree on every build.
- `sitelo:ui-runtime` communicates through `process.env.SITELO_UI_BASE`, which leaks between builds run in the same process.

---

## What's in good shape

- HMAC signing uses `timingSafeEqual`, binds the island name into the MAC, and HTML-escapes props JSON into the attribute. Island names are allow-listed everywhere.
- The dev middlewares that touch the filesystem (`/su/*`, `/_sitelo/images/*`, Lighthouse static host) restrict names or check that resolved paths stay inside their root.
- The CSS pruner is careful: `:not()`, `:is()`/`:has()`, keyframes, and strings or comments in braces are handled. No `su-` class in the shipped sheets uses characters its tokenizer would miss.
- `minifyCss` leaves all 134 string literals in the five shipped sheets intact.
- Option normalizers across `images`, `lighthouse`, `linkCheck`, `pagefind` and `buildReport` validate types and fail before the build starts. `assetsDir` (#5) is the gap.
- The `.d.ts` files match the runtime exports one-to-one, and `tsc` checks the JSDoc against them in CI.

## Suggested order of work

1. **#1, #2, #5.** These delete user files. Each fix is small and local to `images.js` and `bin/sitelo.js`.
2. **#3, #4, #15.** Harden the islands entry points: guard `decodeURIComponent` and `new Request`, catch in the Node adapter, use own-property lookups.
3. **#6, #7.** Fix the markup corruption and the unescaped `textarea` value.
4. **#8 to #10.** Visible UI and accessibility bugs with clear fixes.
5. The rest as convenient. Each one could take a regression test next to the existing suites in `test/`.
