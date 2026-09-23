import { a, h2, h3, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, pageCodeTabs, examplesLayout } from '../../lib/id.js'
import { wordpressSnippets } from '../../lib/snippets/examples-wordpress.js'

const s = wordpressSnippets('id')

export default () =>
  examplesLayout({
    title: 'WordPress',
    description:
      'Tarik seluruh situs WordPress lewat REST API — ribuan pos, dihasilkan secara statis dengan sitelo.',
    activeHref: '/id/examples/wordpress',
    children: [
      p(
        'Perlakukan WordPress sebagai CMS headless dan ',
        'tarik seluruh situsnya',
        ': telusuri halaman demi halaman ',
        code('/wp-json/wp/v2/posts'),
        ', hasilkan satu berkas HTML per slug, dan singgahkan respons API antarbuild.',
      ),
      h2('Yang Anda dapat'),
      ul(
        { class: 'docs-list' },
        li('Halaman beranda yang mendaftar pos terbaru'),
        li(code('/blog'), ' — arsip lengkap setiap pos'),
        li(
          code('/blog/[slug]'),
          ' — satu halaman HTML statis per pos (tetap jalan pada ribuan pos)',
        ),
        li(
          code('fetchWithCache'),
          ' agar build ulang memakai kembali respons WP alih-alih mengunduh semuanya lagi',
        ),
      ),
      h2('Tata letak proyek'),
      codeBlock('project', s.structure, 'bash'),
      codeBlock('sitelo.config.js', s.config, 'javascript'),
      h2('1. Arahkan ke situs WordPress Anda'),
      p(
        'REST API menyala secara bawaan di WordPress modern. Pastikan di ',
        code('https://your-site.com/wp-json/wp/v2/posts'),
        '.',
      ),
      p(
        'Setel ',
        code('WP_URL'),
        ' di lingkungan (atau tulis langsung selagi bereksperimen):',
      ),
      codeBlock('.env', s.env, 'bash'),
      h2('2. Pembantu WordPress bersama'),
      p(
        code('getAllPosts()'),
        ' membaca ',
        code('X-WP-TotalPages'),
        ' dan menyusuri setiap halaman (WordPress membatasi ',
        code('per_page'),
        ' pada 100). Lewati ',
        code('_embed'),
        ' selagi mengumpulkan slug — ambil sematan hanya untuk pos satuan.',
      ),
      codeBlock('src/lib/wordpress.js', s.wpLib, 'javascript'),
      h2('3. Halaman beranda'),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.homeTemplate,
        ht: s.homeHt,
        jsx: s.homeJsx,
      }),
      h2('4. Indeks blog'),
      p('Gunakan ', code('getAllPosts()'), ' agar arsipnya tidak terbatas pada 50–100 item.'),
      pageCodeTabs({
        file: 'src/blog/index.ht.js',
        template: s.blogIndexTemplate,
        ht: s.blogIndexHt,
        jsx: s.blogIndexJsx,
      }),
      h2('5. Tarik setiap pos menjadi halaman statis'),
      p(
        code('generateStaticParams'),
        ' harus mengembalikan ',
        'setiap',
        ' slug yang Anda inginkan di ',
        code('dist/'),
        '. Telusuri API-nya halaman demi halaman di sini — jangan memanggil ',
        code('getPosts({ perPage: 100 })'),
        ' sekali lalu berhenti.',
      ),
      pageCodeTabs({
        file: 'src/blog/[slug].ht.js',
        template: s.blogPostTemplate,
        ht: s.blogPostHt,
        jsx: s.blogPostJsx,
      }),
      h2('6. Build'),
      codeBlock('shell', s.build, 'bash'),
      p(
        'Build pertama menelusuri WordPress sekali dan mengisi singgahan pengambilan. Build berikutnya memakai kembali respons daftar/detail yang disinggahkan (',
        code("cache: 'auto'"),
        ' → sistem berkas di produksi) sampai ',
        code('maxAge'),
        ' kedaluwarsa. Naikkan ',
        code('renderConcurrency'),
        ' di ',
        code('sitelo.config.js'),
        ' jika Anda merender ribuan halaman pos.',
      ),
      h2('Catatan'),
      h3('HTML dari WordPress'),
      p(
        code('title.rendered'),
        ' dan ',
        code('content.rendered'),
        ' adalah string HTML dari WP. Masukkan apa adanya ke templat Anda (seperti di atas), atau bersihkan bila Anda tidak sepenuhnya memercayai CMS-nya.',
      ),
      h3('Konten privat'),
      p(
        'Rute REST publik hanya menampilkan pos yang sudah terbit. Untuk draf atau autentikasi khusus, teruskan header ke argumen kedua ',
        code('fetchWithCache'),
        ' (init ',
        code('fetch'),
        ' standar) dan gunakan ',
        code('cacheKey'),
        ' yang tetap.',
      ),
      p(
        a({ href: '/id/docs/data' }, 'Dokumentasi pemuatan data'),
        ' · ',
        a({ href: '/id/docs/routing' }, 'Dokumentasi perutean'),
      ),
    ],
  })
