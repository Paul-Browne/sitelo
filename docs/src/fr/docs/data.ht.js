import { h2, h3, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, docsLayout, pageCodeTabs } from '../../lib/fr.js'
import { dataSnippets } from '../../lib/snippets/data.js'

const s = dataSnippets('fr')

export default () =>
  docsLayout({
    title: 'Chargement de données',
    description:
      'data() au build et fetchWithCache pour les sites statiques alimentés par une API.',
    activeHref: '/fr/docs/data',
    children: [
      p(
        'Exportez une fonction ',
        code('data()'),
        ' et son résultat apparaît comme ',
        code('ctx.data'),
        ' dans votre fonction de rendu. Elle s’exécute au build, et à chaque requête dans le serveur de développement.',
      ),
      pageCodeTabs({
        file: 'src/blog/[slug].ht.js',
        template: s.dataTemplate,
        ht: s.dataHt,
        jsx: s.dataJsx,
      }),
      h2('fetchWithCache'),
      p(
        'Vous générez de nombreuses pages depuis la même API ? Importez ',
        code('fetchWithCache'),
        ' depuis sitelo :',
      ),
      codeBlock('src/blog/[slug].ht.js', s.cache, 'javascript'),
      h3('Options'),
      ul(
        { class: 'docs-list' },
        li(
          code('maxAge'),
          ' — durée de vie du cache en secondes (par défaut ',
          code('3600'),
          ')',
        ),
        li(
          code('cacheKey'),
          ' — clé personnalisée (par défaut : hachage de l’URL + méthode + en-têtes + corps)',
        ),
        li(code('forceRefresh'), ' — contourne le cache'),
        li(
          code('cache'),
          ' — ',
          code("'auto'"),
          ' | ',
          code("'memory'"),
          ' | ',
          code("'fs'"),
          ' | ',
          code("'none'"),
        ),
      ),
      h3('Modes de cache'),
      ul(
        { class: 'docs-list' },
        li(
          code('auto'),
          ' (par défaut) — mémoire en développement, système de fichiers pour les builds de production',
        ),
        li(
          code('memory'),
          ' — dans le processus, vidé à la fin de celui-ci',
        ),
        li(code('fs'), ' — persisté dans ', code('node_modules/.cache/')),
        li(code('none'), ' — récupère toujours'),
      ),
      p(
        'Seules les requêtes ',
        code('GET'),
        ' sont mises en cache par défaut (passez un ',
        code('cacheKey'),
        ' pour mettre en cache d’autres méthodes). Les réponses en erreur ne sont jamais mises en cache.',
      ),
    ],
  })
