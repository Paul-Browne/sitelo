import {
  a,
  div,
  h2,
  h3,
  li,
  p,
  table,
  tbody,
  td,
  th,
  thead,
  tr,
  ul,
} from 'javascript-to-html'
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

const linkCheckSnippet = `export default {
  linkCheck: true,   // 'warn' (default), 'error', or an options object
}`

const linkCheckOptionsSnippet = `export default {
  linkCheck: {
    mode: 'error',                    // fail the build on a dead link
    checkFragments: true,             // also verify #fragment targets
    exclude: ['/api/**', /^\\/legacy\\//],
  },
}`

const linkCheckOutput = `[sitelo] 3 broken internal links

  index.html
    ../escape           -> escapes the output directory
    /abuot              -> no such page
    /blog/missing-post  -> no such page`

const pagefindSnippet = `export default {
  pagefind: true,
}`

const installPagefindSnippet = `npm install -D pagefind`

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
          ' (requires ',
          code('npm install -D pagefind'),
          ')',
        ),
        li(
          code('images'),
          ' — ',
          code('true'),
          ' or options object; ',
          a({ href: '/docs/images' }, 'optimizes images'),
          ' in dev and after ',
          code('sitelo build'),
          ' (requires ',
          code('npm install -D sharp'),
          ')',
        ),
        li(code('missingAssets'), ' — ', code("'error'"), ' or ', code("'warn'")),
        li(
          code('linkCheck'),
          ' — dead internal links (see ',
          a({ href: '#link-checking' }, 'Link checking'),
          ')',
        ),
        li(code('generatedTypesDir'), ' — default ', code("'.sitelo/types'")),
        li(code('renderConcurrency'), ' / ', code('renderBatchSize'), ' — build parallelism'),
        li(
          code('buildReport'),
          ' — default ',
          code('true'),
          '; post-build summary of pages, output size, largest files and phase timings. ',
          code('false'),
          ' to disable, or ',
          code('{ top }'),
          ' to change how many large files are listed',
        ),
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
      h2('Link checking'),
      p(
        'Broken ',
        code('<script src>'),
        ' and stylesheet hrefs already fail the build (see ',
        code('missingAssets'),
        '). ',
        code('linkCheck'),
        ' covers the other half: internal ',
        code('<a href>'),
        ' links that point at a page which does not exist.',
      ),
      codeBlock('sitelo.config.js', linkCheckSnippet, 'javascript'),
      p(
        'After ',
        code('sitelo build'),
        ', every internal link in the output is resolved and anything with no page behind it is reported, grouped by the page it appears on:',
      ),
      codeBlock('output', linkCheckOutput, 'text'),
      h3('How links are resolved'),
      p(
        'The check runs against the emitted site, not the route table — so it accounts for ',
        code('cleanUrls'),
        ', route groups, ',
        code('mapOutputPath'),
        ', files copied from ',
        code('public/'),
        ', and pages produced by dynamic routes. It also runs after image optimization and Pagefind, so it sees exactly what ships. A link is valid when a real file answers it, tried in the order a static host would:',
      ),
      ul(
        { class: 'docs-list' },
        li(code('/about'), ' → ', code('about'), ', then ', code('about/index.html'), ', then ', code('about.html')),
        li(code('/blog/'), ' → ', code('blog/index.html'), ' (a trailing slash only ever means a directory index)'),
        li(code('/'), ' → ', code('index.html')),
      ),
      p(
        'Relative links (',
        code('../about'),
        ') resolve against the page holding them, and one that climbs out of the output directory is reported. Query strings are ignored for resolution — ',
        code('/about?utm=x'),
        ' checks ',
        code('/about'),
        '.',
      ),
      p(
        'External links are never fetched. ',
        code('https://'),
        ', protocol-relative ',
        code('//cdn.example.com'),
        ', ',
        code('mailto:'),
        ', ',
        code('tel:'),
        ' and other schemes are skipped entirely.',
      ),
      h3('Options'),
      div(
        { class: 'docs-table-scroll' },
        table(
          { class: 'docs-table docs-table--wrap-last' },
          thead(tr(th('Option'), th('Default'), th('Description'))),
          tbody(
            tr(
              td(code('mode')),
              td(code("'warn'")),
              td(
                code("'warn'"),
                ' logs and continues; ',
                code("'error'"),
                ' fails the build — useful in CI',
              ),
            ),
            tr(
              td(code('exclude')),
              td(code('[]')),
              td('Globs or regular expressions of hrefs to skip'),
            ),
            tr(
              td(code('checkFragments')),
              td(code('false')),
              td(
                'Also verify that ',
                code('#fragment'),
                ' targets exist in the linked page',
              ),
            ),
          ),
        ),
      ),
      codeBlock('sitelo.config.js', linkCheckOptionsSnippet, 'javascript'),
      p(
        code('checkFragments'),
        ' is off by default because ids added by client-side JavaScript are not in the built HTML, and would be reported as missing. Both ',
        code('id'),
        ' and legacy anchor ',
        code('name'),
        ' attributes count as fragment targets.',
      ),
      h3('Sites served from a base'),
      p(
        'If your site is deployed under a ',
        code('base'),
        ' (a GitHub Pages project site, say), a root-relative link that does not carry that base is reported. ',
        code('/about'),
        ' on a site served from ',
        code('/repo/'),
        ' sends the browser to the host root, not into your site — resolving it against the output anyway would hide exactly the mistake worth catching. Use ',
        code('exclude'),
        ' when it is deliberate.',
      ),
      h2('Pagefind search'),
      p(
        'Opt-in static search powered by ',
        a({ href: 'https://pagefind.app', rel: 'noopener' }, 'Pagefind'),
        ', an optional peer dependency. Install it when you want search, then enable indexing, mark the content, mount the UI, and run ',
        code('sitelo build'),
        '.',
      ),
      codeBlock('shell', installPagefindSnippet, 'bash'),
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
