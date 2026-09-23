import { h2, p } from 'javascript-to-html'
import { code, pageCodeTabs, docsLayout } from '../../lib/id.js'
import {
  typedHt,
  typedJsx,
  typedTemplate,
} from '../../lib/snippets/typescript.js'

export default () =>
  docsLayout({
    title: 'TypeScript',
    description: 'Halaman bertipe dan parameter rute tersimpulkan dengan pembantu sitelo/page.',
    activeHref: '/id/docs/typescript',
    children: [
      p(
        'Halaman bisa berupa ',
        code('.ht.ts'),
        ' / ',
        code('.ht.tsx'),
        ' tanpa konfigurasi apa pun.',
      ),
      h2('definePageModule'),
      p(
        'Pembantu dari ',
        code('sitelo/page'),
        ' memberi penyimpulan tipe penuh. Saat build, impornya ditukar dengan modul hasil generasi per rute yang ',
        code('PageParams'),
        '-nya berasal dari nama berkas: ',
        code('[slug]'),
        ' → ',
        code('{ slug: string }'),
        ', ',
        code('[...path]'),
        ' → ',
        code('{ path: string[] }'),
        ', ',
        code('[...path]?'),
        ' → ',
        code('{ path?: string[] }'),
        '.',
      ),
      pageCodeTabs({
        file: 'src/blog/[slug].ht.ts',
        template: typedTemplate,
        ht: typedHt,
        jsx: typedJsx,
      }),
      p(
        'Juga diekspor: ',
        code('definePage'),
        ', ',
        code('defineData'),
        ', ',
        code('defineStaticParams'),
        '.',
      ),
      h2('Tipe hasil generasi'),
      p(
        'Deklarasi ditulis ke ',
        code('.sitelo/types/'),
        ' setiap kali server pengembangan atau build berjalan. Tambahkan folder itu ke ',
        code('.gitignore'),
        '.',
      ),
    ],
  })
