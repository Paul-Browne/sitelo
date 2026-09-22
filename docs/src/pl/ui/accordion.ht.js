import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pl.js'

export default () =>
  uiLayout({
    title: 'Akordeon',
    description:
      'Zwijane sekcje na własnym <details> przeglądarki — łącznie z trybem wyłączności.',
    activeHref: '/pl/ui/accordion',
    children: [
      p(
        'Każda sekcja to ',
        code('<details>'),
        '. Otwieranie, zamykanie, obsługa klawiatury i wyszukiwanie w stronie pochodzą od przeglądarki, a akordeon działa przy wyłączonym JavaScripcie — co przy najczęstszym zastosowaniu, czyli FAQ, ma znaczenie.',
      ),

      h2('Podstawowy akordeon'),
      demo(`accordion({
  items: [
    { title: 'Czym jest sitelo?', content: 'Generatorem stron statycznych zbudowanym na Vite. Strony to funkcje zwracające HTML.' },
    { title: 'Czy wysyła runtime?', content: 'Nie. Nic nie trafia do przeglądarki, dopóki sam nie podlinkujesz skryptu.' },
    { title: 'Czy mogę użyć TypeScriptu?', content: 'Tak — .ht.ts i .ht.tsx to rozszerzenia stron jak każde inne.' },
  ],
})`, { align: 'stretch' }),

      h2('Domyślnie otwarty'),
      demo(`accordion({
  items: [
    { title: 'Otwarty na wejściu', content: 'Ten ma open: true.', open: true },
    { title: 'Zamknięty', content: 'Ten nie ma.' },
  ],
})`, { align: 'stretch' }),

      h2('Jeden naraz'),
      p(
        'Wspólne ',
        code('name'),
        ' czyni sekcje wzajemnie wyłącznymi — otwarcie jednej zamyka pozostałe. To własne zachowanie przeglądarki dla ',
        code('<details name>'),
        ', a nie skrypt.',
      ),
      demo(`accordion({
  name: 'demo-exclusive',
  items: [
    { title: 'Pierwsza', content: 'Otwórz inną, a ta się zamknie.', open: true },
    { title: 'Druga', content: 'Ta też.' },
    { title: 'Trzecia', content: 'Otwarta jest zawsze tylko jedna.' },
  ],
})`, { align: 'stretch' }),

      h2('Bogata treść'),
      p(
        'Buduj sekcje przez ',
        code('accordionItem()'),
        ', gdy treść to więcej niż akapit.',
      ),
      demo(`accordion(
  accordionItem({ title: 'Instalacja', open: true },
    stack({ gap: 'sm' },
      text({ variant: 'small', tone: 'muted' }, 'Dodaj pakiet i jego towarzysza do znaczników:'),
      code('npm install sitelo javascript-to-html'),
    ),
  ),
  accordionItem({ title: 'Konfiguracja' },
    stack({ gap: 'sm' },
      text({ variant: 'small', tone: 'muted' }, 'Opcjonalna. Opcje Vite leżą pod kluczem vite.'),
      code('sitelo.config.js'),
    ),
  ),
  accordionItem({ title: 'Wdrożenie' },
    stack({ gap: 'sm' },
      text({ variant: 'small', tone: 'muted' }, 'Opublikuj katalog wyjściowy na dowolnym hostingu statycznym.'),
      stack({ direction: 'row', gap: 'sm', wrap: true },
        chip({ size: 'sm' }, 'Netlify'),
        chip({ size: 'sm' }, 'Vercel'),
        chip({ size: 'sm' }, 'Cloudflare Pages'),
        chip({ size: 'sm' }, 'GitHub Pages'),
      ),
    ),
  ),
)`, { align: 'stretch' }),

      h2('FAQ'),
      p(
        'Kształt, dla którego ten komponent istnieje: treść, która już jest w HTML-u, zwinięta do przejrzenia i znajdowalna przez wyszukiwarkę, bo nigdy nie opuściła strony.',
      ),
      demo(`return (() => {
  const faq = [
    ['Czy naprawdę bez konfiguracji?', 'Projekt z jednym plikiem w src/ i bez konfiguracji się buduje. Cała reszta jest opcjonalna.'],
    ['Jak działają trasy dynamiczne?', 'Nawiasy w nazwach plików. generateStaticParams wylicza, co zbudować.'],
    ['A wyszukiwanie?', 'Ustaw pagefind: true, a build zindeksuje każdą stronę.'],
  ]

  return accordion({
    name: 'demo-faq',
    items: faq.map(([title, content]) => ({ title, content })),
  })
})()`, { align: 'stretch' }),

      h2('Propsy'),
      p(code('accordion()'), ':'),
      propsTable([
        ['items', 'Array', '[]', 'Ciągi znaków albo obiekty { title, content, open }.'],
        ['name', 'string', '', 'Wspólna nazwa czyni sekcje wzajemnie wyłącznymi.'],
      ]),
      p(code('accordionItem()'), ':'),
      propsTable([
        ['title', 'Child', '', 'Wiersz summary.'],
        ['open', 'boolean', 'false', 'Czy startuje rozwinięta.'],
        ['name', 'string', '', 'Ten sam efekt co na rodzicu, gdy budujesz elementy ręcznie.'],
      ]),
    ],
  })
