import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pl.js'

export default () =>
  uiLayout({
    title: 'Okno modalne',
    description:
      'Prawdziwy <dialog> otwierany modalnie — przeglądarka obsługuje tło, fokus, Escape i kliknięcie poza.',
    activeHref: '/pl/ui/modal',
    children: [
      p(
        'Okno modalne to element ',
        code('<dialog>'),
        '. Dowolny przycisk z ',
        code('commandfor'),
        ' wskazującym ',
        code('id'),
        ' okna i ',
        code("command: 'show-modal'"),
        ' otwiera je modalnie: strona pod spodem staje się bezwładna (inert), więc fokus i czytnik ekranu zostają w oknie. Nigdzie nie ma skryptu — tłem, Escape i kliknięciem poza zajmuje się przeglądarka.',
      ),
      p(
        'Dlatego ',
        code('id'),
        ' jest wymagane i dlatego komponent bez niego zgłasza błąd: identyfikator to całe okablowanie.',
      ),

      h2('Podstawowe okno'),
      p('Każde okno na tej stronie naprawdę się otwiera — spróbuj.'),
      demo(`fragment(
  button({ commandfor: 'demo-basic', command: 'show-modal' }, 'Otwórz okno'),
  modal({ id: 'demo-basic', title: 'Przebudować witrynę?' },
    'To uruchamia sitelo build i publikuje dist/ od nowa.',
  ),
)`),

      h2('Ze stopką'),
      p(
        'Przycisk zamykający to dowolny przycisk wskazujący na to samo id z ',
        code("command: 'close'"),
        '.',
      ),
      demo(`fragment(
  button({ color: 'danger', commandfor: 'demo-confirm', command: 'show-modal' }, 'Usuń stronę…'),
  modal({
    id: 'demo-confirm',
    title: 'Usunąć tę stronę?',
    footer: stack({ direction: 'row', gap: 'sm' },
      button({
        variant: 'ghost',
        color: 'neutral',
        commandfor: 'demo-confirm',
        command: 'close',
      }, 'Anuluj'),
      button({ color: 'danger' }, 'Usuń'),
    ),
  }, 'Tego nie da się cofnąć. Wygenerowany HTML zniknie przy następnym buildzie.'),
)`),

      h2('Rozmiary'),
      demo(`fragment(
  stack({ direction: 'row', gap: 'sm', wrap: true },
    button({ variant: 'outline', color: 'neutral', commandfor: 'demo-sm', command: 'show-modal' }, 'Małe'),
    button({ variant: 'outline', color: 'neutral', commandfor: 'demo-md', command: 'show-modal' }, 'Średnie'),
    button({ variant: 'outline', color: 'neutral', commandfor: 'demo-lg', command: 'show-modal' }, 'Duże'),
  ),
  modal({ id: 'demo-sm', size: 'sm', title: 'Małe' }, 'size: sm — około 24rem.'),
  modal({ id: 'demo-md', title: 'Średnie' }, 'Domyślne — około 32rem.'),
  modal({ id: 'demo-lg', size: 'lg', title: 'Duże' }, 'size: lg — około 48rem.'),
)`),

      h2('Formularze w oknie'),
      demo(`fragment(
  button({ variant: 'soft', commandfor: 'demo-form', command: 'show-modal' }, 'Nowa strona…'),
  modal({
    id: 'demo-form',
    title: 'Nowa strona',
    footer: stack({ direction: 'row', gap: 'sm' },
      button({ variant: 'ghost', color: 'neutral', commandfor: 'demo-form', command: 'close' }, 'Anuluj'),
      button({ type: 'submit' }, 'Utwórz'),
    ),
  },
    stack({ gap: 'md' },
      textField({ label: 'Tytuł', name: 'modal-title', placeholder: 'O projekcie' }),
      selectField({ label: 'Rozszerzenie', name: 'modal-ext', options: ['.ht.js', '.ht.ts', '.ht.jsx'] }),
    ),
  ),
)`),

      h2('Bez przycisku zamykania'),
      p(
        code('closable: false'),
        ' usuwa × z rogu. Escape i kliknięcie poza nadal je zamykają; z ',
        code("closedby: 'closerequest'"),
        ' zamyka je już tylko Escape.',
      ),
      demo(`fragment(
  button({ variant: 'outline', color: 'neutral', commandfor: 'demo-bare', command: 'show-modal' }, 'Bez przycisku zamykania'),
  modal({ id: 'demo-bare', title: 'Naciśnij Escape', closable: false },
    'Albo kliknij gdziekolwiek poza tym oknem.',
  ),
)`),

      h2('Długa treść'),
      p('Treść się przewija; nagłówek i stopka zostają na miejscu.'),
      demo(`fragment(
  button({ variant: 'outline', color: 'neutral', commandfor: 'demo-long', command: 'show-modal' }, 'Długie okno'),
  modal({
    id: 'demo-long',
    title: 'Informacje o wydaniu',
    footer: button({ commandfor: 'demo-long', command: 'close' }, 'Zamknij'),
  },
    stack({ gap: 'md' },
      ...Array.from({ length: 12 }, (unused, index) =>
        text({ variant: 'small', tone: 'muted' }, 'Zmiana ' + (index + 1) + ' — coś naprawiono.'),
      ),
    ),
  ),
)`),

      h2('Przewijanie tła'),
      p(
        'Strona za otwartym oknem się nie przewija. To jedyna rzecz, którą modalne okno dialogowe zostawia Tobie, a tutaj zrobiona jest w CSS-ie — bez skryptu i bez niczego do zainicjowania. Podaj ',
        code('lockScroll: false'),
        ', żeby tło przewijało się jak zwykle.',
      ),

      h2('Wsparcie przeglądarek'),
      p(
        'Otwieranie okna dialogowego przez command przycisku działa w każdej aktualnej przeglądarce — Chrome 135, Firefox 144 i Safari 26.2 lub nowszych. W starszej button() dodaje onclick, który pobiera kilkaset bajtów /su/dialog.js i robi to samo — tylko tam i dopiero przy pierwszym kliknięciu. Safari nie zamyka jeszcze okna kliknięciem poza (closedby); tam również zajmuje się tym ten sam plik.',
      ),

      h2('Propsy'),
      propsTable([
        ['id', 'string', '', 'Wymagane. To, na co wskazuje commandfor wyzwalacza.'],
        ['title', 'Child', '', 'Nagłówek i dostępna nazwa okna dialogowego.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Maksymalna szerokość.'],
        ['footer', 'Child', '', 'Dolny rząd, na własnym zabarwionym pasie.'],
        ['closable', 'boolean', 'true', 'Pokaż × w nagłówku.'],
        ['closeLabel', 'string', "'Close'", 'Dostępna nazwa tego przycisku.'],
        ['lockScroll', 'boolean', 'true', 'Blokuje przewijanie strony za nim, gdy jest otwarte.'],
      ]),
      p(
        code('closeButton({ target })'),
        ' renderuje samo × — dla nagłówka, który budujesz ręcznie.',
      ),
    ],
  })
