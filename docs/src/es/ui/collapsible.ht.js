import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/es.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Plegable',
    description:
      'Un único «ver más», sin los bordes ni la agrupación de un acordeón.',
    activeHref: '/es/ui/collapsible',
    extraHead: uiHead(),
    children: [
      p(
        'Un plegable es un solo ',
        code('<details>'),
        ' — el mismo elemento con el que se construye un acordeón, sin nada de su decoración. Úsalo para un detalle opcional en medio de una página; usa ',
        code('accordion()'),
        ' cuando haya un conjunto de ellos.',
      ),
      p(
        'No necesita script, y como el contenido se queda en el documento, se encuentra tanto con la búsqueda en la página del navegador como con un buscador.',
      ),

      h2('Plegable básico'),
      demo(`collapsible({ trigger: 'Ver la configuración generada' },
  text({ variant: 'small' }, 'Todo lo que sitelo escribe cuando compilas sin un archivo de configuración propio.'),
)`, { align: 'stretch' }),

      h2('Abierto por defecto'),
      demo(`collapsible({ trigger: 'Por qué existe esto', open: true },
  text({ variant: 'small' }, 'Porque una página que esconde su explicación tras un clic es una página que nadie lee.'),
)`, { align: 'stretch' }),

      h2('Contenido enriquecido'),
      demo(`collapsible({ trigger: 'Ver la salida completa' },
  stack({ gap: 'sm' },
    code('dist/index.html'),
    code('dist/404.html'),
    code('dist/sitemap.xml'),
  ),
)`, { align: 'stretch' }),

      h2('Dentro de otras cosas'),
      p('Un plegable vive tan a gusto dentro de una tarjeta, una alerta o una celda de tabla.'),
      demo(`stack({ gap: 'md' },
  card(
    cardHeader({ title: 'Compilación fallida', subtitle: '2 enlaces rotos' }),
    cardBody(
      collapsible({ trigger: 'Ver los enlaces que fallan' },
        list({ plain: true },
          listItem({ title: '/docs/old-routing', description: 'enlazado desde /docs' }),
          listItem({ title: '/blog/draft', description: 'enlazado desde /blog' }),
        ),
      ),
    ),
  ),
  alert({ color: 'warning', title: 'Página lenta' },
    stack({ gap: 'sm' },
      text({ variant: 'small' }, 'Una página tardó más de 500 ms en renderizarse.'),
      collapsible({ trigger: 'Ver los tiempos' },
        text({ variant: 'small' }, '/examples/wordpress — 512 ms'),
      ),
    ),
  ),
)`, { align: 'stretch' }),

      h2('El disparador'),
      p(
        'Limítalo a texto e iconos. Un ',
        code('<summary>'),
        ' ya es interactivo, así que un botón o un enlace dentro anida dos controles donde solo hay una acción — la misma regla que sigue ',
        code('menu()'),
        '.',
      ),

      h2('¿Plegable o acordeón?'),
      p(
        'Una sola revelación por su cuenta: ',
        code('collapsible()'),
        '. Un conjunto de ellas, con borde y agrupadas, opcionalmente con solo una abierta a la vez: ',
        code('accordion()'),
        '.',
      ),

      h2('Props'),
      propsTable([
        ['trigger', 'Child', '', 'El contenido del resumen. Solo texto e iconos.'],
        ['open', 'boolean', 'false', 'Si empieza desplegado.'],
      ]),
    ],
  })
