import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/fr.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Tableau',
    description:
      'Des lignes et des colonnes à partir de données, dans un conteneur défilant qui empêche un tableau large de casser la page.',
    activeHref: '/fr/ui/table',
    extraHead: uiHead(),
    children: [
      p(
        'Passez ',
        code('columns'),
        ' et ',
        code('rows'),
        ' : le tableau se construit tout seul, en-tête compris. Il est enveloppé dans un conteneur à défilement horizontal, donc un tableau qui a plus de colonnes qu’un téléphone n’en montre défile de lui-même au lieu d’étirer la page. Exporté à la fois comme ',
        code('table'),
        ' et ',
        code('dataTable'),
        '.',
      ),

      h2('Tableau de base'),
      demo(`table({
  columns: [
    { key: 'page', header: 'Page' },
    { key: 'size', header: 'Taille' },
    { key: 'time', header: 'Temps de rendu' },
  ],
  rows: [
    { page: '/', size: '4,1 ko', time: '12 ms' },
    { page: '/docs', size: '12,7 ko', time: '31 ms' },
    { page: '/examples', size: '9,4 ko', time: '24 ms' },
  ],
})`, { align: 'stretch' }),

      h2('Alignement'),
      p('Les nombres se lisent mieux alignés sur la fin de leur colonne.'),
      demo(`table({
  columns: [
    { key: 'page', header: 'Page' },
    { key: 'bytes', header: 'Octets', align: 'end' },
    { key: 'gzip', header: 'Gzip', align: 'end' },
  ],
  rows: [
    { page: '/', bytes: '4 112', gzip: '1 204' },
    { page: '/docs', bytes: '12 704', gzip: '3 910' },
    { page: '/examples', bytes: '9 388', gzip: '2 744' },
  ],
})`, { align: 'stretch' }),

      h2('Cellules sur mesure'),
      p(
        'Une colonne dotée d’une fonction ',
        code('render'),
        ' reçoit la ligne entière et renvoie ce qui doit se trouver dans la cellule — une puce, un lien, un nombre formaté.',
      ),
      demo(`table({
  columns: [
    { header: 'Page', render: (row) => link({ href: row.href }, row.page) },
    { key: 'size', header: 'Taille', align: 'end' },
    { header: 'Statut', align: 'end', render: (row) =>
      chip({ size: 'sm', dot: true, color: row.ok ? 'success' : 'danger' }, row.ok ? 'ok' : 'échec') },
  ],
  rows: [
    { page: '/docs/routing', href: '/fr/docs/routing', size: '18,2 ko', ok: true },
    { page: '/docs/data', href: '/fr/docs/data', size: '21,7 ko', ok: true },
    { page: '/docs/islands', href: '/fr/docs/islands', size: '24,1 ko', ok: false },
  ],
})`, { align: 'stretch' }),

      h2('Styles'),
      p(
        code('striped'),
        ' alterne des bandes sur les lignes, ',
        code('hover'),
        ' met en évidence la ligne sous le pointeur, et ',
        code('dense'),
        ' resserre les marges internes pour un tableau à nombreuses lignes.',
      ),
      demo(`stack({ gap: 'lg' },
  table({
    striped: true,
    caption: 'rayé',
    columns: [{ key: 'name', header: 'Nom' }, { key: 'value', header: 'Valeur', align: 'end' }],
    rows: [{ name: 'pages', value: '169' }, { name: 'ressources', value: '208' }, { name: 'total', value: '9,5 Mo' }],
  }),
  table({
    hover: true,
    dense: true,
    caption: 'survol et dense',
    columns: [{ key: 'name', header: 'Nom' }, { key: 'value', header: 'Valeur', align: 'end' }],
    rows: [{ name: 'pages', value: '169' }, { name: 'ressources', value: '208' }, { name: 'total', value: '9,5 Mo' }],
  }),
)`, { align: 'stretch' }),

      h2('Légende'),
      p(
        'Une légende nomme le tableau pour qui y arrive sans le texte alentour — utile dès que le tableau n’est pas directement sous un titre qui dit déjà ce qu’il est.',
      ),
      demo(`table({
  caption: 'Sortie du build, la plus récente en premier',
  columns: [
    { key: 'commit', header: 'Commit' },
    { key: 'when', header: 'Quand' },
    { key: 'pages', header: 'Pages', align: 'end' },
  ],
  rows: [
    { commit: '94a837a', when: 'il y a 4 minutes', pages: '169' },
    { commit: 'dcfaaae', when: 'il y a 2 heures', pages: '161' },
  ],
})`, { align: 'stretch' }),

      h2('À partir de données'),
      p(
        'Les lignes sont un tableau ordinaire : ce sont donc en général celles que ',
        code('data()'),
        ' a déjà chargées, sans adaptateur entre les deux.',
      ),
      demo(`return (() => {
  const posts = [
    { title: 'Bonjour le monde', date: '2026-01-14', reads: 1204 },
    { title: 'Le statique d’abord', date: '2026-02-02', reads: 890 },
    { title: 'Aucun runtime', date: '2026-03-19', reads: 2317 },
  ]

  return table({
    hover: true,
    columns: [
      { key: 'title', header: 'Billet' },
      { key: 'date', header: 'Publié' },
      { header: 'Lectures', align: 'end', render: (post) => post.reads.toLocaleString('fr') },
    ],
    rows: posts,
  })
})()`, { align: 'stretch' }),

      h2('Écrire le balisage soi-même'),
      p(
        'Omettez ',
        code('columns'),
        ' et le tableau rend ses enfants à la place : un tableau avec une rangée de pied ou des en-têtes groupés peut donc être écrit à la main tout en gardant le style et le conteneur défilant.',
      ),

      h2('Props'),
      propsTable([
        ['columns', 'TableColumn[]', '', '{ key, header, align, render } par colonne. Omettez pour écrire les lignes à la main.'],
        ['rows', 'object[]', '[]', 'Un objet par ligne.'],
        ['caption', 'Child', '', 'Une légende au-dessus du tableau.'],
        ['striped', 'boolean', 'false', 'Alterne les bandes de lignes.'],
        ['hover', 'boolean', 'false', 'Met en évidence la ligne sous le pointeur.'],
        ['dense', 'boolean', 'false', 'Marges internes plus serrées.'],
      ]),
    ],
  })
