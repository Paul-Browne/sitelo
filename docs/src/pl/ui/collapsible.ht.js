import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pl.js'

export default () =>
  uiLayout({
    title: 'Zwijany panel',
    description:
      'Jedno „pokaż więcej”, bez obramowań i grupowania akordeonu.',
    activeHref: '/pl/ui/collapsible',
    children: [
      p(
        'Zwijany panel to pojedynczy ',
        code('<details>'),
        ' — ten sam element, z którego zbudowany jest akordeon, tyle że bez jego oprawy. Użyj go dla jednego opcjonalnego szczegółu pośrodku strony; gdy jest ich zestaw, użyj ',
        code('accordion()'),
        '.',
      ),
      p(
        'Nie potrzebuje żadnego skryptu, a ponieważ treść zostaje w dokumencie, znajdzie ją zarówno wyszukiwanie w przeglądarce, jak i wyszukiwarka.',
      ),

      h2('Podstawowy panel'),
      demo(`collapsible({ trigger: 'Pokaż wygenerowaną konfigurację' },
  text({ variant: 'small' }, 'Wszystko, co sitelo zapisuje, gdy uruchomisz build bez własnego pliku konfiguracyjnego.'),
)`, { align: 'stretch' }),

      h2('Domyślnie otwarty'),
      demo(`collapsible({ trigger: 'Po co to jest', open: true },
  text({ variant: 'small' }, 'Bo strona, która chowa swoje wyjaśnienie za kliknięciem, to strona, której nikt nie czyta.'),
)`, { align: 'stretch' }),

      h2('Bogata treść'),
      demo(`collapsible({ trigger: 'Pokaż pełny wynik' },
  stack({ gap: 'sm' },
    code('dist/index.html'),
    code('dist/404.html'),
    code('dist/sitemap.xml'),
  ),
)`, { align: 'stretch' }),

      h2('Wewnątrz innych rzeczy'),
      p(
        'Zwijany panel chętnie siedzi w karcie, alercie albo komórce tabeli.',
      ),
      demo(`stack({ gap: 'md' },
  card(
    cardHeader({ title: 'Build nieudany', subtitle: '2 martwe odnośniki' }),
    cardBody(
      collapsible({ trigger: 'Pokaż niedziałające odnośniki' },
        list({ plain: true },
          listItem({ title: '/docs/old-routing', description: 'podlinkowane z /docs' }),
          listItem({ title: '/blog/draft', description: 'podlinkowane z /blog' }),
        ),
      ),
    ),
  ),
  alert({ color: 'warning', title: 'Wolna strona' },
    stack({ gap: 'sm' },
      text({ variant: 'small' }, 'Jedna strona renderowała się dłużej niż 500 ms.'),
      collapsible({ trigger: 'Pokaż czasy' },
        text({ variant: 'small' }, '/examples/wordpress — 512 ms'),
      ),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Wyzwalacz'),
      p(
        'Trzymaj w nim tekst i ikony. ',
        code('<summary>'),
        ' jest już interaktywne, więc przycisk albo odnośnik w środku zagnieżdża dwie kontrolki tam, gdzie jest jedna akcja — tej samej zasady trzyma się ',
        code('menu()'),
        '.',
      ),

      h2('Zwijany panel czy akordeon?'),
      p(
        'Jedno ujawnienie samo w sobie: ',
        code('collapsible()'),
        '. Zestaw takich, obramowany i zgrupowany, opcjonalnie z jednym otwartym naraz: ',
        code('accordion()'),
        '.',
      ),

      h2('Propsy'),
      propsTable([
        ['trigger', 'Child', '', 'Treść summary. Tylko tekst i ikony.'],
        ['open', 'boolean', 'false', 'Czy startuje rozwinięty.'],
      ]),
    ],
  })
