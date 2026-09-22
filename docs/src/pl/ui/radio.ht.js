import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pl.js'

export default () =>
  uiLayout({
    title: 'Grupa opcji',
    description:
      'Jeden wybór z kilku, jako prawdziwe opcje radio dzielące nazwę — z legendą i rolą grupy.',
    activeHref: '/pl/ui/radio',
    children: [
      p(
        'Opcje radio służą do wybrania dokładnie jednej możliwości z małego, widocznego zestawu. ',
        code('radio()'),
        ' renderuje jedną; ',
        code('choiceGroup()'),
        ' buduje cały zestaw z tablicy i daje mu legendę oraz ',
        code('role="radiogroup"'),
        ', które czynią z niego grupę, a nie stertę inputów.',
      ),
      p(
        'Dzielą ',
        code('name'),
        ', więc wzajemną wyłącznością i przechodzeniem strzałkami zajmuje się przeglądarka. Nic tu nie wysyła skryptu.',
      ),

      h2('Podstawowa grupa'),
      demo(`choiceGroup({
  legend: 'Plan',
  name: 'plan',
  value: 'pro',
  options: [
    { value: 'free', label: 'Darmowy' },
    { value: 'pro', label: 'Pro' },
    { value: 'team', label: 'Zespół' },
  ],
})`, { align: 'stretch' }),

      h2('W rzędzie'),
      p(
        'Krótkie etykiety lepiej czyta się w jednej linii. Długie powinny zostać ułożone pionowo, co jest domyślne.',
      ),
      demo(`choiceGroup({
  legend: 'Format',
  name: 'form-factor',
  direction: 'row',
  value: 'desktop',
  options: ['desktop', 'mobile'],
})`, { align: 'stretch' }),

      h2('Zwykłe ciągi znaków'),
      p('Gdy wartość i etykieta są takie same, podaj ciągi znaków.'),
      demo(`choiceGroup({
  legend: 'Poziom logowania',
  name: 'log-level',
  direction: 'row',
  value: 'warn',
  options: ['info', 'warn', 'error', 'silent'],
})`, { align: 'stretch' }),

      h2('Wyłączone opcje'),
      demo(`choiceGroup({
  legend: 'Renderer',
  name: 'renderer',
  value: 'static',
  options: [
    { value: 'static', label: 'Statyczny' },
    { value: 'islands', label: 'Wyspy serwerowe' },
    { value: 'ssr', label: 'Pełny SSR', disabled: true },
  ],
  help: 'Pełny SSR wymaga hosta Node, którego ten projekt nie ma.',
})`, { align: 'stretch' }),

      h2('Po jednej'),
      p(
        'Użyj ',
        code('radio()'),
        ' wprost, gdy opcje nie są na tyle jednorodne, by pochodzić z tablicy — na przykład gdy każda niesie własny opis.',
      ),
      demo(`stack({ gap: 'md' },
  radio({ name: 'deploy', value: 'push', label: 'Przy każdym pushu', checked: true }),
  radio({ name: 'deploy', value: 'tag', label: 'Tylko przy wydaniach z tagiem' }),
  radio({ name: 'deploy', value: 'manual', label: 'Ręcznie' }),
)`, { align: 'stretch' }),

      h2('Kolory'),
      demo(`stack({ direction: 'row', gap: 'lg', wrap: true },
  radio({ label: 'Primary', name: 'c1', checked: true, color: 'primary' }),
  radio({ label: 'Neutral', name: 'c2', checked: true, color: 'neutral' }),
  radio({ label: 'Success', name: 'c3', checked: true, color: 'success' }),
  radio({ label: 'Warning', name: 'c4', checked: true, color: 'warning' }),
  radio({ label: 'Danger', name: 'c5', checked: true, color: 'danger' }),
)`),

      h2('W karcie'),
      demo(`card(
  cardHeader({ title: 'Ustawienia buildu', subtitle: 'Zastosowane przy następnym wdrożeniu' }),
  cardBody(
    stack({ gap: 'lg' },
      choiceGroup({
        legend: 'Czyste URL-e',
        name: 'clean-urls',
        direction: 'row',
        value: 'on',
        options: [
          { value: 'on', label: 'Włączone' },
          { value: 'off', label: 'Wyłączone' },
        ],
      }),
      choiceGroup({
        legend: 'Obrazy',
        name: 'images',
        value: 'optimise',
        options: [
          { value: 'optimise', label: 'Skaluj i konwertuj' },
          { value: 'copy', label: 'Kopiuj bez zmian' },
        ],
      }),
    ),
  ),
  cardFooter({ divided: true, style: 'justify-content: flex-end' },
    button({ type: 'submit' }, 'Zapisz'),
  ),
)`, { align: 'stretch' }),

      h2('Propsy'),
      p(code('choiceGroup()'), ':'),
      propsTable([
        ['legend', 'Child', '', 'Etykieta całej grupy.'],
        ['name', 'string', '', 'Wspólna nazwa formularza — to ona czyni opcje wyłącznymi.'],
        ['options', 'Array', '[]', 'Ciągi znaków albo obiekty { value, label, disabled }.'],
        ['value', 'string | number | Array', '', 'Która opcja jest zaznaczona. Tablica dla pól wyboru.'],
        ['type', "'radio' | 'checkbox'", "'radio'", 'Którą kontrolkę zbudować. Dobiera też rolę grupy.'],
        ['direction', "'row' | 'column'", "'column'", 'Jak ułożone są opcje.'],
        ['help', 'Child', '', 'Wskazówka pod grupą.'],
      ]),
      p(
        code('radio()'),
        ' przyjmuje te same propsy co ',
        code('checkbox()'),
        ': ',
        code('label'),
        ', ',
        code('color'),
        ', ',
        code('checked'),
        ', ',
        code('name'),
        ', ',
        code('value'),
        ' i ',
        code('disabled'),
        '.',
      ),
    ],
  })
