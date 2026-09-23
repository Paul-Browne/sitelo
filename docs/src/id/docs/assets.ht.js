import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, pageCodeTabs, docsLayout } from '../../lib/id.js'
import { assetsSnippets } from '../../lib/snippets/assets.js'

const s = assetsSnippets('id')

export default () =>
  docsLayout({
    title: 'Aset dan gaya',
    description:
      'Bagaimana sitelo mengompilasi JavaScript dan CSS frontend dengan Vite — dan menjauhkan kode khusus server dari peramban.',
    activeHref: '/id/docs/assets',
    children: [
      p(
        'sitelo dibangun di atas Vite, jadi JavaScript dan CSS frontend dikompilasi otomatis. Taruh skrip dan gaya di bawah ',
        code('src/'),
        ' (misalnya ',
        code('src/js'),
        ' dan ',
        code('src/css'),
        '), tautkan dari HTML Anda dengan URL relatif-akar, dan sitelo mengurus sisanya — TypeScript, impor CSS, pembundelan, dan minifikasi.',
      ),
      h2('Tata letak proyek'),
      p(
        'Halaman dan aset berbagi ',
        code('src/'),
        '. Folder seperti ',
        code('js/'),
        ' dan ',
        code('css/'),
        ' adalah konvensi, bukan keharusan — yang dipedulikan sitelo adalah apa yang dirujuk HTML Anda, bukan nama foldernya.',
      ),
      codeBlock('project', s.layout, 'bash'),
      h2('Menautkan aset dari HTML'),
      p(
        'Rujuk berkas dengan jalur relatif-akar. Sebuah ',
        code('<script type="module">'),
        ' atau ',
        code('<link rel="stylesheet">'),
        ' itulah yang memberi tahu sitelo untuk menyertakan berkas tersebut dalam build:',
      ),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.pageTemplate,
        ht: s.pageHt,
        jsx: s.pageJsx,
      }),
      codeBlock('src/js/main.js', s.js, 'javascript'),
      codeBlock('src/css/styles.css', s.css, 'css'),
      h2('Yang dikompilasi Vite'),
      ul(
        { class: 'docs-list' },
        li(
          code('.js'),
          ' / ',
          code('.ts'),
          ' / ',
          code('.jsx'),
          ' / ',
          code('.tsx'),
          ' — dibundel sebagai modul ES, TypeScript dilucuti, impor disisipkan',
        ),
        li(
          code('.css'),
          ' — diproses dan diminifikasi; rujukan ',
          code('@import'),
          ' dan ',
          code('url()'),
          ' relatif diselesaikan',
        ),
        li(
          'Apa pun yang diimpor dari entri yang dirujuk (seperti ',
          code('counter.ts'),
          ' di atas) ditarik ke bundel yang sama',
        ),
        li(
          'Di ',
          code('sitelo'),
          ' (pengembangan), URL yang sama melewati jalur transformasi Vite — tidak perlu langkah build terpisah untuk mencoba TypeScript atau CSS',
        ),
      ),
      p(
        'Butuh PostCSS, Sass, atau plugin Vite lain? Tambahkan di bawah ',
        code('vite'),
        ' dalam ',
        a({ href: '/id/docs/configuration' }, 'sitelo.config.js'),
        '.',
      ),
      h2('Nol JS secara bawaan'),
      ul(
        { class: 'docs-list' },
        li(
          'Kode yang tidak dirujuk tidak dihasilkan. Pembantu yang hanya diimpor dari ',
          code('data()'),
          ' atau ',
          code('generateStaticParams'),
          ' tetap di luar ',
          code('dist/'),
          ' — rahasia khusus server tidak pernah ikut terkirim tanpa sengaja.',
        ),
        li(
          'Tidak ada ',
          code('<script>'),
          ' di halaman berarti tidak ada JavaScript klien dalam build. HTML dan CSS statis sudah cukup untuk sebagian besar situs.',
        ),
        li(
          code('public/'),
          ' disalin apa adanya (favicon, robots.txt, gambar statis yang tidak ingin Anda beri hash).',
        ),
        li('Berkas lain yang dirujuk (gambar, fon, video, …) disalin ke ', code('dist/'), '.'),
      ),
      h2('Validasi aset yang hilang'),
      p(
        'Sebuah ',
        code('<script src>'),
        ' atau ',
        code('href'),
        ' lembar gaya yang menunjuk berkas yang tidak ada di ',
        code('src/'),
        ' maupun ',
        code('public/'),
        ' akan menggagalkan build. Lebih suka peringatan?',
      ),
      codeBlock('sitelo.config.js', s.warn, 'javascript'),
    ],
  })
