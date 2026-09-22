import { h2, p } from 'javascript-to-html'
import { code, pageCodeTabs, docsLayout } from '../../lib/tr.js'
import {
  typedHt,
  typedJsx,
  typedTemplate,
} from '../../lib/snippets/typescript.js'

export default () =>
  docsLayout({
    title: 'TypeScript',
    description: 'sitelo/page yardımcılarıyla türlenmiş sayfalar ve çıkarımlı rota parametreleri.',
    activeHref: '/tr/docs/typescript',
    children: [
      p(
        'Sayfalar hiçbir yapılandırma olmadan ',
        code('.ht.ts'),
        ' / ',
        code('.ht.tsx'),
        ' olabilir.',
      ),
      h2('definePageModule'),
      p(
        code('sitelo/page'),
        ' içindeki yardımcılar tam tür çıkarımı sağlar. Derleme sırasında içe aktarma, ',
        code('PageParams'),
        ' değerleri dosya adından gelen, rotaya özgü üretilmiş bir modülle değiştirilir: ',
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
        'Ayrıca dışa aktarılanlar: ',
        code('definePage'),
        ', ',
        code('defineData'),
        ', ',
        code('defineStaticParams'),
        '.',
      ),
      h2('Üretilen türler'),
      p(
        'Bildirimler, geliştirme sunucusu ya da bir derleme her çalıştığında ',
        code('.sitelo/types/'),
        ' içine yazılır. Bu klasörü ',
        code('.gitignore'),
        ' dosyanıza ekleyin.',
      ),
    ],
  })
