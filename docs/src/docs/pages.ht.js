import { a, h2, h3, p } from 'javascript-to-html'
import { code, codeBlock } from '../lib/code.js'
import { docsLayout } from '../lib/layout.js'

const fnSnippet = `export default ({ params, data, dev }) => \`
  <html>
    <body><h1>Hello</h1></body>
  </html>
\``

const stringSnippet = `export default \`<html><body><h1>Static as it gets</h1></body></html>\``

const structuredSnippet = `export default {
  generateStaticParams: () => [{ slug: 'hello' }],
  data: ({ params }) => ({ title: params.slug }),
  render: ({ data }) => \`<html><body><h1>\${data.title}</h1></body></html>\`,
}`

const jsxSnippet = `// src/index.ht.tsx
export default function Home() {
  return (
    <html lang="en">
      <head><title>My site</title></head>
      <body><h1>Hello from TSX</h1></body>
    </html>
  )
}`

const j2hSnippet = `import { html, head, title, body, h1 } from 'javascript-to-html'

export default () =>
  html({ lang: 'en' },
    head(title('My website')),
    body(h1('Hello world'))
  )`

export default () =>
  docsLayout({
    title: 'Writing pages',
    description: 'How to author sitelo pages with strings, JSX, or javascript-to-html.',
    activeHref: '/docs/pages',
    children: [
      p(
        'Any file ending in a page extension is a page. Default extensions: ',
        code('.ht.js'),
        ', ',
        code('.html.js'),
        ', and the TypeScript / JSX variants (',
        code('.ht.ts'),
        ', ',
        code('.ht.tsx'),
        ', …).',
      ),
      p(
        'If output starts with ',
        code('<html>'),
        ', sitelo prepends ',
        code('<!DOCTYPE html>'),
        ' automatically.',
      ),
      h2('1. A function returning HTML'),
      codeBlock('page.ht.js', fnSnippet, 'javascript'),
      h2('2. A plain string'),
      codeBlock('page.ht.js', stringSnippet, 'javascript'),
      h2('3. A structured module'),
      p('Keep ', code('render'), ', ', code('data'), ', and ', code('generateStaticParams'), ' together:'),
      codeBlock('page.ht.js', structuredSnippet, 'javascript'),
      h2('4. JSX / TSX'),
      p(
        'Name the file ',
        code('*.ht.jsx'),
        ' or ',
        code('*.ht.tsx'),
        '. Output is static HTML via ',
        code('react-dom/server'),
        ' — install ',
        code('react'),
        ' and ',
        code('react-dom'),
        ' in your project. Event handlers like ',
        code('onClick'),
        ' will not run in the browser.',
      ),
      codeBlock('src/index.ht.tsx', jsxSnippet, 'javascript'),
      h2('5. javascript-to-html'),
      p(
        'Prefer composable functions? Use ',
        a(
          {
            href: 'https://www.npmjs.com/package/javascript-to-html',
            rel: 'noopener',
          },
          'javascript-to-html',
        ),
        ':',
      ),
      codeBlock('src/index.ht.js', j2hSnippet, 'javascript'),
      h2('Render context'),
      p('Every page function receives one argument:'),
      h3('params'),
      p('Route params for this page (', code('Record<string, string | string[]>'), ').'),
      h3('data'),
      p('Whatever your ', code('data()'), ' function returned.'),
      h3('page'),
      p('Route metadata (', code('routePath'), ', ', code('relativePath'), ', …).'),
      h3('dev'),
      p(code('true'), ' in the dev server, ', code('false'), ' at build time.'),
    ],
  })
