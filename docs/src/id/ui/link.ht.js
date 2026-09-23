import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/id.js'

export default () =>
  uiLayout({
    title: 'Tautan',
    description:
      'Jangkar bergaya, dengan atribut keamanan yang dibutuhkan tautan eksternal.',
    activeHref: '/id/ui/link',
    children: [
      p(
        'Tautan adalah jangkar dengan perlakuan garis bawah dan palet milik pustaka ini. Ia diekspor dengan dua nama — ',
        code('link'),
        ' dan ',
        code('textLink'),
        ' — karena ',
        code('link'),
        ' juga merupakan elemen ',
        code('<link>'),
        ' milik javascript-to-html, dan mengimpor keduanya dengan satu nama adalah galat sintaks. Pakai ',
        code('textLink'),
        ', atau impor pustakanya sebagai namespace.',
      ),

      h2('Tautan dasar'),
      demo(`text('Baca ', link({ href: '/docs' }, 'dokumentasinya'), ' untuk memulai.')`, {
        align: 'stretch',
      }),

      h2('Warna'),
      demo(`stack({ direction: 'row', gap: 'lg', wrap: true },
  link({ href: '#', color: 'primary' }, 'Primary'),
  link({ href: '#', color: 'neutral' }, 'Neutral'),
  link({ href: '#', color: 'success' }, 'Success'),
  link({ href: '#', color: 'warning' }, 'Warning'),
  link({ href: '#', color: 'danger' }, 'Danger'),
)`),

      h2('Halus'),
      p(
        'Tautan halus mewarisi warna di sekitarnya dan menampilkan garis bawahnya saat disorot — untuk daftar tautan yang garis bawah di setiap barisnya akan menjadi kebisingan.',
      ),
      demo(`stack({ gap: 'xs' },
  link({ href: '/docs/routing', subtle: true }, 'Perutean'),
  link({ href: '/docs/data', subtle: true }, 'Memuat data'),
  link({ href: '/docs/assets', subtle: true }, 'Aset dan gaya'),
)`, { align: 'stretch' }),

      h2('Tautan eksternal'),
      p(
        code('external'),
        ' menambahkan ',
        code('target="_blank"'),
        ' beserta ',
        code('rel'),
        ' yang harus menyertainya. Katakan di teks tautannya bahwa ia membuka tab baru, atau tambahkan catatan yang tersembunyi secara visual — tab baru tanpa peringatan membuat orang kehilangan arah.',
      ),
      demo(`text(
  'Pustakanya ada di ',
  link({ href: 'https://www.npmjs.com/package/sitelo', external: true },
    'npm',
    visuallyHidden(' (terbuka di tab baru)'),
  ),
  '.',
)`, { align: 'stretch' }),

      h2('Di dalam paragraf'),
      demo(`text({ variant: 'lead' },
  'sitelo dibangun di atas ',
  link({ href: 'https://vite.dev', external: true }, 'Vite'),
  ', merender dengan ',
  link({ href: 'https://ht.js.org', external: true }, 'javascript-to-html'),
  ', dan tidak mengirim apa pun ke peramban kecuali Anda memintanya.',
)`, { align: 'stretch' }),

      h2('Kapan memakai tombol sebagai gantinya'),
      p(
        'Tautan menavigasi; tombol melakukan tindakan. Jika sesuatu mengubah keadaan di halaman alih-alih membawa pembacanya ke tempat lain, ia seharusnya berupa ',
        code('button()'),
        ' — dan jika ia menavigasi tetapi harus tampak seperti tombol, beri ',
        code('button()'),
        ' sebuah ',
        code('href'),
        ', yang merender jangkar di baliknya.',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center', wrap: true },
  link({ href: '/docs' }, 'Tautan yang menavigasi'),
  button({ href: '/docs', variant: 'outline' }, 'Tautan yang tampak seperti tombol'),
  button({ variant: 'link' }, 'Tombol yang tampak seperti tautan'),
)`),

      h2('Props'),
      propsTable([
        ['href', 'string', '', 'Ke mana ia menuju.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Dari palet mana ia menimba.'],
        ['subtle', 'boolean', 'false', 'Mewarisi warna sekitarnya; garis bawah hanya saat disorot.'],
        ['external', 'boolean', 'false', 'Menambahkan target="_blank" dan rel="noopener noreferrer".'],
      ]),
    ],
  })
