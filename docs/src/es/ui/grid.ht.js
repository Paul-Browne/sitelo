import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/es.js'

export default () =>
  uiLayout({
    title: 'Cuadrícula',
    description:
      'Una cuadrícula adaptable que mete tantas columnas como quepan: sin breakpoints, sin media queries.',
    activeHref: '/es/ui/grid',
    children: [
      p(
        'Sin ',
        code('columns'),
        ', una cuadrícula encaja tantas pistas de al menos ',
        code('min'),
        ' como permita el espacio, y cada una reparte lo que sobra a partes iguales. Ese es el comportamiento que quiere una lista de tarjetas, y no necesita breakpoints: cambia el tamaño de esta página y las demos de abajo se recolocan solas.',
      ),

      h2('Autoajuste'),
      p('Lo que hace por defecto. Las pistas miden al menos 16rem.'),
      demo(`grid(
  ...['Rutas', 'Carga de datos', 'Recursos', 'Imágenes', 'Islas', 'Búsqueda'].map((name) =>
    card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, name))),
  ),
)`, { align: 'stretch' }),

      h2('Ancho de pista'),
      p(
        code('min'),
        ' fija cuánto puede estrecharse una pista antes de que la cuadrícula baje de columnas. Cuanto menor, más columnas.',
      ),
      demo(`grid({ min: '9rem' },
  ...['sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'].map((name) =>
    card({ variant: 'flat' }, cardBody(text({ variant: 'small', align: 'center' }, name))),
  ),
)`, { align: 'stretch' }),

      h2('Un número fijo de columnas'),
      p(
        'Pasa un número cuando el recuento no debe cambiar con la ventana. Cada pista se lleva una parte igual.',
      ),
      demo(`grid({ columns: 3 },
  ...['Uno', 'Dos', 'Tres'].map((name) =>
    card({ variant: 'flat' }, cardBody(text({ variant: 'small', align: 'center' }, name))),
  ),
)`, { align: 'stretch' }),

      h2('Una plantilla a medida'),
      p(
        'Una cadena se pasa tal cual como ',
        code('grid-template-columns'),
        ', para una división de barra lateral y contenido o cualquier otra cosa que CSS grid sepa expresar.',
      ),
      demo(`grid({ columns: '12rem 1fr', gap: 'lg' },
  card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Barra lateral'))),
  card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'El contenido, que se queda con el resto de la fila.'))),
)`, { align: 'stretch' }),

      h2('Hueco y alineación'),
      demo(`grid({ min: '10rem', gap: 'xl', align: 'center' },
  card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Corta'))),
  card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Una tarjeta más alta, con dos líneas de texto, para enseñar qué le hace align a sus vecinas más bajas.'))),
  card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Corta'))),
)`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['columns', 'number | string', '', 'Un número fijo de pistas, o un valor de grid-template-columns tal cual. Omítelo para autoajuste.'],
        ['min', 'string', "'16rem'", 'Ancho mínimo de pista en el autoajuste.'],
        ['gap', 'Space', "'md'", 'Espacio entre pistas y filas.'],
        ['align', 'string', "'stretch'", 'Cualquier valor de align-items.'],
        ['as', 'string', "'div'", 'Elemento que se renderiza.'],
      ]),
      p(
        'Una pista nunca se hace más ancha que la propia cuadrícula, aunque ',
        code('min'),
        ' sea mayor que el espacio disponible: así un mínimo de 16rem no provoca una barra de desplazamiento horizontal en un móvil de 320 px.',
      ),
    ],
  })
