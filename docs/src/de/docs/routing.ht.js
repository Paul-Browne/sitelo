import { div, h2, p, table, tbody, td, th, thead, tr } from 'javascript-to-html'
import { code, codeBlock, docsLayout, pageCodeTabs } from '../../lib/de.js'
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
      'Dateibasiertes Routing, dynamische Segmente und generateStaticParams.',
    activeHref: '/de/docs/routing',
    children: [
      p(
        'Die Routen ergeben sich direkt aus dem Dateisystem unter ',
        code('src/'),
        '.',
      ),
      codeBlock('project', structure, 'bash'),
      h2('Routentabelle'),
      div(
        { class: 'docs-table-scroll' },
        table(
          { class: 'docs-table' },
          thead(tr(th('Funktion'), th('Datei'), th('URL'))),
          tbody(
            row('Statisch', code('index.ht.js'), code('/')),
            row('Verschachtelt', code('blog/index.ht.js'), code('/blog')),
            row('Dynamisch', code('blog/[slug].ht.js'), code('/blog/my-post')),
            row(
              'Mehrere Parameter',
              code('blog/[year]/[slug].ht.js'),
              code('/blog/2026/my-post'),
            ),
            row(
              'Catch-all',
              code('docs/[...path].ht.js'),
              code('/docs/api/auth'),
            ),
            row(
              'Optionales Catch-all',
              code('docs/[...path]?.ht.js'),
              code('/docs + tiefere Pfade'),
            ),
            row('Routengruppen', code('(admin)/users.ht.js'), code('/users')),
          ),
        ),
      ),
      p(
        'Die spezifischere Route gewinnt: statisch schlägt dynamisch, dynamisch schlägt Catch-all. Zwei Dateien, die dieselbe URL erzeugen, sind ein Build-Fehler.',
      ),
      h2('generateStaticParams'),
      p(
        'Dynamische Routen legen fest, welche Seiten beim Build erzeugt werden. In ',
        code('sitelo'),
        ' (dev) werden dynamische Routen weiterhin auf Anfrage gerendert, ohne dass du jeden Parameter auflisten musst.',
      ),
      pageCodeTabs({
        file: 'src/blog/[slug].ht.js',
        template: paramsTemplate,
        ht: paramsHt,
        jsx: paramsJsx,
      }),
      p(
        'Werte dürfen Strings, Zahlen oder Booleans sein — sie werden in Strings umgewandelt und URL-kodiert. Catch-all-Parameter akzeptieren Arrays (',
        code("{ path: ['a', 'b'] }"),
        ') oder durch Schrägstriche getrennte Strings (',
        code("{ path: 'a/b' }"),
        ').',
      ),
      p(
        'Eine dynamische Seite, die keine einzige Route erzeugt, gibt eine Warnung aus — so verschwindet sie nicht stillschweigend aus deiner Website.',
      ),
    ],
  })
