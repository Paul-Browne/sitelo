import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/id.js'

export default () =>
  uiLayout({
    title: 'Daftar',
    description:
      'Baris konten dengan sesuatu yang opsional di kedua sisinya — bentuk yang membangun sebagian besar layar pengaturan dan umpan.',
    activeHref: '/id/ui/list',
    children: [
      p(
        'Daftar adalah permukaan bergaris berisi baris-baris. Tiap baris punya judul, deskripsi opsional, dan slot di awal serta akhir untuk avatar, ikon, atau kendali.',
      ),

      h2('Daftar dasar'),
      demo(`list(
  listItem({ title: 'Perutean', description: 'src/about.ht.js menjadi /about' }),
  listItem({ title: 'Memuat data', description: 'data() berjalan sekali, saat build' }),
  listItem({ title: 'Aset', description: 'Hanya yang dirujuk HTML Anda yang dibundel' }),
)`, { align: 'stretch' }),

      h2('Slot awal dan akhir'),
      demo(`list(
  listItem({
    start: avatar({ name: 'Ada Lovelace', size: 'sm' }),
    title: 'Ada Lovelace',
    description: 'Mengirim 3 commit ke main',
    end: chip({ size: 'sm', color: 'neutral' }, '2j'),
  }),
  listItem({
    start: avatar({ name: 'Grace Hopper', size: 'sm', color: 'success' }),
    title: 'Grace Hopper',
    description: 'Membuka sebuah pull request',
    end: chip({ size: 'sm', color: 'success', dot: true }, 'terbuka'),
  }),
)`, { align: 'stretch' }),

      h2('Baris yang menaut'),
      p(
        'Baris dengan ',
        code('href'),
        ' menaruh jangkarnya di dalam ',
        code('<li>'),
        ' alih-alih mengelilinginya, jadi daftarnya tetap menjadi daftar yang sah. Jangan juga menaruh tombol di barisnya — konten interaktif tidak bisa bersarang di dalam tautan.',
      ),
      demo(`list(
  listItem({ title: 'Memulai', description: 'Pemasangan dan halaman pertama', href: '/docs' }),
  listItem({ title: 'Perutean', description: 'Berbasis berkas, dengan segmen dinamis', href: '/docs/routing' }),
  listItem({ title: 'Penerapan', description: 'Netlify, Vercel, Pages, Amplify', href: '/docs/deployment' }),
)`, { align: 'stretch' }),

      h2('Baris dengan kendali'),
      p(
        'Ketika sebuah baris memuat sakelar atau tombol, biarkan barisnya sendiri tanpa tautan dan biarkan kendalinya menjadi bagian yang interaktif.',
      ),
      demo(`list(
  listItem({
    title: 'Pencarian Pagefind',
    description: 'Mengindeks setiap halaman di akhir build',
    end: toggle({ 'aria-label': 'Pencarian Pagefind', checked: true }),
  }),
  listItem({
    title: 'Optimasi gambar',
    description: 'Mengubah ukuran dan mengonversi gambar. Butuh sharp.',
    end: toggle({ 'aria-label': 'Optimasi gambar', checked: true }),
  }),
  listItem({
    title: 'Island server',
    description: 'Merender bagian yang ditandai saat permintaan datang',
    end: toggle({ 'aria-label': 'Island server' }),
  }),
)`, { align: 'stretch' }),

      h2('Polos'),
      p(
        code('plain'),
        ' membuang batas dan latarnya, untuk daftar yang duduk di dalam kartu atau bilah samping yang sudah punya permukaannya sendiri.',
      ),
      demo(`card(
  cardHeader({ title: 'Build terbaru' }),
  cardBody(
    list({ plain: true },
      listItem({ title: '94a837a', description: 'main · 4 menit lalu', end: chip({ size: 'sm', color: 'success', dot: true }, 'lulus') }),
      listItem({ title: 'dcfaaae', description: 'main · 2 jam lalu', end: chip({ size: 'sm', color: 'success', dot: true }, 'lulus') }),
      listItem({ title: 'a46a461', description: 'main · kemarin', end: chip({ size: 'sm', color: 'danger', dot: true }, 'gagal') }),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Baris bebas'),
      p(
        'Tanpa ',
        code('title'),
        ' atau ',
        code('description'),
        ', sebuah baris merender anak apa pun yang diberikan kepadanya — untuk tata letak yang tidak tercakup bentuk dua barisnya.',
      ),
      demo(`list(
  listItem(
    stack({ direction: 'row', gap: 'md', align: 'center', justify: 'space-between', style: 'width: 100%' },
      stack({ gap: 'none' },
        text({ variant: 'small' }, 'Baris khusus'),
        text({ variant: 'caption', tone: 'muted' }, 'Apa pun yang Anda suka di dalamnya'),
      ),
      button({ size: 'sm', variant: 'soft' }, 'Tindakan'),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Dari data'),
      demo(`return (() => {
  const locales = [
    { code: 'en', name: 'English', pages: 24 },
    { code: 'es', name: 'Español', pages: 24 },
    { code: 'zh', name: '简体中文', pages: 24 },
  ]

  return list(
    locales.map((locale) =>
      listItem({
        start: avatar({ name: locale.code, size: 'sm', color: 'neutral', square: true }),
        title: locale.name,
        description: locale.pages + ' halaman',
        end: chip({ size: 'sm', color: 'neutral' }, locale.code),
      }),
    ),
  )
})()`, { align: 'stretch' }),

      h2('Props'),
      p(code('list()'), ':'),
      propsTable([
        ['plain', 'boolean', 'false', 'Membuang batas dan latarnya.'],
        ['as', 'string', "'ul'", 'Elemen yang dirender, misalnya ol.'],
      ]),
      p(code('listItem()'), ':'),
      propsTable([
        ['title', 'Child', '', 'Baris utama pada barisnya.'],
        ['description', 'Child', '', 'Baris kedua yang redup.'],
        ['start', 'Child', '', 'Slot depan — avatar atau ikon.'],
        ['end', 'Child', '', 'Slot belakang — chip, kendali, atau cap waktu.'],
        ['href', 'string', '', 'Menjadikan barisnya tautan, dengan jangkarnya di dalam li.'],
        ['interactive', 'boolean', 'false', 'Sorotan saat dilewati tanpa menjadikannya tautan.'],
      ]),
    ],
  })
