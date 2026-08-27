import { div, h2, p, table, tbody, td, th, thead, tr } from 'javascript-to-html'
import { code, codeBlock, docsLayout, pageCodeTabs } from '../../lib/es.js'
import {
  paramsHt,
  paramsJsx,
  paramsTemplate,
  structure,
} from '../../lib/snippets/routing.js'

function row(feature, file, url) {
  return tr(td(feature), td(file), td(url))
}

export default () =>
  docsLayout({
    title: 'Rutas',
    description:
      'Enrutado basado en archivos, segmentos dinámicos y generateStaticParams.',
    activeHref: '/es/docs/routing',
    children: [
      p(
        'Las rutas salen directamente del sistema de archivos, dentro de ',
        code('src/'),
        '.',
      ),
      codeBlock('project', structure, 'bash'),
      h2('Tabla de rutas'),
      div(
        { class: 'docs-table-scroll' },
        table(
          { class: 'docs-table' },
          thead(tr(th('Función'), th('Archivo'), th('URL'))),
          tbody(
            row('Estática', code('index.ht.js'), code('/')),
            row('Anidada', code('blog/index.ht.js'), code('/blog')),
            row('Dinámica', code('blog/[slug].ht.js'), code('/blog/my-post')),
            row(
              'Varios parámetros',
              code('blog/[year]/[slug].ht.js'),
              code('/blog/2026/my-post'),
            ),
            row(
              'Comodín',
              code('docs/[...path].ht.js'),
              code('/docs/api/auth'),
            ),
            row(
              'Comodín opcional',
              code('docs/[...path]?.ht.js'),
              code('/docs + rutas más profundas'),
            ),
            row('Grupos de rutas', code('(admin)/users.ht.js'), code('/users')),
          ),
        ),
      ),
      p(
        'Gana la ruta más específica: la estática vence a la dinámica, y la dinámica a los comodines. Que dos archivos generen la misma URL es un error de compilación.',
      ),
      h2('generateStaticParams'),
      p(
        'Las rutas dinámicas declaran qué páginas emitir en tiempo de compilación. Con ',
        code('sitelo'),
        ' (dev), las rutas dinámicas se siguen renderizando bajo demanda sin necesidad de enumerar cada parámetro.',
      ),
      pageCodeTabs({
        file: 'src/blog/[slug].ht.js',
        template: paramsTemplate,
        ht: paramsHt,
        jsx: paramsJsx,
      }),
      p(
        'Los valores pueden ser cadenas, números o booleanos — se convierten a cadena y se codifican para la URL. Los parámetros comodín aceptan arrays (',
        code("{ path: ['a', 'b'] }"),
        ') o cadenas separadas por barras (',
        code("{ path: 'a/b' }"),
        ').',
      ),
      p(
        'Una página dinámica que no genera ninguna ruta muestra un aviso, para que no desaparezca de tu sitio en silencio.',
      ),
    ],
  })
