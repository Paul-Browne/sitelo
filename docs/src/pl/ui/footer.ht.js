import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pl.js'

export default () =>
  uiLayout({
    title: 'Stopka',
    description: 'Dół witryny: kolumny odnośników i wiersz pod nimi.',
    activeHref: '/pl/ui/footer',
    children: [
      p(
        'Stopka to siatka kolumn dopasowujących się automatycznie plus opcjonalny wiersz na dole, który zawsze rozciąga się na pełną szerokość, niezależnie od liczby kolumn.',
      ),
      p(
        'Eksportowana jest i jako ',
        code('footer'),
        ', i jako ',
        code('siteFooter'),
        ', bo ',
        code('footer'),
        ' to także element ',
        code('<footer>'),
        ' z javascript-to-html, a zaimportowanie obu pod jedną nazwą to błąd składni.',
      ),

      h2('Podstawowa stopka'),
      demo(`footer(
  footerColumn({ title: 'Dokumentacja' },
    '<a href="/docs">Pierwsze kroki</a>',
    '<a href="/docs/routing">Routing</a>',
    '<a href="/docs/data">Wczytywanie danych</a>',
  ),
  footerColumn({ title: 'Komponenty' },
    '<a href="/ui">Przegląd</a>',
    '<a href="/ui/button">Przycisk</a>',
    '<a href="/ui/card">Karta</a>',
  ),
  footerColumn({ title: 'Projekt' },
    '<a href="https://github.com/paul-browne/sitelo">GitHub</a>',
    '<a href="https://www.npmjs.com/package/sitelo">npm</a>',
  ),
)`, { align: 'stretch' }),

      h2('Z wierszem na dole'),
      p(
        code('footerBottom()'),
        ' rozciąga się na wszystkie kolumny, więc zostaje wierszem pełnej szerokości niezależnie od tego, co robi siatka nad nim.',
      ),
      demo(`footer(
  footerColumn({ title: 'Dokumentacja' }, '<a href="/docs">Przewodnik</a>', '<a href="/ui">Komponenty</a>'),
  footerColumn({ title: 'Przykłady' }, '<a href="/examples">Wszystkie przykłady</a>'),
  footerBottom(
    text({ variant: 'caption' }, '© 2026 Paul Browne · MIT'),
    stack({ direction: 'row', gap: 'sm' },
      chip({ size: 'sm', color: 'neutral' }, 'v2.7'),
      chip({ size: 'sm', color: 'success', dot: true }, 'Build zaliczony'),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Kolumna z marką'),
      p(
        'Kolumna nie musi składać się z odnośników. Cokolwiek podasz jako dziecko ',
        code('footer()'),
        ', a nie kolumny, siada w siatce jako własna komórka.',
      ),
      demo(`footer(
  div(
    stack({ gap: 'sm' },
      text({ variant: 'h5', as: 'div' }, 'sitelo'),
      text({ variant: 'small', tone: 'muted' }, 'Generowanie stron statycznych bez konfiguracji, napędzane przez Vite.'),
    ),
  ),
  footerColumn({ title: 'Dokumentacja' }, '<a href="/docs">Przewodnik</a>', '<a href="/ui">Komponenty</a>'),
  footerColumn({ title: 'Projekt' }, '<a href="#">GitHub</a>', '<a href="#">npm</a>'),
)`, { align: 'stretch' }),

      h2('Stałe kolumny'),
      p(
        'Domyślnie kolumny dopasowują się same. ',
        code('columns'),
        ' przyjmuje dowolną wartość ',
        code('grid-template-columns'),
        ', gdy chcesz konkretnego kształtu — powiedzmy szerokiej kolumny z marką i dwóch wąskich z odnośnikami.',
      ),
      demo(`footer({ columns: '2fr 1fr 1fr' },
  div(text({ variant: 'small', tone: 'muted' }, 'Szersza pierwsza kolumna na markę i zdanie o niej.')),
  footerColumn({ title: 'Dokumentacja' }, '<a href="/docs">Przewodnik</a>'),
  footerColumn({ title: 'Więcej' }, '<a href="/examples">Przykłady</a>'),
)`, { align: 'stretch' }),

      h2('Sam wiersz na dole'),
      demo(`footer(
  footerBottom(text({ variant: 'caption' }, '© 2026 · Zbudowane w sitelo')),
)`, { align: 'stretch' }),

      h2('Propsy'),
      p(code('footer()'), ':'),
      propsTable([
        ['columns', 'string', '', 'Wartość grid-template-columns. Pominięta — dopasowuje się sama.'],
        ['as', 'string', "'footer'", 'Element do wyrenderowania.'],
      ]),
      propsTable([
        ['footerColumn', 'title', '', 'Kolumna z tytułem; dzieci stają się listą odnośników.'],
        ['footerBottom', '', '', 'Wiersz pełnej szerokości pod kolumnami.'],
      ], { headers: ['Część', 'Propsy', 'Domyślnie', 'Opis'] }),
    ],
  })
