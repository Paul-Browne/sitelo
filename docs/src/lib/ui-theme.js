import { style } from 'javascript-to-html'
import { icon, iconSet, stylesheet } from 'sitelo/ui'

/**
 * The preset this site is drawn in.
 *
 * The docs are a sitelo-ui site like any other, so they take their look
 * from one of the library's presets rather than from a palette of their
 * own: the bar, the sidebar, the tables, the footer and the cookie notice
 * are the library's components, and `styles.css` draws the rest — the
 * hero, the code blocks, the page frame — in the same hand, from the same
 * tokens.
 */
export const SITE_PRESET = 'blueprint'

/** The icon set that preset is drawn for: straight hairlines, square ends. */
const SITE_ICONS = 'square'

/**
 * An icon from that set, for the site's own chrome.
 *
 * Asked for one at a time rather than with a global `iconSet()`: the set
 * is module state, and the component demos render in the same process
 * and have to draw the library's default.
 *
 * @param {string} name
 * @param {Record<string, unknown>} [attrs]
 * @returns {string}
 */
export function siteIcon(name, attrs) {
  const previous = iconSet(SITE_ICONS)

  try {
    return icon(name, attrs)
  } finally {
    iconSet(previous)
  }
}

/**
 * Top-level blocks of a minified sheet, as prelude and body. The sheets
 * this reads are the library's own, with no brace inside a string.
 *
 * @param {string} css
 * @returns {{ prelude: string, body: string }[]}
 */
export function cssBlocks(css) {
  const blocks = []
  let i = 0

  while (i < css.length) {
    const open = css.indexOf('{', i)
    if (open < 0) break
    let depth = 1
    let j = open + 1
    for (; depth; j++) {
      if (css[j] === '{') depth++
      else if (css[j] === '}') depth--
    }
    blocks.push({ prelude: css.slice(i, open).trim(), body: css.slice(open + 1, j - 1) })
    i = j
  }

  return blocks
}

const cssText = ({ prelude, body }) => `${prelude}{${body}}`

/*
 * Both read when asked for rather than once, as the library reads them:
 * edit the preset with the dev server running and the next page shows it.
 */
const coreCss = () => stylesheet()

// `stylesheet({ preset })` is the core and then the preset, and the core
// is linked on its own — so only the part after it is the preset's.
const presetCss = () => stylesheet({ preset: SITE_PRESET }).slice(coreCss().length)

/*
 * Every box on the site that shows something other than the site's own
 * look: the demo above the code on a component page, the thumbnail on a
 * gallery card on `/ui`, and the stage a preset's page shows that preset
 * on. The gallery is the first of these a reader meets, so it is the last
 * place that should be showing them the docs' preset instead of the
 * library as it arrives.
 */
const ELSEWHERE = ['.ui-demo-preview', '.ui-gallery-preview', '[data-preset-stage]']

