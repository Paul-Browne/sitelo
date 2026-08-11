import { a, h2, h3, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, pageCodeTabs } from '../lib/code.js'
import { docsLayout } from '../lib/layout.js'

const fnTemplate = `export default ({ params, data, dev }) => \`
  <html>
    <body><h1>Hello</h1></body>
  </html>
\``

const fnHt = `import { html, body, h1 } from 'javascript-to-html'

export default ({ params, data, dev }) =>
  html(
    body(h1('Hello'))
  )`

const fnJsx = `export default function Page({ params, data, dev }) {
  return (
    <html>
      <body><h1>Hello</h1></body>
    </html>
  )
}`

const stringSnippet = `export default \`<html><body><h1>Static as it gets</h1></body></html>\``

const structuredTemplate = `export default {
  generateStaticParams: () => [{ slug: 'hello' }],
  data: ({ params }) => ({ title: params.slug }),
  render: ({ data }) => \`<html><body><h1>\${data.title}</h1></body></html>\`,
}`

const structuredHt = `import { html, body, h1 } from 'javascript-to-html'

export default {
  generateStaticParams: () => [{ slug: 'hello' }],
  data: ({ params }) => ({ title: params.slug }),
  render: ({ data }) =>
    html(
      body(h1(data.title))
    ),
}`

const structuredJsx = `export default {
  generateStaticParams: () => [{ slug: 'hello' }],
  data: ({ params }) => ({ title: params.slug }),
  render: ({ data }) => (
    <html>
      <body><h1>{data.title}</h1></body>
    </html>
  ),
}`

export default () =>
  docsLayout({
    title: 'Writing pages',
    description:
      'How to author sitelo pages — template literals, ht.js (recommended), or JSX.',
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
        ' automatically. Prefer ',
        a({ href: 'https://ht.js.org', rel: 'noopener' }, 'ht.js'),
        ' (',
        code('javascript-to-html'),
        ') for markup — tag functions that return strings, with no templating engine or React runtime.',
      ),
      h2('1. A function returning HTML'),
      pageCodeTabs({
        file: 'page.ht.js',
        template: fnTemplate,
        ht: fnHt,
        jsx: fnJsx,
      }),
      p(
        'JSX files use ',
        code('*.ht.jsx'),
        ' / ',
        code('*.ht.tsx'),
        ' and need ',
        code('react'),
        ' + ',
        code('react-dom'),
        ' installed. See ',
        a({ href: '#jsx-limitations' }, 'JSX limitations'),
        ' below — sitelo turns JSX into static HTML at build time; it is not a React app in the browser.',
      ),
      h2('2. A plain string'),
      codeBlock('page.ht.js', stringSnippet, 'javascript'),
      h2('3. A structured module'),
      p('Keep ', code('render'), ', ', code('data'), ', and ', code('generateStaticParams'), ' together:'),
      pageCodeTabs({
        file: 'page.ht.js',
        template: structuredTemplate,
        ht: structuredHt,
        jsx: structuredJsx,
      }),
      h2('JSX limitations'),
      p(
        'sitelo can render ',
        code('.ht.jsx'),
        ' / ',
        code('.ht.tsx'),
        ' pages with ',
        code('react-dom/server'),
        ' so you can write familiar JSX syntax. That is an authoring convenience — not a React application.',
      ),
      p(
        'React is built for the browser: a component tree that mounts, hydrates, and responds to events. sitelo never ships that runtime with your pages. At build time it renders your JSX to an HTML string, writes the file, and stops. There is no client React bundle, no hydration, and no virtual DOM waiting in the browser.',
      ),
      p('Because of that:'),
      ul(
        { class: 'docs-list' },
        li(
          'Event handlers (',
          code('onClick'),
          ', ',
          code('onChange'),
          ', …) do nothing in the finished site — nothing is listening. The dev server warns if it finds them.',
        ),
        li(
          'Hooks (',
          code('useState'),
          ', ',
          code('useEffect'),
          ', …) are not part of the shipped page. They may run once during the build render; they do not keep state in the browser.',
        ),
        li(
          'Browser-only APIs (',
          code('window'),
          ', ',
          code('document'),
          ') are unavailable while the page is rendered at build time.',
        ),
        li(
          code('dangerouslySetInnerHTML'),
          ' works for injecting HTML strings; interactivity still needs a separate client ',
          code('<script>'),
          '.',
        ),
      ),
      p(
        'For clicks, forms, and other client behavior, link a normal script through the ',
        a({ href: '/docs/assets' }, 'asset pipeline'),
        ', or use ',
        a({ href: '/docs/islands' }, 'server islands'),
        ' for request-time HTML. Prefer ',
        a({ href: 'https://ht.js.org', rel: 'noopener' }, 'ht.js'),
        ' or template literals when you don’t need JSX syntax — no React install, and the model matches “HTML at build time.”',
      ),
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
