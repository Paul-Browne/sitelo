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
          a({ href: '/examples/wordpress' }, 'WordPress'),
          ' — pull posts from the WordPress REST API with ',
          code('fetchWithCache'),
          ', list them, and generate static post pages.',
        ),
      ),
      h2('Coming soon'),
      ul(
        { class: 'docs-list' },
        li('Headless CMS / Contentful'),
        li('Markdown blog from the filesystem'),
      ),
    ],
  })
