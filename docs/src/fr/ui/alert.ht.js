import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/fr.js'

export default () =>
  uiLayout({
    title: 'Alerte',
    description:
      'Un message sur l’état de quelque chose, avec une icône et un rôle d’annonce qui suivent la couleur.',
    activeHref: '/fr/ui/alert',
    children: [
      p(
        'Une alerte dit au lecteur quelque chose sur la page ou sur l’action qu’il vient de faire. La couleur choisit à la fois l’icône et le rôle ARIA : ',
        code('danger'),
        ' et ',
        code('warning'),
        ' s’annoncent en ',
        code('role="alert"'),
        ', tout ce qui est plus calme devient un ',
        code('role="status"'),
        ' poli.',
      ),

      h2('Couleurs'),
      demo(`stack({ gap: 'sm' },
  alert({ color: 'primary', title: 'À noter' }, 'Une nouvelle version de sitelo est disponible.'),
  alert({ color: 'success', title: 'Déployé' }, '169 pages publiées en 1,7 seconde.'),
  alert({ color: 'warning', title: 'Page lente' }, 'Une page a mis plus de 500 ms à se rendre.'),
  alert({ color: 'danger', title: 'Build échoué' }, 'Deux liens internes pointent vers des pages inexistantes.'),
  alert({ color: 'neutral', title: 'Note' }, 'Les îlots sont désactivés dans ce projet.'),
)`, { align: 'stretch' }),

      h2('Sans titre'),
      p('Une alerte d’une ligne n’a pas besoin d’un titre au-dessus de la phrase.'),
      demo(`stack({ gap: 'sm' },
  alert({ color: 'success' }, 'Enregistré.'),
  alert({ color: 'danger' }, 'Cette adresse e-mail est déjà utilisée.'),
)`, { align: 'stretch' }),

      h2('Variantes'),
      demo(`stack({ gap: 'sm' },
  alert({ color: 'warning', variant: 'soft', title: 'Soft' }, 'Le défaut — une surface teintée.'),
  alert({ color: 'warning', variant: 'outline', title: 'Outline' }, 'Transparente, avec une bordure colorée.'),
  alert({ color: 'warning', variant: 'solid', title: 'Solid' }, 'La couleur pleine de la palette, pour ce qu’il ne faut surtout pas manquer.'),
)`, { align: 'stretch' }),

      h2('Icônes'),
      p(
        'Chaque couleur a une icône par défaut. Passez votre propre balisage dans ',
        code('icon'),
        ', ou ',
        code('icon: false'),
        ' pour aucune.',
      ),
      demo(`stack({ gap: 'sm' },
  alert({ color: 'primary', icon: false, title: 'Sans icône' }, 'Rien que le texte.'),
  alert({
    color: 'primary',
    title: 'Une icône personnalisée',
    icon: icon('star'),
  }, 'N’importe quel SVG convient — les icônes sont du balisage, pas une dépendance.'),
)`, { align: 'stretch' }),

      h2('Fermable'),
      p('Le bouton de fermeture porte son propre gestionnaire :'),
      codeBlock(
        'Balisage rendu',
        `onclick="import('/su/alert.js').then(m=>m.dismiss(this))"`,
        'html',
      ),
      p(
        'L’alerte ci-dessous se ferme donc vraiment alors que cette page n’importe rien. Si ce module n’arrive jamais, le bouton s’affiche et ne fait rien — raison pour laquelle une alerte ne devrait jamais être le seul endroit où un message apparaît.',
      ),
      demo(`alert({ color: 'primary', title: 'Fermable', dismissible: true },
  'Cliquez sur la × — le gestionnaire se télécharge au premier clic.',
)`, { align: 'stretch' }),

      h2('Contenu riche'),
      p('Les alertes acceptent n’importe quels enfants : une action ou une liste peut vivre à l’intérieur.'),
      demo(`alert({ color: 'danger', title: 'Vérification des liens échouée' },
  stack({ gap: 'sm' },
    text({ variant: 'small' }, 'Deux liens pointent vers des pages qui n’ont pas été générées :'),
    list({ plain: true },
      listItem({ title: '/docs/old-routing', description: 'lié depuis /docs' }),
      listItem({ title: '/blog/draft', description: 'lié depuis /blog' }),
    ),
    stack({ direction: 'row', gap: 'sm' },
      button({ size: 'sm', color: 'danger' }, 'Voir le détail'),
      button({ size: 'sm', variant: 'ghost', color: 'danger' }, 'Ignorer'),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Choisit la palette, l’icône par défaut et le rôle ARIA.'],
        ['variant', "'soft' | 'outline' | 'solid'", "'soft'", 'Le poids visuel de l’alerte.'],
        ['title', 'Child', '', 'Première ligne en gras.'],
        ['icon', 'Child | false', '', 'Balisage d’icône personnalisé, ou false pour aucune.'],
        ['dismissible', 'boolean', 'false', 'Ajoute un bouton de fermeture qui importe son propre gestionnaire.'],
        ['dismissLabel', 'string', "'Dismiss'", 'Nom accessible de ce bouton.'],
      ]),
    ],
  })
