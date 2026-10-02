import { h2, p } from 'javascript-to-html'
import { code, codeBlock, presetPreview, presetPreviewHead, uiLayout } from '../../../lib/de.js'

export default () =>
  uiLayout({
    title: 'Terminal',
    description:
      'Eine Systemkonsole: eine einzige Monospace-Schrift auf Schwarz, Panels mit Haarlinien, Beschriftungen in fetten Versalien und ein Cyan-Akzent, bei dem alles Ausgewählte invertiert erscheint.',
    activeHref: '/de/ui/theming/terminal',
    extraHead: [presetPreviewHead('terminal')],
    children: [
      p(
        code('terminal'),
        ' ist eine Systemkonsole: eine einzige Monospace-Schrift auf schwarzem Grund, Panels mit Haarlinien, deren Kopf durch eine Linie abgesetzt ist, und jede Beschriftung – ein Button, die Bezeichnung eines Felds, ein Tab, ein Spaltenkopf – in fetten, gesperrten Versalien. Cyan ist der Akzent: Überschriften, Panel-Titel, der gefüllte Button, der Fokus und alles Ausgewählte, das invertiert erscheint, dunkel auf Cyan, so wie ein Terminal eine Zeile hervorhebt. Die übrigen Paletten sind seine Statusfarben, Grün, Gelb und Rot, und ein Outline-Button oder ein Tag wird in seiner Farbe gezeichnet, Linie und Beschriftung gleichermaßen. Nichts ist abgerundet und nichts wirft einen Schatten. Der Dunkelmodus ist der ursprüngliche Look; der Hellmodus behält jede Linie, jede Versalie und jede eckige Ecke und druckt sie schwarz auf fast Weiß.',
      ),
      presetPreview('terminal'),

      h2('Verwendung'),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('Meine Website'),
  styles({ preset: 'terminal' }),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">
// <link rel="stylesheet" href="/su/terminal-176ac9d8.css">`, 'javascript'),
      p(
        'Setz auch die Seite darin – ihren Grund, ihre Textfarbe und ihre Schrift –, dann stehen die Komponenten darauf wie oben. Das Preset nutzt JetBrains Mono, IBM Plex Mono oder Source Code Pro, wenn die Seite eine davon lädt, sonst die Monospace-Schrift des Systems; es lädt nichts herunter.',
      ),
      codeBlock('src/styles.css', `body {
  background: var(--su-bg);
  color: var(--su-text);
  font-family: var(--su-font-mono);
}`, 'css'),

      h2('Eigene Farben'),
      p(
        code('theme()'),
        ' funktioniert weiterhin obendrauf, ein Preset ist also ein Ausgangspunkt und kein Fork – hier wird der Akzent zu Phosphor-Bernstein. Zwei Tokens gehören dem Preset selbst: ',
        code('--su-tm-tracking'),
        ', wie weit eine Beschriftung in Versalien gesperrt ist, und ',
        code('--su-tm-track'),
        ', die Bahn, in der ein Fortschrittsbalken oder Schieberegler läuft.',
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
