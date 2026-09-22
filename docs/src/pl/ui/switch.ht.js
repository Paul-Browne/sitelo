import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pl.js'

export default () =>
  uiLayout({
    title: 'Przełącznik',
    description:
      'Włącznik dla ustawienia, które działa natychmiast — pod spodem pole wyboru, z role="switch".',
    activeHref: '/pl/ui/switch',
    children: [
      p(
        'Przełącznik jest dla ustawienia, które stosuje się, gdy tylko je przestawisz. Pole wyboru jest dla decyzji, którą potwierdzasz później, przyciskiem wysyłania. Jeśli Twoja kontrolka siedzi w formularzu z przyciskiem Zapisz na dole, to pole wyboru.',
      ),
      p(
        'Komponent nazywa się ',
        code('toggle()'),
        ', a nie ',
        code('switch()'),
        ', z nudnego, ale nieuniknionego powodu: ',
        code('switch'),
        ' to słowo zastrzeżone, więc nie może być wiązaniem importu. Pod spodem to prawdziwy ',
        code('<input type="checkbox">'),
        ' niosący ',
        code('role="switch"'),
        '.',
      ),

      h2('Podstawowy przełącznik'),
      demo(`stack({ direction: 'row', gap: 'lg' },
  toggle({ label: 'Witryna publiczna', name: 'public' }),
  toggle({ label: 'Włączony', name: 'on', checked: true }),
)`),

      h2('Kolory'),
      demo(`stack({ direction: 'row', gap: 'lg', wrap: true },
  toggle({ label: 'Primary', checked: true, color: 'primary' }),
  toggle({ label: 'Neutral', checked: true, color: 'neutral' }),
  toggle({ label: 'Success', checked: true, color: 'success' }),
  toggle({ label: 'Warning', checked: true, color: 'warning' }),
  toggle({ label: 'Danger', checked: true, color: 'danger' }),
)`),

      h2('Wyłączony'),
      demo(`stack({ direction: 'row', gap: 'lg' },
  toggle({ label: 'Wyłączony i zablokowany', disabled: true }),
  toggle({ label: 'Włączony i zablokowany', checked: true, disabled: true }),
)`),

      h2('Bez etykiety'),
      p(
        'Przełącznik bez widocznej etykiety nadal potrzebuje dostępnej nazwy. Podaj ',
        code('aria-label'),
        ' — przechodzi na input.',
      ),
      demo(`toggle({ 'aria-label': 'Włącz wyszukiwanie Pagefind', checked: true })`),

      h2('Lista ustawień'),
      p(
        'Typowy kształt: etykieta po lewej, przełącznik po prawej, jeden wiersz na ustawienie.',
      ),
      demo(`return list(
  [
    ['Wyszukiwanie Pagefind', 'Indeksuje każdą stronę na końcu buildu.', true],
    ['Optymalizacja obrazów', 'Skaluje i konwertuje obrazy podczas buildu. Wymaga sharpa.', true],
    ['Wyspy serwerowe', 'Renderuje oznaczone obszary w chwili żądania.', false],
  ].map(([name, description, on]) =>
    listItem({
      title: name,
      description,
      end: toggle({ 'aria-label': name, checked: on }),
    }),
  ),
)`, { align: 'stretch' }),

      h2('Propsy'),
      propsTable([
        ['label', 'Child', '', 'Tekst obok przełącznika. Gdy go nie ma, użyj aria-label.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Kolor toru, gdy włączony.'],
        ['checked', 'boolean', 'false', 'Czy startuje włączony.'],
        ['name', 'string', '', 'Nazwa pola formularza.'],
        ['disabled', 'boolean', 'false', 'Wyłącza input i przygasza wiersz.'],
      ]),
      p(
        'Cała reszta przechodzi na ',
        code('<input>'),
        ', gdzie należą ',
        code('onchange'),
        ' i ',
        code('aria-*'),
        '.',
      ),
    ],
  })
