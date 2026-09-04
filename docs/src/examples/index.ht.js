import { a, h2, li, p, ul } from 'javascript-to-html'
import { code } from '../lib/code.js'
import { examplesLayout } from '../lib/layout.js'

export default () =>
  examplesLayout({
    title: 'Examples',
    description: 'Practical sitelo recipes — WordPress, APIs, and more.',
    activeHref: '/examples',
    children: [
      p(
        'Step-by-step recipes for building real sites with sitelo. Each example shows project structure, data loading, and the pages you’d write.',
      ),
      h2('Available'),
      ul(
        { class: 'docs-list' },
        li(
          a({ href: '/examples/basic' }, 'Basic site'),
          ' — minimal project plus static deploy configs for Netlify, Vercel, Cloudflare Pages, and AWS Amplify.',
        ),
        li(
          a({ href: '/examples/todo' }, 'Todo app'),
          ' — static HTML with inline ',
          code("import('/js/todo.js')"),
          ' handlers (add / toggle / delete, ',
          code('localStorage'),
          ').',
        ),
        li(
          a({ href: '/examples/blog' }, 'Markdown blog'),
          ' — a folder of ',
          code('.md'),
          ' files rendered to static pages, with an RSS feed and zero client JS.',
        ),
        li(
          a({ href: '/examples/json' }, 'Local JSON'),
          ' — a catalogue built from ',
          code('.json'),
          ' files in the repo: one page per file, no API and no database.',
        ),
        li(
          a({ href: '/examples/wordpress' }, 'WordPress'),
          ' — pull posts from the WordPress REST API with ',
          code('fetchWithCache'),
          ', list them, and generate static post pages.',
        ),
        li(
          a({ href: '/examples/islands' }, 'Server islands'),
          ' — static pages plus a Node host that renders islands at request time.',
        ),
      ),
      h2('Coming soon'),
      ul(
        { class: 'docs-list' },
        li('Headless CMS / Contentful'),
      ),
    ],
  })
