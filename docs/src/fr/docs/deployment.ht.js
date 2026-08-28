import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, docsLayout } from '../../lib/fr.js'
import { deploymentSnippets } from '../../lib/snippets/deployment.js'

const s = deploymentSnippets('fr')

export default () =>
  docsLayout({
    title: 'Déploiement',
    description:
      'Déployez un site sitelo sur Netlify, Vercel, Cloudflare Pages, AWS Amplify, GitHub Pages ou tout hébergeur statique.',
    activeHref: '/fr/docs/deployment',
    children: [
      p(
        'Un build sitelo, ce sont de simples fichiers statiques : ',
        code('sitelo build'),
        ' écrit du HTML, du CSS et du JS dans ',
        code('dist/'),
        '. N’importe quel hébergeur statique convient — les configurations ci-dessous supposent seulement ',
        code('npm run build'),
        ' → ',
        code('dist/'),
        '.',
      ),
      p(
        'Les URL propres sont des répertoires contenant un ',
        code('index.html'),
        ' (',
        code('/about/index.html'),
        ' → ',
        code('/about'),
        '), donc les jolies URL fonctionnent d’emblée, sans règle de redirection. Un ',
        code('404.html'),
        ' est émis automatiquement — la convention que comprennent Netlify, Cloudflare Pages et GitHub Pages.',
      ),
      p(
        'Des versions prêtes à copier de tout ceci sont fournies dans l’',
        a({ href: '/examples/basic' }, 'exemple de base'),
        ' (',
        a(
          {
            href: 'https://github.com/paul-browne/sitelo/tree/main/examples/basic',
            rel: 'noopener',
          },
          'examples/basic',
        ),
        ' dans le dépôt ; les exemples sont en anglais).',
      ),
      h2('Netlify'),
      codeBlock('netlify.toml', s.netlify, 'bash'),
      h2('Vercel'),
      codeBlock('vercel.json', s.vercel, 'javascript'),
      h2('Cloudflare Pages'),
      p(
        'Builds depuis le tableau de bord : indiquez la commande de build ',
        code('npm run build'),
        ' et le répertoire de sortie ',
        code('dist'),
        '. Ou déployez en ligne de commande avec ',
        code('npx wrangler pages deploy dist'),
        '.',
      ),
      codeBlock('wrangler.toml', s.wrangler, 'bash'),
      h2('AWS Amplify'),
      codeBlock('amplify.yml', s.amplify, 'bash'),
      p(
        'Pour du S3 + CloudFront simple : ',
        code('npm run build'),
        ', puis synchronisez ',
        code('dist/'),
        ' vers le bucket.',
      ),
      h2('GitHub Pages'),
      codeBlock('.github/workflows/deploy.yml', s.ghPages, 'bash'),
      p(
        'Vous déployez sous un sous-chemin (',
        code('user.github.io/repo'),
        ') ? Construisez avec ',
        code('--base /repo/'),
        '.',
      ),
      h2('Avant de publier'),
      ul(
        { class: 'docs-list' },
        li(
          'Définissez ',
          code('site'),
          ' dans ',
          code('sitelo.config.js'),
          ' pour générer le ',
          code('sitemap.xml'),
          ' — voir ',
          a({ href: '/fr/docs/configuration' }, 'Configuration'),
        ),
        li(
          'Ajoutez un ',
          code('src/404.ht.js'),
          ' pour une page « introuvable » à vos couleurs (sinon, une page par défaut est émise)',
        ),
        li(
          code('sitelo preview'),
          ' sert le build de production en local pour une dernière vérification',
        ),
      ),
    ],
  })
