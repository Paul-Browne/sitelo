import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/es.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Pila',
    description:
      'Una fila o columna flex con un token de espaciado como hueco: la pieza de maquetación con la que se construyen casi todas las páginas.',
    activeHref: '/es/ui/stack',
    extraHead: uiHead(),
    children: [
      p(
        'Stack pone espacio entre cosas. Es un contenedor flex con un solo cometido, y es la respuesta a casi todas las preguntas de «cómo separo esto»: en vertical por defecto, en horizontal con ',
        code("direction: 'row'"),
        '.',
      ),
      p(
        'Los huecos vienen de la escala de espaciado, así que el ritmo de una página se mantiene coherente sin que nadie elija valores en píxeles.',
      ),

      h2('Pila básica'),
      demo(`stack({ gap: 'md' },
  card(cardBody('Primera')),
  card(cardBody('Segunda')),
  card(cardBody('Tercera')),
)`, { align: 'stretch' }),

      h2('Dirección'),
      demo(`stack({ direction: 'row', gap: 'md' },
  button('Uno'),
  button({ variant: 'outline' }, 'Dos'),
  button({ variant: 'outline' }, 'Tres'),
)`),

      h2('Hueco'),
      p(
        'Un nombre de token (',
        code("'xs'"),
        ' … ',
        code("'3xl'"),
        '), un número de unidades de espaciado, o una longitud CSS tal cual.',
      ),
      demo(`stack({ gap: 'lg' },
  stack({ direction: 'row', gap: 'xs' }, chip('xs'), chip('xs'), chip('xs')),
  stack({ direction: 'row', gap: 'md' }, chip('md'), chip('md'), chip('md')),
  stack({ direction: 'row', gap: 6 }, chip('6 unidades'), chip('6 unidades')),
  stack({ direction: 'row', gap: '3rem' }, chip('3rem'), chip('3rem')),
)`, { align: 'stretch' }),

      h2('Alineación'),
      p(
        code('align'),
        ' y ',
        code('justify'),
        ' admiten valores de flexbox tal cual, así que sirve cualquier cosa que entienda CSS.',
      ),
      demo(`stack({ gap: 'md' },
  stack({ direction: 'row', gap: 'sm', justify: 'space-between', style: 'background: var(--su-surface-2); padding: 0.6rem; border-radius: 0.5rem' },
    chip('inicio'),
    chip('final'),
  ),
  stack({ direction: 'row', gap: 'sm', justify: 'center', align: 'center', style: 'background: var(--su-surface-2); padding: 0.6rem; border-radius: 0.5rem' },
    button({ size: 'sm' }, 'Centrado'),
    chip('y alineado'),
  ),
)`, { align: 'stretch' }),

      h2('Salto de línea'),
      p(
        'Una fila de chips o botones que puede no caber necesita ',
        code('wrap'),
        ': sin él se aplastan en vez de pasar a la línea siguiente.',
      ),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  ...['routing', 'data', 'islands', 'images', 'pagefind', 'lighthouse', 'sitemap', 'rss'].map(
    (name) => chip({ color: 'neutral' }, name),
  ),
)`, { align: 'stretch' }),

      h2('En línea'),
      p(
        code('inline'),
        ' convierte la pila en un ',
        code('inline-flex'),
        ', así que se sitúa dentro de una línea de texto en vez de ocupar todo el ancho.',
      ),
      demo(`text(
  'Hecho con ',
  stack({ direction: 'row', gap: 'xs', inline: true, align: 'center' },
    chip({ color: 'primary', size: 'sm' }, 'sitelo'),
    chip({ color: 'neutral', size: 'sm' }, 'vite'),
  ),
  ' y nada más.',
)`, { align: 'stretch' }),

      h2('Como otro elemento'),
      demo(`stack({ as: 'nav', direction: 'row', gap: 'sm' },
  navLink({ href: '/es/docs' }, 'Documentación'),
  navLink({ href: '/es/ui', current: true }, 'UI'),
  navLink({ href: '/es/examples' }, 'Ejemplos'),
)`),

      h2('Props'),
      propsTable([
        ['direction', "'row' | 'column'", "'column'", 'Eje principal.'],
        ['gap', 'Space', "'md'", 'Espacio entre los hijos.'],
        ['align', 'string', "'stretch'", 'Cualquier valor de align-items.'],
        ['justify', 'string', "'flex-start'", 'Cualquier valor de justify-content.'],
        ['wrap', 'boolean | string', 'false', 'true significa envolver; una cadena se pasa tal cual como flex-wrap.'],
        ['inline', 'boolean', 'false', 'Se dibuja como inline-flex.'],
        ['as', 'string', "'div'", 'Elemento que se renderiza, por ejemplo nav o ul.'],
      ]),
    ],
  })
