import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, examplesLayout, pageCodeTabs } from '../../lib/fr.js'
import { blogSnippets } from '../../lib/snippets/examples-blog.js'

const s = blogSnippets('fr')

export default () =>
  examplesLayout({
    title: 'Blog en Markdown',
    description:
      'Un dossier de fichiers markdown → un blog statique avec flux RSS, construit avec sitelo et marked.',
    activeHref: '/fr/examples/blog',
    children: [
      p(
        'Le cas d’usage canonique du site statique : des fichiers markdown dans un dossier, une page statique par article, un flux RSS et zéro JavaScript côté client. Source complète dans ',
        a(
          {
            href: 'https://github.com/paul-browne/sitelo/tree/main/examples/blog',
            rel: 'noopener',
          },
          'examples/blog',
        ),
        '.',
      ),
      h2('Ce que vous obtenez'),
      ul(
        { class: 'docs-list' },
        li('Une page d’accueil listant les articles, du plus récent au plus ancien'),
        li(
          code('/blog/[slug]'),
          ' — une page HTML statique par fichier markdown, via ',
          code('generateStaticParams'),
        ),
        li(
          code('rss.xml'),
          ' — généré par sitelo à partir de la configuration ',
          code('rss'),
        ),
        li(code('sitemap.xml'), ' — activé en définissant ', code('site')),
        li('Zéro JS livré — le markdown est analysé au build, dans Node'),
      ),
      h2('Structure du projet'),
      codeBlock('project', s.structure, 'bash'),
      codeBlock('sitelo.config.js', s.config, 'javascript'),
      h2('1. Écrire les articles en markdown'),
      p(
        'Les articles vivent dans ',
        code('content/'),
        ' — hors de ',
        code('src/'),
        ', si bien que sitelo ne les traite jamais comme des pages ou des ressources. Le frontmatter est une simple suite de lignes ',
        code('clé: valeur'),
        ' :',
      ),
      codeBlock('content/hello-world.md', s.post, 'markdown'),
      h2('2. Les lire et les rendre dans Node'),
      p(
        'Un petit module côté serveur lit le dossier, analyse le frontmatter et rend le markdown avec ',
        a({ href: 'https://marked.js.org', rel: 'noopener' }, 'marked'),
        '. Comme rien dans le HTML ne référence ce module, il n’atteint jamais le navigateur.',
      ),
      codeBlock('src/lib/posts.js', s.lib, 'javascript'),
      h2('3. Lister les articles sur l’accueil'),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.indexTemplate,
        ht: s.indexHt,
        jsx: s.indexJsx,
      }),
      h2('4. Une page statique par article'),
      p(
        code('generateStaticParams'),
        ' renvoie tous les slugs au build ; ',
        code('data()'),
        ' charge l’article correspondant pour chaque page.',
      ),
      pageCodeTabs({
        file: 'src/blog/[slug].ht.js',
        template: s.slugTemplate,
        ht: s.slugHt,
        jsx: s.slugJsx,
      }),
      h2('5. Le RSS offert'),
      p(
        'Avec la configuration ',
        code('rss'),
        ' ci-dessus, ',
        code('sitelo build'),
        ' produit ',
        code('dist/rss.xml'),
        ' avec une entrée pour chaque page sous ',
        code('/blog'),
        ' — sans code supplémentaire.',
      ),
      p(
        a({ href: '/fr/docs/routing' }, 'Docs du routage'),
        ' · ',
        a({ href: '/fr/docs/data' }, 'Docs du chargement de données'),
        ' · ',
        a({ href: '/fr/docs/configuration' }, 'Docs de configuration'),
      ),
    ],
  })
