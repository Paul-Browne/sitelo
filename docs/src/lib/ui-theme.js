import { style } from 'javascript-to-html'
import { stylesheet, theme } from 'sitelo/ui'

/**
 * The docs palette, expressed as sitelo-ui tokens.
 *
 * Every value is a `var()` pointing at the token this site already
 * defines in `styles.css`, rather than a literal colour. Custom
 * properties resolve where they are *used*, not where they are
 * declared, so one block covers both themes: when the boot script
 * stamps `data-theme="light"` on <html>, `--paper` changes on `:root`
 * and `--su-bg` follows it. There is no second, light-only copy of this
 * map to keep in step with the one in `styles.css`.
 *
 * The five palettes are not five hues here. This site has one accent,
 * so `primary` is it and `neutral` is the ink; `success`, `warning` and
 * `danger` keep sitelo-ui's own, since the docs chrome never asks for
 * them and a component that did should still look right.
 */
const TOKENS = {
  // Surfaces
  bg: 'var(--paper)',
  bgSubtle: 'var(--paper)',
  surface: 'var(--paper-elevated)',
  '--su-surface-2': 'color-mix(in srgb, var(--ink) 5%, var(--paper-elevated))',
  surfaceHover: 'color-mix(in srgb, var(--ink) 8%, var(--paper-elevated))',
  border: 'var(--line)',
  borderStrong: 'color-mix(in srgb, var(--ink) 26%, transparent)',
  text: 'var(--ink)',
  textMuted: 'var(--ink-soft)',
  textSubtle: 'var(--ink-faint)',
  overlay: 'color-mix(in srgb, var(--paper) 70%, transparent)',

  // Type — the same three families the rest of the site preloads.
  fontSans: 'var(--font-body)',
  fontMono: 'var(--font-mono)',

  // Elevation
  shadowSm: '0 2px 8px rgb(0 0 0 / 0.18)',
  shadowMd: 'var(--shadow-panel)',
  shadowLg: 'var(--shadow-panel)',

  primary: {
    base: 'var(--accent)',
    hover: 'var(--accent-deep)',
    active: 'var(--accent-deep)',
    fg: 'var(--accent-ink)',
    soft: {
      base: 'color-mix(in srgb, var(--accent) 14%, transparent)',
      hover: 'color-mix(in srgb, var(--accent) 22%, transparent)',
      fg: 'var(--accent)',
    },
    border: 'color-mix(in srgb, var(--accent) 40%, transparent)',
    ring: 'color-mix(in srgb, var(--accent) 36%, transparent)',
  },

  neutral: {
    base: 'var(--ink-soft)',
    hover: 'var(--ink)',
    active: 'var(--ink)',
    fg: 'var(--paper)',
    soft: {
      base: 'color-mix(in srgb, var(--ink) 8%, transparent)',
      hover: 'color-mix(in srgb, var(--ink) 14%, transparent)',
      fg: 'var(--ink)',
    },
    border: 'var(--line)',
    ring: 'color-mix(in srgb, var(--ink) 28%, transparent)',
  },
}

/*
 * `:root` three times over, which is not a typo.
 *
 * sitelo-ui's dark tokens live under
 * `:root:not([data-theme='light']):not([data-su-theme='light'])` — three
 * pseudo-classes, and a media query adds no specificity of its own. A
 * plain `:root` block here would lose to it for every visitor whose OS
 * is set to dark, which on this site is the default look. Repeating
 * `:root` matches that specificity exactly and wins on source order,
 * without inventing an attribute the markup would then have to carry.
 */
export const uiTheme = () => theme(TOKENS, { selector: ':root:root:root' })

/*
 * Sitelo-ui's own tokens, read back out of the sheet it ships.
 *
 * The block above repaints every component on the site in this site's
 * colours, which is the point — but it also reaches the demos on the
 * component pages, and those have to show the library as it arrives.
 * With `--su-primary` remapped to the docs accent, `/ui/button`'s
 * "Colors" section was arguing that a primary button is neon green.
 *
 * So the demo previews get the defaults back. They are lifted from
 * `ui.css` rather than copied into this file: a palette this site does
 * not own is one it cannot keep in step by hand, and the reference is
 * the one page where being a version behind would actually mislead.
 *
 * Only the tokens `TOKENS` actually overrides are restored, and the list
 * of those is read off this module's own output — so a token added to
 * the map above is restored here without anyone remembering to.
 */
function declarationsIn(block) {
  return block
    // Comments first: `ui.css` groups its tokens under headings, and a
    // declaration whose segment still carries the `/* Surfaces */` above
    // it no longer starts with `--su-`.
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split(';')
    .map((part) => part.trim())
    .filter((part) => part.startsWith('--su-'))
}

/**
 * The `--su-*` names the docs theme takes over.
 *
 * Read off `theme()`'s own output rather than off `TOKENS`, because it
 * is `theme()` that decides a key called `surfaceHover` becomes
 * `--su-surface-hover` — and a nested palette one key becomes nine.
 */
const OVERRIDDEN = new Set(
  [...theme(TOKENS).matchAll(/(--su-[a-z0-9-]+)\s*:/g)].map((m) => m[1]),
)

/**
 * The declarations for those names, as `ui.css` itself writes them.
 *
 * @param {string} opener - The selector introducing the block to read.
 * @returns {string}
 */
function defaults(opener) {
  const css = stylesheet({ minify: false })
  const from = css.indexOf(opener) + opener.length
  const block = css.slice(from, css.indexOf('\n}', from))

  return declarationsIn(block)
    .filter((part) => OVERRIDDEN.has(part.slice(0, part.indexOf(':'))))
    // `ui.css` wraps its longer values over two indented lines, which is
    // right in a file and pure weight in an inline <style> on 351 pages.
    .map((part) => part.replace(/\s+/g, ' '))
    .join(';')
}

const LIGHT = defaults(':root {')
const DARK = defaults("[data-su-theme='dark'] {")

/*
 * Both boxes that show the library as it ships: the demo above the code
 * on a component page, and the thumbnail on a gallery card on `/ui`. The
 * gallery is the first of the two a reader meets, so it is the last
 * place that should be showing them a green primary button.
 */
const SCOPES = ['.ui-demo-preview', '.ui-gallery-preview']

/** The scopes as one selector list, each optionally under an ancestor. */
const scoped = (ancestor = '') =>
  SCOPES.map((scope) => `${ancestor}${scope}`).join(',')

/*
 * The defaults, for the pages that document them.
 *
 * Three blocks rather than `theme()`'s own `dark` option, which composes
 * its selectors as `<scope> [data-theme='dark']` — the themed element
 * *inside* the scope. Here it is the other way round: the attribute is
 * on <html> and the scope is a div deep in the article.
 */
export const uiDemoDefaults = () =>
  style(
    { 'data-sitelo-ui-demo': '' },
    `${scoped()}{${LIGHT}}` +
      `${scoped("[data-theme='dark'] ")},` +
      `${scoped("[data-su-theme='dark'] ")}{${DARK}}` +
      `@media (prefers-color-scheme: dark){` +
      `${scoped(":root:not([data-theme='light']):not([data-su-theme='light']) ")}` +
      `{${DARK}}}`,
  )
