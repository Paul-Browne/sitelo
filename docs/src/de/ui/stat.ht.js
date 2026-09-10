import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/de.js'

export default () =>
  uiLayout({
    title: 'Kennzahl',
    description:
      'Eine Zahl, die einen Blick wert ist, samt ihrer Bedeutung und der Richtung, in die sie sich bewegt hat.',
    activeHref: '/de/ui/stat',
    children: [
      p(
        'Eine Kennzahl besteht aus Label, Wert und wahlweise einer Veränderung. ',
        code('statGroup()'),
        ' fügt mehrere zu einer Fläche zusammen, mit Trennlinien dazwischen.',
      ),

      h2('Einfache Kennzahl'),
      demo(`statGroup(
  stat({ label: 'Seiten', value: '204' }),
  stat({ label: 'Build-Zeit', value: '1,1 s' }),
  stat({ label: 'Client-JS', value: '3,3 kB' }),
)`, { align: 'stretch' }),

      h2('Mit Veränderung'),
      p(
        'Die Veränderung nimmt ihre Farbe aus ',
        code('color'),
        ' — grün für eine Zahl, die in die richtige Richtung ging, rot für eine, die es nicht tat. Verlass dich nicht auf die Farbe allein: behalte das Vorzeichen oder das Wort.',
      ),
      demo(`statGroup(
  stat({ label: 'Seiten', value: '204', change: '+8 diese Woche', color: 'success' }),
  stat({ label: 'Build-Zeit', value: '1,1 s', change: '−0,3 s', color: 'success' }),
  stat({ label: 'Bundle', value: '9,9 kB', change: '+1,2 kB', color: 'danger' }),
)`, { align: 'stretch' }),

      h2('Mit Icons'),
      demo(`statGroup(
  stat({
    label: 'Deployments',
    value: '128',
    color: 'primary',
    icon: icon('zap'),
  }),
  stat({
    label: 'Mitwirkende',
    value: '17',
    color: 'primary',
    icon: icon('user'),
  }),
)`, { align: 'stretch' }),

      h2('Hilfetext'),
      demo(`statGroup(
  stat({
    label: 'Lighthouse',
    value: '100',
    change: 'Barrierefreiheit',
    color: 'success',
    help: 'In der CI auf jeder englischen Seite gemessen.',
  }),
  stat({
    label: 'Pagefind-Index',
    value: '204',
    help: 'Wird am Ende jedes Builds neu erzeugt.',
  }),
)`, { align: 'stretch' }),

      h2('Für sich allein'),
      p('Eine einzelne Kennzahl braucht keine Gruppe — sie hat dann nur keine eigene Fläche.'),
      demo(`card(
  cardBody(stat({ label: 'Seiten insgesamt', value: '204', change: '+8', color: 'success' })),
)`, { align: 'stretch' }),

      h2('Feste Spalten'),
      p(
        'Kennzahlen passen sich standardmäßig selbst ein. ',
        code('columns'),
        ' legt die Anzahl fest, wenn die Zahlen auf einer Reihe bleiben sollen.',
      ),
      demo(`statGroup({ columns: 'repeat(2, 1fr)' },
  stat({ label: 'Bestanden', value: '215', color: 'success' }),
  stat({ label: 'Fehlgeschlagen', value: '0', color: 'success' }),
)`, { align: 'stretch' }),

      h2('Aus Daten'),
      demo(`return (() => {
  const report = [
    { label: 'Seiten', value: 204 },
    { label: 'Assets', value: 208 },
    { label: 'Gesamt', value: '9,7 MB' },
  ]

  return statGroup(
    report.map((entry) => stat({ label: entry.label, value: String(entry.value) })),
  )
})()`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['label', 'Child', '', 'Was die Zahl zählt.'],
        ['value', 'Child', '', 'Die Zahl selbst, in Tabellenziffern gesetzt.'],
        ['change', 'Child', '', 'Eine Veränderung, eingefärbt über color.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", '', 'Färbt Veränderung und Icon.'],
        ['icon', 'Child', '', 'Dekoratives Zeichen über dem Label.'],
        ['help', 'Child', '', 'Eine leisere Zeile unter allem anderen.'],
      ]),
      p(code('statGroup()'), ' nimmt ', code('columns'), ' — jeden ', code('grid-template-columns'), '-Wert.'),
    ],
  })
