// The states episode 6's files pass through. Most files are rewritten
// outright, so most stages are just the finished file; the layout and the
// config are built up from it.

import { snapshot } from '../../lib/capture-kit.js'

const replace = (text, from, to) => {
  if (!text.includes(from)) throw new Error(`Expected to find: ${from}`)
  return text.replace(from, to)
}
const before = (file) => snapshot('05-add-ons', file)
const after = (file) => snapshot('06-sitelo-ui', file)

const changed = [
  'src/lib/layout.js', 'src/lib/recipe-card.js', 'src/index.ht.js', 'src/recipes/index.ht.js', 'src/recipes/quick.ht.js',
  'src/recipes/[slug].ht.js', 'src/cuisines/[...path]?.ht.js', 'src/about.ht.js', 'src/(legal)/privacy.ht.js',
  'src/(legal)/terms.ht.js', 'src/404.ht.js', 'src/search.ht.js', 'src/islands/whats-cooking.js', 'src/islands/comments.js',
  'src/styles.css', 'sitelo.config.js',
]
export const start = Object.fromEntries(changed.map((f) => [f, before(f)]))
export const final = Object.fromEntries([...changed, 'src/lib/theme.js'].map((f) => [f, after(f)]))

// The layout: components first, then a partial theme, then the full palette.
const layoutFinal = final['src/lib/layout.js']
const unthemed = replace(
  replace(layoutFinal, "import { orange, orangeDark } from './theme.js'\n", ''),
  '      ui.theme(orange, { dark: orangeDark }),\n',
  '',
)
const partial = replace(
  unthemed,
  '      ui.styles(),\n',
  "      ui.styles(),\n      ui.theme({ primary: { base: '#c2410c', hover: '#9a3412', fg: '#ffffff' } }),\n",
)
const preset = (name, extra = '') =>
  replace(final['src/lib/layout.js'], 'ui.styles(),', `ui.styles({ preset: '${name}' }),`).replace(
    "import { orange, orangeDark } from './theme.js'\n",
    `import { orange, orangeDark } from './theme.js'\n${extra}`,
  )
export const layout = {
  unthemed,
  partial,
  final: layoutFinal,
  neubrutalism: preset('neubrutalism'),
  superneon: preset('superneon'),
  terminal: preset('terminal', "\nui.iconSet('square')\n"),
}

// pruneCss, first on its own, then with the islands' classes kept.
const configFinal = final['sitelo.config.js']
const keepStart = configFinal.indexOf('  // Ship only')
const keepBlock = configFinal.slice(keepStart, configFinal.indexOf('  },\n', keepStart) + '  },\n'.length)
export const config = {
  prune: replace(configFinal, keepBlock, '  // Ship only the sitelo-ui rules the built pages use\n  pruneCss: true,\n'),
  final: configFinal,
}
