import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/es.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Chip',
    description:
      'Una etiqueta compacta: un tag, un estado, un filtro, un recuento.',
    activeHref: '/es/ui/chip',
    extraHead: uiHead(),
    children: [
      p(
        'Los chips son trocitos de metadatos: las etiquetas de una entrada de blog, el estado de una compilación, las categorías de una página. Por defecto son en línea, así que una fila de ellos pide un ',
        code('stack'),
        ' con ',
        code('wrap'),
        '.',
      ),

      h2('Chip básico'),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  chip('estático'),
  chip('vite'),
  chip('sin-runtime'),
)`),

      h2('Colores'),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  chip({ color: 'primary' }, 'primary'),
  chip({ color: 'neutral' }, 'neutral'),
  chip({ color: 'success' }, 'success'),
  chip({ color: 'warning' }, 'warning'),
  chip({ color: 'danger' }, 'danger'),
)`),

      h2('Variantes'),
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

      h2('Tamaños'),
      demo(`stack({ direction: 'row', gap: 'sm', align: 'center', wrap: true },
  chip({ size: 'sm' }, 'pequeño'),
  chip({ size: 'md' }, 'mediano'),
  chip({ size: 'lg' }, 'grande'),
)`),

      h2('Punto de estado'),
      p(
        'Un punto delante convierte un chip en un estado. El color por sí solo no basta para transmitir significado, así que conserva la palabra.',
      ),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  chip({ color: 'success', dot: true }, 'Compilación correcta'),
  chip({ color: 'warning', dot: true }, 'En cola'),
  chip({ color: 'danger', dot: true }, 'Fallida'),
  chip({ color: 'neutral', dot: true }, 'Omitida'),
)`),

      h2('Enlaces'),
      p(
        'Dale a un chip un ',
        code('href'),
        ' y dibujará un ancla — la forma habitual de una lista de etiquetas, donde cada etiqueta es una página.',
      ),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  chip({ href: '/es/docs/routing', color: 'primary' }, 'rutas'),
  chip({ href: '/es/docs/data', color: 'primary' }, 'datos'),
  chip({ href: '/es/docs/islands', color: 'primary' }, 'islas'),
)`),

      h2('Como botón'),
      p(
        code('as'),
        ' cambia el elemento, para un filtro que alterna en vez de navegar.',
      ),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  chip({ as: 'button', variant: 'solid', color: 'primary', 'aria-pressed': 'true' }, 'Todo'),
  chip({ as: 'button', variant: 'outline', color: 'neutral', 'aria-pressed': 'false' }, 'Guías'),
  chip({ as: 'button', variant: 'outline', color: 'neutral', 'aria-pressed': 'false' }, 'Ejemplos'),
)`),

      h2('En una tabla'),
      demo(`table({
  striped: true,
  columns: [
    { key: 'page', header: 'Página' },
    { header: 'Estado', align: 'end', render: (row) =>
      chip({ size: 'sm', dot: true, color: row.ok ? 'success' : 'danger' }, row.ok ? 'ok' : 'fallo') },
  ],
  rows: [
    { page: '/', ok: true },
    { page: '/docs', ok: true },
    { page: '/blog/[slug]', ok: false },
  ],
})`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'neutral'", 'De qué paleta bebe.'],
        ['variant', "'soft' | 'outline' | 'solid'", "'soft'", 'Cuánto peso lleva el chip.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Relleno y tamaño del texto.'],
        ['href', 'string', '', 'Dibuja un ancla.'],
        ['dot', 'boolean', 'false', 'Añade un punto de estado antes de la etiqueta.'],
        ['as', 'string', "'span'", 'Elemento que se renderiza cuando no hay href.'],
      ]),
    ],
  })
