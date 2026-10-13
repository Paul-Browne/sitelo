# Component reference

Signatures use `(props?, ...children)` unless noted. Every component also
accepts `class`, `style`, `id`, and any other attribute, which passes
through to the root element. Shared values:

- `Color`: `primary`, `neutral`, `success`, `warning`, `danger`
- `Size`: `sm`, `md`, `lg`
- `Space`: `none`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, a number, or a CSS length

The examples assume `import * as ui from 'sitelo/ui'`.

## Layout

| Component | Props |
| --- | --- |
| `container` | `size` (`sm` `md` `lg` `xl` `full`), `width` (raw max-width), `gutter`, `as` |
| `stack` | `direction` (`column` default, or `row`), `gap`, `align`, `justify`, `wrap`, `inline`, `as` |
| `grid` | `columns` (a count, or a raw `grid-template-columns`), `min` (auto-fit track minimum, default `16rem`), `gap`, `align`, `as` |
| `divider` | `orientation` (`horizontal` or `vertical`), `spacing` |
| `aspectRatio` | `ratio` (default `16 / 9`), `as`. The child fills the box and is cropped |
| `card` | `variant` (`outlined` `elevated` `flat`), `href` (makes the whole card a link), `padding` |
| `cardHeader` | `title`, `subtitle` |
| `cardTitle` | `as` |
| `cardSubtitle`, `cardBody` | (children only) |
| `cardFooter` | `divided` |
| `cardMedia(props)` | `src`, `alt`, `ratio` |

```js
ui.grid({ min: '18rem', gap: 'lg' },
  ...posts.map((post) =>
    ui.card({ href: `/blog/${post.slug}` },
      ui.cardMedia({ src: post.image, alt: '', ratio: '16 / 9' }),
      ui.cardHeader({ title: escapeHtml(post.title), subtitle: post.date }),
      ui.cardBody(ui.text({ tone: 'muted', lines: 3 }, escapeHtml(post.excerpt))),
    ),
  ),
)
```

## Typography

| Component | Props |
| --- | --- |
| `text` | `variant` (`h1`–`h6`, `lead`, `body`, `small`, `caption`, `overline`), `tone` (`default` `muted` `subtle`), `align` (`start` `center` `end`), `truncate`, `lines` (clamp), `as` |
| `heading` | `level` (1–6, default 2), `size` (a text variant, when the look should differ from the level) |
| `link` / `textLink` | `href`, `color`, `subtle` (inherits colour until hovered), `external` (adds `target="_blank"` and `rel`) |
| `code` / `inlineCode` | `text` (escaped literal code). Children render as HTML, for pre-highlighted output |
| `kbd`, `visuallyHidden` | (children only) |
| `prose` | `size`, `as`. Styles raw HTML from Markdown or a CMS |

## Inputs

| Component | Props |
| --- | --- |
| `button` | `variant` (`solid` default, `soft` `outline` `ghost` `link`), `color` (default `primary`), `size`, `href` (renders `<a>`), `startIcon`, `endIcon`, `loading`, `disabled`, `block` (full width), `type` (default `button`), `commandfor`, `command` |
| `iconButton(props)` | **`label` (required)**, `icon`, plus every `button` prop. Children are ignored |
| `buttonGroup` | `label` |
| `field` | `label`, `help`, `error`, `required`, `for`. Wraps a control you pass as a child |
| `input(props)` / `textInput` | `type`, `size`, `name`, `value`, `placeholder`, `startAdornment`, `endAdornment`, `invalid`, `disabled`, `required` |
| `textarea(props)` | `size`, `rows`, `name`, `value`, `placeholder`, `invalid`, `disabled`, `required` |
| `select` | `options` (strings, numbers, `{ value, label, disabled }`, or groups `{ label, options }`), `value`, `multiple`, `placeholder`, `size`, `name`, `invalid`, `disabled`, `required` |
| `textField(props)`, `textareaField(props)`, `selectField(props)`, `sliderField(props)` | The control's props plus `label`, `help`, `error`, `required`, `fieldClass`. These are the labelled versions: prefer them in forms |
| `checkbox(props)`, `radio(props)`, `toggle(props)` | `label`, `color`, `name`, `value`, `checked`, `disabled`. `toggle` is the on/off switch |
| `choiceGroup` | `legend`, `name`, `options`, `type` (`radio` or `checkbox`), `value`, `help`, `direction`, `as` |
| `slider(props)` | `min`, `max`, `step`, `value`, `showValue`, `color`, `name`, `invalid`, `disabled` |
| `toggleButton` | `pressed`, `variant` (`outline` `ghost` `soft`), `size`, `disabled` |
| `toggleGroup` | `items` (`{ value, label, href, disabled }` or strings), `value` (an array for several), `label`, `size`, `variant`. Items with `href` become links marked `aria-current` |

