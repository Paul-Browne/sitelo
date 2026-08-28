import { a, p } from 'javascript-to-html'
import { code, pageLayout } from '../lib/fr.js'

export default () =>
  pageLayout({
    title: '404 — page introuvable',
    description: 'Cette page n’existe pas.',
    children: [
      p(
        'Rien ici. La page a peut-être été déplacée, ou le lien est périmé. ',
        '(Cette page est ',
        code('src/fr/404.ht.js'),
        ' — sitelo l’émet comme ',
        code('dist/fr/404.html'),
        '.)',
      ),
      p(
        a({ href: '/fr' }, 'Accueil'),
        ' · ',
        a({ href: '/fr/docs' }, 'Docs'),
        ' · ',
        a({ href: '/examples' }, 'Exemples'),
      ),
    ],
  })
