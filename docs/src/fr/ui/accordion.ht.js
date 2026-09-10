import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/fr.js'

export default () =>
  uiLayout({
    title: 'Accordéon',
    description:
      'Des sections repliables, avec le <details> natif du navigateur — mode exclusif compris.',
    activeHref: '/fr/ui/accordion',
    children: [
      p(
        'Chaque section est un ',
        code('<details>'),
        '. L’ouverture, la fermeture, le clavier et la recherche dans la page viennent du navigateur, et l’accordéon fonctionne sans JavaScript — ce qui compte pour une FAQ, son usage le plus courant.',
      ),

      h2('Accordéon de base'),
      demo(`accordion({
  items: [
    { title: 'Qu’est-ce que sitelo ?', content: 'Un générateur de sites statiques bâti sur Vite. Les pages sont des fonctions qui renvoient du HTML.' },
    { title: 'Y a-t-il un runtime ?', content: 'Non. Rien n’atteint le navigateur tant que vous ne liez pas un script vous-même.' },
    { title: 'Puis-je utiliser TypeScript ?', content: 'Oui — .ht.ts et .ht.tsx sont des extensions de page comme les autres.' },
  ],
})`, { align: 'stretch' }),

      h2('Ouvert par défaut'),
      demo(`accordion({
  items: [
    { title: 'Ouvert à l’arrivée', content: 'Celle-ci a open: true.', open: true },
    { title: 'Fermée', content: 'Celle-ci non.' },
  ],
})`, { align: 'stretch' }),

      h2('Un seul à la fois'),
      p(
        'Un ',
        code('name'),
        ' partagé rend les sections mutuellement exclusives : en ouvrir une ferme les autres. C’est le comportement natif du navigateur pour ',
        code('<details name>'),
        ', pas un script.',
      ),
      demo(`accordion({
  name: 'demo-exclusive',
  items: [
    { title: 'Première', content: 'Ouvrez-en une autre et celle-ci se ferme.', open: true },
    { title: 'Deuxième', content: 'Celle-ci aussi.' },
    { title: 'Troisième', content: 'Une seule est ouverte à la fois.' },
  ],
})`, { align: 'stretch' }),

      h2('Contenu riche'),
      p(
        'Construisez les sections avec ',
        code('accordionItem()'),
        ' quand le contenu dépasse un paragraphe.',
      ),
      demo(`accordion(
  accordionItem({ title: 'Installer', open: true },
    stack({ gap: 'sm' },
      text({ variant: 'small', tone: 'muted' }, 'Ajoutez le paquet et son compagnon de balisage :'),
      code('npm install sitelo javascript-to-html'),
    ),
  ),
  accordionItem({ title: 'Configurer' },
    stack({ gap: 'sm' },
      text({ variant: 'small', tone: 'muted' }, 'Facultatif. Les options Vite vivent sous la clé vite.'),
      code('sitelo.config.js'),
    ),
  ),
  accordionItem({ title: 'Déployer' },
    stack({ gap: 'sm' },
      text({ variant: 'small', tone: 'muted' }, 'Publiez le dossier de sortie sur n’importe quel hébergeur statique.'),
      stack({ direction: 'row', gap: 'sm', wrap: true },
        chip({ size: 'sm' }, 'Netlify'),
        chip({ size: 'sm' }, 'Vercel'),
        chip({ size: 'sm' }, 'Cloudflare Pages'),
        chip({ size: 'sm' }, 'GitHub Pages'),
      ),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Une FAQ'),
      p(
        'La forme pour laquelle ce composant existe : du contenu déjà présent dans le HTML, replié pour être parcouru, et trouvable par un moteur de recherche parce qu’il n’a jamais quitté la page.',
      ),
      demo(`return (() => {
  const faq = [
    ['Vraiment zéro configuration ?', 'Un projet avec un fichier dans src/ et aucune config se construit. Tout le reste est optionnel.'],
    ['Comment marchent les routes dynamiques ?', 'Des crochets dans les noms de fichiers. generateStaticParams liste ce qu’il faut construire.'],
    ['Et la recherche ?', 'Mettez pagefind: true et le build indexe chaque page.'],
  ]

  return accordion({
    name: 'demo-faq',
    items: faq.map(([title, content]) => ({ title, content })),
  })
})()`, { align: 'stretch' }),

      h2('Props'),
      p(code('accordion()'), ' :'),
      propsTable([
        ['items', 'Array', '[]', 'Des chaînes, ou des objets { title, content, open }.'],
        ['name', 'string', '', 'Un name partagé rend les sections mutuellement exclusives.'],
      ]),
      p(code('accordionItem()'), ' :'),
      propsTable([
        ['title', 'Child', '', 'La ligne de résumé.'],
        ['open', 'boolean', 'false', 'Si elle démarre dépliée.'],
        ['name', 'string', '', 'Même effet que sur le parent, quand les éléments sont écrits à la main.'],
      ]),
    ],
  })
