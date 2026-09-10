import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/fr.js'

export default () =>
  uiLayout({
    title: 'Figure',
    description:
      'Une image et sa légende, en une seule figure — avec la place réservée avant l’arrivée de l’image.',
    activeHref: '/fr/ui/figure',
    children: [
      p(
        'Une ',
        code('<figure>'),
        ' rattache la légende à ce qu’elle décrit, ce qu’un paragraphe sous une image ne fait pas. Passez ',
        code('src'),
        ' pour le cas courant, ou des enfants pour tout le reste qui mérite une légende.',
      ),

      h2('Figure de base'),
      demo(`figure({
  src: '/logo.svg',
  alt: 'Le logotype sitelo',
  caption: 'Le logotype, tel qu’il apparaît dans la barre du haut.',
  style: '--su-figure-bg: var(--su-surface-2)',
})`, { align: 'stretch' }),

      h2('Avec un rapport réservé'),
      p(
        code('ratio'),
        ' enveloppe l’image dans un ',
        code('aspectRatio()'),
        ', pour que la légende ne saute jamais vers le bas quand l’image charge.',
      ),
      demo(`grid({ min: '13rem' },
  figure({ src: '/logo.svg', alt: '', ratio: '16 / 9', caption: 'ratio: 16 / 9' }),
  figure({ src: '/logo.svg', alt: '', ratio: '1 / 1', caption: 'ratio: 1 / 1' }),
)`, { align: 'stretch' }),

      h2('Légender autre chose'),
      p('Sans ', code('src'), ', les enfants sont le contenu de la figure.'),
      demo(`figure({ caption: 'Tableau 1 — sortie d’un build par défaut.' },
  table({
    dense: true,
    columns: [{ key: 'file', header: 'Fichier' }, { key: 'size', header: 'Taille', align: 'end' }],
    rows: [
      { file: 'index.html', size: '4,1 ko' },
      { file: '404.html', size: '860 o' },
      { file: 'sitemap.xml', size: '155 o' },
    ],
  }),
)`, { align: 'stretch' }),

      h2('Du code avec une légende'),
      p(
        'Notez la prop ',
        code('text'),
        ' de ',
        code('code()'),
        ' : partout dans cette bibliothèque les enfants sont rendus comme du HTML, donc un extrait contenant des balises doit être échappé, sinon le navigateur le construit au lieu de le montrer.',
      ),
      demo(`figure({ caption: 'Une page sitelo dans son intégralité.' },
  code({ text: 'export default () => "<h1>Bonjour</h1>"' }),
)`, { align: 'stretch' }),

      h2('Texte alternatif'),
      p(
        'L’attribut ',
        code('alt'),
        ' est toujours écrit, vide si vous ne donnez rien — une image sans ',
        code('alt'),
        ' du tout est annoncée par son nom de fichier, ce qui est pire que le silence. Une légende ne remplace pas l’alt : la légende est lue par tout le monde, l’alt décrit l’image à qui ne peut pas la voir.',
      ),
      p(
        'Quand la légende dit déjà tout ce que dit l’image, ',
        code("alt: ''"),
        ' est la bonne réponse.',
      ),

      h2('Dans de la prose'),
      p(
        'Les figures sorties d’un rendu Markdown sont déjà stylées par ',
        code('prose()'),
        '. Ce composant est pour les figures que vous construisez vous-même.',
      ),

      h2('Props'),
      propsTable([
        ['src', 'string', '', 'Source de l’image. Omettez-la et utilisez des enfants.'],
        ['alt', 'string', "''", 'Texte alternatif. Toujours écrit, même vide.'],
        ['caption', 'Child', '', 'Le figcaption.'],
        ['ratio', 'string', '', 'Réserve la place avant le chargement de l’image.'],
      ]),
    ],
  })
