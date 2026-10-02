import { h2, p } from 'javascript-to-html'
import { code, codeBlock, presetPreview, presetPreviewHead, uiLayout } from '../../../lib/id.js'

export default () =>
  uiLayout({
    title: 'Terminal',
    description:
      'Sebuah konsol sistem: satu huruf monospace di atas hitam, panel bergaris tipis, label berhuruf kapital tebal, dan aksen sian dengan semua yang dipilih ditampilkan terbalik.',
    activeHref: '/id/ui/theming/terminal',
    extraHead: [presetPreviewHead('terminal')],
    children: [
      p(
        code('terminal'),
        ' adalah sebuah konsol sistem: satu huruf monospace di atas latar hitam, panel bergaris tipis yang kepalanya dipisahkan garis, dan setiap label — tombol, keterangan isian, tab, kepala kolom — berhuruf kapital tebal dengan jarak lebar. Sian adalah aksennya: judul, judul panel, tombol padat, fokus, dan semua yang dipilih, yang dicetak terbalik, gelap di atas sian, seperti terminal menyorot satu baris. Palet lainnya adalah warna statusnya, hijau, kuning, dan merah, dan tombol bergaris atau tag digambar dengan warnanya, garis maupun tulisannya. Tidak ada yang membulat dan tidak ada yang berbayang. Mode gelap adalah tampilan aslinya; mode terang mempertahankan setiap garis, setiap huruf kapital, dan setiap sudut tegak, lalu mencetaknya hitam di atas hampir putih.',
      ),
      presetPreview('terminal'),

      h2('Cara memakai'),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('Situs saya'),
  styles({ preset: 'terminal' }),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">
// <link rel="stylesheet" href="/su/terminal-176ac9d8.css">`, 'javascript'),
      p(
        'Susun juga halamannya dengan ini — latarnya, warna teksnya, dan hurufnya — dan komponen akan duduk di atasnya seperti di atas. Preset memakai JetBrains Mono, IBM Plex Mono, atau Source Code Pro bila halaman memuat salah satunya, dan huruf monospace sistem bila tidak; preset tidak mengunduh apa pun.',
      ),
      codeBlock('src/styles.css', `body {
  background: var(--su-bg);
  color: var(--su-text);
  font-family: var(--su-font-mono);
}`, 'css'),

      h2('Warna sendiri'),
      p(
        code('theme()'),
        ' tetap bekerja di atasnya, jadi preset adalah titik awal, bukan fork — di sini aksennya menjadi kuning ambar fosfor. Preset ini menambahkan dua token miliknya sendiri: ',
        code('--su-tm-tracking'),
        ', jarak huruf label berhuruf kapital, dan ',
        code('--su-tm-track'),
        ', alur tempat bilah kemajuan atau penggeser berjalan.',
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
