import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/es.js'

export default () =>
  uiLayout({
    title: 'Pie de página',
    description:
      'La parte de abajo de un sitio: columnas de enlaces y una línea debajo.',
    activeHref: '/es/ui/footer',
    children: [
      p(
        'Un pie de página es una cuadrícula de columnas que se autoajusta, más una línea inferior opcional que siempre ocupa todo el ancho, haya las columnas que haya.',
      ),
      p(
        'Se exporta como ',
        code('footer'),
        ' y como ',
        code('siteFooter'),
        ', porque ',
        code('footer'),
        ' es también el elemento ',
        code('<footer>'),
        ' de javascript-to-html e importar ambos con un solo nombre es un error de sintaxis.',
      ),

      h2('Pie básico'),
      demo(`footer(
  footerColumn({ title: 'Documentación' },
    '<a href="/es/docs">Primeros pasos</a>',
    '<a href="/es/docs/routing">Rutas</a>',
    '<a href="/es/docs/data">Carga de datos</a>',
  ),
  footerColumn({ title: 'Componentes' },
    '<a href="/es/ui">Resumen</a>',
    '<a href="/es/ui/button">Botón</a>',
    '<a href="/es/ui/card">Tarjeta</a>',
  ),
  footerColumn({ title: 'Proyecto' },
    '<a href="https://github.com/paul-browne/sitelo">GitHub</a>',
    '<a href="https://www.npmjs.com/package/sitelo">npm</a>',
  ),
)`, { align: 'stretch' }),

      h2('Con línea inferior'),
      p(
        code('footerBottom()'),
        ' abarca todas las columnas, así que sigue siendo una fila a todo lo ancho haga lo que haga la cuadrícula de arriba.',
      ),
      demo(`footer(
  footerColumn({ title: 'Documentación' }, '<a href="/es/docs">Guía</a>', '<a href="/es/ui">Componentes</a>'),
  footerColumn({ title: 'Ejemplos' }, '<a href="/es/examples">Todos los ejemplos</a>'),
  footerBottom(
    text({ variant: 'caption' }, '© 2026 Paul Browne · MIT'),
    stack({ direction: 'row', gap: 'sm' },
      chip({ size: 'sm', color: 'neutral' }, 'v2.7'),
      chip({ size: 'sm', color: 'success', dot: true }, 'Compilación correcta'),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Una columna de marca'),
      p(
        'Una columna no tiene por qué ser de enlaces. Todo lo que pases como hijo de ',
        code('footer()'),
        ' en vez de una columna ocupa su propia celda en la cuadrícula.',
      ),
      demo(`footer(
  div(
    stack({ gap: 'sm' },
      text({ variant: 'h5', as: 'div' }, 'sitelo'),
      text({ variant: 'small', tone: 'muted' }, 'Generación de sitios estáticos sin configuración, sobre Vite.'),
    ),
  ),
  footerColumn({ title: 'Documentación' }, '<a href="/es/docs">Guía</a>', '<a href="/es/ui">Componentes</a>'),
  footerColumn({ title: 'Proyecto' }, '<a href="#">GitHub</a>', '<a href="#">npm</a>'),
)`, { align: 'stretch' }),

      h2('Columnas fijas'),
      p(
        'Por defecto las columnas se autoajustan. ',
        code('columns'),
        ' admite cualquier valor de ',
        code('grid-template-columns'),
        ' cuando quieres una forma concreta: una columna de marca ancha y dos columnas estrechas de enlaces, por ejemplo.',
      ),
      demo(`footer({ columns: '2fr 1fr 1fr' },
  div(text({ variant: 'small', tone: 'muted' }, 'Una primera columna más ancha para la marca y una frase sobre ella.')),
  footerColumn({ title: 'Documentación' }, '<a href="/es/docs">Guía</a>'),
  footerColumn({ title: 'Más' }, '<a href="/es/examples">Ejemplos</a>'),
)`, { align: 'stretch' }),

      h2('Solo la línea inferior'),
      demo(`footer(
  footerBottom(text({ variant: 'caption' }, '© 2026 · Hecho con sitelo')),
)`, { align: 'stretch' }),

      h2('Props'),
      p(code('footer()'), ':'),
      propsTable([
        ['columns', 'string', '', 'Un valor de grid-template-columns. Se autoajusta si se omite.'],
        ['as', 'string', "'footer'", 'Elemento que se renderiza.'],
      ]),
      propsTable([
        ['footerColumn', 'title', '', 'Una columna con título; los hijos pasan a ser una lista de enlaces.'],
        ['footerBottom', '', '', 'Fila a todo lo ancho bajo las columnas.'],
      ], { headers: ['Parte', 'Props', 'Por defecto', 'Descripción'] }),
    ],
  })
