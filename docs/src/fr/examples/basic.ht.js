import { a, h2, h3, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, examplesLayout, pageCodeTabs } from '../../lib/fr.js'
import { basicSnippets } from '../../lib/snippets/examples-basic.js'

const s = basicSnippets('fr')

export default () =>
  examplesLayout({
    title: 'Site de base',
    description:
      'Un projet sitelo minimal et les configurations de déploiement statique pour Netlify, Vercel, Cloudflare Pages et AWS Amplify.',
    activeHref: '/fr/examples/basic',
    children: [
      p(
        'Le plus petit site sitelo utile : une page, une feuille de style et des configurations d’hébergement qui publient ',
        code('dist/'),
        '. Copiez ces configurations dans n’importe quel projet sitelo — elles supposent seulement ',
        code('npm run build'),
        ' → ',
        code('dist/'),
        '.',
      ),
      p(
        'Une copie exécutable se trouve dans le dépôt sitelo, sous ',
        code('examples/basic/'),
        '.',
      ),
      h2('Ce que vous obtenez'),
      ul(
        { class: 'docs-list' },
        li('Un site statique d’une page construit avec sitelo'),
        li(
          code('netlify.toml'),
          ', ',
          code('vercel.json'),
          ', ',
          code('wrangler.toml'),
          ' et ',
          code('amplify.yml'),
        ),
        li('Déploiement en un clic ou par connexion du dépôt depuis le dossier de l’exemple'),
      ),
      h2('Structure du projet'),
      codeBlock('project', s.structure, 'bash'),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.pageTemplate,
        ht: s.pageHt,
        jsx: s.pageJsx,
      }),
      h2('Build'),
      codeBlock('shell', s.build, 'bash'),
      h2('Déploiement'),
      p(
        'Depuis le monorepo sitelo, réglez le répertoire racine ou de base de la plateforme sur ',
        code('examples/basic'),
        '.',
      ),
      h3('Netlify'),
      codeBlock('netlify.toml', s.netlifyToml, 'toml'),
      h3('Vercel'),
      codeBlock('vercel.json', s.vercelJson, 'json'),
      p(
        a(
          {
            href: 'https://vercel.com/new/clone?repository-url=https://github.com/paul-browne/sitelo&root-directory=examples/basic&project-name=sitelo-basic',
            rel: 'noopener',
          },
          'Déployer sur Vercel',
        ),
        ' · ',
        a(
          {
            href: 'https://app.netlify.com/start/deploy?repository=https://github.com/paul-browne/sitelo',
            rel: 'noopener',
          },
          'Déployer sur Netlify',
        ),
        ' (réglez le répertoire de base sur ',
        code('examples/basic'),
        ' quand on vous le demande).',
      ),
      h3('Cloudflare Pages'),
      p(
        'Tableau de bord : commande de build ',
        code('npm run build'),
        ', répertoire de sortie ',
        code('dist'),
        '. Ou ',
        code('npx wrangler pages deploy dist'),
        ' après un build local.',
      ),
      codeBlock('wrangler.toml', s.wranglerToml, 'toml'),
      h3('AWS Amplify'),
      p(
        'Connectez le dépôt dans Amplify Hosting. Pour du S3 + CloudFront simple, construisez en local et synchronisez ',
        code('dist/'),
        ' vers le bucket.',
      ),
      codeBlock('amplify.yml', s.amplifyYml, 'yaml'),
      p(
        'Vous travaillez avec Cursor, Copilot ou un autre agent ? Copiez le ',
        code('AGENTS.md'),
        ' de cet exemple (ou voir ',
        a({ href: '/fr/docs/build-with-ai' }, 'Créer avec l’IA'),
        ') pour que les outils n’inventent pas des schémas React/Next.',
      ),
      p(
        a({ href: '/fr/docs' }, 'Démarrage'),
        ' · ',
        a({ href: '/fr/docs/build-with-ai' }, 'Créer avec l’IA'),
        ' · ',
        a({ href: '/fr/examples/todo' }, 'Appli de tâches'),
        ' · ',
        a({ href: '/fr/examples/islands' }, 'Exemple d’îlots serveur'),
      ),
    ],
  })
