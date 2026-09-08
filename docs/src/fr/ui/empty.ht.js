import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/fr.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'État vide',
    description:
      'À quoi ressemble une liste avant d’avoir quoi que ce soit dedans.',
    activeHref: '/fr/ui/empty',
    extraHead: uiHead(),
    children: [
      p(
        'Un espace blanc se lit comme un bug. Un état vide dit quel espace est vide, pourquoi, et quoi faire ensuite — et c’est le cas qu’on oublie le plus facilement, parce qu’en développement il y a toujours des données.',
      ),

      h2('État vide de base'),
      demo(`empty({
  title: 'Pas encore de billets',
  description: 'Ajoutez un fichier Markdown dans src/posts et il apparaîtra ici.',
})`, { align: 'stretch' }),

      h2('Avec une icône'),
      p(
        'L’icône est décorative — elle est marquée ',
        code('aria-hidden'),
        ', puisque le titre dit déjà ce qui se passe.',
      ),
      demo(`empty({
  icon: icon('folder'),
  title: 'Rien ici',
  description: 'Ce dossier ne contient aucune page.',
})`, { align: 'stretch' }),

      h2('Avec une action'),
      p('Les enfants deviennent la rangée d’actions.'),
      demo(`empty({
  icon: icon('search'),
  title: 'Aucun résultat pour « îlots »',
  description: 'Vérifiez l’orthographe, ou parcourez plutôt la documentation.',
},
  button({ href: '/fr/docs' }, 'Parcourir la documentation'),
  button({ variant: 'outline', color: 'neutral' }, 'Effacer la recherche'),
)`, { align: 'stretch' }),

      h2('Dans une carte'),
      demo(`card(
  cardHeader({ title: 'Déploiements' }),
  cardBody(
    empty({
      title: 'Aucun déploiement',
      description: 'Poussez sur main et le premier build apparaîtra ici.',
    }, button({ size: 'sm' }, 'Connecter un dépôt')),
  ),
)`, { align: 'stretch' }),

      h2('À la place d’un tableau'),
      p(
        'Remplacez le tableau par un état vide plutôt que de rendre un en-tête sans aucune ligne dessous.',
      ),
      demo(`return (() => {
  const rows = []

  return card(
    cardHeader({ title: 'Historique des builds' }),
    rows.length
      ? table({ columns: [{ key: 'commit', header: 'Commit' }], rows })
      : cardBody(empty({
          title: 'Aucun build enregistré',
          description: 'Les exécutions apparaissent ici dès que le site a été déployé au moins une fois.',
        })),
  )
})()`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['icon', 'Child', '', 'Glyphe décoratif au-dessus du titre ; masqué aux lecteurs d’écran.'],
        ['title', 'Child', '', 'Ce qui est vide, en quelques mots.'],
        ['description', 'Child', '', 'Pourquoi c’est vide, ou quoi y faire.'],
      ]),
      p('Les enfants sont rendus comme rangée d’actions sous la description.'),
    ],
  })
