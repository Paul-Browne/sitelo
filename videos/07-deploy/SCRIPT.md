# Episode 7: Deploying

**Length:** ~12 min · **Starts from:** `06-sitelo-ui` · **Ends at:** this folder

Weeknight Kitchen goes live on Netlify: static pages from `dist/`, islands
from a small function, signed props, a daily rebuild to pick up new data,
and CI that runs the build, knip and Lighthouse on every push.

> Nothing in this folder has been deployed. The function was tested by
> calling it locally with the same `Request` Netlify passes it: both islands
> render, signed props pass, tampered props get a 403, and it loads only
> `sitelo` (islands and ui) and `javascript-to-html`. Do a dry run on a
> throwaway Netlify site before recording.

## YouTube

**Title:** Deploy a static site with server islands to Netlify (sitelo, ep. 7)

**Description:** The last episode. We deploy the recipe site (static pages
plus one function for the server islands), sign island props, rebuild
daily to keep the data fresh, and run the build, knip and Lighthouse in CI.

**Chapters**

```
0:00 What we're deploying
1:00 The fastest deploy: drag and drop
2:30 Deploying from Git
4:15 A function for the islands
6:30 Signing island props
8:15 Other hosts
9:30 Keeping the data fresh
10:45 CI
11:30 That's the series
```

## 1. What we're deploying (0:00–1:00)

**Say:**
- `dist/` is plain files. Any static host can serve it.
- The islands are the one part that needs a server. On Netlify that's a
  function, a dozen lines.

## 2. The fastest deploy: drag and drop (1:00–2:30)

**Do:**

```bash
npm run build
```

Drag `dist/` onto app.netlify.com/drop.

