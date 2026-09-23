import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/id.js'

export default () =>
  uiLayout({
    title: 'Kartu',
    description:
      'Permukaan untuk konten yang dikelompokkan, dengan kepala, badan, kaki, dan media yang tahu cara duduk bersama.',
    activeHref: '/id/ui/card',
    children: [
      p(
        'Kartu mengelompokkan konten terkait pada permukaannya sendiri. Bagian-bagiannya — ',
        code('cardHeader()'),
        ', ',
        code('cardMedia()'),
        ', ',
        code('cardBody()'),
        ', ',
        code('cardFooter()'),
        ' — adalah fungsi terpisah alih-alih props, jadi Anda hanya memakai yang dibutuhkan dan menatanya dalam urutan yang diinginkan desainnya.',
      ),

      h2('Kartu dasar'),
      demo(`card(
  cardHeader({ title: 'Perutean berbasis berkas', subtitle: 'src/about.ht.js → /about' }),
  cardBody(text({ variant: 'small', tone: 'muted' }, 'Folder menjadi jalur. Kurung siku menjadi parameter. Tidak ada router yang perlu dikonfigurasi.')),
)`, { align: 'stretch' }),

      h2('Varian'),
      p(
        'Bergaris adalah bawaannya. Terangkat menukar batasnya dengan bayangan, dan datar mewarnai permukaannya alih-alih keduanya.',
      ),
      demo(`grid({ min: '13rem' },
  card({ variant: 'outlined' }, cardBody(text({ variant: 'small' }, 'Outlined'))),
  card({ variant: 'elevated' }, cardBody(text({ variant: 'small' }, 'Elevated'))),
  card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Flat'))),
)`, { align: 'stretch' }),

      h2('Dengan kaki'),
      p(
        code('divided'),
        ' menambahkan garis rambut di atas kakinya. Kakinya didorong ke bawah, jadi kartu-kartu dalam satu baris menyejajarkan tindakannya meski teks di atasnya berbeda panjang.',
      ),
      demo(`grid({ min: '14rem' },
  card(
    cardHeader({ title: 'Situs dasar' }),
    cardBody(text({ variant: 'small', tone: 'muted' }, 'Proyek minimal plus konfigurasi penerapan.')),
    cardFooter({ divided: true }, button({ size: 'sm', variant: 'soft' }, 'Buka')),
  ),
  card(
    cardHeader({ title: 'Blog Markdown' }),
    cardBody(text({ variant: 'small', tone: 'muted' }, 'Folder berisi berkas .md yang dirender menjadi halaman statis, dengan umpan RSS dan tanpa JavaScript klien sama sekali.')),
    cardFooter({ divided: true }, button({ size: 'sm', variant: 'soft' }, 'Buka')),
  ),
)`, { align: 'stretch' }),

      h2('Media'),
      p(
        code('cardMedia()'),
        ' mengisi bagian atas kartu pada rasio aspek tetap, jadi sebaris kartu tetap rata berapa pun ukuran gambar sumbernya.',
      ),
      demo(`grid({ min: '13rem' },
  card(
    cardMedia({ src: '/logo.svg', alt: '', style: 'background: var(--su-surface-2); object-fit: contain; padding: 1rem' }),
    cardBody(text({ variant: 'small' }, 'Bawaan 16 / 9')),
  ),
  card(
    cardMedia({ src: '/logo.svg', alt: '', ratio: '4 / 3', style: 'background: var(--su-surface-2); object-fit: contain; padding: 1rem' }),
    cardBody(text({ variant: 'small' }, 'ratio: 4 / 3')),
  ),
)`, { align: 'stretch' }),

      h2('Seluruh kartu sebagai tautan'),
      p(
        'Beri kartu sebuah ',
        code('href'),
        ' dan seluruh permukaannya menjadi satu tautan, lengkap dengan efek terangkat saat disorot. Jangan menaruh tombol atau tautan lain di dalam kartu berbentuk ini — konten interaktif tidak bisa bersarang di dalam tautan. Gunakan tombol di kaki pada kartu biasa sebagai gantinya.',
      ),
      demo(`grid({ min: '14rem' },
  card({ href: '/docs/routing' },
    cardHeader({ title: 'Perutean', subtitle: 'Baca panduannya' }),
    cardBody(text({ variant: 'small', tone: 'muted' }, 'Rute dinamis, penangkap semua, dan grup rute.')),
  ),
  card({ href: '/docs/data' },
    cardHeader({ title: 'Memuat data', subtitle: 'Baca panduannya' }),
    cardBody(text({ variant: 'small', tone: 'muted' }, 'data() berjalan saat build, dengan penyinggahan pengambilan.')),
  ),
)`, { align: 'stretch' }),

      h2('Bantalan'),
      p(
        'Satu props menyetel bantalan untuk setiap bagian kartu sekaligus.',
      ),
      demo(`stack({ gap: 'md' },
  card({ padding: 'sm' }, cardBody(text({ variant: 'small' }, 'padding: sm'))),
  card({ padding: 'xl' }, cardBody(text({ variant: 'small' }, 'padding: xl'))),
)`, { align: 'stretch' }),

      h2('Isi bebas'),
      p(
        'Bagian-bagiannya adalah kemudahan, bukan keharusan — kartu menerima anak apa pun, dan ',
        code('cardHeader()'),
        ' menerima anaknya sendiri di samping judulnya, untuk avatar atau tombol menu di sebelah kanan.',
      ),
      demo(`card(
  cardHeader(
    { title: 'Paul Browne', subtitle: 'Diterapkan 4 menit lalu' },
    avatar({ name: 'Paul Browne', size: 'sm' }),
  ),
  cardBody(
    stack({ direction: 'row', gap: 'sm', wrap: true },
      chip({ color: 'success', dot: true }, 'Build lulus'),
      chip({ color: 'neutral' }, '12 halaman'),
      chip({ color: 'neutral' }, '4,1 kB'),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Props'),
      p(code('card()'), ':'),
      propsTable([
        ['variant', "'outlined' | 'elevated' | 'flat'", "'outlined'", 'Bagaimana permukaannya dipisahkan dari halamannya.'],
        ['href', 'string', '', 'Merender seluruh kartu sebagai tautan.'],
        ['padding', 'Space', "'lg'", 'Bantalan yang dipakai setiap bagian kartunya.'],
      ]),
      p('Bagian-bagiannya:'),
      propsTable([
        ['cardHeader', 'title, subtitle', '', 'Judul dan subjudul, plus anak apa pun di sampingnya.'],
        ['cardTitle', 'as', "'h3'", 'Judulnya sendiri, ketika kepalanya dibangun manual.'],
        ['cardSubtitle', '', '', 'Baris redup di bawah sebuah judul.'],
        ['cardMedia', 'src, alt, ratio', "'16 / 9'", 'Gambar sampul pada rasio aspek tetap.'],
        ['cardBody', '', '', 'Wilayah konten utamanya.'],
        ['cardFooter', 'divided', 'false', 'Baris tindakan di bawah; divided menambahkan garis rambut di atasnya.'],
      ], { headers: ['Bagian', 'Props', 'Bawaan', 'Deskripsi'] }),
    ],
  })
