import { h2, p } from 'javascript-to-html'
import { code, codeBlock, presetPreview, presetPreviewHead, uiLayout } from '../../../lib/id.js'

export default () =>
  uiLayout({
    title: 'Terminal',
    description:
      'Sebuah konsol sistem: satu fon monospace di atas hitam, panel bergaris tipis, label berhuruf kapital tebal, dan aksen sian dengan pilihan ditampilkan terbalik.',
    activeHref: '/id/ui/theming/terminal',
    extraHead: [presetPreviewHead('terminal')],
    children: [
      p(
        code('terminal'),
        ' adalah sebuah konsol sistem: satu fon monospace di atas latar hitam, panel bergaris tipis yang kepalanya dipisahkan garis, dan setiap label — tombol, label bidang, tab, kepala kolom — berhuruf kapital, kebanyakan tebal. Sian adalah aksennya: judul besar, judul panel, tombol padat, dan fokus. Sebuah pilihan — baris tabel di bawah penunjuk, segmen yang ditekan, tab pil yang dipilih, nomor halaman saat ini, butir menu di bawah penunjuk — dicetak terbalik, gelap di atas sian, seperti terminal menyorot satu baris. Palet sukses, peringatan, dan bahaya adalah warna statusnya, hijau, kuning, dan merah, dan tombol bergaris tepi atau tag digambar dengan warnanya, garis maupun tulisannya. Tidak ada yang membulat selain radio, dan tidak ada yang berbayang. Mode gelap adalah tampilan aslinya; mode terang mempertahankan setiap garis, setiap huruf kapital, dan setiap sudut tegak, lalu mencetaknya hitam di atas hampir putih.',
      ),
      presetPreview('terminal'),

      h2('Cara memakai'),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('Situs saya'),
  styles({ preset: 'terminal' }),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">
// <link rel="stylesheet" href="/su/terminal-06767808.css">`, 'javascript'),
      p(
        'Susun juga halamannya dengan ini — latarnya, warna teksnya, dan fonnya — dan komponen akan duduk di atasnya seperti di atas. Preset memakai JetBrains Mono, IBM Plex Mono, atau Source Code Pro bila halaman memuat salah satunya, dan fon monospace sistem bila tidak; preset tidak mengunduh apa pun.',
      ),
      codeBlock('src/styles.css', `body {
  background: var(--su-bg);
  color: var(--su-text);
  font-family: var(--su-font-mono);
}`, 'css'),

      h2('Warna sendiri'),
      p(
        code('theme()'),
        ' tetap bekerja di atasnya, jadi preset adalah titik awal, bukan fork — di sini aksennya menjadi kuning ambar fosfor, termasuk garis-garis yang menggambarnya. Preset ini menambahkan tiga token miliknya sendiri: ',
        code('--su-tm-tracking'),
        ', jarak antarhuruf kapital pada label; ',
        code('--su-tm-track'),
        ', alur tempat bilah kemajuan atau penggeser berjalan; dan ',
        code('--su-tm-field'),
        ', garis di sekeliling bidang, yang di mode gelap sama abu-abu samarnya dengan panel — naikkan bila ingin tepi bidang lebih menonjol.',
      ),
      codeBlock('src/index.ht.js', `head(
  styles({ preset: 'terminal' }),
  theme(
    {
      primary: {
        base: '#8a5200', hover: '#734400', active: '#5c3600',
        soft: '#f6e6cc', softHover: '#efd9b3', softFg: '#4d2e00',
        border: '#c9a066', ring: 'rgba(138, 82, 0, 0.3)',
      },
    },
    {
      dark: {
        primary: {
          base: '#ffb000', hover: '#ffd480', active: '#e69e00',
          soft: '#33260d', softHover: '#45330f', softFg: '#ffd480',
          border: '#d99600', ring: 'rgba(255, 176, 0, 0.4)',
        },
      },
    },
  ),
)`, 'javascript'),
    ],
  })
