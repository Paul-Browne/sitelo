# Server islands example

Static sitelo site + a small Node host that renders islands at request time.

## Run

```bash
npm install
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000). The page is static HTML; the time box is filled by `GET /_sitelo/islands/time`.

During development (or after a build, via preview) you can skip the Node host:

```bash
npm run dev       # Vite SSR loads src/islands
npm run preview   # serves dist/ + islands from disk
```

## Deploy

| Host | Stub |
| --- | --- |
| **Node** | `npm run build && npm start` (`server.js`, set `PORT`) |
| **Netlify** | `netlify.toml` + `netlify/functions/islands.mjs` |
| **Vercel** | `vercel.json` + `api/islands/[...path].js` |
| **Static-only** | Placeholders keep their fallback until you add a function |

Add each island name to the serverless stubs’ `islands` map (or use `createIslandsFromDirectory` on Node).

## Layout

- `src/index.ht.js` — page with `island('time', …)`
- `src/islands/time.js` — server-only fragment (never copied to `dist/`)
- `src/js/islands.js` — client loader (`mountIslands()`)
- `server.js` — serves `dist/` + `createIslandsFromDirectory`
- `netlify.toml` / `netlify/functions/` — Netlify rewrite + function
- `vercel.json` / `api/islands/` — Vercel rewrite + serverless route

See the full walkthrough at [sitelo.js.org/examples/islands](https://sitelo.js.org/examples/islands).
