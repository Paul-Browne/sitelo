import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, docsLayout, pageCodeTabs } from '../../lib/fr.js'
import { gettingStartedSnippets } from '../../lib/snippets/getting-started.js'

const s = gettingStartedSnippets('fr')

export default () =>
  docsLayout({
    title: 'Démarrage',
    description: 'Installez sitelo et créez votre premier site statique.',
    activeHref: '/fr/docs',
    children: [
      p(
        'sitelo est un générateur de sites statiques sans configuration, propulsé par Vite. Installez un seul paquet, écrivez des fonctions qui renvoient du HTML, puis lancez ',
        code('sitelo build'),
        '.',
      ),
      h2('Installation'),
      codeBlock('shell', s.install, 'bash'),
      p(
        'Nécessite Node 20.19+ (ou 22.12+). Vite est inclus — inutile de l’installer séparément.',
      ),
      h2('Votre première page'),
      p(
        'Créez ',
        code('src/index.ht.js'),
        ' (ou ',
        code('.ht.jsx'),
        '). Nous recommandons ',
        a({ href: 'https://ht.js.org', rel: 'noopener' }, 'ht.js'),
        ' :',
      ),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.pageTemplate,
        ht: s.pageHt,
        jsx: s.pageJsx,
      }),
      h2('Lancer'),
      codeBlock('shell', s.run, 'bash'),
      p(
        'Cela produit ',
        code('dist/index.html'),
        ' (avec ',
        code('<!DOCTYPE html>'),
        ' ajouté pour vous) ainsi qu’un ',
        code('404.html'),
        ' par défaut.',
      ),
      h2('Et ensuite'),
      ul(
        { class: 'docs-list' },
        li(
          a({ href: '/fr/docs/pages' }, 'Écrire des pages'),
          ' — gabarits de chaîne, JSX, modules structurés',
        ),
        li(
          a({ href: '/fr/docs/routing' }, 'Routage'),
          ' — routes basées sur les fichiers et ',
          code('generateStaticParams'),
        ),
        li(
          a({ href: '/fr/docs/data' }, 'Chargement de données'),
          ' — ',
          code('data()'),
          ' et ',
          code('fetchWithCache'),
        ),
        li(
          a({ href: '/fr/docs/assets' }, 'Ressources et styles'),
          ' — JS/CSS frontend compilés par Vite (',
          code('src/js'),
          ', ',
          code('src/css'),
          ')',
        ),
        li(
          a({ href: '/fr/docs/configuration' }, 'Configuration'),
          ' — ',
          code('sitelo.config.js'),
          ' et options Vite',
        ),
        li(
          a({ href: '/fr/docs/build-with-ai' }, 'Créer avec l’IA'),
          ' — ',
          code('llms.txt'),
          ', règles de projet et conseils pour les agents',
        ),
      ),
    ],
  })
