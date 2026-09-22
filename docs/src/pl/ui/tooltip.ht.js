import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pl.js'

export default () =>
  uiLayout({
    title: 'Podpowiedź',
    description:
      'Krótka wskazówka przy najechaniu i przy fokusie, narysowana w całości w CSS-ie.',
    activeHref: '/pl/ui/tooltip',
    children: [
      p(
        'Tekst podpowiedzi żyje w atrybucie data i jest rysowany przez pseudoelement, więc nie ma żadnego skryptu, niczego do pozycjonowania w czasie działania i niczego, co zostawałoby w DOM-ie. Pojawia się przy najechaniu i przy fokusie z klawiatury, czym zajmuje się połowa reguły z ',
        code(':focus-within'),
        '.',
      ),

      h2('Podstawowa podpowiedź'),
      demo(`stack({ direction: 'row', gap: 'md' },
  tooltip({ content: 'Kopiuj do schowka' },
    iconButton({
      label: 'Kopiuj',
      variant: 'soft',
      color: 'neutral',
      icon: icon('copy'),
    }),
  ),
  tooltip({ content: 'Przebuduj witrynę' },
    button({ variant: 'outline', color: 'neutral' }, 'Przebuduj'),
  ),
)`),

      h2('Umiejscowienie'),
      p('Domyślnie nad, a poniżej, gdy nad nią nie ma miejsca.'),
      demo(`stack({ direction: 'row', gap: 'lg' },
  tooltip({ content: 'Nad elementem' },
    button({ variant: 'soft', color: 'neutral' }, 'Góra'),
  ),
  tooltip({ content: 'Pod elementem', placement: 'bottom' },
    button({ variant: 'soft', color: 'neutral' }, 'Dół'),
  ),
)`),

      h2('Dostępne nazwy'),
      p(
        'Tekst podpowiedzi jest ozdobą — rysuje go właściwość CSS ',
        code('content'),
        ', której czytniki ekranu nie odczytują niezawodnie. Kontrolka w środku nadal potrzebuje własnej dostępnej nazwy, czyli tego, co daje ',
        code('label'),
        ' w ',
        code('iconButton()'),
        '. Gdy podpowiedź mówi coś, czego nazwa kontrolki nie mówi, podaj ',
        code('label: true'),
        ', by powtórzyć ją w ukrytym wizualnie elemencie.',
      ),
      demo(`stack({ direction: 'row', gap: 'lg' },
  tooltip({ content: 'Wdraża natychmiast na produkcję', label: true },
    button({ color: 'danger' }, 'Wdróż'),
  ),
)`),

      h2('Na tekście'),
      p(
        'Podpowiedź opakowuje treść liniową równie chętnie jak przycisk.',
      ),
      demo(`text(
  'Build zapisuje do ',
  tooltip({ content: 'Konfigurowalne przez outDir' }, code('dist/')),
  ' i nigdzie indziej.',
)`, { align: 'stretch' }),

      h2('Kiedy jej nie używać'),
      p(
        'Podpowiedzi nie pojawiają się przy dotyku i znikają w chwili, gdy wskaźnik odjedzie. Wszystko, co czytający musi mieć — komunikat błędu, wyjaśnienie pola wymaganego — należy do tekstu ',
        code('help'),
        ' przy samym polu, a nie do podpowiedzi.',
      ),

      h2('Propsy'),
      propsTable([
        ['content', 'string', '', 'Tekst wskazówki.'],
        ['placement', "'top' | 'bottom'", "'top'", 'Po której stronie elementu się pojawia.'],
        ['label', 'boolean', 'false', 'Udostępnij tekst także czytnikom ekranu, w ukrytym elemencie.'],
      ]),
    ],
  })
