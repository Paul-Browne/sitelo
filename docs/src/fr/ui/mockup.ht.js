import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/fr.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Maquette',
    description:
      'Une capture d’écran dans un cadre — navigateur, fenêtre, téléphone ou terminal.',
    activeHref: '/fr/ui/mockup',
    extraHead: uiHead(),
    children: [
      p(
        'Pour montrer un produit sur une page d’accueil ou une capture dans la documentation. Le cadre est décoratif : les pastilles, la barre d’adresse et l’encoche sont toutes ',
        code('aria-hidden'),
        ', si bien qu’un lecteur d’écran reçoit le contenu et non une description de l’habillage.',
      ),

      h2('Navigateur'),
      demo(`mockup({ variant: 'browser', url: 'sitelo.dev' },
  div({ style: 'padding: 1.5rem; background: var(--su-surface-2)' },
    stack({ gap: 'sm' },
      text({ variant: 'h5', as: 'div' }, 'Bonjour le monde'),
      text({ variant: 'small', tone: 'muted' }, 'Rendu au build, servi comme fichier statique.'),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Fenêtre'),
      p('Le même cadre sans barre d’adresse, pour tout ce qui n’est pas une page web.'),
      demo(`mockup({ variant: 'window' },
  div({ style: 'padding: 1.5rem' },
    text({ variant: 'small' }, 'Une fenêtre sans URL.'),
  ),
)`, { align: 'stretch' }),

      h2('Feux tricolores'),
      p(
        'Les boutons suivent le thème par défaut. ',
        code("dots: 'mac'"),
        ' les peint plutôt du rouge, jaune et vert de macOS — les mêmes trois dans les deux thèmes, puisque leur intérêt est d’être reconnaissables.',
      ),
      demo(`mockup({ variant: 'browser', url: 'sitelo.dev', dots: 'mac' },
  div({ style: 'padding: 1.5rem' },
    text({ variant: 'small' }, 'Une fenêtre que vous avez déjà vue.'),
  ),
)`, { align: 'stretch' }),

      h2('Terminal'),
      p(
        'La variante ',
        code('code'),
        ' est sombre dans les deux thèmes, comme l’est un terminal.',
      ),
      demo(`mockup({ variant: 'code' },
  '<div>$ npm install -D sitelo</div>' +
  '<div>$ npx sitelo build</div>' +
  '<div style="opacity: .7">✓ construit en 1,09 s</div>' +
  '<div style="opacity: .7">  204 pages · 9,7 Mo</div>',
)`, { align: 'stretch' }),

      h2('Téléphone'),
      p(
        'Un combiné actuel : une Dynamic Island flottant à l’écart du bord, plutôt qu’une encoche taillée dedans. Laissez-lui de la place en haut de l’écran.',
      ),
      demo(`mockup({ variant: 'phone' },
  div({ style: 'padding: 3rem 1rem 1rem' },
    stack({ gap: 'md' },
      text({ variant: 'h6', as: 'div' }, 'sitelo'),
      text({ variant: 'caption', tone: 'muted' }, 'Des sites statiques, sans framework.'),
      button({ size: 'sm', block: true }, 'Commencer'),
    ),
  ),
)`),

      h2('Cadre et île'),
      p(
        code('frame'),
        ' teinte le rail extérieur — n’importe quelle couleur CSS, donc une finition d’appareil est un code hexadécimal plutôt qu’un nom dont cette bibliothèque devrait tenir la liste. ',
        code('notch: false'),
        ' retire l’île pour ce qui n’en a pas.',
      ),
      demo(`stack({ direction: 'row', gap: 'md', wrap: true },
  mockup({ variant: 'phone', size: 'sm', frame: '#a8674a' }, ''),
  mockup({ variant: 'phone', size: 'sm', frame: '#2c3644' }, ''),
  mockup({ variant: 'phone', size: 'sm', frame: '#c9ced4', notch: false }, ''),
)`, { align: 'stretch' }),

      h2('Avec une capture'),
      p(
        'Une ',
        code('<img>'),
        ' dans le corps remplit la largeur du cadre. Associez-la à ',
        code('aspectRatio()'),
        ' si l’image charge tard et que la page ne doit pas sauter.',
      ),
      demo(`mockup({ variant: 'browser', url: 'sitelo.dev/ui' },
  aspectRatio({ ratio: '16 / 9', style: 'background: var(--su-surface-2)' },
    '<img src="/logo.svg" alt="La galerie sitelo UI" style="object-fit: contain; padding: 3rem">',
  ),
)`, { align: 'stretch' }),

      h2('Tailles'),
      p(
        'Une maquette remplit son conteneur par défaut. ',
        code('size'),
        ' la fixe plutôt à une largeur donnée. Le téléphone a les siennes — 22rem de téléphone serait une tablette — et il garde ses proportions à toutes : les coins, le rail et l’île sont des fractions de la largeur, pas des longueurs fixes.',
      ),
      demo(`stack({ gap: 'md', align: 'flex-start' },
  mockup({ variant: 'window', size: 'sm' }, div({ style: 'padding: 1rem' }, text({ variant: 'small' }, 'size: sm'))),
  mockup({ variant: 'window' }, div({ style: 'padding: 1rem' }, text({ variant: 'small' }, 'défaut — pleine largeur'))),
)`, { align: 'stretch' }),

      h2('Dans un hero'),
      p(
        'L’association pour laquelle tout cela existe : passez une maquette comme ',
        code('media'),
        ' d’un hero.',
      ),
      demo(`hero({
  level: 2,
  align: 'start',
  title: 'Voyez-le tourner',
  description: 'Du HTML statique au moment où il atteint le navigateur.',
  media: mockup({ variant: 'browser', url: 'example.com' },
    div({ style: 'padding: 1.25rem; background: var(--su-surface-2)' },
      text({ variant: 'small' }, 'Une page, encadrée.'),
    ),
  ),
}, button('Commencer'))`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['variant', "'browser' | 'window' | 'phone' | 'code'", "'browser'", 'Quel cadre dessiner.'],
        ['url', 'string', '', 'Affichée dans la barre d’adresse. Variante browser uniquement.'],
        ['dots', "'mono' | 'mac'", "'mono'", 'L’allure des trois pastilles.'],
        ['frame', 'string', '', 'Teinte le rail extérieur. N’importe quelle couleur CSS. Téléphone uniquement.'],
        ['notch', 'boolean', 'true', 'Dessiner la Dynamic Island. Téléphone uniquement.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Largeur fixe. La moyenne remplit le conteneur.'],
      ]),
    ],
  })
