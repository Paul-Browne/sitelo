import { h2, p } from 'javascript-to-html'
import { code, docsLayout, pageCodeTabs } from '../../lib/pl.js'
import {
  typedHt,
  typedJsx,
  typedTemplate,
} from '../../lib/snippets/typescript.js'

export default () =>
  docsLayout({
    title: 'TypeScript',
    description:
      'Typowane strony i wywnioskowane parametry tras dzięki pomocnikom z sitelo/page.',
    activeHref: '/pl/docs/typescript',
    children: [
      p(
        'Strony mogą być plikami ',
        code('.ht.ts'),
        ' / ',
        code('.ht.tsx'),
        ' bez żadnej konfiguracji.',
      ),
      h2('definePageModule'),
      p(
        'Pomocniki z ',
        code('sitelo/page'),
        ' dają pełne wnioskowanie typów. Podczas buildu import zostaje podmieniony na wygenerowany moduł dla danej trasy, którego ',
        code('PageParams'),
        ' biorą się z nazwy pliku: ',
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
        'Eksportowane są także: ',
        code('definePage'),
        ', ',
        code('defineData'),
        ', ',
        code('defineStaticParams'),
        '.',
      ),
      h2('Generowane typy'),
      p(
        'Deklaracje trafiają do ',
        code('.sitelo/types/'),
        ' przy każdym uruchomieniu serwera deweloperskiego albo buildu. Dodaj ten katalog do ',
        code('.gitignore'),
        '.',
      ),
    ],
  })
