import { div, h2, p, table, tbody, td, th, thead, tr } from 'javascript-to-html'
import { code, codeBlock, docsLayout, pageCodeTabs } from '../../lib/pl.js'
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
      'Routing oparty na plikach, segmenty dynamiczne i generateStaticParams.',
    activeHref: '/pl/docs/routing',
    children: [
      p('Trasy biorą się wprost z systemu plików, spod ', code('src/'), '.'),
      codeBlock('project', structure, 'bash'),
      h2('Tabela tras'),
      div(
        { class: 'docs-table-scroll' },
        table(
          { class: 'docs-table' },
          thead(tr(th('Możliwość'), th('Plik'), th('URL'))),
          tbody(
            row('Statyczna', code('index.ht.js'), code('/')),
            row('Zagnieżdżona', code('blog/index.ht.js'), code('/blog')),
            row('Dynamiczna', code('blog/[slug].ht.js'), code('/blog/my-post')),
            row(
              'Wiele parametrów',
              code('blog/[year]/[slug].ht.js'),
              code('/blog/2026/my-post'),
            ),
            row('Catch-all', code('docs/[...path].ht.js'), code('/docs/api/auth')),
            row(
              'Opcjonalny catch-all',
              code('docs/[...path]?.ht.js'),
              code('/docs + głębiej'),
            ),
            row('Grupy tras', code('(admin)/users.ht.js'), code('/users')),
          ),
        ),
      ),
      p(
        'Wygrywają trasy bardziej szczegółowe: statyczna bije dynamiczną, dynamiczna bije catch-all. Dwa pliki generujące ten sam URL to błąd buildu.',
      ),
      h2('generateStaticParams'),
      p(
        'Trasy dynamiczne deklarują, które strony wypuścić podczas buildu. W ',
        code('sitelo'),
        ' (dev) trasy dynamiczne nadal renderują się na żądanie, bez wyliczania każdego parametru.',
      ),
      pageCodeTabs({
        file: 'src/blog/[slug].ht.js',
        template: paramsTemplate,
        ht: paramsHt,
        jsx: paramsJsx,
      }),
      p(
        'Wartości mogą być ciągami znaków, liczbami albo wartościami logicznymi — są zamieniane na tekst i kodowane do URL-a. Parametry catch-all przyjmują tablice (',
        code("{ path: ['a', 'b'] }"),
        ') albo ciągi rozdzielone ukośnikami (',
        code("{ path: 'a/b' }"),
        ').',
      ),
      p(
        'Strona dynamiczna, która generuje zero tras, wypisuje ostrzeżenie, więc nie może po cichu zniknąć z witryny.',
      ),
    ],
  })
