import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/fr.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Groupe de boutons radio',
    description:
      'Un choix parmi plusieurs, en vrais inputs radio partageant un name — avec une légende et un rôle de groupe.',
    activeHref: '/fr/ui/radio',
    extraHead: uiHead(),
    children: [
      p(
        'Les radios servent à choisir exactement une option dans un petit ensemble visible. ',
        code('radio()'),
        ' en rend un ; ',
        code('choiceGroup()'),
        ' construit l’ensemble à partir d’un tableau et lui donne la légende et le ',
        code('role="radiogroup"'),
        ' qui en font un groupe plutôt qu’un tas d’inputs.',
      ),
      p(
        'Ils partagent un ',
        code('name'),
        ', donc le navigateur gère l’exclusivité mutuelle et la navigation aux flèches entre eux. Rien ici n’embarque de script.',
      ),

      h2('Groupe de base'),
      demo(`choiceGroup({
  legend: 'Formule',
  name: 'plan',
  value: 'pro',
  options: [
    { value: 'free', label: 'Gratuite' },
    { value: 'pro', label: 'Pro' },
    { value: 'team', label: 'Équipe' },
  ],
})`, { align: 'stretch' }),

      h2('En ligne'),
      p(
        'Les libellés courts se lisent mieux sur une seule ligne. Les longs devraient rester empilés, ce qui est le défaut.',
      ),
      demo(`choiceGroup({
  legend: 'Format',
  name: 'form-factor',
  direction: 'row',
  value: 'desktop',
  options: ['desktop', 'mobile'],
})`, { align: 'stretch' }),

      h2('Chaînes simples'),
      p(
        'Quand la valeur et le libellé sont identiques, passez des chaînes.',
      ),
      demo(`choiceGroup({
  legend: 'Niveau de journalisation',
  name: 'log-level',
  direction: 'row',
  value: 'warn',
  options: ['info', 'warn', 'error', 'silent'],
})`, { align: 'stretch' }),

      h2('Options désactivées'),
      demo(`choiceGroup({
  legend: 'Rendu',
  name: 'renderer',
  value: 'static',
  options: [
    { value: 'static', label: 'Statique' },
    { value: 'islands', label: 'Îlots serveur' },
    { value: 'ssr', label: 'SSR complet', disabled: true },
  ],
  help: 'Le SSR complet demande un hébergement Node, que ce projet n’a pas.',
})`, { align: 'stretch' }),

      h2('Un à la fois'),
      p(
        'Utilisez ',
        code('radio()'),
        ' directement quand les options ne sont pas assez uniformes pour venir d’un tableau — par exemple quand chacune porte sa propre description.',
      ),
      demo(`stack({ gap: 'md' },
  radio({ name: 'deploy', value: 'push', label: 'À chaque push', checked: true }),
  radio({ name: 'deploy', value: 'tag', label: 'Seulement sur les versions taguées' }),
  radio({ name: 'deploy', value: 'manual', label: 'Manuellement' }),
)`, { align: 'stretch' }),

      h2('Couleurs'),
      demo(`stack({ direction: 'row', gap: 'lg', wrap: true },
  radio({ label: 'Primary', name: 'c1', checked: true, color: 'primary' }),
  radio({ label: 'Neutral', name: 'c2', checked: true, color: 'neutral' }),
  radio({ label: 'Success', name: 'c3', checked: true, color: 'success' }),
  radio({ label: 'Warning', name: 'c4', checked: true, color: 'warning' }),
  radio({ label: 'Danger', name: 'c5', checked: true, color: 'danger' }),
)`),

      h2('Dans une carte'),
      demo(`card(
  cardHeader({ title: 'Réglages de build', subtitle: 'Appliqués au prochain déploiement' }),
  cardBody(
    stack({ gap: 'lg' },
      choiceGroup({
        legend: 'URL propres',
        name: 'clean-urls',
        direction: 'row',
        value: 'on',
        options: [
          { value: 'on', label: 'Activées' },
          { value: 'off', label: 'Désactivées' },
        ],
      }),
      choiceGroup({
        legend: 'Images',
        name: 'images',
        value: 'optimise',
        options: [
          { value: 'optimise', label: 'Redimensionner et convertir' },
          { value: 'copy', label: 'Copier telles quelles' },
        ],
      }),
    ),
  ),
  cardFooter({ divided: true, style: 'justify-content: flex-end' },
    button({ type: 'submit' }, 'Enregistrer'),
  ),
)`, { align: 'stretch' }),

      h2('Props'),
      p(code('choiceGroup()'), ' :'),
      propsTable([
        ['legend', 'Child', '', 'Libellé du groupe entier.'],
        ['name', 'string', '', 'Nom de formulaire partagé — ce qui rend les radios exclusifs.'],
        ['options', 'Array', '[]', 'Des chaînes, ou des objets { value, label, disabled }.'],
        ['value', 'string | number | Array', '', 'L’option cochée. Un tableau pour des cases à cocher.'],
        ['type', "'radio' | 'checkbox'", "'radio'", 'Quel contrôle construire. Choisit aussi le rôle du groupe.'],
        ['direction', "'row' | 'column'", "'column'", 'Comment les options sont disposées.'],
        ['help', 'Child', '', 'Indication sous le groupe.'],
      ]),
      p(code('radio()'), ' prend les mêmes props que ', code('checkbox()'), ' : ', code('label'), ', ', code('color'), ', ', code('checked'), ', ', code('name'), ', ', code('value'), ' et ', code('disabled'), '.'),
    ],
  })
