import { h2, p } from 'javascript-to-html'
import { code, codeBlock, presetPreview, presetPreviewHead, uiLayout } from '../../../lib/de.js'

export default () =>
  uiLayout({
    title: 'Neubrutalismus',
    description:
      'Flache Farben, dicke Tintenlinien und harte Schatten: jede Komponente umrandet und beim Drücken in ihren eigenen Schatten gedrückt.',
    activeHref: '/de/ui/theming/neubrutalism',
    extraHead: [presetPreviewHead('neubrutalism')],
    children: [
      p(
        code('neubrutalism'),
        ' ist flache Farbe und dicke Tinte: Jede Fläche ist umrandet, und alles, was sich von der Seite abhebt, wirft einen harten Schatten ohne Unschärfe. Ein Klick drückt ein Bedienelement in seinen eigenen Schatten, und ein eingeschalteter Toggle bleibt dort. Die Soft-Füllungen sind kräftige Pastelltöne mit dunklem Text darauf, die Solid-Varianten bleiben dunkel genug für ein weißes Label, und im Dunkelmodus wird die Tinte cremefarben, denn ein schwarzer Schatten wäre auf einer dunklen Seite nicht zu sehen.',
      ),
      presetPreview('neubrutalism'),

      h2('Verwendung'),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('Meine Website'),
  styles({ preset: 'neubrutalism' }),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">
// <link rel="stylesheet" href="/su/neubrutalism-3f1a9c42.css">`, 'javascript'),
      p(
        'Gib auch der Seite ',
        code('var(--su-bg)'),
        ' als Hintergrund, dann bekommt sie das Creme des Presets, von dem sich die weißen Flächen abheben.',
      ),
      codeBlock('src/styles.css', `body {
  background: var(--su-bg);
}`, 'css'),

      h2('Eigene Farben'),
      p(
        code('theme()'),
        ' funktioniert weiterhin obendrauf, ein Preset ist also ein Ausgangspunkt und kein Fork. Dieses hier bringt zwei eigene Tokens mit: ',
        code('--su-nb-ink'),
        ', die Farbe, in der jede Linie und jeder Schatten gezeichnet wird, und ',
        code('--su-nb-lift'),
        ', wie weit ein erhabenes Bedienelement von der Seite absteht — und damit, wie weit ein Klick es bewegt.',
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
