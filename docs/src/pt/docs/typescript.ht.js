import { h2, p } from 'javascript-to-html'
import { code, docsLayout, pageCodeTabs } from '../../lib/pt.js'
import {
  typedHt,
  typedJsx,
  typedTemplate,
} from '../../lib/snippets/typescript.js'

export default () =>
  docsLayout({
    title: 'TypeScript',
    description:
      'Páginas tipadas e parâmetros de rota inferidos com os auxiliares de sitelo/page.',
    activeHref: '/pt/docs/typescript',
    children: [
      p(
        'As páginas podem ser ',
        code('.ht.ts'),
        ' / ',
        code('.ht.tsx'),
        ' sem configuração nenhuma.',
      ),
      h2('definePageModule'),
      p(
        'Os auxiliares de ',
        code('sitelo/page'),
        ' dão inferência de tipos completa. Na compilação, o import é substituído por um módulo gerado para cada rota, cujos ',
        code('PageParams'),
        ' vêm do nome do ficheiro: ',
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
        'Também são exportados: ',
        code('definePage'),
        ', ',
        code('defineData'),
        ', ',
        code('defineStaticParams'),
        '.',
      ),
      h2('Tipos gerados'),
      p(
        'As declarações são escritas em ',
        code('.sitelo/types/'),
        ' sempre que o servidor de desenvolvimento arranca ou uma compilação corre. Acrescenta essa pasta ao teu ',
        code('.gitignore'),
        '.',
      ),
    ],
  })
