import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pl.js'

export default () =>
  uiLayout({
    title: 'Statystyka',
    description:
      'Liczba warta spojrzenia, z tym, co znaczy i w którą stronę się ruszyła.',
    activeHref: '/pl/ui/stat',
    children: [
      p(
        'Statystyka to etykieta, wartość i opcjonalnie zmiana. ',
        code('statGroup()'),
        ' łączy kilka na jednej powierzchni, z separatorami pomiędzy.',
      ),

      h2('Podstawowa statystyka'),
      demo(`statGroup(
  stat({ label: 'Strony', value: '204' }),
  stat({ label: 'Czas buildu', value: '1,1s' }),
  stat({ label: 'JS klienta', value: '3,3 kB' }),
)`, { align: 'stretch' }),

      h2('Ze zmianą'),
      p(
        'Zmiana bierze kolor z ',
        code('color'),
        ' — zielony dla liczby, która poszła we właściwą stronę, czerwony dla tej, która nie. Nie polegaj na samym kolorze: zostaw znak albo słowo.',
      ),
      demo(`statGroup(
  stat({ label: 'Strony', value: '204', change: '+8 w tym tygodniu', color: 'success' }),
  stat({ label: 'Czas buildu', value: '1,1s', change: '−0,3s', color: 'success' }),
  stat({ label: 'Paczka', value: '9,9 kB', change: '+1,2 kB', color: 'danger' }),
)`, { align: 'stretch' }),

      h2('Z ikonami'),
      demo(`statGroup(
  stat({
    label: 'Wdrożenia',
    value: '128',
    color: 'primary',
    icon: icon('zap'),
  }),
  stat({
    label: 'Współtwórcy',
    value: '17',
    color: 'primary',
    icon: icon('user'),
  }),
)`, { align: 'stretch' }),

      h2('Tekst pomocy'),
      demo(`statGroup(
  stat({
    label: 'Lighthouse',
    value: '100',
    change: 'dostępność',
    color: 'success',
    help: 'Mierzone na każdej angielskiej stronie w CI.',
  }),
  stat({
    label: 'Indeks Pagefind',
    value: '204',
    help: 'Przebudowywany na końcu każdego buildu.',
  }),
)`, { align: 'stretch' }),

      h2('Sama z siebie'),
      p(
        'Pojedyncza statystyka nie potrzebuje grupy — po prostu nie ma wtedy własnej powierzchni.',
      ),
      demo(`card(
  cardBody(stat({ label: 'Wszystkich stron', value: '204', change: '+8', color: 'success' })),
)`, { align: 'stretch' }),

      h2('Stałe kolumny'),
      p(
        'Statystyki domyślnie dopasowują się same. ',
        code('columns'),
        ' ustala ich liczbę, gdy liczby mają zostać w jednym wierszu.',
      ),
      demo(`statGroup({ columns: 'repeat(2, 1fr)' },
  stat({ label: 'Zaliczone', value: '215', color: 'success' }),
  stat({ label: 'Niezaliczone', value: '0', color: 'success' }),
)`, { align: 'stretch' }),

      h2('Z danych'),
      demo(`return (() => {
  const report = [
    { label: 'Strony', value: 204 },
    { label: 'Zasoby', value: 208 },
    { label: 'Razem', value: '9,7 MB' },
  ]

  return statGroup(
    report.map((entry) => stat({ label: entry.label, value: String(entry.value) })),
  )
})()`, { align: 'stretch' }),

      h2('Propsy'),
      propsTable([
        ['label', 'Child', '', 'Co liczy ta liczba.'],
        ['value', 'Child', '', 'Sama liczba, złożona cyframi tabelarycznymi.'],
        ['change', 'Child', '', 'Różnica, pokolorowana przez color.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", '', 'Koloruje zmianę i ikonę.'],
        ['icon', 'Child', '', 'Ozdobny znak nad etykietą.'],
        ['help', 'Child', '', 'Cichszy wiersz pod resztą.'],
      ]),
      p(
        code('statGroup()'),
        ' przyjmuje ',
        code('columns'),
        ' — dowolną wartość ',
        code('grid-template-columns'),
        '.',
      ),
    ],
  })
