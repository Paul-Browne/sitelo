import { a, h2, h3, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, examplesLayout, pageCodeTabs } from '../../lib/fr.js'
import { wordpressSnippets } from '../../lib/snippets/examples-wordpress.js'

const s = wordpressSnippets('fr')

export default () =>
  examplesLayout({
    title: 'WordPress',
    description:
      'Aspirez tout un site WordPress via l’API REST — des milliers d’articles, générés statiquement avec sitelo.',
    activeHref: '/fr/examples/wordpress',
    children: [
      p(
        'Traitez WordPress comme un CMS headless et ',
        'aspirez le site entier',
        ' : paginez ',
        code('/wp-json/wp/v2/posts'),
        ', générez un fichier HTML par slug, et mettez les réponses de l’API en cache entre les builds.',
      ),
      h2('Ce que vous obtenez'),
      ul(
        { class: 'docs-list' },
        li('Une page d’accueil listant les articles récents'),
        li(code('/blog'), ' — archive complète de tous les articles'),
        li(
          code('/blog/[slug]'),
          ' — une page HTML statique par article (tient à des milliers d’articles)',
        ),
        li(
          code('fetchWithCache'),
          ', pour que les rebuilds réutilisent les réponses WP au lieu de tout retélécharger',
        ),
      ),
      h2('Structure du projet'),
      codeBlock('project', s.structure, 'bash'),
      codeBlock('sitelo.config.js', s.config, 'javascript'),
      h2('1. Pointer vers votre site WordPress'),
      p(
        'L’API REST est active par défaut sur les WordPress modernes. Vérifiez-le sur ',
        code('https://votre-site.com/wp-json/wp/v2/posts'),
        '.',
      ),
      p(
        'Définissez ',
        code('WP_URL'),
        ' dans l’environnement (ou codez-le en dur le temps d’expérimenter) :',
      ),
      codeBlock('.env', s.env, 'bash'),
      h2('2. Utilitaires WordPress partagés'),
      p(
        code('getAllPosts()'),
        ' lit ',
        code('X-WP-TotalPages'),
        ' et parcourt toutes les pages (WordPress plafonne ',
        code('per_page'),
        ' à 100). Sautez ',
        code('_embed'),
        ' pendant la collecte des slugs — ne récupérez les embeds que pour chaque article.',
      ),
      codeBlock('src/lib/wordpress.js', s.wpLib, 'javascript'),
      h2('3. Page d’accueil'),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.homeTemplate,
        ht: s.homeHt,
        jsx: s.homeJsx,
      }),
      h2('4. Index du blog'),
      p(
        'Utilisez ',
        code('getAllPosts()'),
        ' pour que l’archive ne soit pas plafonnée à 50–100 éléments.',
      ),
      pageCodeTabs({
        file: 'src/blog/index.ht.js',
        template: s.blogIndexTemplate,
        ht: s.blogIndexHt,
        jsx: s.blogIndexJsx,
      }),
      h2('5. Transformer chaque article en page statique'),
      p(
        code('generateStaticParams'),
        ' doit renvoyer ',
        'tous',
        ' les slugs que vous voulez dans ',
        code('dist/'),
        '. Paginez l’API ici — n’appelez pas ',
        code('getPosts({ perPage: 100 })'),
        ' une seule fois pour vous arrêter là.',
      ),
      pageCodeTabs({
        file: 'src/blog/[slug].ht.js',
        template: s.blogPostTemplate,
        ht: s.blogPostHt,
        jsx: s.blogPostJsx,
      }),
      h2('6. Build'),
      codeBlock('shell', s.build, 'bash'),
      p(
        'Le premier build passe une fois par WordPress et remplit le cache de fetch. Les suivants réutilisent les réponses de liste et de détail mises en cache (',
        code("cache: 'auto'"),
        ' → système de fichiers en production) jusqu’à expiration de ',
        code('maxAge'),
        '. Augmentez ',
        code('renderConcurrency'),
        ' dans ',
        code('sitelo.config.js'),
        ' si vous rendez des milliers de pages d’articles.',
      ),
      h2('Remarques'),
      h3('Le HTML venu de WordPress'),
      p(
        code('title.rendered'),
        ' et ',
        code('content.rendered'),
        ' sont des chaînes HTML fournies par WP. Insérez-les telles quelles dans votre gabarit (comme ci-dessus), ou nettoyez-les si vous ne faites pas entièrement confiance au CMS.',
      ),
      h3('Contenu privé'),
      p(
        'Les routes REST publiques n’exposent que les articles publiés. Pour les brouillons ou une authentification personnalisée, passez des en-têtes dans le deuxième argument de ',
        code('fetchWithCache'),
        ' (l’init ',
        code('fetch'),
        ' standard) et utilisez un ',
        code('cacheKey'),
        ' stable.',
      ),
      p(
        a({ href: '/fr/docs/data' }, 'Docs du chargement de données'),
        ' · ',
        a({ href: '/fr/docs/routing' }, 'Docs du routage'),
      ),
    ],
  })
