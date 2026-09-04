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
      h2('Fichiers JSON locaux'),
      p(
        'Pas d’API ? Gardez le contenu dans le dépôt en JSON et lisez-le avec ',
        code('sitelo/data'),
        '.',
      ),
      codeBlock('project', s.jsonTree, 'bash'),
      codeBlock('src/blog/[slug].ht.js', s.jsonCollection, 'javascript'),
      p(
        'Les chemins relatifs sont résolus depuis la racine du projet : ',
        code('data/posts'),
        ' désigne la même chose d’où que vous lanciez la CLI. ',
        code('readJson'),
        ' renvoie un fichier analysé ; ',
        code('readJsonCollection'),
        ' renvoie un tableau d’entrées, chacune avec un ',
        code('slug'),
        ' — depuis un dossier de fichiers ',
        code('.json'),
        ' (un par entrée, slug tiré du nom de fichier) ou depuis un seul fichier contenant un tableau d’entrées ou un objet indexé par slug.',
      ),
      codeBlock('src/blog/[slug].ht.js', s.jsonSources, 'javascript'),
      h3('Options de collection'),
      ul(
        { class: 'docs-list' },
        li(
          code('slug'),
          ' — nom de champ ou fonction ; par défaut le nom de fichier, la clé de l’objet, ou le ',
          code('slug'),
          ' / ',
          code('id'),
          ' de l’entrée',
        ),
        li(
          code('sort'),
          ' — nom de champ (',
          code("'date'"),
          ' croissant, ',
          code("'-date'"),
          ' décroissant) ou une fonction de comparaison',
        ),
        li(
          code('recursive'),
          ' — inclure les fichiers ',
          code('.json'),
          ' des sous-dossiers, dont le chemin sert de slug',
        ),
        li(
          code('root'),
          ' — dossier depuis lequel les chemins relatifs sont résolus',
        ),
        li(
          code('cache'),
          ' — ',
          code("'auto'"),
          ' | ',
          code("'memory'"),
          ' | ',
          code("'none'"),
        ),
      ),
      p(
        'Les lectures sont mémorisées par fichier : un build de 500 pages n’analyse chaque fichier qu’une fois. Le serveur de développement vérifie la mtime et recharge le navigateur dès qu’un fichier JSON lu par une page change. Slugs en double, fichiers manquants et JSON invalide font échouer le build, chacun avec son chemin.',
      ),
    ],
  })
