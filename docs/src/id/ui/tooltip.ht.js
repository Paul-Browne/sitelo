import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/id.js'

export default () =>
  uiLayout({
    title: 'Tooltip',
    description:
      'Petunjuk singkat saat disorot dan difokus, digambar sepenuhnya dengan CSS.',
    activeHref: '/id/ui/tooltip',
    children: [
      p(
        'Teks tooltip-nya tinggal di sebuah atribut data dan digambar oleh pseudo-elemen, jadi tidak ada skrip, tidak ada yang perlu diposisikan saat jalan, dan tidak ada yang tertinggal di DOM. Ia muncul saat disorot dan saat mendapat fokus papan ketik, yang diurus oleh separuh ',
        code(':focus-within'),
        ' pada aturannya.',
      ),

      h2('Tooltip dasar'),
      demo(`stack({ direction: 'row', gap: 'md' },
  tooltip({ content: 'Salin ke papan klip' },
    iconButton({
      label: 'Salin',
      variant: 'soft',
      color: 'neutral',
      icon: icon('copy'),
    }),
  ),
  tooltip({ content: 'Bangun ulang situsnya' },
    button({ variant: 'outline', color: 'neutral' }, 'Bangun ulang'),
  ),
)`),

      h2('Penempatan'),
      p('Di atas secara bawaan, di bawah ketika tidak ada ruang di atasnya.'),
      demo(`stack({ direction: 'row', gap: 'lg' },
  tooltip({ content: 'Di atas pemicunya' },
    button({ variant: 'soft', color: 'neutral' }, 'Atas'),
  ),
  tooltip({ content: 'Di bawah pemicunya', placement: 'bottom' },
    button({ variant: 'soft', color: 'neutral' }, 'Bawah'),
  ),
)`),

      h2('Nama yang dapat diakses'),
      p(
        'Teks tooltip-nya adalah hiasan — ia digambar dari ',
        code('content'),
        ' CSS, yang tidak selalu diumumkan pembaca layar dengan andal. Kendali di dalamnya tetap butuh namanya sendiri yang dapat diakses, dan itulah yang disediakan ',
        code('label'),
        ' milik ',
        code('iconButton()'),
        '. Ketika tooltip-nya mengatakan sesuatu yang tidak dikatakan nama kendalinya, berikan ',
        code('label: true'),
        ' untuk mengulanginya dalam span yang tersembunyi secara visual.',
      ),
      demo(`stack({ direction: 'row', gap: 'lg' },
  tooltip({ content: 'Menerapkan ke produksi seketika', label: true },
    button({ color: 'danger' }, 'Terapkan'),
  ),
)`),

      h2('Pada teks'),
      p('Tooltip membungkus konten sebaris sama nyamannya seperti ia membungkus sebuah tombol.'),
      demo(`text(
  'Build menulis ke ',
  tooltip({ content: 'Bisa diatur dengan outDir' }, code('dist/')),
  ' dan tidak ke mana-mana lagi.',
)`, { align: 'stretch' }),

      h2('Kapan tidak memakainya'),
      p(
        'Tooltip tidak muncul pada sentuhan, dan ia lenyap begitu penunjuknya pergi. Apa pun yang wajib diterima pembaca — pesan galat, penjelasan bidang yang wajib diisi — seharusnya berada di teks ',
        code('help'),
        ' pada bidangnya sendiri, bukan di dalam tooltip.',
      ),

      h2('Props'),
      propsTable([
        ['content', 'string', '', 'Teks petunjuknya.'],
        ['placement', "'top' | 'bottom'", "'top'", 'Di sisi mana pemicunya ia muncul.'],
        ['label', 'boolean', 'false', 'Juga membuka teksnya kepada pembaca layar, dalam span tersembunyi.'],
      ]),
    ],
  })
