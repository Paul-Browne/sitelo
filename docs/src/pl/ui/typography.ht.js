import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pl.js'

export default () =>
  uiLayout({
    title: 'Typografia',
    description:
      'Skala typograficzna, która sama dobiera element, więc struktura dokumentu idzie za wizualną.',
    activeHref: '/pl/ui/typography',
    children: [
      p(
        code('text()'),
        ' renderuje kawałek tekstu w jednym z rozmiarów biblioteki. Wariant dobiera sensowny element — ',
        code("variant: 'h2'"),
        ' renderuje prawdziwe ',
        code('<h2>'),
        ' — więc nagłówki trafiają do struktury dokumentu bez tego, żeby ktokolwiek o tym myślał.',
      ),

      h2('Warianty'),
      demo(`stack({ gap: 'sm' },
  text({ variant: 'h1' }, 'Nagłówek 1'),
  text({ variant: 'h2' }, 'Nagłówek 2'),
  text({ variant: 'h3' }, 'Nagłówek 3'),
  text({ variant: 'h4' }, 'Nagłówek 4'),
  text({ variant: 'h5' }, 'Nagłówek 5'),
  text({ variant: 'h6' }, 'Nagłówek 6'),
  text({ variant: 'lead' }, 'Lead — o stopień wyżej niż tekst główny, na zdanie pod tytułem.'),
  text({ variant: 'body' }, 'Body — domyślny.'),
  text({ variant: 'small' }, 'Small — podpisy, które wciąż są zdaniami.'),
  text({ variant: 'caption' }, 'Caption — drobny druk.'),
  text({ variant: 'overline' }, 'Overline'),
)`, { align: 'stretch' }),

      h2('Nagłówki'),
      p(
        code('heading()'),
        ' przyjmuje ',
        code('level'),
        ' ze struktury i dobiera do niego rozmiar. ',
        code('size'),
        ' rozdziela te dwie rzeczy: ',
        code('<h1>'),
        ' wyglądające jak h3 wciąż jest dla czytnika ekranu h1.',
      ),
      demo(`stack({ gap: 'sm' },
  heading({ level: 2 }, 'Nagłówek poziomu 2, w dopasowanym rozmiarze'),
  heading({ level: 2, size: 'h5' }, 'Nagłówek poziomu 2 w rozmiarze h5'),
)`, { align: 'stretch' }),

      h2('Ton'),
      p(
        'Trzy stopnie wyrazistości, od pełnego kontrastu po najcichszy czytelny szary.',
      ),
      demo(`stack({ gap: 'xs' },
  text('Domyślny — kolor, w którym składany jest tekst główny.'),
  text({ tone: 'muted' }, 'Przygaszony — tekst drugorzędny, wciąż wygodnie czytelny.'),
  text({ tone: 'subtle' }, 'Dyskretny — etykiety i metadane.'),
)`, { align: 'stretch' }),

      h2('Wyrównanie'),
      demo(`stack({ gap: 'xs' },
  text({ align: 'start' }, 'Do początku'),
  text({ align: 'center' }, 'Do środka'),
  text({ align: 'end' }, 'Do końca'),
)`, { align: 'stretch' }),

      h2('Ucinanie i ograniczanie'),
      p(
        code('truncate'),
        ' ucina pojedynczy wiersz wielokropkiem. ',
        code('lines'),
        ' ogranicza zamiast tego do liczby wierszy, czego zwykle chce streszczenie w karcie.',
      ),
      demo(`stack({ gap: 'md' },
  card({ variant: 'flat' }, cardBody(
    text({ truncate: true }, 'Pojedynczy wiersz, który ciągnie się daleko poza szerokość swojego kontenera i zostaje ucięty wielokropkiem, zamiast się zawinąć.'),
  )),
  card({ variant: 'flat' }, cardBody(
    text({ lines: 2, tone: 'muted' }, 'Ograniczone do dwóch wierszy. Ten akapit ciągnie się przez chwilę, żeby ograniczenie miało co uciąć, a potem leci jeszcze kawałek dalej, poza punkt, w którym zaczynałby się trzeci wiersz.'),
  )),
)`, { align: 'stretch' }),

      h2('Kod liniowy i klawisze'),
      demo(`text(
  'Uruchom ', code('sitelo build'), ' albo naciśnij ', kbd('⌘'), ' ', kbd('K'), ', żeby wyszukać.',
)`, { align: 'stretch' }),
      p(
        'Dzieci renderują się jako HTML — to właśnie sprawia, że zagnieżdżanie działa wszędzie w tej bibliotece, a ',
        code('code()'),
        ' nie jest wyjątkiem. Próbka zawierająca znaczniki potrzebuje więc propsa ',
        code('text'),
        ', który je ucieka:',
      ),
      demo(`stack({ gap: 'sm' },
  text(code({ text: '<em>Cześć</em>' }), ' — text: pokazane tak, jak napisane'),
  text(code('<em>Cześć</em>'), ' — dzieci: interpretowane jako znaczniki'),
)`, { align: 'stretch' }),
      p(
        'Oba się przydają. ',
        code('text'),
        ' jest do próbki kodu, gdzie znacznik ma być przeczytany, a nie zbudowany. Dzieci są do wyniku już podświetlonego składniowo, gdzie znaczniki ',
        code('są'),
        ' sednem — rezultat z Prisma albo Shiki wchodzi wprost.',
      ),
      demo(`stack({ gap: 'sm' },
  text(code({ text: 'sitelo build --root docs' })),
  text(code('<span style="color: var(--su-primary-soft-fg)">sitelo</span> build')),
)`, { align: 'stretch' }),

      h2('Składanie'),
      p(
        'Text przyjmuje dzieci, a nie tylko ciąg znaków — więc odnośniki, kod i wyróżnienia zagnieżdżają się w nim tak samo jak w HTML-u.',
      ),
      demo(`text({ variant: 'lead' },
  'Strony to funkcje zwracające ',
  code('HTML'),
  '. Zobacz przewodnik ',
  link({ href: '/docs/pages' }, 'pisanie stron'),
  '.',
)`, { align: 'stretch' }),

      h2('Zmiana elementu'),
      p(
        code('as'),
        ' nadpisuje element bez zmiany wyglądu — dla wizualnego nagłówka, który nie ma pojawić się w strukturze, albo dla ',
        code('<span>'),
        ' wewnątrz wiersza tekstu.',
      ),
      demo(`stack({ gap: 'xs' },
  text({ variant: 'h4', as: 'div' }, 'Wygląda jak nagłówek, jest divem'),
  text({ variant: 'caption', as: 'p' }, 'Styl caption na akapicie'),
)`, { align: 'stretch' }),

      h2('Ukryte wizualnie'),
      p(
        code('visuallyHidden()'),
        ' trzyma treść w drzewie dostępności, ale poza ekranem — etykieta, której potrzebuje czytnik ekranu tam, gdzie widzący wynoszą ją z kontekstu.',
      ),
      demo(`text(
  'Status buildu: ',
  chip({ color: 'success', dot: true }, 'zaliczony'),
  visuallyHidden(' — ostatni build powiódł się 4 minuty temu'),
)`, { align: 'stretch' }),

      h2('Propsy'),
      propsTable([
        ['variant', "'h1'…'h6' | 'lead' | 'body' | 'small' | 'caption' | 'overline'", "'body'", 'Rozmiar, grubość i domyślny element.'],
        ['tone', "'default' | 'muted' | 'subtle'", "'default'", 'Ile kontrastu niesie tekst.'],
        ['align', "'start' | 'center' | 'end'", "'start'", 'Wyrównanie tekstu.'],
        ['truncate', 'boolean', 'false', 'Jeden wiersz, ucięty wielokropkiem.'],
        ['lines', 'number', '', 'Ogranicz do tylu wierszy.'],
        ['as', 'string', '', 'Nadpisz element, który wybrałby wariant.'],
      ]),
      p(
        code('heading()'),
        ' przyjmuje ',
        code('level'),
        ' (1–6) i opcjonalny ',
        code('size'),
        '; reszta jest taka sama.',
      ),
    ],
  })
