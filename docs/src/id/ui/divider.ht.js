import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/id.js'

export default () =>
  uiLayout({
    title: 'Pemisah',
    description:
      'Garis di antara bagian, dengan atau tanpa label di tengahnya.',
    activeHref: '/id/ui/divider',
    children: [
      p(
        'Pemisah memisahkan kelompok konten. Ia merender elemen ',
        code('role="separator"'),
        ' alih-alih ',
        code('<hr>'),
        ', karena sebuah label masuk ke dalamnya sementara ',
        code('<hr>'),
        ' tidak menerima anak.',
      ),

      h2('Pemisah dasar'),
      demo(`stack({ gap: 'none' },
  text({ tone: 'muted' }, 'Semua yang di atas.'),
  divider(),
  text({ tone: 'muted' }, 'Semua yang di bawah.'),
)`, { align: 'stretch' }),

      h2('Dengan label'),
      p('Anaknya menjadi label yang berada di tengah garis.'),
      demo(`stack({ gap: 'none' },
  button({ variant: 'outline', color: 'neutral', block: true }, 'Lanjutkan dengan GitHub'),
  divider('atau'),
  button({ block: true }, 'Lanjutkan dengan email'),
)`, { align: 'stretch' }),

      h2('Jarak'),
      p(
        code('spacing'),
        ' menyetel margin di atas dan di bawahnya, dari skala yang sama dengan yang dipakai segalanya.',
      ),
      demo(`stack({ gap: 'none' },
  text({ variant: 'small', tone: 'muted' }, 'Rapat'),
  divider({ spacing: 'xs' }),
  text({ variant: 'small', tone: 'muted' }, 'Bawaan'),
  divider(),
  text({ variant: 'small', tone: 'muted' }, 'Lapang'),
  divider({ spacing: 'xl' }),
  text({ variant: 'small', tone: 'muted' }, 'Akhir'),
)`, { align: 'stretch' }),

      h2('Tegak'),
      p(
        'Pemisah tegak butuh induk yang memberinya tinggi — baris flex yang itemnya meregang, dan itulah yang dilakukan ',
        code('stack()'),
        ' secara bawaan.',
      ),
      demo(`stack({ direction: 'row', gap: 'none', align: 'stretch' },
  text({ variant: 'small' }, '4,1 kB'),
  divider({ orientation: 'vertical' }),
  text({ variant: 'small' }, '12 halaman'),
  divider({ orientation: 'vertical' }),
  text({ variant: 'small' }, '0 island'),
)`),

      h2('Props'),
      propsTable([
        ['orientation', "'horizontal' | 'vertical'", "'horizontal'", 'Ke arah mana garisnya membentang.'],
        ['spacing', 'Space', "'md'", 'Margin di kedua sisi garis.'],
      ]),
    ],
  })
