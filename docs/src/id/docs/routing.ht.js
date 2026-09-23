import { div, h2, p, table, tbody, td, th, thead, tr } from 'javascript-to-html'
import { code, codeBlock, pageCodeTabs, docsLayout } from '../../lib/id.js'
import {
  paramsHt,
  paramsJsx,
  paramsTemplate,
  structure,
} from '../../lib/snippets/routing.js'

function row(feature, file, url) {
  return tr(td(feature), td(file), td(url))
}

export default () =>
  docsLayout({
    title: 'Perutean',
    description: 'Perutean berbasis berkas, segmen dinamis, dan generateStaticParams.',
    activeHref: '/id/docs/routing',
    children: [
      p('Rute datang langsung dari sistem berkas di bawah ', code('src/'), '.'),
      codeBlock('project', structure, 'bash'),
      h2('Tabel rute'),
      div(
        { class: 'docs-table-scroll' },
        table(
          { class: 'docs-table' },
          thead(tr(th('Fitur'), th('Berkas'), th('URL'))),
          tbody(
            row('Statis', code('index.ht.js'), code('/')),
            row('Bersarang', code('blog/index.ht.js'), code('/blog')),
            row('Dinamis', code('blog/[slug].ht.js'), code('/blog/my-post')),
            row(
              'Beberapa parameter',
              code('blog/[year]/[slug].ht.js'),
              code('/blog/2026/my-post'),
            ),
            row('Penangkap semua', code('docs/[...path].ht.js'), code('/docs/api/auth')),
            row(
              'Penangkap semua opsional',
              code('docs/[...path]?.ht.js'),
              code('/docs + lebih dalam'),
            ),
            row('Grup rute', code('(admin)/users.ht.js'), code('/users')),
          ),
        ),
      ),
      p(
        'Rute yang lebih spesifik menang: statis mengalahkan dinamis, dinamis mengalahkan penangkap semua. Dua berkas yang menghasilkan URL sama adalah galat build.',
      ),
      h2('generateStaticParams'),
      p(
        'Rute dinamis menyatakan halaman mana yang dihasilkan saat build. Di ',
        code('sitelo'),
        ' (pengembangan), rute dinamis tetap dirender sesuai permintaan tanpa perlu mendaftar setiap parameter.',
      ),
      pageCodeTabs({
        file: 'src/blog/[slug].ht.js',
        template: paramsTemplate,
        ht: paramsHt,
        jsx: paramsJsx,
      }),
      p(
        'Nilainya bisa berupa string, angka, atau boolean — semuanya diubah menjadi string dan dikodekan untuk URL. Parameter penangkap semua menerima larik (',
        code("{ path: ['a', 'b'] }"),
        ') atau string berpemisah garis miring (',
        code("{ path: 'a/b' }"),
        ').',
      ),
      p(
        'Halaman dinamis yang menghasilkan nol rute akan mencetak peringatan, sehingga ia tidak bisa lenyap diam-diam dari situs Anda.',
      ),
    ],
  })
