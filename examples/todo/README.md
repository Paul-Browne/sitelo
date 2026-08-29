# Todo app

A tiny interactive todo list: sitelo builds the static HTML shell; event handlers use **inline dynamic imports** to load `/js/todo.js` on demand.

```html
<form onsubmit="event.preventDefault(); import('/js/todo.js').then((m) => m.handleSubmit(this))">
```

## Run

```bash
npm install
npm run dev
```

Build static output:

```bash
npm run build
```

Then open `dist/` on any static host (or `npx serve dist`).

## What to notice

- No `<script type="module" src="…">` on the page — JS loads when an event fires (and once on `onload` to hydrate)
- sitelo still discovers `import('/js/todo.js')` in the HTML and bundles it into `dist/js/todo.js`
- Interactivity is plain exported functions; the page stays a static file

See [sitelo.dev/examples/todo](https://sitelo.dev/examples/todo) and [Assets & styling](https://sitelo.dev/docs/assets).
