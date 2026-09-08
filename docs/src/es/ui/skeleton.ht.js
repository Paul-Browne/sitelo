import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/es.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Esqueleto',
    description:
      'Un marcador de posición con la forma del contenido que aún no ha llegado.',
    activeHref: '/es/ui/skeleton',
    extraHead: uiHead(),
    children: [
      p(
        'Un esqueleto ocupa el lugar del contenido mientras carga. En un sitio estático eso es más raro que en una app —el HTML ya está ahí—, pero suele ser lo que debería ser el ',
        code('fallback'),
        ' de una isla, y lo que muestra una región renderizada en cliente antes de que lleguen sus datos.',
      ),
      p(
        'Los esqueletos son decorativos: cada uno lleva ',
        code('aria-hidden'),
        ', para que a un lector de pantalla no le lean una lista de cajas vacías.',
      ),

      h2('Formas'),
      demo(`stack({ gap: 'md' },
  skeleton({ height: '2.5rem' }),
  skeleton({ variant: 'text', width: '70%' }),
  skeleton({ variant: 'circle', width: '3rem', height: '3rem' }),
)`, { align: 'stretch' }),

      h2('Texto'),
      p(
        code('lines'),
        ' dibuja lo equivalente a un párrafo, con la última línea corta para que se lea como prosa y no como un bloque.',
      ),
      demo(`stack({ gap: 'lg' },
  skeleton({ lines: 2 }),
  skeleton({ lines: 4 }),
)`, { align: 'stretch' }),

      h2('Con la forma de lo real'),
      p(
        'Un esqueleto convence más cuando coincide con la maquetación que sustituye: la misma tarjeta, las mismas filas, los mismos tamaños.',
      ),
      demo(`grid({ min: '14rem' },
  card(
    cardBody(
      stack({ gap: 'md' },
        stack({ direction: 'row', gap: 'sm', align: 'center' },
          skeleton({ variant: 'circle', width: '2.5rem', height: '2.5rem' }),
          stack({ gap: 'xs', style: 'flex: 1' },
            skeleton({ variant: 'text', width: '60%' }),
            skeleton({ variant: 'text', width: '40%' }),
          ),
        ),
        skeleton({ lines: 3 }),
      ),
    ),
  ),
  card(
    cardBody(
      stack({ direction: 'row', gap: 'sm', align: 'center' },
        avatar({ name: 'Ada Lovelace' }),
        stack({ gap: 'none' },
          text({ variant: 'small' }, 'Ada Lovelace'),
          text({ variant: 'caption', tone: 'muted' }, 'Subió 3 commits'),
        ),
      ),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Como fallback de una isla'),
      p(
        'Una isla de servidor envía su fallback dentro del HTML estático y mete el fragmento renderizado al servir la petición. Un esqueleto con la misma forma que el fragmento evita que la página dé un salto cuando llega.',
      ),
      demo(`card(
  cardHeader({ title: 'Comentarios' }),
  cardBody(
    stack({ gap: 'md' },
      skeleton({ lines: 2 }),
      divider({ spacing: 'xs' }),
      skeleton({ lines: 2 }),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Movimiento'),
      p(
        'El brillo se detiene para quien haya pedido a su sistema reducir el movimiento: eso se resuelve en la hoja de estilos, sin ninguna prop que poner.',
      ),

      h2('Props'),
      propsTable([
        ['variant', "'rect' | 'text' | 'circle'", "'rect'", 'La forma del marcador de posición.'],
        ['width', 'string', '', 'Cualquier anchura CSS.'],
        ['height', 'string', '', 'Cualquier altura CSS.'],
        ['lines', 'number', '', 'Dibujar tantas líneas de texto, con la última corta.'],
      ]),
    ],
  })
