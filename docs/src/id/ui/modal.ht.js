import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/id.js'

export default () =>
  uiLayout({
    title: 'Modal',
    description:
      'Dialog yang dibangun di atas API popover — peramban menangani pembukaan, latar, klik di luar, dan Escape.',
    activeHref: '/id/ui/modal',
    children: [
      p(
        'Modal adalah elemen ',
        code('popover'),
        '. Tombol mana pun yang ',
        code('popovertarget'),
        '-nya cocok dengan ',
        code('id'),
        ' modalnya akan membukanya — tanpa skrip di mana pun, termasuk latar, penutupan ringan, Escape, dan penanganan fokus, yang semuanya dimiliki peramban.',
      ),
      p(
        'Itulah sebabnya ',
        code('id'),
        ' bersifat wajib dan komponennya melempar galat tanpa itu: id-nya adalah keseluruhan sambungannya.',
      ),

      h2('Modal dasar'),
      p('Setiap modal di halaman ini benar-benar terbuka — cobalah.'),
      demo(`fragment(
  button({ popovertarget: 'demo-basic' }, 'Buka modal'),
  modal({ id: 'demo-basic', title: 'Bangun ulang situsnya?' },
    'Ini menjalankan sitelo build dan menerbitkan ulang dist/.',
  ),
)`),

      h2('Dengan kaki'),
      p(
        'Tombol tutup adalah tombol mana pun yang menunjuk id yang sama dengan ',
        code('popovertargetaction="hide"'),
        '.',
      ),
      demo(`fragment(
  button({ color: 'danger', popovertarget: 'demo-confirm' }, 'Hapus halaman…'),
  modal({
    id: 'demo-confirm',
    title: 'Hapus halaman ini?',
    footer: stack({ direction: 'row', gap: 'sm' },
      button({
        variant: 'ghost',
        color: 'neutral',
        popovertarget: 'demo-confirm',
        popovertargetaction: 'hide',
      }, 'Batal'),
      button({ color: 'danger' }, 'Hapus'),
    ),
  }, 'Ini tidak bisa dibatalkan. HTML yang dihasilkan akan dihapus pada build berikutnya.'),
)`),

      h2('Ukuran'),
      demo(`fragment(
  stack({ direction: 'row', gap: 'sm', wrap: true },
    button({ variant: 'outline', color: 'neutral', popovertarget: 'demo-sm' }, 'Kecil'),
    button({ variant: 'outline', color: 'neutral', popovertarget: 'demo-md' }, 'Sedang'),
    button({ variant: 'outline', color: 'neutral', popovertarget: 'demo-lg' }, 'Besar'),
  ),
  modal({ id: 'demo-sm', size: 'sm', title: 'Kecil' }, 'size: sm — sekitar 24rem.'),
  modal({ id: 'demo-md', title: 'Sedang' }, 'Bawaannya — sekitar 32rem.'),
  modal({ id: 'demo-lg', size: 'lg', title: 'Besar' }, 'size: lg — sekitar 48rem.'),
)`),

      h2('Formulir di dalam modal'),
      demo(`fragment(
  button({ variant: 'soft', popovertarget: 'demo-form' }, 'Halaman baru…'),
  modal({
    id: 'demo-form',
    title: 'Halaman baru',
    footer: stack({ direction: 'row', gap: 'sm' },
      button({ variant: 'ghost', color: 'neutral', popovertarget: 'demo-form', popovertargetaction: 'hide' }, 'Batal'),
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
        ' membuang × di sudutnya. Escape dan klik di luar tetap menutupnya — popover tidak bisa dibuat benar-benar menghalangi, dan itu biasanya justru perilaku yang tepat.',
      ),
      demo(`fragment(
  button({ variant: 'outline', color: 'neutral', popovertarget: 'demo-bare' }, 'Tanpa tombol tutup'),
  modal({ id: 'demo-bare', title: 'Tekan Escape', closable: false },
    'Atau klik di mana saja di luar dialog ini.',
  ),
)`),

      h2('Konten panjang'),
      p('Badannya bergulir; kepala dan kakinya tetap di tempat.'),
      demo(`fragment(
  button({ variant: 'outline', color: 'neutral', popovertarget: 'demo-long' }, 'Modal panjang'),
  modal({
    id: 'demo-long',
    title: 'Catatan rilis',
    footer: button({ popovertarget: 'demo-long', popovertargetaction: 'hide' }, 'Tutup'),
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
        'Halaman di belakang modal yang terbuka tidak tergulir. Itulah satu-satunya hal yang diserahkan API popover kepada Anda, dan di sini ia dikerjakan dengan CSS — tanpa skrip, dan tanpa apa pun yang perlu diinisialisasi. Berikan ',
        code('lockScroll: false'),
        ' agar latarnya tergulir seperti biasa.',
      ),

      h2('Dukungan peramban'),
      p(
        'API popover tersedia di setiap peramban masa kini. Pada peramban yang terlalu tua untuk mengenalnya, modalnya dirender sebaris di dalam halaman alih-alih di atasnya — terlihat dan bisa dipakai, hanya saja tidak menumpang di atas. Tidak ada yang hilang.',
      ),

      h2('Props'),
      propsTable([
        ['id', 'string', '', 'Wajib. Apa yang ditunjuk popovertarget sebuah pemicu.'],
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
