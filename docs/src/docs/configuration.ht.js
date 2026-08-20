import { a, h2, h3, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, pageCodeTabs } from '../lib/code.js'
import { docsLayout } from '../lib/layout.js'

const configSnippet = `export default {
  site: 'https://example.com',
  rss: {
    site: 'https://example.com',
    title: 'My Blog',
    description: 'Latest posts',
    routePrefix: '/blog',
  },
  vite: {
    publicDir: 'static',
    build: {
      emptyOutDir: true,
      outDir: 'public',
    },
    server: {
      port: 8888,
    },
  },
}`

const viteOnlySnippet = `// Vite options only; sitelo still injects the plugin
export default {
  publicDir: 'static',
  server: { port: 8888 },
}`

const vitePluginSnippet = `// Register the plugin yourself
import htmlPages from 'sitelo'

export default {
  plugins: [htmlPages({
    site: 'https://example.com',
  })],
}`

const rssSnippet = `export default {
  rss: {
    site: 'https://example.com',
    title: 'My Blog',
    description: 'Latest posts',
    routePrefix: '/blog',
  },
}`

const pagefindSnippet = `export default {
  pagefind: true,
}`

const pagefindPageTemplate = `export default () => \`
  <html lang="en">
    <head>
      <title>My site</title>
      <link rel="stylesheet" href="/styles.css">
      <script type="module" src="/main.js"></script>
    </head>
    <body>
      <header>
        <a href="/">Home</a>
        <div id="search"></div>
      </header>
      <main data-pagefind-body>
        <h1>Hello</h1>
        <p>Only this region is indexed.</p>
      </main>
    </body>
  </html>
\``

const pagefindPageHt = `import {
  html, head, title, link, script, body, header, a, div, main, h1, p,
} from 'javascript-to-html'

export default () =>
  html({ lang: 'en' },
    head(
      title('My site'),
      link({ rel: 'stylesheet', href: '/styles.css' }),
      script({ type: 'module', src: '/main.js' }),
    ),
    body(
      header(
        a({ href: '/' }, 'Home'),
        div({ id: 'search' }),
      ),
      main({ 'data-pagefind-body': '' },
        h1('Hello'),
        p('Only this region is indexed.'),
      ),
    ),
  )`

const pagefindPageJsx = `export default function Home() {
  return (
    <html lang="en">
      <head>
        <title>My site</title>
        <link rel="stylesheet" href="/styles.css" />
        <script type="module" src="/main.js" />
      </head>
      <body>
        <header>
          <a href="/">Home</a>
          <div id="search" />
        </header>
        <main data-pagefind-body="">
          <h1>Hello</h1>
          <p>Only this region is indexed.</p>
        </main>
      </body>
    </html>
  )
}`

const pagefindMainSnippet = `async function initSearch() {
  const mount = document.querySelector('#search')
  if (!mount) return

  // Index only exists after \`sitelo build\` (synced to public/pagefind by default)
  try {
    const probe = await fetch('/pagefind/pagefind-ui.js', { method: 'HEAD' })
    if (!probe.ok) return
  } catch {
    return
  }

  const style = document.createElement('link')
  style.rel = 'stylesheet'
  style.href = '/pagefind/pagefind-ui.css'
  document.head.appendChild(style)

  await new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = '/pagefind/pagefind-ui.js'
    script.onload = resolve
    script.onerror = reject
    document.body.appendChild(script)
  })

  new window.PagefindUI({
    element: '#search',
    showImages: false,
  })
}

initSearch()`

const pagefindGitignoreSnippet = `public/pagefind/`

