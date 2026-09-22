import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pl.js'

export default () =>
  uiLayout({
    title: 'Pole wyboru',
    description:
      'Pole wyboru i jego etykieta jako jedna kontrolka — prawdziwy input, ostylowany CSS-em, a nie podmieniony.',
    activeHref: '/pl/ui/checkbox',
    children: [
      p(
        code('checkbox()'),
        ' renderuje ',
        code('<label>'),
        ' opakowującą prawdziwy ',
        code('<input type="checkbox">'),
        ' i widoczny kwadracik. Input jest ukryty wizualnie, ale wciąż tam jest, więc da się go sfokusować, wysyła się z formularzem, a cała etykieta jest celem kliknięcia — ptaszek rysowany jest z własnego stanu ',
        code(':checked'),
        ' inputa, bez udziału jakiegokolwiek skryptu.',
      ),

      h2('Podstawowe pole wyboru'),
      demo(`stack({ direction: 'row', gap: 'lg' },
  checkbox({ label: 'Wysyłaj mi aktualizacje', name: 'updates' }),
  checkbox({ label: 'Zaznaczone', name: 'checked', checked: true }),
)`),

      h2('Kolory'),
      demo(`stack({ direction: 'row', gap: 'lg', wrap: true },
  checkbox({ label: 'Primary', checked: true, color: 'primary' }),
  checkbox({ label: 'Neutral', checked: true, color: 'neutral' }),
  checkbox({ label: 'Success', checked: true, color: 'success' }),
  checkbox({ label: 'Warning', checked: true, color: 'warning' }),
  checkbox({ label: 'Danger', checked: true, color: 'danger' }),
)`),

      h2('Wyłączone'),
      demo(`stack({ direction: 'row', gap: 'lg' },
  checkbox({ label: 'Niedostępne', disabled: true }),
  checkbox({ label: 'Zaznaczone i zablokowane', checked: true, disabled: true }),
)`),

      h2('Długie etykiety'),
      p(
        'Kwadracik zostaje wyrównany do pierwszego wiersza, zamiast centrować się względem całego akapitu.',
      ),
      demo(`checkbox({
  label: 'Uruchom audyt Lighthouse po każdym buildzie i przerwij build, gdy wynik spadnie poniżej swojego progu.',
  name: 'lighthouse',
  checked: true,
})`, { align: 'stretch' }),

      h2('Grupy'),
      p(
        code('choiceGroup()'),
        ' buduje z danych zestaw pól wyboru, ze wspólną legendą i nazwą. Podaj tablicę jako ',
        code('value'),
        ', żeby zaznaczyć kilka.',
      ),
      demo(`choiceGroup({
  legend: 'Generuj',
  name: 'generate',
  type: 'checkbox',
  value: ['sitemap', 'rss'],
  options: [
    { value: 'sitemap', label: 'sitemap.xml' },
    { value: 'rss', label: 'rss.xml' },
    { value: 'pagefind', label: 'Indeks Pagefind' },
  ],
  help: 'Każdy zapisuje się do dist/ na końcu buildu.',
})`, { align: 'stretch' }),

      h2('W rzędzie'),
      demo(`choiceGroup({
  legend: 'Kategorie',
  name: 'categories',
  type: 'checkbox',
  direction: 'row',
  value: ['performance'],
  options: ['performance', 'accessibility', 'seo'],
})`, { align: 'stretch' }),

      h2('Z polem'),
      p(
        'Pojedyncze pole wyboru rzadko potrzebuje jeszcze etykiety nad sobą. Gdy potrzebuje jej grupa, ',
        code('field()'),
        ' daje jej takie samo potraktowanie etykiety, pomocy i błędu jak polu tekstowemu.',
      ),
      demo(`field({ label: 'Regulamin', error: 'Musisz zaakceptować regulamin, żeby przejść dalej.' },
  checkbox({ label: 'Akceptuję regulamin', name: 'terms', color: 'danger' }),
)`, { align: 'stretch' }),

      h2('Propsy'),
      propsTable([
        ['label', 'Child', '', 'Tekst obok kwadracika. Pomiń dla gołej kontrolki.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Kolor, gdy zaznaczone.'],
        ['checked', 'boolean', 'false', 'Czy startuje zaznaczone.'],
        ['name', 'string', '', 'Nazwa pola formularza.'],
        ['value', 'string | number', '', 'Wartość wysyłana, gdy zaznaczone.'],
        ['disabled', 'boolean', 'false', 'Wyłącza input i przygasza etykietę.'],
      ]),
      p(
        'Cała reszta ląduje na ',
        code('<input>'),
        ', a nie na etykiecie — więc ',
        code('required'),
        ', ',
        code('onchange'),
        ' i ',
        code('data-*'),
        ' trafiają tam, gdzie się spodziewasz. Do ostylowania samej etykiety użyj ',
        code('class'),
        '.',
      ),
      p(
        'Dla zestawu budowanego z danych zobacz ',
        code('choiceGroup()'),
        ' na stronie ',
        code('Grupa opcji'),
        ' — przyjmuje te same opcje w obu przypadkach, przełączane przez ',
        code("type: 'checkbox'"),
        '.',
      ),
    ],
  })
