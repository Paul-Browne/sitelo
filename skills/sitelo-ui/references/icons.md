# Icons

```js
ui.icon(name, { size, label, spin, filled })
```

- An icon is an inline `<svg>` on a 24×24 grid, drawn in `currentColor`. It
  takes the colour and font size of its context. `size` is `sm`, `md`,
  `lg` or any CSS length (default `1em`).
- With no `label` it is `aria-hidden`, which is right when visible text next
  to it says the same thing. Give it a `label` (`role="img"`) when the icon
  carries the meaning alone. `iconButton` needs `label` for the same
  reason.
- An unknown name renders `''`. `ui.hasIcon(name)` checks a name, and
  `ui.iconNames()` lists them all.
- Components take icons as props: `button({ startIcon: ui.icon('plus') })`,
  `menuItem({ icon })`, `alert({ icon })`, `stat({ icon })`,
  `empty({ icon })` and so on.

## Glyphs

Names describe the drawing, not the job.

`alert-triangle` `arrow-down` `arrow-left` `arrow-right` `arrow-up`
`banknote` `bell` `bold` `bookmark` `calendar` `camera` `check`
`check-circle` `chevron-down` `chevron-left` `chevron-right` `chevron-up`
`chevrons-left` `chevrons-right` `clock` `close` `code` `coins`
`comment-bubble` `copy` `credit-card` `database` `download` `edit`
`external-link` `eye` `eye-off` `facebook` `feather` `file` `filter`
`folder` `gear` `gift` `globe` `google` `heart` `help` `home` `image`
`info` `instagram` `italic` `key` `layers` `link` `linkedin` `location`
`lock` `log-in` `log-out` `mail` `menu` `minus` `moon` `more-horizontal`
`more-vertical` `package` `percent` `pin` `plus` `print` `receipt`
`refresh` `search` `settings` `share` `shopping-bag` `shopping-cart`
`smartphone` `sparkles` `spinner` `star` `store` `sun` `tag` `terminal`
`thumbs-down` `thumbs-up` `tiktok` `trash` `truck` `universal-access`
`unlock` `upload` `user` `users` `video` `wallet` `whatsapp` `x-circle`
`x-twitter` `youtube` `zap`

The brand marks (`facebook`, `google`, `instagram`, `linkedin`, `tiktok`,
`whatsapp`, `x-twitter`, `youtube`) are solid logos from Simple Icons
(CC0). Use them only to point at that service, as in a profile link or a
share button.

## Aliases

| Alias | Glyph |
| --- | --- |
| `x`, `cross` | `close` |
| `success` | `check-circle` |
| `warning` | `alert-triangle` |
| `danger`, `error` | `x-circle` |
| `question` | `help` |
| `loading` | `spinner` |
| `cog`, `gears` | `gear` |
| `login`, `sign-in` / `logout`, `sign-out` | `log-in` / `log-out` |
| `map-pin`, `marker` | `location` |
| `mobile` | `smartphone` |
| `like` / `dislike` | `thumbs-up` / `thumbs-down` |
| `comment`, `message`, `chat` | `comment-bubble` |
| `ai`, `magic` | `sparkles` |
| `printer` | `print` |
| `twitter` | `x-twitter` |
| `accessibility`, `a11y` | `universal-access` |
| `trash-can`, `delete` | `trash` |
| `pencil` | `edit` |
| `notification` | `bell` |
| `dots` | `more-horizontal` |
| `cart` / `bag` | `shopping-cart` / `shopping-bag` |
| `card` | `credit-card` |
| `cash`, `money` | `banknote` |
| `delivery`, `shipping` | `truck` |
| `shop` | `store` |
| `discount`, `sale` | `percent` |
| `bolt`, `lightning` | `zap` |
| `arrow-back` / `arrow-forward` | `arrow-left` / `arrow-right` |

## Filled

`filled: true` paints the glyph instead of outlining it. It is a boolean so
that it can follow state, as in `ui.icon('heart', { filled: liked })`.
Fillable glyphs: `alert-triangle` `bell` `bookmark` `check-circle`
`chevron-down` `chevron-left` `chevron-right` `chevron-up` `folder`
`heart` `help` `info` `star` `x-circle`. On the status glyphs, the mark is
knocked out of a solid shape. Other glyphs ignore `filled`.
`ui.fillableIcons()` lists them.

## Square set

`ui.iconSet('square')` redraws every glyph except the brand marks in
straight lines at 0°, 45° and 90°, with square caps and a thinner stroke.
It returns the set it replaced. Call it once, from a module the pages
import. Names, aliases and filled forms are unchanged, and components'
built-in icons follow it. It is drawn for the `terminal` and `blueprint`
presets. `ui.iconSet()` with no argument returns the current set.

## Custom icons

```js
ui.registerIcons({
  logo: '<path d="M4 20 12 4l8 16z"/>',                               // the inside of a 24×24 <svg>, stroked
  badge: { markup: '<circle cx="12" cy="12" r="8"/>', fillable: true }, // filling the same path is its filled form
  close: null,                                                        // drop an override, restoring the built-in
})
ui.icon('logo')
```

Register icons from a module that pages import, before they render.
