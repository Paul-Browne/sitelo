import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, examplesLayout } from '../../lib/es.js'

export default () =>
  examplesLayout({
    title: 'Ejemplos',
    description: 'Recetas prácticas de sitelo — WordPress, APIs y más.',
    activeHref: '/es/examples',
    children: [
      p(
        'Recetas paso a paso para construir sitios reales con sitelo. Cada ejemplo muestra la estructura del proyecto, la carga de datos y las páginas que escribirías.',
      ),
      h2('Disponibles'),
      ul(
        { class: 'docs-list' },
        li(
          a({ href: '/es/examples/basic' }, 'Sitio básico'),
          ' — proyecto mínimo más configuraciones de despliegue estático para Netlify, Vercel, Cloudflare Pages y AWS Amplify.',
        ),
        li(
          a({ href: '/es/examples/todo' }, 'App de tareas'),
          ' — HTML estático con manejadores ',
          code("import('/js/todo.js')"),
          ' en línea (añadir / marcar / eliminar, ',
          code('localStorage'),
          ').',
        ),
        li(
          a({ href: '/es/examples/blog' }, 'Blog en Markdown'),
          ' — una carpeta de archivos ',
          code('.md'),
          ' renderizados a páginas estáticas, con feed RSS y cero JS de cliente.',
        ),
        li(
          a({ href: '/es/examples/json' }, 'JSON local'),
          ' — un catálogo construido a partir de archivos ',
          code('.json'),
          ' del repositorio: una página por archivo, sin API ni base de datos.',
        ),
        li(
          a({ href: '/es/examples/wordpress' }, 'WordPress'),
          ' — trae entradas de la API REST de WordPress con ',
          code('fetchWithCache'),
          ', lístalas y genera páginas estáticas para cada una.',
        ),
        li(
          a({ href: '/es/examples/islands' }, 'Islas de servidor'),
          ' — páginas estáticas más un host Node que renderiza islas en el momento de la petición.',
        ),
      ),
      h2('Próximamente'),
      ul({ class: 'docs-list' }, li('CMS headless / Contentful')),
    ],
  })
