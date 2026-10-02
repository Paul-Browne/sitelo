import { h2, p } from 'javascript-to-html'
import { code, codeBlock, presetPreview, presetPreviewHead, uiLayout } from '../../../lib/de.js'

export default () =>
  uiLayout({
    title: 'Terminal',
    description:
      'Eine einzige Monospace-Schrift auf dunklem Marineblau, nach dem Vorbild von Advent of Code: Aktionen in eckigen Klammern, grüne Links und ein Leuchten auf allem, was an ist.',
    activeHref: '/de/ui/theming/terminal',
    extraHead: [presetPreviewHead('terminal')],
    children: [
      p(
        code('terminal'),
        ' ist eine einzige Monospace-Schrift auf dunklem Marineblau, gesetzt wie Advent of Code: grauer Text, grüne Links, die beim Darüberfahren aufhellen, Weiß für das Wichtige und ein Leuchten in der eigenen Farbe auf den wenigen Dingen, die an sind. Eine Aktion ist ein Wort in eckigen Klammern, ',
        code('[Speichern]'),
        '; eine Checkbox ist ',
        code('[ ]'),
        ', bis sie ',
        code('[X]'),
        ' ist, und eine Überschrift zweiter Ebene wird als ',
        code('--- Titel ---'),
        ' abgesetzt. Nichts ist abgerundet und nichts schwebt auf einem weichen Schatten: Eine Kante ist eine Linie, und eine erhöhte Karte bekommt eine Doppellinie. Der Dunkelmodus ist der ursprüngliche Look; der Hellmodus behält Schrift, Klammern und eckige Ecken und druckt sie in Marineblau auf blassem Papier, ohne das Leuchten.',
      ),
      presetPreview('terminal'),

      h2('Verwendung'),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('Meine Website'),
  styles({ preset: 'terminal' }),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">
// <link rel="stylesheet" href="/su/terminal-9590922b.css">`, 'javascript'),
      p(
        'Setz auch die Seite darin – ihren Grund, ihr Grau und ihre Schrift –, dann stehen die Komponenten darauf wie oben. Das Preset nutzt Source Code Pro, wenn die Seite sie lädt, sonst die Monospace-Schrift des Systems; es lädt nichts herunter.',
      ),
      codeBlock('src/styles.css', `body {
  background: var(--su-bg);
  color: var(--su-text);
  font-family: var(--su-font-mono);
}`, 'css'),

      h2('Eigene Farben'),
      p(
        code('theme()'),
        ' funktioniert weiterhin obendrauf, ein Preset ist also ein Ausgangspunkt und kein Fork. Das Leuchten wird in der Farbe des Textes gezeichnet, auf dem es liegt, also leuchtet eine Palette, die du änderst, in ihrer neuen Farbe – hier wird die Primärfarbe bernsteinfarben, wie bei einem älteren Terminal. Erfolg ist das Gold eines Sterns, so wie das Vorbild ein gelöstes Rätsel markiert; gib ihm auf dieselbe Weise ein Grün, wenn dir das lieber ist. Zwei Tokens gehören dem Preset selbst: ',
        code('--su-tm-bright'),
        ', das Weiß, in dem Überschriften und alles Ausgewählte stehen, und ',
        code('--su-tm-glow'),
        ', der Schatten, den alles Leuchtende trägt; im Hellmodus ist er ',
        code('none'),
        '.',
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
