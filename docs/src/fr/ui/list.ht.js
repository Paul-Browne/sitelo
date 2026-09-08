import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/fr.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Liste',
    description:
      'Des rangées de contenu avec, de part et d’autre, un élément facultatif — la forme dont sont faits la plupart des écrans de réglages et des fils d’actualité.',
    activeHref: '/fr/ui/list',
    extraHead: uiHead(),
    children: [
      p(
        'Une liste est une surface bordée faite de rangées. Chaque rangée a un titre, une description facultative, et des emplacements au début et à la fin pour un avatar, une icône ou un contrôle.',
      ),

      h2('Liste de base'),
      demo(`list(
  listItem({ title: 'Routage', description: 'src/about.ht.js devient /about' }),
  listItem({ title: 'Chargement de données', description: 'data() s’exécute une fois, au build' }),
  listItem({ title: 'Ressources', description: 'Seul ce que votre HTML référence est empaqueté' }),
)`, { align: 'stretch' }),

      h2('Emplacements de début et de fin'),
      demo(`list(
  listItem({
    start: avatar({ name: 'Ada Lovelace', size: 'sm' }),
    title: 'Ada Lovelace',
    description: 'A poussé 3 commits sur main',
    end: chip({ size: 'sm', color: 'neutral' }, 'il y a 2 h'),
  }),
  listItem({
    start: avatar({ name: 'Grace Hopper', size: 'sm', color: 'success' }),
    title: 'Grace Hopper',
    description: 'A ouvert une pull request',
    end: chip({ size: 'sm', color: 'success', dot: true }, 'ouverte'),
  }),
)`, { align: 'stretch' }),

      h2('Des rangées qui mènent quelque part'),
      p(
        'Une rangée avec un ',
        code('href'),
        ' place l’ancre à l’intérieur du ',
        code('<li>'),
        ' plutôt qu’autour, si bien que la liste reste une liste valide. N’y mettez pas aussi un bouton — le contenu interactif ne peut pas s’imbriquer dans un lien.',
      ),
      demo(`list(
  listItem({ title: 'Démarrage', description: 'Installation et première page', href: '/fr/docs' }),
  listItem({ title: 'Routage', description: 'Basé sur les fichiers, avec segments dynamiques', href: '/fr/docs/routing' }),
  listItem({ title: 'Déploiement', description: 'Netlify, Vercel, Pages, Amplify', href: '/fr/docs/deployment' }),
)`, { align: 'stretch' }),

      h2('Des rangées avec des contrôles'),
      p(
        'Quand une rangée porte un interrupteur ou un bouton, laissez la rangée sans lien et faites du contrôle la partie interactive.',
      ),
      demo(`list(
  listItem({
    title: 'Recherche Pagefind',
    description: 'Indexe chaque page à la fin du build',
    end: toggle({ 'aria-label': 'Recherche Pagefind', checked: true }),
  }),
  listItem({
    title: 'Optimisation des images',
    description: 'Redimensionne et convertit les images. Nécessite sharp.',
    end: toggle({ 'aria-label': 'Optimisation des images', checked: true }),
  }),
  listItem({
    title: 'Îlots serveur',
    description: 'Rend les zones marquées au moment de la requête',
    end: toggle({ 'aria-label': 'Îlots serveur' }),
  }),
)`, { align: 'stretch' }),

      h2('Sans habillage'),
      p(
        code('plain'),
        ' retire la bordure et le fond, pour une liste posée dans une carte ou une barre latérale qui a déjà sa propre surface.',
      ),
      demo(`card(
  cardHeader({ title: 'Builds récents' }),
  cardBody(
    list({ plain: true },
      listItem({ title: '94a837a', description: 'main · il y a 4 minutes', end: chip({ size: 'sm', color: 'success', dot: true }, 'réussi') }),
      listItem({ title: 'dcfaaae', description: 'main · il y a 2 heures', end: chip({ size: 'sm', color: 'success', dot: true }, 'réussi') }),
      listItem({ title: 'a46a461', description: 'main · hier', end: chip({ size: 'sm', color: 'danger', dot: true }, 'échoué') }),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Rangées libres'),
      p(
        'Sans ',
        code('title'),
        ' ni ',
        code('description'),
        ', une rangée rend les enfants qu’on lui donne — pour une mise en page que la forme à deux lignes ne couvre pas.',
      ),
      demo(`list(
  listItem(
    stack({ direction: 'row', gap: 'md', align: 'center', justify: 'space-between', style: 'width: 100%' },
      stack({ gap: 'none' },
        text({ variant: 'small' }, 'Rangée sur mesure'),
        text({ variant: 'caption', tone: 'muted' }, 'Tout ce que vous voulez à l’intérieur'),
      ),
      button({ size: 'sm', variant: 'soft' }, 'Action'),
    ),
  ),
)`, { align: 'stretch' }),

      h2('À partir de données'),
      demo(`return (() => {
  const locales = [
    { code: 'en', name: 'English', pages: 24 },
    { code: 'es', name: 'Español', pages: 24 },
    { code: 'zh', name: '简体中文', pages: 24 },
  ]

  return list(
    locales.map((locale) =>
      listItem({
        start: avatar({ name: locale.code, size: 'sm', color: 'neutral', square: true }),
        title: locale.name,
        description: locale.pages + ' pages',
        end: chip({ size: 'sm', color: 'neutral' }, locale.code),
      }),
    ),
  )
})()`, { align: 'stretch' }),

      h2('Props'),
      p(code('list()'), ' :'),
      propsTable([
        ['plain', 'boolean', 'false', 'Retire la bordure et le fond.'],
        ['as', 'string', "'ul'", 'Élément à rendre, par exemple ol.'],
      ]),
      p(code('listItem()'), ' :'),
      propsTable([
        ['title', 'Child', '', 'La ligne principale de la rangée.'],
        ['description', 'Child', '', 'Une deuxième ligne atténuée.'],
        ['start', 'Child', '', 'Emplacement de tête — un avatar ou une icône.'],
        ['end', 'Child', '', 'Emplacement de queue — une puce, un contrôle, un horodatage.'],
        ['href', 'string', '', 'Fait de la rangée un lien, avec l’ancre à l’intérieur du li.'],
        ['interactive', 'boolean', 'false', 'Surbrillance au survol sans en faire un lien.'],
      ]),
    ],
  })
