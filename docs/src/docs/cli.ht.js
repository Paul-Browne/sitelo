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
    ],
  })
