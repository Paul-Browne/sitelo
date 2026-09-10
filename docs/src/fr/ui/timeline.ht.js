import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/fr.js'

export default () =>
  uiLayout({
    title: 'Chronologie',
    description:
      'Des entrées dans l’ordre, le long d’une ligne — un journal des modifications, un historique de versions, une page « à propos ».',
    activeHref: '/fr/ui/timeline',
    children: [
      p(
        'Une chronologie est une liste ordonnée avec un filet sur le côté. Construisez-la à partir d’',
        code('items'),
        ', ou d’enfants ',
        code('timelineItem()'),
        ' quand les entrées ne sont pas assez uniformes pour venir d’un tableau.',
      ),

      h2('Chronologie de base'),
      demo(`timeline({
  items: [
    { time: 'Mars 2026', title: 'Bibliothèque de composants', description: 'sitelo-ui arrive avec quatre-vingt-dix composants.' },
    { time: 'Janvier 2026', title: 'Îlots serveur', description: 'Des pages statiques dont certaines zones sont rendues à la requête.' },
    { time: 'Octobre 2025', title: 'Première version', description: 'Routage par fichiers et une commande de build.' },
  ],
})`, { align: 'stretch' }),

      h2('Marqueurs colorés'),
      demo(`timeline({
  items: [
    { time: '12:04', title: 'Déploiement réussi', description: '204 pages publiées.', color: 'success' },
    { time: '12:03', title: 'Lighthouse validé', description: 'Tous les seuils atteints.', color: 'success' },
    { time: '12:01', title: 'Avertissement de vérification des liens', description: 'Un lien externe a expiré.', color: 'warning' },
    { time: '12:00', title: 'Build démarré', color: 'neutral' },
  ],
})`, { align: 'stretch' }),

      h2('Avec des icônes'),
      demo(`timeline(
  timelineItem({
    time: 'À l’instant',
    title: 'Publié',
    color: 'success',
    icon: icon('check', { 'stroke-width': 3.4 }),
  }),
  timelineItem({
    time: 'Il y a 2 minutes',
    title: 'Construction',
    color: 'primary',
  }),
)`, { align: 'stretch' }),

      h2('Entrées riches'),
      p('Les enfants d’un élément se placent sous sa description.'),
      demo(`timeline(
  timelineItem({ time: 'v2.7.0', title: 'Sections de page', color: 'primary' },
    stack({ direction: 'row', gap: 'xs', wrap: true, style: 'margin-top: 0.5rem' },
      chip({ size: 'sm' }, 'hero'),
      chip({ size: 'sm' }, 'footer'),
      chip({ size: 'sm' }, 'stat'),
      chip({ size: 'sm' }, 'steps'),
      chip({ size: 'sm' }, 'timeline'),
      chip({ size: 'sm' }, 'mockup'),
    ),
  ),
  timelineItem({ time: 'v2.6.3', title: 'Maintenance', description: 'Montées de dépendances et un correctif du vérificateur de liens.' }),
)`, { align: 'stretch' }),

      h2('À partir de données'),
      p(
        'La forme habituelle sur un site statique : un fichier de journal chargé par ',
        code('data()'),
        ', transformé directement en éléments.',
      ),
      demo(`return (() => {
  const releases = [
    { version: '2.7.0', date: '2026-03-01', summary: 'Sections de page' },
    { version: '2.6.3', date: '2026-02-14', summary: 'Maintenance' },
    { version: '2.6.0', date: '2026-01-20', summary: 'Îlots serveur' },
  ]

  return timeline({
    items: releases.map((release) => ({
      time: release.date,
      title: 'v' + release.version,
      description: release.summary,
      color: 'primary',
    })),
  })
})()`, { align: 'stretch' }),

      h2('Chronologie ou étapes ?'),
      p(
        'Une chronologie consigne ce qui s’est passé, du plus récent ou du plus ancien, et n’a pas de position courante. ',
        code('steps()'),
        ' montre l’avancement dans un parcours, avec une étape en cours et le reste devant ou derrière elle.',
      ),

      h2('Props'),
      p(code('timeline()'), ' :'),
      propsTable([
        ['items', 'Array', '[]', 'Des objets portant les props de timelineItem ci-dessous.'],
      ]),
      p(code('timelineItem()'), ' :'),
      propsTable([
        ['time', 'Child', '', 'Quand cela s’est passé — une date, une version, une heure.'],
        ['title', 'Child', '', 'Ce qui s’est passé.'],
        ['description', 'Child', '', 'Le détail en dessous.'],
        ['icon', 'Child', '', 'Balisage à l’intérieur du marqueur.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", '', 'Couleur du marqueur.'],
      ]),
      p('Les enfants d’un élément sont rendus sous sa description.'),
    ],
  })
