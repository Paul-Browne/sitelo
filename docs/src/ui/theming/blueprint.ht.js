import { h2, p } from 'javascript-to-html'
import { code, codeBlock } from '../../lib/code.js'
import { uiLayout } from '../../lib/layout.js'
import { presetPreview, presetPreviewHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Blueprint',
    description:
      'A technical drawing: hairlines, square corners and registration marks, labels in monospace capitals, and ink with one blueprint blue.',
    activeHref: '/ui/theming/blueprint',
    extraHead: [presetPreviewHead('blueprint')],
    children: [
      p(
        code('blueprint'),
        ' is a technical drawing: hairlines on a near-black sheet, square corners, and a registration mark — a small cross — on each corner of a card, a dialog and a row of stats. Everything that names or operates something — a button, a field’s label, a tab, a tag, a column head, a link in the bar — is set in a monospace face, in widely spaced capitals, while headings and running text stay in a grotesk, set tight. A solid line is an edge and a dashed one divides what is inside it, as a drawing marks a hidden line: the rows of a table, a divider, the run to a step still to come. It keeps to few colours. The solid button, a checked box, a filled bar and anything chosen are ink, printed in reverse; one blueprint blue marks focus and the tag over a heading; success, warning and danger keep theirs for what they say. Nothing casts a shadow. Dark mode is the original look; light mode keeps every line and mark and prints it in ink on white paper.',
      ),
      presetPreview('blueprint'),

      h2('Using it'),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('My site'),
  styles({ preset: 'blueprint' }),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">
// <link rel="stylesheet" href="/su/blueprint-4d1f8a20.css">`, 'javascript'),
      p(
        'Paint the page with ',
        code('var(--su-bp-backdrop)'),
        ' for the preset’s ground with a faint grid ruled across it, or with plain ',
        code('var(--su-bg)'),
        '. The preset uses Geist or Inter, and Geist Mono, JetBrains Mono or IBM Plex Mono, when the page loads them, and the system’s own faces otherwise; it downloads nothing.',
      ),
      codeBlock('src/styles.css', `body {
  background: var(--su-bp-backdrop);
  color: var(--su-text);
  font-family: var(--su-font-sans);
}`, 'css'),

      h2('Your own colours'),
      p(
        code('theme()'),
        ' still works on top, so a preset is a starting point rather than a fork. The primary palette is the ink — the solid button, a checked box, a filled bar, whatever is chosen — so ',
        code('primary'),
        ' recolours all of it at once. The rest are the preset’s own: ',
        code('--su-bp-accent'),
        ', the blue that draws focus and keys a heading; ',
        code('--su-bp-mark'),
        ', the registration marks, which ',
        code('transparent'),
        ' takes away; ',
        code('--su-bp-field'),
        ', the line round a field; ',
        code('--su-bp-track'),
        ', the slot a progress bar runs in; ',
        code('--su-bp-grid'),
        ' and ',
        code('--su-bp-cell'),
        ', the backdrop’s lines and the size of its squares; and ',
        code('--su-bp-tracking'),
        ', how far apart a label’s capitals are set. Here the blue turns to a signal orange, and the marks with it.',
      ),
      codeBlock('src/index.ht.js', `head(
  styles({ preset: 'blueprint' }),
  theme(
    { bpAccent: '#c2410c', bpMark: '#c2410c' },
    { dark: { bpAccent: '#ff7a3d', bpMark: '#ff7a3d' } },
  ),
)`, 'javascript'),
    ],
  })
