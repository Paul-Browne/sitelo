import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/id.js'

export default () =>
  uiLayout({
    title: 'Bilah aplikasi',
    description:
      'Bilah di sepanjang bagian atas situs: merek di satu sisi, navigasi dan tindakan di sisi lain.',
    activeHref: '/id/ui/app-bar',
    children: [
      p(
        'Bilah aplikasi adalah sebuah ',
        code('<header>'),
        ' dengan satu baris di dalamnya. Bagian-bagiannya terpisah agar Anda bisa menatanya: ',
        code('appBarNav()'),
        ' untuk tautan, ',
        code('appBarSpacer()'),
        ' untuk mendorong apa pun setelahnya ke ujung terjauh, dan ',
        code('appBarActions()'),
        ' untuk tombol-tombol di ujungnya.',
      ),

      h2('Bilah aplikasi dasar'),
      demo(`appBar({ brand: 'sitelo' },
  appBarSpacer(),
  appBarActions(
    button({ size: 'sm', variant: 'soft' }, 'Masuk'),
  ),
)`, { align: 'stretch' }),

      h2('Dengan navigasi'),
      p(
        code('navLink()'),
        ' adalah gaya tautan untuk sebuah bilah; ',
        code('current'),
        ' menandai halaman aktif dengan ',
        code('aria-current'),
        ' selain dengan warna.',
      ),
      demo(`appBar({ brand: 'sitelo' },
  appBarNav(
    navLink({ href: '#docs', current: true }, 'Dokumentasi'),
    navLink({ href: '#ui' }, 'UI'),
    navLink({ href: '#examples' }, 'Contoh'),
  ),
  appBarSpacer(),
  appBarActions(
    button({ size: 'sm', variant: 'outline', color: 'neutral' }, 'GitHub'),
    button({ size: 'sm' }, 'Mulai'),
  ),
)`, { align: 'stretch' }),

      h2('Merek dengan tanda'),
      p(
        'Merek menerima markup apa pun, dan menaut ke ',
        code('/'),
        ' kecuali ',
        code('href'),
        ' menyatakan lain.',
      ),
      demo(`appBar({
  href: '#home',
  brand: stack({ direction: 'row', gap: 'sm', inline: true, align: 'center' },
    avatar({ name: 'S', size: 'sm', square: true, color: 'primary' }),
    'sitelo',
  ),
},
  appBarSpacer(),
  appBarActions(chip({ size: 'sm', color: 'neutral' }, 'v2.6.3')),
)`, { align: 'stretch' }),

      h2('Lengket dan buram'),
      p(
        code('sticky'),
        ' menyematkan bilahnya di bagian atas wadah gulir; ',
        code('blur'),
        ' membuatnya tembus cahaya sehingga konten lewat di bawahnya. Keduanya ditampilkan di sini dalam kotak bergulir, bukan di halaman itu sendiri.',
      ),
      demo(`div({ style: 'height: 12rem; overflow: auto; border: 1px solid var(--su-border); border-radius: 0.6rem' },
  appBar({ brand: 'sitelo', sticky: true, blur: true },
    appBarSpacer(),
    appBarActions(chip({ size: 'sm', color: 'primary' }, 'lengket')),
  ),
  container({ size: 'sm', style: 'padding-block: 1rem' },
    stack({ gap: 'md' },
      ...Array.from({ length: 6 }, (unused, index) =>
        text({ variant: 'small', tone: 'muted' }, 'Gulir saya — paragraf ' + (index + 1) + '.'),
      ),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Dengan laci di layar kecil'),
      p(
        'Pola yang lazim: tautan di bilah pada desktop, sebuah tombol yang membuka ',
        code('drawer()'),
        ' di ponsel. Lacinya adalah popover, jadi tombolnya tidak butuh skrip.',
      ),
      demo(`fragment(
  appBar({ brand: 'sitelo' },
    appBarSpacer(),
    appBarActions(
      themeToggle(),
      iconButton({
        label: 'Buka navigasi',
        variant: 'ghost',
        color: 'neutral',
        popovertarget: 'app-bar-drawer',
        icon: icon('menu'),
      }),
    ),
  ),
  drawer({ id: 'app-bar-drawer', title: 'Navigasi' },
    navLink({ href: '#docs' }, 'Dokumentasi'),
    navLink({ href: '#ui' }, 'UI'),
    navLink({ href: '#examples' }, 'Contoh'),
  ),
)`, { align: 'stretch' }),

      h2('Props'),
      p(code('appBar()'), ':'),
      propsTable([
        ['brand', 'Child', '', 'Isi tautan merek di bagian awalnya.'],
        ['href', 'string', "'/'", 'Ke mana mereknya menaut.'],
        ['sticky', 'boolean', 'false', 'Menyematkan bilahnya di atas saat menggulir.'],
        ['blur', 'boolean', 'false', 'Latar tembus cahaya dengan efek buram di belakangnya.'],
        ['as', 'string', "'header'", 'Elemen yang dirender.'],
      ]),
      p('Bagian-bagiannya:'),
      propsTable([
        ['appBarNav', '', '', 'Elemen nav yang memuat tautannya.'],
        ['appBarSpacer', '', '', 'Celah lentur; semua setelahnya pergi ke ujung terjauh.'],
        ['appBarActions', '', '', 'Kelompok tombol di bagian akhir.'],
        ['navLink', 'href, current, color', '', 'Tautan bergaya untuk bilahnya; current menandai halaman aktif.'],
      ], { headers: ['Bagian', 'Props', 'Bawaan', 'Deskripsi'] }),
    ],
  })
