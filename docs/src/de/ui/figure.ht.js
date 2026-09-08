import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/de.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Abbildung',
    description:
      'Ein Bild und seine Bildunterschrift als eine Abbildung — mit reserviertem Platz, bevor das Bild eintrifft.',
    activeHref: '/de/ui/figure',
    extraHead: uiHead(),
    children: [
      p(
        'Ein ',
        code('<figure>'),
        ' bindet die Unterschrift an das, was sie beschreibt — was ein Absatz unter einem Bild nicht tut. Übergib ',
        code('src'),
        ' für den Normalfall, oder Kinder für alles andere, das eine Unterschrift verdient.',
      ),

      h2('Einfache Abbildung'),
      demo(`figure({
  src: '/logo.svg',
  alt: 'Die sitelo-Wortmarke',
  caption: 'Die Wortmarke, so wie sie in der oberen Leiste erscheint.',
  style: '--su-figure-bg: var(--su-surface-2)',
})`, { align: 'stretch' }),

      h2('Mit gehaltenem Verhältnis'),
      p(
        code('ratio'),
        ' wickelt das Bild in ein ',
        code('aspectRatio()'),
        ', damit die Unterschrift beim Laden des Bildes nie nach unten springt.',
      ),
      demo(`grid({ min: '13rem' },
  figure({ src: '/logo.svg', alt: '', ratio: '16 / 9', caption: 'ratio: 16 / 9' }),
  figure({ src: '/logo.svg', alt: '', ratio: '1 / 1', caption: 'ratio: 1 / 1' }),
)`, { align: 'stretch' }),

      h2('Etwas anderes beschriften'),
      p('Ohne ', code('src'), ' sind die Kinder der Inhalt der Abbildung.'),
      demo(`figure({ caption: 'Tabelle 1 — Ausgabe eines Standard-Builds.' },
  table({
    dense: true,
    columns: [{ key: 'file', header: 'Datei' }, { key: 'size', header: 'Größe', align: 'end' }],
    rows: [
      { file: 'index.html', size: '4,1 kB' },
      { file: '404.html', size: '860 B' },
      { file: 'sitemap.xml', size: '155 B' },
    ],
  }),
)`, { align: 'stretch' }),

      h2('Code mit Unterschrift'),
      p(
        'Beachte die Prop ',
        code('text'),
        ' an ',
        code('code()'),
        ': Kinder werden in dieser Bibliothek überall als HTML gerendert, ein Beispiel mit Tags muss also escaped werden, sonst baut der Browser es, statt es zu zeigen.',
      ),
      demo(`figure({ caption: 'Eine sitelo-Seite, vollständig.' },
  code({ text: 'export default () => "<h1>Hallo</h1>"' }),
)`, { align: 'stretch' }),

      h2('Alt-Text'),
      p(
        'Das Attribut ',
        code('alt'),
        ' wird immer geschrieben, leer, wenn du nichts angibst — ein Bild ganz ohne ',
        code('alt'),
        ' wird über seinen Dateinamen angesagt, was schlimmer ist als Schweigen. Eine Unterschrift ist kein Ersatz: die Unterschrift liest jede, der Alt-Text beschreibt das Bild jemandem, der es nicht sehen kann.',
      ),
      p(
        'Wenn die Unterschrift bereits alles sagt, was das Bild sagt, ist ',
        code("alt: ''"),
        ' die richtige Antwort.',
      ),

      h2('In Fließtext'),
      p(
        'Abbildungen, die aus einem Markdown-Renderer kommen, gestaltet ',
        code('prose()'),
        ' bereits. Diese Komponente ist für Abbildungen, die du selbst baust.',
      ),

      h2('Props'),
      propsTable([
        ['src', 'string', '', 'Bildquelle. Weglassen und stattdessen Kinder nutzen.'],
        ['alt', 'string', "''", 'Alt-Text. Wird immer geschrieben, auch leer.'],
        ['caption', 'Child', '', 'Die figcaption.'],
        ['ratio', 'string', '', 'Hält den Platz frei, bevor das Bild lädt.'],
      ]),
    ],
  })
