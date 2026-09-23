import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/id.js'

export default () =>
  uiLayout({
    title: 'Tumpukan',
    description:
      'Baris atau kolom flex dengan token jarak untuk celahnya — primitif tata letak yang membangun sebagian besar halaman.',
    activeHref: '/id/ui/stack',
    children: [
      p(
        'Tumpukan menaruh jarak di antara hal-hal. Ia adalah wadah flex dengan satu tugas, dan ia adalah jawaban untuk sebagian besar pertanyaan “bagaimana saya memberi jarak pada ini” — tegak secara bawaan, mendatar dengan ',
        code("direction: 'row'"),
        '.',
      ),
      p(
        'Celahnya berasal dari skala jarak, jadi irama sebuah halaman tetap konsisten tanpa siapa pun memilih nilai piksel.',
      ),

      h2('Tumpukan dasar'),
      demo(`stack({ gap: 'md' },
  card(cardBody('Pertama')),
  card(cardBody('Kedua')),
  card(cardBody('Ketiga')),
)`, { align: 'stretch' }),

      h2('Arah'),
      demo(`stack({ direction: 'row', gap: 'md' },
  button('Satu'),
  button({ variant: 'outline' }, 'Dua'),
  button({ variant: 'outline' }, 'Tiga'),
)`),

      h2('Celah'),
      p(
        'Nama token (',
        code("'xs'"),
        ' … ',
        code("'3xl'"),
        '), jumlah satuan jarak, atau panjang CSS mentah.',
      ),
      demo(`stack({ gap: 'lg' },
  stack({ direction: 'row', gap: 'xs' }, chip('xs'), chip('xs'), chip('xs')),
  stack({ direction: 'row', gap: 'md' }, chip('md'), chip('md'), chip('md')),
  stack({ direction: 'row', gap: 6 }, chip('6 satuan'), chip('6 satuan')),
  stack({ direction: 'row', gap: '3rem' }, chip('3rem'), chip('3rem')),
)`, { align: 'stretch' }),

      h2('Perataan'),
      p(
        code('align'),
        ' dan ',
        code('justify'),
        ' menerima nilai flexbox mentah, jadi apa pun yang dipahami CSS akan bekerja.',
      ),
      demo(`stack({ gap: 'md' },
  stack({ direction: 'row', gap: 'sm', justify: 'space-between', style: 'background: var(--su-surface-2); padding: 0.6rem; border-radius: 0.5rem' },
    chip('awal'),
    chip('akhir'),
  ),
  stack({ direction: 'row', gap: 'sm', justify: 'center', align: 'center', style: 'background: var(--su-surface-2); padding: 0.6rem; border-radius: 0.5rem' },
    button({ size: 'sm' }, 'Terpusat'),
    chip('dan sejajar'),
  ),
)`, { align: 'stretch' }),

      h2('Pembungkusan'),
      p(
        'Sebaris chip atau tombol yang mungkin tidak muat butuh ',
        code('wrap'),
        ' — tanpa itu mereka terjepit alih-alih pindah ke baris berikutnya.',
      ),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  ...['routing', 'data', 'islands', 'images', 'pagefind', 'lighthouse', 'sitemap', 'rss'].map(
    (name) => chip({ color: 'neutral' }, name),
  ),
)`, { align: 'stretch' }),

      h2('Sebaris'),
      p(
        code('inline'),
        ' menjadikan tumpukannya sebuah ',
        code('inline-flex'),
        ', jadi ia duduk di dalam satu baris teks alih-alih mengambil lebar penuh.',
      ),
      demo(`text(
  'Dibangun dengan ',
  stack({ direction: 'row', gap: 'xs', inline: true, align: 'center' },
    chip({ color: 'primary', size: 'sm' }, 'sitelo'),
    chip({ color: 'neutral', size: 'sm' }, 'vite'),
  ),
  ' dan tidak ada lagi.',
)`, { align: 'stretch' }),

      h2('Sebagai elemen lain'),
      demo(`stack({ as: 'nav', direction: 'row', gap: 'sm' },
  navLink({ href: '/docs' }, 'Dokumentasi'),
  navLink({ href: '/ui', current: true }, 'UI'),
  navLink({ href: '/examples' }, 'Contoh'),
)`),

      h2('Props'),
      propsTable([
        ['direction', "'row' | 'column'", "'column'", 'Sumbu utamanya.'],
        ['gap', 'Space', "'md'", 'Jarak antaranak.'],
        ['align', 'string', "'stretch'", 'Nilai align-items apa pun.'],
        ['justify', 'string', "'flex-start'", 'Nilai justify-content apa pun.'],
        ['wrap', 'boolean | string', 'false', 'true berarti membungkus; sebuah string diteruskan sebagai flex-wrap.'],
        ['inline', 'boolean', 'false', 'Dirender sebagai inline-flex.'],
        ['as', 'string', "'div'", 'Elemen yang dirender, misalnya nav atau ul.'],
      ]),
    ],
  })
