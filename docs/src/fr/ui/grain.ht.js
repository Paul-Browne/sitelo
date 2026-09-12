import { h2, p } from 'javascript-to-html'
import { code, demo, grainSandbox, grainSandboxHead, propsTable, uiLayout } from '../../lib/fr.js'

export default () =>
  uiLayout({
    title: 'Grain',
    description:
      'Une enveloppe qui pose un grain argentique sur tout ce qu’elle contient.',
    activeHref: '/fr/ui/grain',
    extraHead: grainSandboxHead(),
    children: [
      p(
        'Le grain enlève sa platitude à une grande surface de couleur — un héros, un bandeau coloré, une carte qui se lirait sinon comme un simple rectangle. Il enveloppe le contenu comme le fait ',
        code('container()'),
        ', mais ne fixe aucune largeur : la texture est dessinée sur ',
        code('::after'),
        ', au-dessus des enfants et sans intercepter le pointeur.',
      ),
      p(
        'La tuile est un SVG statique de bruit fractal, peint une seule fois. Un ',
        code('filter'),
        ' sur les pixels vivants donnerait à peu près la même chose et coûterait un nouveau rendu chaque fois que quelque chose bouge en dessous.',
      ),

      p(
        'Il y a deux niveaux de réglage. ',
        code('opacity'),
        ' dit à quel point la texture est poussée une fois dessinée ; laissée telle quelle, c’est le thème qui la fixe, et c’est sur cette valeur que les deux thèmes sont équilibrés. ',
        code('type'),
        ', ',
        code('frequency'),
        ', ',
        code('octaves'),
        ', ',
        code('seed'),
        ' et ',
        code('color'),
        ' sont la turbulence elle-même ; toucher à l’un d’eux construit une texture pour cet élément-là au lieu d’utiliser celle, partagée, de la feuille de styles.',
      ),

      h2('Grain de base'),
      demo(`grain({ style: 'background: var(--su-surface-2); padding: 2rem; border-radius: 0.75rem' },
  text({ variant: 'lead', align: 'center' }, 'Texturé.'),
)`, { align: 'stretch' }),

      h2('Type de bruit'),
      p(
        code('fractal'),
        ' additionne le bruit tel quel et donne le moucheté régulier de la pellicule. ',
        code('turbulence'),
        ' en prend la valeur absolue, ce qui laisse des veines sombres et des paquets : plus proche de la fumée ou du marbre que du grain.',
      ),
      demo(`grid({ min: '9rem' },
  ...['fractal', 'turbulence'].map((type) =>
    grain({ type, style: 'background: var(--su-surface-2); padding: 1.5rem 1rem; border-radius: 0.5rem' },
      text({ variant: 'small', align: 'center' }, type),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Fréquence'),
      p(
        'Cycles par pixel : plus haut est plus fin. Le bruit est dessiné à la taille de la boîte elle-même, une unité par pixel, donc cela tient quelles que soient ses mesures — une petite carte et un bandeau pleine largeur reçoivent le même grain, et rien ne se répète.',
      ),
      demo(`grid({ min: '9rem' },
  ...[0.2, 0.57, 1.2].map((frequency) =>
    grain({ frequency, style: 'background: var(--su-surface-2); padding: 1.5rem 1rem; border-radius: 0.5rem' },
      text({ variant: 'small', align: 'center' }, String(frequency)),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Octaves'),
      p(
        'Combien de couches de bruit sont additionnées, chacune plus fine et plus faible que la précédente. Une seule est plate et régulière ; davantage ajoutent du détail, et chacune coûte au navigateur une passe de plus au premier dessin de la tuile.',
      ),
      demo(`grid({ min: '9rem' },
  ...[1, 3, 6].map((octaves) =>
    grain({ octaves, style: 'background: var(--su-surface-2); padding: 1.5rem 1rem; border-radius: 0.5rem' },
      text({ variant: 'small', align: 'center' }, String(octaves)),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Graine'),
      p(
        'Quel bruit est dessiné. N’importe quel nombre fait l’affaire, le même donne toujours le même motif, et rien d’autre ne change dans la texture — pratique quand deux panneaux grainés se touchent et que la répétition se trahit.',
      ),
      demo(`grid({ min: '9rem' },
  ...[0, 7, 42].map((seed) =>
    grain({ seed, style: 'background: var(--su-surface-2); padding: 1.5rem 1rem; border-radius: 0.5rem' },
      text({ variant: 'small', align: 'center' }, String(seed)),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Couleur'),
      p(
        'Le bruit est gris par défaut. ',
        code('color'),
        ' le teinte : la valeur est multipliée dans le filtre, elle doit donc pouvoir être résolue à la construction de la page — ',
        code('#rgb'),
        ', ',
        code('#rrggbb'),
        ' ou ',
        code('rgb()'),
        '. Une couleur nommée, ',
        code('currentColor'),
        ' ou un ',
        code('var()'),
        ' ne le peuvent pas, et laissent le bruit gris plutôt que de faire échouer le build. L’alpha dit combien de teinte : ',
        code('#ff880080'),
        ' est la moitié de ',
        code('#ff8800'),
        ', et un alpha nul n’en met aucune.',
      ),
      demo(`grid({ min: '9rem' },
  ...['#0a7a45', '#c05621', '#2f7fc7'].map((color) =>
    grain({ color, style: 'background: var(--su-surface-2); padding: 1.5rem 1rem; border-radius: 0.5rem' },
      text({ variant: 'small', align: 'center' }, color),
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
    grain({ blend, style: 'background: var(--su-primary-soft); padding: 1.5rem 1rem; border-radius: 0.5rem' },
      text({ variant: 'small', align: 'center' }, blend),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Bac à sable'),
      grainSandbox(),

      h2('Props'),
      propsTable([
        ['opacity', 'number', '', 'Opacité de la texture. Laissée telle quelle, le thème la fixe.'],
        ['blend', 'string', "'normal'", 'Un mix-blend-mode pour la texture.'],
        ['type', "'fractal' | 'turbulence'", "'fractal'", 'Quelle turbulence dessiner.'],
        ['frequency', 'number', '0.57', 'Cycles par pixel : plus haut est plus fin.'],
        ['octaves', 'number', '3', 'Couches de bruit additionnées, de 1 à 8.'],
        ['seed', 'number', '0', 'Quel bruit dessiner.'],
        ['color', 'string', '', 'Teinte le bruit ; l’alpha dit combien. #rgb, #rrggbb, #rrggbbaa, rgb() ou rgba().'],
        ['as', 'string', "'div'", 'Élément à rendre, p. ex. section.'],
      ]),
    ],
  })
