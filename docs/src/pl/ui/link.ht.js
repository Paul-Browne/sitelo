import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pl.js'

export default () =>
  uiLayout({
    title: 'Odnośnik',
    description:
      'Ostylowana kotwica, z atrybutami bezpieczeństwa, których potrzebuje odnośnik zewnętrzny.',
    activeHref: '/pl/ui/link',
    children: [
      p(
        'Odnośnik to kotwica z bibliotecznym podkreśleniem i paletą. Eksportowany jest pod dwiema nazwami — ',
        code('link'),
        ' i ',
        code('textLink'),
        ' — bo ',
        code('link'),
        ' to także element ',
        code('<link>'),
        ' z javascript-to-html, a zaimportowanie obu pod jedną nazwą to błąd składni. Użyj ',
        code('textLink'),
        ' albo zaimportuj bibliotekę jako przestrzeń nazw.',
      ),

      h2('Podstawowy odnośnik'),
      demo(`text('Przeczytaj ', link({ href: '/docs' }, 'dokumentację'), ', żeby zacząć.')`, {
        align: 'stretch',
      }),

      h2('Kolory'),
      demo(`stack({ direction: 'row', gap: 'lg', wrap: true },
  link({ href: '#', color: 'primary' }, 'Primary'),
  link({ href: '#', color: 'neutral' }, 'Neutral'),
  link({ href: '#', color: 'success' }, 'Success'),
  link({ href: '#', color: 'warning' }, 'Warning'),
  link({ href: '#', color: 'danger' }, 'Danger'),
)`),

      h2('Dyskretny'),
      p(
        'Dyskretny odnośnik dziedziczy kolor otoczenia i pokazuje podkreślenie po najechaniu — dla list odnośników, gdzie podkreślenie w każdym wierszu byłoby szumem.',
      ),
      demo(`stack({ gap: 'xs' },
  link({ href: '/docs/routing', subtle: true }, 'Routing'),
  link({ href: '/docs/data', subtle: true }, 'Wczytywanie danych'),
  link({ href: '/docs/assets', subtle: true }, 'Zasoby i style'),
)`, { align: 'stretch' }),

      h2('Odnośniki zewnętrzne'),
      p(
        code('external'),
        ' dodaje ',
        code('target="_blank"'),
        ' i ',
        code('rel'),
        ', który musi mu towarzyszyć. Napisz w treści odnośnika, że otwiera nową kartę, albo dodaj notkę ukrytą wizualnie — nowa karta bez uprzedzenia dezorientuje.',
      ),
      demo(`text(
  'Biblioteka jest na ',
  link({ href: 'https://www.npmjs.com/package/sitelo', external: true },
    'npm',
    visuallyHidden(' (otwiera się w nowej karcie)'),
  ),
  '.',
)`, { align: 'stretch' }),

      h2('W akapicie'),
      demo(`text({ variant: 'lead' },
  'sitelo stoi na ',
  link({ href: 'https://vite.dev', external: true }, 'Vite'),
  ', renderuje przez ',
  link({ href: 'https://ht.js.org', external: true }, 'javascript-to-html'),
  ' i nie wysyła nic do przeglądarki, dopóki go o to nie poprosisz.',
)`, { align: 'stretch' }),

      h2('Kiedy zamiast tego użyć przycisku'),
      p(
        'Odnośnik nawiguje; przycisk wykonuje akcję. Jeśli rzecz zmienia stan na stronie, zamiast zabierać czytającego gdzieś indziej, powinna być ',
        code('button()'),
        ' — a jeśli nawiguje, ale ma wyglądać jak przycisk, daj ',
        code('button()'),
        ' atrybut ',
        code('href'),
        ', co pod spodem wyrenderuje kotwicę.',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center', wrap: true },
  link({ href: '/docs' }, 'Odnośnik, który nawiguje'),
  button({ href: '/docs', variant: 'outline' }, 'Odnośnik wyglądający jak przycisk'),
  button({ variant: 'link' }, 'Przycisk wyglądający jak odnośnik'),
)`),

      h2('Propsy'),
      propsTable([
        ['href', 'string', '', 'Dokąd prowadzi.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Z której palety czerpać.'],
        ['subtle', 'boolean', 'false', 'Dziedzicz kolor otoczenia; podkreślenie tylko po najechaniu.'],
        ['external', 'boolean', 'false', 'Dodaje target="_blank" i rel="noopener noreferrer".'],
      ]),
    ],
  })
