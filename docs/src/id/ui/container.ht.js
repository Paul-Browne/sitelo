import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/id.js'

export default () =>
  uiLayout({
    title: 'Kontainer',
    description:
      'Kolom terpusat dengan lebar terbatas — pembungkus terluar di sebagian besar halaman.',
    activeHref: '/id/ui/container',
    children: [
      p(
        'Kontainer memusatkan isinya, membatasi lebarnya agar baris teks tetap terbaca, dan menjaga celah tepi agar tidak ada yang menyentuh pinggir layar ponsel. Biasanya ia adalah hal pertama di dalam ',
        code('body()'),
        '.',
      ),

      h2('Kontainer dasar'),
      demo(`container(
  text({ variant: 'lead' }, 'Semua yang di dalamnya tetap terpusat dan berhenti membesar pada batas ukurannya.'),
)`, { align: 'stretch' }),

      h2('Ukuran'),
      p(
        'Lima langkah, dari satu kolom yang terbaca sampai tanpa batas sama sekali. ',
        code('sm'),
        ' sekitar 40rem — kira-kira lebar yang diinginkan prosa.',
      ),
      demo(`stack({ gap: 'sm' },
  container({ size: 'sm', style: 'background: var(--su-surface-2); padding-block: 0.75rem' },
    text({ variant: 'small', align: 'center' }, 'sm — 40rem'),
  ),
  container({ size: 'md', style: 'background: var(--su-surface-2); padding-block: 0.75rem' },
    text({ variant: 'small', align: 'center' }, 'md — 56rem'),
  ),
  container({ size: 'lg', style: 'background: var(--su-surface-2); padding-block: 0.75rem' },
    text({ variant: 'small', align: 'center' }, 'lg — 72rem (bawaan)'),
  ),
)`, { align: 'stretch' }),

      h2('Lebar khusus'),
      p(
        code('width'),
        ' menerima panjang CSS apa pun dan menimpa ',
        code('size'),
        ', untuk satu halaman yang butuh sesuatu yang tidak ada di skalanya.',
      ),
      demo(`container({ width: '30rem', style: 'background: var(--su-surface-2); padding-block: 0.75rem' },
  text({ variant: 'small', align: 'center' }, 'width: 30rem'),
)`, { align: 'stretch' }),

      h2('Celah tepi'),
      p(
        'Celah tepi adalah bantalan yang dijaga antara konten dan pinggir viewport. Ia menerima token jarak, jumlah satuan jarak, atau panjang mentah.',
      ),
      demo(`container({ size: 'sm', gutter: 'xl', style: 'background: var(--su-surface-2); padding-block: 0.75rem' },
  text({ variant: 'small' }, 'Celah tepi yang lebih lebar, untuk halaman yang kontennya tidak boleh sampai ke pinggir pada tablet.'),
)`, { align: 'stretch' }),

      h2('Sebagai elemen lain'),
      p(
        code('as'),
        ' mengubah tag-nya tanpa mengubah apa pun yang lain — berguna ketika kontainernya sekaligus menjadi ',
        code('<main>'),
        ' halamannya atau sebuah ',
        code('<section>'),
        '.',
      ),
      demo(`container({ as: 'main', size: 'md' },
  heading({ level: 2, size: 'h4' }, 'Sebuah elemen main'),
  text({ tone: 'muted' }, 'Tata letak sama, markah benar.'),
)`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['size', "'sm' | 'md' | 'lg' | 'xl' | 'full'", "'lg'", 'Batas lebar mana yang diterapkan.'],
        ['width', 'string', '', 'max-width mentah, menimpa size.'],
        ['gutter', 'Space', "'md'", 'Bantalan sebaris yang dijaga terhadap pinggir viewport.'],
        ['as', 'string', "'div'", 'Elemen yang dirender, misalnya main atau section.'],
      ]),
    ],
  })
