import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pl.js'
import { preview } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Menu',
    description:
      'Lista rozwijana zbudowana na <details>, więc otwiera się i zamyka zupełnie bez skryptu.',
    activeHref: '/pl/ui/menu',
    children: [
      p(
        'Menu to ',
        code('<details>'),
        ' z ostylowanym panelem. To świadomy wybór zamiast API popover: popover żyje w warstwie wierzchniej i nie da się go ustawić względem wyzwalacza bez anchor positioning, którego jeszcze nie ma wszędzie. ',
        code('<details>'),
        ' pozycjonuje się poprawnie już dziś i nie wymaga niczego doładowanego.',
      ),
      p(
        'Wyzwalaczem jest to ',
        code('<summary>'),
        ', ostylowane jak przycisk — więc etykietę i propsy przycisku podajesz do ',
        code('menu()'),
        ', a nie przekazujesz gotowego ',
        code('button()'),
        '. Summary jest już interaktywne, a przycisk w jego wnętrzu zagnieżdża dwie kontrolki tam, gdzie jest jedna akcja: niepoprawne znaczniki i dwa przystanki tabulacji na jedną rzecz.',
      ),
      p(
        'Zamykanie kliknięciem poza i Escape pochodzą z handlera ',
        code('ontoggle'),
        ', który importuje je przy pierwszym otwarciu menu — i tylko wtedy. Jeśli ten moduł nigdy nie dotrze, menu i tak otwiera się i zamyka własnym summary.',
      ),

      h2('Podstawowe menu'),
      demo(`menu({ trigger: 'Akcje' },
  menuItem({ href: '#edit' }, 'Edytuj'),
  menuItem({ href: '#duplicate' }, 'Duplikuj'),
  menuSeparator(),
  menuItem({ href: '#delete' }, 'Usuń'),
)`),

      h2('Wyrównanie'),
      p(
        'Menu otwiera się od początkowej krawędzi swojego wyzwalacza. ',
        code("align: 'end'"),
        ' je odwraca, czego potrzebuje menu przy prawej krawędzi paska.',
      ),
      demo(`stack({ direction: 'row', gap: 'xl', justify: 'space-between', style: 'width: 100%' },
  menu({ trigger: 'Do początku', variant: 'soft' },
    menuItem({ href: '#a' }, 'Pierwszy'),
    menuItem({ href: '#b' }, 'Drugi'),
  ),
  menu({ trigger: 'Do końca', variant: 'soft', align: 'end' },
    menuItem({ href: '#c' }, 'Pierwszy'),
    menuItem({ href: '#d' }, 'Drugi'),
  ),
)`, { align: 'stretch' }),

      h2('Wyzwalacze z ikoną'),
      p(
        'Ikona bez tekstu w ',
        code('trigger'),
        ' potrzebuje ',
        code('label'),
        ' — staje się dostępną nazwą, której ikona sama nie potrafi dać.',
      ),
      demo(`stack({ direction: 'row', gap: 'md' },
  menu({
    align: 'end',
    label: 'Więcej akcji',
    variant: 'ghost',
    icon: icon('more-horizontal'),
  },
    menuItem({ href: '#rename' }, 'Zmień nazwę'),
    menuItem({ href: '#move' }, 'Przenieś'),
    menuSeparator(),
    menuItem({ href: '#archive' }, 'Archiwizuj'),
  ),
)`),

      h2('Elementy z ikonami'),
      demo(`menu({ trigger: 'Plik' },
  menuItem({
    href: '#new',
    icon: icon('plus'),
  }, 'Nowa strona'),
  menuItem({
    href: '#open',
    icon: icon('folder'),
  }, 'Otwórz…'),
  menuSeparator(),
  menuItem({
    href: '#build',
    icon: icon('zap'),
  }, 'Zbuduj witrynę'),
)`),

      h2('Przyciski zamiast odnośników'),
      p(
        'Element bez ',
        code('href'),
        ' renderuje ',
        code('<button>'),
        ' — na akcję, która dzieje się na stronie, a nie na nawigację.',
      ),
      demo(`menu({ trigger: 'Eksport', variant: 'soft', color: 'primary' },
  menuItem({ onclick: "import('/su/toast.js').then(m=>m.toast('Wyeksportowano jako JSON.',{color:'success'}))" }, 'Jako JSON'),
  menuItem({ onclick: "import('/su/toast.js').then(m=>m.toast('Wyeksportowano jako CSV.',{color:'success'}))" }, 'Jako CSV'),
)`),
      // Demo powyżej wywołuje powiadomienia; to jest obszar, w którym lądują.
      // Ma pozycję stałą, więc renderuje się tutaj, a pojawia w rogu.
      preview('toasts()'),

      h2('W pasku aplikacji'),
      demo(`appBar({ brand: 'sitelo' },
  appBarSpacer(),
  appBarActions(
    themeToggle(),
    menu({
      align: 'end',
      label: 'Więcej',
      variant: 'ghost',
      icon: icon('more-horizontal'),
    },
      menuItem({ href: '/docs' }, 'Dokumentacja'),
      menuItem({ href: '/examples' }, 'Przykłady'),
      menuSeparator(),
      menuItem({ href: 'https://github.com/paul-browne/sitelo' }, 'GitHub'),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Dostępność'),
      p(
        'Panel ma ',
        code('role="menu"'),
        ', którego elementy mają ',
        code('role="menuitem"'),
        ', a summary niesie ',
        code('aria-haspopup'),
        '. ',
        code('<details>'),
        ' nie jest natywnym widżetem menu, więc to rozsądne przybliżenie, a nie rzecz doskonała — dla zwykłej listy odnośników ',
        code('nav'),
        ' wewnątrz details jest równie poprawny i obiecuje mniej.',
      ),

      h2('Propsy'),
      p(code('menu()'), ' — propsy wyzwalacza to propsy przycisku:'),
      propsTable([
        ['trigger', 'Child', '', 'Widoczna etykieta. Podaj tekst, a nie gotowy button().'],
        ['icon', 'Child', '', 'Znaczniki przed etykietą albo same, dla wyzwalacza z samą ikoną.'],
        ['label', 'string', '', 'Dostępna nazwa. Wymagana, gdy jest ikona i nie ma tekstu w trigger.'],
        ['variant', "'solid' | 'soft' | 'outline' | 'ghost' | 'link'", "'outline'", 'Styl wyzwalacza.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'neutral'", 'Z której palety czerpie wyzwalacz.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Rozmiar wyzwalacza.'],
        ['align', "'start' | 'end'", "'start'", 'Do której krawędzi wyzwalacza ustawia się panel.'],
        ['triggerClass', 'string', '', 'Dodatkowe klasy dla wyzwalacza, a nie dla opakowującego details.'],
      ]),
      p(code('menuItem()'), ':'),
      propsTable([
        ['href', 'string', '', 'Renderuje kotwicę; bez tego przycisk.'],
        ['icon', 'Child', '', 'Znaczniki przed etykietą.'],
        ['as', 'string', "'button'", 'Element do wyrenderowania, gdy nie ma href.'],
      ]),
      p(
        code('menuSeparator()'),
        ' nie przyjmuje propsów — to włoskowa linia między grupami elementów.',
      ),
    ],
  })
