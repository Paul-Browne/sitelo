import { h2, p } from 'javascript-to-html'
import { code, codeBlock, presetPreview, presetPreviewHead, uiLayout } from '../../../lib/id.js'

export default () =>
  uiLayout({
    title: 'Neobrutalisme',
    description:
      'Warna datar, garis tinta tebal, dan bayangan tegas: setiap komponen bergaris tepi, dan tenggelam ke bayangannya sendiri saat ditekan.',
    activeHref: '/id/ui/theming/neubrutalism',
    extraHead: [presetPreviewHead('neubrutalism')],
    children: [
      p(
        code('neubrutalism'),
        ' adalah warna datar dan tinta tebal: setiap permukaan bergaris tepi, dan apa pun yang menonjol dari halaman menjatuhkan bayangan tegas tanpa buram. Menekan sebuah kontrol mendorongnya masuk ke bayangannya sendiri, dan tombol alih yang menyala tetap di sana. Isian lembut berupa warna pastel cerah dengan teks gelap di atasnya, isian padat tetap cukup gelap untuk membawa label putih, dan di mode gelap tintanya berubah menjadi krem, karena bayangan hitam tak akan terlihat di halaman gelap.',
      ),
      presetPreview('neubrutalism'),

      h2('Cara memakai'),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('Situs saya'),
  styles({ preset: 'neubrutalism' }),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">
// <link rel="stylesheet" href="/su/neubrutalism-3f1a9c42.css">`, 'javascript'),
      p(
        'Cat juga halamannya dengan ',
        code('var(--su-bg)'),
        ', maka ia memakai warna krem dari preset, dan permukaan putih menonjol di atasnya.',
      ),
      codeBlock('src/styles.css', `body {
  background: var(--su-bg);
}`, 'css'),

      h2('Warna sendiri'),
      p(
        code('theme()'),
        ' tetap bekerja di atasnya, jadi preset adalah titik awal, bukan fork. Preset ini menambahkan dua token miliknya sendiri: ',
        code('--su-nb-ink'),
        ', warna yang dipakai untuk menggambar setiap garis dan bayangan, dan ',
        code('--su-nb-lift'),
        ', seberapa jauh kontrol yang menonjol berdiri dari halaman, dan dengan begitu seberapa jauh sebuah tekanan memindahkannya.',
      ),
      codeBlock('src/index.ht.js', `head(
  styles({ preset: 'neubrutalism' }),
  theme({
    primary: { base: '#c2185b', hover: '#a8144e', active: '#8e1042', soft: '#ffb3d0', softFg: '#5c0a2a' },
    '--su-nb-lift': '6px',
  }),
)`, 'javascript'),
    ],
  })
