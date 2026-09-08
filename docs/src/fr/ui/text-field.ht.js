import { h2, h3, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/fr.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Champ de texte',
    description:
      'Des saisies de texte sur une ou plusieurs lignes, avec le libellé, l’aide, le message d’erreur et les ids déjà reliés pour vous.',
    activeHref: '/fr/ui/text-field',
    extraHead: uiHead(),
    children: [
      p(
        'Il y a deux couches ici. ',
        code('input()'),
        ' et ',
        code('textarea()'),
        ' sont les contrôles nus ; ',
        code('textField()'),
        ' et ',
        code('textareaField()'),
        ' en enveloppent un dans un libellé, un texte d’aide et un message d’erreur, et les relient avec ',
        code('for'),
        ' et ',
        code('aria-describedby'),
        '. Prenez les seconds, sauf si vous construisez la mise en page vous-même.',
      ),

      h2('Champ de base'),
      demo(`textField({ label: 'Nom', name: 'name', placeholder: 'Ada Lovelace' })`, {
        align: 'stretch',
      }),

      h2('Texte d’aide'),
      p(
        'Le texte d’aide est relié par ',
        code('aria-describedby'),
        ' : un lecteur d’écran le lit comme faisant partie du champ, et non comme du texte détaché après lui.',
      ),
      demo(`textField({
  label: 'E-mail',
  name: 'email',
  type: 'email',
  help: 'Nous ne l’utilisons que pour signaler les builds en échec.',
})`, { align: 'stretch' }),

      h2('Obligatoire et erreur'),
      p(
        'Un ',
        code('error'),
        ' marque le champ invalide, colore la bordure, pose ',
        code('aria-invalid'),
        ' et fait pointer ',
        code('aria-describedby'),
        ' vers le message — une prop, les quatre effets.',
      ),
      demo(`stack({ gap: 'lg' },
  textField({ label: 'Projet', name: 'project', required: true, value: '' }),
  textField({
    label: 'Site',
    name: 'site',
    error: 'Ce n’est pas une URL.',
    value: 'sitelo point dev',
  }),
)`, { align: 'stretch' }),

      h2('Tailles'),
      demo(`stack({ gap: 'md' },
  textField({ label: 'Petit', name: 'small', size: 'sm', placeholder: 'sm' }),
  textField({ label: 'Moyen', name: 'medium', size: 'md', placeholder: 'md' }),
  textField({ label: 'Grand', name: 'large', size: 'lg', placeholder: 'lg' }),
)`, { align: 'stretch' }),

      h2('Ornements'),
      p(
        'Un préfixe ou un suffixe accolé au contrôle lui-même, pour les unités et les fragments fixes d’une valeur.',
      ),
      demo(`stack({ gap: 'md' },
  textField({ label: 'Site', name: 'url', startAdornment: 'https://', placeholder: 'example.com' }),
  textField({ label: 'Délai de build', name: 'timeout', endAdornment: 'secondes', value: '30' }),
)`, { align: 'stretch' }),

      h2('Désactivé et en lecture seule'),
      demo(`stack({ gap: 'md' },
  textField({ label: 'Désactivé', name: 'disabled', value: 'Non modifiable', disabled: true }),
  textField({ label: 'Lecture seule', name: 'readonly', value: 'dist/', readonly: true }),
)`, { align: 'stretch' }),

      h2('Multiligne'),
      p(
        code('textareaField()'),
        ' est le même champ autour d’un ',
        code('<textarea>'),
        '. Sa valeur est le contenu de l’élément plutôt qu’un attribut, ce dont le composant se charge pour vous.',
      ),
      demo(`textareaField({
  label: 'Description',
  name: 'description',
  rows: 4,
  help: 'Affichée dans les résultats de recherche et les cartes sociales.',
  value: 'Génération de sites statiques sans configuration, propulsée par Vite.',
})`, { align: 'stretch' }),

      h2('Dans un formulaire'),
      demo(`card(
  cardBody(
    stack({ gap: 'md' },
      textField({ label: 'Nom', name: 'contact-name', required: true }),
      textField({ label: 'E-mail', name: 'contact-email', type: 'email', required: true }),
      textareaField({ label: 'Message', name: 'message', rows: 3 }),
    ),
  ),
  cardFooter({ divided: true, style: 'justify-content: flex-end' },
    button({ variant: 'ghost', color: 'neutral' }, 'Annuler'),
    button({ type: 'submit' }, 'Envoyer'),
  ),
)`, { align: 'stretch' }),

      h2('Le construire soi-même'),
      p(
        code('field()'),
        ' est l’enveloppe seule — elle accepte n’importe quel contrôle en enfant, ce qui permet de poser deux saisies sur une rangée, ou un contrôle que cette bibliothèque n’a pas, sous le même traitement de libellé et d’erreur.',
      ),
      p(
        'Un libellé ne peut pas nommer deux contrôles : chaque saisie a donc besoin ici de son propre nom accessible. C’est le rôle des ',
        code('aria-label'),
        ' : le libellé visible nomme la paire, et chaque saisie dit de quelle extrémité elle est.',
      ),
      demo(`field({ label: 'Plage de dates', help: 'Les deux extrémités sont incluses.' },
  stack({ direction: 'row', gap: 'sm' },
    input({ type: 'date', name: 'from', 'aria-label': 'Du' }),
    input({ type: 'date', name: 'to', 'aria-label': 'Au' }),
  ),
)`, { align: 'stretch' }),

      h2('Props'),
      h3('textField et textareaField'),
      propsTable([
        ['label', 'Child', '', 'Le libellé du champ. Sert aussi à dériver l’id du contrôle en l’absence de name.'],
        ['name', 'string', '', 'Nom du champ ; l’id en découle.'],
        ['help', 'Child', '', 'Indication sous le contrôle, reliée par aria-describedby.'],
        ['error', 'Child | false', '', 'Message d’erreur. Pose aussi aria-invalid sur le contrôle.'],
        ['required', 'boolean', 'false', 'Marque le libellé et le contrôle.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Hauteur du contrôle et taille du texte.'],
        ['type', 'string', "'text'", 'N’importe quel type d’input. textField uniquement.'],
        ['startAdornment', 'Child', '', 'Préfixe accolé au contrôle. textField uniquement.'],
        ['endAdornment', 'Child', '', 'Suffixe accolé au contrôle. textField uniquement.'],
        ['value', 'string | number', '', 'Valeur initiale.'],
        ['fieldClass', 'string', '', 'Classe pour l’enveloppe plutôt que pour le contrôle.'],
      ]),
      p(
        'Les ids découlent de ',
        code('name'),
        ' — ou de ',
        code('label'),
        ' en l’absence de name — plutôt que d’un compteur : la même page produit donc le même HTML à chaque build. Passez ',
        code('id'),
        ' pour le remplacer.',
      ),
      h3('field'),
      propsTable([
        ['label', 'Child', '', 'Le texte du libellé.'],
        ['help', 'Child', '', 'Indication sous le contrôle.'],
        ['error', 'Child | false', '', 'Message d’erreur ; ajoute aussi l’état invalide à l’enveloppe.'],
        ['required', 'boolean', 'false', 'Ajoute le marqueur d’obligation au libellé.'],
        ['for', 'string', '', 'Id du contrôle désigné.'],
      ]),
    ],
  })
