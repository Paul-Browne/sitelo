import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/fr.js'

export default () =>
  uiLayout({
    title: 'Hero',
    description:
      'Le haut d’une page d’accueil : un titre, une phrase, et quoi en faire.',
    activeHref: '/fr/ui/hero',
    children: [
      p(
        'Un hero est la première chose sur une page d’accueil marketing ou de documentation. Il rend une ',
        code('<section>'),
        ' contenant un ',
        code('<h1>'),
        ' — c’est donc le titre de la page, pas une bannière décorative qui se trouve être grande.',
      ),

      h2('Hero de base'),
      demo(`hero({
  level: 2,
  title: 'Des sites statiques, sans le framework',
  description: 'Écrivez des fonctions qui renvoient du HTML. Obtenez un site complet.',
},
  button({ size: 'lg' }, 'Commencer'),
  button({ size: 'lg', variant: 'outline', color: 'neutral' }, 'Lire la documentation'),
)`, { align: 'stretch' }),

      h2('Avec un surtitre'),
      p('Une courte ligne au-dessus du titre — une version, une catégorie, une annonce.'),
      demo(`hero({
  level: 2,
  eyebrow: 'sitelo 2.7',
  title: 'Désormais avec une bibliothèque de composants',
  description: 'Soixante-dix composants, aucun runtime, un script facultatif.',
},
  button({ size: 'lg', href: '/fr/ui' }, 'Parcourir les composants'),
)`, { align: 'stretch' }),

      h2('Aligné à gauche'),
      demo(`hero({
  level: 2,
  align: 'start',
  eyebrow: 'Open source',
  title: 'Construit au grand jour',
  description: 'Sous licence MIT, et assez petit pour se lire en un après-midi.',
},
  button({ href: 'https://github.com/paul-browne/sitelo' }, 'Voir sur GitHub'),
)`, { align: 'stretch' }),

      h2('Avec un média'),
      p(
        'Passer ',
        code('media'),
        ' bascule sur deux colonnes dès qu’il y a la place, et revient à une seule sur un écran étroit. Cela se marie naturellement avec ',
        code('mockup()'),
        '.',
      ),
      demo(`hero({
  level: 2,
  align: 'start',
  title: 'Voyez-le tourner',
  description: 'Chaque page est du HTML statique au moment où elle atteint le navigateur.',
  media: mockup({ variant: 'browser', url: 'example.com' },
    div({ style: 'padding: 1.5rem; background: var(--su-surface-2)' },
      text({ variant: 'h5', as: 'div' }, 'Bonjour le monde'),
      text({ variant: 'small', tone: 'muted' }, 'Rendu au moment du build.'),
    ),
  ),
},
  button('Commencer'),
)`, { align: 'stretch' }),

      h2('Dans un conteneur'),
      p(
        'Un hero n’a pas de limite de largeur propre — mettez-le dans un ',
        code('container()'),
        ' pour qu’il s’aligne avec le reste de la page.',
      ),
      demo(`container({ size: 'md', style: 'background: var(--su-surface-2); border-radius: 0.6rem' },
  hero({
    level: 2,
    title: 'Contenu',
    description: 'Le conteneur fixe la largeur ; le hero fixe le rythme.',
  }),
)`, { align: 'stretch' }),

      h2('Niveau de titre'),
      p(
        'Le titre est par défaut le ',
        code('<h1>'),
        ' de la page, ce qui est juste pour une page d’accueil. Un hero placé en milieu de page n’est pas le titre de la page : abaissez-le avec ',
        code('level'),
        ' — c’est ce que fait chaque démo ici, puisque la page a déjà son propre h1.',
      ),

      h2('Rien qu’un titre'),
      p('Chaque partie est facultative, et rien de vide n’est rendu.'),
      demo(`hero({ level: 2, title: 'Documentation' })`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['eyebrow', 'Child', '', 'Petite ligne en capitales au-dessus du titre.'],
        ['title', 'Child', '', 'Rendu comme le h1 de la page.'],
        ['description', 'Child', '', 'La phrase en dessous.'],
        ['media', 'Child', '', 'À côté du texte sur écran large, au-dessus sur écran étroit.'],
        ['align', "'center' | 'start'", "'center'", 'Alignement du texte en l’absence de média.'],
        ['level', 'number', '1', 'Niveau de titre. À abaisser pour un hero en milieu de page.'],
        ['as', 'string', "'section'", 'Élément à rendre.'],
      ]),
      p('Les enfants deviennent la rangée d’actions sous la description.'),
    ],
  })
