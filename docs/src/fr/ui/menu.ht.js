import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/fr.js'
import { preview, uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Menu',
    description:
      'Un menu déroulant bâti sur <details>, qui s’ouvre et se ferme sans le moindre script.',
    activeHref: '/fr/ui/menu',
    extraHead: uiHead(),
    children: [
      p(
        'Un menu est un ',
        code('<details>'),
        ' avec un panneau stylé. C’est un choix délibéré face à l’API popover : un popover vit dans la couche supérieure et ne peut pas être positionné par rapport à son déclencheur sans le positionnement par ancre, qui n’est pas encore partout. Un ',
        code('<details>'),
        ' se place correctement dès aujourd’hui et n’a besoin de rien de chargé.',
      ),
      p(
        'Le déclencheur est ce ',
        code('<summary>'),
        ', stylé en bouton — vous passez donc le libellé et les props de bouton à ',
        code('menu()'),
        ' plutôt qu’un ',
        code('button()'),
        ' déjà rendu. Un summary est déjà interactif, et un bouton à l’intérieur imbrique deux contrôles là où il n’y a qu’une action : balisage invalide, et deux arrêts de tabulation pour une seule chose.',
      ),
      p(
        'La fermeture au clic extérieur et à Échap vient d’un gestionnaire ',
        code('ontoggle'),
        ' qui les importe à la première ouverture d’un menu — et seulement alors. Si ce module n’arrive jamais, un menu s’ouvre et se ferme quand même depuis son propre summary.',
      ),

      h2('Menu de base'),
      demo(`menu({ trigger: 'Actions' },
  menuItem({ href: '#edit' }, 'Modifier'),
  menuItem({ href: '#duplicate' }, 'Dupliquer'),
  menuSeparator(),
  menuItem({ href: '#delete' }, 'Supprimer'),
)`),

      h2('Alignement'),
      p(
        'Un menu s’ouvre depuis le bord de départ de son déclencheur. ',
        code("align: 'end'"),
        ' le retourne, ce qu’il faut à un menu proche du bord droit d’une barre.',
      ),
      demo(`stack({ direction: 'row', gap: 'xl', justify: 'space-between', style: 'width: 100%' },
  menu({ trigger: 'Aligné au début', variant: 'soft' },
    menuItem({ href: '#a' }, 'Premier'),
    menuItem({ href: '#b' }, 'Deuxième'),
  ),
  menu({ trigger: 'Aligné à la fin', variant: 'soft', align: 'end' },
    menuItem({ href: '#c' }, 'Premier'),
    menuItem({ href: '#d' }, 'Deuxième'),
  ),
)`, { align: 'stretch' }),

      h2('Déclencheurs en icône'),
      p(
        'Une icône sans texte de ',
        code('trigger'),
        ' réclame un ',
        code('label'),
        ' — il devient le nom accessible que l’icône ne peut pas fournir.',
      ),
      demo(`stack({ direction: 'row', gap: 'md' },
  menu({
    align: 'end',
    label: 'Plus d’actions',
    variant: 'ghost',
    icon: icon('more-horizontal'),
  },
    menuItem({ href: '#rename' }, 'Renommer'),
    menuItem({ href: '#move' }, 'Déplacer'),
    menuSeparator(),
    menuItem({ href: '#archive' }, 'Archiver'),
  ),
)`),

      h2('Des éléments avec icônes'),
      demo(`menu({ trigger: 'Fichier' },
  menuItem({
    href: '#new',
    icon: icon('plus'),
  }, 'Nouvelle page'),
  menuItem({
    href: '#open',
    icon: icon('folder'),
  }, 'Ouvrir…'),
  menuSeparator(),
  menuItem({
    href: '#build',
    icon: icon('zap'),
  }, 'Construire le site'),
)`),

      h2('Des boutons plutôt que des liens'),
      p(
        'Un élément sans ',
        code('href'),
        ' rend un ',
        code('<button>'),
        ' — pour une action qui se produit sur la page plutôt qu’une navigation.',
      ),
      demo(`menu({ trigger: 'Exporter', variant: 'soft', color: 'primary' },
  menuItem({ onclick: "import('/su/toast.js').then(m=>m.toast('Exporté en JSON.',{color:'success'}))" }, 'En JSON'),
  menuItem({ onclick: "import('/su/toast.js').then(m=>m.toast('Exporté en CSV.',{color:'success'}))" }, 'En CSV'),
)`),
      // The demo above raises toasts; this is the region they land in.
      // Fixed-position, so it renders here but appears in the corner.
      preview('toasts()'),

      h2('Dans une barre d’application'),
      demo(`appBar({ brand: 'sitelo' },
  appBarSpacer(),
  appBarActions(
    themeToggle(),
    menu({
      align: 'end',
      label: 'Plus',
      variant: 'ghost',
      icon: icon('more-horizontal'),
    },
      menuItem({ href: '/fr/docs' }, 'Documentation'),
      menuItem({ href: '/fr/examples' }, 'Exemples'),
      menuSeparator(),
      menuItem({ href: 'https://github.com/paul-browne/sitelo' }, 'GitHub'),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Accessibilité'),
      p(
        'Le panneau est un ',
        code('role="menu"'),
        ' dont les éléments sont des ',
        code('role="menuitem"'),
        ', et le summary porte ',
        code('aria-haspopup'),
        '. Un ',
        code('<details>'),
        ' n’est pas un widget de menu natif : c’est donc une approximation raisonnable, pas une parfaite — pour une simple liste de liens, un ',
        code('nav'),
        ' à l’intérieur du details est tout aussi valable et promet moins.',
      ),

      h2('Props'),
      p(code('menu()'), ' — les props du déclencheur sont celles du bouton :'),
      propsTable([
        ['trigger', 'Child', '', 'Libellé visible. Passez du texte, pas un button() rendu.'],
        ['icon', 'Child', '', 'Balisage avant le libellé, ou seul pour un déclencheur en icône.'],
        ['label', 'string', '', 'Nom accessible. Obligatoire quand il y a une icône et aucun texte de trigger.'],
        ['variant', "'solid' | 'soft' | 'outline' | 'ghost' | 'link'", "'outline'", 'Style du déclencheur.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'neutral'", 'La palette du déclencheur.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Taille du déclencheur.'],
        ['align', "'start' | 'end'", "'start'", 'Le bord du déclencheur sur lequel le panneau s’aligne.'],
        ['triggerClass', 'string', '', 'Classes en plus pour le déclencheur plutôt que pour le details englobant.'],
      ]),
      p(code('menuItem()'), ' :'),
      propsTable([
        ['href', 'string', '', 'Rend une ancre ; sans lui, un bouton.'],
        ['icon', 'Child', '', 'Balisage avant le libellé.'],
        ['as', 'string', "'button'", 'Élément rendu en l’absence de href.'],
      ]),
      p(code('menuSeparator()'), ' ne prend aucune prop — c’est le filet entre deux groupes d’éléments.'),
    ],
  })
