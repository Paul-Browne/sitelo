import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, docsLayout } from '../../lib/id.js'
import { cliSnippets } from '../../lib/snippets/cli.js'

const s = cliSnippets('id')

export default () =>
  docsLayout({
    title: 'CLI',
    description: 'sitelo dev, build, preview, dan flag yang umum dipakai.',
    activeHref: '/id/docs/cli',
    children: [
      p(
        'CLI ',
        code('sitelo'),
        ' membungkus Vite yang sudah disertakan dan menyuntikkan plugin halaman HTML secara otomatis.',
      ),
      h2('Perintah'),
      codeBlock('shell', s.commands, 'bash'),
      ul(
        { class: 'docs-list' },
        li(code('dev'), ' — perenderan SSR sungguhan sesuai permintaan, termasuk rute dinamis, plus bilah alat pengembangan kecil'),
        li(code('build'), ' — HTML statis di ', code('dist/'), ' (atau ', code('outDir'), ' Anda)'),
        li(code('preview'), ' — menyajikan build produksi secara lokal'),
        li(
          code('lighthouse'),
          ' — mengaudit build produksi (membutuhkan dependensi rekan ',
          code('lighthouse'),
          ')',
        ),
      ),
      p(
        'Matikan bilah alat dengan ',
        code('devToolbar: false'),
        ' di ',
        code('sitelo.config.js'),
        ' — lihat ',
        a({ href: '/id/docs/configuration' }, 'Konfigurasi'),
        '.',
      ),
      h2('Flag yang berguna'),
      codeBlock('shell', s.flags, 'bash'),
      ul(
        { class: 'docs-list' },
        li(code('--port'), ' / ', code('--host'), ' / ', code('--open'), ' — server'),
        li(code('--outDir'), ' / ', code('--emptyOutDir'), ' / ', code('--base'), ' — build'),
        li(code('--root'), ' — akar proyek (praktis untuk situs ', code('docs/'), ')'),
        li(code('--config'), ' — berkas konfigurasi Vite khusus'),
        li(code('--mode'), ' / ', code('--logLevel'), ' / ', code('--debug')),
      ),
      p(
        'Untuk apa pun yang Anda pakai ulang di berbagai perintah, pilih opsi Vite di ',
        code('sitelo.config.js'),
        ' di bawah ',
        code('vite'),
        '.',
      ),
      h2('Menemukan kode yang tidak terpakai'),
      p(
        a({ href: 'https://knip.dev' }, 'knip'),
        ' menemukan berkas, ekspor, dan dependensi yang tidak dipakai apa pun. Pada proyek sitelo ia butuh satu petunjuk: halaman dan island ditemukan dari sistem berkas, jadi tidak ada yang mengimpornya, dan tanpa diberi tahu knip akan melaporkan seluruh situs sebagai berkas tak terpakai.',
      ),
      codeBlock('shell', s.knipInstall, 'bash'),
      codeBlock('knip.js', s.knip, 'javascript'),
      codeBlock('shell', s.knipRun, 'bash'),
      p(
        code('knipConfig()'),
        ' membaca ',
        code('sitelo.config.js'),
        ' Anda dan menandai halaman serta island sebagai titik masuk, dengan cara yang sama seperti build menemukannya — ',
        code('pagesDir'),
        ', ',
        code('pageExtensions'),
        ', ',
        code('include'),
        ', dan ',
        code('exclude'),
        ' semuanya berlaku. Yang tersisa di laporan adalah kode yang benar-benar tidak pernah dicapai situs.',
      ),
      p(
        'Satu hal yang tidak bisa dilihatnya: skrip klien yang dirujuk halaman lewat URL alih-alih impor, seperti ',
        code('<script src="/js/app.js">'),
        '. Daftarkan sendiri yang seperti itu, dan sertakan apa pun lain yang diterima knip — semuanya disebar ke hasilnya. Tanda ',
        code('!'),
        ' di akhir adalah penanda knip untuk kode produksi, dan skrip yang dikirim ke peramban memang itu.',
      ),
      codeBlock('knip.js', s.knipEntry, 'javascript'),
    ],
  })
