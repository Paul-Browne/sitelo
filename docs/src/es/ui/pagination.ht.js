import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/es.js'

export default () =>
  uiLayout({
    title: 'Paginación',
    description:
      'Páginas numeradas, con una ventana alrededor de la actual, como enlaces de verdad.',
    activeHref: '/es/ui/pagination',
    children: [
      p(
        code('href'),
        ' es una función que va del número de página a la URL, así que la paginación sirve igual para ',
        code('/blog/2'),
        ' que para ',
        code('/blog?page=2'),
        '. Eso hace que cada página sea un enlace de verdad: rastreable, abrible en una pestaña nueva y funcional sin JavaScript, que es lo que quiere un sitio estático.',
      ),

      h2('Paginación básica'),
      demo(`pagination({ page: 1, count: 5, href: (page) => '#page-' + page })`),

      h2('Ventana'),
      p(
        'La primera y la última página se muestran siempre, más una ventana alrededor de la actual, con puntos suspensivos allí donde la secuencia da un salto.',
      ),
      demo(`stack({ gap: 'md' },
  pagination({ page: 1, count: 12, href: (page) => '#a-' + page }),
  pagination({ page: 6, count: 12, href: (page) => '#b-' + page }),
  pagination({ page: 12, count: 12, href: (page) => '#c-' + page }),
)`, { align: 'start' }),

      h2('Hermanas'),
      p(
        code('siblings'),
        ' es cuántas páginas quedan a cada lado de la actual.',
      ),
      demo(`stack({ gap: 'md' },
  pagination({ page: 6, count: 12, siblings: 0, href: (page) => '#d-' + page }),
  pagination({ page: 6, count: 12, siblings: 1, href: (page) => '#e-' + page }),
  pagination({ page: 6, count: 12, siblings: 3, href: (page) => '#f-' + page }),
)`, { align: 'start' }),

      h2('Extremos'),
      p(
        'Anterior queda deshabilitado en la primera página y siguiente en la última, así que el control nunca ofrece una página que no existe.',
      ),
      demo(`stack({ gap: 'md' },
  pagination({ page: 1, count: 3, href: (page) => '#g-' + page }),
  pagination({ page: 3, count: 3, href: (page) => '#h-' + page }),
  pagination({ page: 1, count: 1, href: (page) => '#i-' + page }),
)`, { align: 'start' }),

      h2('Colores y etiquetas'),
      demo(`stack({ gap: 'md' },
  pagination({ page: 3, count: 6, color: 'neutral', href: (page) => '#j-' + page }),
  pagination({
    page: 3,
    count: 6,
    color: 'success',
    previousLabel: 'Más nuevas',
    nextLabel: 'Más antiguas',
    href: (page) => '#k-' + page,
  }),
)`, { align: 'start' }),

      h2('Sin hrefs'),
      p(
        'Sin ',
        code('href'),
        ', los números se dibujan como botones que llevan ',
        code('data-su-page'),
        ', para una página que filtra en el sitio con su propio script. Prefiere enlaces cuando puedas: sobreviven a que JavaScript esté desactivado.',
      ),
      demo(`pagination({ page: 2, count: 4 })`),

      h2('En un blog'),
      p(
        'La forma habitual en un sitio estático: ',
        code('generateStaticParams'),
        ' produce una página por tramo, y ',
        code('href'),
        ' apunta a ellas.',
      ),
      demo(`return (() => {
  const posts = 47
  const perPage = 10
  const current = 3

  return stack({ gap: 'md', align: 'center' },
    text({ variant: 'small', tone: 'muted' },
      'Mostrando ' + ((current - 1) * perPage + 1) + '–' + Math.min(current * perPage, posts) + ' de ' + posts,
    ),
    pagination({
      page: current,
      count: Math.ceil(posts / perPage),
      href: (page) => page === 1 ? '#blog' : '#blog-' + page,
    }),
  )
})()`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['page', 'number', '1', 'La página actual. Se ajusta al rango.'],
        ['count', 'number', '1', 'Cuántas páginas hay.'],
        ['href', '(page: number) => string', '', 'Del número de página a la URL. Sin él, las páginas se dibujan como botones.'],
        ['siblings', 'number', '1', 'Páginas que se muestran a cada lado de la actual.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Color de la página actual.'],
        ['label', 'string', "'Pagination'", 'Nombre accesible del punto de referencia nav.'],
        ['previousLabel', 'Child', "'‹'", 'Contenido del control de anterior.'],
        ['nextLabel', 'Child', "'›'", 'Contenido del control de siguiente.'],
      ]),
    ],
  })