**Show:** the site live in seconds. Click around: pages, images and search
all work. Then the home page: the "what should I cook" box shows its
fallback, the link to quick recipes. Recipe pages show the comments
skeleton. (Make sure that fallback reads as a real section on camera, since
it's the point being made.)

**Say:** this is graceful degradation in action. Without an islands
endpoint, the fallback HTML stays. Nothing breaks.

## 3. Deploying from Git (2:30–4:15)

**Do:** create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "22"
```

and point `site` at the real address:

```js
// sitelo.config.js
// Netlify sets URL to the site's address during its builds
site: process.env.URL ?? 'https://weeknight-kitchen.example',
```

Push to GitHub, then in Netlify: Add new site → Import an existing project
→ pick the repo. Netlify reads `netlify.toml`, so there is nothing to fill
in.

**Show:** the deploy log: the install, the sitelo build with its image,
Pagefind and link-check lines, then the build report.

**Say:**
- sitelo needs Node 20.19+ or 22.12+, so pin it.
- `URL` means the sitemap gets the real domain without hard-coding it.
- The first build encodes every image (about 10 seconds here). The encode
  cache lives in `node_modules/.sitelo`. In the dry run, check the second
  deploy's `images` time to see whether Netlify kept it, and say so.

## 4. A function for the islands (4:15–6:30)

**Do:** create `netlify/functions/islands.mjs`:

```js
import { createIslandsHandler } from 'sitelo/islands/server'

// The same island modules `sitelo` serves in dev and preview
const handleIslands = createIslandsHandler({
  islands: {
    'whats-cooking': () => import('../../src/islands/whats-cooking.js'),
    comments: () => import('../../src/islands/comments.js'),
  },
})

export default async (request) =>
  (await handleIslands(request)) ?? new Response('Not found', { status: 404 })

// Netlify routes this path straight to the function: no redirect needed
export const config = { path: '/_sitelo/islands/*' }
```

Push.

**Show:** the live home page with the Network tab: `/_sitelo/islands/whats-cooking`
→ 200, and the recipe appears. Refresh: a different one.

**Say:**
- `createIslandsHandler` takes a web `Request` and returns a `Response`, or
  `null` if the request isn't for an island.
- `config.path` puts the function on the URL the client already calls.
- This is why the island used plain `fetch` back in episode 4: the bundle
  holds `sitelo/islands/server`, `sitelo/ui` and javascript-to-html, not
  Vite.
- Island responses are `Cache-Control: no-store`, so every visitor gets a
  fresh render.
- Add `netlify/functions/*.mjs!` to the `entry` list in `knip.js`, or knip
  reports the function as unused.

## 5. Signing island props (6:30–8:15)

**Do:**

```bash
openssl rand -hex 32
```

In Netlify: Site configuration → Environment variables → add
`SITELO_ISLANDS_SECRET` with that value, available to builds and
functions. Trigger a deploy.

**Show:**
- View source on a recipe page: the placeholder now carries a signature.

  ```html
  <div data-sitelo-island="comments" data-sitelo-props="{&quot;recipeId&quot;:1}" data-sitelo-sig="8ff6…" …>
  ```

- Copy the island's request URL, change the recipe id, open it: `403
  Invalid island props signature`.

**Say:**
- The build signs each island's props with the secret, and the function
  checks the signature before rendering. The same variable is read at
  build time and at runtime, so on Netlify setting it once covers both.
- The signature covers the island's name too, so it can't be replayed
  against a different island.
- Signing proves the props came from your build. It doesn't hide them.
  They're still in the HTML, so never put secrets in props.
- The what's-cooking island has no props, so it has nothing to sign.

## 6. Other hosts (8:15–9:30)

**Show:** `examples/basic` in the sitelo repo, which has a config file for
fifteen hosts.

**Say:**
- **Vercel:** `vercel.json` plus an `api/islands/[...path].js` function.
  `examples/islands` has both.
- **Cloudflare:** `wrangler.jsonc` with `assets.directory: "./dist"`.
- **GitHub Pages:** static only. A project site at `user.github.io/repo`
  needs `sitelo build --base /repo/`, and internal links need the base
  too; `linkCheck` catches the ones that don't. Islands keep their fallback.
- **Your own server:** the `examples/islands` server serves `dist/` and
  islands with `createIslandsNodeHandler`.

## 7. Keeping the data fresh (9:30–10:45)

**Say:** recipes are fetched at build time. If the API changes, the site
doesn't until it's rebuilt.

**Do:**
- Netlify: Site configuration → Build & deploy → Build hooks → add one, and
  copy the URL.
- GitHub: repo Settings → Secrets → `NETLIFY_BUILD_HOOK` = that URL.
- Create `.github/workflows/rebuild.yml` (in this folder): a daily cron
  that POSTs to the hook. Run it once by hand from the Actions tab.

**Show:** a new deploy appearing in Netlify, triggered by the hook.

## 8. CI (10:45–11:30)

**Do:** create `.github/workflows/ci.yml` (in this folder): `npm ci`, then
build, `npm run knip` and `npm run lighthouse` on every push and pull
request.

**Say:**
- A broken link, a missing asset, dead code or an accessibility regression
  now fails the check before it reaches the site.
- GitHub's Ubuntu runners already have Chrome, which Lighthouse needs.
- This is why episode 5 left performance out of the thresholds: on a
  shared runner it scores lower than on your laptop, every time.

## 9. That's the series (11:30–12:00)

**Show:** the live site, end to end, in light and dark.

**Say:**
- Seven episodes: functions that return HTML, data at build time, routes
  from file names, islands for what has to be fresh, add-ons for speed,
  search and hygiene, a component library, and a deploy.
- Every page is still a function that returns a string.
- Code for every episode is linked below. Tell me in the comments what
  you'd like to see next.

## Files changed in this episode

```
netlify.toml                    new
netlify/functions/islands.mjs   new
.github/workflows/ci.yml        new
.github/workflows/rebuild.yml   new
sitelo.config.js                site from process.env.URL
knip.js                         the function as an entry
```
