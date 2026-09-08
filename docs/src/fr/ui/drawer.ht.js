import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/fr.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Tiroir',
    description:
      'Un panneau qui entre par le bord — mêmes mécaniques de popover qu’une modale, forme différente.',
    activeHref: '/fr/ui/drawer',
    extraHead: uiHead(),
    children: [
      p(
        'Un tiroir est un panneau pleine hauteur ancré sur un côté. Comme ',
        code('modal()'),
        ', c’est un ',
        code('popover'),
        ' : un bouton avec le ',
        code('popovertarget'),
        ' correspondant l’ouvre, et le navigateur gère le fond, le clic à l’extérieur et Échap.',
      ),
      p(
        'Sur un site statique, son rôle le plus courant est le menu de navigation sur téléphone.',
      ),

      h2('Tiroir de base'),
      demo(`fragment(
  button({ popovertarget: 'drawer-basic' }, 'Ouvrir le tiroir'),
  drawer({ id: 'drawer-basic', title: 'Paramètres' },
    stack({ gap: 'md' },
      toggle({ label: 'Recherche Pagefind', checked: true }),
      toggle({ label: 'Optimisation des images', checked: true }),
      toggle({ label: 'Îlots serveur' }),
    ),
  ),
)`),

      h2('Côtés'),
      demo(`fragment(
  stack({ direction: 'row', gap: 'sm' },
    button({ variant: 'outline', color: 'neutral', popovertarget: 'drawer-start' }, 'Depuis le début'),
    button({ variant: 'outline', color: 'neutral', popovertarget: 'drawer-end' }, 'Depuis la fin'),
  ),
  drawer({ id: 'drawer-start', side: 'start', title: 'Début' },
    text({ variant: 'small', tone: 'muted' }, 'Ancré au bord de départ — la gauche dans une langue qui se lit de gauche à droite.'),
  ),
  drawer({ id: 'drawer-end', title: 'Fin' },
    text({ variant: 'small', tone: 'muted' }, 'Le défaut : ancré au bord de fin.'),
  ),
)`),

      h2('Largeur'),
      p('N’importe quelle longueur CSS. Elle est plafonnée à 90 % de la fenêtre, donc un tiroir large tient encore sur un téléphone.'),
      demo(`fragment(
  stack({ direction: 'row', gap: 'sm' },
    button({ variant: 'outline', color: 'neutral', popovertarget: 'drawer-narrow' }, 'Étroit'),
    button({ variant: 'outline', color: 'neutral', popovertarget: 'drawer-wide' }, 'Large'),
  ),
  drawer({ id: 'drawer-narrow', width: '14rem', title: 'Étroit' },
    text({ variant: 'small', tone: 'muted' }, 'width: 14rem'),
  ),
  drawer({ id: 'drawer-wide', width: '34rem', title: 'Large' },
    text({ variant: 'small', tone: 'muted' }, 'width: 34rem'),
  ),
)`),

      h2('En menu de navigation'),
      p('Le schéma que veulent la plupart des sites : un bouton menu dans la barre, les liens dans un tiroir.'),
      demo(`fragment(
  appBar({ brand: 'sitelo' },
    appBarSpacer(),
    appBarActions(
      iconButton({
        label: 'Ouvrir la navigation',
        variant: 'ghost',
        color: 'neutral',
        popovertarget: 'drawer-nav',
        icon: icon('menu'),
      }),
    ),
  ),
  drawer({ id: 'drawer-nav', title: 'Navigation' },
    navLink({ href: '#docs', current: true }, 'Documentation'),
    navLink({ href: '#ui' }, 'UI'),
    navLink({ href: '#examples' }, 'Exemples'),
    navLink({ href: '#about' }, 'À propos'),
    divider({ spacing: 'sm' }),
    button({ block: true }, 'Commencer'),
  ),
)`, { align: 'stretch' }),

      h2('Un panneau de filtres'),
      demo(`fragment(
  button({ variant: 'soft', color: 'neutral', popovertarget: 'drawer-filters' }, 'Filtres'),
  drawer({ id: 'drawer-filters', title: 'Filtres', width: '22rem' },
    stack({ gap: 'lg' },
      choiceGroup({
        legend: 'Type',
        name: 'drawer-type',
        value: 'guide',
        options: [
          { value: 'guide', label: 'Guides' },
          { value: 'example', label: 'Exemples' },
          { value: 'all', label: 'Tout' },
        ],
      }),
      choiceGroup({
        legend: 'Tags',
        name: 'drawer-tags',
        type: 'checkbox',
        value: ['routing'],
        options: ['routing', 'data', 'islands'],
      }),
      stack({ direction: 'row', gap: 'sm' },
        button({ variant: 'ghost', color: 'neutral', popovertarget: 'drawer-filters', popovertargetaction: 'hide' }, 'Annuler'),
        button('Appliquer'),
      ),
    ),
  ),
)`),

      h2('Props'),
      propsTable([
        ['id', 'string', '', 'Obligatoire. Ce que vise le popovertarget d’un déclencheur.'],
        ['title', 'Child', '', 'Titre, et nom accessible du dialogue.'],
        ['side', "'start' | 'end'", "'end'", 'Le bord auquel il est ancré.'],
        ['width', 'string', "'20rem'", 'Largeur du panneau, plafonnée à 90vw.'],
        ['closable', 'boolean', 'true', 'Afficher le × dans l’en-tête.'],
        ['closeLabel', 'string', "'Close'", 'Nom accessible de ce bouton.'],
      ]),
    ],
  })
