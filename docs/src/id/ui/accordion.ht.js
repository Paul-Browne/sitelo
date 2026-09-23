import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/id.js'

export default () =>
  uiLayout({
    title: 'Akordeon',
    description:
      'Bagian yang bisa diciutkan, memakai <details> milik peramban sendiri — termasuk mode eksklusifnya.',
    activeHref: '/id/ui/accordion',
    children: [
      p(
        'Tiap bagian adalah sebuah ',
        code('<details>'),
        '. Membuka, menutup, dukungan papan ketik, dan pencarian dalam halaman semuanya datang dari peramban, dan akordeonnya bekerja dengan JavaScript dimatikan — yang untuk FAQ, pemakaian tersering, itu penting.',
      ),

      h2('Akordeon dasar'),
      demo(`accordion({
  items: [
    { title: 'Apa itu sitelo?', content: 'Pembuat situs statis yang dibangun di atas Vite. Halaman adalah fungsi yang mengembalikan HTML.' },
    { title: 'Apakah ia mengirim runtime?', content: 'Tidak. Tidak ada yang sampai ke peramban kecuali Anda sendiri menautkan sebuah skrip.' },
    { title: 'Bisakah saya memakai TypeScript?', content: 'Bisa — .ht.ts dan .ht.tsx adalah ekstensi halaman seperti yang lain.' },
  ],
})`, { align: 'stretch' }),

      h2('Terbuka secara bawaan'),
      demo(`accordion({
  items: [
    { title: 'Terbuka begitu tiba', content: 'Yang ini punya open: true.', open: true },
    { title: 'Tertutup', content: 'Yang ini tidak.' },
  ],
})`, { align: 'stretch' }),

      h2('Satu per satu'),
      p(
        code('name'),
        ' yang sama membuat bagian-bagiannya saling meniadakan — membuka satu menutup yang lain. Itu perilaku bawaan peramban untuk ',
        code('<details name>'),
        ', bukan sebuah skrip.',
      ),
      demo(`accordion({
  name: 'demo-exclusive',
  items: [
    { title: 'Pertama', content: 'Buka yang lain dan yang ini menutup.', open: true },
    { title: 'Kedua', content: 'Yang ini pun begitu.' },
    { title: 'Ketiga', content: 'Selalu hanya satu yang terbuka.' },
  ],
})`, { align: 'stretch' }),

      h2('Konten kaya'),
      p(
        'Bangun bagiannya dengan ',
        code('accordionItem()'),
        ' ketika kontennya lebih dari satu paragraf.',
      ),
      demo(`accordion(
  accordionItem({ title: 'Pasang', open: true },
    stack({ gap: 'sm' },
      text({ variant: 'small', tone: 'muted' }, 'Tambahkan paketnya dan pendamping markup-nya:'),
      code('npm install sitelo javascript-to-html'),
    ),
  ),
  accordionItem({ title: 'Konfigurasi' },
    stack({ gap: 'sm' },
      text({ variant: 'small', tone: 'muted' }, 'Opsional. Opsi Vite tinggal di bawah kunci vite.'),
      code('sitelo.config.js'),
    ),
  ),
  accordionItem({ title: 'Terapkan' },
    stack({ gap: 'sm' },
      text({ variant: 'small', tone: 'muted' }, 'Terbitkan direktori keluarannya ke hosting statis mana pun.'),
      stack({ direction: 'row', gap: 'sm', wrap: true },
        chip({ size: 'sm' }, 'Netlify'),
        chip({ size: 'sm' }, 'Vercel'),
        chip({ size: 'sm' }, 'Cloudflare Pages'),
        chip({ size: 'sm' }, 'GitHub Pages'),
      ),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Sebuah FAQ'),
      p(
        'Bentuk yang menjadi alasan komponen ini ada: konten yang sudah berada di HTML, diciutkan agar mudah dipindai, dan bisa ditemukan mesin pencari karena ia tidak pernah meninggalkan halamannya.',
      ),
      demo(`return (() => {
  const faq = [
    ['Benarkah tanpa konfigurasi?', 'Proyek dengan satu berkas di src/ dan tanpa konfigurasi bisa dibangun. Selebihnya bersifat pilihan.'],
    ['Bagaimana rute dinamis bekerja?', 'Kurung siku di nama berkas. generateStaticParams mendaftar apa yang dibangun.'],
    ['Bagaimana dengan pencarian?', 'Setel pagefind: true dan build akan mengindeks setiap halaman.'],
  ]

  return accordion({
    name: 'demo-faq',
    items: faq.map(([title, content]) => ({ title, content })),
  })
})()`, { align: 'stretch' }),

      h2('Props'),
      p(code('accordion()'), ':'),
      propsTable([
        ['items', 'Array', '[]', 'String, atau objek { title, content, open }.'],
        ['name', 'string', '', 'Nama yang sama membuat bagian-bagiannya saling meniadakan.'],
      ]),
      p(code('accordionItem()'), ':'),
      propsTable([
        ['title', 'Child', '', 'Baris ringkasannya.'],
        ['open', 'boolean', 'false', 'Apakah ia mulai dalam keadaan terbentang.'],
        ['name', 'string', '', 'Efeknya sama seperti pada induknya, saat membangun item secara manual.'],
      ]),
    ],
  })
