import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock } from '../lib/code.js'
import { docsLayout } from '../lib/layout.js'

const installSnippet = `npm install -D sitelo`

const pageSnippet = `// src/index.ht.js
export default () => \`
  <html lang="en">
    <head><title>My website</title></head>
    <body><h1>Hello world</h1></body>
  </html>
\``

const pageHtSnippet = `// src/index.ht.js
import { html, head, title, body, h1 } from 'javascript-to-html'

export default () =>
  html({ lang: 'en' },
    head(title('My website')),
    body(h1('Hello world'))
  )`

const runSnippet = `sitelo          # dev server
sitelo build    # write dist/
sitelo preview  # preview the build`

export default () =>
  docsLayout({
    title: 'Getting started',
    description: 'Install sitelo and build your first static site.',
    activeHref: '/docs',
    children: [
      p(
        'sitelo is a zero-config static site generator powered by Vite. Install one package, write functions that return HTML, and run ',
        code('sitelo build'),
        '.',
      ),
      h2('Install'),
      codeBlock('shell', installSnippet, 'bash'),
      p('Requires Node 18+. Vite is bundled — you do not install it separately.'),
      h2('Your first page'),
      p('Create ', code('src/index.ht.js'), ':'),
      codeBlock('src/index.ht.js', pageSnippet, 'javascript'),
      p(
        'Or, recommended — use ',
        a({ href: 'https://ht.js.org', rel: 'noopener' }, 'ht.js'),
        ' (',
        a(
          {
            href: 'https://www.npmjs.com/package/javascript-to-html',
            rel: 'noopener',
          },
          'javascript-to-html',
        ),
        '):',
      ),
      codeBlock('src/index.ht.js', pageHtSnippet, 'javascript'),
      h2('Run'),
      codeBlock('shell', runSnippet, 'bash'),
      p(
        'That emits ',
        code('dist/index.html'),
        ' (with ',
        code('<!DOCTYPE html>'),
        ' added for you) plus a default ',
        code('404.html'),
        '.',
      ),
      h2('Next'),
      ul(
        { class: 'docs-list' },
        li(a({ href: '/docs/pages' }, 'Writing pages'), ' — template strings, JSX, structured modules'),
        li(a({ href: '/docs/routing' }, 'Routing'), ' — file-based routes and ', code('generateStaticParams')),
        li(a({ href: '/docs/data' }, 'Data loading'), ' — ', code('data()'), ' and ', code('fetchWithCache')),
        li(
          a({ href: '/docs/assets' }, 'Assets & styling'),
          ' — frontend JS/CSS compiled by Vite (',
          code('src/js'),
          ', ',
          code('src/css'),
          ')',
        ),
        li(a({ href: '/docs/configuration' }, 'Configuration'), ' — ', code('sitelo.config.js'), ' and Vite options'),
        li(a({ href: '/docs/build-with-ai' }, 'Build with AI'), ' — ', code('llms.txt'), ', project rules, and agent tips'),
      ),
    ],
  })
