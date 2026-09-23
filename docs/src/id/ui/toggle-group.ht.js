import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/id.js'

export default () =>
  uiLayout({
    title: 'Grup alih',
    description:
      'Kendali bersegmen: tombol alih yang disatukan, atau tautan yang tiap segmennya adalah halamannya sendiri.',
    activeHref: '/id/ui/toggle-group',
    children: [
      p(
        'Grup alih adalah sebaris pilihan yang terbaca sebagai satu kendali. Bangun dari ',
        code('items'),
        ', dan nyatakan mana yang nyala dengan ',
        code('value'),
        '.',
      ),

      h2('Grup dasar'),
      demo(`toggleGroup({
  label: 'Perataan teks',
  value: 'center',
  items: [
    { value: 'left', label: 'Kiri' },
    { value: 'center', label: 'Tengah' },
    { value: 'right', label: 'Kanan' },
  ],
})`),

      h2('String biasa'),
      demo(`toggleGroup({ label: 'Kerapatan', value: 'nyaman', items: ['rapat', 'nyaman', 'lapang'] })`),

      h2('Tautan'),
      p(
        'Inilah bentuk yang biasanya diinginkan situs statis: tiap segmen adalah sebuah halaman. Item dengan ',
        code('href'),
        ' dirender sebagai jangkar dan yang aktif ditandai ',
        code('aria-current="page"'),
        ' — bukan ',
        code('aria-pressed'),
        ', karena tautan bukanlah tombol yang Anda tekan masuk.',
      ),
      demo(`toggleGroup({
  label: 'Bagian',
  value: 'ui',
  items: [
    { value: 'docs', label: 'Dokumentasi', href: '/docs' },
    { value: 'ui', label: 'UI', href: '/ui' },
    { value: 'examples', label: 'Contoh', href: '/examples' },
  ],
})`),

      h2('Lebih dari satu yang nyala'),
      p(
        'Berikan sebuah larik sebagai ',
        code('value'),
        '. Wadahnya tetap berupa ',
        code('group'),
        ' biasa — sebuah ',
        code('radiogroup'),
        ' akan salah, karena ini tombol yang ditekan, bukan radio.',
      ),
      demo(`toggleGroup({
  label: 'Pemformatan',
  value: ['bold', 'underline'],
  items: [
    { value: 'bold', label: 'Tebal' },
    { value: 'italic', label: 'Miring' },
    { value: 'underline', label: 'Bergaris bawah' },
  ],
})`),

      h2('Ukuran dan varian'),
      demo(`stack({ gap: 'md' },
  toggleGroup({ size: 'sm', label: 'Kecil', value: 'a', items: ['a', 'b', 'c'] }),
  toggleGroup({ size: 'md', label: 'Sedang', value: 'a', items: ['a', 'b', 'c'] }),
  toggleGroup({ size: 'lg', label: 'Besar', value: 'a', items: ['a', 'b', 'c'] }),
  toggleGroup({ variant: 'ghost', label: 'Ghost', value: 'b', items: ['a', 'b', 'c'] }),
)`, { align: 'start' }),

      h2('Item yang dinonaktifkan'),
      demo(`toggleGroup({
  label: 'Perender',
  value: 'static',
  items: [
    { value: 'static', label: 'Statis' },
    { value: 'islands', label: 'Island' },
    { value: 'ssr', label: 'SSR', disabled: true },
  ],
})`),

      h2('Di dalam bilah alat'),
      demo(`stack({ direction: 'row', gap: 'md', wrap: true, align: 'center' },
  toggleGroup({ label: 'Perataan', value: 'Kiri', size: 'sm', items: ['Kiri', 'Tengah', 'Kanan'] }),
  divider({ orientation: 'vertical' }),
  toggleGroup({ label: 'Gaya', value: ['Tebal'], size: 'sm', items: ['Tebal', 'Miring'] }),
)`),

      h2('Kapan memakai yang lain'),
      p(
        'Jika pilihannya dikirim bersama formulir, pakai ',
        code('choiceGroup()'),
        ' — radio sungguhan, tanpa skrip. Jika tiap segmennya adalah halaman, pilih bentuk tautan di atas. Grup alih dipakai untuk pilihan yang ditindaklanjuti halamannya sendiri.',
      ),

      h2('Props'),
      propsTable([
        ['items', 'Array', '[]', 'String, atau objek { value, label, href, disabled }.'],
        ['value', 'string | number | Array', '', 'Item mana yang nyala. Sebuah larik ketika beberapa bisa nyala.'],
        ['label', 'string', '', 'Nama yang dapat diakses untuk grupnya.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Diterapkan ke setiap item.'],
        ['variant', "'outline' | 'ghost' | 'soft'", "'outline'", 'Seperti apa rupa item yang mati.'],
      ]),
    ],
  })
