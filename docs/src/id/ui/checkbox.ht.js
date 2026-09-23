import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/id.js'

export default () =>
  uiLayout({
    title: 'Kotak centang',
    description:
      'Kotak centang dan labelnya sebagai satu kendali — masukan sungguhan, ditata dengan CSS alih-alih diganti.',
    activeHref: '/id/ui/checkbox',
    children: [
      p(
        code('checkbox()'),
        ' merender ',
        code('<label>'),
        ' yang membungkus ',
        code('<input type="checkbox">'),
        ' sungguhan beserta kotak yang Anda lihat. Masukannya tersembunyi secara visual tetapi tetap ada, jadi ia bisa difokus, ikut terkirim, dan seluruh labelnya menjadi sasaran sentuh — tanda centangnya digambar dari keadaan ',
        code(':checked'),
        ' milik masukan itu sendiri, tanpa skrip apa pun.',
      ),

      h2('Kotak centang dasar'),
      demo(`stack({ direction: 'row', gap: 'lg' },
  checkbox({ label: 'Kirimi saya pembaruan lewat email', name: 'updates' }),
  checkbox({ label: 'Tercentang', name: 'checked', checked: true }),
)`),

      h2('Warna'),
      demo(`stack({ direction: 'row', gap: 'lg', wrap: true },
  checkbox({ label: 'Primary', checked: true, color: 'primary' }),
  checkbox({ label: 'Neutral', checked: true, color: 'neutral' }),
  checkbox({ label: 'Success', checked: true, color: 'success' }),
  checkbox({ label: 'Warning', checked: true, color: 'warning' }),
  checkbox({ label: 'Danger', checked: true, color: 'danger' }),
)`),

      h2('Dinonaktifkan'),
      demo(`stack({ direction: 'row', gap: 'lg' },
  checkbox({ label: 'Tidak tersedia', disabled: true }),
  checkbox({ label: 'Menyala, dan terkunci', checked: true, disabled: true }),
)`),

      h2('Label panjang'),
      p(
        'Kotaknya tetap sejajar dengan baris pertama alih-alih memusatkan diri terhadap satu paragraf.',
      ),
      demo(`checkbox({
  label: 'Jalankan audit Lighthouse setelah setiap build, dan gagalkan build ketika sebuah skor jatuh di bawah ambangnya.',
  name: 'lighthouse',
  checked: true,
})`, { align: 'stretch' }),

      h2('Grup'),
      p(
        code('choiceGroup()'),
        ' membangun sekumpulan kotak centang dari data, dengan legenda dan nama bersama. Berikan sebuah larik sebagai ',
        code('value'),
        ' untuk mencentang beberapa sekaligus.',
      ),
      demo(`choiceGroup({
  legend: 'Hasilkan',
  name: 'generate',
  type: 'checkbox',
  value: ['sitemap', 'rss'],
  options: [
    { value: 'sitemap', label: 'sitemap.xml' },
    { value: 'rss', label: 'rss.xml' },
    { value: 'pagefind', label: 'Indeks Pagefind' },
  ],
  help: 'Masing-masing ditulis ke dalam dist/ di akhir build.',
})`, { align: 'stretch' }),

      h2('Dalam satu baris'),
      demo(`choiceGroup({
  legend: 'Kategori',
  name: 'categories',
  type: 'checkbox',
  direction: 'row',
  value: ['performance'],
  options: ['performance', 'accessibility', 'seo'],
})`, { align: 'stretch' }),

      h2('Dengan sebuah bidang'),
      p(
        'Satu kotak centang jarang butuh label lagi di atasnya. Ketika sebuah grup membutuhkannya, ',
        code('field()'),
        ' memberinya perlakuan label, bantuan, dan galat yang sama seperti bidang teks.',
      ),
      demo(`field({ label: 'Ketentuan', error: 'Anda perlu menerima ketentuannya untuk melanjutkan.' },
  checkbox({ label: 'Saya menerima ketentuannya', name: 'terms', color: 'danger' }),
)`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['label', 'Child', '', 'Teks di samping kotaknya. Lewati untuk kendali telanjang.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Warna saat tercentang.'],
        ['checked', 'boolean', 'false', 'Apakah ia mulai dalam keadaan tercentang.'],
        ['name', 'string', '', 'Nama bidang formulir.'],
        ['value', 'string | number', '', 'Nilai yang dikirim saat tercentang.'],
        ['disabled', 'boolean', 'false', 'Menonaktifkan masukannya dan meredupkan labelnya.'],
      ]),
      p(
        'Selebihnya mendarat pada ',
        code('<input>'),
        ', bukan labelnya — jadi ',
        code('required'),
        ', ',
        code('onchange'),
        ', dan ',
        code('data-*'),
        ' pergi ke tempat yang Anda duga. Gunakan ',
        code('class'),
        ' untuk menata labelnya sendiri.',
      ),
      p(
        'Untuk kumpulan yang dibangun dari data, lihat ',
        code('choiceGroup()'),
        ' di halaman ',
        code('Grup radio'),
        ' — ia menerima opsi yang sama untuk keduanya, dialihkan lewat ',
        code("type: 'checkbox'"),
        '.',
      ),
    ],
  })
