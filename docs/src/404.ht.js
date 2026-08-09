import { a, p } from 'javascript-to-html'
import { code } from './lib/code.js'
import { pageLayout } from './lib/layout.js'

export default () =>
  pageLayout({
    title: '404 — page not found',
    description: 'This page does not exist.',
    children: [
      p(
        'Nothing here. The page may have moved, or the link is stale. ',
        '(This page is ',
        code('src/404.ht.js'),
        ' — sitelo emits it as ',
        code('dist/404.html'),
        '.)',
      ),
      p(
        a({ href: '/' }, 'Home'),
        ' · ',
        a({ href: '/docs' }, 'Docs'),
        ' · ',
        a({ href: '/examples' }, 'Examples'),
      ),
    ],
  })
