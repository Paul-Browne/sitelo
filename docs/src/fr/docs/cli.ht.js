import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, docsLayout } from '../../lib/fr.js'
import { cliSnippets } from '../../lib/snippets/cli.js'

const s = cliSnippets('fr')

export default () =>
  docsLayout({
    title: 'CLI',
    description: 'sitelo dev, build, preview et les options courantes.',
    activeHref: '/fr/docs/cli',
    children: [
      p(
        'La CLI ',
        code('sitelo'),
        ' enveloppe le Vite embarqué et injecte automatiquement le plugin de pages HTML.',
      ),
      h2('Commandes'),
      codeBlock('shell', s.commands, 'bash'),
      ul(
        { class: 'docs-list' },
        li(
          code('dev'),
          ' — véritable rendu SSR à la demande, routes dynamiques comprises, plus une petite barre d’outils de développement',
        ),
        li(
          code('build'),
          ' — HTML statique dans ',
          code('dist/'),
          ' (ou votre ',
          code('outDir'),
          ')',
        ),
        li(code('preview'), ' — sert le build de production en local'),
        li(
          code('lighthouse'),
          ' — audite le build de production (nécessite la dépendance pair ',
          code('lighthouse'),
          ')',
        ),
      ),
      p(
        'Désactivez la barre d’outils avec ',
        code('devToolbar: false'),
        ' dans ',
        code('sitelo.config.js'),
        ' — voir ',
        a({ href: '/fr/docs/configuration' }, 'Configuration'),
        '.',
      ),
      h2('Options utiles'),
      codeBlock('shell', s.flags, 'bash'),
      ul(
        { class: 'docs-list' },
        li(
          code('--port'),
          ' / ',
          code('--host'),
          ' / ',
          code('--open'),
          ' — serveur',
        ),
        li(
          code('--outDir'),
          ' / ',
          code('--emptyOutDir'),
          ' / ',
          code('--base'),
          ' — build',
        ),
        li(
          code('--root'),
          ' — racine du projet (pratique pour un site dans ',
          code('docs/'),
          ')',
        ),
        li(code('--config'), ' — fichier de configuration Vite personnalisé'),
        li(code('--mode'), ' / ', code('--logLevel'), ' / ', code('--debug')),
      ),
      p(
        'Pour tout ce que vous réutilisez d’une commande à l’autre, préférez les options Vite dans ',
        code('sitelo.config.js'),
        ' sous ',
        code('vite'),
        '.',
      ),
      h2('Trouver le code inutilisé'),
      p(
        a({ href: 'https://knip.dev' }, 'knip'),
        ' trouve les fichiers, exports et dépendances que rien n’utilise. Sur un projet sitelo, il lui faut une indication : les pages et les îlots sont découverts dans le système de fichiers, donc rien ne les importe, et sans cette indication knip signale tout le site comme des fichiers inutilisés.',
      ),
      codeBlock('shell', s.knipInstall, 'bash'),
      codeBlock('knip.js', s.knip, 'javascript'),
      codeBlock('shell', s.knipRun, 'bash'),
      p(
        code('knipConfig()'),
        ' lit votre ',
        code('sitelo.config.js'),
        ' et marque les pages et les îlots comme points d’entrée, exactement comme le build les découvre — ',
        code('pagesDir'),
        ', ',
        code('pageExtensions'),
        ', ',
        code('include'),
        ' et ',
        code('exclude'),
        ' s’appliquent tous. Ce qui reste dans le rapport est du code que le site n’atteint réellement jamais.',
      ),
      p(
        'Une chose lui échappe : un script client qu’une page référence par URL plutôt que par import, comme ',
        code('<script src="/js/app.js">'),
        '. Ceux-là, vous les listez vous-même, et vous passez à côté toute autre option acceptée par knip — elle est intégrée au résultat. Le ',
        code('!'),
        ' final est la marque de knip pour le code de production, ce qu’est précisément un script livré au navigateur.',
      ),
      codeBlock('knip.js', s.knipEntry, 'javascript'),
    ],
  })
