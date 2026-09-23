import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/id.js'

export default () =>
  uiLayout({
    title: 'Dapat diciutkan',
    description:
      'Satu “tampilkan lebih banyak”, tanpa batas dan pengelompokan sebuah akordeon.',
    activeHref: '/id/ui/collapsible',
    children: [
      p(
        'Komponen ini adalah satu ',
        code('<details>'),
        ' — elemen yang sama dengan yang membangun akordeon, tanpa hiasannya. Pakai untuk satu detail opsional di tengah halaman; pakai ',
        code('accordion()'),
        ' ketika ada sekumpulan darinya.',
      ),
      p(
        'Ia tidak butuh skrip, dan karena kontennya tetap berada di dokumen, ia bisa ditemukan lewat pencarian dalam halaman milik peramban maupun oleh mesin pencari.',
      ),

      h2('Dasar'),
      demo(`collapsible({ trigger: 'Tampilkan konfigurasi yang dihasilkan' },
  text({ variant: 'small' }, 'Semua yang ditulis sitelo ketika Anda menjalankan build tanpa berkas konfigurasi sendiri.'),
)`, { align: 'stretch' }),

      h2('Terbuka secara bawaan'),
      demo(`collapsible({ trigger: 'Mengapa ini ada', open: true },
  text({ variant: 'small' }, 'Karena halaman yang menyembunyikan penjelasannya di balik satu klik adalah halaman yang tak dibaca siapa pun.'),
)`, { align: 'stretch' }),

      h2('Konten kaya'),
      demo(`collapsible({ trigger: 'Tampilkan keluaran lengkapnya' },
  stack({ gap: 'sm' },
    code('dist/index.html'),
    code('dist/404.html'),
    code('dist/sitemap.xml'),
  ),
)`, { align: 'stretch' }),

      h2('Di dalam hal lain'),
      p('Komponen ini duduk dengan nyaman di dalam kartu, peringatan, atau sel tabel.'),
      demo(`stack({ gap: 'md' },
  card(
    cardHeader({ title: 'Build gagal', subtitle: '2 tautan rusak' }),
    cardBody(
      collapsible({ trigger: 'Tampilkan tautan yang gagal' },
        list({ plain: true },
          listItem({ title: '/docs/old-routing', description: 'ditautkan dari /docs' }),
          listItem({ title: '/blog/draft', description: 'ditautkan dari /blog' }),
        ),
      ),
    ),
  ),
  alert({ color: 'warning', title: 'Halaman lambat' },
    stack({ gap: 'sm' },
      text({ variant: 'small' }, 'Satu halaman butuh lebih dari 500 ms untuk dirender.'),
      collapsible({ trigger: 'Tampilkan waktunya' },
        text({ variant: 'small' }, '/examples/wordpress — 512 ms'),
      ),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Pemicunya'),
      p(
        'Batasi pada teks dan ikon. Sebuah ',
        code('<summary>'),
        ' sudah interaktif, jadi tombol atau tautan di dalamnya menyarangkan dua kendali padahal hanya ada satu tindakan — aturan yang sama diikuti ',
        code('menu()'),
        '.',
      ),

      h2('Dapat diciutkan atau akordeon?'),
      p(
        'Satu pengungkap berdiri sendiri: ',
        code('collapsible()'),
        '. Sekumpulan darinya, bergaris dan dikelompokkan, dengan pilihan hanya satu terbuka pada satu waktu: ',
        code('accordion()'),
        '.',
      ),

      h2('Props'),
      propsTable([
        ['trigger', 'Child', '', 'Isi ringkasannya. Hanya teks dan ikon.'],
        ['open', 'boolean', 'false', 'Apakah ia mulai dalam keadaan terbentang.'],
      ]),
    ],
  })
