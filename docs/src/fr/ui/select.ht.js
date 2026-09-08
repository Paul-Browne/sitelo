import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/fr.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Liste déroulante',
    description:
      'Un select natif, stylé pour s’accorder aux autres champs, avec des options construites à partir de données.',
    activeHref: '/fr/ui/select',
    extraHead: uiHead(),
    children: [
      p(
        'C’est un vrai ',
        code('<select>'),
        ' avec le menu déroulant du navigateur — ce qui veut dire qu’il marche sans JavaScript, s’ouvre correctement sur un téléphone, et se parcourt au clavier sans rien devoir à cette bibliothèque.',
      ),
      p(
        code('select()'),
        ' est le contrôle nu ; ',
        code('selectField()'),
        ' l’enveloppe d’un libellé, d’un texte d’aide et d’un message d’erreur, comme le fait ',
        code('textField()'),
        '.',
      ),

      h2('Liste de base'),
      p(
        'Les options peuvent être de simples chaînes, auquel cas la valeur et le libellé sont identiques.',
      ),
      demo(`selectField({
  label: 'Thème',
  name: 'theme',
  options: ['Clair', 'Sombre', 'Système'],
})`, { align: 'stretch' }),

      h2('Valeurs et libellés'),
      p(
        'Passez des objets quand la valeur soumise diffère du texte lu par une personne. ',
        code('value'),
        ' marque l’option sélectionnée.',
      ),
      demo(`selectField({
  label: 'Sortie',
  name: 'output',
  value: 'dist',
  options: [
    { value: 'dist', label: 'dist/ — le défaut' },
    { value: 'build', label: 'build/' },
    { value: 'public', label: 'public/', disabled: true },
  ],
})`, { align: 'stretch' }),

      h2('Texte indicatif'),
      p(
        'Un placeholder devient une première option désactivée, sélectionnée quand ',
        code('value'),
        ' est absent — le champ démarre donc vide sans être un choix valable.',
      ),
      demo(`selectField({
  label: 'Cible de déploiement',
  name: 'target',
  placeholder: 'Choisissez un hébergeur…',
  options: ['Netlify', 'Vercel', 'Cloudflare Pages', 'GitHub Pages'],
})`, { align: 'stretch' }),

      h2('Groupes'),
      p(
        'Une entrée avec son propre tableau ',
        code('options'),
        ' devient un ',
        code('<optgroup>'),
        '.',
      ),
      demo(`selectField({
  label: 'Extension de page',
  name: 'ext',
  value: '.ht.js',
  options: [
    { label: 'JavaScript', options: ['.ht.js', '.html.js'] },
    { label: 'TypeScript', options: ['.ht.ts', '.html.ts'] },
    { label: 'JSX', options: ['.ht.jsx', '.ht.tsx'] },
  ],
})`, { align: 'stretch' }),

      h2('Tailles'),
      demo(`stack({ gap: 'md' },
  selectField({ label: 'Petite', name: 'sm', size: 'sm', options: ['Un', 'Deux'] }),
  selectField({ label: 'Moyenne', name: 'md', size: 'md', options: ['Un', 'Deux'] }),
  selectField({ label: 'Grande', name: 'lg', size: 'lg', options: ['Un', 'Deux'] }),
)`, { align: 'stretch' }),

      h2('Aide, erreur et désactivation'),
      demo(`stack({ gap: 'lg' },
  selectField({
    label: 'Langue',
    name: 'locale',
    options: ['en', 'es', 'fr'],
    help: 'Sert à l’attribut lang du html.',
  }),
  selectField({
    label: 'Framework',
    name: 'framework',
    placeholder: 'Choisissez-en un…',
    options: ['sitelo'],
    error: 'Choisissez un framework pour continuer.',
  }),
  selectField({
    label: 'Formule',
    name: 'plan',
    options: ['Gratuite'],
    disabled: true,
  }),
)`, { align: 'stretch' }),

      h2('À partir de données'),
      p(
        'Les options ne sont qu’un tableau : elles viennent donc en général de ce que ',
        code('data()'),
        ' a déjà chargé pour la page.',
      ),
      demo(`return (() => {
  const posts = [
    { slug: 'hello-world', title: 'Bonjour le monde' },
    { slug: 'static-first', title: 'Le statique d’abord' },
    { slug: 'no-runtime', title: 'Aucun runtime' },
  ]

  return selectField({
    label: 'Billet à la une',
    name: 'featured',
    value: 'static-first',
    options: posts.map((post) => ({ value: post.slug, label: post.title })),
  })
})()`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['options', 'SelectOption[]', '[]', 'Des chaînes, des objets { value, label, disabled }, ou { label, options } pour un groupe.'],
        ['value', 'string | number', '', 'L’option sélectionnée.'],
        ['placeholder', 'string', '', 'Première option désactivée, sélectionnée en l’absence de valeur.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Hauteur du contrôle et taille du texte.'],
        ['name', 'string', '', 'Nom du champ ; l’id en découle.'],
        ['invalid', 'boolean', 'false', 'Pose aria-invalid. selectField le fait pour vous à partir d’error.'],
        ['disabled', 'boolean', 'false', 'Désactive le contrôle.'],
      ]),
      p(
        code('selectField()'),
        ' prend en plus ',
        code('label'),
        ', ',
        code('help'),
        ', ',
        code('error'),
        ', ',
        code('required'),
        ' et ',
        code('fieldClass'),
        ' — voir ',
        code('textField()'),
        '. Les enfants sont ajoutés après les options générées : vous pouvez donc en écrire à la main.',
      ),
    ],
  })
