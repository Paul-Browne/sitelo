import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pl.js'

export default () =>
  uiLayout({
    title: 'Okno modalne',
    description:
      'Okno dialogowe na API popover — przeglądarka obsługuje otwieranie, tło, kliknięcie poza i Escape.',
    activeHref: '/pl/ui/modal',
    children: [
      p(
        'Okno modalne to element ',
        code('popover'),
        '. Dowolny przycisk, którego ',
        code('popovertarget'),
        ' pasuje do ',
        code('id'),
        ' okna, je otwiera — nigdzie nie ma skryptu, łącznie z tłem, zamykaniem kliknięciem obok, Escape i obsługą fokusu, którymi zajmuje się przeglądarka.',
      ),
      p(
        'Dlatego ',
        code('id'),
        ' jest wymagane i dlatego komponent bez niego zgłasza błąd: identyfikator to całe okablowanie.',
      ),

      h2('Podstawowe okno'),
      p('Każde okno na tej stronie naprawdę się otwiera — spróbuj.'),
      demo(`fragment(
  button({ popovertarget: 'demo-basic' }, 'Otwórz okno'),
  modal({ id: 'demo-basic', title: 'Przebudować witrynę?' },
    'To uruchamia sitelo build i publikuje dist/ od nowa.',
  ),
)`),

      h2('Ze stopką'),
      p(
        'Przycisk zamykający to dowolny przycisk wskazujący na to samo id z ',
        code('popovertargetaction="hide"'),
        '.',
      ),
      demo(`fragment(
  button({ color: 'danger', popovertarget: 'demo-confirm' }, 'Usuń stronę…'),
  modal({
    id: 'demo-confirm',
    title: 'Usunąć tę stronę?',
    footer: stack({ direction: 'row', gap: 'sm' },
      button({
        variant: 'ghost',
        color: 'neutral',
        popovertarget: 'demo-confirm',
        popovertargetaction: 'hide',
      }, 'Anuluj'),
      button({ color: 'danger' }, 'Usuń'),
    ),
  }, 'Tego nie da się cofnąć. Wygenerowany HTML zniknie przy następnym buildzie.'),
)`),

      h2('Rozmiary'),
      demo(`fragment(
  stack({ direction: 'row', gap: 'sm', wrap: true },
    button({ variant: 'outline', color: 'neutral', popovertarget: 'demo-sm' }, 'Małe'),
    button({ variant: 'outline', color: 'neutral', popovertarget: 'demo-md' }, 'Średnie'),
    button({ variant: 'outline', color: 'neutral', popovertarget: 'demo-lg' }, 'Duże'),
  ),
  modal({ id: 'demo-sm', size: 'sm', title: 'Małe' }, 'size: sm — około 24rem.'),
  modal({ id: 'demo-md', title: 'Średnie' }, 'Domyślne — około 32rem.'),
  modal({ id: 'demo-lg', size: 'lg', title: 'Duże' }, 'size: lg — około 48rem.'),
)`),

      h2('Formularze w oknie'),
      demo(`fragment(
  button({ variant: 'soft', popovertarget: 'demo-form' }, 'Nowa strona…'),
  modal({
    id: 'demo-form',
    title: 'Nowa strona',
    footer: stack({ direction: 'row', gap: 'sm' },
      button({ variant: 'ghost', color: 'neutral', popovertarget: 'demo-form', popovertargetaction: 'hide' }, 'Anuluj'),
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
        ' usuwa × z rogu. Escape i kliknięcie poza nadal je zamykają — popovera nie da się uczynić naprawdę blokującym, a i tak zwykle jest to właściwe zachowanie.',
      ),
      demo(`fragment(
  button({ variant: 'outline', color: 'neutral', popovertarget: 'demo-bare' }, 'Bez przycisku zamykania'),
  modal({ id: 'demo-bare', title: 'Naciśnij Escape', closable: false },
    'Albo kliknij gdziekolwiek poza tym oknem.',
  ),
)`),

      h2('Długa treść'),
      p('Treść się przewija; nagłówek i stopka zostają na miejscu.'),
      demo(`fragment(
  button({ variant: 'outline', color: 'neutral', popovertarget: 'demo-long' }, 'Długie okno'),
  modal({
    id: 'demo-long',
    title: 'Informacje o wydaniu',
    footer: button({ popovertarget: 'demo-long', popovertargetaction: 'hide' }, 'Zamknij'),
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
        'Strona za otwartym oknem się nie przewija. To jedyna rzecz, którą API popover zostawia Tobie, a tutaj zrobiona jest w CSS-ie — bez skryptu i bez niczego do zainicjowania. Podaj ',
        code('lockScroll: false'),
        ', żeby tło przewijało się jak zwykle.',
      ),

      h2('Wsparcie przeglądarek'),
      p(
        'API popover jest dostępne w każdej aktualnej przeglądarce. W takiej, która jest zbyt stara, żeby je znać, okno renderuje się w treści strony, a nie nad nią — widoczne i użyteczne, tylko nie nałożone. Nic nie znika.',
      ),

      h2('Propsy'),
      propsTable([
        ['id', 'string', '', 'Wymagane. To, na co wskazuje popovertarget wyzwalacza.'],
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
