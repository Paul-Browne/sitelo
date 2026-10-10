import { h2, p } from 'javascript-to-html'
import { code, codeBlock, presetPreview, presetPreviewHead, uiLayout } from '../../../lib/de.js'

export default () =>
  uiLayout({
    title: 'Blaupause',
    description:
      'Eine technische Zeichnung: Haarlinien, scharfe Ecken und Passermarken, Beschriftungen in Monospace-Versalien und Tinte mit einem einzigen Blaupausenblau.',
    activeHref: '/de/ui/theming/blueprint',
    extraHead: [presetPreviewHead('blueprint')],
    children: [
      p(
        code('blueprint'),
        ' ist eine technische Zeichnung: Haarlinien auf einem fast schwarzen Blatt, scharfe Ecken und eine Passermarke – ein kleines Kreuz – an jeder Ecke einer Karte, eines Dialogs und einer Reihe von Kennzahlen. Alles, was etwas benennt oder bedient – ein Button, die Beschriftung eines Felds, ein Tab, ein Tag, ein Spaltenkopf, ein Link in der Leiste –, steht in einer Monospace-Schrift, in gesperrten Versalien, während Überschriften und Fließtext in einer Grotesk bleiben, eng gesetzt. Eine durchgezogene Linie ist eine Kante, eine gestrichelte teilt, was darin liegt, so wie eine Zeichnung eine verdeckte Kante markiert: die Zeilen einer Tabelle, ein Trenner, die Strecke zu einem Schritt, der noch kommt. Es bleibt bei wenigen Farben. Der Solid-Button, ein angehaktes Kästchen, ein gefüllter Balken und alles Ausgewählte sind Tinte, invertiert gedruckt; ein einziges Blaupausenblau markiert den Fokus und das Tag über einer Überschrift; Erfolg, Warnung und Gefahr behalten ihre Farben für das, was sie sagen. Nichts wirft einen Schatten. Der Dunkelmodus ist der ursprüngliche Look; der Hellmodus behält jede Linie und jede Marke und druckt sie in Tinte auf weißes Papier.',
      ),
      presetPreview('blueprint'),

      h2('Verwendung'),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('Meine Website'),
  styles({ preset: 'blueprint' }),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">
// <link rel="stylesheet" href="/su/blueprint-4d1f8a20.css">`, 'javascript'),
      p(
        'Gib der Seite ',
        code('var(--su-bp-backdrop)'),
        ' als Hintergrund, dann liegt sie auf dem Grund des Presets mit einem zarten Raster darüber – oder einfach ',
        code('var(--su-bg)'),
        '. Das Preset nutzt Geist oder Inter und Geist Mono, JetBrains Mono oder IBM Plex Mono, wenn die Seite sie lädt, sonst die Schriften des Systems; es lädt nichts herunter.',
      ),
      codeBlock('src/styles.css', `body {
  background: var(--su-bp-backdrop);
  color: var(--su-text);
  font-family: var(--su-font-sans);
}`, 'css'),

      h2('Eigene Farben'),
      p(
        code('theme()'),
        ' funktioniert weiterhin obendrauf, ein Preset ist also ein Ausgangspunkt und kein Fork. Die Primärpalette ist die Tinte – der Solid-Button, ein angehaktes Kästchen, ein gefüllter Balken, alles Ausgewählte –, also färbt ',
        code('primary'),
        ' alles auf einmal um. Die übrigen Tokens gehören dem Preset selbst: ',
        code('--su-bp-accent'),
        ', das Blau, das den Fokus zeichnet und eine Überschrift markiert; ',
        code('--su-bp-mark'),
        ', die Passermarken, die ',
        code('transparent'),
        ' verschwinden lässt; ',
        code('--su-bp-field'),
        ', die Linie um ein Feld; ',
        code('--su-bp-track'),
        ', die Bahn, in der ein Fortschrittsbalken läuft; ',
        code('--su-bp-grid'),
        ' und ',
        code('--su-bp-cell'),
        ', die Linien des Hintergrunds und die Größe seiner Kästchen; und ',
        code('--su-bp-tracking'),
        ', wie weit die Versalien einer Beschriftung gesperrt sind. Hier wird das Blau zu Signalorange, und die Marken mit ihm.',
      ),
      codeBlock('src/index.ht.js', `head(
  styles({ preset: 'blueprint' }),
  theme(
    { bpAccent: '#c2410c', bpMark: '#c2410c' },
    { dark: { bpAccent: '#ff7a3d', bpMark: '#ff7a3d' } },
  ),
)`, 'javascript'),
    ],
  })