export default () =>
  docsLayout({
    title: 'Configuration',
    description: 'sitelo.config.js plugin options, Vite settings, sitemap, RSS, and Pagefind.',
    activeHref: '/docs/configuration',
    children: [
      p(
        'Put plugin options and optional Vite settings in ',
        code('sitelo.config.js'),
        '. No ',
        code('vite.config.js'),
        ' is required.',
      ),
      codeBlock('sitelo.config.js', configSnippet, 'javascript'),
      h2('Plugin options'),
      ul(
        { class: 'docs-list' },
        li(code('pagesDir'), ' — default ', code("'src'")),
        li(code('pageExtensions'), ' — which suffixes count as pages'),
        li(code('cleanUrls'), ' — default ', code('true'), ' (', code('/about/index.html'), ')'),
        li(code('site'), ' — base URL; enables ', code('sitemap.xml')),
        li(code('rss'), ' — RSS feed config'),
        li(
          code('pagefind'),
          ' — ',
          code('true'),
          ' or options object; indexes the site with ',
          a({ href: 'https://pagefind.app', rel: 'noopener' }, 'Pagefind'),
          ' after ',
          code('sitelo build'),
        ),
        li(
          code('images'),
          ' — ',
          code('true'),
          ' or options object; ',
          a({ href: '/docs/images' }, 'optimizes images'),
          ' in dev and after ',
          code('sitelo build'),
        ),
        li(code('missingAssets'), ' — ', code("'error'"), ' or ', code("'warn'")),
        li(code('generatedTypesDir'), ' — default ', code("'.sitelo/types'")),
        li(code('renderConcurrency'), ' / ', code('renderBatchSize'), ' — build parallelism'),
        li(code('debug'), ' — verbose logging'),
        li(
          code('devToolbar'),
          ' — default ',
          code('true'),
          '; set ',
          code('false'),
          ' to hide the dev-only toolbar (source file, params, island count, viewport toggle)',
        ),
        li(
          code('devToolbarDocsUrl'),
          ' — Docs link in the toolbar (default ',
          code('https://sitelo.js.org/docs'),
          ')',
        ),
      ),
      h2('Dev toolbar'),
      p(
        'While ',
        code('sitelo'),
        ' (dev) is running, a small bar at the bottom of each page shows the page file, params, and how many ',
        a({ href: '/docs/islands' }, 'server islands'),
        ' are on the page. Use the viewport button to cycle ',
        code('Desktop'),
        ' / ',
        code('Tablet'),
        ' / ',
        code('Mobile'),
        ' preview (iframe, so media queries match), and ',
        code('Copy'),
        ' for a debug blob when filing issues. It never appears in ',
        code('sitelo build'),
        ' output.',
      ),
      codeBlock(
        'sitelo.config.js',
        `// sitelo.config.js
export default {
  devToolbar: false, // hide for everyone on this project
}`,
        'javascript',
      ),
      h2('Vite options'),
      p(
        'Anything under ',
        code('vite'),
        ' is merged into Vite’s config. CLI flags (e.g. ',
        code('--port'),
        ') override both.',
      ),
      h2('Existing vite.config.js'),
      p('Still supported — either Vite-only options, or full plugin control:'),
      codeBlock('vite.config.js', viteOnlySnippet, 'javascript'),
      codeBlock('vite.config.js', vitePluginSnippet, 'javascript'),
      p(
        'If the plugin is already in your Vite config, put plugin options there — not also as plugin options in ',
        code('sitelo.config.js'),
        ' (sitelo will error).',
      ),
      h2('Sitemap & RSS'),
      p('Set ', code('site'), ' to emit ', code('dist/sitemap.xml'), '.'),
      p('RSS:'),
      codeBlock('sitelo.config.js', rssSnippet, 'javascript'),
      p(
        'Produces ',
        code('dist/rss.xml'),
        ' with an item for every page under ',
        code('routePrefix'),
        '.',
      ),
      h2('Pagefind search'),
      p(
        'Opt-in static search powered by ',
        a({ href: 'https://pagefind.app', rel: 'noopener' }, 'Pagefind'),
        '. Enable it, mark the content to index, mount the UI, then ',
        code('sitelo build'),
        '.',
      ),
      h3('1. Enable indexing'),
      p(
        'Set ',
        code('pagefind: true'),
        '. After ',
        code('sitelo build'),
        ' you get ',
        code('dist/pagefind/'),
        ', and by default a copy in ',
        code('public/pagefind/'),
        ' so the next ',
        code('sitelo'),
        ' (dev) or ',
        code('sitelo preview'),
        ' can serve ',
        code('/pagefind/'),
        ' without rebuilding.',
      ),
      codeBlock('sitelo.config.js', pagefindSnippet, 'javascript'),
      h3('2. Mark content and add a mount point'),
      p(
        'Put ',
        code('data-pagefind-body'),
        ' on the main content so nav/footer aren’t indexed. Leave an empty element for the search UI:',
      ),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: pagefindPageTemplate,
        ht: pagefindPageHt,
        jsx: pagefindPageJsx,
      }),
      h3('3. Mount the Pagefind UI'),
      p(
        'Load ',
        code('/pagefind/pagefind-ui.js'),
        ' and ',
        code('pagefind-ui.css'),
        ' from your client script (only after a build has produced the index):',
      ),
      codeBlock('src/main.js', pagefindMainSnippet, 'javascript'),
      h3('4. Build and ignore the synced bundle'),
      codeBlock(
        'shell',
        `sitelo build
# then: sitelo preview — or sitelo (dev) using public/pagefind`,
        'bash',
      ),
      codeBlock('.gitignore', pagefindGitignoreSnippet, 'bash'),
      p(
        'Advanced options (',
        code('syncPublic'),
        ', ',
        code('glob'),
        ', language, selectors, …) go on an object: ',
        code('pagefind: { syncPublic: false, glob: \'**/*.html\' }'),
        '. Full UI options: ',
        a({ href: 'https://pagefind.app', rel: 'noopener' }, 'pagefind.app'),
        '.',
      ),
      h3('404'),
      p(
        'Create ',
        code('src/404.ht.js'),
        ' for ',
        code('dist/404.html'),
        '. Otherwise a clean default is generated.',
      ),
    ],
  })
