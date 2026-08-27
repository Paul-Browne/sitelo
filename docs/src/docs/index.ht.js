import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, pageCodeTabs } from '../lib/code.js'
import { docsLayout } from '../lib/layout.js'
import { gettingStartedSnippets } from '../lib/snippets/getting-started.js'

const s = gettingStartedSnippets('en')

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
      codeBlock('shell', s.install, 'bash'),
      p('Requires Node 20.19+ (or 22.12+). Vite is bundled — you do not install it separately.'),
      h2('Your first page'),
      p(
        'Create ',
        code('src/index.ht.js'),
        ' (or ',
        code('.ht.jsx'),
        '). ',
        a({ href: 'https://ht.js.org', rel: 'noopener' }, 'ht.js'),
        ' is recommended:',
      ),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.pageTemplate,
        ht: s.pageHt,
        jsx: s.pageJsx,
      }),
      h2('Run'),
      codeBlock('shell', s.run, 'bash'),
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
