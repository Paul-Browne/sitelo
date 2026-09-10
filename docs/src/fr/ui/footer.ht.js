import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/fr.js'

export default () =>
  uiLayout({
    title: 'Pied de page',
    description:
      'Le bas d’un site : des colonnes de liens, et une ligne en dessous.',
    activeHref: '/fr/ui/footer',
    children: [
      p(
        'Un pied de page est une grille de colonnes qui s’auto-ajuste, plus une ligne du bas facultative qui occupe toujours toute la largeur, quel que soit le nombre de colonnes.',
      ),
      p(
        'Il est exporté à la fois comme ',
        code('footer'),
        ' et comme ',
        code('siteFooter'),
        ', parce que ',
        code('footer'),
        ' est aussi l’élément ',
        code('<footer>'),
        ' de javascript-to-html et importer les deux sous un seul nom est une erreur de syntaxe.',
      ),

      h2('Pied de page de base'),
      demo(`footer(
  footerColumn({ title: 'Documentation' },
    '<a href="/fr/docs">Démarrage</a>',
    '<a href="/fr/docs/routing">Routage</a>',
    '<a href="/fr/docs/data">Chargement de données</a>',
  ),
  footerColumn({ title: 'Composants' },
    '<a href="/fr/ui">Vue d’ensemble</a>',
    '<a href="/fr/ui/button">Bouton</a>',
    '<a href="/fr/ui/card">Carte</a>',
  ),
  footerColumn({ title: 'Projet' },
    '<a href="https://github.com/paul-browne/sitelo">GitHub</a>',
    '<a href="https://www.npmjs.com/package/sitelo">npm</a>',
  ),
)`, { align: 'stretch' }),

      h2('Avec une ligne du bas'),
      p(
        code('footerBottom()'),
        ' traverse toutes les colonnes : elle reste une rangée pleine largeur quoi que fasse la grille au-dessus.',
      ),
      demo(`footer(
  footerColumn({ title: 'Documentation' }, '<a href="/fr/docs">Guide</a>', '<a href="/fr/ui">Composants</a>'),
  footerColumn({ title: 'Exemples' }, '<a href="/fr/examples">Tous les exemples</a>'),
  footerBottom(
    text({ variant: 'caption' }, '© 2026 Paul Browne · MIT'),
    stack({ direction: 'row', gap: 'sm' },
      chip({ size: 'sm', color: 'neutral' }, 'v2.7'),
      chip({ size: 'sm', color: 'success', dot: true }, 'Build réussi'),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Une colonne de marque'),
      p(
        'Une colonne n’est pas obligée d’être des liens. Tout ce que vous passez en enfant de ',
        code('footer()'),
        ' plutôt que d’une colonne occupe sa propre cellule dans la grille.',
      ),
      demo(`footer(
  div(
    stack({ gap: 'sm' },
      text({ variant: 'h5', as: 'div' }, 'sitelo'),
      text({ variant: 'small', tone: 'muted' }, 'Génération de sites statiques sans configuration, propulsée par Vite.'),
    ),
  ),
  footerColumn({ title: 'Documentation' }, '<a href="/fr/docs">Guide</a>', '<a href="/fr/ui">Composants</a>'),
  footerColumn({ title: 'Projet' }, '<a href="#">GitHub</a>', '<a href="#">npm</a>'),
)`, { align: 'stretch' }),

      h2('Colonnes fixes'),
      p(
        'Par défaut les colonnes s’auto-ajustent. ',
        code('columns'),
        ' accepte n’importe quelle valeur de ',
        code('grid-template-columns'),
        ' quand vous voulez une forme précise — une large colonne de marque et deux colonnes de liens étroites, par exemple.',
      ),
      demo(`footer({ columns: '2fr 1fr 1fr' },
  div(text({ variant: 'small', tone: 'muted' }, 'Une première colonne plus large pour la marque et une phrase à son sujet.')),
  footerColumn({ title: 'Documentation' }, '<a href="/fr/docs">Guide</a>'),
  footerColumn({ title: 'Plus' }, '<a href="/fr/examples">Exemples</a>'),
)`, { align: 'stretch' }),

      h2('La ligne du bas seule'),
      demo(`footer(
  footerBottom(text({ variant: 'caption' }, '© 2026 · Fait avec sitelo')),
)`, { align: 'stretch' }),

      h2('Props'),
      p(code('footer()'), ' :'),
      propsTable([
        ['columns', 'string', '', 'Une valeur grid-template-columns. S’auto-ajuste si omise.'],
        ['as', 'string', "'footer'", 'Élément à rendre.'],
      ]),
      propsTable([
        ['footerColumn', 'title', '', 'Une colonne titrée ; les enfants deviennent une liste de liens.'],
        ['footerBottom', '', '', 'Rangée pleine largeur sous les colonnes.'],
      ], { headers: ['Partie', 'Props', 'Défaut', 'Description'] }),
    ],
  })
