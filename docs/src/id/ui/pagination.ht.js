import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/id.js'

export default () =>
  uiLayout({
    title: 'Paginasi',
    description:
      'Halaman bernomor, dijendelakan di sekitar halaman saat ini, sebagai tautan sungguhan.',
    activeHref: '/id/ui/pagination',
    children: [
      p(
        code('href'),
        ' adalah fungsi dari nomor halaman ke URL, jadi paginasi bekerja untuk ',
        code('/blog/2'),
        ' maupun ',
        code('/blog?page=2'),
        '. Itu menjadikan tiap halaman tautan sungguhan — bisa dirayapi, bisa dibuka di tab baru, dan bekerja tanpa JavaScript, dan itulah yang diinginkan situs statis.',
      ),

      h2('Paginasi dasar'),
      demo(`pagination({ page: 1, count: 5, href: (page) => '#page-' + page })`),

      h2('Penjendelaan'),
      p(
        'Halaman pertama dan terakhir selalu ditampilkan, plus sebuah jendela di sekitar halaman saat ini, dengan elipsis di mana pun urutannya melompat.',
      ),
      demo(`stack({ gap: 'md' },
  pagination({ page: 1, count: 12, href: (page) => '#a-' + page }),
  pagination({ page: 6, count: 12, href: (page) => '#b-' + page }),
  pagination({ page: 12, count: 12, href: (page) => '#c-' + page }),
)`, { align: 'start' }),

      h2('Saudara'),
      p(
        code('siblings'),
        ' adalah berapa banyak halaman yang duduk di kedua sisi halaman saat ini.',
      ),
      demo(`stack({ gap: 'md' },
  pagination({ page: 6, count: 12, siblings: 0, href: (page) => '#d-' + page }),
  pagination({ page: 6, count: 12, siblings: 1, href: (page) => '#e-' + page }),
  pagination({ page: 6, count: 12, siblings: 3, href: (page) => '#f-' + page }),
)`, { align: 'start' }),

      h2('Ujung'),
      p(
        'Sebelumnya dinonaktifkan di halaman pertama dan berikutnya di halaman terakhir, jadi kendalinya tidak pernah menawarkan halaman yang tidak ada.',
      ),
      demo(`stack({ gap: 'md' },
  pagination({ page: 1, count: 3, href: (page) => '#g-' + page }),
  pagination({ page: 3, count: 3, href: (page) => '#h-' + page }),
  pagination({ page: 1, count: 1, href: (page) => '#i-' + page }),
)`, { align: 'start' }),

      h2('Warna dan label'),
      demo(`stack({ gap: 'md' },
  pagination({ page: 3, count: 6, color: 'neutral', href: (page) => '#j-' + page }),
  pagination({
    page: 3,
    count: 6,
    color: 'success',
    previousLabel: 'Lebih baru',
    nextLabel: 'Lebih lama',
    href: (page) => '#k-' + page,
  }),
)`, { align: 'start' }),

      h2('Tanpa href'),
      p(
        'Tanpa ',
        code('href'),
        ', angkanya dirender sebagai tombol yang membawa ',
        code('data-su-page'),
        ' — untuk halaman yang menyaring di tempat dengan skripnya sendiri. Pilih tautan bila bisa: mereka bertahan ketika JavaScript dimatikan.',
      ),
      demo(`pagination({ page: 2, count: 4 })`),

      h2('Di dalam blog'),
      p(
        'Bentuk yang lazim di situs statis: ',
        code('generateStaticParams'),
        ' menghasilkan satu halaman per potongan, dan ',
        code('href'),
        ' menunjuk ke sana.',
      ),
      demo(`return (() => {
  const posts = 47
  const perPage = 10
  const current = 3

  return stack({ gap: 'md', align: 'center' },
    text({ variant: 'small', tone: 'muted' },
      'Menampilkan ' + ((current - 1) * perPage + 1) + '–' + Math.min(current * perPage, posts) + ' dari ' + posts,
    ),
    pagination({
      page: current,
      count: Math.ceil(posts / perPage),
      href: (page) => page === 1 ? '#blog' : '#blog-' + page,
    }),
  )
})()`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['page', 'number', '1', 'Halaman saat ini. Dibatasi ke dalam rentangnya.'],
        ['count', 'number', '1', 'Berapa banyak halaman yang ada.'],
        ['href', '(page: number) => string', '', 'Nomor halaman ke URL. Tanpa itu, halamannya dirender sebagai tombol.'],
        ['siblings', 'number', '1', 'Halaman yang ditampilkan di kedua sisi halaman saat ini.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Warna halaman saat ini.'],
        ['label', 'string', "'Pagination'", 'Nama yang dapat diakses untuk markah nav-nya.'],
        ['previousLabel', 'Child', "'‹'", 'Isi kendali sebelumnya.'],
        ['nextLabel', 'Child', "'›'", 'Isi kendali berikutnya.'],
      ]),
    ],
  })
