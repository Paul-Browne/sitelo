# sitelo-ui example

Every component in `sitelo/ui`, on one page.

```bash
npm install
npm run dev
```

The page pulls its styles from `styles()` — a `<link>` in the head, which
sitelo's plugin serves in dev and writes into the build — so there is no
stylesheet to copy and nothing to configure.

The handful of components that need a script go and get it themselves,
from an inline `onclick`: tabs with panels, dismissible alerts, the
theme toggle, and closing a menu by clicking outside it. Nothing is
fetched until you interact with one, and until then the page still
works — the tabs show their active panel, menus open from their own
summary, the dismiss button does nothing.

The one script here is `src/main.js`, and it exists for `toast()` alone:
nothing on the page triggers a toast, so something has to.
