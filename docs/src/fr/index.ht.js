import {
  a,
  button,
  code,
  div,
  h1,
  h2,
  h3,
  img,
  li,
  p,
  span,
  ul,
} from 'javascript-to-html'
import { landingLayout } from '../lib/fr.js'
import { arrowIcon, icons } from '../lib/landing-icons.js'
import { gettingStartedSnippets } from '../lib/snippets/getting-started.js'

const { install } = gettingStartedSnippets('fr')

const features = [
  [
    'routing',
    'Routage',
    'src/about.ht.js → /about, plus [slug] et fourre-tout',
    '/fr/docs/routing',
  ],
  [
    'code',
    'JSX et TSX',
    'Écrivez vos pages en .jsx / .tsx avec le même routage et le même build',
    '/fr/docs/pages#limites-de-jsx',
  ],
  [
    'data',
    'Chargement de données',
    'data() au build, avec mise en cache des fetch',
    '/fr/docs/data',
  ],
  [
    'pipeline',
    'Pipeline de ressources',
    'Le JS/TS/CSS référencé est empaqueté ; le reste demeure côté serveur',
    '/fr/docs/assets',
  ],
  [
    'image',
    'Optimisation des images',
    'Redimensionnement, formats et srcset — activez avec images: true (installez sharp)',
    '/fr/docs/images',
  ],
  [
    'feather',
    'Zéro JavaScript, par défaut',
    'Seuls les scripts que vous liez sont empaquetés — tout le reste reste hors de la page, pour un site plus rapide',
    '/fr/docs/assets#zero-js-par-defaut',
  ],
  [
    'terminal',
    'Serveur de développement + barre d’outils',
    'Rendu en direct à la demande, plus le fichier, les paramètres, le nombre d’îlots et un sélecteur de viewport pendant que vous développez',
    '/fr/docs/cli',
  ],
  [
    'search',
    'Recherche Pagefind',
    'Recherche statique optionnelle — installez pagefind, puis sitelo build indexe dans dist/pagefind/',
    '/fr/docs/configuration#recherche-pagefind',
  ],
  [
    'layers',
    'Îlots serveur',
    'Des pages statiques avec des zones rendues sur le serveur au moment de la requête',
    '/fr/docs/islands',
  ],
  [
    'sparkles',
    'Prêt pour l’IA',
    'llms.txt, règles de projet et conseils pour que les agents écrivent du sitelo — pas du React',
    '/fr/docs/build-with-ai',
  ],
  [
    'lighthouse',
    'Audits Lighthouse',
    'Note le build réel face à des seuils — sitelo lighthouse (installer lighthouse)',
    '/fr/docs/configuration#audits-lighthouse',
  ],
  [
    'gift',
    'Extras',
    '404.html, sitemap.xml, RSS et les configurations de déploiement en un clic',
    '/fr/docs/configuration',
  ],
]

export default () =>
  landingLayout({
    pageTitle: 'sitelo — Le framework moderne pour des sites web rapides',
    description:
      'sitelo transforme un dossier de pages en un site web statique et rapide. Aperçu en direct pendant que vous travaillez, une commande pour livrer — sans framework lourd.',
    children: [headerHero(), mainSections()],
  })

function headerHero() {
  return div(
    { class: 'hero' },
    div(
      { class: 'hero-center' },
      img({
        class: 'hero-logo',
        src: '/logo.svg',
        alt: 'sitelo',
        width: '280',
        height: '80',
        // Above the fold and the hero's first paint, so it should not queue
        // behind the page's other subresources.
        fetchpriority: 'high',
      }),
      h1(
        { class: 'hero-headline' },
        span(
          { class: 'hero-headline-text' },
          'Le framework moderne pour ',
          span(
            {
              class: 'hero-typed',
              'data-phrases':
                'des sites web rapides|des blogs|des portfolios|des landing pages|des sites de contenu|des boutiques en ligne',
              'aria-live': 'polite',
            },
            'des sites web rapides',
          ),
        ),
      ),
      p(
        { class: 'hero-lede' },
        'Zéro configuration. Des builds ultra-rapides. Déployez partout — une seule installation.',
      ),
      div(
        { class: 'hero-actions' },
        a({ class: 'btn', href: '/fr/docs' }, 'Commencer'),
        div(
          { class: 'install-glow' },
          div(
            { class: 'install' },
            code({ class: 'install-cmd' }, install),
            button(
              {
                class: 'install-copy',
                type: 'button',
                'data-copy': install,
                'aria-label': 'Copier la commande d’installation',
              },
              'Copier',
            ),
          ),
        ),
      ),
    ),
  )
}

function mainSections() {
  return div(
    { class: 'landing-sections' },
    sectionBlock(
      'Ce que vous obtenez',
      ul(
        { class: 'feature-list' },
        ...features.map(([icon, name, detail, href]) => {
          const body = div(
            { class: 'feature-card-body' },
            span({ class: 'feature-chip' }, icons[icon]),
            h3(name),
            p(detail),
          )
          return li(
            href
              ? a({ class: 'feature-card', href }, body)
              : div({ class: 'feature-card' }, body),
          )
        }),
      ),
    ),
    sectionBlock(
      'Documentation',
      p(
        'Des guides pour le routage, le chargement de données, TypeScript, la configuration et la CLI.',
      ),
      p(
        a(
          { class: 'btn btn-inline', href: '/fr/docs' },
          'Lire la documentation',
          arrowIcon,
        ),
      ),
    ),
    sectionBlock(
      'Exemples',
      p(
        'Des recettes pour des cas réels — à commencer par un site basé sur l’API REST de WordPress.',
      ),
      p(
        a(
          { class: 'btn btn-inline', href: '/fr/examples' },
          'Parcourir les exemples',
          arrowIcon,
        ),
      ),
    ),
  )
}

function sectionBlock(heading, ...children) {
  return div({ class: 'section' }, h2(heading), ...children)
}
