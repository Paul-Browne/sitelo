import { h2, p } from 'javascript-to-html'
import { code, codeBlock, presetPreview, presetPreviewHead, uiLayout } from '../../../lib/id.js'

export default () =>
  uiLayout({
    title: 'Terminal',
    description:
      'Satu huruf monospace di atas latar biru dongker gelap, meniru Advent of Code: aksi dalam kurung siku, tautan hijau, dan cahaya pada yang menyala.',
    activeHref: '/id/ui/theming/terminal',
    extraHead: [presetPreviewHead('terminal')],
    children: [
      p(
        code('terminal'),
        ' adalah satu huruf monospace di atas latar biru dongker gelap, disusun seperti Advent of Code: teks abu-abu, tautan hijau yang makin terang saat ditunjuk, putih untuk yang penting, dan cahaya berwarna sendiri pada sedikit hal yang menyala. Sebuah aksi adalah kata dalam kurung siku, ',
        code('[Simpan]'),
        '; kotak centang berupa ',
        code('[ ]'),
        ' sampai menjadi ',
        code('[X]'),
        ', dan judul tingkat dua diapit garis seperti ',
        code('--- Judul ---'),
        '. Tidak ada yang membulat dan tidak ada yang melayang di atas bayangan lembut: tepi adalah garis, dan kartu yang terangkat diberi garis ganda. Mode gelap adalah tampilan aslinya; mode terang mempertahankan hurufnya, kurung sikunya, dan sudut tegaknya, lalu mencetaknya dengan biru dongker di atas kertas pucat, tanpa cahaya.',
      ),
      presetPreview('terminal'),

      h2('Cara memakai'),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('Situs saya'),
  styles({ preset: 'terminal' }),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">
// <link rel="stylesheet" href="/su/terminal-9590922b.css">`, 'javascript'),
      p(
        'Susun juga halamannya dengan ini — latarnya, abu-abunya, dan hurufnya — dan komponen akan duduk di atasnya seperti di atas. Preset memakai Source Code Pro bila halaman memuatnya, dan huruf monospace sistem bila tidak; preset tidak mengunduh apa pun.',
      ),
      codeBlock('src/styles.css', `body {
  background: var(--su-bg);
  color: var(--su-text);
  font-family: var(--su-font-mono);
}`, 'css'),

      h2('Warna sendiri'),
      p(
        code('theme()'),
        ' tetap bekerja di atasnya, jadi preset adalah titik awal, bukan fork. Cahaya digambar dengan warna teks tempatnya berada, jadi palet yang Anda ubah bercahaya dengan warna barunya — di sini warna utama menjadi kuning ambar, seperti terminal lama. Sukses adalah emas sebuah bintang, seperti cara situs acuannya menandai teka-teki yang terpecahkan; beri warna hijau dengan cara yang sama bila Anda lebih suka. Preset ini menambahkan dua token miliknya sendiri: ',
        code('--su-tm-bright'),
        ', putih untuk judul dan semua yang dipilih, dan ',
        code('--su-tm-glow'),
        ', bayangan yang dipakai hal yang menyala, yang bernilai ',
        code('none'),
        ' di mode terang.',
      ),
      codeBlock('src/index.ht.js', `head(
  styles({ preset: 'terminal' }),
  theme(
    { primary: { base: '#8a5200', hover: '#734400', active: '#5c3600', soft: '#f6e6cc', softFg: '#4d2e00' } },
    { dark: { primary: { base: '#ffb000', hover: '#ffd480', active: '#e69e00', soft: '#33260d', softFg: '#ffd480' } } },
  ),
)`, 'javascript'),
    ],
  })
