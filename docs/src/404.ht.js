import { a, p, script } from 'javascript-to-html'
import { code } from './lib/code.js'
import { pageLayout } from './lib/layout.js'

/*
 * The site builds with `cleanUrls: false`, so GitHub Pages serves `/docs`
 * from `docs.html` with no redirect — but `/docs/` finds a directory with no
 * index.html and lands here. Send the trailing-slash form to the real page.
 * A path that is genuinely missing arrives here again without the slash and
 * stops, so this cannot loop.
 */
const trailingSlashRescue = `(function(){var p=location.pathname;if(p.length>1&&p.endsWith('/'))location.replace(p.slice(0,-1)+location.search+location.hash)})()`

export default () =>
  pageLayout({
    title: '404 — page not found',
    description: 'This page does not exist.',
    children: [
      script(trailingSlashRescue),
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
