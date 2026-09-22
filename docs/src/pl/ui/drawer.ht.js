import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pl.js'

export default () =>
  uiLayout({
    title: 'Szuflada',
    description:
      'Panel wjeżdżający od krawędzi — ta sama mechanika popovera co w oknie modalnym, inny kształt.',
    activeHref: '/pl/ui/drawer',
    children: [
      p(
        'Szuflada to panel pełnej wysokości zakotwiczony do jednej strony. Tak jak ',
        code('modal()'),
        ', jest ',
        code('popoverem'),
        ': przycisk z pasującym ',
        code('popovertarget'),
        ' ją otwiera, a przeglądarka zajmuje się tłem, kliknięciem poza i Escape.',
      ),
      p(
        'Jej najczęstszym zadaniem na witrynie statycznej jest menu nawigacji na telefonie.',
      ),

      h2('Podstawowa szuflada'),
      demo(`fragment(
  button({ popovertarget: 'drawer-basic' }, 'Otwórz szufladę'),
  drawer({ id: 'drawer-basic', title: 'Ustawienia' },
    stack({ gap: 'md' },
      toggle({ label: 'Wyszukiwanie Pagefind', checked: true }),
      toggle({ label: 'Optymalizacja obrazów', checked: true }),
      toggle({ label: 'Wyspy serwerowe' }),
    ),
  ),
)`),

      h2('Strony'),
      demo(`fragment(
  stack({ direction: 'row', gap: 'sm' },
    button({ variant: 'outline', color: 'neutral', popovertarget: 'drawer-start' }, 'Od początku'),
    button({ variant: 'outline', color: 'neutral', popovertarget: 'drawer-end' }, 'Od końca'),
  ),
  drawer({ id: 'drawer-start', side: 'start', title: 'Początek' },
    text({ variant: 'small', tone: 'muted' }, 'Zakotwiczona do krawędzi początkowej — lewej w języku pisanym od lewej do prawej.'),
  ),
  drawer({ id: 'drawer-end', title: 'Koniec' },
    text({ variant: 'small', tone: 'muted' }, 'Domyślnie: zakotwiczona do krawędzi końcowej.'),
  ),
)`),

      h2('Szerokość'),
      p(
        'Dowolna długość CSS. Jest ograniczona do 90% widocznego obszaru, więc nawet szeroka szuflada zmieści się na telefonie.',
      ),
      demo(`fragment(
  stack({ direction: 'row', gap: 'sm' },
    button({ variant: 'outline', color: 'neutral', popovertarget: 'drawer-narrow' }, 'Wąska'),
    button({ variant: 'outline', color: 'neutral', popovertarget: 'drawer-wide' }, 'Szeroka'),
  ),
  drawer({ id: 'drawer-narrow', width: '14rem', title: 'Wąska' },
    text({ variant: 'small', tone: 'muted' }, 'width: 14rem'),
  ),
  drawer({ id: 'drawer-wide', width: '34rem', title: 'Szeroka' },
    text({ variant: 'small', tone: 'muted' }, 'width: 34rem'),
  ),
)`),

      h2('Jako menu nawigacji'),
      p(
        'Wzorzec, jakiego chce większość witryn: przycisk menu w pasku, odnośniki w szufladzie.',
      ),
      demo(`fragment(
  appBar({ brand: 'sitelo' },
    appBarSpacer(),
    appBarActions(
      iconButton({
        label: 'Otwórz nawigację',
        variant: 'ghost',
        color: 'neutral',
        popovertarget: 'drawer-nav',
        icon: icon('menu'),
      }),
    ),
  ),
  drawer({ id: 'drawer-nav', title: 'Nawigacja' },
    navLink({ href: '#docs', current: true }, 'Dokumentacja'),
    navLink({ href: '#ui' }, 'UI'),
    navLink({ href: '#examples' }, 'Przykłady'),
    navLink({ href: '#about' }, 'O projekcie'),
    divider({ spacing: 'sm' }),
    button({ block: true }, 'Zacznij'),
  ),
)`, { align: 'stretch' }),

      h2('Panel filtrów'),
      demo(`fragment(
  button({ variant: 'soft', color: 'neutral', popovertarget: 'drawer-filters' }, 'Filtry'),
  drawer({ id: 'drawer-filters', title: 'Filtry', width: '22rem' },
    stack({ gap: 'lg' },
      choiceGroup({
        legend: 'Typ',
        name: 'drawer-type',
        value: 'guide',
        options: [
          { value: 'guide', label: 'Przewodniki' },
          { value: 'example', label: 'Przykłady' },
          { value: 'all', label: 'Wszystko' },
        ],
      }),
      choiceGroup({
        legend: 'Tagi',
        name: 'drawer-tags',
        type: 'checkbox',
        value: ['routing'],
        options: ['routing', 'data', 'islands'],
      }),
      stack({ direction: 'row', gap: 'sm' },
        button({ variant: 'ghost', color: 'neutral', popovertarget: 'drawer-filters', popovertargetaction: 'hide' }, 'Anuluj'),
        button('Zastosuj'),
      ),
    ),
  ),
)`),

      h2('Przewijanie tła'),
      p(
        'Strona za otwartą szufladą się nie przewija — ta sama blokada zrobiona wyłącznie w CSS-ie, której używa ',
        code('modal()'),
        ', bez skryptu i bez niczego do zainicjowania. Podaj ',
        code('lockScroll: false'),
        ', żeby tło przewijało się jak zwykle.',
      ),

      h2('Propsy'),
      propsTable([
        ['id', 'string', '', 'Wymagane. To, na co wskazuje popovertarget wyzwalacza.'],
        ['title', 'Child', '', 'Nagłówek i dostępna nazwa okna dialogowego.'],
        ['side', "'start' | 'end'", "'end'", 'Do której krawędzi jest zakotwiczona.'],
        ['width', 'string', "'20rem'", 'Szerokość panelu, ograniczona do 90vw.'],
        ['closable', 'boolean', 'true', 'Pokaż × w nagłówku.'],
        ['closeLabel', 'string', "'Close'", 'Dostępna nazwa tego przycisku.'],
        ['lockScroll', 'boolean', 'true', 'Blokuje przewijanie strony za nią, gdy jest otwarta.'],
      ]),
    ],
  })
