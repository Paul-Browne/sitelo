import { h2, p } from 'javascript-to-html'
import { code, docsLayout, pageCodeTabs } from '../../lib/de.js'
import {
  typedHt,
  typedJsx,
  typedTemplate,
} from '../../lib/snippets/typescript.js'

export default () =>
  docsLayout({
    title: 'TypeScript',
    description:
      'Typisierte Seiten und abgeleitete Routenparameter mit den Helfern aus sitelo/page.',
    activeHref: '/de/docs/typescript',
    children: [
      p(
        'Seiten können ohne jede Konfiguration ',
        code('.ht.ts'),
        ' / ',
        code('.ht.tsx'),
        ' sein.',
      ),
      h2('definePageModule'),
      p(
        'Die Helfer aus ',
        code('sitelo/page'),
        ' liefern vollständige Typinferenz. Beim Build wird der Import durch ein pro Route generiertes Modul ersetzt, dessen ',
        code('PageParams'),
        ' aus dem Dateinamen stammen: ',
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
        'Ebenfalls exportiert: ',
        code('definePage'),
        ', ',
        code('defineData'),
        ', ',
        code('defineStaticParams'),
        '.',
      ),
      h2('Generierte Typen'),
      p(
        'Die Deklarationen werden nach ',
        code('.sitelo/types/'),
        ' geschrieben, sobald der Entwicklungsserver läuft oder ein Build startet. Nimm diesen Ordner in deine ',
        code('.gitignore'),
        ' auf.',
      ),
    ],
  })
