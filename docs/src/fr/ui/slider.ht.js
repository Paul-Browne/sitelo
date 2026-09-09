import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/fr.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Curseur',
    description:
      'Un input range natif, stylé pour s’accorder aux autres contrôles.',
    activeHref: '/fr/ui/slider',
    extraHead: uiHead(),
    children: [
      p(
        'C’est un vrai ',
        code('<input type="range">'),
        ' — les flèches, Origine et Fin, et l’annonce correcte viennent toutes du navigateur. Seuls la piste et le curseur sont stylés.',
      ),

      h2('Curseur de base'),
      demo(`sliderField({ label: 'Qualité', name: 'quality', value: 70 })`, { align: 'stretch' }),

      h2('Plage et pas'),
      demo(`stack({ gap: 'lg' },
  sliderField({ label: 'Volume', name: 'volume', min: 0, max: 100, value: 40 }),
  sliderField({ label: 'Colonnes', name: 'columns', min: 1, max: 6, step: 1, value: 3 }),
  sliderField({ label: 'Échelle', name: 'scale', min: 0.5, max: 2, step: 0.25, value: 1 }),
)`, { align: 'stretch' }),

      h2('Afficher la valeur'),
      p(
        code('showValue'),
        ' place un ',
        code('<output>'),
        ' à côté de la piste, portant la valeur avec laquelle la page a été construite, et l’input va chercher son propre gestionnaire au premier glissement : le nombre suit donc le curseur. Rien à importer — un nombre qui se périmerait en silence serait pire que pas de nombre du tout, alors celui-là ne vous est pas laissé.',
      ),
      demo(`sliderField({
  label: 'Qualité d’image',
  name: 'jpeg-quality',
  min: 40,
  max: 100,
  value: 82,
  showValue: true,
  help: 'Plus haut, c’est plus lourd et plus lent à construire.',
})`, { align: 'stretch' }),

      h2('Couleurs'),
      demo(`stack({ gap: 'lg' },
  slider({ value: 70, color: 'primary', 'aria-label': 'Primary' }),
  slider({ value: 55, color: 'success', 'aria-label': 'Success' }),
  slider({ value: 35, color: 'warning', 'aria-label': 'Warning' }),
  slider({ value: 20, color: 'danger', 'aria-label': 'Danger' }),
)`, { align: 'stretch' }),

      h2('Désactivé'),
      demo(`sliderField({ label: 'Verrouillé', name: 'locked', value: 50, disabled: true })`, {
        align: 'stretch',
      }),

      h2('Sans libellé'),
      p(
        'Un ',
        code('slider()'),
        ' nu, c’est le contrôle tout seul — donnez-lui un ',
        code('aria-label'),
        ' quand aucun libellé visible ne le désigne.',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  text({ variant: 'small', tone: 'muted' }, 'Aa'),
  slider({ min: 12, max: 24, value: 16, 'aria-label': 'Taille du texte' }),
  text({ tone: 'muted' }, 'Aa'),
)`, { align: 'stretch' }),

      h2('Dans un formulaire'),
      demo(`card(
  cardBody(
    stack({ gap: 'lg' },
      sliderField({ label: 'Largeur d’image maximale', name: 'max-width', min: 640, max: 2560, step: 160, value: 1280, showValue: true }),
      sliderField({ label: 'Qualité', name: 'q', min: 40, max: 100, value: 82, showValue: true }),
    ),
  ),
  cardFooter({ divided: true, style: 'justify-content: flex-end' },
    button({ type: 'submit' }, 'Enregistrer'),
  ),
)`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['min', 'number | string', '0', 'Borne inférieure.'],
        ['max', 'number | string', '100', 'Borne supérieure.'],
        ['step', 'number | string', '', 'Incrément. Omettez-le pour le défaut du navigateur, 1.'],
        ['value', 'number | string', '', 'Valeur initiale.'],
        ['showValue', 'boolean', 'false', 'Ajoute un <output> avec la valeur du build.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Couleur du curseur.'],
        ['name', 'string', '', 'Nom du champ ; l’id en découle.'],
        ['disabled', 'boolean', 'false', 'Désactive le contrôle.'],
      ]),
      p(
        code('sliderField()'),
        ' prend en plus ',
        code('label'),
        ', ',
        code('help'),
        ', ',
        code('error'),
        ' et ',
        code('required'),
        ' — voir ',
        code('textField()'),
        '.',
      ),
    ],
  })
