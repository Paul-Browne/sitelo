import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/id.js'

export default () =>
  uiLayout({
    title: 'Kerangka',
    description:
      'Penampung berbentuk konten yang belum tiba.',
    activeHref: '/id/ui/skeleton',
    children: [
      p(
        'Kerangka menggantikan konten selagi ia dimuat. Di situs statis, itu lebih jarang dibutuhkan daripada di aplikasi — HTML-nya sudah ada di sana — tetapi biasanya itulah yang seharusnya menjadi ',
        code('fallback'),
        ' sebuah island, dan yang ditampilkan wilayah yang dirender di klien sebelum datanya mendarat.',
      ),
      p(
        'Kerangka bersifat hiasan: masing-masing ber-',
        code('aria-hidden'),
        ', jadi pembaca layar tidak dibacakan daftar kotak kosong.',
      ),

      h2('Bentuk'),
      demo(`stack({ gap: 'md' },
  skeleton({ height: '2.5rem' }),
  skeleton({ variant: 'text', width: '70%' }),
  skeleton({ variant: 'circle', width: '3rem', height: '3rem' }),
)`, { align: 'stretch' }),

      h2('Teks'),
      p(
        code('lines'),
        ' merender sebanyak satu paragraf, dengan baris terakhir yang pendek agar terbaca seperti prosa alih-alih sebuah blok.',
      ),
      demo(`stack({ gap: 'lg' },
  skeleton({ lines: 2 }),
  skeleton({ lines: 4 }),
)`, { align: 'stretch' }),

      h2('Berbentuk seperti aslinya'),
      p(
        'Kerangka paling meyakinkan ketika ia cocok dengan tata letak yang digantikannya — kartu yang sama, baris yang sama, ukuran yang sama.',
      ),
      demo(`grid({ min: '14rem' },
  card(
    cardBody(
      stack({ gap: 'md' },
        stack({ direction: 'row', gap: 'sm', align: 'center' },
          skeleton({ variant: 'circle', width: '2.5rem', height: '2.5rem' }),
          stack({ gap: 'xs', style: 'flex: 1' },
            skeleton({ variant: 'text', width: '60%' }),
            skeleton({ variant: 'text', width: '40%' }),
          ),
        ),
        skeleton({ lines: 3 }),
      ),
    ),
  ),
  card(
    cardBody(
      stack({ direction: 'row', gap: 'sm', align: 'center' },
        avatar({ name: 'Ada Lovelace' }),
        stack({ gap: 'none' },
          text({ variant: 'small' }, 'Ada Lovelace'),
          text({ variant: 'caption', tone: 'muted' }, 'Mengirim 3 commit'),
        ),
      ),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Sebagai cadangan island'),
      p(
        'Island server mengirim cadangannya di dalam HTML statis lalu menukar masuk fragmen hasil render saat permintaan datang. Kerangka yang bentuknya sama dengan fragmennya menjaga halamannya agar tidak melompat ketika fragmen itu tiba.',
      ),
      demo(`card(
  cardHeader({ title: 'Komentar' }),
  cardBody(
    stack({ gap: 'md' },
      skeleton({ lines: 2 }),
      divider({ spacing: 'xs' }),
      skeleton({ lines: 2 }),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Gerak'),
      p(
        'Kilauannya berhenti bagi siapa pun yang meminta sistemnya mengurangi gerak — itu ditangani di lembar gayanya, tanpa props yang perlu disetel.',
      ),

      h2('Props'),
      propsTable([
        ['variant', "'rect' | 'text' | 'circle'", "'rect'", 'Bentuk penampungnya.'],
        ['width', 'string', '', 'Lebar CSS apa pun.'],
        ['height', 'string', '', 'Tinggi CSS apa pun.'],
        ['lines', 'number', '', 'Merender sebanyak ini baris teks, yang terakhir pendek.'],
      ]),
    ],
  })
