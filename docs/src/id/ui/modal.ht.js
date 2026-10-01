import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/id.js'

export default () =>
  uiLayout({
    title: 'Modal',
    description:
      '<dialog> sungguhan yang dibuka secara modal — peramban menangani latar, fokus, Escape, dan klik di luar.',
    activeHref: '/id/ui/modal',
    children: [
      p(
        'Modal adalah sebuah ',
        code('<dialog>'),
        '. Tombol mana pun dengan ',
        code('commandfor'),
        ' yang menunjuk ',
        code('id'),
        ' modalnya dan ',
        code("command: 'show-modal'"),
        ' akan membukanya secara modal: halaman di belakangnya menjadi inert, jadi fokus dan pembaca layar tetap di dalam. Tanpa skrip di mana pun — latar, Escape, dan klik di luar semuanya dimiliki peramban.',
      ),
      p(
        'Itulah sebabnya ',
        code('id'),
        ' bersifat wajib dan komponennya melempar galat tanpa itu: id-nya adalah keseluruhan sambungannya.',
      ),

      h2('Modal dasar'),
      p('Setiap modal di halaman ini benar-benar terbuka — cobalah.'),
      demo(`fragment(
  button({ commandfor: 'demo-basic', command: 'show-modal' }, 'Buka modal'),
  modal({ id: 'demo-basic', title: 'Bangun ulang situsnya?' },
    'Ini menjalankan sitelo build dan menerbitkan ulang dist/.',
  ),
)`),

      h2('Dengan kaki'),
      p(
        'Tombol tutup adalah tombol mana pun yang menunjuk id yang sama dengan ',
        code("command: 'close'"),
        '.',
      ),
      demo(`fragment(
  button({ color: 'danger', commandfor: 'demo-confirm', command: 'show-modal' }, 'Hapus halaman…'),
  modal({
    id: 'demo-confirm',
    title: 'Hapus halaman ini?',
    footer: stack({ direction: 'row', gap: 'sm' },
      button({
        variant: 'ghost',
        color: 'neutral',
        commandfor: 'demo-confirm',
        command: 'close',
      }, 'Batal'),
      button({ color: 'danger' }, 'Hapus'),
    ),
  }, 'Ini tidak bisa dibatalkan. HTML yang dihasilkan akan dihapus pada build berikutnya.'),
)`),

      h2('Ukuran'),
      demo(`fragment(
  stack({ direction: 'row', gap: 'sm', wrap: true },
    button({ variant: 'outline', color: 'neutral', commandfor: 'demo-sm', command: 'show-modal' }, 'Kecil'),
    button({ variant: 'outline', color: 'neutral', commandfor: 'demo-md', command: 'show-modal' }, 'Sedang'),
    button({ variant: 'outline', color: 'neutral', commandfor: 'demo-lg', command: 'show-modal' }, 'Besar'),
  ),
  modal({ id: 'demo-sm', size: 'sm', title: 'Kecil' }, 'size: sm — sekitar 24rem.'),
  modal({ id: 'demo-md', title: 'Sedang' }, 'Bawaannya — sekitar 32rem.'),
  modal({ id: 'demo-lg', size: 'lg', title: 'Besar' }, 'size: lg — sekitar 48rem.'),
)`),

      h2('Formulir di dalam modal'),
      demo(`fragment(
  button({ variant: 'soft', commandfor: 'demo-form', command: 'show-modal' }, 'Halaman baru…'),
  modal({
    id: 'demo-form',
    title: 'Halaman baru',
    footer: stack({ direction: 'row', gap: 'sm' },
      button({ variant: 'ghost', color: 'neutral', commandfor: 'demo-form', command: 'close' }, 'Batal'),
      button({ type: 'submit' }, 'Buat'),
    ),
  },
    stack({ gap: 'md' },
      textField({ label: 'Judul', name: 'modal-title', placeholder: 'Tentang' }),
      selectField({ label: 'Ekstensi', name: 'modal-ext', options: ['.ht.js', '.ht.ts', '.ht.jsx'] }),
    ),
  ),
)`),

      h2('Tanpa tombol tutup'),
      p(
        code('closable: false'),
        ' membuang × di sudutnya. Escape dan klik di luar tetap menutupnya; dengan ',
        code("closedby: 'closerequest'"),
        ' hanya Escape yang menutupnya.',
      ),
      demo(`fragment(
  button({ variant: 'outline', color: 'neutral', commandfor: 'demo-bare', command: 'show-modal' }, 'Tanpa tombol tutup'),
  modal({ id: 'demo-bare', title: 'Tekan Escape', closable: false },
    'Atau klik di mana saja di luar dialog ini.',
  ),
)`),

      h2('Konten panjang'),
      p('Badannya bergulir; kepala dan kakinya tetap di tempat.'),
      demo(`fragment(
  button({ variant: 'outline', color: 'neutral', commandfor: 'demo-long', command: 'show-modal' }, 'Modal panjang'),
  modal({
    id: 'demo-long',
    title: 'Catatan rilis',
    footer: button({ commandfor: 'demo-long', command: 'close' }, 'Tutup'),
  },
    stack({ gap: 'md' },
      ...Array.from({ length: 12 }, (unused, index) =>
        text({ variant: 'small', tone: 'muted' }, 'Perubahan ' + (index + 1) + ' — ada yang diperbaiki.'),
      ),
    ),
  ),
)`),

      h2('Penggulungan latar'),
      p(
        'Halaman di belakang modal yang terbuka tidak tergulir. Itulah satu-satunya hal yang diserahkan dialog modal kepada Anda, dan di sini ia dikerjakan dengan CSS — tanpa skrip, dan tanpa apa pun yang perlu diinisialisasi. Berikan ',
        code('lockScroll: false'),
        ' agar latarnya tergulir seperti biasa.',
      ),

      h2('Dukungan peramban'),
      p(
        'Membuka dialog lewat command sebuah tombol didukung setiap peramban masa kini — Chrome 135, Firefox 144, dan Safari 26.2 ke atas. Di peramban yang lebih tua, button() menambahkan onclick yang memuat beberapa ratus bita /su/dialog.js untuk melakukan hal yang sama — hanya di sana, dan hanya pada klik pertama. Safari belum menutup dialog saat diklik di luar (closedby), dan berkas yang sama menanganinya di sana.',
      ),

      h2('Props'),
      propsTable([
        ['id', 'string', '', 'Wajib. Apa yang ditunjuk commandfor sebuah pemicu.'],
        ['title', 'Child', '', 'Judul, sekaligus nama dialognya yang dapat diakses.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Lebar maksimum.'],
        ['footer', 'Child', '', 'Baris bawah, pada pita berwarnanya sendiri.'],
        ['closable', 'boolean', 'true', 'Menampilkan × di kepalanya.'],
        ['closeLabel', 'string', "'Close'", 'Nama yang dapat diakses untuk tombol itu.'],
        ['lockScroll', 'boolean', 'true', 'Menghentikan penggulungan halaman di belakangnya selagi ia terbuka.'],
      ]),
      p(
        code('closeButton({ target })'),
        ' merender × itu sendiri, untuk kepala yang Anda bangun sendiri.',
      ),
    ],
  })
