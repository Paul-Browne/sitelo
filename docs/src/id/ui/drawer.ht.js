import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/id.js'

export default () =>
  uiLayout({
    title: 'Laci',
    description:
      'Panel yang masuk dari tepi — mekanika popover yang sama dengan modal, bentuk yang berbeda.',
    activeHref: '/id/ui/drawer',
    children: [
      p(
        'Laci adalah panel setinggi penuh yang ditambatkan pada satu sisi. Seperti ',
        code('modal()'),
        ', ia adalah sebuah ',
        code('popover'),
        ': tombol dengan ',
        code('popovertarget'),
        ' yang cocok membukanya, dan peramban menangani latarnya, klik di luar, serta Escape.',
      ),
      p(
        'Tugas terseringnya di situs statis adalah menu navigasi di ponsel.',
      ),

      h2('Laci dasar'),
      demo(`fragment(
  button({ popovertarget: 'drawer-basic' }, 'Buka laci'),
  drawer({ id: 'drawer-basic', title: 'Pengaturan' },
    stack({ gap: 'md' },
      toggle({ label: 'Pencarian Pagefind', checked: true }),
      toggle({ label: 'Optimasi gambar', checked: true }),
      toggle({ label: 'Island server' }),
    ),
  ),
)`),

      h2('Sisi'),
      demo(`fragment(
  stack({ direction: 'row', gap: 'sm' },
    button({ variant: 'outline', color: 'neutral', popovertarget: 'drawer-start' }, 'Dari awal'),
    button({ variant: 'outline', color: 'neutral', popovertarget: 'drawer-end' }, 'Dari akhir'),
  ),
  drawer({ id: 'drawer-start', side: 'start', title: 'Awal' },
    text({ variant: 'small', tone: 'muted' }, 'Ditambatkan pada tepi awal — sebelah kiri dalam bahasa yang ditulis kiri ke kanan.'),
  ),
  drawer({ id: 'drawer-end', title: 'Akhir' },
    text({ variant: 'small', tone: 'muted' }, 'Bawaannya: ditambatkan pada tepi akhir.'),
  ),
)`),

      h2('Lebar'),
      p('Panjang CSS apa pun. Ia dibatasi pada 90% viewport, jadi laci lebar tetap muat di ponsel.'),
      demo(`fragment(
  stack({ direction: 'row', gap: 'sm' },
    button({ variant: 'outline', color: 'neutral', popovertarget: 'drawer-narrow' }, 'Sempit'),
    button({ variant: 'outline', color: 'neutral', popovertarget: 'drawer-wide' }, 'Lebar'),
  ),
  drawer({ id: 'drawer-narrow', width: '14rem', title: 'Sempit' },
    text({ variant: 'small', tone: 'muted' }, 'width: 14rem'),
  ),
  drawer({ id: 'drawer-wide', width: '34rem', title: 'Lebar' },
    text({ variant: 'small', tone: 'muted' }, 'width: 34rem'),
  ),
)`),

      h2('Sebagai menu navigasi'),
      p('Pola yang diinginkan kebanyakan situs: tombol menu di bilahnya, tautannya di dalam laci.'),
      demo(`fragment(
  appBar({ brand: 'sitelo' },
    appBarSpacer(),
    appBarActions(
      iconButton({
        label: 'Buka navigasi',
        variant: 'ghost',
        color: 'neutral',
        popovertarget: 'drawer-nav',
        icon: icon('menu'),
      }),
    ),
  ),
  drawer({ id: 'drawer-nav', title: 'Navigasi' },
    navLink({ href: '#docs', current: true }, 'Dokumentasi'),
    navLink({ href: '#ui' }, 'UI'),
    navLink({ href: '#examples' }, 'Contoh'),
    navLink({ href: '#about' }, 'Tentang'),
    divider({ spacing: 'sm' }),
    button({ block: true }, 'Mulai'),
  ),
)`, { align: 'stretch' }),

      h2('Panel filter'),
      demo(`fragment(
  button({ variant: 'soft', color: 'neutral', popovertarget: 'drawer-filters' }, 'Filter'),
  drawer({ id: 'drawer-filters', title: 'Filter', width: '22rem' },
    stack({ gap: 'lg' },
      choiceGroup({
        legend: 'Jenis',
        name: 'drawer-type',
        value: 'guide',
        options: [
          { value: 'guide', label: 'Panduan' },
          { value: 'example', label: 'Contoh' },
          { value: 'all', label: 'Semuanya' },
        ],
      }),
      choiceGroup({
        legend: 'Tag',
        name: 'drawer-tags',
        type: 'checkbox',
        value: ['routing'],
        options: ['routing', 'data', 'islands'],
      }),
      stack({ direction: 'row', gap: 'sm' },
        button({ variant: 'ghost', color: 'neutral', popovertarget: 'drawer-filters', popovertargetaction: 'hide' }, 'Batal'),
        button('Terapkan'),
      ),
    ),
  ),
)`),

      h2('Penggulungan latar'),
      p(
        'Halaman di belakang laci yang terbuka tidak tergulir — kunci hanya-CSS yang sama dengan yang dipakai ',
        code('modal()'),
        ', tanpa skrip dan tanpa apa pun yang perlu diinisialisasi. Berikan ',
        code('lockScroll: false'),
        ' agar latarnya tergulir seperti biasa.',
      ),

      h2('Props'),
      propsTable([
        ['id', 'string', '', 'Wajib. Apa yang ditunjuk popovertarget sebuah pemicu.'],
        ['title', 'Child', '', 'Judul, sekaligus nama dialognya yang dapat diakses.'],
        ['side', "'start' | 'end'", "'end'", 'Pada tepi mana ia ditambatkan.'],
        ['width', 'string', "'20rem'", 'Lebar panel, dibatasi pada 90vw.'],
        ['closable', 'boolean', 'true', 'Menampilkan × di kepalanya.'],
        ['closeLabel', 'string', "'Close'", 'Nama yang dapat diakses untuk tombol itu.'],
        ['lockScroll', 'boolean', 'true', 'Menghentikan penggulungan halaman di belakangnya selagi ia terbuka.'],
      ]),
    ],
  })
