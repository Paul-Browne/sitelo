import { a, p } from 'javascript-to-html'
import { code, pageLayout } from '../lib/pl.js'

export default () =>
  pageLayout({
    title: '404 — nie znaleziono strony',
    description: 'Ta strona nie istnieje.',
    children: [
      p(
        'Nic tu nie ma. Strona mogła zostać przeniesiona albo odnośnik jest nieaktualny. ',
        '(Ta strona to ',
        code('src/pl/404.ht.js'),
        ' — sitelo zapisuje ją jako ',
        code('dist/pl/404.html'),
        '.)',
      ),
      p(
        a({ href: '/pl' }, 'Start'),
        ' · ',
        a({ href: '/pl/docs' }, 'Dokumentacja'),
        ' · ',
        a({ href: '/pl/examples' }, 'Przykłady'),
      ),
    ],
  })
