import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pl.js'

export default () =>
  uiLayout({
    title: 'Szkielet',
    description: 'Zastępnik w kształcie treści, która jeszcze nie dotarła.',
    activeHref: '/pl/ui/skeleton',
    children: [
      p(
        'Szkielet stoi w miejscu treści, gdy ta się ładuje. Na witrynie statycznej przydaje się rzadziej niż w aplikacji — HTML już tam jest — ale zwykle właśnie tym powinien być ',
        code('fallback'),
        ' wyspy, i to pokazuje obszar renderowany po stronie klienta, zanim dojdą jego dane.',
      ),
      p(
        'Szkielety są ozdobne: każdy ma ',
        code('aria-hidden'),
        ', żeby czytnikowi ekranu nie czytano listy pustych prostokątów.',
      ),

      h2('Kształty'),
      demo(`stack({ gap: 'md' },
  skeleton({ height: '2.5rem' }),
  skeleton({ variant: 'text', width: '70%' }),
  skeleton({ variant: 'circle', width: '3rem', height: '3rem' }),
)`, { align: 'stretch' }),

      h2('Tekst'),
      p(
        code('lines'),
        ' renderuje tyle, ile zająłby akapit, z ostatnim wierszem krótkim, żeby czytało się to jak proza, a nie jak blok.',
      ),
      demo(`stack({ gap: 'lg' },
  skeleton({ lines: 2 }),
  skeleton({ lines: 4 }),
)`, { align: 'stretch' }),

      h2('W kształcie prawdziwej rzeczy'),
      p(
        'Szkielet przekonuje najbardziej, gdy pasuje do układu, który zastępuje — ta sama karta, te same wiersze, te same rozmiary.',
      ),
      demo(`grid({ min: '14rem' },
  card(
    cardBody(
      stack({ gap: 'md' },
        stack({ direction: 'row', gap: 'sm', align: 'center' },
          skeleton({ variant: 'circle', width: '2.5rem', height: '2.5rem' }),
          stack({ gap: 'xs', style: 'flex: 1' },
            skeleton({ variant: 'text', width: '60%' }),
            skeleton({ variant: 'text', width: '40%' }),
          ),
        ),
        skeleton({ lines: 3 }),
      ),
    ),
  ),
  card(
    cardBody(
      stack({ direction: 'row', gap: 'sm', align: 'center' },
        avatar({ name: 'Ada Lovelace' }),
        stack({ gap: 'none' },
          text({ variant: 'small' }, 'Ada Lovelace'),
          text({ variant: 'caption', tone: 'muted' }, 'Wypchnęła 3 commity'),
        ),
      ),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Jako treść zastępcza wyspy'),
      p(
        'Wyspa serwerowa publikuje swoją treść zastępczą w statycznym HTML-u i podmienia ją na wyrenderowany fragment w chwili żądania. Szkielet w tym samym kształcie co fragment nie pozwala stronie podskoczyć, gdy fragment dotrze.',
      ),
      demo(`card(
  cardHeader({ title: 'Komentarze' }),
  cardBody(
    stack({ gap: 'md' },
      skeleton({ lines: 2 }),
      divider({ spacing: 'xs' }),
      skeleton({ lines: 2 }),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Ruch'),
      p(
        'Połysk zatrzymuje się dla każdego, kto poprosił system o ograniczenie ruchu — załatwia to arkusz stylów, bez żadnego propsa do ustawienia.',
      ),

      h2('Propsy'),
      propsTable([
        ['variant', "'rect' | 'text' | 'circle'", "'rect'", 'Kształt zastępnika.'],
        ['width', 'string', '', 'Dowolna szerokość CSS.'],
        ['height', 'string', '', 'Dowolna wysokość CSS.'],
        ['lines', 'number', '', 'Wyrenderuj tyle wierszy tekstu, ostatni krótki.'],
      ]),
    ],
  })
