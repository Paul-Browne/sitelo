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
    ],
  })