```js
`<form method="post" action="/subscribe">
  ${ui.stack({ gap: 'md' },
    ui.textField({ label: 'Email', name: 'email', type: 'email', required: true, help: 'No spam.' }),
    ui.selectField({ label: 'Plan', name: 'plan', options: ['Free', 'Pro'], placeholder: 'Choose…' }),
    ui.checkbox({ name: 'terms', label: 'I agree to the terms' }),
    ui.button({ type: 'submit' }, 'Subscribe'),
  )}
</form>`
```

For a field with an error, pass `error: 'Enter a valid email'` to the field.
It sets `invalid` on the control and wires `aria-describedby`.

## Data display

| Component | Props |
| --- | --- |
| `avatar` | `src`, `alt`, `name` (initials when there is no `src`), `size`, `square`, `color` |
| `avatarGroup` | `max`, `size` |
| `badge` | `content`, `color`, `dot`, `max` (default 99, above it shows `99+`), `label`. Wraps its child |
| `chip` | `color`, `variant` (`soft` `outline` `solid`), `size`, `href`, `dot`, `onclick` (renders a button), `as` |
| `tooltip` | `content`, `placement` (`top` or `bottom`), `label` (also expose it to screen readers). Wraps its child |
| `table` / `dataTable` | `columns: [{ key, header, align, render: (row) => html }]`, `rows`, `caption`, `striped`, `hover`, `dense` |
| `list` | `plain`, `as` |
| `listItem` | `title`, `description`, `start`, `end`, `href`, `interactive`, `as` |
| `figure` | `src`, `alt`, `caption`, `ratio` |
| `carousel` | `items` (children or `{ content, label, id }`), `perView` (default 1, fractions allowed), `min`, `gap`, `align`, `snap` (`mandatory` `proximity` `false`), `dots`, `arrows`, `color`, `label`, `previousLabel`, `nextLabel`, `slideLabel(i, n)`, `name`, `scrollMargin`, `as` |

```js
ui.table({
  caption: 'Orders',
  striped: true,
  columns: [
    { key: 'id', header: '#' },
    { key: 'customer', header: 'Customer', render: (row) => escapeHtml(row.customer) },
    { key: 'total', header: 'Total', align: 'end', render: (row) => `€${row.total.toFixed(2)}` },
  ],
  rows: orders,
})
```

Cells render as HTML, so escape untrusted values in `render`.

## Feedback

| Component | Props |
| --- | --- |
| `alert` | `color`, `variant` (`soft` `outline` `solid`), `title`, `icon` (markup, or `false`), `dismissible`, `dismissLabel` |
| `progress(props)` / `progressBar` | `value` (omit it for indeterminate), `max`, `color`, `label`, `showValue`, `height`. Give it an `id` to drive it with `setProgress` |
| `skeleton(props)` | `variant` (`rect` `text` `circle`), `width`, `height`, `lines` |
| `empty` | `icon`, `title`, `description`. Children are actions |
| `toasts` | Renders the live region that `toast()` from `sitelo/ui/client` appends to. One per page |

## Navigation

| Component | Props |
| --- | --- |
| `breadcrumbs` | `items` (`{ label, href }` or strings; the last is the current page), `separator`, `label` |
| `pagination(props)` | `page`, `count`, `href: (n) => url` (without it the pages render as buttons), `siblings`, `color`, `label`, `previousLabel`, `nextLabel`, `previousPageLabel`, `nextPageLabel`, `pageLabel` |
| `tabs` | `items: [{ id, label, panel, href, active, disabled }]`, `value` (the active id), `variant` (`underline` or `pills`), `color`, `label`, `name`, `scrollMargin` |
| `appBar` | `brand`, `href` (the brand link, default `/`), `sticky` (`true`, or `'auto'` to hide while scrolling down), `blur`, `as` |
| `appBarNav`, `appBarActions` | (children only) |
| `appBarSpacer(props)` | Pushes what follows to the end |
| `navLink` | `href`, `current` (sets `aria-current`), `color` |
| `themeToggle(props)` | `label`, `variant`, `color`. Put `themeScript()` in `<head>` alongside it |

