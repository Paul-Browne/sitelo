import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/fr.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Interrupteur',
    description:
      'Une bascule marche/arrêt pour un réglage qui prend effet tout de suite — une case à cocher en dessous, avec role="switch".',
    activeHref: '/fr/ui/switch',
    extraHead: uiHead(),
    children: [
      p(
        'Un interrupteur sert à un réglage qui s’applique dès qu’on le bascule. Une case à cocher sert à un choix que l’on confirme plus tard, avec un bouton d’envoi. Si votre contrôle est dans un formulaire avec un Enregistrer en bas, c’est une case à cocher.',
      ),
      p(
        'Le composant s’appelle ',
        code('toggle()'),
        ' et non ',
        code('switch()'),
        ' pour une raison ennuyeuse mais incontournable : ',
        code('switch'),
        ' est un mot réservé et ne peut donc pas servir de nom d’import. En dessous, c’est un vrai ',
        code('<input type="checkbox">'),
        ' portant ',
        code('role="switch"'),
        '.',
      ),

      h2('Interrupteur de base'),
      demo(`stack({ direction: 'row', gap: 'lg' },
  toggle({ label: 'Site public', name: 'public' }),
  toggle({ label: 'Activé', name: 'on', checked: true }),
)`),

      h2('Couleurs'),
      demo(`stack({ direction: 'row', gap: 'lg', wrap: true },
  toggle({ label: 'Primary', checked: true, color: 'primary' }),
  toggle({ label: 'Neutral', checked: true, color: 'neutral' }),
  toggle({ label: 'Success', checked: true, color: 'success' }),
  toggle({ label: 'Warning', checked: true, color: 'warning' }),
  toggle({ label: 'Danger', checked: true, color: 'danger' }),
)`),

      h2('Désactivé'),
      demo(`stack({ direction: 'row', gap: 'lg' },
  toggle({ label: 'Éteint et verrouillé', disabled: true }),
  toggle({ label: 'Allumé et verrouillé', checked: true, disabled: true }),
)`),

      h2('Sans libellé'),
      p(
        'Un interrupteur sans libellé visible a quand même besoin d’un nom accessible. Passez ',
        code('aria-label'),
        ' — il tombe sur l’input.',
      ),
      demo(`toggle({ 'aria-label': 'Activer la recherche Pagefind', checked: true })`),

      h2('Une liste de réglages'),
      p(
        'La forme habituelle : le libellé à gauche, l’interrupteur à droite, une rangée par réglage.',
      ),
      demo(`return list(
  [
    ['Recherche Pagefind', 'Indexe chaque page à la fin du build.', true],
    ['Optimisation des images', 'Redimensionne et convertit les images au build. Nécessite sharp.', true],
    ['Îlots serveur', 'Rend les zones marquées au moment de la requête.', false],
  ].map(([name, description, on]) =>
    listItem({
      title: name,
      description,
      end: toggle({ 'aria-label': name, checked: on }),
    }),
  ),
)`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['label', 'Child', '', 'Texte à côté de l’interrupteur. Utilisez aria-label s’il n’y en a pas.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Couleur de la piste à l’état activé.'],
        ['checked', 'boolean', 'false', 'S’il démarre activé.'],
        ['name', 'string', '', 'Nom du champ de formulaire.'],
        ['disabled', 'boolean', 'false', 'Désactive l’input et atténue la rangée.'],
      ]),
      p(
        'Tout le reste tombe sur l’',
        code('<input>'),
        ', là où ',
        code('onchange'),
        ' et ',
        code('aria-*'),
        ' ont leur place.',
      ),
    ],
  })
