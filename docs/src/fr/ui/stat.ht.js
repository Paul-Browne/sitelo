import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/fr.js'

export default () =>
  uiLayout({
    title: 'Statistique',
    description:
      'Un chiffre qui mérite un regard, avec ce qu’il signifie et dans quel sens il a bougé.',
    activeHref: '/fr/ui/stat',
    children: [
      p(
        'Une statistique, c’est un libellé, une valeur et éventuellement une variation. ',
        code('statGroup()'),
        ' en réunit plusieurs sur une même surface, séparées par des filets.',
      ),

      h2('Statistique de base'),
      demo(`statGroup(
  stat({ label: 'Pages', value: '204' }),
  stat({ label: 'Temps de build', value: '1,1 s' }),
  stat({ label: 'JS client', value: '3,3 ko' }),
)`, { align: 'stretch' }),

      h2('Avec une variation'),
      p(
        'La variation prend sa couleur de ',
        code('color'),
        ' — vert pour un chiffre parti dans le bon sens, rouge sinon. Ne comptez pas sur la couleur seule : gardez le signe ou le mot.',
      ),
      demo(`statGroup(
  stat({ label: 'Pages', value: '204', change: '+8 cette semaine', color: 'success' }),
  stat({ label: 'Temps de build', value: '1,1 s', change: '−0,3 s', color: 'success' }),
  stat({ label: 'Bundle', value: '9,9 ko', change: '+1,2 ko', color: 'danger' }),
)`, { align: 'stretch' }),

      h2('Avec des icônes'),
      demo(`statGroup(
  stat({
    label: 'Déploiements',
    value: '128',
    color: 'primary',
    icon: icon('zap'),
  }),
  stat({
    label: 'Contributeurs',
    value: '17',
    color: 'primary',
    icon: icon('user'),
  }),
)`, { align: 'stretch' }),

      h2('Texte d’aide'),
      demo(`statGroup(
  stat({
    label: 'Lighthouse',
    value: '100',
    change: 'accessibilité',
    color: 'success',
    help: 'Mesuré sur chaque page anglaise dans la CI.',
  }),
  stat({
    label: 'Index Pagefind',
    value: '204',
    help: 'Reconstruit à la fin de chaque build.',
  }),
)`, { align: 'stretch' }),

      h2('Toute seule'),
      p('Une statistique isolée n’a pas besoin de groupe — elle n’a simplement pas de surface à elle.'),
      demo(`card(
  cardBody(stat({ label: 'Pages au total', value: '204', change: '+8', color: 'success' })),
)`, { align: 'stretch' }),

      h2('Colonnes fixes'),
      p(
        'Les statistiques s’auto-ajustent par défaut. ',
        code('columns'),
        ' fige leur nombre quand les chiffres doivent rester sur une seule rangée.',
      ),
      demo(`statGroup({ columns: 'repeat(2, 1fr)' },
  stat({ label: 'Réussis', value: '215', color: 'success' }),
  stat({ label: 'Échoués', value: '0', color: 'success' }),
)`, { align: 'stretch' }),

      h2('À partir de données'),
      demo(`return (() => {
  const report = [
    { label: 'Pages', value: 204 },
    { label: 'Ressources', value: 208 },
    { label: 'Total', value: '9,7 Mo' },
  ]

  return statGroup(
    report.map((entry) => stat({ label: entry.label, value: String(entry.value) })),
  )
})()`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['label', 'Child', '', 'Ce que le chiffre compte.'],
        ['value', 'Child', '', 'Le chiffre lui-même, en chiffres tabulaires.'],
        ['change', 'Child', '', 'Un delta, coloré par color.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", '', 'Colore la variation et l’icône.'],
        ['icon', 'Child', '', 'Glyphe décoratif au-dessus du libellé.'],
        ['help', 'Child', '', 'Une ligne plus discrète sous le reste.'],
      ]),
      p(code('statGroup()'), ' prend ', code('columns'), ' — n’importe quelle valeur ', code('grid-template-columns'), '.'),
    ],
  })
