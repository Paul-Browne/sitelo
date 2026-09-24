import { h2, p } from 'javascript-to-html'
import { code, codeBlock, presetPreview, presetPreviewHead, uiLayout } from '../../../lib/de.js'

export default () =>
  uiLayout({
    title: 'Neumorphismus',
    description:
      'Soft UI: jede Komponente aus der Seite gehoben oder in sie hineingedrückt, allein durch Licht und Schatten.',
    activeHref: '/de/ui/theming/neumorphism',
    extraHead: [presetPreviewHead('neumorphism')],
    children: [
      p(
        code('neumorphism'),
        ' ist Soft UI: Jede Fläche ist die Seite selbst, und ein Bedienelement hebt sich allein durch Licht und Schatten ab — aus der Seite gehoben oder in sie hineingedrückt. Zwei Dinge, die dieser Look sonst aufgibt, behält es: Text, der WCAG AA erfüllt, und den Fokusrahmen. Den Dunkelmodus macht es mit wie alles andere. Es braucht allerdings ',
        code('var(--su-bg)'),
        ' als Hintergrund der Seite selbst, denn der Effekt beruht darauf, dass beides dieselbe Farbe hat.',
      ),
      presetPreview('neumorphism'),

      h2('Verwendung'),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('Meine Website'),
  styles({ preset: 'neumorphism' }),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">
// <link rel="stylesheet" href="/su/neumorphism-5d0e7b91.css">`, 'javascript'),
      codeBlock('src/styles.css', `body {
  background: var(--su-bg);
}`, 'css'),

      h2('Eigene Farben'),
      p(
        code('theme()'),
        ' funktioniert weiterhin obendrauf, ein Preset ist also ein Ausgangspunkt und kein Fork. Dieses hier gibt jeder Palette einen zehnten Platz, ',
        code('glow'),
        ' — die Farbe, in die ein Fortschrittsbalken oder ein Switch an seinem Ende ausläuft —, damit eine neue Primärfarbe ihre eigene mitbringen kann.',
      ),
      codeBlock('src/index.ht.js', `head(
  styles({ preset: 'neumorphism' }),
  theme({
    primary: { base: '#7c3aed', hover: '#6d28d9', active: '#5b21b6', glow: '#e879f9' },
  }),
)`, 'javascript'),
    ],
  })
