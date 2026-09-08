import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/fr.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Squelette',
    description:
      'Un substitut à la forme du contenu qui n’est pas encore arrivé.',
    activeHref: '/fr/ui/skeleton',
    extraHead: uiHead(),
    children: [
      p(
        'Un squelette tient la place du contenu pendant son chargement. Sur un site statique c’est plus rare que dans une application — le HTML est déjà là — mais c’est en général ce que devrait être le ',
        code('fallback'),
        ' d’un îlot, et ce qu’affiche une zone rendue côté client avant que ses données arrivent.',
      ),
      p(
        'Les squelettes sont décoratifs : chacun est ',
        code('aria-hidden'),
        ', pour qu’un lecteur d’écran ne se voie pas lire une liste de boîtes vides.',
      ),

      h2('Formes'),
      demo(`stack({ gap: 'md' },
  skeleton({ height: '2.5rem' }),
  skeleton({ variant: 'text', width: '70%' }),
  skeleton({ variant: 'circle', width: '3rem', height: '3rem' }),
)`, { align: 'stretch' }),

      h2('Texte'),
      p(
        code('lines'),
        ' rend l’équivalent d’un paragraphe, la dernière ligne courte pour que cela se lise comme de la prose et non comme un bloc.',
      ),
      demo(`stack({ gap: 'lg' },
  skeleton({ lines: 2 }),
  skeleton({ lines: 4 }),
)`, { align: 'stretch' }),

      h2('À la forme de la vraie chose'),
      p(
        'Un squelette est le plus convaincant quand il épouse la mise en page qu’il remplace — même carte, mêmes rangées, mêmes tailles.',
      ),
      demo(`grid({ min: '14rem' },
  card(
    cardBody(
      stack({ gap: 'md' },
        stack({ direction: 'row', gap: 'sm', align: 'center' },
          skeleton({ variant: 'circle', width: '2.5rem', height: '2.5rem' }),
          stack({ gap: 'xs', style: 'flex: 1' },
            skeleton({ variant: 'text', width: '60%' }),
            skeleton({ variant: 'text', width: '40%' }),
          ),
        ),
        skeleton({ lines: 3 }),
      ),
    ),
  ),
  card(
    cardBody(
      stack({ direction: 'row', gap: 'sm', align: 'center' },
        avatar({ name: 'Ada Lovelace' }),
        stack({ gap: 'none' },
          text({ variant: 'small' }, 'Ada Lovelace'),
          text({ variant: 'caption', tone: 'muted' }, 'A poussé 3 commits'),
        ),
      ),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Comme repli d’un îlot'),
      p(
        'Un îlot serveur embarque son repli dans le HTML statique et y glisse le fragment rendu au moment de la requête. Un squelette de la même forme que le fragment évite que la page saute à son arrivée.',
      ),
      demo(`card(
  cardHeader({ title: 'Commentaires' }),
  cardBody(
    stack({ gap: 'md' },
      skeleton({ lines: 2 }),
      divider({ spacing: 'xs' }),
      skeleton({ lines: 2 }),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Mouvement'),
      p(
        'Le scintillement s’arrête pour qui a demandé à son système de réduire les animations — c’est géré dans la feuille de style, sans aucune prop à régler.',
      ),

      h2('Props'),
      propsTable([
        ['variant', "'rect' | 'text' | 'circle'", "'rect'", 'La forme du substitut.'],
        ['width', 'string', '', 'N’importe quelle largeur CSS.'],
        ['height', 'string', '', 'N’importe quelle hauteur CSS.'],
        ['lines', 'number', '', 'Rendre ce nombre de lignes de texte, la dernière courte.'],
      ]),
    ],
  })
