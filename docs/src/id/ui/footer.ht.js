import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/id.js'

export default () =>
  uiLayout({
    title: 'Footer',
    description:
      'Bagian bawah situs: kolom-kolom tautan, dan satu baris di bawahnya.',
    activeHref: '/id/ui/footer',
    children: [
      p(
        'Footer adalah kisi kolom yang menyesuaikan diri, plus satu baris bawah opsional yang selalu membentang selebar penuh, berapa pun jumlah kolomnya.',
      ),
      p(
        'Ia diekspor sebagai ',
        code('footer'),
        ' sekaligus ',
        code('siteFooter'),
        ', karena ',
        code('footer'),
        ' juga merupakan elemen ',
        code('<footer>'),
        ' milik javascript-to-html dan mengimpor keduanya dengan satu nama adalah galat sintaks.',
      ),

      h2('Footer dasar'),
      demo(`footer(
  footerColumn({ title: 'Dokumentasi' },
    '<a href="/docs">Memulai</a>',
    '<a href="/docs/routing">Perutean</a>',
    '<a href="/docs/data">Memuat data</a>',
  ),
  footerColumn({ title: 'Komponen' },
    '<a href="/ui">Ringkasan</a>',
    '<a href="/ui/button">Tombol</a>',
    '<a href="/ui/card">Kartu</a>',
  ),
  footerColumn({ title: 'Proyek' },
    '<a href="https://github.com/paul-browne/sitelo">GitHub</a>',
    '<a href="https://www.npmjs.com/package/sitelo">npm</a>',
  ),
)`, { align: 'stretch' }),

      h2('Dengan baris bawah'),
      p(
        code('footerBottom()'),
        ' membentang di seluruh kolom, jadi ia tetap menjadi baris selebar penuh apa pun yang dilakukan kisi di atasnya.',
      ),
      demo(`footer(
  footerColumn({ title: 'Dokumentasi' }, '<a href="/docs">Panduan</a>', '<a href="/ui">Komponen</a>'),
  footerColumn({ title: 'Contoh' }, '<a href="/examples">Semua contoh</a>'),
  footerBottom(
    text({ variant: 'caption' }, '© 2026 Paul Browne · MIT'),
    stack({ direction: 'row', gap: 'sm' },
      chip({ size: 'sm', color: 'neutral' }, 'v2.7'),
      chip({ size: 'sm', color: 'success', dot: true }, 'Build lulus'),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Kolom merek'),
      p(
        'Sebuah kolom tidak harus berisi tautan. Apa pun yang Anda berikan sebagai anak ',
        code('footer()'),
        ' alih-alih anak sebuah kolom akan duduk di kisinya sebagai selnya sendiri.',
      ),
      demo(`footer(
  div(
    stack({ gap: 'sm' },
      text({ variant: 'h5', as: 'div' }, 'sitelo'),
      text({ variant: 'small', tone: 'muted' }, 'Pembuatan situs statis tanpa konfigurasi, ditenagai Vite.'),
    ),
  ),
  footerColumn({ title: 'Dokumentasi' }, '<a href="/docs">Panduan</a>', '<a href="/ui">Komponen</a>'),
  footerColumn({ title: 'Proyek' }, '<a href="#">GitHub</a>', '<a href="#">npm</a>'),
)`, { align: 'stretch' }),

      h2('Kolom tetap'),
      p(
        'Secara bawaan kolomnya menyesuaikan diri. ',
        code('columns'),
        ' menerima nilai ',
        code('grid-template-columns'),
        ' apa pun ketika Anda menginginkan bentuk tertentu — katakanlah satu kolom merek yang lebar dan dua kolom tautan yang sempit.',
      ),
      demo(`footer({ columns: '2fr 1fr 1fr' },
  div(text({ variant: 'small', tone: 'muted' }, 'Kolom pertama yang lebih lebar untuk mereknya dan satu kalimat tentangnya.')),
  footerColumn({ title: 'Dokumentasi' }, '<a href="/docs">Panduan</a>'),
  footerColumn({ title: 'Lainnya' }, '<a href="/examples">Contoh</a>'),
)`, { align: 'stretch' }),

      h2('Hanya baris bawah'),
      demo(`footer(
  footerBottom(text({ variant: 'caption' }, '© 2026 · Dibangun dengan sitelo')),
)`, { align: 'stretch' }),

      h2('Props'),
      p(code('footer()'), ':'),
      propsTable([
        ['columns', 'string', '', 'Nilai grid-template-columns. Menyesuaikan diri bila dilewati.'],
        ['as', 'string', "'footer'", 'Elemen yang dirender.'],
      ]),
      propsTable([
        ['footerColumn', 'title', '', 'Kolom berjudul; anaknya menjadi daftar tautan.'],
        ['footerBottom', '', '', 'Baris selebar penuh di bawah kolomnya.'],
      ], { headers: ['Bagian', 'Props', 'Bawaan', 'Deskripsi'] }),
    ],
  })
