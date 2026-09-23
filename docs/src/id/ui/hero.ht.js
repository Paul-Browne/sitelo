import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/id.js'

export default () =>
  uiLayout({
    title: 'Hero',
    description:
      'Bagian atas halaman pendaratan: sebuah tajuk, satu kalimat, dan apa yang harus dilakukan setelahnya.',
    activeHref: '/id/ui/hero',
    children: [
      p(
        'Hero adalah hal pertama di halaman beranda pemasaran atau dokumentasi. Ia merender sebuah ',
        code('<section>'),
        ' dengan ',
        code('<h1>'),
        ' di dalamnya — jadi ia adalah judul halamannya, bukan spanduk hiasan yang kebetulan besar.',
      ),

      h2('Hero dasar'),
      demo(`hero({
  level: 2,
  title: 'Situs statis, tanpa framework',
  description: 'Tulis fungsi yang mengembalikan HTML. Dapatkan situs yang lengkap.',
},
  button({ size: 'lg' }, 'Mulai'),
  button({ size: 'lg', variant: 'outline', color: 'neutral' }, 'Baca dokumentasi'),
)`, { align: 'stretch' }),

      h2('Dengan baris atas'),
      p('Satu baris pendek di atas judulnya — sebuah versi, kategori, atau pengumuman.'),
      demo(`hero({
  level: 2,
  eyebrow: 'sitelo 2.7',
  title: 'Kini dengan pustaka komponen',
  description: 'Tujuh puluh komponen, tanpa runtime, satu skrip opsional.',
},
  button({ size: 'lg', href: '/ui' }, 'Jelajahi komponennya'),
)`, { align: 'stretch' }),

      h2('Rata kiri'),
      demo(`hero({
  level: 2,
  align: 'start',
  eyebrow: 'Sumber terbuka',
  title: 'Dibangun secara terbuka',
  description: 'Berlisensi MIT, dan cukup kecil untuk dibaca dalam satu sore.',
},
  button({ href: 'https://github.com/paul-browne/sitelo' }, 'Lihat di GitHub'),
)`, { align: 'stretch' }),

      h2('Dengan media'),
      p(
        'Memberikan ',
        code('media'),
        ' membuatnya beralih ke dua kolom begitu ada ruang untuknya, dan kembali menumpuk menjadi satu di layar sempit. Ia berpasangan secara alami dengan ',
        code('mockup()'),
        '.',
      ),
      demo(`hero({
  level: 2,
  align: 'start',
  title: 'Lihat ia berjalan',
  description: 'Setiap halaman sudah menjadi HTML statis saat tiba di peramban.',
  media: mockup({ variant: 'browser', url: 'example.com' },
    div({ style: 'padding: 1.5rem; background: var(--su-surface-2)' },
      text({ variant: 'h5', as: 'div' }, 'Halo dunia'),
      text({ variant: 'small', tone: 'muted' }, 'Dirender saat build.'),
    ),
  ),
},
  button('Mulai'),
)`, { align: 'stretch' }),

      h2('Di dalam kontainer'),
      p(
        'Hero tidak punya batas lebarnya sendiri — taruh di dalam ',
        code('container()'),
        ' agar ia sejajar dengan semua yang lain di halamannya.',
      ),
      demo(`container({ size: 'md', style: 'background: var(--su-surface-2); border-radius: 0.6rem' },
  hero({
    level: 2,
    title: 'Terwadahi',
    description: 'Kontainer menyetel lebarnya; hero menyetel iramanya.',
  }),
)`, { align: 'stretch' }),

      h2('Tingkat judul'),
      p(
        'Judulnya adalah ',
        code('<h1>'),
        ' halaman secara bawaan, dan itu tepat untuk halaman pendaratan. Hero yang dipakai di tengah halaman bukanlah judul halamannya, jadi turunkan dengan ',
        code('level'),
        ' — setiap demo di halaman ini melakukannya, karena halaman ini sudah punya h1-nya sendiri.',
      ),

      h2('Hanya judul'),
      p('Setiap bagiannya opsional, dan tidak ada yang kosong yang dirender.'),
      demo(`hero({ level: 2, title: 'Dokumentasi' })`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['eyebrow', 'Child', '', 'Baris huruf kapital kecil di atas judulnya.'],
        ['title', 'Child', '', 'Dirender sebagai h1 halamannya.'],
        ['description', 'Child', '', 'Kalimat di bawahnya.'],
        ['media', 'Child', '', 'Di samping teksnya pada layar lebar, di atasnya pada layar sempit.'],
        ['align', "'center' | 'start'", "'center'", 'Perataan teks ketika tidak ada media.'],
        ['level', 'number', '1', 'Tingkat judul untuk judulnya. Turunkan untuk hero di tengah halaman.'],
        ['as', 'string', "'section'", 'Elemen yang dirender.'],
      ]),
      p('Anaknya menjadi baris tindakan di bawah deskripsinya.'),
    ],
  })
