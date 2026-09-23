import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/id.js'

export default () =>
  uiLayout({
    title: 'Lencana',
    description:
      'Hitungan atau titik yang disematkan di sudut apa pun yang dibungkusnya.',
    activeHref: '/id/ui/badge',
    children: [
      p(
        'Lencana membungkus sesuatu dan menyematkan penanda di sudut atasnya: pesan belum dibaca pada tombol kotak masuk, titik daring pada avatar. Ia menerima benda yang ditandainya sebagai anak.',
      ),

      h2('Lencana dasar'),
      demo(`stack({ direction: 'row', gap: 'xl', align: 'center' },
  badge({ content: 4 }, button({ variant: 'soft', color: 'neutral' }, 'Kotak masuk')),
  badge({ content: 12 }, avatar({ name: 'Ada Lovelace' })),
)`),

      h2('Warna'),
      demo(`stack({ direction: 'row', gap: 'xl', align: 'center', wrap: true },
  badge({ content: 3, color: 'primary' }, button({ variant: 'soft', color: 'neutral' }, 'Primary')),
  badge({ content: 3, color: 'neutral' }, button({ variant: 'soft', color: 'neutral' }, 'Neutral')),
  badge({ content: 3, color: 'success' }, button({ variant: 'soft', color: 'neutral' }, 'Success')),
  badge({ content: 3, color: 'warning' }, button({ variant: 'soft', color: 'neutral' }, 'Warning')),
  badge({ content: 3, color: 'danger' }, button({ variant: 'soft', color: 'neutral' }, 'Danger')),
)`),

      h2('Maksimum'),
      p(
        'Hitungan di atas ',
        code('max'),
        ' dirender sebagai ',
        code('n+'),
        ', jadi lencana tidak pernah melebar sampai mengganggu keseimbangan benda yang ditumpanginya.',
      ),
      demo(`stack({ direction: 'row', gap: 'xl', align: 'center', wrap: true },
  badge({ content: 9 }, button({ variant: 'soft', color: 'neutral' }, 'Sembilan')),
  badge({ content: 250 }, button({ variant: 'soft', color: 'neutral' }, 'Dibatasi pada 99')),
  badge({ content: 250, max: 999 }, button({ variant: 'soft', color: 'neutral' }, 'max: 999')),
)`),

      h2('Titik'),
      p(
        'Titik mengatakan “ada yang berubah” tanpa menyebut seberapa banyak. Beri ia ',
        code('label'),
        ' — titik telanjang tidak berarti apa-apa bagi pembaca layar, jadi tanpa label ia disembunyikan sepenuhnya dari pohon aksesibilitas.',
      ),
      demo(`stack({ direction: 'row', gap: 'xl', align: 'center' },
  badge({ dot: true, color: 'success', label: 'Daring' }, avatar({ name: 'Ada Lovelace' })),
  badge({ dot: true, color: 'warning', label: 'Perlu perhatian' },
    iconButton({
      label: 'Pengaturan',
      variant: 'soft',
      color: 'neutral',
      icon: icon('settings'),
    }),
  ),
)`),

      h2('Memberi label pada hitungan'),
      p(
        'Angka telanjang bersifat ambigu tanpa konteks. ',
        code('label'),
        ' menjadi nama lencana yang dapat diakses, jadi ia terbaca sebagai “4 pesan belum dibaca” alih-alih “4”.',
      ),
      demo(`badge({ content: 4, label: '4 pesan belum dibaca' },
  button({ variant: 'soft', color: 'neutral' }, 'Kotak masuk'),
)`),

      h2('Mengubah hitungannya'),
      p(
        'Hitungan adalah angka di halaman yang paling mungkin berubah selagi halamannya terbuka. ',
        code('setBadge()'),
        ' membatasinya ke ',
        code('max'),
        ' sebagaimana yang dilakukan server, menjaga teks yang diumumkan tetap menyertainya, dan menjatuhkan lencana yang dikosongkan dari pohon aksesibilitas — begitulah sebuah lencana menghilang.',
      ),
      p('Teks yang diumumkan adalah prosa situs Anda, jadi teruskan setiap kali lencananya punya satu:'),
      codeBlock('Di mana saja', `button({ onclick: "import('/su/badge.js').then(m=>m.set('inbox',0))" }, 'Tandai semua terbaca')`, 'javascript'),
      p('Atau dari modul Anda sendiri, ketika sudah ada yang berjalan:'),
      codeBlock('src/main.js', `import { setBadge } from 'sitelo/ui/client'

setBadge('inbox', 7, { label: '7 pesan belum dibaca' })`, 'javascript'),

      h2('Props'),
      propsTable([
        ['content', 'string | number', '', 'Apa yang ditampilkan lencananya. Diabaikan ketika dot disetel.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'danger'", 'Warna lencana.'],
        ['dot', 'boolean', 'false', 'Titik kecil alih-alih sebuah nilai.'],
        ['max', 'number', '99', 'Hitungan di atas ini dirender sebagai n+.'],
        ['label', 'string', '', 'Nama yang dapat diakses untuk lencananya sendiri.'],
      ]),
    ],
  })
