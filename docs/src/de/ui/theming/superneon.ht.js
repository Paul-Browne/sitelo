import { h2, p } from 'javascript-to-html'
import { code, codeBlock, presetPreview, presetPreviewHead, uiLayout } from '../../../lib/de.js'

export default () =>
  uiLayout({
    title: 'Superneon',
    description:
      'Fast schwarzes Violett, haarfeine Kanten und Neonlicht: dunkle Pillen-Buttons mit leuchtendem Rand und Überschriften, die von oben beleuchtet sind.',
    activeHref: '/de/ui/theming/superneon',
    extraHead: [presetPreviewHead('superneon')],
    children: [
      p(
        code('superneon'),
        ' ist fast schwarzes Violett mit haarfeinen Kanten und Licht, das von innen kommt. Ein Solid-Button ist eine dunkle Pille, an den Innenkanten beleuchtet und von einem Verlauf umrandet, der über seinen Umriss hinaus leuchtet; die großen Überschriften gehen von hell zu Lavendel über, und alles, was ausgewählt oder eingeschaltet ist, bekommt einen Schein. Das Leuchten ist immer nur Dekoration, daher steht jedes Label weiterhin auf einer flachen Farbe, die WCAG AA erfüllt. Der Dunkelmodus ist der ursprüngliche Look; der Hellmodus behält die dunklen Pillen und das Leuchten und setzt sie auf eine blasse Lavendelseite.',
      ),
      presetPreview('superneon'),

      h2('Verwendung'),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('Meine Website'),
  styles({ preset: 'superneon' }),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">
// <link rel="stylesheet" href="/su/superneon-5b0e7d21.css">`, 'javascript'),
      p(
        'Gib der Seite ',
        code('var(--su-sn-backdrop)'),
        ' als Hintergrund, dann liegt sie auf dem Grund des Presets, mit violettem Licht, das von oben darauf fällt – oder einfach ',
        code('var(--su-bg)'),
        '. Die Überschriften nutzen Geist, wenn die Seite es lädt, sonst die Systemschrift – das Preset lädt nichts herunter.',
      ),
      codeBlock('src/styles.css', `body {
  background: var(--su-sn-backdrop);
}`, 'css'),

      h2('Eigene Farben'),
      p(
        code('theme()'),
        ' funktioniert weiterhin obendrauf, ein Preset ist also ein Ausgangspunkt und kein Fork. Dieses hier gibt jeder Palette zwei weitere Plätze, ',
        code('glow'),
        ' und ',
        code('glowEnd'),
        ': die beiden Enden des Verlaufs, in dem ihr Rand und ihr Schein gezeichnet werden. Vor einem Leuchten wird nichts gelesen, also dürfen sie so hell sein, wie du willst.',
      ),
      codeBlock('src/index.ht.js', `head(
  styles({ preset: 'superneon' }),
  theme({
    primary: { glow: '#00e5ff', glowEnd: '#7f6bff' },
  }),
)`, 'javascript'),
    ],
  })
