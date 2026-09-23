import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/id.js'
import { preview } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Menu',
    description:
      'Menu tarik-turun yang dibangun di atas <details>, jadi ia membuka dan menutup tanpa skrip sama sekali.',
    activeHref: '/id/ui/menu',
    children: [
      p(
        'Menu adalah sebuah ',
        code('<details>'),
        ' dengan panel bergaya. Itu pilihan yang disengaja ketimbang API popover: popover tinggal di lapisan teratas dan tidak bisa diposisikan terhadap pemicunya tanpa penempatan jangkar, yang belum tersedia di mana-mana. Sebuah ',
        code('<details>'),
        ' memposisikan dirinya dengan benar hari ini dan tidak butuh apa pun dimuat.',
      ),
      p(
        'Pemicunya adalah ',
        code('<summary>'),
        ' itu, ditata seperti tombol — jadi Anda memberikan labelnya dan props tombolnya ke ',
        code('menu()'),
        ' alih-alih memberikan ',
        code('button()'),
        ' yang sudah dirender. Sebuah summary sudah interaktif, dan tombol di dalamnya menyarangkan dua kendali padahal hanya ada satu tindakan: markup tidak sah, dan dua perhentian tab untuk satu hal.',
      ),
      p(
        'Penutupan lewat klik di luar dan Escape datang dari penangan ',
        code('ontoggle'),
        ' yang mengimpornya saat sebuah menu pertama kali dibuka — dan hanya saat itu. Jika modul itu tidak pernah datang, menunya tetap membuka dan menutup lewat summary-nya sendiri.',
      ),

      h2('Menu dasar'),
      demo(`menu({ trigger: 'Tindakan' },
  menuItem({ href: '#edit' }, 'Sunting'),
  menuItem({ href: '#duplicate' }, 'Gandakan'),
  menuSeparator(),
  menuItem({ href: '#delete' }, 'Hapus'),
)`),

      h2('Perataan'),
      p(
        'Menu membuka dari tepi awal pemicunya. ',
        code("align: 'end'"),
        ' membaliknya, dan itulah yang dibutuhkan menu di dekat tepi kanan sebuah bilah.',
      ),
      demo(`stack({ direction: 'row', gap: 'xl', justify: 'space-between', style: 'width: 100%' },
  menu({ trigger: 'Rata awal', variant: 'soft' },
    menuItem({ href: '#a' }, 'Pertama'),
    menuItem({ href: '#b' }, 'Kedua'),
  ),
  menu({ trigger: 'Rata akhir', variant: 'soft', align: 'end' },
    menuItem({ href: '#c' }, 'Pertama'),
    menuItem({ href: '#d' }, 'Kedua'),
  ),
)`, { align: 'stretch' }),

      h2('Pemicu ikon'),
      p(
        'Ikon tanpa teks ',
        code('trigger'),
        ' butuh sebuah ',
        code('label'),
        ' — ia menjadi nama yang dapat diakses, yang tidak bisa diberikan ikonnya.',
      ),
      demo(`stack({ direction: 'row', gap: 'md' },
  menu({
    align: 'end',
    label: 'Tindakan lainnya',
    variant: 'ghost',
    icon: icon('more-horizontal'),
  },
    menuItem({ href: '#rename' }, 'Ganti nama'),
    menuItem({ href: '#move' }, 'Pindahkan'),
    menuSeparator(),
    menuItem({ href: '#archive' }, 'Arsipkan'),
  ),
)`),

      h2('Item dengan ikon'),
      demo(`menu({ trigger: 'Berkas' },
  menuItem({
    href: '#new',
    icon: icon('plus'),
  }, 'Halaman baru'),
  menuItem({
    href: '#open',
    icon: icon('folder'),
  }, 'Buka…'),
  menuSeparator(),
  menuItem({
    href: '#build',
    icon: icon('zap'),
  }, 'Bangun situs'),
)`),

      h2('Tombol alih-alih tautan'),
      p(
        'Item tanpa ',
        code('href'),
        ' merender sebuah ',
        code('<button>'),
        ' — untuk tindakan yang terjadi di halaman itu, bukan navigasi.',
      ),
      demo(`menu({ trigger: 'Ekspor', variant: 'soft', color: 'primary' },
  menuItem({ onclick: "import('/su/toast.js').then(m=>m.toast('Diekspor sebagai JSON.',{color:'success'}))" }, 'Sebagai JSON'),
  menuItem({ onclick: "import('/su/toast.js').then(m=>m.toast('Diekspor sebagai CSV.',{color:'success'}))" }, 'Sebagai CSV'),
)`),
      // Demo di atas memunculkan toast; inilah wilayah tempat mereka mendarat.
      // Berposisi tetap, jadi ia dirender di sini tetapi muncul di sudut.
      preview('toasts()'),

      h2('Di dalam bilah aplikasi'),
      demo(`appBar({ brand: 'sitelo' },
  appBarSpacer(),
  appBarActions(
    themeToggle(),
    menu({
      align: 'end',
      label: 'Lainnya',
      variant: 'ghost',
      icon: icon('more-horizontal'),
    },
      menuItem({ href: '/docs' }, 'Dokumentasi'),
      menuItem({ href: '/examples' }, 'Contoh'),
      menuSeparator(),
      menuItem({ href: 'https://github.com/paul-browne/sitelo' }, 'GitHub'),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Aksesibilitas'),
      p(
        'Panelnya adalah ',
        code('role="menu"'),
        ' yang itemnya ber-',
        code('role="menuitem"'),
        ', dan summary-nya membawa ',
        code('aria-haspopup'),
        '. Sebuah ',
        code('<details>'),
        ' bukan widget menu bawaan, jadi ini pendekatan yang masuk akal, bukan yang sempurna — untuk daftar tautan biasa, sebuah ',
        code('nav'),
        ' di dalam details-nya sama sahnya dan mengklaim lebih sedikit.',
      ),

      h2('Props'),
      p(code('menu()'), ' — props pemicunya adalah props tombol:'),
      propsTable([
        ['trigger', 'Child', '', 'Label yang terlihat. Berikan teks, bukan button() yang sudah dirender.'],
        ['icon', 'Child', '', 'Markup sebelum labelnya, atau sendirian untuk pemicu yang hanya berikon.'],
        ['label', 'string', '', 'Nama yang dapat diakses. Wajib ketika ada ikon dan tidak ada teks pemicu.'],
        ['variant', "'solid' | 'soft' | 'outline' | 'ghost' | 'link'", "'outline'", 'Penataan pemicunya.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'neutral'", 'Dari palet mana pemicunya menimba.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Ukuran pemicunya.'],
        ['align', "'start' | 'end'", "'start'", 'Dengan tepi pemicu yang mana panelnya disejajarkan.'],
        ['triggerClass', 'string', '', 'Kelas tambahan untuk pemicunya, bukan details pembungkusnya.'],
      ]),
      p(code('menuItem()'), ':'),
      propsTable([
        ['href', 'string', '', 'Merender jangkar; tanpa itu, sebuah tombol.'],
        ['icon', 'Child', '', 'Markup sebelum labelnya.'],
        ['as', 'string', "'button'", 'Elemen yang dirender ketika tidak ada href.'],
      ]),
      p(code('menuSeparator()'), ' tidak menerima props — ia adalah garis rambut di antara kelompok item.'),
    ],
  })
