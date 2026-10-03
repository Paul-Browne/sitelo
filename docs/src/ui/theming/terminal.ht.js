import { h2, p } from 'javascript-to-html'
import { code, codeBlock } from '../../lib/code.js'
import { uiLayout } from '../../lib/layout.js'
import { presetPreview, presetPreviewHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Terminal',
    description:
      'A system console: one monospace face on black, hairline panels, labels in bold capitals, and a cyan accent with selections printed in reverse.',
    activeHref: '/ui/theming/terminal',
    extraHead: [presetPreviewHead('terminal')],
    children: [
      p(
        code('terminal'),
        ' is a system console: one monospace face on a black ground, hairline panels with their header ruled off, and every label — a button, a field’s caption, a tab, a column head — set in capitals, most of them bold. Cyan is the accent: the large headings, panel titles, the solid button and focus. A selection — a hovered table row, a pressed segment, a chosen pill, the current page number, the menu item under the pointer — is printed in reverse, dark on cyan, the way a terminal highlights a row. The success, warning and danger palettes are its status colours, green, yellow and red, and an outline button or a tag is drawn in its colour, line and label alike. Nothing is rounded but a radio, and nothing casts a shadow. Dark mode is the original look; light mode keeps every line, capital and square corner and prints it in black on near-white.',
      ),
      presetPreview('terminal'),

      h2('Using it'),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('My site'),
  styles({ preset: 'terminal' }),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">
// <link rel="stylesheet" href="/su/terminal-06767808.css">`, 'javascript'),
      p(
        'Set the page in it too — its ground, its text colour and its face — and the components sit on it as they do above. The preset uses JetBrains Mono, IBM Plex Mono or Source Code Pro when the page loads one, and the system’s own monospace otherwise; it downloads nothing.',
      ),
      codeBlock('src/styles.css', `body {
  background: var(--su-bg);
  color: var(--su-text);
  font-family: var(--su-font-mono);
}`, 'css'),

      h2('Your own colours'),
      p(
        code('theme()'),
        ' still works on top, so a preset is a starting point rather than a fork — here the accent turns to a phosphor amber, the lines it is drawn with included. Three tokens are the preset’s own: ',
        code('--su-tm-tracking'),
        ', how far apart a label’s capitals are set; ',
        code('--su-tm-track'),
        ', the slot a progress bar or a slider runs in; and ',
        code('--su-tm-field'),
        ', the line round a field, which in dark is the panels’ own faint grey — raise it for field edges that stand out more.',
      ),
      codeBlock('src/index.ht.js', `head(
  styles({ preset: 'terminal' }),
  theme(
    {
      primary: {
        base: '#8a5200', hover: '#734400', active: '#5c3600',
        soft: '#f6e6cc', softHover: '#efd9b3', softFg: '#4d2e00',
        border: '#c9a066', ring: 'rgba(138, 82, 0, 0.3)',
      },
    },
    {
      dark: {
        primary: {
          base: '#ffb000', hover: '#ffd480', active: '#e69e00',
          soft: '#33260d', softHover: '#45330f', softFg: '#ffd480',
          border: '#d99600', ring: 'rgba(255, 176, 0, 0.4)',
        },
      },
    },
  ),
)`, 'javascript'),
    ],
  })
