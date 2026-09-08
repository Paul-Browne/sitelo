import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/fr.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Fil d’Ariane',
    description:
      'La trace des ancêtres qui se termine à la page où vous êtes.',
    activeHref: '/fr/ui/breadcrumbs',
    extraHead: uiHead(),
    children: [
      p(
        'Un fil d’Ariane dit où se situe une page. Le dernier élément est la page courante : il est rendu en texte simple et marqué ',
        code('aria-current="page"'),
        ', parce qu’un lien vers la page où l’on se trouve déjà n’est que du bruit.',
      ),

      h2('Fil d’Ariane de base'),
      demo(`breadcrumbs({
  items: [
    { label: 'Accueil', href: '/' },
    { label: 'Documentation', href: '/docs' },
    { label: 'Routage' },
  ],
})`, { align: 'stretch' }),

      h2('Séparateur'),
      p('N’importe quelle chaîne ou balisage. Dans tous les cas, les séparateurs sont masqués aux lecteurs d’écran.'),
      demo(`stack({ gap: 'md' },
  breadcrumbs({
    separator: '/',
    items: [{ label: 'Accueil', href: '/' }, { label: 'UI', href: '/ui' }, { label: 'Fil d’Ariane' }],
  }),
  breadcrumbs({
    separator: '›',
    items: [{ label: 'Accueil', href: '/' }, { label: 'UI', href: '/ui' }, { label: 'Fil d’Ariane' }],
  }),
  breadcrumbs({
    separator: '·',
    items: [{ label: 'Accueil', href: '/' }, { label: 'UI', href: '/ui' }, { label: 'Fil d’Ariane' }],
  }),
)`, { align: 'stretch' }),

      h2('Chaînes simples'),
      p('Un élément sans href n’est que du texte, où qu’il apparaisse — pas seulement à la fin.'),
      demo(`breadcrumbs({
  items: ['Accueil', 'Archives', '2026', 'Mars'],
})`, { align: 'stretch' }),

      h2('À partir d’un chemin'),
      p(
        'Sur un site statique, la trace se déduit généralement de la route plutôt que de s’écrire à la main.',
      ),
      demo(`return (() => {
  const path = '/docs/guides/routing'
  const segments = path.split('/').filter(Boolean)

  return breadcrumbs({
    items: [
      { label: 'Accueil', href: '/' },
      ...segments.map((segment, index) => ({
        label: segment.replace(/-/g, ' '),
        href: index === segments.length - 1 ? undefined : '/' + segments.slice(0, index + 1).join('/'),
      })),
    ],
  })
})()`, { align: 'stretch' }),

      h2('Nommer le nav'),
      p(
        'L’ensemble est un ',
        code('<nav>'),
        ' avec un nom accessible, pour qu’un lecteur d’écran puisse y sauter. Changez ce nom avec ',
        code('label'),
        ' quand une page a plus d’un point de repère de navigation.',
      ),
      demo(`breadcrumbs({
  label: 'Fil d’Ariane de la documentation',
  items: [{ label: 'Documentation', href: '/docs' }, { label: 'Composants' }],
})`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['items', 'Array', '[]', 'Des chaînes, ou des objets { label, href }. Le dernier est la page courante.'],
        ['separator', 'Child', "'/'", 'Dessiné entre les éléments, masqué aux lecteurs d’écran.'],
        ['label', 'string', "'Breadcrumb'", 'Nom accessible du repère nav.'],
      ]),
    ],
  })
