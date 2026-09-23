import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/id.js'

export default () =>
  uiLayout({
    title: 'Kosong',
    description:
      'Seperti apa sebuah daftar sebelum ada isinya.',
    activeHref: '/id/ui/empty',
    children: [
      p(
        'Ruang kosong terbaca seperti kutu. Keadaan kosong menyatakan ruang mana yang kosong, mengapa, dan apa yang harus dilakukan berikutnya — dan inilah kasus yang paling mudah terlupakan, karena selama pengembangan datanya selalu ada.',
      ),

      h2('Keadaan kosong dasar'),
      demo(`empty({
  title: 'Belum ada pos',
  description: 'Tambahkan berkas Markdown ke src/posts dan ia akan muncul di sini.',
})`, { align: 'stretch' }),

      h2('Dengan ikon'),
      p(
        'Ikonnya adalah hiasan — ia ditandai ',
        code('aria-hidden'),
        ', karena judulnya sudah menyatakan apa yang terjadi.',
      ),
      demo(`empty({
  icon: icon('folder'),
  title: 'Tidak ada apa-apa di sini',
  description: 'Folder ini tidak berisi halaman.',
})`, { align: 'stretch' }),

      h2('Dengan tindakan'),
      p('Anaknya menjadi baris tindakan.'),
      demo(`empty({
  icon: icon('search'),
  title: 'Tidak ada hasil untuk “islands”',
  description: 'Periksa ejaannya, atau jelajahi dokumentasinya saja.',
},
  button({ href: '/docs' }, 'Jelajahi dokumentasi'),
  button({ variant: 'outline', color: 'neutral' }, 'Bersihkan pencarian'),
)`, { align: 'stretch' }),

      h2('Di dalam kartu'),
      demo(`card(
  cardHeader({ title: 'Penerapan' }),
  cardBody(
    empty({
      title: 'Belum ada penerapan',
      description: 'Kirim ke main dan build pertamanya akan muncul di sini.',
    }, button({ size: 'sm' }, 'Sambungkan repositori')),
  ),
)`, { align: 'stretch' }),

      h2('Menggantikan tabel'),
      p(
        'Tukar tabelnya dengan keadaan kosong alih-alih merender kepala tabel tanpa baris di bawahnya.',
      ),
      demo(`return (() => {
  const rows = []

  return card(
    cardHeader({ title: 'Riwayat build' }),
    rows.length
      ? table({ columns: [{ key: 'commit', header: 'Commit' }], rows })
      : cardBody(empty({
          title: 'Tidak ada build tercatat',
          description: 'Riwayat muncul di sini begitu situsnya diterapkan setidaknya sekali.',
        })),
  )
})()`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['icon', 'Child', '', 'Glif hiasan di atas judulnya; disembunyikan dari pembaca layar.'],
        ['title', 'Child', '', 'Apa yang kosong, dalam beberapa kata.'],
        ['description', 'Child', '', 'Mengapa ia kosong, atau apa yang harus dilakukan.'],
      ]),
      p('Anaknya dirender sebagai baris tindakan di bawah deskripsinya.'),
    ],
  })
