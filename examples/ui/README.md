# sitelo-ui example

Every component in `sitelo/ui`, on one page.

```bash
npm install
npm run dev
```

The page pulls its styles from `styles()` — an inline `<style>` in the
head — so there is no stylesheet to copy and nothing to configure. The
only script is `src/main.js`, which imports `sitelo/ui/client` for the
handful of components that need it: tabs with panels, dismissible
alerts, the theme toggle, and closing a menu by clicking outside it.

Delete that import and the page still works: the tabs show their active
panel, menus still open, and the alert keeps its close button pointed at
nothing.
