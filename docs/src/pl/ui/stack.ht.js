import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pl.js'

export default () =>
  uiLayout({
    title: 'Stos',
    description:
      'Rząd albo kolumna flex z tokenem odstępu na gap — prymityw układu, z którego zbudowana jest większość stron.',
    activeHref: '/pl/ui/stack',
    children: [
      p(
        'Stos wkłada odstęp między rzeczy. To kontener flex z jednym zadaniem i odpowiedź na większość pytań „jak je od siebie odsunąć” — domyślnie pionowo, poziomo przez ',
        code("direction: 'row'"),
        '.',
      ),
      p(
        'Odstępy pochodzą ze skali odstępów, więc rytm strony pozostaje spójny bez tego, żeby ktokolwiek dobierał wartości w pikselach.',
      ),

      h2('Podstawowy stos'),
      demo(`stack({ gap: 'md' },
  card(cardBody('Pierwsza')),
  card(cardBody('Druga')),
  card(cardBody('Trzecia')),
)`, { align: 'stretch' }),

      h2('Kierunek'),
      demo(`stack({ direction: 'row', gap: 'md' },
  button('Jeden'),
  button({ variant: 'outline' }, 'Dwa'),
  button({ variant: 'outline' }, 'Trzy'),
)`),

      h2('Odstęp'),
      p(
        'Nazwa tokenu (',
        code("'xs'"),
        ' … ',
        code("'3xl'"),
        '), liczba jednostek odstępu albo surowa długość CSS.',
      ),
      demo(`stack({ gap: 'lg' },
  stack({ direction: 'row', gap: 'xs' }, chip('xs'), chip('xs'), chip('xs')),
  stack({ direction: 'row', gap: 'md' }, chip('md'), chip('md'), chip('md')),
  stack({ direction: 'row', gap: 6 }, chip('6 jednostek'), chip('6 jednostek')),
  stack({ direction: 'row', gap: '3rem' }, chip('3rem'), chip('3rem')),
)`, { align: 'stretch' }),

      h2('Wyrównanie'),
      p(
        code('align'),
        ' i ',
        code('justify'),
        ' przyjmują surowe wartości flexboxa, więc działa wszystko, co rozumie CSS.',
      ),
      demo(`stack({ gap: 'md' },
  stack({ direction: 'row', gap: 'sm', justify: 'space-between', style: 'background: var(--su-surface-2); padding: 0.6rem; border-radius: 0.5rem' },
    chip('początek'),
    chip('koniec'),
  ),
  stack({ direction: 'row', gap: 'sm', justify: 'center', align: 'center', style: 'background: var(--su-surface-2); padding: 0.6rem; border-radius: 0.5rem' },
    button({ size: 'sm' }, 'Wyśrodkowane'),
    chip('i wyrównane'),
  ),
)`, { align: 'stretch' }),

      h2('Zawijanie'),
      p(
        'Rząd żetonów albo przycisków, który może się nie zmieścić, potrzebuje ',
        code('wrap'),
        ' — bez tego ściskają się, zamiast przejść do następnego wiersza.',
      ),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  ...['routing', 'data', 'islands', 'images', 'pagefind', 'lighthouse', 'sitemap', 'rss'].map(
    (name) => chip({ color: 'neutral' }, name),
  ),
)`, { align: 'stretch' }),

      h2('Liniowo'),
      p(
        code('inline'),
        ' zamienia stos w ',
        code('inline-flex'),
        ', więc siada w wierszu tekstu, zamiast zabierać całą szerokość.',
      ),
      demo(`text(
  'Zbudowane w ',
  stack({ direction: 'row', gap: 'xs', inline: true, align: 'center' },
    chip({ color: 'primary', size: 'sm' }, 'sitelo'),
    chip({ color: 'neutral', size: 'sm' }, 'vite'),
  ),
  ' i niczym więcej.',
)`, { align: 'stretch' }),

      h2('Jako inny element'),
      demo(`stack({ as: 'nav', direction: 'row', gap: 'sm' },
  navLink({ href: '/docs' }, 'Dokumentacja'),
  navLink({ href: '/ui', current: true }, 'UI'),
  navLink({ href: '/examples' }, 'Przykłady'),
)`),

      h2('Propsy'),
      propsTable([
        ['direction', "'row' | 'column'", "'column'", 'Oś główna.'],
        ['gap', 'Space', "'md'", 'Odstęp między dziećmi.'],
        ['align', 'string', "'stretch'", 'Dowolna wartość align-items.'],
        ['justify', 'string', "'flex-start'", 'Dowolna wartość justify-content.'],
        ['wrap', 'boolean | string', 'false', 'true oznacza zawijanie; ciąg znaków przechodzi jako flex-wrap.'],
        ['inline', 'boolean', 'false', 'Renderuje jako inline-flex.'],
        ['as', 'string', "'div'", 'Element do wyrenderowania, np. nav albo ul.'],
      ]),
    ],
  })
