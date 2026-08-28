import { a, p } from 'javascript-to-html'
import { code, pageLayout } from '../lib/es.js'

export default () =>
  pageLayout({
    title: '404 — página no encontrada',
    description: 'Esta página no existe.',
    children: [
      p(
        'Aquí no hay nada. Puede que la página se haya movido, o que el enlace esté obsoleto. ',
        '(Esta página es ',
        code('src/es/404.ht.js'),
        ' — sitelo la emite como ',
        code('dist/es/404.html'),
        '.)',
      ),
      p(
        a({ href: '/es' }, 'Inicio'),
        ' · ',
        a({ href: '/es/docs' }, 'Docs'),
        ' · ',
        a({ href: '/es/examples' }, 'Ejemplos'),
      ),
    ],
  })
