import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/fr.js'

export default () =>
  uiLayout({
    title: 'Carte',
    description:
      'Une surface pour du contenu groupé, avec en-tête, corps, pied et média qui savent cohabiter.',
    activeHref: '/fr/ui/card',
    children: [
      p(
        'Une carte groupe du contenu lié sur sa propre surface. Les parties — ',
        code('cardHeader()'),
        ', ',
        code('cardMedia()'),
        ', ',
        code('cardBody()'),
        ', ',
        code('cardFooter()'),
        ' — sont des fonctions distinctes plutôt que des props : vous n’utilisez que celles dont vous avez besoin, dans l’ordre que la maquette réclame.',
      ),

      h2('Carte de base'),
      demo(`card(
  cardHeader({ title: 'Routage par fichiers', subtitle: 'src/about.ht.js → /about' }),
  cardBody(text({ variant: 'small', tone: 'muted' }, 'Les dossiers deviennent des chemins. Les crochets deviennent des paramètres. Il n’y a aucun routeur à configurer.')),
)`, { align: 'stretch' }),

      h2('Variantes'),
      p(
        'Outlined est la valeur par défaut. Elevated échange la bordure contre une ombre, et flat teinte la surface plutôt que l’une ou l’autre.',
      ),
      demo(`grid({ min: '13rem' },
  card({ variant: 'outlined' }, cardBody(text({ variant: 'small' }, 'Outlined'))),
  card({ variant: 'elevated' }, cardBody(text({ variant: 'small' }, 'Elevated'))),
  card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Flat'))),
)`, { align: 'stretch' }),

      h2('Avec un pied'),
      p(
        code('divided'),
        ' ajoute le filet au-dessus du pied. Le pied est poussé en bas : des cartes alignées gardent donc leurs actions sur la même ligne même quand le texte au-dessus est de longueur différente.',
      ),
      demo(`grid({ min: '14rem' },
  card(
    cardHeader({ title: 'Site de base' }),
    cardBody(text({ variant: 'small', tone: 'muted' }, 'Un projet minimal, plus des configs de déploiement.')),
    cardFooter({ divided: true }, button({ size: 'sm', variant: 'soft' }, 'Ouvrir')),
  ),
  card(
    cardHeader({ title: 'Blog en Markdown' }),
    cardBody(text({ variant: 'small', tone: 'muted' }, 'Un dossier de fichiers .md rendus en pages statiques, avec un flux RSS et aucun JavaScript client.')),
    cardFooter({ divided: true }, button({ size: 'sm', variant: 'soft' }, 'Ouvrir')),
  ),
)`, { align: 'stretch' }),

      h2('Média'),
      p(
        code('cardMedia()'),
        ' remplit le haut de la carte à un rapport fixe, pour qu’une rangée de cartes reste régulière quelles que soient les dimensions des images sources.',
      ),
      demo(`grid({ min: '13rem' },
  card(
    cardMedia({ src: '/logo.svg', alt: '', style: 'background: var(--su-surface-2); object-fit: contain; padding: 1rem' }),
    cardBody(text({ variant: 'small' }, 'Par défaut 16 / 9')),
  ),
  card(
    cardMedia({ src: '/logo.svg', alt: '', ratio: '4 / 3', style: 'background: var(--su-surface-2); object-fit: contain; padding: 1rem' }),
    cardBody(text({ variant: 'small' }, 'ratio: 4 / 3')),
  ),
)`, { align: 'stretch' }),

      h2('Une carte entière en lien'),
      p(
        'Donnez un ',
        code('href'),
        ' à la carte et toute la surface devient un lien, avec le léger soulèvement au survol qui va avec. Ne mettez ni boutons ni autres liens dans une carte de cette forme — le contenu interactif ne peut pas s’imbriquer dans un lien. Préférez un bouton en pied sur une carte simple.',
      ),
      demo(`grid({ min: '14rem' },
  card({ href: '/fr/docs/routing' },
    cardHeader({ title: 'Routage', subtitle: 'Lire le guide' }),
    cardBody(text({ variant: 'small', tone: 'muted' }, 'Routes dynamiques, attrape-tout et groupes de routes.')),
  ),
  card({ href: '/fr/docs/data' },
    cardHeader({ title: 'Chargement de données', subtitle: 'Lire le guide' }),
    cardBody(text({ variant: 'small', tone: 'muted' }, 'data() s’exécute au build, avec mise en cache de fetch.')),
  ),
)`, { align: 'stretch' }),

      h2('Espacement interne'),
      p(
        'Une seule prop règle d’un coup l’espacement de toutes les parties de la carte.',
      ),
      demo(`stack({ gap: 'md' },
  card({ padding: 'sm' }, cardBody(text({ variant: 'small' }, 'padding: sm'))),
  card({ padding: 'xl' }, cardBody(text({ variant: 'small' }, 'padding: xl'))),
)`, { align: 'stretch' }),

      h2('Contenu libre'),
      p(
        'Les parties sont un confort, pas une obligation — une carte accepte n’importe quels enfants, et ',
        code('cardHeader()'),
        ' accepte les siens à côté du titre, pour un avatar ou un bouton de menu à droite.',
      ),
      demo(`card(
  cardHeader(
    { title: 'Paul Browne', subtitle: 'Déployé il y a 4 minutes' },
    avatar({ name: 'Paul Browne', size: 'sm' }),
  ),
  cardBody(
    stack({ direction: 'row', gap: 'sm', wrap: true },
      chip({ color: 'success', dot: true }, 'Build réussi'),
      chip({ color: 'neutral' }, '12 pages'),
      chip({ color: 'neutral' }, '4,1 ko'),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Props'),
      p(code('card()'), ' :'),
      propsTable([
        ['variant', "'outlined' | 'elevated' | 'flat'", "'outlined'", 'Comment la surface se détache de la page.'],
        ['href', 'string', '', 'Rend la carte entière comme un lien.'],
        ['padding', 'Space', "'lg'", 'Espacement utilisé par chaque partie de la carte.'],
      ]),
      p('Les parties :'),
      propsTable([
        ['cardHeader', 'title, subtitle', '', 'Titre et sous-titre, plus les enfants placés à côté.'],
        ['cardTitle', 'as', "'h3'", 'Le titre seul, quand l’en-tête est construit à la main.'],
        ['cardSubtitle', '', '', 'La ligne atténuée sous un titre.'],
        ['cardMedia', 'src, alt, ratio', "'16 / 9'", 'Une image de couverture à rapport fixe.'],
        ['cardBody', '', '', 'La zone de contenu principale.'],
        ['cardFooter', 'divided', 'false', 'Rangée d’actions en bas ; divided ajoute le filet au-dessus.'],
      ], { headers: ['Partie', 'Props', 'Défaut', 'Description'] }),
    ],
  })
