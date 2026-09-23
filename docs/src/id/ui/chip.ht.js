import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/id.js'

export default () =>
  uiLayout({
    title: 'Chip',
    description:
      'Label ringkas — sebuah tag, status, filter, atau hitungan.',
    activeHref: '/id/ui/chip',
    children: [
      p(
        'Chip adalah potongan metadata kecil: tag pada pos blog, status sebuah build, kategori pada sebuah halaman. Ia sebaris secara bawaan, jadi sederet chip menginginkan ',
        code('stack'),
        ' dengan ',
        code('wrap'),
        '.',
      ),

      h2('Chip dasar'),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  chip('statis'),
  chip('vite'),
  chip('nol-runtime'),
)`),

      h2('Warna'),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  chip({ color: 'primary' }, 'primary'),
  chip({ color: 'neutral' }, 'neutral'),
  chip({ color: 'success' }, 'success'),
  chip({ color: 'warning' }, 'warning'),
  chip({ color: 'danger' }, 'danger'),
)`),

      h2('Varian'),
      demo(`stack({ gap: 'sm' },
  stack({ direction: 'row', gap: 'sm', wrap: true },
    chip({ variant: 'soft', color: 'primary' }, 'soft'),
    chip({ variant: 'soft', color: 'success' }, 'soft'),
    chip({ variant: 'soft', color: 'danger' }, 'soft'),
  ),
  stack({ direction: 'row', gap: 'sm', wrap: true },
    chip({ variant: 'outline', color: 'primary' }, 'outline'),
    chip({ variant: 'outline', color: 'success' }, 'outline'),
    chip({ variant: 'outline', color: 'danger' }, 'outline'),
  ),
  stack({ direction: 'row', gap: 'sm', wrap: true },
    chip({ variant: 'solid', color: 'primary' }, 'solid'),
    chip({ variant: 'solid', color: 'success' }, 'solid'),
    chip({ variant: 'solid', color: 'danger' }, 'solid'),
  ),
)`, { align: 'start' }),

      h2('Ukuran'),
      demo(`stack({ direction: 'row', gap: 'sm', align: 'center', wrap: true },
  chip({ size: 'sm' }, 'kecil'),
  chip({ size: 'md' }, 'sedang'),
  chip({ size: 'lg' }, 'besar'),
)`),

      h2('Titik status'),
      p(
        'Titik di depannya mengubah chip menjadi status. Warna saja tidak cukup untuk membawa makna, jadi pertahankan katanya.',
      ),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  chip({ color: 'success', dot: true }, 'Build lulus'),
  chip({ color: 'warning', dot: true }, 'Mengantre'),
  chip({ color: 'danger', dot: true }, 'Gagal'),
  chip({ color: 'neutral', dot: true }, 'Dilewati'),
)`),

      h2('Tautan'),
      p(
        'Beri chip sebuah ',
        code('href'),
        ' dan ia merender sebuah jangkar — bentuk yang lazim untuk daftar tag, ketika tiap tag adalah sebuah halaman.',
      ),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  chip({ href: '/docs/routing', color: 'primary' }, 'routing'),
  chip({ href: '/docs/data', color: 'primary' }, 'data'),
  chip({ href: '/docs/islands', color: 'primary' }, 'islands'),
)`),

      h2('Sebagai tombol'),
      p(
        code('as'),
        ' mengubah elemennya, untuk filter yang mengalihkan alih-alih menavigasi.',
      ),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  chip({ as: 'button', variant: 'solid', color: 'primary', 'aria-pressed': 'true' }, 'Semua'),
  chip({ as: 'button', variant: 'outline', color: 'neutral', 'aria-pressed': 'false' }, 'Panduan'),
  chip({ as: 'button', variant: 'outline', color: 'neutral', 'aria-pressed': 'false' }, 'Contoh'),
)`),

      h2('Di dalam tabel'),
      demo(`table({
  striped: true,
  columns: [
    { key: 'page', header: 'Halaman' },
    { header: 'Status', align: 'end', render: (row) =>
      chip({ size: 'sm', dot: true, color: row.ok ? 'success' : 'danger' }, row.ok ? 'oke' : 'gagal') },
  ],
  rows: [
    { page: '/', ok: true },
    { page: '/docs', ok: true },
    { page: '/blog/[slug]', ok: false },
  ],
})`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'neutral'", 'Dari palet mana ia menimba.'],
        ['variant', "'soft' | 'outline' | 'solid'", "'soft'", 'Seberapa berat bobot yang dibawa chip-nya.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Bantalan dan ukuran teksnya.'],
        ['href', 'string', '', 'Merender sebuah jangkar.'],
        ['dot', 'boolean', 'false', 'Menambahkan titik status sebelum labelnya.'],
        ['as', 'string', "'span'", 'Elemen yang dirender ketika tidak ada href.'],
      ]),
    ],
  })
