import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pl.js'

export default () =>
  uiLayout({
    title: 'Siatka',
    description:
      'Responsywna siatka mieszcząca tyle kolumn, ile się da — bez breakpointów i bez zapytań medialnych.',
    activeHref: '/pl/ui/grid',
    children: [
      p(
        'Bez ',
        code('columns'),
        ' siatka automatycznie mieści tyle ścieżek o szerokości co najmniej ',
        code('min'),
        ', ile pozwoli miejsce, a każda dzieli po równo to, co zostanie. Tego właśnie chce lista kart i nie potrzeba do tego breakpointów: zmień rozmiar tej strony, a dema poniżej same się przeorganizują.',
      ),

      h2('Automatyczne dopasowanie'),
      p('Domyślne. Ścieżki mają co najmniej 16rem szerokości.'),
      demo(`grid(
  ...['Routing', 'Wczytywanie danych', 'Zasoby', 'Obrazy', 'Wyspy', 'Wyszukiwanie'].map((name) =>
    card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, name))),
  ),
)`, { align: 'stretch' }),

      h2('Szerokość ścieżki'),
      p(
        code('min'),
        ' ustala, jak wąska może zrobić się ścieżka, zanim siatka zejdzie do mniejszej liczby kolumn. Mniej znaczy więcej kolumn.',
      ),
      demo(`grid({ min: '9rem' },
  ...['sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'].map((name) =>
    card({ variant: 'flat' }, cardBody(text({ variant: 'small', align: 'center' }, name))),
  ),
)`, { align: 'stretch' }),

      h2('Stała liczba kolumn'),
      p(
        'Podaj liczbę, gdy liczba kolumn nie ma zmieniać się z szerokością okna. Każda ścieżka dostaje równy udział.',
      ),
      demo(`grid({ columns: 3 },
  ...['Jeden', 'Dwa', 'Trzy'].map((name) =>
    card({ variant: 'flat' }, cardBody(text({ variant: 'small', align: 'center' }, name))),
  ),
)`, { align: 'stretch' }),

      h2('Własny szablon'),
      p(
        'Ciąg znaków jest przekazywany wprost jako ',
        code('grid-template-columns'),
        ', na podział „panel boczny i treść” albo cokolwiek innego, co potrafi wyrazić siatka CSS.',
      ),
      demo(`grid({ columns: '12rem 1fr', gap: 'lg' },
  card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Panel boczny'))),
  card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Treść, zabierająca resztę wiersza.'))),
)`, { align: 'stretch' }),

      h2('Odstęp i wyrównanie'),
      demo(`grid({ min: '10rem', gap: 'xl', align: 'center' },
  card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Krótka'))),
  card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Wyższa karta, z dwoma wierszami tekstu, żeby pokazać, co align robi jej niższym sąsiadkom.'))),
  card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Krótka'))),
)`, { align: 'stretch' }),

      h2('Propsy'),
      propsTable([
        ['columns', 'number | string', '', 'Stała liczba ścieżek albo surowa wartość grid-template-columns. Pomiń dla automatycznego dopasowania.'],
        ['min', 'string', "'16rem'", 'Minimalna szerokość ścieżki przy automatycznym dopasowaniu.'],
        ['gap', 'Space', "'md'", 'Odstęp między ścieżkami i wierszami.'],
        ['align', 'string', "'stretch'", 'Dowolna wartość align-items.'],
        ['as', 'string', "'div'", 'Element do wyrenderowania.'],
      ]),
      p(
        'Ścieżka nigdy nie staje się szersza niż sama siatka, nawet gdy ',
        code('min'),
        ' przekracza dostępne miejsce — więc minimum 16rem nie wywoła poziomego paska przewijania na telefonie o szerokości 320px.',
      ),
    ],
  })
