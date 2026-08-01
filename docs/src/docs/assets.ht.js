import { h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock } from '../lib/code.js'
import { docsLayout } from '../lib/layout.js'

const assetSnippet = `export default () => \`
  <html>
    <head>
      <link rel="stylesheet" href="/styles.css">
      <script type="module" src="/main.js"></script>
    </head>
    <body>...</body>
  </html>
\``

const warnSnippet = `// sitelo.config.js
export default {
  missingAssets: 'warn',
}`

export default () =>
  docsLayout({
    title: 'Assets & styling',
    description: 'How sitelo bundles CSS/JS and validates asset references.',
    activeHref: '/docs/assets',
    children: [
      p(
        'Reference assets with root-relative URLs. sitelo bundles what your HTML points at.',
      ),
      codeBlock('src/index.ht.js', assetSnippet, 'javascript'),
      h2('At build time'),
      ul(
        { class: 'docs-list' },
        li(
          'Referenced JS / TS / CSS is bundled with esbuild — imports inlined, output minified, ',
          code('.ts'),
          ' compiles to ',
          code('.js'),
          '.',
        ),
        li(
          'Unreferenced code is not emitted. A helper only imported from ',
          code('data()'),
          ' stays out of ',
          code('dist/'),
          ' — server-only secrets never ship by accident.',
        ),
        li('Everything else is copied (images, fonts, videos, …).'),
        li(code('public/'), ' behaves like normal Vite — copied verbatim.'),
      ),
      p(
        'In dev, the same URLs go through Vite’s transform pipeline, so TypeScript and CSS work without a build.',
      ),
      h2('Missing-asset validation'),
      p(
        'A ',
        code('<script src>'),
        ' or stylesheet ',
        code('href'),
        ' pointing at a file that exists in neither ',
        code('src/'),
        ' nor ',
        code('public/'),
        ' fails the build. Prefer a warning?',
      ),
      codeBlock('sitelo.config.js', warnSnippet, 'javascript'),
    ],
  })
