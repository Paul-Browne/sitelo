import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/it.js'

export default () =>
  uiLayout({
    title: 'Statistica',
    description:
      'Un numero che vale la pena guardare, con cosa significa e in che direzione si è mosso.',
    activeHref: '/it/ui/stat',
    children: [
      p(
        'Una statistica è un’etichetta, un valore e facoltativamente una variazione. ',
        code('statGroup()'),
        ' ne unisce diverse su un’unica superficie, con dei divisori in mezzo.',
      ),

      h2('Statistica di base'),
      demo(`statGroup(
  stat({ label: 'Pagine', value: '204' }),
  stat({ label: 'Tempo di build', value: '1,1s' }),
  stat({ label: 'JS client', value: '3,3 kB' }),
)`, { align: 'stretch' }),

      h2('Con una variazione'),
      p(
        'La variazione prende il colore da ',
        code('color'),
        ' — verde per un numero che è andato nella direzione giusta, rosso per uno che non l’ha fatto. Non affidarti al solo colore: tieni il segno o la parola.',
      ),
      demo(`statGroup(
  stat({ label: 'Pagine', value: '204', change: '+8 questa settimana', color: 'success' }),
  stat({ label: 'Tempo di build', value: '1,1s', change: '−0,3s', color: 'success' }),
  stat({ label: 'Bundle', value: '9,9 kB', change: '+1,2 kB', color: 'danger' }),
)`, { align: 'stretch' }),

      h2('Con icone'),
      demo(`statGroup(
  stat({
    label: 'Deploy',
    value: '128',
    color: 'primary',
    icon: icon('zap'),
  }),
  stat({
    label: 'Contributori',
    value: '17',
    color: 'primary',
    icon: icon('user'),
  }),
)`, { align: 'stretch' }),

      h2('Testo di aiuto'),
      demo(`statGroup(
  stat({
    label: 'Lighthouse',
    value: '100',
    change: 'accessibilità',
    color: 'success',
    help: 'Misurato su ogni pagina inglese in CI.',
  }),
  stat({
    label: 'Indice Pagefind',
    value: '204',
    help: 'Ricostruito alla fine di ogni build.',
  }),
)`, { align: 'stretch' }),

      h2('Da sola'),
      p(
        'Una singola statistica non ha bisogno di un gruppo — semplicemente non ha una superficie propria.',
      ),
      demo(`card(
  cardBody(stat({ label: 'Pagine totali', value: '204', change: '+8', color: 'success' })),
)`, { align: 'stretch' }),

      h2('Colonne fisse'),
      p(
        'Le statistiche si adattano automaticamente per impostazione predefinita. ',
        code('columns'),
        ' fissa il conteggio quando i numeri devono restare su una sola riga.',
      ),
      demo(`statGroup({ columns: 'repeat(2, 1fr)' },
  stat({ label: 'Passate', value: '215', color: 'success' }),
  stat({ label: 'Fallite', value: '0', color: 'success' }),
)`, { align: 'stretch' }),

      h2('Dai dati'),
      demo(`return (() => {
  const report = [
    { label: 'Pagine', value: 204 },
    { label: 'Risorse', value: 208 },
    { label: 'Totale', value: '9,7 MB' },
  ]

  return statGroup(
    report.map((entry) => stat({ label: entry.label, value: String(entry.value) })),
  )
})()`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['label', 'Child', '', 'Che cosa conta il numero.'],
        ['value', 'Child', '', 'Il numero stesso, composto in cifre tabulari.'],
        ['change', 'Child', '', 'Una differenza, colorata da color.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", '', 'Colora la variazione e l’icona.'],
        ['icon', 'Child', '', 'Glifo decorativo sopra l’etichetta.'],
        ['help', 'Child', '', 'Una riga più sommessa sotto tutto il resto.'],
      ]),
      p(
        code('statGroup()'),
        ' accetta ',
        code('columns'),
        ' — qualunque valore di ',
        code('grid-template-columns'),
        '.',
      ),
    ],
  })
