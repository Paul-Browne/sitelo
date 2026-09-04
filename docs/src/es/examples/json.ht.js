import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, examplesLayout, pageCodeTabs } from '../../lib/es.js'
import { jsonSnippets } from '../../lib/snippets/examples-json.js'

const s = jsonSnippets('es')

export default () =>
  examplesLayout({
    title: 'JSON local',
    description:
      'Un catálogo de productos construido íntegramente a partir de archivos JSON del repositorio: sin API y sin base de datos.',
    activeHref: '/es/examples/json',
    children: [
      p(
        'Contenido que vive en el repositorio como JSON, convertido en páginas estáticas por ',
        code('sitelo/data'),
        '. Sin API, sin base de datos y sin JavaScript en el cliente. Código completo en ',
        a(
          {
            href: 'https://github.com/paul-browne/sitelo/tree/main/examples/json',
            rel: 'noopener',
          },
          'examples/json',
        ),
        '.',
      ),
      h2('Qué obtienes'),
      ul(
        { class: 'docs-list' },
        li('Una página de inicio con todas las categorías y productos'),
        li(
          code('/products/[slug]'),
          ' — una página estática por archivo en ',
          code('data/products/'),
          '',
        ),
        li(
          code('/categories/[slug]'),
          ' — una página por clave de ',
          code('data/categories.json'),
          '',
        ),
        li('Añadir un archivo JSON añade una página; no hay ninguna ruta que registrar'),
        li('Cero JS enviado al navegador: los archivos se leen en Node en tiempo de compilación'),
      ),
      h2('Estructura del proyecto'),
      codeBlock('project', s.structure, 'bash'),
      p(
        'Los datos viven fuera de ',
        code('src/'),
        ', así que sitelo nunca los trata como páginas ni recursos.',
      ),
      h2('1. Pon el contenido en data/'),
      p(
        'Un archivo por producto. El nombre del archivo es el slug, así que ',
        code('aeron-chair.json'),
        ' se convierte en ',
        code('/products/aeron-chair'),
        ' sin que el archivo tenga que decirlo:',
      ),
      codeBlock('data/products/aeron-chair.json', s.product, 'json'),
      p(
        'Las categorías, en cambio, son un único archivo: un objeto indexado por slug, que ',
        code('readJsonCollection'),
        ' lee igualmente como una colección.',
      ),
      codeBlock('data/categories.json', s.categories, 'json'),
      h2('2. Léelo en un solo sitio'),
      p(
        'Un módulo pequeño, solo de servidor, envuelve las lecturas. Nada del HTML lo referencia, así que nunca llega al navegador; y como ',
        code('sitelo/data'),
        ' memoriza por archivo, todas las páginas que usan estos helpers siguen analizando cada archivo JSON una sola vez en toda la compilación.',
      ),
      codeBlock('src/lib/catalogue.js', s.lib, 'javascript'),
      h2('3. Lista todo en la página de inicio'),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.indexTemplate,
        ht: s.indexHt,
        jsx: s.indexJsx,
      }),
      h2('4. Una página por archivo JSON'),
      p(
        code('generateStaticParams'),
        ' devuelve un slug por archivo en tiempo de compilación; ',
        code('data()'),
        ' carga la entrada correspondiente a cada página.',
      ),
      pageCodeTabs({
        file: 'src/products/[slug].ht.js',
        template: s.slugTemplate,
        ht: s.slugHt,
        jsx: s.slugJsx,
      }),
      h2('5. Edita y observa'),
      codeBlock('terminal', s.build, 'bash'),
      p(
        'Con ',
        code('sitelo'),
        ', cambiar un precio recarga la página abierta: el servidor de desarrollo vigila los archivos JSON que las páginas leen de verdad. Los slugs duplicados, los archivos que faltan y el JSON mal formado hacen fallar la compilación indicando la ruta culpable.',
      ),
      p(
        a({ href: '/es/docs/data' }, 'Documentación de carga de datos'),
        ' · ',
        a({ href: '/es/docs/routing' }, 'Documentación de rutas'),
        ' · ',
        a({ href: '/es/docs/configuration' }, 'Documentación de configuración'),
      ),
    ],
  })
