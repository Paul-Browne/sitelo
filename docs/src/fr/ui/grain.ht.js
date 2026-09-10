import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/fr.js'

export default () =>
  uiLayout({
    title: 'Grain',
    description:
      'Une enveloppe qui pose un grain argentique sur tout ce qu’elle contient.',
    activeHref: '/fr/ui/grain',
    children: [
      p(
        'Le grain enlève sa platitude à une grande surface de couleur — un héros, un bandeau coloré, une carte qui se lirait sinon comme un simple rectangle. Il enveloppe le contenu comme le fait ',
        code('container()'),
        ', mais ne fixe aucune largeur : la texture est dessinée sur ',
        code('::after'),
        ', au-dessus des enfants et sans intercepter le pointeur.',
      ),
      p(
        'La tuile est un SVG statique de bruit fractal, peint une fois puis répété. Un ',
        code('filter'),
        ' sur les pixels vivants donnerait à peu près la même chose et coûterait un nouveau rendu chaque fois que quelque chose bouge en dessous.',
      ),

      h2('Grain de base'),
      demo(`grain({ style: 'background: var(--su-surface-2); padding: 2rem; border-radius: 0.75rem' },
  text({ variant: 'lead', align: 'center' }, 'Texturé.'),
)`, { align: 'stretch' }),

      h2('Intensité'),
      p(
        'Trois crans. Le thème fixe la force de base et l’intensité la met à l’échelle, parce qu’une surface presque noire prend le grain plus volontiers que le papier : mesurée en clarté perçue, la même tuile donne environ 1,6× le moucheté sur le fond sombre. Donc ',
        code('medium'),
        ' est une opacité plus faible en mode sombre, et les deux arrivent au même endroit.',
      ),
      demo(`grid({ min: '9rem' },
  ...['soft', 'medium', 'strong'].map((intensity) =>
    grain({ intensity, style: 'background: var(--su-surface-2); padding: 1.5rem 1rem; border-radius: 0.5rem' },
      text({ variant: 'small', align: 'center' }, intensity),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Échelle'),
      p(
        'La taille d’une tuile de bruit. Plus petit est plus fin : plus proche de la pellicule, plus loin du sable.',
      ),
      demo(`grid({ min: '9rem' },
  ...['60px', '180px', '420px'].map((scale) =>
    grain({ scale, intensity: 'strong', style: 'background: var(--su-surface-2); padding: 1.5rem 1rem; border-radius: 0.5rem' },
      text({ variant: 'small', align: 'center' }, scale),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Autour d’un conteneur'),
      p(
        'Le grain n’a pas de limite de largeur à lui, et c’est précisément ce qui rend ceci possible : l’enveloppe va d’un bord à l’autre et le ',
        code('container()'),
        ' à l’intérieur garde le texte centré et lisible.',
      ),
      demo(`grain({ as: 'section', style: 'background: var(--su-primary-soft); padding-block: 2.5rem; border-radius: 0.75rem' },
  container({ size: 'sm' },
    stack({ gap: 'sm', align: 'center' },
      heading({ level: 2, size: 'h4' }, 'Un bandeau texturé'),
      text({ tone: 'muted', align: 'center' }, 'Pleine largeur dehors, une colonne lisible dedans.'),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Sur une carte'),
      p(
        'La texture hérite du ',
        code('border-radius'),
        ' de la boîte : envelopper quelque chose d’arrondi ne lui carre pas les coins.',
      ),
      demo(`grid({ min: '12rem' },
  grain({ style: 'border-radius: var(--su-radius-lg)' },
    card({ variant: 'elevated' },
      cardBody(text({ variant: 'small' }, 'Grainée')),
    ),
  ),
  card({ variant: 'elevated' },
    cardBody(text({ variant: 'small' }, 'Nue')),
  ),
)`, { align: 'stretch' }),

      h2('Fusion'),
      p(
        'Par défaut la texture se pose sur le contenu à sa propre opacité. ',
        code('blend'),
        ' accepte n’importe quel ',
        code('mix-blend-mode'),
        ' : ',
        code('overlay'),
        ' et ',
        code('soft-light'),
        ' poussent le grain dans la couleur du dessous au lieu de la griser.',
      ),
      demo(`grid({ min: '9rem' },
  ...['normal', 'overlay', 'soft-light'].map((blend) =>
    grain({ blend, intensity: 'strong', style: 'background: var(--su-primary-soft); padding: 1.5rem 1rem; border-radius: 0.5rem' },
      text({ variant: 'small', align: 'center' }, blend),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['intensity', "'soft' | 'medium' | 'strong'", "'medium'", 'À quel point la texture est poussée, relativement à la base du thème.'],
        ['opacity', 'number', '', 'Une opacité brute, qui l’emporte sur intensity et sur le thème.'],
        ['scale', 'string', "'180px'", 'La taille d’une tuile de bruit.'],
        ['blend', 'string', "'normal'", 'Un mix-blend-mode pour la texture.'],
        ['as', 'string', "'div'", 'Élément à rendre, p. ex. section.'],
      ]),
    ],
  })
