import { h2, p } from 'javascript-to-html'
import { code, codeBlock } from '../lib/code.js'
import { docsLayout } from '../lib/layout.js'

const typedSnippet = `// src/blog/[slug].ht.ts
import { definePageModule } from 'sitelo/page'

export default definePageModule({
  generateStaticParams: () => [{ slug: 'hello' }],
  data: ({ params }) => ({ title: params.slug }),
  render: ({ data }) => \`<html><body><h1>\${data.title}</h1></body></html>\`,
})`

export default () =>
  docsLayout({
    title: 'TypeScript',
    description: 'Typed pages and inferred route params with sitelo/page helpers.',
    activeHref: '/docs/typescript',
    children: [
      p(
        'Pages can be ',
        code('.ht.ts'),
        ' / ',
        code('.ht.tsx'),
        ' with zero configuration.',
      ),
      h2('definePageModule'),
      p(
        'Helpers from ',
        code('sitelo/page'),
        ' give full type inference. At build time the import is swapped for a per-route generated module whose ',
        code('PageParams'),
        ' come from the filename: ',
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
      codeBlock('src/blog/[slug].ht.ts', typedSnippet, 'javascript'),
      p(
        'Also exported: ',
        code('definePage'),
        ', ',
        code('defineData'),
        ', ',
        code('defineStaticParams'),
        '.',
      ),
      h2('Generated types'),
      p(
        'Declarations are written to ',
        code('.sitelo/types/'),
        ' whenever the dev server or a build runs. Add that folder to ',
        code('.gitignore'),
        '.',
      ),
    ],
  })
