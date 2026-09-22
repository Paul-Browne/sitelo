import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pl.js'

export default () =>
  uiLayout({
    title: 'Awatar',
    description:
      'Osoba albo rzecz w kółku — obraz, gdy jest, inicjały, gdy go nie ma.',
    activeHref: '/pl/ui/avatar',
    children: [
      p(
        'Daj awatarowi ',
        code('name'),
        ' i żadnego ',
        code('src'),
        ', a wyrenderuje inicjały zamiast zepsutego obrazka. To użyteczne zabezpieczenie dla listy współtwórców, w której tylko część ma zdjęcie.',
      ),

      h2('Podstawowy awatar'),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  avatar({ name: 'Ada Lovelace' }),
  avatar({ name: 'Grace Hopper' }),
  avatar({ name: 'Alan Turing' }),
)`),

      h2('Z obrazem'),
      p(
        'Gdy ustawisz ',
        code('src'),
        ', ',
        code('alt'),
        ' wraca do nazwy — więc awatar nigdy nie jest nieopisanym obrazem.',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  avatar({ src: '/logo.svg', alt: 'sitelo', style: 'background: var(--su-surface-2)' }),
  avatar({ src: '/logo.svg', name: 'sitelo', square: true, style: 'background: var(--su-surface-2)' }),
)`),

      h2('Rozmiary'),
      p('Rozmiar czcionki skaluje się z awatarem, więc inicjały pozostają proporcjonalne.'),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  avatar({ name: 'Mały Jeden', size: 'sm' }),
  avatar({ name: 'Średni Jeden', size: 'md' }),
  avatar({ name: 'Duży Jeden', size: 'lg' }),
)`),

      h2('Kwadratowy'),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  avatar({ name: 'Projekt A', square: true }),
  avatar({ name: 'Projekt B', square: true, color: 'success' }),
)`),

      h2('Kolory'),
      p('Awatar bez obrazu dostaje tło z miękkiej palety.'),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center', wrap: true },
  avatar({ name: 'Primary', color: 'primary' }),
  avatar({ name: 'Neutral', color: 'neutral' }),
  avatar({ name: 'Success', color: 'success' }),
  avatar({ name: 'Warning', color: 'warning' }),
  avatar({ name: 'Danger', color: 'danger' }),
)`),

      h2('Ikony i inna treść'),
      p('Dzieci nadpisują inicjały, na ikonę albo pojedynczy znak.'),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  avatar({ color: 'neutral' },
    icon('user'),
  ),
  avatar({ color: 'primary' }, '?'),
)`),

      h2('Grupy'),
      p(
        code('avatarGroup()'),
        ' nakłada swoje dzieci na siebie i zwija wszystko powyżej ',
        code('max'),
        ' do licznika.',
      ),
      demo(`stack({ gap: 'md' },
  avatarGroup(
    avatar({ name: 'Ada Lovelace' }),
    avatar({ name: 'Grace Hopper' }),
    avatar({ name: 'Alan Turing' }),
  ),
  avatarGroup({ max: 3 },
    avatar({ name: 'Ada Lovelace' }),
    avatar({ name: 'Grace Hopper' }),
    avatar({ name: 'Alan Turing' }),
    avatar({ name: 'Katherine Johnson' }),
    avatar({ name: 'Barbara Liskov' }),
    avatar({ name: 'Margaret Hamilton' }),
  ),
  avatarGroup({ max: 2, size: 'sm' },
    avatar({ name: 'Ada Lovelace', size: 'sm' }),
    avatar({ name: 'Grace Hopper', size: 'sm' }),
    avatar({ name: 'Alan Turing', size: 'sm' }),
  ),
)`, { align: 'start' }),

      h2('Na liście'),
      demo(`list(
  listItem({
    start: avatar({ name: 'Ada Lovelace', size: 'sm' }),
    title: 'Ada Lovelace',
    description: 'Wypchnęła 3 commity na main',
  }),
  listItem({
    start: avatar({ name: 'Grace Hopper', size: 'sm', color: 'success' }),
    title: 'Grace Hopper',
    description: 'Otworzyła pull request',
  }),
)`, { align: 'stretch' }),

      h2('Propsy'),
      propsTable([
        ['name', 'string', '', 'Używane do inicjałów, atrybutu title i zapasowego alt obrazu.'],
        ['src', 'string', '', 'Obraz pokazywany zamiast inicjałów.'],
        ['alt', 'string', '', 'Tekst alternatywny obrazu; wraca do name.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Średnica i rozmiar czcionki inicjałów.'],
        ['square', 'boolean', 'false', 'Zaokrąglony prostokąt zamiast koła.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", '', 'Paleta tła pod inicjały.'],
      ]),
      p(
        code('avatarGroup()'),
        ' przyjmuje ',
        code('max'),
        ' — ile pokazać, zanim zwinie resztę do licznika — oraz ',
        code('size'),
        ', używany tylko dla tego licznika.',
      ),
    ],
  })
