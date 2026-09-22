import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pl.js'

export default () =>
  uiLayout({
    title: 'Kontener',
    description:
      'Wyśrodkowana kolumna z ograniczoną szerokością — najbardziej zewnętrzna otoczka większości stron.',
    activeHref: '/pl/ui/container',
    children: [
      p(
        'Kontener centruje swoją zawartość, ogranicza szerokość, żeby wiersze tekstu pozostały czytelne, i trzyma margines, by nic nie dotykało krawędzi ekranu telefonu. Zwykle jest pierwszą rzeczą wewnątrz ',
        code('body()'),
        '.',
      ),

      h2('Podstawowy kontener'),
      demo(`container(
  text({ variant: 'lead' }, 'Wszystko w środku zostaje wyśrodkowane i przestaje rosnąć przy limicie rozmiaru.'),
)`, { align: 'stretch' }),

      h2('Rozmiary'),
      p(
        'Pięć stopni, od jednej czytelnej kolumny po brak jakiegokolwiek limitu. ',
        code('sm'),
        ' to około 40rem — mniej więcej szerokość, jakiej chce proza.',
      ),
      demo(`stack({ gap: 'sm' },
  container({ size: 'sm', style: 'background: var(--su-surface-2); padding-block: 0.75rem' },
    text({ variant: 'small', align: 'center' }, 'sm — 40rem'),
  ),
  container({ size: 'md', style: 'background: var(--su-surface-2); padding-block: 0.75rem' },
    text({ variant: 'small', align: 'center' }, 'md — 56rem'),
  ),
  container({ size: 'lg', style: 'background: var(--su-surface-2); padding-block: 0.75rem' },
    text({ variant: 'small', align: 'center' }, 'lg — 72rem (domyślnie)'),
  ),
)`, { align: 'stretch' }),

      h2('Własna szerokość'),
      p(
        code('width'),
        ' przyjmuje dowolną długość CSS i nadpisuje ',
        code('size'),
        ' — dla tej jednej strony, która potrzebuje czegoś spoza skali.',
      ),
      demo(`container({ width: '30rem', style: 'background: var(--su-surface-2); padding-block: 0.75rem' },
  text({ variant: 'small', align: 'center' }, 'width: 30rem'),
)`, { align: 'stretch' }),

      h2('Margines boczny'),
      p(
        'Margines boczny to odstęp trzymany między treścią a krawędzią widocznego obszaru. Przyjmuje token odstępu, liczbę jednostek odstępu albo surową długość.',
      ),
      demo(`container({ size: 'sm', gutter: 'xl', style: 'background: var(--su-surface-2); padding-block: 0.75rem' },
  text({ variant: 'small' }, 'Szerszy margines, dla strony, której treść nie powinna dobijać do krawędzi na tablecie.'),
)`, { align: 'stretch' }),

      h2('Jako inny element'),
      p(
        code('as'),
        ' zmienia znacznik, nie zmieniając niczego innego — przydatne, gdy kontener jest zarazem ',
        code('<main>'),
        ' strony albo ',
        code('<section>'),
        '.',
      ),
      demo(`container({ as: 'main', size: 'md' },
  heading({ level: 2, size: 'h4' }, 'Element main'),
  text({ tone: 'muted' }, 'Ten sam układ, właściwy punkt orientacyjny.'),
)`, { align: 'stretch' }),

      h2('Propsy'),
      propsTable([
        ['size', "'sm' | 'md' | 'lg' | 'xl' | 'full'", "'lg'", 'Który limit szerokości zastosować.'],
        ['width', 'string', '', 'Surowa max-width, nadpisuje size.'],
        ['gutter', 'Space', "'md'", 'Wewnętrzny odstęp trzymany przy krawędzi widocznego obszaru.'],
        ['as', 'string', "'div'", 'Element do wyrenderowania, np. main albo section.'],
      ]),
    ],
  })
