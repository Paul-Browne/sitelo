import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/id.js'

export default () =>
  uiLayout({
    title: 'Tabel',
    description:
      'Baris dan kolom dari data, dalam wadah gulir yang menjaga tabel lebar agar tidak merusak halamannya.',
    activeHref: '/id/ui/table',
    children: [
      p(
        'Berikan ',
        code('columns'),
        ' dan ',
        code('rows'),
        ' dan tabelnya membangun dirinya sendiri, lengkap dengan kepalanya. Ia dibungkus wadah gulir mendatar, jadi tabel dengan lebih banyak kolom daripada yang bisa ditampilkan ponsel akan bergulir sendiri alih-alih meregangkan halamannya. Diekspor sebagai ',
        code('table'),
        ' sekaligus ',
        code('dataTable'),
        '.',
      ),

      h2('Tabel dasar'),
      demo(`table({
  columns: [
    { key: 'page', header: 'Halaman' },
    { key: 'size', header: 'Ukuran' },
    { key: 'time', header: 'Waktu render' },
  ],
  rows: [
    { page: '/', size: '4,1 kB', time: '12 ms' },
    { page: '/docs', size: '12,7 kB', time: '31 ms' },
    { page: '/examples', size: '9,4 kB', time: '24 ms' },
  ],
})`, { align: 'stretch' }),

      h2('Perataan'),
      p('Angka lebih enak dibaca ketika diratakan ke ujung kolomnya.'),
      demo(`table({
  columns: [
    { key: 'page', header: 'Halaman' },
    { key: 'bytes', header: 'Bita', align: 'end' },
    { key: 'gzip', header: 'Gzip', align: 'end' },
  ],
  rows: [
    { page: '/', bytes: '4.112', gzip: '1.204' },
    { page: '/docs', bytes: '12.704', gzip: '3.910' },
    { page: '/examples', bytes: '9.388', gzip: '2.744' },
  ],
})`, { align: 'stretch' }),

      h2('Sel khusus'),
      p(
        'Kolom dengan fungsi ',
        code('render'),
        ' menerima seluruh barisnya dan mengembalikan apa pun yang seharusnya ada di selnya — sebuah chip, tautan, atau angka terformat.',
      ),
      demo(`table({
  columns: [
    { header: 'Halaman', render: (row) => link({ href: row.href }, row.page) },
    { key: 'size', header: 'Ukuran', align: 'end' },
    { header: 'Status', align: 'end', render: (row) =>
      chip({ size: 'sm', dot: true, color: row.ok ? 'success' : 'danger' }, row.ok ? 'oke' : 'gagal') },
  ],
  rows: [
    { page: '/docs/routing', href: '/docs/routing', size: '18,2 kB', ok: true },
    { page: '/docs/data', href: '/docs/data', size: '21,7 kB', ok: true },
    { page: '/docs/islands', href: '/docs/islands', size: '24,1 kB', ok: false },
  ],
})`, { align: 'stretch' }),

      h2('Gaya'),
      p(
        code('striped'),
        ' memberi pita berselang-seling pada barisnya, ',
        code('hover'),
        ' menyoroti baris di bawah penunjuk, dan ',
        code('dense'),
        ' merapatkan bantalannya untuk tabel dengan banyak baris.',
      ),
      demo(`stack({ gap: 'lg' },
  table({
    striped: true,
    caption: 'berpita',
    columns: [{ key: 'name', header: 'Nama' }, { key: 'value', header: 'Nilai', align: 'end' }],
    rows: [{ name: 'halaman', value: '169' }, { name: 'aset', value: '208' }, { name: 'total', value: '9,5 MB' }],
  }),
  table({
    hover: true,
    dense: true,
    caption: 'sorot dan rapat',
    columns: [{ key: 'name', header: 'Nama' }, { key: 'value', header: 'Nilai', align: 'end' }],
    rows: [{ name: 'halaman', value: '169' }, { name: 'aset', value: '208' }, { name: 'total', value: '9,5 MB' }],
  }),
)`, { align: 'stretch' }),

      h2('Keterangan'),
      p(
        'Keterangan menamai tabelnya bagi siapa pun yang sampai ke sana tanpa teks di sekitarnya — layak ditambahkan setiap kali tabelnya tidak berada langsung di bawah judul yang sudah menyatakan isinya.',
      ),
      demo(`table({
  caption: 'Keluaran build, terbaru lebih dulu',
  columns: [
    { key: 'commit', header: 'Commit' },
    { key: 'when', header: 'Kapan' },
    { key: 'pages', header: 'Halaman', align: 'end' },
  ],
  rows: [
    { commit: '94a837a', when: '4 menit lalu', pages: '169' },
    { commit: 'dcfaaae', when: '2 jam lalu', pages: '161' },
  ],
})`, { align: 'stretch' }),

      h2('Dari data'),
      p(
        'Barisnya adalah larik biasa, jadi biasanya ia adalah apa pun yang sudah dimuat ',
        code('data()'),
        ' — tanpa adaptor di antaranya.',
      ),
      demo(`return (() => {
  const posts = [
    { title: 'Halo dunia', date: '2026-01-14', reads: 1204 },
    { title: 'Statis dulu', date: '2026-02-02', reads: 890 },
    { title: 'Tanpa runtime', date: '2026-03-19', reads: 2317 },
  ]

  return table({
    hover: true,
    columns: [
      { key: 'title', header: 'Pos' },
      { key: 'date', header: 'Terbit' },
      { header: 'Dibaca', align: 'end', render: (post) => post.reads.toLocaleString('id') },
    ],
    rows: posts,
  })
})()`, { align: 'stretch' }),

      h2('Menulis markup-nya sendiri'),
      p(
        'Lewati ',
        code('columns'),
        ' dan tabelnya justru merender anaknya, jadi tabel dengan baris kaki atau kepala berkelompok bisa dibangun manual dan tetap mendapat penataan serta wadah gulirnya.',
      ),

      h2('Props'),
      propsTable([
        ['columns', 'TableColumn[]', '', '{ key, header, align, render } per kolom. Lewati untuk menulis barisnya sendiri.'],
        ['rows', 'object[]', '[]', 'Satu objek per baris.'],
        ['caption', 'Child', '', 'Keterangan di atas tabelnya.'],
        ['striped', 'boolean', 'false', 'Memberi pita berselang-seling pada barisnya.'],
        ['hover', 'boolean', 'false', 'Menyoroti baris di bawah penunjuk.'],
        ['dense', 'boolean', 'false', 'Bantalan sel yang lebih rapat.'],
      ]),
    ],
  })
