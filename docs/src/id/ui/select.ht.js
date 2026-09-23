import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/id.js'

export default () =>
  uiLayout({
    title: 'Pilihan',
    description:
      'Select bawaan peramban, ditata agar senada dengan masukan lain, dengan opsi yang dibangun dari data.',
    activeHref: '/id/ui/select',
    children: [
      p(
        'Ini adalah ',
        code('<select>'),
        ' sungguhan dengan tarik-turun milik peramban sendiri — artinya ia bekerja tanpa JavaScript, membuka dengan benar di ponsel, dan bisa dinavigasi papan ketik tanpa apa pun dari pustaka ini.',
      ),
      p(
        code('select()'),
        ' adalah kendali telanjangnya; ',
        code('selectField()'),
        ' membungkusnya dalam label, teks bantuan, dan pesan galat, dengan cara yang sama seperti ',
        code('textField()'),
        '.',
      ),

      h2('Pilihan dasar'),
      p(
        'Opsinya bisa berupa string biasa; dalam hal itu nilainya dan labelnya sama.',
      ),
      demo(`selectField({
  label: 'Tema',
  name: 'theme',
  options: ['Terang', 'Gelap', 'Sistem'],
})`, { align: 'stretch' }),

      h2('Nilai dan label'),
      p(
        'Berikan objek ketika nilai yang dikirim berbeda dari teks yang dibaca orang. ',
        code('value'),
        ' menandai opsi yang terpilih.',
      ),
      demo(`selectField({
  label: 'Keluaran',
  name: 'output',
  value: 'dist',
  options: [
    { value: 'dist', label: 'dist/ — bawaannya' },
    { value: 'build', label: 'build/' },
    { value: 'public', label: 'public/', disabled: true },
  ],
})`, { align: 'stretch' }),

      h2('Placeholder'),
      p(
        'Placeholder dirender sebagai opsi pertama yang dinonaktifkan, terpilih ketika ',
        code('value'),
        ' tidak ada — jadi bidangnya mulai kosong tanpa menjadi pilihan yang sah.',
      ),
      demo(`selectField({
  label: 'Target penerapan',
  name: 'target',
  placeholder: 'Pilih sebuah hosting…',
  options: ['Netlify', 'Vercel', 'Cloudflare Pages', 'GitHub Pages'],
})`, { align: 'stretch' }),

      h2('Grup'),
      p(
        'Entri dengan larik ',
        code('options'),
        '-nya sendiri menjadi sebuah ',
        code('<optgroup>'),
        '.',
      ),
      demo(`selectField({
  label: 'Ekstensi halaman',
  name: 'ext',
  value: '.ht.js',
  options: [
    { label: 'JavaScript', options: ['.ht.js', '.html.js'] },
    { label: 'TypeScript', options: ['.ht.ts', '.html.ts'] },
    { label: 'JSX', options: ['.ht.jsx', '.ht.tsx'] },
  ],
})`, { align: 'stretch' }),

      h2('Ukuran'),
      demo(`stack({ gap: 'md' },
  selectField({ label: 'Kecil', name: 'sm', size: 'sm', options: ['Satu', 'Dua'] }),
  selectField({ label: 'Sedang', name: 'md', size: 'md', options: ['Satu', 'Dua'] }),
  selectField({ label: 'Besar', name: 'lg', size: 'lg', options: ['Satu', 'Dua'] }),
)`, { align: 'stretch' }),

      h2('Bantuan, galat, dan nonaktif'),
      demo(`stack({ gap: 'lg' },
  selectField({
    label: 'Lokal',
    name: 'locale',
    options: ['en', 'es', 'fr'],
    help: 'Dipakai untuk atribut lang pada html.',
  }),
  selectField({
    label: 'Framework',
    name: 'framework',
    placeholder: 'Pilih satu…',
    options: ['sitelo'],
    error: 'Pilih sebuah framework untuk melanjutkan.',
  }),
  selectField({
    label: 'Paket',
    name: 'plan',
    options: ['Gratis'],
    disabled: true,
  }),
)`, { align: 'stretch' }),

      h2('Dari data'),
      p(
        'Opsinya hanyalah sebuah larik, jadi biasanya ia datang dari apa pun yang sudah dimuat ',
        code('data()'),
        ' untuk halamannya.',
      ),
      demo(`return (() => {
  const posts = [
    { slug: 'hello-world', title: 'Halo dunia' },
    { slug: 'static-first', title: 'Statis dulu' },
    { slug: 'no-runtime', title: 'Tanpa runtime' },
  ]

  return selectField({
    label: 'Pos unggulan',
    name: 'featured',
    value: 'static-first',
    options: posts.map((post) => ({ value: post.slug, label: post.title })),
  })
})()`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['options', 'SelectOption[]', '[]', 'String, objek { value, label, disabled }, atau { label, options } untuk sebuah grup.'],
        ['value', 'string | number', '', 'Opsi mana yang terpilih.'],
        ['placeholder', 'string', '', 'Opsi pertama yang dinonaktifkan, terpilih ketika tidak ada nilai.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Tinggi kendali dan ukuran teksnya.'],
        ['name', 'string', '', 'Nama bidang formulir; id-nya diturunkan darinya.'],
        ['invalid', 'boolean', 'false', 'Menyetel aria-invalid. selectField menyetelnya untuk Anda dari error.'],
        ['disabled', 'boolean', 'false', 'Menonaktifkan kendalinya.'],
      ]),
      p(
        code('selectField()'),
        ' tambahan menerima ',
        code('label'),
        ', ',
        code('help'),
        ', ',
        code('error'),
        ', ',
        code('required'),
        ', dan ',
        code('fieldClass'),
        ' — lihat ',
        code('textField()'),
        '. Anaknya ditambahkan setelah opsi hasil generasi, jadi Anda bisa menulis sendiri opsi apa pun yang dibutuhkan.',
      ),
    ],
  })
