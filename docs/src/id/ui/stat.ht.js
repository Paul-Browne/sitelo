import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/id.js'

export default () =>
  uiLayout({
    title: 'Statistik',
    description:
      'Angka yang layak dilihat, beserta artinya dan ke arah mana ia bergerak.',
    activeHref: '/id/ui/stat',
    children: [
      p(
        'Statistik adalah sebuah label, sebuah nilai, dan secara opsional sebuah perubahan. ',
        code('statGroup()'),
        ' menyatukan beberapa di antaranya ke satu permukaan dengan pemisah di antaranya.',
      ),

      h2('Statistik dasar'),
      demo(`statGroup(
  stat({ label: 'Halaman', value: '204' }),
  stat({ label: 'Waktu build', value: '1,1 dtk' }),
  stat({ label: 'JS klien', value: '3,3 kB' }),
)`, { align: 'stretch' }),

      h2('Dengan perubahan'),
      p(
        'Perubahannya mengambil warna dari ',
        code('color'),
        ' — hijau untuk angka yang bergerak ke arah yang benar, merah untuk yang tidak. Jangan bergantung pada warna saja: pertahankan tandanya atau katanya.',
      ),
      demo(`statGroup(
  stat({ label: 'Halaman', value: '204', change: '+8 minggu ini', color: 'success' }),
  stat({ label: 'Waktu build', value: '1,1 dtk', change: '−0,3 dtk', color: 'success' }),
  stat({ label: 'Bundel', value: '9,9 kB', change: '+1,2 kB', color: 'danger' }),
)`, { align: 'stretch' }),

      h2('Dengan ikon'),
      demo(`statGroup(
  stat({
    label: 'Penerapan',
    value: '128',
    color: 'primary',
    icon: icon('zap'),
  }),
  stat({
    label: 'Kontributor',
    value: '17',
    color: 'primary',
    icon: icon('user'),
  }),
)`, { align: 'stretch' }),

      h2('Teks bantuan'),
      demo(`statGroup(
  stat({
    label: 'Lighthouse',
    value: '100',
    change: 'aksesibilitas',
    color: 'success',
    help: 'Diukur pada setiap halaman berbahasa Inggris di CI.',
  }),
  stat({
    label: 'Indeks Pagefind',
    value: '204',
    help: 'Dibangun ulang di akhir setiap build.',
  }),
)`, { align: 'stretch' }),

      h2('Berdiri sendiri'),
      p('Satu statistik tidak butuh grup — ia hanya tidak punya permukaannya sendiri.'),
      demo(`card(
  cardBody(stat({ label: 'Total halaman', value: '204', change: '+8', color: 'success' })),
)`, { align: 'stretch' }),

      h2('Kolom tetap'),
      p(
        'Statistik menyesuaikan diri secara bawaan. ',
        code('columns'),
        ' menyematkan jumlahnya ketika angkanya harus tetap dalam satu baris.',
      ),
      demo(`statGroup({ columns: 'repeat(2, 1fr)' },
  stat({ label: 'Lulus', value: '215', color: 'success' }),
  stat({ label: 'Gagal', value: '0', color: 'success' }),
)`, { align: 'stretch' }),

      h2('Dari data'),
      demo(`return (() => {
  const report = [
    { label: 'Halaman', value: 204 },
    { label: 'Aset', value: 208 },
    { label: 'Total', value: '9,7 MB' },
  ]

  return statGroup(
    report.map((entry) => stat({ label: entry.label, value: String(entry.value) })),
  )
})()`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['label', 'Child', '', 'Apa yang dihitung angkanya.'],
        ['value', 'Child', '', 'Angkanya sendiri, disusun dengan angka tabular.'],
        ['change', 'Child', '', 'Selisih, diwarnai oleh color.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", '', 'Mewarnai perubahan dan ikonnya.'],
        ['icon', 'Child', '', 'Glif hiasan di atas labelnya.'],
        ['help', 'Child', '', 'Baris yang lebih tenang di bawah semuanya.'],
      ]),
      p(code('statGroup()'), ' menerima ', code('columns'), ' — nilai ', code('grid-template-columns'), ' apa pun.'),
    ],
  })
