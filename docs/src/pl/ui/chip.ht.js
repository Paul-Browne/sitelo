import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pl.js'

export default () =>
  uiLayout({
    title: 'Żeton',
    description: 'Zwarta etykieta — tag, status, filtr, licznik.',
    activeHref: '/pl/ui/chip',
    children: [
      p(
        'Żetony to małe kawałki metadanych: tagi wpisu na blogu, status buildu, kategorie strony. Domyślnie są liniowe, więc ich rząd chce ',
        code('stack'),
        ' z ',
        code('wrap'),
        '.',
      ),

      h2('Podstawowy żeton'),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  chip('statyczne'),
  chip('vite'),
  chip('zero-runtime'),
)`),

      h2('Kolory'),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  chip({ color: 'primary' }, 'primary'),
  chip({ color: 'neutral' }, 'neutral'),
  chip({ color: 'success' }, 'success'),
  chip({ color: 'warning' }, 'warning'),
  chip({ color: 'danger' }, 'danger'),
)`),

      h2('Warianty'),
      demo(`stack({ gap: 'sm' },
  stack({ direction: 'row', gap: 'sm', wrap: true },
    chip({ variant: 'soft', color: 'primary' }, 'soft'),
    chip({ variant: 'soft', color: 'success' }, 'soft'),
    chip({ variant: 'soft', color: 'danger' }, 'soft'),
  ),
  stack({ direction: 'row', gap: 'sm', wrap: true },
    chip({ variant: 'outline', color: 'primary' }, 'outline'),
    chip({ variant: 'outline', color: 'success' }, 'outline'),
    chip({ variant: 'outline', color: 'danger' }, 'outline'),
  ),
  stack({ direction: 'row', gap: 'sm', wrap: true },
    chip({ variant: 'solid', color: 'primary' }, 'solid'),
    chip({ variant: 'solid', color: 'success' }, 'solid'),
    chip({ variant: 'solid', color: 'danger' }, 'solid'),
  ),
)`, { align: 'start' }),

      h2('Rozmiary'),
      demo(`stack({ direction: 'row', gap: 'sm', align: 'center', wrap: true },
  chip({ size: 'sm' }, 'mały'),
  chip({ size: 'md' }, 'średni'),
  chip({ size: 'lg' }, 'duży'),
)`),

      h2('Kropka statusu'),
      p(
        'Kropka z przodu zamienia żeton w status. Sam kolor nie wystarczy, żeby nieść znaczenie, więc zostaw słowo.',
      ),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  chip({ color: 'success', dot: true }, 'Build zaliczony'),
  chip({ color: 'warning', dot: true }, 'W kolejce'),
  chip({ color: 'danger', dot: true }, 'Nieudany'),
  chip({ color: 'neutral', dot: true }, 'Pominięty'),
)`),

      h2('Odnośniki'),
      p(
        'Daj żetonowi ',
        code('href'),
        ', a wyrenderuje kotwicę — typowy kształt listy tagów, gdzie każdy tag to strona.',
      ),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  chip({ href: '/docs/routing', color: 'primary' }, 'routing'),
  chip({ href: '/docs/data', color: 'primary' }, 'data'),
  chip({ href: '/docs/islands', color: 'primary' }, 'islands'),
)`),

      h2('Jako przycisk'),
      p(
        code('as'),
        ' zmienia element, na filtr, który przełącza, a nie nawiguje.',
      ),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  chip({ as: 'button', variant: 'solid', color: 'primary', 'aria-pressed': 'true' }, 'Wszystko'),
  chip({ as: 'button', variant: 'outline', color: 'neutral', 'aria-pressed': 'false' }, 'Przewodniki'),
  chip({ as: 'button', variant: 'outline', color: 'neutral', 'aria-pressed': 'false' }, 'Przykłady'),
)`),

      h2('W tabeli'),
      demo(`table({
  striped: true,
  columns: [
    { key: 'page', header: 'Strona' },
    { header: 'Status', align: 'end', render: (row) =>
      chip({ size: 'sm', dot: true, color: row.ok ? 'success' : 'danger' }, row.ok ? 'ok' : 'błąd') },
  ],
  rows: [
    { page: '/', ok: true },
    { page: '/docs', ok: true },
    { page: '/blog/[slug]', ok: false },
  ],
})`, { align: 'stretch' }),

      h2('Propsy'),
      propsTable([
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'neutral'", 'Z której palety czerpać.'],
        ['variant', "'soft' | 'outline' | 'solid'", "'soft'", 'Ile wagi niesie żeton.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Odstęp wewnętrzny i rozmiar tekstu.'],
        ['href', 'string', '', 'Renderuje kotwicę.'],
        ['dot', 'boolean', 'false', 'Dodaje kropkę statusu przed etykietą.'],
        ['as', 'string', "'span'", 'Element do wyrenderowania, gdy nie ma href.'],
      ]),
    ],
  })
