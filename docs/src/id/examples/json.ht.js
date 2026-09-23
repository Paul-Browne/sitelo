import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, pageCodeTabs, examplesLayout } from '../../lib/id.js'
import { jsonSnippets } from '../../lib/snippets/examples-json.js'

const s = jsonSnippets('id')

export default () =>
  examplesLayout({
    title: 'JSON lokal',
    description:
      'Katalog produk yang seluruhnya dibangun dari berkas JSON di repositori — tanpa API, tanpa basis data.',
    activeHref: '/id/examples/json',
    children: [
      p(
        'Konten yang tinggal di repositori sebagai JSON, diubah menjadi halaman statis oleh ',
        code('sitelo/data'),
        '. Tanpa API, tanpa basis data, dan tanpa JavaScript sisi klien. Sumber lengkap di ',
        a(
          {
            href: 'https://github.com/paul-browne/sitelo/tree/main/examples/json',
            rel: 'noopener',
          },
          'examples/json',
        ),
        '.',
      ),
      h2('Yang Anda dapat'),
      ul(
        { class: 'docs-list' },
        li('Halaman beranda yang mendaftar setiap kategori dan produk'),
        li(
          code('/products/[slug]'),
          ' — satu halaman statis per berkas di ',
          code('data/products/'),
        ),
        li(
          code('/categories/[slug]'),
          ' — satu halaman per kunci di ',
          code('data/categories.json'),
        ),
        li('Menambah berkas JSON berarti menambah halaman; tidak ada rute yang perlu didaftarkan'),
        li('Nol JS diterbitkan — berkasnya dibaca di Node saat build'),
      ),
      h2('Tata letak proyek'),
      codeBlock('project', s.structure, 'bash'),
      p(
        'Data tinggal di luar ',
        code('src/'),
        ', jadi sitelo tidak pernah menganggapnya halaman atau aset.',
      ),
      h2('1. Taruh kontennya di data/'),
      p(
        'Satu berkas per produk. Nama berkasnya adalah slug, jadi ',
        code('aeron-chair.json'),
        ' menjadi ',
        code('/products/aeron-chair'),
        ' — tidak ada isi berkas yang perlu menyatakannya:',
      ),
      codeBlock('data/products/aeron-chair.json', s.product, 'json'),
      p(
        'Kategori justru berupa satu berkas: objek berkunci slug, yang tetap dibaca ',
        code('readJsonCollection'),
        ' sebagai sebuah koleksi.',
      ),
      codeBlock('data/categories.json', s.categories, 'json'),
      h2('2. Baca di satu tempat'),
      p(
        'Modul kecil khusus server membungkus pembacaannya. Tidak ada di HTML yang merujuknya, jadi ia tidak pernah sampai ke peramban — dan karena ',
        code('sitelo/data'),
        ' mengingat hasil per berkas, setiap halaman yang memanggil pembantu ini tetap hanya mengurai tiap berkas JSON sekali untuk seluruh build.',
      ),
      codeBlock('src/lib/catalogue.js', s.lib, 'javascript'),
      h2('3. Daftarkan semuanya di beranda'),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.indexTemplate,
        ht: s.indexHt,
        jsx: s.indexJsx,
      }),
      h2('4. Satu halaman per berkas JSON'),
      p(
        code('generateStaticParams'),
        ' mengembalikan satu slug per berkas saat build; ',
        code('data()'),
        ' memuat entri yang cocok untuk tiap halaman.',
      ),
      pageCodeTabs({
        file: 'src/products/[slug].ht.js',
        template: s.slugTemplate,
        ht: s.slugHt,
        jsx: s.slugJsx,
      }),
      h2('5. Sunting dan amati'),
      codeBlock('terminal', s.build, 'bash'),
      p(
        'Di bawah ',
        code('sitelo'),
        ', mengubah sebuah harga memuat ulang halaman yang terbuka — server pengembangan mengawasi berkas JSON yang benar-benar dibaca halaman. Slug ganda, berkas hilang, dan JSON rusak menggagalkan build dengan menyebut jalur yang bermasalah.',
      ),
      p(
        a({ href: '/id/docs/data' }, 'Dokumentasi pemuatan data'),
        ' · ',
        a({ href: '/id/docs/routing' }, 'Dokumentasi perutean'),
        ' · ',
        a({ href: '/id/docs/configuration' }, 'Dokumentasi konfigurasi'),
      ),
    ],
  })
