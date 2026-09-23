import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, pageCodeTabs, examplesLayout } from '../../lib/id.js'
import { todoSnippets } from '../../lib/snippets/examples-todo.js'

const s = todoSnippets('id')

export default () =>
  examplesLayout({
    title: 'Aplikasi todo',
    description:
      'HTML statis dengan impor dinamis sebaris — penangannya memuat /js/todo.js sesuai kebutuhan.',
    activeHref: '/id/examples/todo',
    children: [
      p(
        'Antarmuka interaktif klasik tanpa framework frontend. sitelo membangun kerangka halamannya; atribut peristiwa memanggil ',
        code("import('/js/todo.js').then(…)"),
        ' sehingga modulnya dimuat hanya ketika dibutuhkan. Sumber lengkap di ',
        a(
          {
            href: 'https://github.com/paul-browne/sitelo/tree/main/examples/todo',
            rel: 'noopener',
          },
          'examples/todo',
        ),
        '.',
      ),
      h2('Yang Anda dapat'),
      ul(
        { class: 'docs-list' },
        li('HTML statis dengan penangan ', code('onsubmit'), ' / ', code('onload'), ' (dan item daftar)'),
        li(
          code('src/js/todo.js'),
          ' — ',
          code('hydrate'),
          ', ',
          code('handleSubmit'),
          ', ',
          code('handleChange'),
          ', ',
          code('handleRemove'),
          ' yang diekspor',
        ),
        li(
          'sitelo menemukan ',
          code('import(\'/…\')'),
          ' harfiah di dalam HTML dan membundel berkasnya ke ',
          code('dist/'),
          ' (lihat ',
          a({ href: '/id/docs/assets' }, 'Aset'),
          ')',
        ),
      ),
      h2('Tata letak proyek'),
      codeBlock('project', s.structure, 'bash'),
      h2('1. Impor sebaris di halaman'),
      p(
        'Tanpa ',
        code('<script type="module" src>'),
        '. Penangannya adalah atribut HTML yang mengimpor modulnya secara dinamis lalu memanggil sebuah ekspor, sambil meneruskan ',
        code('this'),
        ' (elemennya). Itu menjaga modul halaman tetap bebas dari API peramban (lihat ',
        a({ href: '/id/docs/pages#batasan-jsx' }, 'Batasan JSX'),
        ').',
      ),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.pageTemplate,
        ht: s.pageHt,
        jsx: s.pageJsx,
      }),
      h2('2. Penangan yang diekspor'),
      p(
        'Modulnya adalah berkas ES biasa di bawah ',
        code('src/js/'),
        '. Item daftar yang dibuat saat jalan memakai pola ',
        code('import(\'/js/todo.js\').then(…)'),
        ' yang sama untuk ',
        code('onchange'),
        ' / ',
        code('onclick'),
        '.',
      ),
      codeBlock('src/js/todo.js', s.todoJs, 'javascript'),
      h2('3. Jalankan'),
      codeBlock('shell', s.run, 'bash'),
      p(
        'Atau ',
        code('npm run build'),
        ' lalu hosting ',
        code('dist/'),
        ' di mana pun berkas statis disajikan.',
      ),
      p(
        a({ href: '/id/docs/assets' }, 'Aset dan gaya'),
        ' · ',
        a({ href: '/id/docs/pages#batasan-jsx' }, 'Batasan JSX'),
        ' · ',
        a({ href: '/id/examples/basic' }, 'Situs dasar'),
      ),
    ],
  })
