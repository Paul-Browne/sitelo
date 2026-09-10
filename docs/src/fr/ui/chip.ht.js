import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/fr.js'

export default () =>
  uiLayout({
    title: 'Puce',
    description:
      'Une étiquette compacte — un tag, un statut, un filtre, un compteur.',
    activeHref: '/fr/ui/chip',
    children: [
      p(
        'Les puces sont de petits morceaux de métadonnées : les tags d’un billet, le statut d’un build, les catégories d’une page. Elles sont en ligne par défaut, donc une rangée réclame un ',
        code('stack'),
        ' avec ',
        code('wrap'),
        '.',
      ),

      h2('Puce de base'),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  chip('statique'),
  chip('vite'),
  chip('sans-runtime'),
)`),

      h2('Couleurs'),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  chip({ color: 'primary' }, 'primary'),
  chip({ color: 'neutral' }, 'neutral'),
  chip({ color: 'success' }, 'success'),
  chip({ color: 'warning' }, 'warning'),
  chip({ color: 'danger' }, 'danger'),
)`),

      h2('Variantes'),
      demo(`stack({ gap: 'sm' },
  stack({ direction: 'row', gap: 'sm', wrap: true },
    chip({ variant: 'soft', color: 'primary' }, 'soft'),
    chip({ variant: 'soft', color: 'success' }, 'soft'),
    chip({ variant: 'soft', color: 'danger' }, 'soft'),
  ),
  stack({ direction: 'row', gap: 'sm', wrap: true },
    chip({ variant: 'outline', color: 'primary' }, 'outline'),
    chip({ variant: 'outline', color: 'success' }, 'outline'),
    chip({ variant: 'outline', color: 'danger' }, 'outline'),
  ),
  stack({ direction: 'row', gap: 'sm', wrap: true },
    chip({ variant: 'solid', color: 'primary' }, 'solid'),
    chip({ variant: 'solid', color: 'success' }, 'solid'),
    chip({ variant: 'solid', color: 'danger' }, 'solid'),
  ),
)`, { align: 'start' }),

      h2('Tailles'),
      demo(`stack({ direction: 'row', gap: 'sm', align: 'center', wrap: true },
  chip({ size: 'sm' }, 'petite'),
  chip({ size: 'md' }, 'moyenne'),
  chip({ size: 'lg' }, 'grande'),
)`),

      h2('Point de statut'),
      p(
        'Un point devant transforme une puce en statut. La couleur seule ne suffit pas à porter le sens : gardez le mot.',
      ),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  chip({ color: 'success', dot: true }, 'Build réussi'),
  chip({ color: 'warning', dot: true }, 'En attente'),
  chip({ color: 'danger', dot: true }, 'Échoué'),
  chip({ color: 'neutral', dot: true }, 'Ignoré'),
)`),

      h2('Liens'),
      p(
        'Donnez un ',
        code('href'),
        ' à une puce et elle rend une ancre — la forme habituelle d’une liste de tags, où chaque tag est une page.',
      ),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  chip({ href: '/fr/docs/routing', color: 'primary' }, 'routage'),
  chip({ href: '/fr/docs/data', color: 'primary' }, 'données'),
  chip({ href: '/fr/docs/islands', color: 'primary' }, 'îlots'),
)`),

      h2('En bouton'),
      p(
        code('as'),
        ' change l’élément, pour un filtre qui bascule au lieu de naviguer.',
      ),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  chip({ as: 'button', variant: 'solid', color: 'primary', 'aria-pressed': 'true' }, 'Tout'),
  chip({ as: 'button', variant: 'outline', color: 'neutral', 'aria-pressed': 'false' }, 'Guides'),
  chip({ as: 'button', variant: 'outline', color: 'neutral', 'aria-pressed': 'false' }, 'Exemples'),
)`),

      h2('Dans un tableau'),
      demo(`table({
  striped: true,
  columns: [
    { key: 'page', header: 'Page' },
    { header: 'Statut', align: 'end', render: (row) =>
      chip({ size: 'sm', dot: true, color: row.ok ? 'success' : 'danger' }, row.ok ? 'ok' : 'échec') },
  ],
  rows: [
    { page: '/', ok: true },
    { page: '/docs', ok: true },
    { page: '/blog/[slug]', ok: false },
  ],
})`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'neutral'", 'La palette utilisée.'],
        ['variant', "'soft' | 'outline' | 'solid'", "'soft'", 'Le poids visuel de la puce.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Espacement interne et taille du texte.'],
        ['href', 'string', '', 'Rend une ancre.'],
        ['dot', 'boolean', 'false', 'Ajoute un point de statut avant le libellé.'],
        ['as', 'string', "'span'", 'Élément rendu en l’absence de href.'],
      ]),
    ],
  })
