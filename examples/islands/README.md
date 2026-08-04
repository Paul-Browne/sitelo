# Server islands example

Static sitelo site + a small Node host that renders islands at request time.

## Run

```bash
npm install
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000). The page is static HTML; the time box is filled by `GET /_sitelo/islands/time`.

During development you can skip the Node host:

```bash
npm run dev
```

`sitelo` already serves islands from `src/islands/`.

## Layout

- `src/index.ht.js` — page with `island('time', …)`
- `src/islands/time.js` — server-only fragment (never copied to `dist/`)
- `src/islands.js` — client loader (`mountIslands()`)
- `server.js` — serves `dist/` + `createIslandsNodeHandler`

See the full walkthrough at [sitelo.js.org/examples/islands](https://sitelo.js.org/examples/islands).
