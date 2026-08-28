import { div, h2, p, table, tbody, td, th, thead, tr } from 'javascript-to-html'
import { code, codeBlock, docsLayout, pageCodeTabs } from '../../lib/fr.js'
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
    title: 'Routage',
    description:
      'Routage basé sur les fichiers, segments dynamiques et generateStaticParams.',
    activeHref: '/fr/docs/routing',
    children: [
      p(
        'Les routes proviennent directement du système de fichiers, sous ',
        code('src/'),
        '.',
      ),
      codeBlock('project', structure, 'bash'),
      h2('Tableau des routes'),
      div(
        { class: 'docs-table-scroll' },
        table(
          { class: 'docs-table' },
          thead(tr(th('Fonctionnalité'), th('Fichier'), th('URL'))),
          tbody(
            row('Statique', code('index.ht.js'), code('/')),
            row('Imbriquée', code('blog/index.ht.js'), code('/blog')),
            row('Dynamique', code('blog/[slug].ht.js'), code('/blog/my-post')),
            row(
              'Plusieurs paramètres',
              code('blog/[year]/[slug].ht.js'),
              code('/blog/2026/my-post'),
            ),
            row(
              'Fourre-tout',
              code('docs/[...path].ht.js'),
              code('/docs/api/auth'),
            ),
            row(
              'Fourre-tout optionnel',
              code('docs/[...path]?.ht.js'),
              code('/docs + niveaux inférieurs'),
            ),
            row('Groupes de routes', code('(admin)/users.ht.js'), code('/users')),
          ),
        ),
      ),
      p(
        'La route la plus spécifique l’emporte : le statique bat le dynamique, et le dynamique bat les fourre-tout. Deux fichiers produisant la même URL provoquent une erreur de build.',
      ),
      h2('generateStaticParams'),
      p(
        'Les routes dynamiques déclarent quelles pages émettre au build. Avec ',
        code('sitelo'),
        ' (dev), les routes dynamiques se rendent toujours à la demande, sans lister chaque paramètre.',
      ),
      pageCodeTabs({
        file: 'src/blog/[slug].ht.js',
        template: paramsTemplate,
        ht: paramsHt,
        jsx: paramsJsx,
      }),
      p(
        'Les valeurs peuvent être des chaînes, des nombres ou des booléens — ils sont convertis en chaîne et encodés pour l’URL. Les paramètres fourre-tout acceptent des tableaux (',
        code("{ path: ['a', 'b'] }"),
        ') ou des chaînes séparées par des barres obliques (',
        code("{ path: 'a/b' }"),
        ').',
      ),
      p(
        'Une page dynamique qui ne génère aucune route affiche un avertissement, pour qu’elle ne disparaisse pas silencieusement de votre site.',
      ),
    ],
  })
