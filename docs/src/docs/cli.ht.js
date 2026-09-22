import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock } from '../lib/code.js'
import { docsLayout } from '../lib/layout.js'
import { cliSnippets } from '../lib/snippets/cli.js'

const s = cliSnippets('en')

export default () =>
  docsLayout({
    title: 'CLI',
    description: 'sitelo dev, build, preview, and common flags.',
    activeHref: '/docs/cli',
    children: [
      p(
        'The ',
        code('sitelo'),
        ' CLI wraps the bundled Vite and auto-injects the HTML pages plugin.',
      ),
      h2('Commands'),
      codeBlock('shell', s.commands, 'bash'),
      ul(
        { class: 'docs-list' },
        li(code('dev'), ' — real SSR renders on request, including dynamic routes, plus a small dev toolbar'),
        li(code('build'), ' — static HTML in ', code('dist/'), ' (or your ', code('outDir'), ')'),
        li(code('preview'), ' — serve the production build locally'),
        li(
          code('lighthouse'),
          ' — audit the production build (needs the ',
          code('lighthouse'),
          ' peer dependency)',
        ),
      ),
      p(
        'Disable the toolbar with ',
        code('devToolbar: false'),
        ' in ',
        code('sitelo.config.js'),
        ' — see ',
        a({ href: '/docs/configuration' }, 'Configuration'),
        '.',
      ),
      h2('Useful flags'),
      codeBlock('shell', s.flags, 'bash'),
      ul(
        { class: 'docs-list' },
        li(code('--port'), ' / ', code('--host'), ' / ', code('--open'), ' — server'),
        li(code('--outDir'), ' / ', code('--emptyOutDir'), ' / ', code('--base'), ' — build'),
        li(code('--root'), ' — project root (handy for a ', code('docs/'), ' site)'),
        li(code('--config'), ' — custom Vite config file'),
        li(code('--mode'), ' / ', code('--logLevel'), ' / ', code('--debug')),
      ),
      p(
        'Prefer Vite options in ',
        code('sitelo.config.js'),
        ' under ',
        code('vite'),
        ' for anything you reuse across commands.',
      ),
      h2('Finding unused code'),
      p(
        a({ href: 'https://knip.dev' }, 'knip'),
        ' finds files, exports and dependencies nothing uses. On a sitelo project it needs one hint: pages and islands are discovered from the filesystem, so nothing imports them, and without being told otherwise knip reports the whole site as unused files.',
      ),
      codeBlock('shell', s.knipInstall, 'bash'),
      codeBlock('knip.js', s.knip, 'javascript'),
      codeBlock('shell', s.knipRun, 'bash'),
      p(
        code('knipConfig()'),
        ' reads your ',
        code('sitelo.config.js'),
        ' and marks the pages and islands as entry points the same way the build discovers them — ',
        code('pagesDir'),
        ', ',
        code('pageExtensions'),
        ', ',
        code('include'),
        ' and ',
        code('exclude'),
        ' all apply. What is left in the report is code the site genuinely never reaches.',
      ),
      p(
        'One thing it cannot see: a client script a page references by URL rather than import, like ',
        code('<script src="/js/app.js">'),
        '. List those yourself, and pass anything else knip accepts alongside — it is spread into the result. The trailing ',
        code('!'),
        ' is knip’s marker for production code, which is what a script shipped to the browser is.',
      ),
      codeBlock('knip.js', s.knipEntry, 'javascript'),
    ],
  })