/** A selector that reads the theme off an element: `:root`, or an attribute. */
const THEME_SELECTOR = /^(:root|\[data-(su-)?theme)/

/**
 * A block that only says what the tokens are: the preset's light and dark
 * values, and the composites it declares alongside them. Everything else
 * in the sheet is a rule that restyles a component.
 */
function isTokenBlock({ prelude, body }) {
  if (prelude.startsWith('@media (prefers-color-scheme: dark)')) {
    return cssBlocks(body).every(isTokenBlock)
  }
  return !prelude.startsWith('@') && prelude.split(',').every((s) => THEME_SELECTOR.test(s))
}

/**
 * A token block held to the document element.
 *
 * The preset declares its dark tokens on any element carrying a theme
 * attribute, so that a `data-su-theme="dark"` region of a page goes dark
 * in the preset's colours. Here a demo can carry one, and it should go
 * dark in the library's — the docs only ever set the theme on <html>.
 */
function onRoot({ prelude, body }) {
  if (prelude.startsWith('@')) return `${prelude}{${cssBlocks(body).map(onRoot).join('')}}`
  const selectors = prelude.split(',').map((s) => (s.startsWith(':root') ? s : `:root${s}`))
  return `${[...new Set(selectors)].join(',')}{${body}}`
}

/**
 * The preset, for every part of the page but the boxes in {@link ELSEWHERE}.
 *
 * Its tokens are set on `:root` as the preset sets them, so the docs'
 * own sheet can read them too. Its rules — every one that restyles a
 * component — go inside `@scope`, with those boxes as its lower
 * boundary, so a button in a demo is drawn as the library draws it and
 * not as this site does. What the boxes inherit from the page is put
 * back by {@link uiDemoDefaults}.
 *
 * `@property` and `@keyframes` cannot be scoped, and are global anyway.
 *
 * A note for `styles.css`: a scoped rule beats an unscoped one of the
 * same specificity whichever comes first, so a docs rule overriding one
 * of these needs a class more than the rule it overrides.
 *
 * @returns {string}
 */
export function sitePresetCss() {
  const blocks = cssBlocks(presetCss())
  const global = blocks.filter(({ prelude }) => /^@(property|keyframes)/.test(prelude))
  const tokens = blocks.filter(isTokenBlock)
  const rules = blocks.filter((block) => !global.includes(block) && !tokens.includes(block))

  return (
    global.map(cssText).join('') +
    tokens.map(onRoot).join('') +
    `@scope (:root) to (${ELSEWHERE.join(',')}){${rules.map(cssText).join('')}}`
  )
}

/** The `--su-` declarations in a block's body. */
const tokensIn = (body) =>
  body
    .split(';')
    .map((part) => part.trim())
    .filter((part) => part.startsWith('--su-'))

const nameOf = (declaration) => declaration.slice(0, declaration.indexOf(':')).trim()

/**
 * Every token the preset sets but its own `--su-bp-*` ones: only the
 * preset's rules read those, and its rules stop at the boxes.
 */
function presetTokens() {
  return new Set(
    cssBlocks(presetCss())
      .filter(isTokenBlock)
      .flatMap(function names({ prelude, body }) {
        return prelude.startsWith('@')
          ? cssBlocks(body).flatMap(names)
          : tokensIn(body).map(nameOf)
      })
      .filter((name) => !name.startsWith('--su-bp-')),
  )
}

/**
 * The core's own values for those tokens, read out of the sheet it
 * ships rather than copied here: a palette this site does not own is one
 * it cannot keep in step by hand, and the reference is the one page where
 * being a version behind would actually mislead.
 *
 * A token the preset sets and the core does not — a composite such as
 * `--su-c-focus` — goes back to `initial`, so the core's fallback for it
 * is the one used.
 *
 * @param {(prelude: string) => boolean} matches - Which of the core's
 *   blocks to read.
 * @param {boolean} fill - Whether a token missing from them goes to
 *   `initial` rather than being left out.
 */
function coreValues(matches, fill) {
  const values = new Map(
    cssBlocks(coreCss())
      .filter(({ prelude }) => matches(prelude))
      .flatMap(({ body }) => tokensIn(body))
      .map((declaration) => [nameOf(declaration), declaration]),
  )

  return [...presetTokens()]
    .map((name) => values.get(name) ?? (fill ? `${name}:initial` : ''))
    .filter(Boolean)
    .join(';')
}

/** The boxes as one selector list, each optionally under an ancestor. */
const scoped = (ancestor = '') => ELSEWHERE.map((scope) => `${ancestor}${scope}`).join(',')

/*
 * The library's own tokens, for the pages that document it.
 *
 * Three blocks rather than `theme()`'s own `dark` option, which composes
 * its selectors as `<scope> [data-theme='dark']` — the themed element
 * *inside* the scope. Here it is the other way round: the attribute is
 * on <html> and the scope is a div deep in the article.
 *
 * A preset's stage is one of the boxes, so the docs' focus colour and
 * the rest come off it too. The stage's own sheet declares the core's
 * tokens and its preset's on the stage from inside an `@scope`, which
 * wins over these at the same specificity — so they only fill what that
 * preset leaves alone.
 */
export function uiDemoDefaults() {
  const light = coreValues((prelude) => prelude === ':root', true)
  const dark = coreValues((prelude) => prelude.split(',').includes("[data-su-theme='dark']"), false)

  return style(
    { 'data-sitelo-ui-demo': '' },
    `${scoped()}{${light}}` +
      `${scoped("[data-theme='dark'] ")},` +
      `${scoped("[data-su-theme='dark'] ")}{${dark}}` +
      `@media (prefers-color-scheme: dark){` +
      `${scoped(":root:not([data-theme='light']):not([data-su-theme='light']) ")}` +
      `{${dark}}}`,
  )
}
