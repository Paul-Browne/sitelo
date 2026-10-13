import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, docsLayout, pageCodeTabs } from '../../lib/fr.js'
import { assetsSnippets } from '../../lib/snippets/assets.js'

const s = assetsSnippets('fr')

export default () =>
  docsLayout({
    title: 'Ressources et styles',
    description:
      'Comment sitelo compile le JavaScript et le CSS frontend avec Vite — et garde le code serveur hors du navigateur.',
    activeHref: '/fr/docs/assets',
    children: [
      p(
        'sitelo repose sur Vite : le JavaScript et le CSS frontend sont donc compilés automatiquement. Placez scripts et styles sous ',
        code('src/'),
        ' (par exemple ',
        code('src/js'),
        ' et ',
        code('src/css'),
        '), liez-les depuis votre HTML avec des URL relatives à la racine, et sitelo s’occupe du reste : TypeScript, imports CSS, bundling et minification.',
      ),
      h2('Structure du projet'),
      p(
        'Les pages et les ressources partagent ',
        code('src/'),
        '. Des dossiers comme ',
        code('js/'),
        ' et ',
        code('css/'),
        ' sont des conventions, pas des obligations — ce qui compte pour sitelo, c’est ce que votre HTML référence, pas le nom des dossiers.',
      ),
      codeBlock('project', s.layout, 'bash'),
      h2('Lier des ressources depuis le HTML'),
      p(
        'Référencez les fichiers avec des chemins relatifs à la racine. Un ',
        code('<script type="module">'),
        ' ou un ',
        code('<link rel="stylesheet">'),
        ' est ce qui indique à sitelo d’inclure ce fichier dans le build :',
      ),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.pageTemplate,
        ht: s.pageHt,
        jsx: s.pageJsx,
      }),
      codeBlock('src/js/main.js', s.js, 'javascript'),
      codeBlock('src/css/styles.css', s.css, 'css'),
      h2('Ce que Vite compile'),
      ul(
        { class: 'docs-list' },
        li(
          code('.js'),
          ' / ',
          code('.ts'),
          ' / ',
          code('.jsx'),
          ' / ',
          code('.tsx'),
          ' — regroupés en modules ES, TypeScript retiré, imports intégrés',
        ),
        li(
          code('.css'),
          ' — traité et minifié ; les ',
          code('@import'),
          ' et les références ',
          code('url()'),
          ' relatives sont résolus',
        ),
        li(
          'Tout ce qui est importé depuis une entrée référencée (comme le ',
          code('counter.ts'),
          ' ci-dessus) rejoint le même bundle',
        ),
        li(
          'Dans ',
          code('sitelo'),
          ' (dev), ces mêmes URL passent par le pipeline de transformation de Vite — aucun build séparé pour essayer TypeScript ou CSS',
        ),
      ),
      p(
        'Besoin de PostCSS, Sass ou d’autres plugins Vite ? Ajoutez-les sous ',
        code('vite'),
        ' dans ',
        a({ href: '/fr/docs/configuration' }, 'sitelo.config.js'),
        '.',
      ),
      h2('Zéro JS par défaut'),
      ul(
        { class: 'docs-list' },
        li(
          'Le code non référencé n’est pas émis. Un utilitaire importé uniquement depuis ',
          code('data()'),
          ' ou ',
          code('generateStaticParams'),
          ' reste hors de ',
          code('dist/'),
          ' — les secrets serveur ne sont jamais livrés par accident.',
        ),
        li(
          'Pas de ',
          code('<script>'),
          ' sur la page signifie pas de JavaScript client dans le build. Pour la plupart des sites, du HTML et du CSS statiques suffisent.',
        ),
        li(
          code('public/'),
          ' est copié tel quel (favicons, robots.txt, images statiques que vous ne voulez pas hachées).',
        ),
        li(
          'Les autres fichiers référencés (images, polices, vidéos, …) sont copiés dans ',
          code('dist/'),
          '.',
        ),
      ),
      h2('Validation des ressources manquantes'),
      p(
        'Un ',
        code('<script src>'),
        ' ou un ',
        code('href'),
        ' de feuille de style pointant vers un fichier absent de ',
        code('src/'),
        ' comme de ',
        code('public/'),
        ' fait échouer le build. Vous préférez un avertissement ?',
      ),
      codeBlock('sitelo.config.js', s.warn, 'javascript'),
    ],
  })
