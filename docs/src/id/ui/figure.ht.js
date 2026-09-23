import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/id.js'

export default () =>
  uiLayout({
    title: 'Gambar',
    description:
      'Sebuah gambar dan keterangannya, sebagai satu kesatuan — dengan ruangnya sudah ditahan sebelum gambarnya tiba.',
    activeHref: '/id/ui/figure',
    children: [
      p(
        'Sebuah ',
        code('<figure>'),
        ' mengikat keterangan pada apa yang dijelaskannya, dan itu tidak dilakukan paragraf di bawah gambar. Berikan ',
        code('src'),
        ' untuk kasus yang lazim, atau anak untuk apa pun yang layak diberi keterangan.',
      ),

      h2('Gambar dasar'),
      demo(`figure({
  src: '/logo.svg',
  alt: 'Logotipe sitelo',
  caption: 'Logotipe itu, sebagaimana tampak di bilah atas.',
  style: '--su-figure-bg: var(--su-surface-2)',
})`, { align: 'stretch' }),

      h2('Dengan rasio yang ditahan'),
      p(
        code('ratio'),
        ' membungkus gambarnya dalam ',
        code('aspectRatio()'),
        ', jadi keterangannya tidak pernah melompat turun ketika gambarnya dimuat.',
      ),
      demo(`grid({ min: '13rem' },
  figure({ src: '/logo.svg', alt: '', ratio: '16 / 9', caption: 'ratio: 16 / 9' }),
  figure({ src: '/logo.svg', alt: '', ratio: '1 / 1', caption: 'ratio: 1 / 1' }),
)`, { align: 'stretch' }),

      h2('Memberi keterangan pada hal lain'),
      p('Tanpa ', code('src'), ', anaknya menjadi isi gambarnya.'),
      demo(`figure({ caption: 'Tabel 1 — keluaran dari build bawaan.' },
  table({
    dense: true,
    columns: [{ key: 'file', header: 'Berkas' }, { key: 'size', header: 'Ukuran', align: 'end' }],
    rows: [
      { file: 'index.html', size: '4,1 kB' },
      { file: '404.html', size: '860 B' },
      { file: 'sitemap.xml', size: '155 B' },
    ],
  }),
)`, { align: 'stretch' }),

      h2('Kode dengan keterangan'),
      p(
        'Perhatikan props ',
        code('text'),
        ' pada ',
        code('code()'),
        ': di pustaka ini anak dirender sebagai HTML di mana pun, jadi contoh yang berisi tag perlu dikaburkan atau peramban akan membangunnya alih-alih menampilkannya.',
      ),
      demo(`figure({ caption: 'Seluruh isi sebuah halaman sitelo.' },
  code({ text: 'export default () => "<h1>Halo</h1>"' }),
)`, { align: 'stretch' }),

      h2('Teks alt'),
      p(
        'Atribut ',
        code('alt'),
        ' selalu ditulis, kosong bila Anda tidak memberi apa-apa — gambar tanpa ',
        code('alt'),
        ' sama sekali akan diumumkan lewat nama berkasnya, yang lebih buruk daripada diam. Keterangan bukan penggantinya: keterangan dibaca semua orang, sedangkan alt menjelaskan gambarnya kepada orang yang tidak bisa melihatnya.',
      ),
      p(
        'Ketika keterangannya sudah mengatakan semua yang dikatakan gambarnya, ',
        code("alt: ''"),
        ' adalah jawaban yang benar.',
      ),

      h2('Di dalam prosa'),
      p(
        'Gambar yang keluar dari perender Markdown sudah ditata oleh ',
        code('prose()'),
        '. Komponen ini untuk gambar yang Anda bangun sendiri.',
      ),

      h2('Props'),
      propsTable([
        ['src', 'string', '', 'Sumber gambar. Lewati dan pakai anak sebagai gantinya.'],
        ['alt', 'string', "''", 'Teks alt. Selalu ditulis, bahkan ketika kosong.'],
        ['caption', 'Child', '', 'Elemen figcaption-nya.'],
        ['ratio', 'string', '', 'Menahan ruangnya sebelum gambarnya dimuat.'],
      ]),
    ],
  })
