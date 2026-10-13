# Theming

## Getting the styles in

| Call | Returns |
| --- | --- |
| `styles(options?)` | A `<link>` to `/su/ui-<hash>.css`, which sitelo serves in dev and writes into the build. Options: `inline` (a `<style>` instead), `minify`, `nonce`, `hash` (default `true`), `base`, `preset` |
| `stylesUrl(options?)` | The href alone, for your own `<link media integrity>` or a preload hint |
| `stylesheet(options?)` | The raw CSS string (`{ minify, preset }`), for hosting it yourself |
| `theme(tokens, options?)` | A `<style>` of token overrides. Place it **after** `styles()` |
| `themeScript(options?)` | A blocking inline `<script>` that applies the stored light or dark choice before first paint. Use it with `themeToggle()` |

`pruneCss: true` in `sitelo.config.js` rewrites the linked sheet (with a new
hash) to only the rules whose classes appear in the built pages and the
runtime scripts. A site using a dozen components lands around 2–3 kB
gzipped. It runs on builds only. Classes that only appear at request time
(in islands) need `pruneCss: { keep: ['su-card', 'su-btn*'] }`.

## Overriding tokens

```js
head(
  ui.styles(),
  ui.theme(
    {
      primary: { base: '#5b5bd6', hover: '#4a4ac4', fg: '#fff' }, // a palette
      radiusMd: '2px',                                          // camelCase becomes --su-radius-md
      fontSans: '"Inter", system-ui, sans-serif',
      '--brand-accent': '#f60',                                 // used exactly as written
    },
    { dark: { primary: { base: '#8f8ff0' } } },                 // dark-only overrides
  ),
)
```

- camelCase keys become kebab-case `--su-*` properties: `radiusMd` gives
  `--su-radius-md`.
- A palette object expands slot by slot. `base` is the palette's own
  variable (`--su-primary`). `softFg` gives `--su-primary-soft-fg`.
- A key starting with `--` is used as written.
- `{ selector: '.marketing' }` scopes the overrides to a subtree. The
  default is `:root`.
- `{ dark: {...} }` applies under `prefers-color-scheme: dark` and under an
  explicit `data-theme="dark"` / `data-su-theme="dark"`.

The shipped palettes pass WCAG AA in both themes. Custom colours do not
get that check, so verify `fg` against `base` yourself.

## Tokens

| Group | Properties |
| --- | --- |
| Palettes | `primary`, `neutral`, `success`, `warning`, `danger`, each with nine slots: `--su-<name>` (the `base` slot), `-hover`, `-active`, `-fg`, `-soft`, `-soft-hover`, `-soft-fg`, `-border`, `-ring` |
| Surfaces | `--su-bg`, `--su-bg-subtle`, `--su-surface`, `--su-surface-2`, `--su-surface-hover`, `--su-overlay` |
| Text | `--su-text`, `--su-text-muted`, `--su-text-subtle` |
| Borders | `--su-border`, `--su-border-strong`, `--su-border-width`, `--su-ring-width` |
| Spacing | `--su-space-unit`, `--su-space-none`, `-xs`, `-sm`, `-md`, `-lg`, `-xl`, `-2xl`, `-3xl` |
| Radii | `--su-radius-sm`, `-md`, `-lg`, `-full` |
| Shadows | `--su-shadow-sm`, `-md`, `-lg` |
| Type | `--su-font-sans`, `--su-font-mono`, `--su-text-xs` to `--su-text-4xl`, `--su-leading-tight`, `-snug`, `-normal`, `--su-weight-normal`, `-medium`, `-semibold`, `-bold` |
| Motion | `--su-transition` |

Use these in your own CSS, for example
`body { background: var(--su-bg); color: var(--su-text) }`, so that it
follows the theme and dark mode.

## Dark mode

Dark mode resolves from `prefers-color-scheme`. Setting `data-theme` or
`data-su-theme` to `light` or `dark` on any ancestor overrides it. For a
user toggle:

```js
head(ui.styles(), ui.themeScript())
// …
ui.appBar({ brand: 'Site' }, ui.appBarSpacer(), ui.appBarActions(ui.themeToggle()))
```

The toggle wires itself. From your own script, use
`setTheme('light' | 'dark' | 'system')`, `getTheme()` and `toggleTheme()`
from `sitelo/ui/client`.

## Presets

`styles({ preset })` links a second sheet after the core one, and `theme()`
still applies on top of it. Each preset has a page at
`https://sitelo.dev/ui/theming/<preset>.md`.

| Preset | Look | Notes |
| --- | --- | --- |
| `neumorphism` | Soft UI: controls raised from the page or pressed into it | The page background must be `var(--su-bg)` |
| `neubrutalism` | Flat colour, thick ink outlines, hard unblurred shadows | `--su-nb-ink` sets the line colour and `--su-nb-lift` the offset |
| `superneon` | Near-black violet, hairlines, neon gradient rims and glows | Palettes gain `glow` and `glowEnd`. `body { background: var(--su-sn-backdrop) }` |
| `terminal` | A monospace console, cyan accent, reverse-video selection, no rounding or shadows | `body { background: var(--su-bg); color: var(--su-text); font-family: var(--su-font-mono) }`. Pair with `iconSet('square')` |
| `blueprint` | A technical drawing: hairlines, square corners, corner registration marks, monospace capital labels | `body { background: var(--su-bp-backdrop) }` rules a grid. `--su-bp-accent` and `--su-bp-mark`. Pair with `iconSet('square')` |

Every preset has a light and a dark form.
