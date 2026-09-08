import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/fr.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Onglets',
    description:
      'Deux formes : des liens, une page par onglet ; ou des panneaux qui s’échangent sur place.',
    activeHref: '/fr/ui/tabs',
    extraHead: uiHead(),
    children: [
      p(
        'Donnez un ',
        code('href'),
        ' à chaque élément et les onglets sont des liens — une page par onglet, aucun script, ',
        code('aria-current'),
        ' sur l’onglet actif. Donnez à chaque élément un ',
        code('panel'),
        ' et ils deviennent une vraie tablist dont les panneaux s’échangent sur place.',
      ),
      p(
        'Sur un site statique, la forme en liens est généralement la bonne : elle donne une URL à chaque vue et survit à un JavaScript désactivé. Prenez les panneaux quand le contenu est petit et que basculer ne devrait pas coûter une navigation.',
      ),

      h2('Onglets en liens'),
      p('Aucun script. L’onglet actif est celui que vous marquez.'),
      demo(`tabs({
  items: [
    { label: 'Vue d’ensemble', href: '#overview', active: true },
    { label: 'Installation', href: '#installation' },
    { label: 'API', href: '#api' },
  ],
})`, { align: 'stretch' }),

      h2('Onglets à panneaux'),
      p(
        'Chaque onglet importe son gestionnaire au premier clic — ',
        code("onclick=\"import('/su/tabs.js').then(m=>m.select(this))\""),
        ' — donc ceux-ci basculent vraiment, touches fléchées comprises, sans que cette page n’importe quoi que ce soit. Tant que ce module n’est pas arrivé, le panneau que le serveur a marqué actif est tout simplement celui qui s’affiche.',
      ),
      demo(`tabs({
  value: 'install',
  items: [
    { id: 'install', label: 'Installer', panel: card({ variant: 'flat' }, cardBody(code('npm install sitelo javascript-to-html'))) },
    { id: 'use', label: 'Utiliser', panel: card({ variant: 'flat' }, cardBody(code("import * as ui from 'sitelo/ui'"))) },
    { id: 'build', label: 'Construire', panel: card({ variant: 'flat' }, cardBody(code('sitelo build'))) },
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
      p('La liste d’onglets défile horizontalement au lieu de passer à la ligne : la rangée garde donc sa forme sur un téléphone.'),
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
        'La forme à panneaux rend une vraie ',
        code('role="tablist"'),
        ' avec ',
        code('aria-selected'),
        ', ',
        code('aria-controls'),
        ' et un ',
        code('tabindex'),
        ' tournant. Le script ajoute le déplacement aux flèches, Origine et Fin. La forme en liens n’est délibérément pas une tablist — des liens qui naviguent sont des liens, et leur donner une sémantique d’onglet mentirait sur ce qu’ils font.',
      ),

      h2('Props'),
      propsTable([
        ['items', 'Array', '[]', 'Des chaînes, ou des objets { id, label, href, panel, active, disabled }.'],
        ['value', 'string', '', 'Id de l’élément actif. À défaut, active, puis le premier.'],
        ['variant', "'underline' | 'pills'", "'underline'", 'Comment l’onglet actif est marqué.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Couleur de l’onglet actif.'],
        ['label', 'string', "'Tabs'", 'Nom accessible de la tablist. Forme à panneaux uniquement.'],
      ]),
    ],
  })
