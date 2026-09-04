import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, examplesLayout, pageCodeTabs } from '../../lib/fr.js'
import { jsonSnippets } from '../../lib/snippets/examples-json.js'

const s = jsonSnippets('fr')

export default () =>
  examplesLayout({
    title: 'JSON local',
    description:
      'Un catalogue de produits construit entièrement à partir de fichiers JSON du dépôt — sans API ni base de données.',
    activeHref: '/fr/examples/json',
    children: [
      p(
        'Du contenu qui vit dans le dépôt en JSON, transformé en pages statiques par ',
        code('sitelo/data'),
        '. Pas d’API, pas de base de données, pas de JavaScript côté client. Source complète dans ',
        a(
          {
            href: 'https://github.com/paul-browne/sitelo/tree/main/examples/json',
            rel: 'noopener',
          },
          'examples/json',
        ),
        '.',
      ),
      h2('Ce que vous obtenez'),
      ul(
        { class: 'docs-list' },
        li('Une page d’accueil listant chaque catégorie et chaque produit'),
        li(
          code('/products/[slug]'),
          ' — une page statique par fichier dans ',
          code('data/products/'),
          '',
        ),
        li(
          code('/categories/[slug]'),
          ' — une page par clé de ',
          code('data/categories.json'),
          '',
        ),
        li('Ajouter un fichier JSON ajoute une page ; aucune route à déclarer'),
        li('Zéro JS envoyé — les fichiers sont lus dans Node au moment du build'),
      ),
      h2('Structure du projet'),
      codeBlock('project', s.structure, 'bash'),
      p(
        'Les données vivent hors de ',
        code('src/'),
        ', sitelo ne les traite donc jamais comme des pages ou des ressources.',
      ),
      h2('1. Mettez le contenu dans data/'),
      p(
        'Un fichier par produit. Le nom du fichier est le slug : ',
        code('aeron-chair.json'),
        ' devient ',
        code('/products/aeron-chair'),
        ' sans que rien dans le fichier ait à le dire :',
      ),
      codeBlock('data/products/aeron-chair.json', s.product, 'json'),
      p(
        'Les catégories tiennent au contraire dans un seul fichier : un objet indexé par slug, que ',
        code('readJsonCollection'),
        ' lit tout aussi bien comme une collection.',
      ),
      codeBlock('data/categories.json', s.categories, 'json'),
      h2('2. Lisez-le au même endroit'),
      p(
        'Un petit module côté serveur enveloppe les lectures. Rien dans le HTML n’y fait référence, il n’arrive donc jamais au navigateur — et comme ',
        code('sitelo/data'),
        ' mémorise par fichier, toutes les pages qui appellent ces helpers n’analysent chaque fichier JSON qu’une fois pour tout le build.',
      ),
      codeBlock('src/lib/catalogue.js', s.lib, 'javascript'),
      h2('3. Tout lister sur la page d’accueil'),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.indexTemplate,
        ht: s.indexHt,
        jsx: s.indexJsx,
      }),
      h2('4. Une page par fichier JSON'),
      p(
        code('generateStaticParams'),
        ' renvoie un slug par fichier au moment du build ; ',
        code('data()'),
        ' charge l’entrée correspondante pour chaque page.',
      ),
      pageCodeTabs({
        file: 'src/products/[slug].ht.js',
        template: s.slugTemplate,
        ht: s.slugHt,
        jsx: s.slugJsx,
      }),
      h2('5. Éditez et observez'),
      codeBlock('terminal', s.build, 'bash'),
      p(
        'Sous ',
        code('sitelo'),
        ', changer un prix recharge la page ouverte — le serveur de développement surveille les fichiers JSON que les pages lisent réellement. Slugs en double, fichiers manquants et JSON invalide font échouer le build en nommant le chemin fautif.',
      ),
      p(
        a({ href: '/fr/docs/data' }, 'Documentation du chargement de données'),
        ' · ',
        a({ href: '/fr/docs/routing' }, 'Documentation du routage'),
        ' · ',
        a({ href: '/fr/docs/configuration' }, 'Documentation de la configuration'),
      ),
    ],
  })
