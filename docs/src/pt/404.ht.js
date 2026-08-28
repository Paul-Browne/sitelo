import { a, p } from 'javascript-to-html'
import { code, pageLayout } from '../lib/pt.js'

export default () =>
  pageLayout({
    title: '404 — página não encontrada',
    description: 'Esta página não existe.',
    children: [
      p(
        'Não há nada aqui. Talvez a página tenha mudado de sítio, ou a ligação esteja desatualizada. ',
        '(Esta página é ',
        code('src/pt/404.ht.js'),
        ' — o sitelo emite-a como ',
        code('dist/pt/404.html'),
        '.)',
      ),
      p(
        a({ href: '/pt' }, 'Início'),
        ' · ',
        a({ href: '/pt/docs' }, 'Docs'),
        ' · ',
        a({ href: '/pt/examples' }, 'Exemplos'),
      ),
    ],
  })
