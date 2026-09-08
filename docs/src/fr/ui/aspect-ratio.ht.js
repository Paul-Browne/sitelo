import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/fr.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Rapport d’aspect',
    description:
      'Fixe la forme d’une boîte, pour que rien ne bouge sur la page quand le contenu arrive.',
    activeHref: '/fr/ui/aspect-ratio',
    extraHead: uiHead(),
    children: [
      p(
        'La hauteur se déduit de la largeur avant que quoi que ce soit ne soit chargé : une image ou une intégration qui arrive en retard ne pousse pas le reste de la page vers le bas. L’enfant remplit la boîte et se retrouve rogné plutôt que bordé de bandes noires.',
      ),

      h2('Rapport d’aspect de base'),
      demo(`aspectRatio({ ratio: '16 / 9', style: 'background: var(--su-surface-2)' },
  '<img src="/logo.svg" alt="" style="object-fit: contain; padding: 2rem">',
)`, { align: 'stretch' }),

      h2('Rapports courants'),
      demo(`grid({ min: '9rem' },
  ...['16 / 9', '4 / 3', '1 / 1', '3 / 4'].map((ratio) =>
    stack({ gap: 'xs' },
      aspectRatio({ ratio, style: 'background: var(--su-surface-2); border-radius: 0.5rem' },
        '<img src="/logo.svg" alt="" style="object-fit: contain; padding: 1rem">'),
      text({ variant: 'caption', tone: 'muted', align: 'center' }, ratio),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Intégrations'),
      p(
        'La raison d’être de ce composant : une ',
        code('<iframe>'),
        ' n’a pas de taille intrinsèque, donc sans rapport elle s’effondre ou exige une hauteur codée en dur.',
      ),
      demo(`aspectRatio({ ratio: '16 / 9', style: 'background: var(--su-surface-2); border-radius: 0.6rem' },
  '<div style="display: grid; place-items: center; color: var(--su-text-subtle)">une &lt;iframe&gt; irait ici</div>',
)`, { align: 'stretch' }),

      h2('Dans une carte'),
      p(
        code('cardMedia()'),
        ' le fait déjà en haut d’une carte. Prenez ',
        code('aspectRatio()'),
        ' quand la boîte est ailleurs.',
      ),
      demo(`grid({ min: '12rem' },
  card(
    cardMedia({ src: '/logo.svg', alt: '', style: 'background: var(--su-surface-2); object-fit: contain; padding: 1rem' }),
    cardBody(text({ variant: 'small' }, 'cardMedia — intégré')),
  ),
  card(
    cardBody(
      stack({ gap: 'sm' },
        aspectRatio({ ratio: '1 / 1', style: 'background: var(--su-surface-2); border-radius: 0.5rem' },
          '<img src="/logo.svg" alt="" style="object-fit: contain; padding: 1rem">'),
        text({ variant: 'small' }, 'aspectRatio — partout ailleurs'),
      ),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Rognage'),
      p(
        'L’enfant est étiré pour remplir et rogné avec ',
        code('object-fit: cover'),
        '. Pour ce qui ne doit pas être rogné — un logo, un schéma — mettez ',
        code('object-fit: contain'),
        ' sur l’enfant, comme le fait chaque démo de cette page.',
      ),

      h2('Props'),
      propsTable([
        ['ratio', 'string', "'16 / 9'", 'N’importe quelle valeur CSS aspect-ratio.'],
        ['as', 'string', "'div'", 'Élément à rendre.'],
      ]),
    ],
  })
