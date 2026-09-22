import { h2, p } from 'javascript-to-html'
import { code, docsLayout, pageCodeTabs } from '../../lib/it.js'
import {
  typedHt,
  typedJsx,
  typedTemplate,
} from '../../lib/snippets/typescript.js'

export default () =>
  docsLayout({
    title: 'TypeScript',
    description:
      'Pagine tipizzate e parametri di rotta inferiti con gli helper di sitelo/page.',
    activeHref: '/it/docs/typescript',
    children: [
      p(
        'Le pagine possono essere ',
        code('.ht.ts'),
        ' / ',
        code('.ht.tsx'),
        ' senza alcuna configurazione.',
      ),
      h2('definePageModule'),
      p(
        'Gli helper di ',
        code('sitelo/page'),
        ' danno inferenza completa dei tipi. In fase di build l’import viene sostituito con un modulo generato per ogni rotta, i cui ',
        code('PageParams'),
        ' derivano dal nome del file: ',
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
        'Vengono esportati anche: ',
        code('definePage'),
        ', ',
        code('defineData'),
        ', ',
        code('defineStaticParams'),
        '.',
      ),
      h2('Tipi generati'),
      p(
        'Le dichiarazioni vengono scritte in ',
        code('.sitelo/types/'),
        ' ogni volta che parte il server di sviluppo o una build. Aggiungi quella cartella al ',
        code('.gitignore'),
        '.',
      ),
    ],
  })
