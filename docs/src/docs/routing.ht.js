import { div, h2, p, table, tbody, td, th, thead, tr } from 'javascript-to-html'
import { code, codeBlock, pageCodeTabs } from '../lib/code.js'
import { docsLayout } from '../lib/layout.js'

const structureSnippet = `src/
  index.ht.js              → /
  about.ht.js              → /about
  blog/
    index.ht.js            → /blog
    [slug].ht.js           → /blog/:slug
  docs/
    [...path]?.ht.js       → /docs, /docs/a, /docs/a/b, ...
  (admin)/
    users.ht.js            → /users
  404.ht.js                → dist/404.html`

const paramsTemplate = `export function generateStaticParams() {
  return [
    { slug: 'hello-world' },
    { slug: 'my-first-post' },
  ]
}

export default ({ params }) => \`
  <html><body><h1>\${params.slug}</h1></body></html>
\``

const paramsHt = `import { html, body, h1 } from 'javascript-to-html'

export function generateStaticParams() {
  return [
    { slug: 'hello-world' },
    { slug: 'my-first-post' },
  ]
}

export default ({ params }) =>
  html(
    body(h1(params.slug))
  )`

const paramsJsx = `export function generateStaticParams() {
  return [
    { slug: 'hello-world' },
    { slug: 'my-first-post' },
  ]
}

export default function Post({ params }) {
  return (
    <html>
      <body>
        <h1>{params.slug}</h1>
      </body>
    </html>
  )
}`

function row(feature, file, url) {
  return tr(td(feature), td(file), td(url))
}

export default () =>
  docsLayout({
    title: 'Routing',
    description: 'File-based routing, dynamic segments, and generateStaticParams.',
    activeHref: '/docs/routing',
    children: [
      p('Routes come straight from the filesystem under ', code('src/'), '.'),
      codeBlock('project', structureSnippet, 'bash'),
      h2('Route table'),
      div(
        { class: 'docs-table-scroll' },
        table(
          { class: 'docs-table' },
          thead(tr(th('Feature'), th('File'), th('URL'))),
          tbody(
            row('Static', code('index.ht.js'), code('/')),
            row('Nested', code('blog/index.ht.js'), code('/blog')),
            row('Dynamic', code('blog/[slug].ht.js'), code('/blog/my-post')),
            row(
              'Multiple params',
              code('blog/[year]/[slug].ht.js'),
              code('/blog/2026/my-post'),
            ),
            row('Catch-all', code('docs/[...path].ht.js'), code('/docs/api/auth')),
            row(
              'Optional catch-all',
              code('docs/[...path]?.ht.js'),
              code('/docs + deeper'),
            ),
            row('Route groups', code('(admin)/users.ht.js'), code('/users')),
          ),
        ),
      ),
      p(
        'More specific routes win: static beats dynamic, dynamic beats catch-alls. Two files generating the same URL is a build error.',
      ),
      h2('generateStaticParams'),
      p(
        'Dynamic routes declare which pages to emit at build time. In ',
        code('sitelo'),
        ' (dev), dynamic routes still render on demand without listing every param.',
      ),
      pageCodeTabs({
        file: 'src/blog/[slug].ht.js',
        template: paramsTemplate,
        ht: paramsHt,
        jsx: paramsJsx,
      }),
      p(
        'Values can be strings, numbers, or booleans — they are stringified and URL-encoded. Catch-all params accept arrays (',
        code("{ path: ['a', 'b'] }"),
        ') or slash-separated strings (',
        code("{ path: 'a/b' }"),
        ').',
      ),
      p(
        'A dynamic page that generates zero routes prints a warning so it cannot silently vanish from your site.',
      ),
    ],
  })
