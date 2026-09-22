import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/pl.js'

export default () =>
  uiLayout({
    title: 'Alert',
    description:
      'Komunikat o stanie czegoś, z ikoną i rolą ARIA, które idą za kolorem.',
    activeHref: '/pl/ui/alert',
    children: [
      p(
        'Alert mówi czytającemu coś o stronie albo o akcji, którą wykonał. Kolor dobiera razem ikonę i rolę ARIA: ',
        code('danger'),
        ' i ',
        code('warning'),
        ' zapowiadają się jako ',
        code('role="alert"'),
        ', a wszystko cichsze jako uprzejme ',
        code('role="status"'),
        '.',
      ),

      h2('Kolory'),
      demo(`stack({ gap: 'sm' },
  alert({ color: 'primary', title: 'Uwaga' }, 'Dostępna jest nowa wersja sitelo.'),
  alert({ color: 'success', title: 'Wdrożone' }, 'Opublikowano 169 stron w 1,7 sekundy.'),
  alert({ color: 'warning', title: 'Wolna strona' }, 'Jedna strona renderowała się dłużej niż 500 ms.'),
  alert({ color: 'danger', title: 'Build nieudany' }, 'Dwa wewnętrzne odnośniki prowadzą do stron, które nie istnieją.'),
  alert({ color: 'neutral', title: 'Uwaga' }, 'W tym projekcie wyspy są wyłączone.'),
)`, { align: 'stretch' }),

      h2('Bez tytułu'),
      p('Jednowierszowy alert nie potrzebuje nagłówka nad zdaniem.'),
      demo(`stack({ gap: 'sm' },
  alert({ color: 'success' }, 'Zapisano.'),
  alert({ color: 'danger' }, 'Ten adres e-mail jest już zajęty.'),
)`, { align: 'stretch' }),

      h2('Warianty'),
      demo(`stack({ gap: 'sm' },
  alert({ color: 'warning', variant: 'soft', title: 'Soft' }, 'Domyślny — zabarwiona powierzchnia.'),
  alert({ color: 'warning', variant: 'outline', title: 'Outline' }, 'Przezroczysty, z kolorowym obramowaniem.'),
  alert({ color: 'warning', variant: 'solid', title: 'Solid' }, 'Pełny kolor palety, na coś, czego nie wolno przeoczyć.'),
)`, { align: 'stretch' }),

      h2('Ikony'),
      p(
        'Każdy kolor ma domyślną ikonę. Podaj własne znaczniki jako ',
        code('icon'),
        ' albo ',
        code('icon: false'),
        ', żeby nie było żadnej.',
      ),
      demo(`stack({ gap: 'sm' },
  alert({ color: 'primary', icon: false, title: 'Bez ikony' }, 'Sam tekst.'),
  alert({
    color: 'primary',
    title: 'Własna ikona',
    icon: icon('star'),
  }, 'Zadziała dowolny SVG — ikony to znaczniki, a nie zależność.'),
)`, { align: 'stretch' }),

      h2('Do zamknięcia'),
      p('Przycisk zamykający niesie własny handler:'),
      codeBlock(
        'Wyrenderowane znaczniki',
        `onclick="import('/su/alert.js').then(m=>m.dismiss(this))"`,
        'html',
      ),
      p(
        'Więc alert poniżej naprawdę się zamyka, choć na tej stronie nic nie zostało zaimportowane. Jeśli ten moduł nigdy nie dotrze, przycisk się wyrenderuje i nic nie zrobi — i właśnie dlatego alert nigdy nie powinien być jedynym miejscem, w którym pojawia się komunikat.',
      ),
      demo(`alert({ color: 'primary', title: 'Do zamknięcia', dismissible: true },
  'Kliknij × — handler sam się pobiera przy pierwszym naciśnięciu.',
)`, { align: 'stretch' }),

      h2('Bogata treść'),
      p('Alerty przyjmują dowolne dzieci, więc akcja albo lista może siedzieć w środku.'),
      demo(`alert({ color: 'danger', title: 'Sprawdzanie odnośników nieudane' },
  stack({ gap: 'sm' },
    text({ variant: 'small' }, 'Dwa odnośniki prowadzą do stron, które nie powstały:'),
    list({ plain: true },
      listItem({ title: '/docs/old-routing', description: 'podlinkowane z /docs' }),
      listItem({ title: '/blog/draft', description: 'podlinkowane z /blog' }),
    ),
    stack({ direction: 'row', gap: 'sm' },
      button({ size: 'sm', color: 'danger' }, 'Pokaż szczegóły'),
      button({ size: 'sm', variant: 'ghost', color: 'danger' }, 'Zignoruj'),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Propsy'),
      propsTable([
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Dobiera paletę, domyślną ikonę i rolę ARIA.'],
        ['variant', "'soft' | 'outline' | 'solid'", "'soft'", 'Ile wagi niesie alert.'],
        ['title', 'Child', '', 'Pogrubiony pierwszy wiersz.'],
        ['icon', 'Child | false', '', 'Znaczniki własnej ikony albo false, by jej nie było.'],
        ['dismissible', 'boolean', 'false', 'Dodaje przycisk zamykający, który sam importuje swój handler.'],
        ['dismissLabel', 'string', "'Dismiss'", 'Dostępna nazwa tego przycisku.'],
      ]),
    ],
  })
