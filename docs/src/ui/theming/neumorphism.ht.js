import { h2, p } from 'javascript-to-html'
import { code, codeBlock } from '../../lib/code.js'
import { uiLayout } from '../../lib/layout.js'
import { presetPreview, presetPreviewHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Neumorphism',
    description:
      'Soft UI: every component raised from the page or pressed into it, by light and shade alone.',
    activeHref: '/ui/theming/neumorphism',
    extraHead: [presetPreviewHead('neumorphism')],
    children: [
      p(
        code('neumorphism'),
        ' is soft UI: every surface is the page itself, and a control stands out by light and shade alone — raised from the page, or pressed into it. It keeps two things the look usually gives up, text that clears WCAG AA and the focus outline, and it follows dark mode like everything else. It does need the page’s own background to be ',
        code('var(--su-bg)'),
        ', since the effect rests on the two being one colour.',
      ),
      presetPreview('neumorphism'),

      h2('Using it'),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('My site'),
  styles({ preset: 'neumorphism' }),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">
// <link rel="stylesheet" href="/su/neumorphism-5d0e7b91.css">`, 'javascript'),
      codeBlock('src/styles.css', `body {
  background: var(--su-bg);
}`, 'css'),

      h2('Your own colours'),
      p(
        code('theme()'),
        ' still works on top, so a preset is a starting point rather than a fork. This one adds a tenth slot to each palette, ',
        code('glow'),
        ' — the colour a progress bar or a switch fades into at its far end — so a new primary can bring its own.',
      ),
      codeBlock('src/index.ht.js', `head(
  styles({ preset: 'neumorphism' }),
  theme({
    primary: { base: '#7c3aed', hover: '#6d28d9', active: '#5b21b6', glow: '#e879f9' },
  }),
)`, 'javascript'),
    ],
  })
