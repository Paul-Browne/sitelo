import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, examplesLayout } from '../../lib/fr.js'

export default () =>
  examplesLayout({
    title: 'Exemples',
    description: 'Recettes pratiques pour sitelo — WordPress, API, et plus encore.',
    activeHref: '/fr/examples',
    children: [
      p(
        'Des recettes pas à pas pour construire de vrais sites avec sitelo. Chaque exemple montre la structure du projet, le chargement des données et les pages que vous écririez.',
      ),
      h2('Disponibles'),
      ul(
        { class: 'docs-list' },
        li(
          a({ href: '/fr/examples/basic' }, 'Site de base'),
          ' — projet minimal plus les configurations de déploiement statique pour Netlify, Vercel, Cloudflare Pages et AWS Amplify.',
        ),
        li(
          a({ href: '/fr/examples/todo' }, 'Appli de tâches'),
          ' — HTML statique avec des gestionnaires ',
          code("import('/js/todo.js')"),
          ' en ligne (ajout / bascule / suppression, ',
          code('localStorage'),
          ').',
        ),
        li(
          a({ href: '/fr/examples/blog' }, 'Blog en Markdown'),
          ' — un dossier de fichiers ',
          code('.md'),
          ' rendus en pages statiques, avec un flux RSS et zéro JS côté client.',
        ),
        li(
          a({ href: '/fr/examples/wordpress' }, 'WordPress'),
          ' — récupérez les articles depuis l’API REST de WordPress avec ',
          code('fetchWithCache'),
          ', listez-les et générez des pages statiques.',
        ),
        li(
          a({ href: '/fr/examples/islands' }, 'Îlots serveur'),
          ' — des pages statiques plus un hôte Node qui rend les îlots au moment de la requête.',
        ),
      ),
      h2('Bientôt'),
      ul({ class: 'docs-list' }, li('CMS headless / Contentful')),
    ],
  })
