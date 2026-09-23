import { a, p } from 'javascript-to-html'
import { code, pageLayout } from '../lib/id.js'

export default () =>
  pageLayout({
    title: '404 — halaman tidak ditemukan',
    description: 'Halaman ini tidak ada.',
    children: [
      p(
        'Tidak ada apa-apa di sini. Halamannya mungkin sudah pindah, atau tautannya usang. ',
        '(Halaman ini adalah ',
        code('src/id/404.ht.js'),
        ' — sitelo menghasilkannya sebagai ',
        code('dist/id/404.html'),
        '.)',
      ),
      p(
        a({ href: '/id' }, 'Beranda'),
        ' · ',
        a({ href: '/id/docs' }, 'Dokumentasi'),
        ' · ',
        a({ href: '/id/examples' }, 'Contoh'),
      ),
    ],
  })
