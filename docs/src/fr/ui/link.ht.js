import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/fr.js'

export default () =>
  uiLayout({
    title: 'Lien',
    description:
      'Une ancre stylée, avec les attributs de sécurité qu’un lien externe réclame.',
    activeHref: '/fr/ui/link',
    children: [
      p(
        'Un lien est une ancre avec le soulignement et la palette de la bibliothèque. Il est exporté sous deux noms — ',
        code('link'),
        ' et ',
        code('textLink'),
        ' — parce que ',
        code('link'),
        ' est aussi l’élément ',
        code('<link>'),
        ' de javascript-to-html, et importer les deux sous un seul nom est une erreur de syntaxe. Utilisez ',
        code('textLink'),
        ', ou importez la bibliothèque comme espace de noms.',
      ),

      h2('Lien de base'),
      demo(`text('Lisez la ', link({ href: '/fr/docs' }, 'documentation'), ' pour commencer.')`, {
        align: 'stretch',
      }),

      h2('Couleurs'),
      demo(`stack({ direction: 'row', gap: 'lg', wrap: true },
  link({ href: '#', color: 'primary' }, 'Primary'),
  link({ href: '#', color: 'neutral' }, 'Neutral'),
  link({ href: '#', color: 'success' }, 'Success'),
  link({ href: '#', color: 'warning' }, 'Warning'),
  link({ href: '#', color: 'danger' }, 'Danger'),
)`),

      h2('Discret'),
      p(
        'Un lien discret hérite de la couleur environnante et n’affiche son soulignement qu’au survol — pour les listes de liens où un soulignement à chaque ligne ne serait que du bruit.',
      ),
      demo(`stack({ gap: 'xs' },
  link({ href: '/fr/docs/routing', subtle: true }, 'Routage'),
  link({ href: '/fr/docs/data', subtle: true }, 'Chargement de données'),
  link({ href: '/fr/docs/assets', subtle: true }, 'Ressources et styles'),
)`, { align: 'stretch' }),

      h2('Liens externes'),
      p(
        code('external'),
        ' ajoute ',
        code('target="_blank"'),
        ' et le ',
        code('rel'),
        ' qui doit l’accompagner. Dites dans le texte du lien qu’il ouvre un nouvel onglet, ou ajoutez une note masquée visuellement — un nouvel onglet sans avertissement désoriente.',
      ),
      demo(`text(
  'La bibliothèque est sur ',
  link({ href: 'https://www.npmjs.com/package/sitelo', external: true },
    'npm',
    visuallyHidden(' (s’ouvre dans un nouvel onglet)'),
  ),
  '.',
)`, { align: 'stretch' }),

      h2('Dans un paragraphe'),
      demo(`text({ variant: 'lead' },
  'sitelo est bâti sur ',
  link({ href: 'https://vite.dev', external: true }, 'Vite'),
  ', rend avec ',
  link({ href: 'https://ht.js.org', external: true }, 'javascript-to-html'),
  ', et n’envoie rien au navigateur si vous ne le demandez pas.',
)`, { align: 'stretch' }),

      h2('Quand prendre un bouton à la place'),
      p(
        'Un lien navigue ; un bouton exécute une action. Si la chose change l’état de la page au lieu d’emmener le lecteur ailleurs, ce doit être un ',
        code('button()'),
        ' — et si elle navigue mais doit ressembler à un bouton, donnez un ',
        code('href'),
        ' à ',
        code('button()'),
        ', qui rend alors une ancre en dessous.',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center', wrap: true },
  link({ href: '/fr/docs' }, 'Un lien qui navigue'),
  button({ href: '/fr/docs', variant: 'outline' }, 'Un lien qui ressemble à un bouton'),
  button({ variant: 'link' }, 'Un bouton qui ressemble à un lien'),
)`),

      h2('Props'),
      propsTable([
        ['href', 'string', '', 'Où il mène.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'La palette utilisée.'],
        ['subtle', 'boolean', 'false', 'Hérite de la couleur environnante ; soulignement au survol seulement.'],
        ['external', 'boolean', 'false', 'Ajoute target="_blank" et rel="noopener noreferrer".'],
      ]),
    ],
  })
