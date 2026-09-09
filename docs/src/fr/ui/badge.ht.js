import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/fr.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Badge',
    description:
      'Un compteur ou un point épinglé dans le coin de ce qu’il entoure.',
    activeHref: '/fr/ui/badge',
    extraHead: uiHead(),
    children: [
      p(
        'Un badge entoure quelque chose et épingle un marqueur dans son coin supérieur : les messages non lus sur un bouton de boîte de réception, un point « en ligne » sur un avatar. Il prend en enfants ce qu’il marque.',
      ),

      h2('Badge de base'),
      demo(`stack({ direction: 'row', gap: 'xl', align: 'center' },
  badge({ content: 4 }, button({ variant: 'soft', color: 'neutral' }, 'Boîte de réception')),
  badge({ content: 12 }, avatar({ name: 'Ada Lovelace' })),
)`),

      h2('Couleurs'),
      demo(`stack({ direction: 'row', gap: 'xl', align: 'center', wrap: true },
  badge({ content: 3, color: 'primary' }, button({ variant: 'soft', color: 'neutral' }, 'Primary')),
  badge({ content: 3, color: 'neutral' }, button({ variant: 'soft', color: 'neutral' }, 'Neutral')),
  badge({ content: 3, color: 'success' }, button({ variant: 'soft', color: 'neutral' }, 'Success')),
  badge({ content: 3, color: 'warning' }, button({ variant: 'soft', color: 'neutral' }, 'Warning')),
  badge({ content: 3, color: 'danger' }, button({ variant: 'soft', color: 'neutral' }, 'Danger')),
)`),

      h2('Maximum'),
      p(
        'Un compteur au-delà de ',
        code('max'),
        ' s’affiche en ',
        code('n+'),
        ', pour qu’un badge ne devienne jamais assez large pour déséquilibrer ce sur quoi il se pose.',
      ),
      demo(`stack({ direction: 'row', gap: 'xl', align: 'center', wrap: true },
  badge({ content: 9 }, button({ variant: 'soft', color: 'neutral' }, 'Neuf')),
  badge({ content: 250 }, button({ variant: 'soft', color: 'neutral' }, 'Plafonné à 99')),
  badge({ content: 250, max: 999 }, button({ variant: 'soft', color: 'neutral' }, 'max: 999')),
)`),

      h2('Point'),
      p(
        'Un point dit « quelque chose a changé » sans dire combien. Donnez-lui un ',
        code('label'),
        ' — un point nu ne signifie rien pour un lecteur d’écran, donc sans libellé il est entièrement masqué de l’arbre d’accessibilité.',
      ),
      demo(`stack({ direction: 'row', gap: 'xl', align: 'center' },
  badge({ dot: true, color: 'success', label: 'En ligne' }, avatar({ name: 'Ada Lovelace' })),
  badge({ dot: true, color: 'warning', label: 'Demande attention' },
    iconButton({
      label: 'Paramètres',
      variant: 'soft',
      color: 'neutral',
      icon: icon('settings'),
    }),
  ),
)`),

      h2('Nommer le compteur'),
      p(
        'Un nombre seul est ambigu hors contexte. ',
        code('label'),
        ' devient le nom accessible du badge : il se lit « 4 messages non lus » plutôt que « 4 ».',
      ),
      demo(`badge({ content: 4, label: '4 messages non lus' },
  button({ variant: 'soft', color: 'neutral' }, 'Boîte de réception'),
)`),

      h2('Changer le compteur'),
      p(
        'Un compteur est le nombre d’une page qui a le plus de chances de changer pendant qu’elle est ouverte. ',
        code('setBadge()'),
        ' le plafonne à ',
        code('max'),
        ' comme l’a fait le serveur, garde avec lui le texte annoncé, et sort de l’arbre d’accessibilité un badge vidé — c’est ainsi qu’un badge disparaît.',
      ),
      p('Le texte annoncé, c’est la prose du site : passez-le dès que le badge en a un :'),
      codeBlock('N’importe où', `button({ onclick: "import('/su/badge.js').then(m=>m.set('inbox',0))" }, 'Mark all read')`, 'javascript'),
      p('Ou depuis votre propre module, quand il y en a déjà un qui tourne :'),
      codeBlock('src/main.js', `import { setBadge } from 'sitelo/ui/client'

setBadge('inbox', 7, { label: '7 unread messages' })`, 'javascript'),

      h2('Props'),
      propsTable([
        ['content', 'string | number', '', 'Ce qu’affiche le badge. Ignoré quand dot est défini.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'danger'", 'Couleur du badge.'],
        ['dot', 'boolean', 'false', 'Un petit point au lieu d’une valeur.'],
        ['max', 'number', '99', 'Les compteurs au-delà s’affichent en n+.'],
        ['label', 'string', '', 'Nom accessible du badge lui-même.'],
      ]),
    ],
  })
