import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, pageCodeTabs, docsLayout } from '../../lib/id.js'
import { gettingStartedSnippets } from '../../lib/snippets/getting-started.js'

const s = gettingStartedSnippets('id')

export default () =>
  docsLayout({
    title: 'Memulai',
    description: 'Pasang sitelo dan bangun situs statis pertama Anda.',
    activeHref: '/id/docs',
    children: [
      p(
        'sitelo adalah pembuat situs statis tanpa konfigurasi yang ditenagai Vite. Pasang satu paket, tulis fungsi yang mengembalikan HTML, lalu jalankan ',
        code('sitelo build'),
        '.',
      ),
      h2('Pemasangan'),
      codeBlock('shell', s.install, 'bash'),
      p('Membutuhkan Node 20.19+ (atau 22.12+). Vite sudah termasuk — Anda tidak memasangnya terpisah.'),
      h2('Halaman pertama Anda'),
      p(
        'Buat ',
        code('src/index.ht.js'),
        ' (atau ',
        code('.ht.jsx'),
        '). ',
        a({ href: 'https://ht.js.org', rel: 'noopener' }, 'ht.js'),
        ' disarankan:',
      ),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.pageTemplate,
        ht: s.pageHt,
        jsx: s.pageJsx,
      }),
      h2('Menjalankan'),
      codeBlock('shell', s.run, 'bash'),
      p(
        'Itu menghasilkan ',
        code('dist/index.html'),
        ' (dengan ',
        code('<!DOCTYPE html>'),
        ' ditambahkan untuk Anda) beserta ',
        code('404.html'),
        ' bawaan.',
      ),
      h2('Berikutnya'),
      ul(
        { class: 'docs-list' },
        li(a({ href: '/id/docs/pages' }, 'Menulis halaman'), ' — string templat, JSX, modul terstruktur'),
        li(a({ href: '/id/docs/routing' }, 'Perutean'), ' — rute berbasis berkas dan ', code('generateStaticParams')),
        li(a({ href: '/id/docs/data' }, 'Memuat data'), ' — ', code('data()'), ' dan ', code('fetchWithCache')),
        li(
          a({ href: '/id/docs/assets' }, 'Aset dan gaya'),
          ' — JS/CSS frontend yang dikompilasi Vite (',
          code('src/js'),
          ', ',
          code('src/css'),
          ')',
        ),
        li(a({ href: '/id/docs/configuration' }, 'Konfigurasi'), ' — ', code('sitelo.config.js'), ' dan opsi Vite'),
        li(a({ href: '/id/docs/build-with-ai' }, 'Membangun dengan AI'), ' — ', code('llms.txt'), ', aturan proyek, dan kiat agen'),
      ),
    ],
  })
