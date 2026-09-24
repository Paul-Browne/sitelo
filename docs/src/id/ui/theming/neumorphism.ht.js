import { h2, p } from 'javascript-to-html'
import { code, codeBlock, presetPreview, presetPreviewHead, uiLayout } from '../../../lib/id.js'

export default () =>
  uiLayout({
    title: 'Neumorfisme',
    description:
      'Soft UI: setiap komponen terangkat dari halaman atau tertekan ke dalamnya, hanya dengan cahaya dan bayangan.',
    activeHref: '/id/ui/theming/neumorphism',
    extraHead: [presetPreviewHead('neumorphism')],
    children: [
      p(
        code('neumorphism'),
        ' adalah soft UI: setiap permukaan adalah halaman itu sendiri, dan sebuah kontrol menonjol hanya lewat cahaya dan bayangan — terangkat dari halaman, atau tertekan ke dalamnya. Preset ini mempertahankan dua hal yang biasanya dikorbankan gaya ini, teks yang lolos WCAG AA dan garis fokus, dan mengikuti mode gelap seperti bagian lainnya. Namun ia membutuhkan latar halaman itu sendiri berupa ',
        code('var(--su-bg)'),
        ', karena efeknya bergantung pada keduanya yang berwarna sama.',
      ),
      presetPreview('neumorphism'),

      h2('Cara memakai'),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('Situs saya'),
  styles({ preset: 'neumorphism' }),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">
// <link rel="stylesheet" href="/su/neumorphism-5d0e7b91.css">`, 'javascript'),
      codeBlock('src/styles.css', `body {
  background: var(--su-bg);
}`, 'css'),

      h2('Warna sendiri'),
      p(
        code('theme()'),
        ' tetap bekerja di atasnya, jadi preset adalah titik awal, bukan fork. Preset ini menambahkan slot kesepuluh ke setiap palet, ',
        code('glow'),
        ' — warna yang dituju ujung bilah kemajuan atau sakelar saat memudar — supaya warna primer yang baru bisa membawa miliknya sendiri.',
      ),
      codeBlock('src/index.ht.js', `head(
  styles({ preset: 'neumorphism' }),
  theme({
    primary: { base: '#7c3aed', hover: '#6d28d9', active: '#5b21b6', glow: '#e879f9' },
  }),
)`, 'javascript'),
    ],
  })
