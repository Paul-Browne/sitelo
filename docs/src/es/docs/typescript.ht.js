import { h2, p } from 'javascript-to-html'
import { code, docsLayout, pageCodeTabs } from '../../lib/es.js'
import {
  typedHt,
  typedJsx,
  typedTemplate,
} from '../../lib/snippets/typescript.js'

export default () =>
  docsLayout({
    title: 'TypeScript',
    description:
      'Páginas tipadas y parámetros de ruta inferidos con los ayudantes de sitelo/page.',
    activeHref: '/es/docs/typescript',
    children: [
      p(
        'Las páginas pueden ser ',
        code('.ht.ts'),
        ' / ',
        code('.ht.tsx'),
        ' sin ninguna configuración.',
      ),
      h2('definePageModule'),
      p(
        'Los ayudantes de ',
        code('sitelo/page'),
        ' dan inferencia de tipos completa. En tiempo de compilación, el import se sustituye por un módulo generado para cada ruta cuyos ',
        code('PageParams'),
        ' salen del nombre del archivo: ',
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
        'También se exportan: ',
        code('definePage'),
        ', ',
        code('defineData'),
        ', ',
        code('defineStaticParams'),
        '.',
      ),
      h2('Tipos generados'),
      p(
        'Las declaraciones se escriben en ',
        code('.sitelo/types/'),
        ' cada vez que arranca el servidor de desarrollo o se ejecuta una compilación. Añade esa carpeta a tu ',
        code('.gitignore'),
        '.',
      ),
    ],
  })
