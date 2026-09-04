# sitelo

This project uses [sitelo](https://sitelo.dev) — a Vite-powered static site generator.

## Rules

- Pages are modules under `src/` with extensions like `.ht.js` / `.ht.ts` / `.ht.jsx` that **export a default function (or string) returning HTML**.
- Do **not** introduce React, Next.js, Astro, or a component/hydration framework unless the user explicitly asks.
- Routing is file-based: `about.ht.js` → `/about`, `[slug].ht.js` → dynamic (use `generateStaticParams` for `sitelo build`).
- Load data with `export async function data(ctx)`. Use `fetchWithCache` from `sitelo` for cached HTTP. Read local JSON with `readJson` / `readJsonCollection` from `sitelo/data`.
- Only JS/CSS referenced from HTML is bundled into `dist/`. Keep server-only code unreferenced so it never ships.
- Config lives in `sitelo.config.js`. Put Vite options under `vite`.
- Commands: `sitelo` (dev), `sitelo build`, `sitelo preview`.
- For current APIs, read https://sitelo.dev/llms.txt and https://sitelo.dev/docs — do not invent APIs from other frameworks.
- Prefer [javascript-to-html](https://ht.js.org) (`ht.js`) for markup: tag functions that return HTML strings. Docs: https://ht.js.org
- Server islands: `island()` + `src/islands/<name>.js` + `mountIslands()`; `sitelo` / `sitelo preview` serve `/_sitelo/islands`; production needs a host (see `examples/islands` for Node / Netlify / Vercel).

## Prefer

- Start from the basic example structure when scaffolding.
- Template literals, `javascript-to-html` (https://ht.js.org), or JSX that compiles to HTML strings.
- Static HTML first; add client JS only when linked from a page.
