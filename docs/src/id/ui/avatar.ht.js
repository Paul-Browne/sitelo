import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/id.js'

export default () =>
  uiLayout({
    title: 'Avatar',
    description:
      'Seseorang atau sesuatu dalam lingkaran — gambar bila ada, inisial bila tidak.',
    activeHref: '/id/ui/avatar',
    children: [
      p(
        'Beri avatar sebuah ',
        code('name'),
        ' tanpa ',
        code('src'),
        ' dan ia merender inisialnya alih-alih gambar rusak. Itulah cadangan yang berguna untuk daftar kontributor yang hanya sebagian orangnya punya foto.',
      ),

      h2('Avatar dasar'),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  avatar({ name: 'Ada Lovelace' }),
  avatar({ name: 'Grace Hopper' }),
  avatar({ name: 'Alan Turing' }),
)`),

      h2('Dengan gambar'),
      p(
        'Ketika ',
        code('src'),
        ' disetel, ',
        code('alt'),
        ' mundur ke namanya — jadi avatar tidak pernah menjadi gambar tanpa label.',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  avatar({ src: '/logo.svg', alt: 'sitelo', style: 'background: var(--su-surface-2)' }),
  avatar({ src: '/logo.svg', name: 'sitelo', square: true, style: 'background: var(--su-surface-2)' }),
)`),

      h2('Ukuran'),
      p('Ukuran fonnya ikut berskala dengan avatarnya, jadi inisialnya tetap proporsional.'),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  avatar({ name: 'Si Kecil', size: 'sm' }),
  avatar({ name: 'Si Sedang', size: 'md' }),
  avatar({ name: 'Si Besar', size: 'lg' }),
)`),

      h2('Persegi'),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  avatar({ name: 'Proyek A', square: true }),
  avatar({ name: 'Proyek B', square: true, color: 'success' }),
)`),

      h2('Warna'),
      p('Avatar tanpa gambar memakai latar palet yang lembut.'),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center', wrap: true },
  avatar({ name: 'Primary', color: 'primary' }),
  avatar({ name: 'Neutral', color: 'neutral' }),
  avatar({ name: 'Success', color: 'success' }),
  avatar({ name: 'Warning', color: 'warning' }),
  avatar({ name: 'Danger', color: 'danger' }),
)`),

      h2('Ikon dan konten lain'),
      p('Anaknya menimpa inisialnya, untuk sebuah ikon atau satu karakter.'),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  avatar({ color: 'neutral' },
    icon('user'),
  ),
  avatar({ color: 'primary' }, '?'),
)`),

      h2('Grup'),
      p(
        code('avatarGroup()'),
        ' menindihkan anak-anaknya dan meringkas apa pun yang melewati ',
        code('max'),
        ' menjadi sebuah hitungan.',
      ),
      demo(`stack({ gap: 'md' },
  avatarGroup(
    avatar({ name: 'Ada Lovelace' }),
    avatar({ name: 'Grace Hopper' }),
    avatar({ name: 'Alan Turing' }),
  ),
  avatarGroup({ max: 3 },
    avatar({ name: 'Ada Lovelace' }),
    avatar({ name: 'Grace Hopper' }),
    avatar({ name: 'Alan Turing' }),
    avatar({ name: 'Katherine Johnson' }),
    avatar({ name: 'Barbara Liskov' }),
    avatar({ name: 'Margaret Hamilton' }),
  ),
  avatarGroup({ max: 2, size: 'sm' },
    avatar({ name: 'Ada Lovelace', size: 'sm' }),
    avatar({ name: 'Grace Hopper', size: 'sm' }),
    avatar({ name: 'Alan Turing', size: 'sm' }),
  ),
)`, { align: 'start' }),

      h2('Di dalam daftar'),
      demo(`list(
  listItem({
    start: avatar({ name: 'Ada Lovelace', size: 'sm' }),
    title: 'Ada Lovelace',
    description: 'Mengirim 3 commit ke main',
  }),
  listItem({
    start: avatar({ name: 'Grace Hopper', size: 'sm', color: 'success' }),
    title: 'Grace Hopper',
    description: 'Membuka sebuah pull request',
  }),
)`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['name', 'string', '', 'Dipakai untuk inisial, judul, dan cadangan alt gambarnya.'],
        ['src', 'string', '', 'Gambar yang ditampilkan menggantikan inisial.'],
        ['alt', 'string', '', 'Teks alt gambar; mundur ke name.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Diameter, dan ukuran fon inisialnya.'],
        ['square', 'boolean', 'false', 'Persegi panjang membulat alih-alih lingkaran.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", '', 'Palet untuk latar inisialnya.'],
      ]),
      p(
        code('avatarGroup()'),
        ' menerima ',
        code('max'),
        ' — berapa banyak yang ditampilkan sebelum sisanya diringkas menjadi hitungan — dan ',
        code('size'),
        ', yang hanya dipakai untuk hitungan itu.',
      ),
    ],
  })
