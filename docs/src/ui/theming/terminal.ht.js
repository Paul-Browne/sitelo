import { h2, p } from 'javascript-to-html'
import { code, codeBlock } from '../../lib/code.js'
import { uiLayout } from '../../lib/layout.js'
import { presetPreview, presetPreviewHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Terminal',
    description:
      'A system console: one monospace face on black, hairline panels, labels in bold capitals, and a cyan accent with anything selected printed in reverse.',
    activeHref: '/ui/theming/terminal',
    extraHead: [presetPreviewHead('terminal')],
    children: [
      p(
        code('terminal'),
        ' is a system console: one monospace face on a black ground, hairline panels with their header ruled off, and every label — a button, a field’s caption, a tab, a column head — set in bold, spaced-out capitals. Cyan is the accent: headings, panel titles, the solid button, focus, and anything selected, which is printed in reverse, dark on cyan, the way a terminal highlights a row. The other palettes are its status colours, green, yellow and red, and an outline button or a tag is drawn in its colour, line and label alike. Nothing is rounded and nothing casts a shadow. Dark mode is the original look; light mode keeps every line, capital and square corner and prints it in black on near-white.',
      ),
      presetPreview('terminal'),

      h2('Using it'),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('My site'),
  styles({ preset: 'terminal' }),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">
// <link rel="stylesheet" href="/su/terminal-176ac9d8.css">`, 'javascript'),
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
        ' still works on top, so a preset is a starting point rather than a fork — here the accent turns to a phosphor amber. Two tokens are the preset’s own: ',
        code('--su-tm-tracking'),
        ', how far apart a label in capitals is set, and ',
        code('--su-tm-track'),
        ', the slot a progress bar or a slider runs in.',
      ),
      codeBlock('src/index.ht.js', `head(
  styles({ preset: 'terminal' }),
  theme(
    { primary: { base: '#8a5200', hover: '#734400', active: '#5c3600', soft: '#f6e6cc', softFg: '#4d2e00' } },
    { dark: { primary: { base: '#ffb000', hover: '#ffd480', active: '#e69e00', soft: '#33260d', softFg: '#ffd480' } } },
  ),
)`, 'javascript'),
    ],
  })
