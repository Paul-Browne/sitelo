import { div, h2, p, table, tbody, td, th, thead, tr } from 'javascript-to-html'
import { code, codeBlock, docsLayout, pageCodeTabs } from '../../lib/it.js'
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
    title: 'Routing',
    description:
      'Routing basato sui file, segmenti dinamici e generateStaticParams.',
    activeHref: '/it/docs/routing',
    children: [
      p(
        'Le rotte arrivano direttamente dal filesystem, sotto ',
        code('src/'),
        '.',
      ),
      codeBlock('project', structure, 'bash'),
      h2('Tabella delle rotte'),
      div(
        { class: 'docs-table-scroll' },
        table(
          { class: 'docs-table' },
          thead(tr(th('Caratteristica'), th('File'), th('URL'))),
          tbody(
            row('Statica', code('index.ht.js'), code('/')),
            row('Annidata', code('blog/index.ht.js'), code('/blog')),
            row('Dinamica', code('blog/[slug].ht.js'), code('/blog/my-post')),
            row(
              'Più parametri',
              code('blog/[year]/[slug].ht.js'),
              code('/blog/2026/my-post'),
            ),
            row('Catch-all', code('docs/[...path].ht.js'), code('/docs/api/auth')),
            row(
              'Catch-all opzionale',
              code('docs/[...path]?.ht.js'),
              code('/docs + più in profondità'),
            ),
            row('Gruppi di rotte', code('(admin)/users.ht.js'), code('/users')),
          ),
        ),
      ),
      p(
        'Vincono le rotte più specifiche: la statica batte la dinamica, la dinamica batte i catch-all. Due file che generano lo stesso URL sono un errore di build.',
      ),
      h2('generateStaticParams'),
      p(
        'Le rotte dinamiche dichiarano quali pagine produrre in fase di build. Con ',
        code('sitelo'),
        ' (sviluppo) le rotte dinamiche continuano a renderizzarsi su richiesta, senza elencare ogni parametro.',
      ),
      pageCodeTabs({
        file: 'src/blog/[slug].ht.js',
        template: paramsTemplate,
        ht: paramsHt,
        jsx: paramsJsx,
      }),
      p(
        'I valori possono essere stringhe, numeri o booleani — vengono convertiti in stringa e codificati per l’URL. I parametri catch-all accettano array (',
        code("{ path: ['a', 'b'] }"),
        ') oppure stringhe separate da barre (',
        code("{ path: 'a/b' }"),
        ').',
      ),
      p(
        'Una pagina dinamica che genera zero rotte stampa un avviso, così non può sparire in silenzio dal tuo sito.',
      ),
    ],
  })
