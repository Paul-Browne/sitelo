import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/fr.js'

export default () =>
  uiLayout({
    title: 'Pagination',
    description:
      'Des pages numérotées, fenêtrées autour de la page courante, en vrais liens.',
    activeHref: '/fr/ui/pagination',
    children: [
      p(
        code('href'),
        ' est une fonction qui va du numéro de page à l’URL : la pagination marche donc aussi bien pour ',
        code('/blog/2'),
        ' que pour ',
        code('/blog?page=2'),
        '. Chaque page devient ainsi un vrai lien — explorable, ouvrable dans un nouvel onglet, et fonctionnel sans JavaScript, ce que veut un site statique.',
      ),

      h2('Pagination de base'),
      demo(`pagination({ page: 1, count: 5, href: (page) => '#page-' + page })`),

      h2('Fenêtrage'),
      p(
        'La première et la dernière page sont toujours affichées, plus une fenêtre autour de la page courante, avec des points de suspension partout où la suite fait un saut.',
      ),
      demo(`stack({ gap: 'md' },
  pagination({ page: 1, count: 12, href: (page) => '#a-' + page }),
  pagination({ page: 6, count: 12, href: (page) => '#b-' + page }),
  pagination({ page: 12, count: 12, href: (page) => '#c-' + page }),
)`, { align: 'start' }),

      h2('Voisines'),
      p(
        code('siblings'),
        ' est le nombre de pages placées de chaque côté de la page courante.',
      ),
      demo(`stack({ gap: 'md' },
  pagination({ page: 6, count: 12, siblings: 0, href: (page) => '#d-' + page }),
  pagination({ page: 6, count: 12, siblings: 1, href: (page) => '#e-' + page }),
  pagination({ page: 6, count: 12, siblings: 3, href: (page) => '#f-' + page }),
)`, { align: 'start' }),

      h2('Extrémités'),
      p(
        'Précédent est désactivé sur la première page et suivant sur la dernière, si bien que le contrôle ne propose jamais une page qui n’existe pas.',
      ),
      demo(`stack({ gap: 'md' },
  pagination({ page: 1, count: 3, href: (page) => '#g-' + page }),
  pagination({ page: 3, count: 3, href: (page) => '#h-' + page }),
  pagination({ page: 1, count: 1, href: (page) => '#i-' + page }),
)`, { align: 'start' }),

      h2('Couleurs et libellés'),
      demo(`stack({ gap: 'md' },
  pagination({ page: 3, count: 6, color: 'neutral', href: (page) => '#j-' + page }),
  pagination({
    page: 3,
    count: 6,
    color: 'success',
    previousLabel: 'Plus récents',
    nextLabel: 'Plus anciens',
    href: (page) => '#k-' + page,
  }),
)`, { align: 'start' }),

      h2('Sans href'),
      p(
        'Sans ',
        code('href'),
        ', les numéros sont rendus en boutons portant ',
        code('data-su-page'),
        ' — pour une page qui filtre sur place avec son propre script. Préférez les liens quand vous le pouvez : ils survivent à un JavaScript désactivé.',
      ),
      demo(`pagination({ page: 2, count: 4 })`),

      h2('Dans un blog'),
      p(
        'La forme habituelle sur un site statique : ',
        code('generateStaticParams'),
        ' produit une page par tranche, et ',
        code('href'),
        ' pointe vers elles.',
      ),
      demo(`return (() => {
  const posts = 47
  const perPage = 10
  const current = 3

  return stack({ gap: 'md', align: 'center' },
    text({ variant: 'small', tone: 'muted' },
      'Affichage de ' + ((current - 1) * perPage + 1) + '–' + Math.min(current * perPage, posts) + ' sur ' + posts,
    ),
    pagination({
      page: current,
      count: Math.ceil(posts / perPage),
      href: (page) => page === 1 ? '#blog' : '#blog-' + page,
    }),
  )
})()`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['page', 'number', '1', 'La page courante. Ramenée dans l’intervalle.'],
        ['count', 'number', '1', 'Le nombre de pages.'],
        ['href', '(page: number) => string', '', 'Du numéro de page à l’URL. Sans lui, les pages sont des boutons.'],
        ['siblings', 'number', '1', 'Pages affichées de chaque côté de la page courante.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Couleur de la page courante.'],
        ['label', 'string', "'Pagination'", 'Nom accessible du repère nav.'],
        ['previousLabel', 'Child', "'‹'", 'Contenu du contrôle précédent.'],
        ['nextLabel', 'Child', "'›'", 'Contenu du contrôle suivant.'],
      ]),
    ],
  })
