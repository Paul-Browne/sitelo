import { h2, p } from 'javascript-to-html'
import { code, docsLayout, pageCodeTabs } from '../../lib/fr.js'
import {
  typedHt,
  typedJsx,
  typedTemplate,
} from '../../lib/snippets/typescript.js'

export default () =>
  docsLayout({
    title: 'TypeScript',
    description:
      'Pages typées et paramètres de route inférés avec les utilitaires sitelo/page.',
    activeHref: '/fr/docs/typescript',
    children: [
      p(
        'Les pages peuvent être en ',
        code('.ht.ts'),
        ' / ',
        code('.ht.tsx'),
        ' sans aucune configuration.',
      ),
      h2('definePageModule'),
      p(
        'Les utilitaires de ',
        code('sitelo/page'),
        ' offrent une inférence de types complète. Au build, l’import est remplacé par un module généré pour chaque route, dont les ',
        code('PageParams'),
        ' proviennent du nom de fichier : ',
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
        'Également exportés : ',
        code('definePage'),
        ', ',
        code('defineData'),
        ', ',
        code('defineStaticParams'),
        '.',
      ),
      h2('Types générés'),
      p(
        'Les déclarations sont écrites dans ',
        code('.sitelo/types/'),
        ' à chaque démarrage du serveur de développement ou build. Ajoutez ce dossier à votre ',
        code('.gitignore'),
        '.',
      ),
    ],
  })
