import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/it.js'

export default () =>
  uiLayout({
    title: 'Chip',
    description: 'Un’etichetta compatta — un tag, uno stato, un filtro, un conteggio.',
    activeHref: '/it/ui/chip',
    children: [
      p(
        'I chip sono piccoli pezzi di metadato: i tag di un articolo, lo stato di una build, le categorie di una pagina. Sono inline per impostazione predefinita, quindi una loro fila vuole uno ',
        code('stack'),
        ' con ',
        code('wrap'),
        '.',
      ),

      h2('Chip di base'),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  chip('statico'),
  chip('vite'),
  chip('zero-runtime'),
)`),

      h2('Colori'),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  chip({ color: 'primary' }, 'primary'),
  chip({ color: 'neutral' }, 'neutral'),
  chip({ color: 'success' }, 'success'),
  chip({ color: 'warning' }, 'warning'),
  chip({ color: 'danger' }, 'danger'),
)`),

      h2('Varianti'),
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

      h2('Dimensioni'),
      demo(`stack({ direction: 'row', gap: 'sm', align: 'center', wrap: true },
  chip({ size: 'sm' }, 'piccolo'),
  chip({ size: 'md' }, 'medio'),
  chip({ size: 'lg' }, 'grande'),
)`),

      h2('Pallino di stato'),
      p(
        'Un pallino davanti trasforma un chip in uno stato. Il solo colore non basta a portare significato, quindi tieni la parola.',
      ),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  chip({ color: 'success', dot: true }, 'Build superata'),
  chip({ color: 'warning', dot: true }, 'In coda'),
  chip({ color: 'danger', dot: true }, 'Fallita'),
  chip({ color: 'neutral', dot: true }, 'Saltata'),
)`),

      h2('Link'),
      p(
        'Dai a un chip un ',
        code('href'),
        ' e renderizza un’ancora — la forma consueta per un elenco di tag, in cui ogni tag è una pagina.',
      ),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  chip({ href: '/docs/routing', color: 'primary' }, 'routing'),
  chip({ href: '/docs/data', color: 'primary' }, 'data'),
  chip({ href: '/docs/islands', color: 'primary' }, 'islands'),
)`),

      h2('Come pulsante'),
      p(
        code('as'),
        ' cambia l’elemento, per un filtro che commuta invece di navigare.',
      ),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  chip({ as: 'button', variant: 'solid', color: 'primary', 'aria-pressed': 'true' }, 'Tutti'),
  chip({ as: 'button', variant: 'outline', color: 'neutral', 'aria-pressed': 'false' }, 'Guide'),
  chip({ as: 'button', variant: 'outline', color: 'neutral', 'aria-pressed': 'false' }, 'Esempi'),
)`),

      h2('In una tabella'),
      demo(`table({
  striped: true,
  columns: [
    { key: 'page', header: 'Pagina' },
    { header: 'Stato', align: 'end', render: (row) =>
      chip({ size: 'sm', dot: true, color: row.ok ? 'success' : 'danger' }, row.ok ? 'ok' : 'fallita') },
  ],
  rows: [
    { page: '/', ok: true },
    { page: '/docs', ok: true },
    { page: '/blog/[slug]', ok: false },
  ],
})`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'neutral'", 'Da quale palette attingere.'],
        ['variant', "'soft' | 'outline' | 'solid'", "'soft'", 'Quanto peso porta il chip.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Spazio interno e dimensione del testo.'],
        ['href', 'string', '', 'Renderizza un’ancora.'],
        ['dot', 'boolean', 'false', 'Aggiunge un pallino di stato prima dell’etichetta.'],
        ['as', 'string', "'span'", 'Elemento da renderizzare quando non c’è href.'],
      ]),
    ],
  })
