import { a, p } from 'javascript-to-html'
import { code, pageLayout } from '../lib/de.js'

export default () =>
  pageLayout({
    title: '404 — Seite nicht gefunden',
    description: 'Diese Seite existiert nicht.',
    children: [
      p(
        'Hier ist nichts. Vielleicht wurde die Seite verschoben, oder der Link ist veraltet. ',
        '(Diese Seite ist ',
        code('src/de/404.ht.js'),
        ' — sitelo gibt sie als ',
        code('dist/de/404.html'),
        ' aus.)',
      ),
      p(
        a({ href: '/de' }, 'Startseite'),
        ' · ',
        a({ href: '/de/docs' }, 'Docs'),
        ' · ',
        a({ href: '/examples' }, 'Beispiele'),
      ),
    ],
  })
