import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/fr.js'

export default () =>
  uiLayout({
    title: 'Onglets',
    description:
      'Trois formes : des liens, une page par onglet ; des panneaux qui s’échangent sur place ; ou des panneaux pilotés par l’URL.',
    activeHref: '/fr/ui/tabs',
    children: [
      p(
        'Donnez un ',
        code('href'),
        ' à chaque élément et les onglets sont des liens — une page par onglet, aucun script, ',
        code('aria-current'),
        ' sur l’onglet actif. Donnez à chaque élément un ',
        code('panel'),
        ' et ils deviennent un groupe de boutons radio dont les panneaux s’échangent sur place, toujours sans script.',
      ),
      p(
        'Sur un site statique, la forme en liens est généralement la bonne : elle donne une URL à chaque vue et survit à un JavaScript désactivé. Prenez les panneaux quand le contenu est petit et que basculer ne devrait pas coûter une navigation.',
      ),

      h2('Onglets en liens'),
      p(
        'Ce sont bien des liens : cliquer navigue. Le soulignement vient d’',
        code('active'),
        ' ou de ',
        code('value'),
        ' à la construction, pas du clic — chaque page marque donc son propre onglet. Un onglet-lien ne réagit pas tout seul à l’URL : pour cela, basculez sur place avec les panneaux ci-dessous.',
      ),
      demo(`tabs({
  items: [
    { label: 'Fil d’Ariane', href: '/fr/ui/breadcrumbs' },
    { label: 'Onglets', href: '/fr/ui/tabs', active: true },
    { label: 'Pagination', href: '/fr/ui/pagination' },
  ],
})`, { align: 'stretch' }),

      h2('Onglets à panneaux'),
      p(
        'L’onglet est un ',
        code('<label>'),
        ' pour un bouton radio que la feuille de styles garde hors de vue, et le panneau qui suit le radio coché est celui que le CSS affiche. Cette page n’importe rien : basculer, et se déplacer aux flèches entre les onglets, un groupe de boutons radio le fait déjà.',
      ),
      demo(`tabs({
  value: 'install',
  items: [
    { id: 'install', label: 'Installer', panel: card({ variant: 'flat' }, cardBody(code('npm install sitelo javascript-to-html'))) },
    { id: 'use', label: 'Utiliser', panel: card({ variant: 'flat' }, cardBody(code("import * as ui from 'sitelo/ui'"))) },
    { id: 'build', label: 'Construire', panel: card({ variant: 'flat' }, cardBody(code('sitelo build'))) },
  ],
})`, { align: 'stretch' }),

      h2('Onglets partageables'),
      p(
        'Donnez en plus aux éléments à panneau un ',
        code('href'),
        ' de fragment et les radios cèdent la place à des liens : l’URL nomme l’onglet, ',
        code(':target'),
        ' le désigne, le panneau qui le suit s’affiche, et le choix survit à un rechargement, à un lien partagé et au bouton retour. L’id est sur l’onglet et non sur le panneau, car le navigateur amène en haut de la fenêtre ce que l’URL nomme : sur le panneau, il pousserait les onglets hors de l’écran où vous venez de cliquer. Un seul élément par document peut être ',
        code(':target'),
        ', cette forme est donc faite pour un seul jeu d’onglets par page. Le défilement, lui, ne s’annule pas : suivre un fragment, c’est déplacer la fenêtre. On choisit seulement vers quoi elle va et où elle s’arrête — d’où l’id sur l’onglet et son ',
        code('scroll-margin-block-start'),
        ', réglé par la prop ',
        code('scrollMargin'),
        ' : donnez à un en-tête collant au moins sa propre hauteur.',
      ),
      demo(`tabs({
  items: [
    { id: 'setup', label: 'Installer', href: '#tab-setup', panel: card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Ce panneau est #tab-setup : copiez l’URL, il revient.'))) },
    { id: 'deploy', label: 'Déployer', href: '#tab-deploy', panel: card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Et celui-ci est #tab-deploy.'))) },
  ],
})`, { align: 'stretch' }),

      h2('Pastilles'),
      demo(`stack({ gap: 'lg' },
  tabs({
    variant: 'pills',
    items: [
      { label: 'Tout', href: '#all', active: true },
      { label: 'Guides', href: '#guides' },
      { label: 'Exemples', href: '#examples' },
    ],
  }),
  tabs({
    variant: 'pills',
    value: 'js',
    items: [
      { id: 'js', label: 'JavaScript', panel: card({ variant: 'flat' }, cardBody(code('src/index.ht.js'))) },
      { id: 'ts', label: 'TypeScript', panel: card({ variant: 'flat' }, cardBody(code('src/index.ht.ts'))) },
      { id: 'jsx', label: 'JSX', panel: card({ variant: 'flat' }, cardBody(code('src/index.ht.jsx'))) },
    ],
  }),
)`, { align: 'stretch' }),

      h2('Couleurs'),
      demo(`stack({ gap: 'lg' },
  tabs({ color: 'primary', items: [{ label: 'Primary', href: '#p', active: true }, { label: 'Autre', href: '#p2' }] }),
  tabs({ color: 'neutral', items: [{ label: 'Neutral', href: '#n', active: true }, { label: 'Autre', href: '#n2' }] }),
  tabs({ color: 'danger', items: [{ label: 'Danger', href: '#d', active: true }, { label: 'Autre', href: '#d2' }] }),
)`, { align: 'stretch' }),

      h2('Beaucoup d’onglets'),
      p('La liste d’onglets défile horizontalement au lieu de passer à la ligne : la rangée garde donc sa forme sur un téléphone. Les onglets à panneaux passent à la ligne, eux : chaque panneau doit suivre son propre onglet, il ne reste donc aucune rangée à faire défiler.'),
      demo(`tabs({
  items: [
    'Vue d’ensemble', 'Routage', 'Données', 'Ressources', 'Images', 'Îlots', 'TypeScript', 'CLI', 'Déploiement',
  ].map((label, index) => ({ label, href: '#many-' + index, active: index === 0 })),
})`, { align: 'stretch' }),

      h2('Désactivé'),
      demo(`tabs({
  value: 'now',
  items: [
    { id: 'now', label: 'Disponible', panel: card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Celui-ci fonctionne.'))) },
    { id: 'soon', label: 'Bientôt', disabled: true, panel: card({ variant: 'flat' }, cardBody('')) },
  ],
})`, { align: 'stretch' }),

      h2('Accessibilité'),
      p(
        'La forme à panneaux est un vrai groupe de boutons radio : les onglets sont des ',
        code('<label>'),
        ' pour des radios qui partagent un ',
        code('name'),
        ', un lecteur d’écran annonce donc lequel sur combien est choisi, et les flèches, Origine et Fin marchent sans rien charger. La forme partageable, elle, n’est que des liens et ne porte pas d’',
        code('aria-current'),
        ' : il serait écrit une fois et faux dès le premier clic. Ce n’est délibérément pas une tablist ARIA — ',
        code('aria-selected'),
        ' est écrit une fois, sur le serveur, et le CSS ne peut pas le garder vrai au fil des clics. La forme en liens n’est pas une tablist non plus : des liens qui naviguent sont des liens, et leur donner une sémantique d’onglet mentirait sur ce qu’ils font.',
      ),

      h2('Props'),
      propsTable([
        ['items', 'Array', '[]', 'Des chaînes, ou des objets { id, label, href, panel, active, disabled }.'],
        ['value', 'string', '', 'Id de l’élément actif. À défaut, active, puis le premier.'],
        ['variant', "'underline' | 'pills'", "'underline'", 'Comment l’onglet actif est marqué.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Couleur de l’onglet actif.'],
        ['label', 'string', "'Tabs'", 'Nom accessible du groupe. Forme à panneaux uniquement.'],
        ['name', 'string', 'id du premier élément', 'Nom du groupe de radios. Utile seulement si une page porte deux jeux d’onglets à panneaux.'],
        ['href', 'string', '', 'Sur un élément : une page à lier ou, avec panel, le fragment qui le nomme.'],
        ['scrollMargin', 'Space', "'md'", 'À quelle distance au-dessus de l’onglet la fenêtre s’arrête. Forme :target uniquement.'],
      ]),
    ],
  })
