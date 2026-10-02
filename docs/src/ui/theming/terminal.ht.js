import { h2, p } from 'javascript-to-html'
import { code, codeBlock } from '../../lib/code.js'
import { uiLayout } from '../../lib/layout.js'
import { presetPreview, presetPreviewHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Terminal',
    description:
      'One monospace face on a dark navy ground, after Advent of Code: bracketed actions, green links, and a glow on what is lit.',
    activeHref: '/ui/theming/terminal',
    extraHead: [presetPreviewHead('terminal')],
    children: [
      p(
        code('terminal'),
        ' is one monospace face on a dark navy ground, set the way Advent of Code is: grey text, green links that brighten when pointed at, white for what matters, and a glow in its own colour on the few things that are lit. An action is a bracketed word, ',
        code('[Save]'),
        '; a checkbox is ',
        code('[ ]'),
        ' until it is ',
        code('[X]'),
        ', and a second-level heading is ruled off as ',
        code('--- Title ---'),
        '. Nothing is rounded and nothing floats on a soft shadow: an edge is a line, and an elevated card is ruled double. Dark mode is the original look; light mode keeps the face, the brackets and the square corners and prints them in navy on pale paper, without the glow.',
      ),
      presetPreview('terminal'),

      h2('Using it'),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('My site'),
  styles({ preset: 'terminal' }),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">
// <link rel="stylesheet" href="/su/terminal-9590922b.css">`, 'javascript'),
      p(
        'Set the page in it too — its ground, its grey and its face — and the components sit on it as they do above. The preset uses Source Code Pro when the page loads it, and the system’s own monospace otherwise; it downloads nothing.',
      ),
      codeBlock('src/styles.css', `body {
  background: var(--su-bg);
  color: var(--su-text);
  font-family: var(--su-font-mono);
}`, 'css'),

      h2('Your own colours'),
      p(
        code('theme()'),
        ' still works on top, so a preset is a starting point rather than a fork. A glow is drawn in the colour of the text it is on, so a palette you change glows in its new colour — here the primary turns amber, for an older terminal. Success is the gold of a star, as the reference marks a puzzle solved; give it a green the same way if you would rather. Two tokens are the preset’s own: ',
        code('--su-tm-bright'),
        ', the white that headings and anything chosen are set in, and ',
        code('--su-tm-glow'),
        ', the shadow a lit thing wears, which is ',
        code('none'),
        ' in light mode.',
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
