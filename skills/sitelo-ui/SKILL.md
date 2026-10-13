---
name: sitelo-ui
description: Build sitelo pages with sitelo-ui (`sitelo/ui`), the component library of plain functions that return HTML strings. It covers layout, typography, forms, tables, tabs, modals, drawers, menus, alerts, toasts, carousels, hero and footer sections, theming, dark mode, preset looks and icons. Use when a sitelo project imports `sitelo/ui`, `sitelo/ui/client` or `sitelo/ui-extras`, or when the user wants UI components, a design system, theming, dark mode, a preset look (neumorphism, neubrutalism, superneon, terminal, blueprint) or icons on a sitelo site.
license: MIT
---

# sitelo-ui

`sitelo/ui` ships with sitelo. Every component is a function that returns a
string of HTML, so it drops into a template literal or a
[javascript-to-html](https://ht.js.org) tree. There is no compiler, no
virtual DOM and no hydration. Most components need no JavaScript at all.
The few that do fetch a tiny module from an inline event attribute.

Do not add React, shadcn, Tailwind UI or another component library to a
sitelo site that has this one. For pages, routing and data, see the
**sitelo** skill.

## Set up a page

```js
// src/index.ht.js
import { body, head, html, meta, title } from 'javascript-to-html'
import * as ui from 'sitelo/ui'

export default () =>
  html({ lang: 'en' },
    head(
      meta({ charset: 'utf-8' }),
      meta({ name: 'viewport', content: 'width=device-width, initial-scale=1' }),
      title('My site'),
      ui.styles(),                      // required: links the component stylesheet
    ),
    body(
      ui.container({ size: 'md' },
        ui.stack({ gap: 'md' },
          ui.heading({ level: 1 }, 'Hello'),
          ui.text({ variant: 'lead' }, 'Built from components.'),
          ui.button({ href: '/docs' }, 'Read the docs'),
        ),
      ),
    ),
  )
```

- **`styles()` must be in `<head>`.** It links `/su/ui-<hash>.css`, which
  sitelo serves in dev and writes into the build. Nothing needs copying.
  `styles({ inline: true })` inlines the sheet (about 11 kB gzipped) and
  suits a one-page site.
- **Under a sub-path** (a GitHub Pages project site at
  `user.github.io/repo`), build with `--base /repo/` and nothing else. The
  sheet and the runtime modules follow it to `/repo/su/` and land in
  `dist/su/`. Leave `uiClient.base` and `configureUiClient()` alone: they
  move the files elsewhere, and a path given to either must include the
  base. Do not hard-code `/su/`; `ui.stylesUrl()` is the sheet's URL.
- **Import as a namespace** (`import * as ui from 'sitelo/ui'`).
  `button`, `input`, `table`, `link`, `code`, `select` and `progress`
  collide with javascript-to-html's element functions. Each has a
  non-colliding alias: `textLink`, `dataTable`, `textInput`, `inlineCode`,
  `selectField`, `progressBar`. `footer` has `siteFooter`. The on/off
  switch is `toggle`, because `switch` is a reserved word. `toggleButton`
  is a separate component, a button that stays pressed.
- In template literals, interpolate the calls: `` `<main>${ui.card(…)}</main>` ``.

## Calling convention

```js
ui.button({ variant: 'soft', color: 'danger', id: 'del', 'data-id': 7 }, ui.icon('trash'), 'Delete')
```

- The first argument is an optional props object. Every further argument
  is a child, and arrays are flattened.
- Props the component knows are consumed. **Everything else becomes an
  attribute** on the root element, which covers `id`, `class`, `style`,
  `data-*` and `aria-*`.
- Shared vocabularies: `color` is `primary`, `neutral`, `success`,
  `warning` or `danger`. `size` is `sm`, `md` or `lg`. Spacing (`gap`,
  `padding`, `gutter`) is `none`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`,
  `3xl`, a number (a multiple of the spacing unit) or any CSS length.
- `href` turns `button`, `card`, `chip` and `listItem` into links.
- **Children are raw HTML.** That is how components nest. Escape text from
  APIs, CMSs or users before passing it as a child. Attribute values are
  escaped for you. For a code sample, `ui.code({ text: '<h1>Hi</h1>' })`
  escapes.
- Some components take data instead of children: `table({ columns, rows })`,
  `tabs({ items })`, `accordion({ items })`, `breadcrumbs({ items })`,
  `steps({ items, current })`, `select({ options })`,
  `choiceGroup({ options })`, `toggleGroup({ items })`,
  `carousel({ items })` and `timeline({ items })`.

The props of every component are in
[references/components.md](references/components.md). Read it before using
a component for the first time. The TypeScript declarations
(`node_modules/sitelo/src/ui/index.d.ts`) are the final word.

## What there is

| Group | Components |
| --- | --- |
| Layout | `container` `stack` `grid` `divider` `aspectRatio` `card` `cardHeader` `cardTitle` `cardSubtitle` `cardMedia` `cardBody` `cardFooter` |
| Typography | `text` `heading` `link` `code` `kbd` `visuallyHidden` `prose` |
| Inputs | `button` `iconButton` `buttonGroup` `field` `input` `textarea` `select` `slider` `textField` `textareaField` `selectField` `sliderField` `checkbox` `radio` `toggle` `toggleButton` `toggleGroup` `choiceGroup` |
| Data display | `avatar` `avatarGroup` `badge` `chip` `tooltip` `table` `list` `listItem` `figure` `carousel` |
| Feedback | `alert` `empty` `progress` `skeleton` `toasts` |
| Navigation | `breadcrumbs` `pagination` `tabs` `appBar` `appBarNav` `appBarSpacer` `appBarActions` `navLink` `themeToggle` |
| Overlays | `modal` `drawer` `closeButton` `menu` `menuItem` `menuSeparator` `accordion` `accordionItem` `collapsible` |
| Sections | `hero` `footer` `siteFooter` `footerColumn` `footerBottom` `stat` `statGroup` `steps` `timeline` `timelineItem` `mockup` |
| Icons | `icon` `iconNames` `fillableIcons` `hasIcon` `registerIcons` `iconSet` |
| Styling | `styles` `stylesheet` `stylesUrl` `theme` `themeScript` `configureUiClient` |

Use `prose()` to wrap HTML from Markdown or a CMS so that headings, lists
and tables are styled.

## Interactivity is built in

Do not write JavaScript for these. They are native elements:

```js
// A modal (a <dialog>) opened and closed with invoker commands: no script
ui.button({ commandfor: 'confirm', command: 'show-modal' }, 'Delete…')
ui.modal({
  id: 'confirm',                                        // required
  title: 'Delete this page?',
  footer: [
    ui.button({ variant: 'ghost', commandfor: 'confirm', command: 'close' }, 'Cancel'),
    ui.button({ color: 'danger', type: 'submit', form: 'delete-form' }, 'Delete'),
  ],
}, ui.text('This cannot be undone.'))
```

- `modal` and `drawer` are `<dialog>` elements, opened by
  `commandfor` + `command="show-modal"`. Browsers without invoker commands
  load a fallback automatically. **Do not use `popovertarget`**: that was
  the old API and no longer opens them. The build warns about it.
- `menu` is a `<details>`. Its `trigger` is the label text, so do not pass
  a `button()`.
- `accordion` uses `<details name>`. `tooltip` is CSS.
- `tabs` with `panel` items swap panels with CSS radios. With `href` items
  they are links. With both, the choice lives in the URL fragment.
- Dismissible `alert`s, menus closing on an outside click or Escape,
  `themeToggle`, and a slider's value readout each `import('/su/…')` their
  own module when first used. No entry file is needed.
- With `themeToggle()`, also put `ui.themeScript()` in `<head>` so the
  stored theme applies before first paint.

To change component state from your own client script, import from
`sitelo/ui/client` in a bundled script (`<script type="module" src="/main.js">`):

```js
import { toast, setProgress, setBadge, setPressed, setSlider, setSlide, setStep, setTheme, getTheme, toggleTheme } from 'sitelo/ui/client'

toast('Saved', { color: 'success' })     // needs ui.toasts() rendered somewhere on the page
setProgress('upload', 40, { max: 100 })  // by element or id; null returns it to indeterminate
```

Each setter has a matching getter: `getProgress`, `getBadge`, `getPressed`,
`getSlider`, `getSlide`, `getStep`. A getter returns `null` when the
element is not on the page.

## Styling and theming

- `ui.theme({ primary: { base: '#5b5bd6', hover: '#4a4ac4', fg: '#fff' }, radiusMd: '2px' }, { dark: { primary: { base: '#8f8ff0' } } })`
  goes after `styles()` and overrides the `--su-*` design tokens.
- Dark mode follows `prefers-color-scheme` unless an ancestor sets
  `data-theme` or `data-su-theme` to `light` or `dark`.
- `ui.styles({ preset: 'neumorphism' | 'neubrutalism' | 'superneon' | 'terminal' | 'blueprint' })`
  restyles everything at once. Pair `terminal` and `blueprint` with
  `ui.iconSet('square')`.
- Set `pruneCss: true` in `sitelo.config.js` to ship only the rules the
  built pages use. Markup the build never sees, such as an island's, needs
  `pruneCss: { keep: ['su-card', 'su-btn*'] }`.
- For your own CSS, use the tokens (`var(--su-space-md)`,
  `var(--su-text-muted)`, `var(--su-primary)`) rather than hard-coded
  values, so that themes and dark mode carry through.

Token names, presets and scoping are in
[references/theming.md](references/theming.md).

## Icons

```js
ui.icon('check')                              // decorative: aria-hidden
ui.icon('trash', { label: 'Delete' })         // meaningful on its own: role="img"
ui.icon('heart', { filled: true, size: 'lg' })
ui.icon('spinner', { spin: true })
ui.iconButton({ label: 'Close', icon: ui.icon('close') })   // label is required; children are ignored
```

The glyphs are inline SVG in `currentColor`. Names, aliases, fillable
icons, the square set and custom icons are in
[references/icons.md](references/icons.md). An unknown name renders an
empty string, so check it with `ui.hasIcon(name)`.

## Extras

`sitelo/ui-extras` holds components with sheets of their own, currently
`grain()` (film grain). Put `grainStyles()` in `<head>` next to `styles()`.
`setGrain()` and `getGrain()` are in `sitelo/ui-extras/client`.

## Mistakes to avoid

- Leaving out `ui.styles()`, which renders unstyled markup.
- `import { button } from 'sitelo/ui'` beside `import { button } from 'javascript-to-html'`.
- `iconButton({ 'aria-label': … }, icon)`. Use `iconButton({ label, icon })`.
- `modal()` or `drawer()` without an `id`, or triggers using
  `popovertarget`.
- Writing a click handler to open a modal, toggle a menu or switch tabs.
  They already work.
- `toast()` with no `toasts()` region on the page, which returns `null`.
- Passing unescaped user or CMS text as children.
- Using `pruneCss` with server islands that render `su-` classes and no
  `keep` list.

## Further docs

- https://sitelo.dev/docs/ui.md is the guide.
- https://sitelo.dev/ui has a page per component with live examples. Each
  page has a Markdown copy at the same URL plus `.md`, for example
  https://sitelo.dev/ui/modal.md.
- https://sitelo.dev/ui/theming.md covers tokens, dark mode and presets.
- `examples/ui` in the sitelo repo renders every component on one page.
