# sitelo on Railway

A static [sitelo](https://sitelo.dev) site with [server islands](https://sitelo.dev/docs/islands), ready to deploy on [Railway](https://railway.com).

The pages are built once, at deploy time. The box of numbers on the home page is an island: a region of the page rendered by the server on every request. Railway runs the small Node server in `server.js`, which serves the build and renders the islands.

## Run it locally

```bash
npm install
npm run dev        # dev server with live reload
npm run build      # write the site to dist/
npm start          # the production server, on http://localhost:3000
```

## Deploy

Push to the GitHub repo connected to your Railway service and Railway rebuilds. `railway.json` holds the settings:

| Setting | Value |
| --- | --- |
| Build | `npm run build` |
| Start | `npm start` |
| Healthcheck | `/` |

Railway sets `PORT`; the server listens on it. The build reads `RAILWAY_PUBLIC_DOMAIN` so `sitemap.xml` has the right URLs. Set `SITE_URL` (e.g. `https://example.com`) once you add a custom domain.

If your islands take props, set `SITELO_ISLANDS_SECRET` to a long random string in the service's variables. The build signs the props with it and the server refuses any it did not sign. See [Props are untrusted input](https://sitelo.dev/docs/islands).

## Layout

- `src/index.ht.js`: the home page, a function returning HTML
- `src/lib/layout.js`: the shell every page shares
- `src/islands/live.js`: the island, rendered per request and never copied into `dist/`
- `src/js/islands.js`: the client loader (`mountIslands()`) that fetches islands into the page
- `server.js`: serves `dist/` and renders `src/islands/`
- `railway.json`: Railway's build and deploy settings
- `AGENTS.md`: rules for AI coding tools working on this project

Add a page by adding a file: `src/about.ht.js` becomes `/about`. The [docs](https://sitelo.dev/docs) cover dynamic routes, data loading, images, and the `sitelo/ui` components this page is built from.
