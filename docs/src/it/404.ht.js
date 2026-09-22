import { a, p } from 'javascript-to-html'
import { code, pageLayout } from '../lib/it.js'

export default () =>
  pageLayout({
    title: '404 — pagina non trovata',
    description: 'Questa pagina non esiste.',
    children: [
      p(
        'Qui non c’è niente. Forse la pagina è stata spostata, o il link è vecchio. ',
        '(Questa pagina è ',
        code('src/it/404.ht.js'),
        ' — sitelo la produce come ',
        code('dist/it/404.html'),
        '.)',
      ),
      p(
        a({ href: '/it' }, 'Home'),
        ' · ',
        a({ href: '/it/docs' }, 'Documentazione'),
        ' · ',
        a({ href: '/it/examples' }, 'Esempi'),
      ),
    ],
  })
