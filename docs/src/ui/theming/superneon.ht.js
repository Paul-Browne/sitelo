import { h2, p } from 'javascript-to-html'
import { code, codeBlock } from '../../lib/code.js'
import { uiLayout } from '../../lib/layout.js'
import { presetPreview, presetPreviewHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Superneon',
    description:
      'Near-black violet, hairline edges and neon light: dark pill buttons with a glowing rim, and headings lit from above.',
    activeHref: '/ui/theming/superneon',
    extraHead: [presetPreviewHead('superneon')],
    children: [
      p(
        code('superneon'),
        ' is near-black violet with hairline edges and light that comes from inside. A solid button is a dark pill, lit along its inner edges and ringed in a gradient that glows past its outline; the big headings fade from bright to lavender, and anything chosen or switched on picks up a halo. The glow is only ever decoration, so every label still sits on a flat colour that clears WCAG AA. Dark mode is the original look; light mode keeps the dark pills and the glow and puts them on a pale lavender page.',
      ),
      presetPreview('superneon'),

      h2('Using it'),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('My site'),
  styles({ preset: 'superneon' }),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">
// <link rel="stylesheet" href="/su/superneon-5b0e7d21.css">`, 'javascript'),
      p(
        'Paint the page with ',
        code('var(--su-sn-backdrop)'),
        ' for the preset’s ground with a violet light falling on it from the top, or with plain ',
        code('var(--su-bg)'),
        '. The headings use Geist when the page loads it, and the system face otherwise — the preset downloads nothing.',
      ),
      codeBlock('src/styles.css', `body {
  background: var(--su-sn-backdrop);
}`, 'css'),

      h2('Your own colours'),
      p(
        code('theme()'),
        ' still works on top, so a preset is a starting point rather than a fork. This one gives every palette two more slots, ',
        code('glow'),
        ' and ',
        code('glowEnd'),
        ': the two ends of the gradient its rim and halo are drawn in. Nothing is read against a glow, so they can be as bright as you like.',
      ),
      codeBlock('src/index.ht.js', `head(
  styles({ preset: 'superneon' }),
  theme({
    primary: { glow: '#00e5ff', glowEnd: '#7f6bff' },
  }),
)`, 'javascript'),
    ],
  })
