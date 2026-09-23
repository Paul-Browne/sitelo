import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/id.js'

export default () =>
  uiLayout({
    title: 'Lini masa',
    description:
      'Entri berurutan menyusuri sebuah garis — catatan perubahan, riwayat rilis, halaman tentang.',
    activeHref: '/id/ui/timeline',
    children: [
      p(
        'Lini masa adalah daftar berurutan dengan sebuah garis di sisinya. Bangun dari ',
        code('items'),
        ', atau dari anak ',
        code('timelineItem()'),
        ' ketika entrinya tidak cukup seragam untuk datang dari sebuah larik.',
      ),

      h2('Lini masa dasar'),
      demo(`timeline({
  items: [
    { time: 'Maret 2026', title: 'Pustaka komponen', description: 'sitelo-ui hadir dengan sembilan puluh komponen.' },
    { time: 'Januari 2026', title: 'Island server', description: 'Halaman statis dengan bagian yang dirender saat permintaan datang.' },
    { time: 'Oktober 2025', title: 'Rilis pertama', description: 'Perutean berbasis berkas dan sebuah perintah build.' },
  ],
})`, { align: 'stretch' }),

      h2('Penanda berwarna'),
      demo(`timeline({
  items: [
    { time: '12:04', title: 'Penerapan berhasil', description: '204 halaman diterbitkan.', color: 'success' },
    { time: '12:03', title: 'Lighthouse lulus', description: 'Semua ambang terpenuhi.', color: 'success' },
    { time: '12:01', title: 'Pemeriksaan tautan memperingatkan', description: 'Satu tautan eksternal kehabisan waktu.', color: 'warning' },
    { time: '12:00', title: 'Build dimulai', color: 'neutral' },
  ],
})`, { align: 'stretch' }),

      h2('Dengan ikon'),
      demo(`timeline(
  timelineItem({
    time: 'Baru saja',
    title: 'Diterbitkan',
    color: 'success',
    icon: icon('check', { 'stroke-width': 3.4 }),
  }),
  timelineItem({
    time: '2 menit lalu',
    title: 'Sedang dibangun',
    color: 'primary',
  }),
)`, { align: 'stretch' }),

      h2('Entri kaya'),
      p('Anak sebuah item masuk ke bawah deskripsinya.'),
      demo(`timeline(
  timelineItem({ time: 'v2.7.0', title: 'Bagian halaman', color: 'primary' },
    stack({ direction: 'row', gap: 'xs', wrap: true, style: 'margin-top: 0.5rem' },
      chip({ size: 'sm' }, 'hero'),
      chip({ size: 'sm' }, 'footer'),
      chip({ size: 'sm' }, 'stat'),
      chip({ size: 'sm' }, 'steps'),
      chip({ size: 'sm' }, 'timeline'),
      chip({ size: 'sm' }, 'mockup'),
    ),
  ),
  timelineItem({ time: 'v2.6.3', title: 'Pemeliharaan', description: 'Peningkatan dependensi dan perbaikan pemeriksa tautan.' }),
)`, { align: 'stretch' }),

      h2('Dari data'),
      p(
        'Bentuk yang lazim di situs statis: berkas catatan perubahan yang dimuat ',
        code('data()'),
        ', dipetakan langsung ke item.',
      ),
      demo(`return (() => {
  const releases = [
    { version: '2.7.0', date: '2026-03-01', summary: 'Bagian halaman' },
    { version: '2.6.3', date: '2026-02-14', summary: 'Pemeliharaan' },
    { version: '2.6.0', date: '2026-01-20', summary: 'Island server' },
  ]

  return timeline({
    items: releases.map((release) => ({
      time: release.date,
      title: 'v' + release.version,
      description: release.summary,
      color: 'primary',
    })),
  })
})()`, { align: 'stretch' }),

      h2('Lini masa atau langkah?'),
      p(
        'Lini masa mencatat apa yang sudah terjadi, terbaru atau terlama lebih dulu, dan tidak punya posisi saat ini. ',
        code('steps()'),
        ' menampilkan kemajuan melalui sebuah alur dengan satu langkah yang sedang berjalan dan sisanya di depan atau di belakangnya.',
      ),

      h2('Props'),
      p(code('timeline()'), ':'),
      propsTable([
        ['items', 'Array', '[]', 'Objek dengan props timelineItem di bawah ini.'],
      ]),
      p(code('timelineItem()'), ':'),
      propsTable([
        ['time', 'Child', '', 'Kapan ia terjadi — sebuah tanggal, versi, atau waktu.'],
        ['title', 'Child', '', 'Apa yang terjadi.'],
        ['description', 'Child', '', 'Rinciannya di bawah.'],
        ['icon', 'Child', '', 'Markup di dalam penandanya.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", '', 'Warna penandanya.'],
      ]),
      p('Anak sebuah item dirender di bawah deskripsinya.'),
    ],
  })
