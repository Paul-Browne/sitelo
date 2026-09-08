import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/fr.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Étapes',
    description:
      'Un parcours numéroté, où les étapes déjà passées sont marquées comme faites.',
    activeHref: '/fr/ui/steps',
    extraHead: uiHead(),
    children: [
      p(
        code('current'),
        ' est l’indice de l’étape en cours. Tout ce qui précède est terminé et reçoit une coche ; tout ce qui suit reste à venir. L’étape courante porte ',
        code('aria-current="step"'),
        ' : elle est donc annoncée en plus d’être colorée.',
      ),

      h2('Étapes de base'),
      demo(`steps({
  current: 1,
  items: [
    { title: 'Installer' },
    { title: 'Écrire une page' },
    { title: 'Construire' },
    { title: 'Déployer' },
  ],
})`, { align: 'stretch' }),

      h2('Avec des descriptions'),
      demo(`steps({
  current: 2,
  items: [
    { title: 'Installer', description: 'npm install -D sitelo' },
    { title: 'Écrire une page', description: 'src/index.ht.js' },
    { title: 'Construire', description: 'sitelo build' },
    { title: 'Déployer', description: 'Publier dist/' },
  ],
})`, { align: 'stretch' }),

      h2('Vertical'),
      p('Préférable quand les descriptions dépassent quelques mots.'),
      demo(`steps({
  direction: 'vertical',
  current: 1,
  items: [
    { title: 'Ajouter le paquet', description: 'sitelo apporte son propre Vite, il n’y a donc rien d’autre à installer.' },
    { title: 'Écrire une fonction qui renvoie du HTML', description: 'Un seul fichier sous src/ fait déjà un site.' },
    { title: 'Publier la sortie', description: 'dist/ n’est que des fichiers statiques — n’importe quel hébergeur les prend.' },
  ],
})`, { align: 'stretch' }),

      h2('Rien de fait pour l’instant'),
      demo(`steps({ current: 0, items: ['Installer', 'Configurer', 'Déployer'] })`, { align: 'stretch' }),

      h2('Tout est fait'),
      p(
        'Mettez ',
        code('current'),
        ' au-delà du dernier indice et chaque étape se lit comme terminée.',
      ),
      demo(`steps({ current: 3, items: ['Installer', 'Configurer', 'Déployer'] })`, { align: 'stretch' }),

      h2('Sur un téléphone'),
      p(
        'Une rangée horizontale n’a nulle part où aller sur un écran étroit : sous 40rem elle devient verticale d’elle-même, sans aucune prop. Rétrécissez cette fenêtre pour le voir.',
      ),

      h2('Lui donner un nom'),
      p(
        'La liste est un ',
        code('<ol>'),
        ', qui porte déjà l’ordre. Ajoutez ',
        code('label'),
        ' quand la page contient plusieurs séries d’étapes qu’il faut distinguer.',
      ),
      demo(`steps({
  label: 'Progression du déploiement',
  current: 1,
  items: ['Construire', 'Téléverser', 'Invalider le cache'],
})`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['items', 'Array', '[]', 'Des chaînes, ou des objets { title, description }.'],
        ['current', 'number', '0', 'Indice de l’étape en cours.'],
        ['direction', "'horizontal' | 'vertical'", "'horizontal'", 'Disposition. L’horizontale devient verticale sous 40rem.'],
        ['label', 'string', '', 'Nom accessible de la liste.'],
      ]),
    ],
  })
