import { a, h2, h3, li, p, ul } from 'javascript-to-html'
import { code, codeBlock } from '../lib/code.js'
import { docsLayout } from '../lib/layout.js'

const configSnippet = `// sitelo.config.js
export default {
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

const viteOnlySnippet = `// vite.config.js — Vite options only; sitelo still injects the plugin
export default {
  publicDir: 'static',
  server: { port: 8888 },
}`

const vitePluginSnippet = `// vite.config.js — register the plugin yourself
import htmlPages from 'sitelo'

export default {
  plugins: [htmlPages({
    site: 'https://example.com',
  })],
}`

const rssSnippet = `// sitelo.config.js
export default {
  rss: {
    site: 'https://example.com',
    title: 'My Blog',
    description: 'Latest posts',
    routePrefix: '/blog',
  },
}`

const pagefindSnippet = `// sitelo.config.js
export default {
  pagefind: true,
  // or:
  // pagefind: {
  //   syncPublic: true, // default — copy dist/pagefind → public/pagefind
  //   glob: '**/*.html',
  // },
}`

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
          ' to hide the dev-only toolbar (route, source file, params, island count)',
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
        ' (dev) is running, a small bar at the bottom of each page shows the current route, page file, params, and how many ',
        a({ href: '/docs/islands' }, 'server islands'),
        ' are on the page. Use ',
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
        'Set ',
        code('pagefind: true'),
        ' and ',
        code('sitelo build'),
        ' indexes your HTML into ',
        code('dist/pagefind/'),
        '. By default the bundle is also synced to ',
        code('public/pagefind/'),
        ' so the next ',
        code('sitelo'),
        ' (dev) or ',
        code('sitelo preview'),
        ' can serve ',
        code('/pagefind/'),
        ' without rebuilding. Gitignore ',
        code('public/pagefind/'),
        '.',
      ),
      codeBlock('sitelo.config.js', pagefindSnippet, 'javascript'),
      p(
        'Mark searchable content with ',
        code('data-pagefind-body'),
        ' on your main element. Mount the UI yourself — Pagefind ships ',
        code('pagefind-ui.js'),
        ' and ',
        code('pagefind-ui.css'),
        ' under ',
        code('/pagefind/'),
        '. See ',
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
