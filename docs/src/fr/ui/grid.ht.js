import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/fr.js'

export default () =>
  uiLayout({
    title: 'Grille',
    description:
      'Une grille adaptative qui loge autant de colonnes qu’il en tient — sans points de rupture, sans media queries.',
    activeHref: '/fr/ui/grid',
    children: [
      p(
        'Sans ',
        code('columns'),
        ', une grille loge autant de pistes d’au moins ',
        code('min'),
        ' que la place le permet, et chacune se partage également le reste. C’est le comportement que veut une liste de cartes, et il ne demande aucun point de rupture : redimensionnez cette page et les démos ci-dessous se réorganisent d’elles-mêmes.',
      ),

      h2('Auto-ajustement'),
      p('Le comportement par défaut. Les pistes font au moins 16rem.'),
      demo(`grid(
  ...['Routage', 'Chargement de données', 'Ressources', 'Images', 'Îlots', 'Recherche'].map((name) =>
    card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, name))),
  ),
)`, { align: 'stretch' }),

      h2('Largeur de piste'),
      p(
        code('min'),
        ' fixe jusqu’où une piste peut se rétrécir avant que la grille ne passe à moins de colonnes. Plus petit veut dire plus de colonnes.',
      ),
      demo(`grid({ min: '9rem' },
  ...['sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'].map((name) =>
    card({ variant: 'flat' }, cardBody(text({ variant: 'small', align: 'center' }, name))),
  ),
)`, { align: 'stretch' }),

      h2('Un nombre fixe de colonnes'),
      p(
        'Passez un nombre quand le compte ne doit pas changer avec la fenêtre. Chaque piste prend une part égale.',
      ),
      demo(`grid({ columns: 3 },
  ...['Un', 'Deux', 'Trois'].map((name) =>
    card({ variant: 'flat' }, cardBody(text({ variant: 'small', align: 'center' }, name))),
  ),
)`, { align: 'stretch' }),

      h2('Un gabarit sur mesure'),
      p(
        'Une chaîne est transmise telle quelle comme ',
        code('grid-template-columns'),
        ', pour une découpe barre latérale / contenu ou tout ce que CSS grid sait exprimer.',
      ),
      demo(`grid({ columns: '12rem 1fr', gap: 'lg' },
  card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Barre latérale'))),
  card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Le contenu, qui prend le reste de la rangée.'))),
)`, { align: 'stretch' }),

      h2('Espacement et alignement'),
      demo(`grid({ min: '10rem', gap: 'xl', align: 'center' },
  card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Courte'))),
  card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Une carte plus haute, avec deux lignes de texte, pour montrer ce qu’align fait à ses voisines plus courtes.'))),
  card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Courte'))),
)`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['columns', 'number | string', '', 'Un nombre fixe de pistes, ou une valeur grid-template-columns brute. Omettez pour l’auto-ajustement.'],
        ['min', 'string', "'16rem'", 'Largeur minimale d’une piste en auto-ajustement.'],
        ['gap', 'Space', "'md'", 'Espace entre les pistes et les rangées.'],
        ['align', 'string', "'stretch'", 'N’importe quelle valeur align-items.'],
        ['as', 'string', "'div'", 'Élément à rendre.'],
      ]),
      p(
        'Une piste ne devient jamais plus large que la grille elle-même, même quand ',
        code('min'),
        ' dépasse la place disponible — un minimum de 16rem ne provoque donc pas de barre de défilement horizontale sur un téléphone de 320 px.',
      ),
    ],
  })
