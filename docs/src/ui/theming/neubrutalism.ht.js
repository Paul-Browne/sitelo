import { h2, p } from 'javascript-to-html'
import { code, codeBlock } from '../../lib/code.js'
import { uiLayout } from '../../lib/layout.js'
import { presetPreview, presetPreviewHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Neubrutalism',
    description:
      'Flat colour, thick ink lines and hard shadows: every component outlined, and pressed down into its own shadow.',
    activeHref: '/ui/theming/neubrutalism',
    extraHead: [presetPreviewHead('neubrutalism')],
    children: [
      p(
        code('neubrutalism'),
        ' is flat colour and thick ink: every surface is outlined, and anything that stands off the page casts a hard shadow with no blur. A press pushes a control down into its own shadow, and a toggle that is on stays there. The soft fills are bright pastels with dark text on them, the solids stay dark enough to carry a white label, and in dark mode the ink turns cream, since a black shadow on a dark page would not show.',
      ),
      presetPreview('neubrutalism'),

      h2('Using it'),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('My site'),
  styles({ preset: 'neubrutalism' }),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">
// <link rel="stylesheet" href="/su/neubrutalism-3f1a9c42.css">`, 'javascript'),
      p(
        'Paint the page with ',
        code('var(--su-bg)'),
        ' too, and it takes the preset’s cream, with the white surfaces standing out from it.',
      ),
      codeBlock('src/styles.css', `body {
  background: var(--su-bg);
}`, 'css'),

      h2('Your own colours'),
      p(
        code('theme()'),
        ' still works on top, so a preset is a starting point rather than a fork. The preset adds two tokens of its own: ',
        code('--su-nb-ink'),
        ', the colour every line and shadow is drawn in, and ',
        code('--su-nb-lift'),
        ', how far a raised control stands off the page and so how far a press moves it.',
      ),
      codeBlock('src/index.ht.js', `head(
  styles({ preset: 'neubrutalism' }),
  theme({
    primary: { base: '#c2185b', hover: '#a8144e', active: '#8e1042', soft: '#ffb3d0', softFg: '#5c0a2a' },
    '--su-nb-lift': '6px',
  }),
)`, 'javascript'),
    ],
  })
