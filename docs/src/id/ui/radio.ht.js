import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/id.js'

export default () =>
  uiLayout({
    title: 'Grup radio',
    description:
      'Satu pilihan dari beberapa, sebagai masukan radio sungguhan yang berbagi satu nama — dengan legenda dan peran grup.',
    activeHref: '/id/ui/radio',
    children: [
      p(
        'Radio dipakai untuk memilih tepat satu opsi dari kumpulan kecil yang terlihat. ',
        code('radio()'),
        ' merender satu; ',
        code('choiceGroup()'),
        ' membangun seluruh kumpulannya dari sebuah larik dan memberinya legenda serta ',
        code('role="radiogroup"'),
        ' yang menjadikannya sebuah grup alih-alih tumpukan masukan.',
      ),
      p(
        'Mereka berbagi satu ',
        code('name'),
        ', jadi peramban menangani sifat saling meniadakan dan navigasi tombol panah di antaranya. Tidak ada di sini yang mengirim skrip.',
      ),

      h2('Grup radio dasar'),
      demo(`choiceGroup({
  legend: 'Paket',
  name: 'plan',
  value: 'pro',
  options: [
    { value: 'free', label: 'Gratis' },
    { value: 'pro', label: 'Pro' },
    { value: 'team', label: 'Tim' },
  ],
})`, { align: 'stretch' }),

      h2('Dalam satu baris'),
      p(
        'Label pendek lebih enak dibaca dalam satu baris. Yang panjang sebaiknya tetap menumpuk, dan itulah bawaannya.',
      ),
      demo(`choiceGroup({
  legend: 'Bentuk perangkat',
  name: 'form-factor',
  direction: 'row',
  value: 'desktop',
  options: ['desktop', 'mobile'],
})`, { align: 'stretch' }),

      h2('String biasa'),
      p(
        'Ketika nilainya dan labelnya sama, berikan string.',
      ),
      demo(`choiceGroup({
  legend: 'Tingkat log',
  name: 'log-level',
  direction: 'row',
  value: 'warn',
  options: ['info', 'warn', 'error', 'silent'],
})`, { align: 'stretch' }),

      h2('Opsi yang dinonaktifkan'),
      demo(`choiceGroup({
  legend: 'Perender',
  name: 'renderer',
  value: 'static',
  options: [
    { value: 'static', label: 'Statis' },
    { value: 'islands', label: 'Island server' },
    { value: 'ssr', label: 'SSR penuh', disabled: true },
  ],
  help: 'SSR penuh butuh host Node, yang tidak dimiliki proyek ini.',
})`, { align: 'stretch' }),

      h2('Satu per satu'),
      p(
        'Pakai ',
        code('radio()'),
        ' langsung ketika opsinya tidak cukup seragam untuk datang dari sebuah larik — misalnya ketika masing-masing membawa deskripsinya sendiri.',
      ),
      demo(`stack({ gap: 'md' },
  radio({ name: 'deploy', value: 'push', label: 'Pada setiap pengiriman', checked: true }),
  radio({ name: 'deploy', value: 'tag', label: 'Hanya pada rilis bertanda' }),
  radio({ name: 'deploy', value: 'manual', label: 'Secara manual' }),
)`, { align: 'stretch' }),

      h2('Warna'),
      demo(`stack({ direction: 'row', gap: 'lg', wrap: true },
  radio({ label: 'Primary', name: 'c1', checked: true, color: 'primary' }),
  radio({ label: 'Neutral', name: 'c2', checked: true, color: 'neutral' }),
  radio({ label: 'Success', name: 'c3', checked: true, color: 'success' }),
  radio({ label: 'Warning', name: 'c4', checked: true, color: 'warning' }),
  radio({ label: 'Danger', name: 'c5', checked: true, color: 'danger' }),
)`),

      h2('Di dalam kartu'),
      demo(`card(
  cardHeader({ title: 'Pengaturan build', subtitle: 'Diterapkan pada penerapan berikutnya' }),
  cardBody(
    stack({ gap: 'lg' },
      choiceGroup({
        legend: 'URL bersih',
        name: 'clean-urls',
        direction: 'row',
        value: 'on',
        options: [
          { value: 'on', label: 'Nyala' },
          { value: 'off', label: 'Mati' },
        ],
      }),
      choiceGroup({
        legend: 'Gambar',
        name: 'images',
        value: 'optimise',
        options: [
          { value: 'optimise', label: 'Ubah ukuran dan konversi' },
          { value: 'copy', label: 'Salin apa adanya' },
        ],
      }),
    ),
  ),
  cardFooter({ divided: true, style: 'justify-content: flex-end' },
    button({ type: 'submit' }, 'Simpan'),
  ),
)`, { align: 'stretch' }),

      h2('Props'),
      p(code('choiceGroup()'), ':'),
      propsTable([
        ['legend', 'Child', '', 'Label untuk keseluruhan grupnya.'],
        ['name', 'string', '', 'Nama formulir bersama — yang membuat radionya saling meniadakan.'],
        ['options', 'Array', '[]', 'String, atau objek { value, label, disabled }.'],
        ['value', 'string | number | Array', '', 'Opsi mana yang tercentang. Sebuah larik untuk kotak centang.'],
        ['type', "'radio' | 'checkbox'", "'radio'", 'Kendali mana yang dibangun. Sekaligus memilih peran grupnya.'],
        ['direction', "'row' | 'column'", "'column'", 'Bagaimana opsinya ditata.'],
        ['help', 'Child', '', 'Petunjuk di bawah grupnya.'],
      ]),
      p(code('radio()'), ' menerima props yang sama dengan ', code('checkbox()'), ': ', code('label'), ', ', code('color'), ', ', code('checked'), ', ', code('name'), ', ', code('value'), ', dan ', code('disabled'), '.'),
    ],
  })
