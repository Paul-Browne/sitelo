import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/fr.js'

export default () =>
  uiLayout({
    title: 'Case à cocher',
    description:
      'Une case et son libellé en un seul contrôle — un vrai input, stylé en CSS plutôt que remplacé.',
    activeHref: '/fr/ui/checkbox',
    children: [
      p(
        code('checkbox()'),
        ' rend un ',
        code('<label>'),
        ' qui enveloppe un vrai ',
        code('<input type="checkbox">'),
        ' et la case que vous voyez. L’input est masqué visuellement mais bien présent : il reçoit le focus, il est soumis, et tout le libellé est une cible cliquable — la coche est dessinée à partir de l’état ',
        code(':checked'),
        ' de l’input lui-même, sans le moindre script.',
      ),

      h2('Case de base'),
      demo(`stack({ direction: 'row', gap: 'lg' },
  checkbox({ label: 'M’envoyer les nouveautés par e-mail', name: 'updates' }),
  checkbox({ label: 'Cochée', name: 'checked', checked: true }),
)`),

      h2('Couleurs'),
      demo(`stack({ direction: 'row', gap: 'lg', wrap: true },
  checkbox({ label: 'Primary', checked: true, color: 'primary' }),
  checkbox({ label: 'Neutral', checked: true, color: 'neutral' }),
  checkbox({ label: 'Success', checked: true, color: 'success' }),
  checkbox({ label: 'Warning', checked: true, color: 'warning' }),
  checkbox({ label: 'Danger', checked: true, color: 'danger' }),
)`),

      h2('Désactivé'),
      demo(`stack({ direction: 'row', gap: 'lg' },
  checkbox({ label: 'Indisponible', disabled: true }),
  checkbox({ label: 'Activée et verrouillée', checked: true, disabled: true }),
)`),

      h2('Libellés longs'),
      p(
        'La case reste alignée sur la première ligne au lieu de se centrer face à un paragraphe.',
      ),
      demo(`checkbox({
  label: 'Lancer un audit Lighthouse après chaque build, et faire échouer le build quand un score passe sous son seuil.',
  name: 'lighthouse',
  checked: true,
})`, { align: 'stretch' }),

      h2('Groupes'),
      p(
        code('choiceGroup()'),
        ' construit un jeu de cases à partir de données, avec une légende et un name partagés. Passez un tableau en ',
        code('value'),
        ' pour en cocher plusieurs.',
      ),
      demo(`choiceGroup({
  legend: 'Générer',
  name: 'generate',
  type: 'checkbox',
  value: ['sitemap', 'rss'],
  options: [
    { value: 'sitemap', label: 'sitemap.xml' },
    { value: 'rss', label: 'rss.xml' },
    { value: 'pagefind', label: 'Index Pagefind' },
  ],
  help: 'Chacun est écrit dans dist/ à la fin du build.',
})`, { align: 'stretch' }),

      h2('En ligne'),
      demo(`choiceGroup({
  legend: 'Catégories',
  name: 'categories',
  type: 'checkbox',
  direction: 'row',
  value: ['performance'],
  options: ['performance', 'accessibility', 'seo'],
})`, { align: 'stretch' }),

      h2('Avec un field'),
      p(
        'Une case isolée a rarement besoin d’un libellé au-dessus en plus. Quand un groupe en a besoin, ',
        code('field()'),
        ' lui donne le même traitement de libellé, d’aide et d’erreur qu’un champ de texte.',
      ),
      demo(`field({ label: 'Conditions', error: 'Vous devez accepter les conditions pour continuer.' },
  checkbox({ label: 'J’accepte les conditions', name: 'terms', color: 'danger' }),
)`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['label', 'Child', '', 'Texte à côté de la case. Omettez-le pour un contrôle nu.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Couleur quand elle est cochée.'],
        ['checked', 'boolean', 'false', 'Si elle démarre cochée.'],
        ['name', 'string', '', 'Nom du champ de formulaire.'],
        ['value', 'string | number', '', 'Valeur soumise quand elle est cochée.'],
        ['disabled', 'boolean', 'false', 'Désactive l’input et atténue le libellé.'],
      ]),
      p(
        'Tout le reste atterrit sur l’',
        code('<input>'),
        ', pas sur le label — donc ',
        code('required'),
        ', ',
        code('onchange'),
        ' et ',
        code('data-*'),
        ' vont là où vous l’attendez. Utilisez ',
        code('class'),
        ' pour styler le libellé lui-même.',
      ),
      p(
        'Pour un jeu construit à partir de données, voyez ',
        code('choiceGroup()'),
        ' sur la page ',
        code('Groupe de boutons radio'),
        ' — il prend les mêmes options des deux côtés, basculées par ',
        code("type: 'checkbox'"),
        '.',
      ),
    ],
  })
