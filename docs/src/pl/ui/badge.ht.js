import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/pl.js'

export default () =>
  uiLayout({
    title: 'Odznaka',
    description: 'Licznik albo kropka przypięta do rogu tego, co opakowuje.',
    activeHref: '/pl/ui/badge',
    children: [
      p(
        'Odznaka opakowuje coś i przypina znacznik do górnego rogu: nieprzeczytane wiadomości na przycisku skrzynki, kropkę „online” na awatarze. Jako dzieci przyjmuje to, co oznacza.',
      ),

      h2('Podstawowa odznaka'),
      demo(`stack({ direction: 'row', gap: 'xl', align: 'center' },
  badge({ content: 4 }, button({ variant: 'soft', color: 'neutral' }, 'Skrzynka')),
  badge({ content: 12 }, avatar({ name: 'Ada Lovelace' })),
)`),

      h2('Kolory'),
      demo(`stack({ direction: 'row', gap: 'xl', align: 'center', wrap: true },
  badge({ content: 3, color: 'primary' }, button({ variant: 'soft', color: 'neutral' }, 'Primary')),
  badge({ content: 3, color: 'neutral' }, button({ variant: 'soft', color: 'neutral' }, 'Neutral')),
  badge({ content: 3, color: 'success' }, button({ variant: 'soft', color: 'neutral' }, 'Success')),
  badge({ content: 3, color: 'warning' }, button({ variant: 'soft', color: 'neutral' }, 'Warning')),
  badge({ content: 3, color: 'danger' }, button({ variant: 'soft', color: 'neutral' }, 'Danger')),
)`),

      h2('Maksimum'),
      p(
        'Licznik powyżej ',
        code('max'),
        ' renderuje się jako ',
        code('n+'),
        ', więc odznaka nigdy nie urośnie na tyle, żeby rozchwiać rzecz, na której siedzi.',
      ),
      demo(`stack({ direction: 'row', gap: 'xl', align: 'center', wrap: true },
  badge({ content: 9 }, button({ variant: 'soft', color: 'neutral' }, 'Dziewięć')),
  badge({ content: 250 }, button({ variant: 'soft', color: 'neutral' }, 'Ucięte na 99')),
  badge({ content: 250, max: 999 }, button({ variant: 'soft', color: 'neutral' }, 'max: 999')),
)`),

      h2('Kropka'),
      p(
        'Kropka mówi „coś się zmieniło”, nie mówiąc ile. Daj jej ',
        code('label'),
        ' — goła kropka nic nie znaczy dla czytnika ekranu, więc bez etykiety jest całkiem ukrywana przed drzewem dostępności.',
      ),
      demo(`stack({ direction: 'row', gap: 'xl', align: 'center' },
  badge({ dot: true, color: 'success', label: 'Online' }, avatar({ name: 'Ada Lovelace' })),
  badge({ dot: true, color: 'warning', label: 'Wymaga uwagi' },
    iconButton({
      label: 'Ustawienia',
      variant: 'soft',
      color: 'neutral',
      icon: icon('settings'),
    }),
  ),
)`),

      h2('Nazwanie licznika'),
      p(
        'Goła liczba jest poza kontekstem niejednoznaczna. ',
        code('label'),
        ' staje się dostępną nazwą odznaki, więc czyta się ją jako „4 nieprzeczytane wiadomości”, a nie „4”.',
      ),
      demo(`badge({ content: 4, label: '4 nieprzeczytane wiadomości' },
  button({ variant: 'soft', color: 'neutral' }, 'Skrzynka'),
)`),

      h2('Zmiana licznika'),
      p(
        'Licznik to liczba na stronie, która najpewniej zmieni się, gdy strona jest otwarta. ',
        code('setBadge()'),
        ' ogranicza ją do ',
        code('max'),
        ' tak samo jak robił to serwer, niesie ze sobą odczytywany tekst i wypuszcza opróżnioną odznakę z drzewa dostępności — tak właśnie odznaka znika.',
      ),
      p(
        'Odczytywany tekst to treść Twojej witryny, więc podawaj go zawsze, gdy odznaka go ma:',
      ),
      codeBlock('Gdziekolwiek', `button({ onclick: "import('/su/badge.js').then(m=>m.set('inbox',0))" }, 'Oznacz wszystko jako przeczytane')`, 'javascript'),
      p('Albo z własnego modułu, gdy już jakiś działa:'),
      codeBlock('src/main.js', `import { setBadge } from 'sitelo/ui/client'

setBadge('inbox', 7, { label: '7 nieprzeczytanych wiadomości' })`, 'javascript'),

      h2('Propsy'),
      propsTable([
        ['content', 'string | number', '', 'Co pokazuje odznaka. Ignorowane, gdy ustawiono dot.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'danger'", 'Kolor odznaki.'],
        ['dot', 'boolean', 'false', 'Mała kropka zamiast wartości.'],
        ['max', 'number', '99', 'Liczniki powyżej tej wartości renderują się jako n+.'],
        ['label', 'string', '', 'Dostępna nazwa samej odznaki.'],
      ]),
    ],
  })
