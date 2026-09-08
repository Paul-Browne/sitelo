import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/fr.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Conteneur',
    description:
      'Une colonne centrée et de largeur limitée — l’enveloppe la plus extérieure de la plupart des pages.',
    activeHref: '/fr/ui/container',
    extraHead: uiHead(),
    children: [
      p(
        'Un conteneur centre son contenu, plafonne la largeur pour que les lignes de texte restent lisibles, et garde une gouttière pour que rien ne touche le bord d’un écran de téléphone. C’est en général la première chose à l’intérieur de ',
        code('body()'),
        '.',
      ),

      h2('Conteneur de base'),
      demo(`container(
  text({ variant: 'lead' }, 'Tout ce qui est à l’intérieur reste centré et cesse de grandir à la limite de taille.'),
)`, { align: 'stretch' }),

      h2('Tailles'),
      p(
        'Cinq crans, d’une seule colonne lisible jusqu’à aucune limite du tout. ',
        code('sm'),
        ' fait environ 40rem — à peu près la largeur que réclame la prose.',
      ),
      demo(`stack({ gap: 'sm' },
  container({ size: 'sm', style: 'background: var(--su-surface-2); padding-block: 0.75rem' },
    text({ variant: 'small', align: 'center' }, 'sm — 40rem'),
  ),
  container({ size: 'md', style: 'background: var(--su-surface-2); padding-block: 0.75rem' },
    text({ variant: 'small', align: 'center' }, 'md — 56rem'),
  ),
  container({ size: 'lg', style: 'background: var(--su-surface-2); padding-block: 0.75rem' },
    text({ variant: 'small', align: 'center' }, 'lg — 72rem (par défaut)'),
  ),
)`, { align: 'stretch' }),

      h2('Une largeur sur mesure'),
      p(
        code('width'),
        ' prend n’importe quelle longueur CSS et prime sur ',
        code('size'),
        ', pour la page qui a besoin de ce que l’échelle n’offre pas.',
      ),
      demo(`container({ width: '30rem', style: 'background: var(--su-surface-2); padding-block: 0.75rem' },
  text({ variant: 'small', align: 'center' }, 'width: 30rem'),
)`, { align: 'stretch' }),

      h2('Gouttière'),
      p(
        'La gouttière est la marge intérieure maintenue entre le contenu et le bord de la fenêtre. Elle prend un jeton d’espacement, un nombre d’unités d’espacement, ou une longueur brute.',
      ),
      demo(`container({ size: 'sm', gutter: 'xl', style: 'background: var(--su-surface-2); padding-block: 0.75rem' },
  text({ variant: 'small' }, 'Une gouttière plus large, pour une page dont le contenu ne doit pas courir jusqu’au bord sur une tablette.'),
)`, { align: 'stretch' }),

      h2('Comme un autre élément'),
      p(
        code('as'),
        ' change la balise sans rien changer d’autre — pratique quand le conteneur est aussi le ',
        code('<main>'),
        ' de la page ou une ',
        code('<section>'),
        '.',
      ),
      demo(`container({ as: 'main', size: 'md' },
  heading({ level: 2, size: 'h4' }, 'Un élément main'),
  text({ tone: 'muted' }, 'Même mise en page, repère correct.'),
)`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['size', "'sm' | 'md' | 'lg' | 'xl' | 'full'", "'lg'", 'Quelle limite de largeur appliquer.'],
        ['width', 'string', '', 'Une max-width brute, qui prime sur size.'],
        ['gutter', 'Space', "'md'", 'Marge intérieure tenue contre le bord de la fenêtre.'],
        ['as', 'string', "'div'", 'Élément à rendre, par exemple main ou section.'],
      ]),
    ],
  })
