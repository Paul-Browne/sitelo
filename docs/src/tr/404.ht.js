import { a, p } from 'javascript-to-html'
import { code, pageLayout } from '../lib/tr.js'

export default () =>
  pageLayout({
    title: '404 — sayfa bulunamadı',
    description: 'Böyle bir sayfa yok.',
    children: [
      p(
        'Burada bir şey yok. Sayfa taşınmış ya da bağlantı eskimiş olabilir. ',
        '(Bu sayfa ',
        code('src/tr/404.ht.js'),
        ' — sitelo onu ',
        code('dist/tr/404.html'),
        ' olarak üretir.)',
      ),
      p(
        a({ href: '/tr' }, 'Ana sayfa'),
        ' · ',
        a({ href: '/tr/docs' }, 'Belgeler'),
        ' · ',
        a({ href: '/tr/examples' }, 'Örnekler'),
      ),
    ],
  })
