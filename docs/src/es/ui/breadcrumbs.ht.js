import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/es.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Migas de pan',
    description:
      'El rastro de ancestros que termina en la página en la que estás.',
    activeHref: '/es/ui/breadcrumbs',
    extraHead: uiHead(),
    children: [
      p(
        'Las migas de pan dicen dónde se sitúa una página. El último elemento es la página actual: se dibuja como texto plano y se marca con ',
        code('aria-current="page"'),
        ', porque un enlace a la página en la que ya estás es ruido.',
      ),

      h2('Migas básicas'),
      demo(`breadcrumbs({
  items: [
    { label: 'Inicio', href: '/' },
    { label: 'Documentación', href: '/docs' },
    { label: 'Rutas' },
  ],
})`, { align: 'stretch' }),

      h2('Separador'),
      p('Cualquier cadena o marcado. En todos los casos los separadores quedan ocultos a los lectores de pantalla.'),
      demo(`stack({ gap: 'md' },
  breadcrumbs({
    separator: '/',
    items: [{ label: 'Inicio', href: '/' }, { label: 'UI', href: '/ui' }, { label: 'Migas de pan' }],
  }),
  breadcrumbs({
    separator: '›',
    items: [{ label: 'Inicio', href: '/' }, { label: 'UI', href: '/ui' }, { label: 'Migas de pan' }],
  }),
  breadcrumbs({
    separator: '·',
    items: [{ label: 'Inicio', href: '/' }, { label: 'UI', href: '/ui' }, { label: 'Migas de pan' }],
  }),
)`, { align: 'stretch' }),

      h2('Cadenas simples'),
      p('Un elemento sin href es solo texto, esté donde esté — no únicamente al final.'),
      demo(`breadcrumbs({
  items: ['Inicio', 'Archivo', '2026', 'Marzo'],
})`, { align: 'stretch' }),

      h2('A partir de una ruta'),
      p(
        'En un sitio estático el rastro suele deducirse de la ruta, no escribirse a mano.',
      ),
      demo(`return (() => {
  const path = '/docs/guides/routing'
  const segments = path.split('/').filter(Boolean)

  return breadcrumbs({
    items: [
      { label: 'Inicio', href: '/' },
      ...segments.map((segment, index) => ({
        label: segment.replace(/-/g, ' '),
        href: index === segments.length - 1 ? undefined : '/' + segments.slice(0, index + 1).join('/'),
      })),
    ],
  })
})()`, { align: 'stretch' }),

      h2('Etiquetar el nav'),
      p(
        'Todo el conjunto es un ',
        code('<nav>'),
        ' con nombre accesible, así que un lector de pantalla puede saltar hasta él. Cambia el nombre con ',
        code('label'),
        ' cuando una página tenga más de un punto de referencia de navegación.',
      ),
      demo(`breadcrumbs({
  label: 'Migas de la documentación',
  items: [{ label: 'Documentación', href: '/docs' }, { label: 'Componentes' }],
})`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['items', 'Array', '[]', 'Cadenas, u objetos { label, href }. El último es la página actual.'],
        ['separator', 'Child', "'/'", 'Se dibuja entre elementos, oculto a los lectores de pantalla.'],
        ['label', 'string', "'Breadcrumb'", 'Nombre accesible del punto de referencia nav.'],
      ]),
    ],
  })
