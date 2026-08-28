import { a, h2, h3, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, docsLayout } from '../../lib/fr.js'
import { buildWithAiSnippets } from '../../lib/snippets/build-with-ai.js'

const s = buildWithAiSnippets('fr')

export default () =>
  docsLayout({
    title: 'Créer avec l’IA',
    description:
      'Donnez aux agents de code une connaissance à jour de sitelo grâce à llms.txt, aux règles de projet et à quelques conseils pratiques.',
    activeHref: '/fr/docs/build-with-ai',
    children: [
      p(
        'Les éditeurs IA et les agents de code se trompent souvent sur sitelo : ils reprennent des schémas React, Next ou Astro qui ne s’appliquent pas ici. Ce guide montre comment les orienter vers la documentation à jour de sitelo et garder le code généré dans le bon modèle.',
      ),
      h2('llms.txt'),
      p(
        'sitelo publie un résumé du framework lisible par les machines à l’adresse ',
        a({ href: '/llms.txt' }, 'sitelo.js.org/llms.txt'),
        '. Beaucoup d’agents savent récupérer une URL ; demandez au vôtre de lire ce fichier (et la documentation destinée aux humains) avant d’écrire du code sitelo.',
      ),
      ul(
        { class: 'docs-list' },
        li(
          a({ href: '/llms.txt' }, 'https://sitelo.js.org/llms.txt'),
          ' — API et conventions au format compact',
        ),
        li(
          a({ href: '/fr/docs' }, 'https://sitelo.js.org/fr/docs'),
          ' — guides complets',
        ),
        li(
          a({ href: 'https://github.com/paul-browne/sitelo' }, 'README GitHub'),
          ' — modèle mental et aperçu des fonctionnalités',
        ),
        li(
          a({ href: 'https://ht.js.org', rel: 'noopener' }, 'https://ht.js.org'),
          ' — documentation de ',
          code('javascript-to-html'),
          ' (recommandé pour écrire du HTML en JS)',
        ),
      ),
      p(
        'Contrairement à un serveur MCP de documentation, ',
        code('llms.txt'),
        ' ne demande aucune installation — collez l’URL dans la conversation, ajoutez-la aux règles du projet, ou laissez l’agent la récupérer.',
      ),
      h2('Règles de projet'),
      p(
        'Si votre outil accepte des instructions persistantes (',
        code('AGENTS.md'),
        ', règles Cursor, instructions Copilot, …), ajoutez une courte règle sitelo pour que chaque session démarre avec le bon modèle mental. L’',
        a({ href: '/examples/basic' }, 'exemple de base'),
        ' inclut un ',
        code('AGENTS.md'),
        ' à copier :',
      ),
      codeBlock('AGENTS.md', s.agents, 'markdown'),
      h3('Cursor'),
      p(
        'Créez ',
        code('.cursor/rules/sitelo.mdc'),
        ' dans votre projet (ou collez le même texte dans l’interface des règles de projet de Cursor) :',
      ),
      codeBlock('.cursor/rules/sitelo.mdc', s.cursorRule, 'markdown'),
      h2('Conseils pour travailler sur sitelo avec l’IA'),
      ul(
        { class: 'docs-list' },
        li(
          'Partez d’un modèle — demandez à l’agent de générer la structure depuis ',
          a({ href: '/examples/basic' }, 'examples/basic'),
          ' ou ',
          a({ href: '/examples/wordpress' }, 'examples/wordpress'),
          ' plutôt que d’inventer un framework.',
        ),
        li(
          'Préférez ',
          a({ href: 'https://ht.js.org', rel: 'noopener' }, 'javascript-to-html'),
          ' (',
          code('ht.js'),
          ') pour le balisage — des fonctions de balise qui renvoient des chaînes HTML, sans moteur de gabarit ni React. Orientez les agents vers ',
          a({ href: 'https://ht.js.org', rel: 'noopener' }, 'ht.js.org'),
          ' pour qu’ils n’inventent pas d’arbres de composants JSX.',
        ),
        li(
          'Les pages sont des fonctions qui renvoient du HTML — ',
          code('export default () => `<html>…</html>`'),
          ' ou composées avec ',
          code('javascript-to-html'),
          '. JSX convient tant qu’il compile vers des chaînes ; un runtime React n’est pas nécessaire.',
        ),
        li(
          'Utilisez la CLI de sitelo — ',
          code('sitelo'),
          ' / ',
          code('sitelo build'),
          ' — et non ',
          code('vite'),
          ' directement, sauf si vous savez avoir besoin d’une configuration Vite sur mesure.',
        ),
        li(
          'Vérifiez les API contre ',
          a({ href: '/llms.txt' }, 'llms.txt'),
          ' — en particulier ',
          code('generateStaticParams'),
          ', ',
          code('fetchWithCache'),
          ' et les ',
          a({ href: '/fr/docs/islands' }, 'îlots serveur'),
          '.',
        ),
        li(
          'Zéro JS par défaut — ne liez un ',
          code('<script>'),
          ' que si la page a besoin de code client ; les modules non référencés restent côté serveur.',
        ),
        li(
          'Relisez et exécutez — lancez toujours ',
          code('sitelo build'),
          ' (ou le serveur de développement) après que l’agent a modifié des pages ; traitez le balisage généré comme un brouillon.',
        ),
      ),
      p(
        a({ href: '/fr/docs' }, 'Démarrage'),
        ' · ',
        a({ href: '/examples/basic' }, 'Exemple de base'),
        ' · ',
        a({ href: '/llms.txt' }, 'llms.txt'),
      ),
    ],
  })
