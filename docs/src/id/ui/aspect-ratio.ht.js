import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/id.js'

export default () =>
  uiLayout({
    title: 'Rasio aspek',
    description:
      'Tahan sebuah kotak pada bentuk tetap, agar tidak ada yang bergeser di halaman ketika kontennya dimuat.',
    activeHref: '/id/ui/aspect-ratio',
    children: [
      p(
        'Tingginya sudah diketahui dari lebarnya sebelum apa pun dimuat, jadi gambar atau sematan yang datang terlambat tidak mendorong sisa halaman ke bawah. Anaknya mengisi kotak itu dan dipangkas alih-alih diberi bilah hitam.',
      ),

      h2('Rasio aspek dasar'),
      demo(`aspectRatio({ ratio: '16 / 9', style: 'background: var(--su-surface-2)' },
  '<img src="/logo.svg" alt="" style="object-fit: contain; padding: 2rem">',
)`, { align: 'stretch' }),

      h2('Rasio yang umum'),
      demo(`grid({ min: '9rem' },
  ...['16 / 9', '4 / 3', '1 / 1', '3 / 4'].map((ratio) =>
    stack({ gap: 'xs' },
      aspectRatio({ ratio, style: 'background: var(--su-surface-2); border-radius: 0.5rem' },
        '<img src="/logo.svg" alt="" style="object-fit: contain; padding: 1rem">'),
      text({ variant: 'caption', tone: 'muted', align: 'center' }, ratio),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Sematan'),
      p(
        'Alasan komponen ini ada: sebuah ',
        code('<iframe>'),
        ' tidak punya ukuran bawaan, jadi tanpa rasio ia mengempis atau butuh tinggi yang ditulis paksa.',
      ),
      demo(`aspectRatio({ ratio: '16 / 9', style: 'background: var(--su-surface-2); border-radius: 0.6rem' },
  '<div style="display: grid; place-items: center; color: var(--su-text-subtle)">sebuah &lt;iframe&gt; akan diletakkan di sini</div>',
)`, { align: 'stretch' }),

      h2('Di dalam kartu'),
      p(
        code('cardMedia()'),
        ' sudah melakukan ini untuk bagian atas kartu. Raih ',
        code('aspectRatio()'),
        ' ketika kotaknya berada di tempat lain.',
      ),
      demo(`grid({ min: '12rem' },
  card(
    cardMedia({ src: '/logo.svg', alt: '', style: 'background: var(--su-surface-2); object-fit: contain; padding: 1rem' }),
    cardBody(text({ variant: 'small' }, 'cardMedia — sudah tersedia')),
  ),
  card(
    cardBody(
      stack({ gap: 'sm' },
        aspectRatio({ ratio: '1 / 1', style: 'background: var(--su-surface-2); border-radius: 0.5rem' },
          '<img src="/logo.svg" alt="" style="object-fit: contain; padding: 1rem">'),
        text({ variant: 'small' }, 'aspectRatio — di tempat lain mana pun'),
      ),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Pemangkasan'),
      p(
        'Anaknya diregangkan untuk mengisi lalu dipangkas dengan ',
        code('object-fit: cover'),
        '. Untuk sesuatu yang tidak boleh dipangkas — logo, diagram — setel ',
        code('object-fit: contain'),
        ' pada anaknya, seperti yang dilakukan setiap demo di halaman ini.',
      ),

      h2('Props'),
      propsTable([
        ['ratio', 'string', "'16 / 9'", 'Nilai aspect-ratio CSS apa pun.'],
        ['as', 'string', "'div'", 'Elemen yang dirender.'],
      ]),
    ],
  })
