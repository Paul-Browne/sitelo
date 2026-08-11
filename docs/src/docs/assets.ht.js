import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, pageCodeTabs } from '../lib/code.js'
import { docsLayout } from '../lib/layout.js'

const layoutSnippet = `my-site/
  src/
    index.ht.js          # page — returns HTML
    css/
      styles.css         # linked from HTML → bundled
    js/
      main.js            # linked from HTML → bundled
      counter.ts         # imported by main.js → bundled too
    lib/
      posts.js           # only used in data() → never ships
  public/
    favicon.ico          # copied as-is`

const pageTemplate = `// src/index.ht.js
export default () => \`
  <html lang="en">
    <head>
      <title>My site</title>
      <link rel="stylesheet" href="/css/styles.css">
      <script type="module" src="/js/main.js"></script>
    </head>
    <body>
      <h1>Hello</h1>
      <button id="count">0</button>
    </body>
  </html>
\``

const pageHt = `// src/index.ht.js
import { html, head, title, link, script, body, h1, button } from 'javascript-to-html'

export default () =>
  html({ lang: 'en' },
    head(
      title('My site'),
      link({ rel: 'stylesheet', href: '/css/styles.css' }),
      script({ type: 'module', src: '/js/main.js' }),
    ),
    body(
      h1('Hello'),
      button({ id: 'count' }, '0'),
    ),
  )`

const pageJsx = `// src/index.ht.jsx
export default function Home() {
  return (
    <html lang="en">
      <head>
        <title>My site</title>
        <link rel="stylesheet" href="/css/styles.css" />
        <script type="module" src="/js/main.js" />
      </head>
      <body>
        <h1>Hello</h1>
        <button id="count">0</button>
      </body>
    </html>
  )
}`

const jsSnippet = `// src/js/main.js
import { createCounter } from './counter.ts'

const button = document.querySelector('#count')
const next = createCounter()

button.addEventListener('click', () => {
  button.textContent = String(next())
})`

const cssSnippet = `/* src/css/styles.css */
@import './tokens.css';

body {
  font-family: system-ui, sans-serif;
  margin: 0;
  padding: 2rem;
}`

const warnSnippet = `// sitelo.config.js
export default {
  missingAssets: 'warn',
}`

export default () =>
  docsLayout({
    title: 'Assets & styling',
    description:
      'How sitelo compiles frontend JavaScript and CSS with Vite — and keeps server-only code out of the browser.',
    activeHref: '/docs/assets',
    children: [
      p(
        'sitelo is built on Vite, so frontend JavaScript and CSS are compiled automatically. Put scripts and styles under ',
        code('src/'),
        ' (for example ',
        code('src/js'),
        ' and ',
        code('src/css'),
        '), link them from your HTML with root-relative URLs, and sitelo handles the rest — TypeScript, CSS imports, bundling, and minification.',
      ),
      h2('Project layout'),
      p(
        'Pages and assets share ',
        code('src/'),
        '. Folders like ',
        code('js/'),
        ' and ',
        code('css/'),
        ' are conventions, not requirements — sitelo cares about what your HTML references, not the folder names.',
      ),
      codeBlock('project', layoutSnippet, 'bash'),
      h2('Link assets from HTML'),
      p(
        'Reference files with root-relative paths. A ',
        code('<script type="module">'),
        ' or ',
        code('<link rel="stylesheet">'),
        ' is what tells sitelo to include that file in the build:',
      ),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: pageTemplate,
        ht: pageHt,
        jsx: pageJsx,
      }),
      codeBlock('src/js/main.js', jsSnippet, 'javascript'),
      codeBlock('src/css/styles.css', cssSnippet, 'css'),
      h2('What Vite compiles'),
      ul(
        { class: 'docs-list' },
        li(
          code('.js'),
          ' / ',
          code('.ts'),
          ' / ',
          code('.jsx'),
          ' / ',
          code('.tsx'),
          ' — bundled as ES modules, TypeScript stripped, imports inlined',
        ),
        li(
          code('.css'),
          ' — processed and minified; ',
          code('@import'),
          ' and relative ',
          code('url()'),
          ' references are resolved',
        ),
        li(
          'Anything imported from a referenced entry (like ',
          code('counter.ts'),
          ' above) is pulled into the same bundle',
        ),
        li(
          'In ',
          code('sitelo'),
          ' (dev), the same URLs go through Vite’s transform pipeline — no separate build step to try TypeScript or CSS',
        ),
      ),
      p(
        'Need PostCSS, Sass, or other Vite plugins? Add them under ',
        code('vite'),
        ' in ',
        a({ href: '/docs/configuration' }, 'sitelo.config.js'),
        '.',
      ),
      h2('Zero JS by default'),
      ul(
        { class: 'docs-list' },
        li(
          'Unreferenced code is not emitted. A helper only imported from ',
          code('data()'),
          ' or ',
          code('generateStaticParams'),
          ' stays out of ',
          code('dist/'),
          ' — server-only secrets never ship by accident.',
        ),
        li(
          'No ',
          code('<script>'),
          ' on the page means no client JavaScript in the build. Static HTML and CSS are enough for most sites.',
        ),
        li(
          code('public/'),
          ' is copied verbatim (favicons, robots.txt, static images you don’t want hashed).',
        ),
        li('Other referenced files (images, fonts, videos, …) are copied into ', code('dist/'), '.'),
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
