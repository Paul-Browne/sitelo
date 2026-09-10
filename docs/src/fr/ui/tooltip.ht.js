import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/fr.js'

export default () =>
  uiLayout({
    title: 'Infobulle',
    description:
      'Une courte indication au survol et au focus, dessinée entièrement en CSS.',
    activeHref: '/fr/ui/tooltip',
    children: [
      p(
        'Le texte de l’infobulle vit dans un attribut de données et est dessiné par un pseudo-élément : il n’y a donc aucun script, rien à positionner à l’exécution et rien qui traîne dans le DOM. Elle apparaît au survol et au focus clavier, dont s’occupe la moitié ',
        code(':focus-within'),
        ' de la règle.',
      ),

      h2('Infobulle de base'),
      demo(`stack({ direction: 'row', gap: 'md' },
  tooltip({ content: 'Copier dans le presse-papiers' },
    iconButton({
      label: 'Copier',
      variant: 'soft',
      color: 'neutral',
      icon: icon('copy'),
    }),
  ),
  tooltip({ content: 'Reconstruire le site' },
    button({ variant: 'outline', color: 'neutral' }, 'Reconstruire'),
  ),
)`),

      h2('Placement'),
      p('Au-dessus par défaut, en dessous quand il n’y a pas la place au-dessus.'),
      demo(`stack({ direction: 'row', gap: 'lg' },
  tooltip({ content: 'Au-dessus du déclencheur' },
    button({ variant: 'soft', color: 'neutral' }, 'Haut'),
  ),
  tooltip({ content: 'En dessous du déclencheur', placement: 'bottom' },
    button({ variant: 'soft', color: 'neutral' }, 'Bas'),
  ),
)`),

      h2('Noms accessibles'),
      p(
        'Le texte de l’infobulle est décoratif — il est dessiné depuis la propriété CSS ',
        code('content'),
        ', que les lecteurs d’écran n’annoncent pas de façon fiable. Le contrôle à l’intérieur a toujours besoin de son propre nom accessible, ce que fournit le ',
        code('label'),
        ' d’',
        code('iconButton()'),
        '. Quand l’infobulle dit quelque chose que le nom du contrôle ne dit pas, passez ',
        code('label: true'),
        ' pour le répéter dans un span masqué visuellement.',
      ),
      demo(`stack({ direction: 'row', gap: 'lg' },
  tooltip({ content: 'Déploie en production immédiatement', label: true },
    button({ color: 'danger' }, 'Déployer'),
  ),
)`),

      h2('Sur du texte'),
      p('Une infobulle enveloppe du contenu en ligne aussi volontiers qu’un bouton.'),
      demo(`text(
  'Le build écrit dans ',
  tooltip({ content: 'Configurable avec outDir' }, code('dist/')),
  ' et nulle part ailleurs.',
)`, { align: 'stretch' }),

      h2('Quand ne pas en mettre'),
      p(
        'Les infobulles n’apparaissent pas au toucher et s’évanouissent dès que le pointeur s’en va. Tout ce qu’un lecteur doit absolument avoir — un message d’erreur, l’explication d’un champ obligatoire — a sa place dans le texte ',
        code('help'),
        ' du champ lui-même, pas dans une infobulle.',
      ),

      h2('Props'),
      propsTable([
        ['content', 'string', '', 'Le texte de l’indication.'],
        ['placement', "'top' | 'bottom'", "'top'", 'De quel côté du déclencheur elle apparaît.'],
        ['label', 'boolean', 'false', 'Exposer aussi le texte aux lecteurs d’écran, dans un span masqué.'],
      ]),
    ],
  })
