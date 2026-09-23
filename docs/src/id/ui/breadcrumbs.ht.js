import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/id.js'

export default () =>
  uiLayout({
    title: 'Remah roti',
    description:
      'Jejak leluhur yang berakhir di halaman tempat Anda berada.',
    activeHref: '/id/ui/breadcrumbs',
    children: [
      p(
        'Remah roti menyatakan di mana sebuah halaman berada. Item terakhirnya adalah halaman saat ini: ia dirender sebagai teks biasa dan ditandai ',
        code('aria-current="page"'),
        ', karena tautan ke halaman yang sedang Anda buka hanyalah kebisingan.',
      ),

      h2('Remah roti dasar'),
      demo(`breadcrumbs({
  items: [
    { label: 'Beranda', href: '/' },
    { label: 'Dokumentasi', href: '/docs' },
    { label: 'Perutean' },
  ],
})`, { align: 'stretch' }),

      h2('Pemisah'),
      p('String atau markup apa pun. Pemisahnya tetap disembunyikan dari pembaca layar.'),
      demo(`stack({ gap: 'md' },
  breadcrumbs({
    separator: '/',
    items: [{ label: 'Beranda', href: '/' }, { label: 'UI', href: '/ui' }, { label: 'Remah roti' }],
  }),
  breadcrumbs({
    separator: '›',
    items: [{ label: 'Beranda', href: '/' }, { label: 'UI', href: '/ui' }, { label: 'Remah roti' }],
  }),
  breadcrumbs({
    separator: '·',
    items: [{ label: 'Beranda', href: '/' }, { label: 'UI', href: '/ui' }, { label: 'Remah roti' }],
  }),
)`, { align: 'stretch' }),

      h2('String biasa'),
      p('Item tanpa href hanyalah teks, di mana pun ia muncul — bukan hanya di bagian akhir.'),
      demo(`breadcrumbs({
  items: ['Beranda', 'Arsip', '2026', 'Maret'],
})`, { align: 'stretch' }),

      h2('Dari sebuah jalur'),
      p(
        'Di situs statis, jejaknya biasanya diturunkan dari rutenya, bukan ditulis tangan.',
      ),
      demo(`return (() => {
  const path = '/docs/guides/routing'
  const segments = path.split('/').filter(Boolean)

  return breadcrumbs({
    items: [
      { label: 'Beranda', href: '/' },
      ...segments.map((segment, index) => ({
        label: segment.replace(/-/g, ' '),
        href: index === segments.length - 1 ? undefined : '/' + segments.slice(0, index + 1).join('/'),
      })),
    ],
  })
})()`, { align: 'stretch' }),

      h2('Memberi label pada nav-nya'),
      p(
        'Keseluruhannya adalah sebuah ',
        code('<nav>'),
        ' dengan nama yang dapat diakses, sehingga pembaca layar bisa melompat ke sana. Ubah namanya dengan ',
        code('label'),
        ' ketika sebuah halaman punya lebih dari satu markah navigasi.',
      ),
      demo(`breadcrumbs({
  label: 'Remah roti dokumentasi',
  items: [{ label: 'Dokumentasi', href: '/docs' }, { label: 'Komponen' }],
})`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['items', 'Array', '[]', 'String, atau objek { label, href }. Yang terakhir adalah halaman saat ini.'],
        ['separator', 'Child', "'/'", 'Digambar di antara item, disembunyikan dari pembaca layar.'],
        ['label', 'string', "'Breadcrumb'", 'Nama yang dapat diakses untuk markah nav-nya.'],
      ]),
    ],
  })
