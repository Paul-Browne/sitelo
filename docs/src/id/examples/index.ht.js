import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, examplesLayout } from '../../lib/id.js'

export default () =>
  examplesLayout({
    title: 'Contoh',
    description: 'Resep sitelo yang praktis — WordPress, API, dan lainnya.',
    activeHref: '/id/examples',
    children: [
      p(
        'Resep langkah demi langkah untuk membangun situs sungguhan dengan sitelo. Tiap contoh menunjukkan struktur proyek, pemuatan data, dan halaman yang akan Anda tulis.',
      ),
      h2('Tersedia'),
      ul(
        { class: 'docs-list' },
        li(
          a({ href: '/id/examples/basic' }, 'Situs dasar'),
          ' — proyek minimal plus konfigurasi penerapan statis untuk Netlify, Vercel, Cloudflare Pages, dan AWS Amplify.',
        ),
        li(
          a({ href: '/id/examples/todo' }, 'Aplikasi todo'),
          ' — HTML statis dengan penangan ',
          code("import('/js/todo.js')"),
          ' sebaris (tambah / ubah / hapus, ',
          code('localStorage'),
          ').',
        ),
        li(
          a({ href: '/id/examples/blog' }, 'Blog Markdown'),
          ' — folder berisi berkas ',
          code('.md'),
          ' yang dirender menjadi halaman statis, dengan umpan RSS dan nol JS klien.',
        ),
        li(
          a({ href: '/id/examples/json' }, 'JSON lokal'),
          ' — katalog yang dibangun dari berkas ',
          code('.json'),
          ' di repositori: satu halaman per berkas, tanpa API dan tanpa basis data.',
        ),
        li(
          a({ href: '/id/examples/wordpress' }, 'WordPress'),
          ' — tarik pos dari REST API WordPress dengan ',
          code('fetchWithCache'),
          ', daftarkan, lalu hasilkan halaman pos statis.',
        ),
        li(
          a({ href: '/id/examples/islands' }, 'Island server'),
          ' — halaman statis plus host Node yang merender island saat permintaan datang.',
        ),
      ),
      h2('Segera hadir'),
      ul(
        { class: 'docs-list' },
        li('CMS headless / Contentful'),
      ),
    ],
  })
