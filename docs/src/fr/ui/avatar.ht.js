import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/fr.js'

export default () =>
  uiLayout({
    title: 'Avatar',
    description:
      'Une personne ou une chose dans un cercle — une image quand il y en a une, des initiales sinon.',
    activeHref: '/fr/ui/avatar',
    children: [
      p(
        'Donnez à un avatar un ',
        code('name'),
        ' et aucun ',
        code('src'),
        ' : il affiche les initiales plutôt qu’une image cassée. C’est le repli utile pour une liste de contributeurs où seules certaines personnes ont une photo.',
      ),

      h2('Avatar de base'),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  avatar({ name: 'Ada Lovelace' }),
  avatar({ name: 'Grace Hopper' }),
  avatar({ name: 'Alan Turing' }),
)`),

      h2('Avec une image'),
      p(
        'Quand ',
        code('src'),
        ' est défini, ',
        code('alt'),
        ' retombe sur le nom — un avatar n’est donc jamais une image sans libellé.',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  avatar({ src: '/logo.svg', alt: 'sitelo', style: 'background: var(--su-surface-2)' }),
  avatar({ src: '/logo.svg', name: 'sitelo', square: true, style: 'background: var(--su-surface-2)' }),
)`),

      h2('Tailles'),
      p('La taille du texte suit celle de l’avatar : les initiales restent proportionnées.'),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  avatar({ name: 'Petit Un', size: 'sm' }),
  avatar({ name: 'Moyen Un', size: 'md' }),
  avatar({ name: 'Grand Un', size: 'lg' }),
)`),

      h2('Carré'),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  avatar({ name: 'Projet A', square: true }),
  avatar({ name: 'Projet B', square: true, color: 'success' }),
)`),

      h2('Couleurs'),
      p('Un avatar sans image prend un fond doux de la palette.'),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center', wrap: true },
  avatar({ name: 'Primary', color: 'primary' }),
  avatar({ name: 'Neutral', color: 'neutral' }),
  avatar({ name: 'Success', color: 'success' }),
  avatar({ name: 'Warning', color: 'warning' }),
  avatar({ name: 'Danger', color: 'danger' }),
)`),

      h2('Icônes et autres contenus'),
      p('Les enfants remplacent les initiales, pour une icône ou un seul caractère.'),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  avatar({ color: 'neutral' },
    icon('user'),
  ),
  avatar({ color: 'primary' }, '?'),
)`),

      h2('Groupes'),
      p(
        code('avatarGroup()'),
        ' superpose ses enfants et replie tout ce qui dépasse ',
        code('max'),
        ' en un compteur.',
      ),
      demo(`stack({ gap: 'md' },
  avatarGroup(
    avatar({ name: 'Ada Lovelace' }),
    avatar({ name: 'Grace Hopper' }),
    avatar({ name: 'Alan Turing' }),
  ),
  avatarGroup({ max: 3 },
    avatar({ name: 'Ada Lovelace' }),
    avatar({ name: 'Grace Hopper' }),
    avatar({ name: 'Alan Turing' }),
    avatar({ name: 'Katherine Johnson' }),
    avatar({ name: 'Barbara Liskov' }),
    avatar({ name: 'Margaret Hamilton' }),
  ),
  avatarGroup({ max: 2, size: 'sm' },
    avatar({ name: 'Ada Lovelace', size: 'sm' }),
    avatar({ name: 'Grace Hopper', size: 'sm' }),
    avatar({ name: 'Alan Turing', size: 'sm' }),
  ),
)`, { align: 'start' }),

      h2('Dans une liste'),
      demo(`list(
  listItem({
    start: avatar({ name: 'Ada Lovelace', size: 'sm' }),
    title: 'Ada Lovelace',
    description: 'A poussé 3 commits sur main',
  }),
  listItem({
    start: avatar({ name: 'Grace Hopper', size: 'sm', color: 'success' }),
    title: 'Grace Hopper',
    description: 'A ouvert une pull request',
  }),
)`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['name', 'string', '', 'Sert aux initiales, au title et de repli pour l’alt de l’image.'],
        ['src', 'string', '', 'Image à afficher à la place des initiales.'],
        ['alt', 'string', '', 'Texte alternatif de l’image ; retombe sur name.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Diamètre, et taille de texte des initiales.'],
        ['square', 'boolean', 'false', 'Rectangle arrondi au lieu d’un cercle.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", '', 'Palette du fond des initiales.'],
      ]),
      p(
        code('avatarGroup()'),
        ' prend ',
        code('max'),
        ' — combien en montrer avant de replier le reste en un compteur — et ',
        code('size'),
        ', qui ne sert qu’à ce compteur.',
      ),
    ],
  })