```js
ui.appBar({ brand: 'Acme', sticky: 'auto' },
  ui.appBarNav(
    ui.navLink({ href: '/docs', current: page.routePath === '/docs' }, 'Docs'),
    ui.navLink({ href: '/blog' }, 'Blog'),
  ),
  ui.appBarSpacer(),
  ui.appBarActions(ui.themeToggle()),
)

// Panels that swap in place, with CSS only
ui.tabs({ label: 'Install', items: [
  { id: 'npm', label: 'npm', panel: ui.code({ text: 'npm i -D sitelo' }) },
  { id: 'pnpm', label: 'pnpm', panel: ui.code({ text: 'pnpm add -D sitelo' }) },
] })

// One page per tab
ui.tabs({ items: [{ label: 'Overview', href: '/p/overview', active: true }, { label: 'Specs', href: '/p/specs' }] })
```

## Overlays

| Component | Props |
| --- | --- |
| `modal` | **`id` (required)**, `title`, `size`, `footer`, `closable`, `closeLabel`, `lockScroll` (default `true`) |
| `drawer` | **`id` (required)**, `title`, `side` (`start` or `end`), `width`, `closable`, `closeLabel`, `lockScroll` |
| `closeButton(props)` | `target` (the dialog id), `label` |
| `menu` | `trigger` (label content: **not** a `button()`), `icon`, `label` (required when there is an icon and no trigger), `variant`, `color`, `size`, `align` (`start` or `end`), `triggerClass` |
| `menuItem` | `href` (renders a link; otherwise a button), `icon`, `as`, `commandfor`, `command` |
| `menuSeparator(props)` | |
| `accordion` | `items: [{ title, content, open }]`, `name` (a shared name makes the sections exclusive) |
| `accordionItem` | `title`, `open`, `name` |
| `collapsible` | `trigger` (text and icons only), `open` |

Open a dialog with `ui.button({ commandfor: id, command: 'show-modal' }, …)`
and close it with `command: 'close'`. A `menuItem` can open a dialog the
same way. Never use `popovertarget`.

```js
ui.button({ variant: 'ghost', commandfor: 'nav', command: 'show-modal', startIcon: ui.icon('menu') }, 'Menu')
ui.drawer({ id: 'nav', title: 'Navigation', side: 'start' },
  ui.list({ plain: true }, ui.listItem({ href: '/' , title: 'Home' }), ui.listItem({ href: '/docs', title: 'Docs' })),
)

ui.menu({ trigger: 'Actions', align: 'end' },
  ui.menuItem({ href: '/edit', icon: ui.icon('edit') }, 'Edit'),
  ui.menuSeparator(),
  ui.menuItem({ commandfor: 'confirm', command: 'show-modal', icon: ui.icon('trash') }, 'Delete…'),
)
```

## Sections

| Component | Props |
| --- | --- |
| `hero` | `eyebrow`, `title`, `description`, `media` (beside the text when wide, above it when narrow), `align` (`center` or `start`), `level` (default 1), `as`. Children are the action row |
| `footer` / `siteFooter` | `columns` (raw `grid-template-columns`), `as` |
| `footerColumn` | `title`. Children are usually links |
| `footerBottom` | The copyright row |
| `stat(props)` | `label`, `value`, `change`, `color`, `icon`, `help` |
| `statGroup` | `columns` |
| `steps(props)` | `items` (`{ title, description }` or strings), `current` (index; earlier steps are complete), `direction`, `label` |
| `timeline` | `items` (timeline item props), or `timelineItem` children |
| `timelineItem` | `title`, `description`, `time`, `icon`, `color` |
| `mockup` | `variant` (`browser` `window` `phone` `code`), `url`, `dots` (`mono` or `mac`), `frame`, `notch`, `size` |

```js
ui.hero({
  eyebrow: 'v2 is out',
  title: 'Static sites, no framework',
  description: 'Functions that return HTML.',
  media: ui.mockup({ variant: 'browser', url: 'example.com' }, '<img src="/shot.png" alt="">'),
},
  ui.button({ href: '/docs', size: 'lg' }, 'Get started'),
  ui.button({ href: '/examples', size: 'lg', variant: 'outline' }, 'Examples'),
)

ui.siteFooter(
  ui.footerColumn({ title: 'Product' }, ui.link({ href: '/docs' }, 'Docs'), ui.link({ href: '/pricing' }, 'Pricing')),
  ui.footerColumn({ title: 'Company' }, ui.link({ href: '/about' }, 'About')),
  ui.footerBottom(ui.text({ variant: 'small', tone: 'muted' }, '© 2026 Acme')),
)
```

Live examples of every component: https://sitelo.dev/ui. Add `.md` to any
component page URL (for example https://sitelo.dev/ui/table.md) for its
Markdown copy.
