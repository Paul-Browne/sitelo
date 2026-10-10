import { h2, p } from 'javascript-to-html'
import { code, codeBlock, presetPreview, presetPreviewHead, uiLayout } from '../../../lib/id.js'

export default () =>
  uiLayout({
    title: 'Cetak biru',
    description:
      'Sebuah gambar teknik: garis tipis, sudut tajam dan tanda registrasi, label berhuruf kapital monospace, serta tinta dengan satu biru cetak biru.',
    activeHref: '/id/ui/theming/blueprint',
    extraHead: [presetPreviewHead('blueprint')],
    children: [
      p(
        code('blueprint'),
        ' adalah sebuah gambar teknik: garis tipis di atas lembar yang hampir hitam, sudut tajam, dan tanda registrasi — sebuah silang kecil — di setiap sudut kartu, dialog, dan deretan statistik. Semua yang menamai atau mengoperasikan sesuatu — tombol, label kolom isian, tab, tag, judul kolom, tautan di bilah — ditulis dengan fon monospace, dalam huruf kapital yang direnggangkan, sementara judul dan teks bacaan tetap memakai fon grotesk yang disusun rapat. Garis utuh adalah tepi dan garis putus-putus membagi apa yang ada di dalamnya, seperti gambar teknik menandai garis tersembunyi: baris tabel, pemisah, ruas menuju langkah yang belum tiba. Warnanya sedikit. Tombol solid, kotak yang dicentang, bilah yang terisi, dan apa pun yang dipilih adalah tinta, dicetak terbalik; satu biru cetak biru menandai fokus dan label di atas judul; sukses, peringatan, dan bahaya mempertahankan warnanya sendiri untuk apa yang mereka sampaikan. Tidak ada yang menjatuhkan bayangan. Mode gelap adalah tampilan aslinya; mode terang mempertahankan setiap garis dan tanda lalu mencetaknya dengan tinta di atas kertas putih.',
      ),
      presetPreview('blueprint'),

      h2('Cara memakai'),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('Situs saya'),
  styles({ preset: 'blueprint' }),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">
// <link rel="stylesheet" href="/su/blueprint-4d1f8a20.css">`, 'javascript'),
      p(
        'Warnai halaman dengan ',
        code('var(--su-bp-backdrop)'),
        ' untuk mendapatkan latar preset dengan kisi tipis tergaris di atasnya, atau cukup dengan ',
        code('var(--su-bg)'),
        '. Preset memakai Geist atau Inter, serta Geist Mono, JetBrains Mono, atau IBM Plex Mono, bila halaman memuatnya, dan fon sistem bila tidak; preset tidak mengunduh apa pun.',
      ),
      codeBlock('src/styles.css', `body {
  background: var(--su-bp-backdrop);
  color: var(--su-text);
  font-family: var(--su-font-sans);
}`, 'css'),

      h2('Warna sendiri'),
      p(
        code('theme()'),
        ' tetap bekerja di atasnya, jadi preset adalah titik awal, bukan fork. Palet primer adalah tintanya — tombol solid, kotak yang dicentang, bilah yang terisi, apa pun yang dipilih — jadi ',
        code('primary'),
        ' mewarnai ulang semuanya sekaligus. Sisanya token milik preset sendiri: ',
        code('--su-bp-accent'),
        ', biru yang menggambar fokus dan menandai judul; ',
        code('--su-bp-mark'),
        ', tanda registrasi, yang hilang dengan ',
        code('transparent'),
        '; ',
        code('--su-bp-field'),
        ', garis di sekeliling kolom isian; ',
        code('--su-bp-track'),
        ', alur tempat bilah progres berjalan; ',
        code('--su-bp-grid'),
        ' dan ',
        code('--su-bp-cell'),
        ', garis latar dan ukuran kotak-kotaknya; serta ',
        code('--su-bp-tracking'),
        ', jarak antarhuruf kapital pada label. Di sini birunya berubah menjadi oranye sinyal, dan tandanya ikut berubah.',
      ),
      codeBlock('src/index.ht.js', `head(
  styles({ preset: 'blueprint' }),
  theme(
    { bpAccent: '#c2410c', bpMark: '#c2410c' },
    { dark: { bpAccent: '#ff7a3d', bpMark: '#ff7a3d' } },
  ),
)`, 'javascript'),
    ],
  })
