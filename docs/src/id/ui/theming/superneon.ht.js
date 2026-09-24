import { h2, p } from 'javascript-to-html'
import { code, codeBlock, presetPreview, presetPreviewHead, uiLayout } from '../../../lib/id.js'

export default () =>
  uiLayout({
    title: 'Superneon',
    description:
      'Ungu nyaris hitam, tepi setipis rambut, dan cahaya neon: tombol pil gelap dengan tepi yang menyala, dan judul yang disinari dari atas.',
    activeHref: '/id/ui/theming/superneon',
    extraHead: [presetPreviewHead('superneon')],
    children: [
      p(
        code('superneon'),
        ' adalah ungu nyaris hitam dengan tepi setipis rambut dan cahaya yang datang dari dalam. Tombol padat berupa pil gelap, bercahaya di sepanjang tepi dalamnya dan dilingkari gradasi yang berpendar melewati garis luarnya; judul besar memudar dari terang ke lavender, dan apa pun yang dipilih atau dinyalakan mendapat lingkaran cahaya. Pendaran itu selalu sekadar hiasan, jadi setiap label tetap berada di atas warna datar yang memenuhi WCAG AA. Mode gelap adalah tampilan aslinya; mode terang mempertahankan pil gelap dan pendarannya, lalu meletakkannya di halaman lavender pucat.',
      ),
      presetPreview('superneon'),

      h2('Cara memakai'),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('Situs saya'),
  styles({ preset: 'superneon' }),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">
// <link rel="stylesheet" href="/su/superneon-5b0e7d21.css">`, 'javascript'),
      p(
        'Cat halamannya dengan ',
        code('var(--su-sn-backdrop)'),
        ' untuk latar preset dengan cahaya ungu yang jatuh dari atas, atau cukup dengan ',
        code('var(--su-bg)'),
        '. Judul memakai Geist jika halaman memuatnya, dan fon sistem jika tidak — preset ini tidak mengunduh apa pun.',
      ),
      codeBlock('src/styles.css', `body {
  background: var(--su-sn-backdrop);
}`, 'css'),

      h2('Warna sendiri'),
      p(
        code('theme()'),
        ' tetap bekerja di atasnya, jadi preset adalah titik awal, bukan fork. Preset ini memberi setiap palet dua slot tambahan, ',
        code('glow'),
        ' dan ',
        code('glowEnd'),
        ': kedua ujung gradasi yang dipakai untuk menggambar tepi dan lingkaran cahayanya. Tak ada yang dibaca di atas pendaran, jadi keduanya boleh seterang yang Anda mau.',
      ),
      codeBlock('src/index.ht.js', `head(
  styles({ preset: 'superneon' }),
  theme({
    primary: { glow: '#00e5ff', glowEnd: '#7f6bff' },
  }),
)`, 'javascript'),
    ],
  })
