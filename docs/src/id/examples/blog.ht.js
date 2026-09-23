import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, pageCodeTabs, examplesLayout } from '../../lib/id.js'
import { blogSnippets } from '../../lib/snippets/examples-blog.js'

const s = blogSnippets('id')

export default () =>
  examplesLayout({
    title: 'Blog Markdown',
    description:
      'Folder berisi berkas markdown → blog statis dengan umpan RSS, dibangun dengan sitelo dan marked.',
    activeHref: '/id/examples/blog',
    children: [
      p(
        'Kasus pemakaian situs statis yang paling khas: berkas markdown dalam sebuah folder, satu halaman statis per pos, umpan RSS, dan nol JavaScript sisi klien. Sumber lengkap di ',
        a(
          {
            href: 'https://github.com/paul-browne/sitelo/tree/main/examples/blog',
            rel: 'noopener',
          },
          'examples/blog',
        ),
        '.',
      ),
      h2('Yang Anda dapat'),
      ul(
        { class: 'docs-list' },
        li('Halaman beranda yang mendaftar pos, terbaru lebih dulu'),
        li(
          code('/blog/[slug]'),
          ' — satu halaman HTML statis per berkas markdown lewat ',
          code('generateStaticParams'),
        ),
        li(code('rss.xml'), ' — dihasilkan sitelo dari konfigurasi ', code('rss')),
        li(code('sitemap.xml'), ' — diaktifkan dengan menyetel ', code('site')),
        li('Nol JS diterbitkan — penguraian markdown terjadi saat build di Node'),
      ),
      h2('Tata letak proyek'),
      codeBlock('project', s.structure, 'bash'),
      codeBlock('sitelo.config.js', s.config, 'javascript'),
      h2('1. Tulis pos sebagai markdown'),
      p(
        'Pos tinggal di ',
        code('content/'),
        ' — di luar ',
        code('src/'),
        ', jadi sitelo tidak pernah menganggapnya halaman atau aset. Frontmatter berupa baris ',
        code('key: value'),
        ' biasa:',
      ),
      codeBlock('content/hello-world.md', s.post, 'markdown'),
      h2('2. Baca dan render di Node'),
      p(
        'Modul kecil khusus server membaca foldernya, mengurai frontmatter, dan merender markdown dengan ',
        a({ href: 'https://marked.js.org', rel: 'noopener' }, 'marked'),
        '. Karena tidak ada di HTML yang merujuk modul ini, ia tidak pernah sampai ke peramban.',
      ),
      codeBlock('src/lib/posts.js', s.lib, 'javascript'),
      h2('3. Daftarkan pos di beranda'),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.indexTemplate,
        ht: s.indexHt,
        jsx: s.indexJsx,
      }),
      h2('4. Satu halaman statis per pos'),
      p(
        code('generateStaticParams'),
        ' mengembalikan setiap slug saat build; ',
        code('data()'),
        ' memuat pos yang cocok untuk tiap halaman.',
      ),
      pageCodeTabs({
        file: 'src/blog/[slug].ht.js',
        template: s.slugTemplate,
        ht: s.slugHt,
        jsx: s.slugJsx,
      }),
      h2('5. RSS secara cuma-cuma'),
      p(
        'Dengan konfigurasi ',
        code('rss'),
        ' di atas, ',
        code('sitelo build'),
        ' menghasilkan ',
        code('dist/rss.xml'),
        ' dengan satu item untuk setiap halaman di bawah ',
        code('/blog'),
        ' — tanpa kode tambahan.',
      ),
      p(
        a({ href: '/id/docs/routing' }, 'Dokumentasi perutean'),
        ' · ',
        a({ href: '/id/docs/data' }, 'Dokumentasi pemuatan data'),
        ' · ',
        a({ href: '/id/docs/configuration' }, 'Dokumentasi konfigurasi'),
      ),
    ],
  })
