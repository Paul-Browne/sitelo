import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/fr.js'

export default () =>
  uiLayout({
    title: 'Séparateur',
    description:
      'Un filet entre deux sections, avec ou sans libellé au milieu.',
    activeHref: '/fr/ui/divider',
    children: [
      p(
        'Un séparateur sépare des groupes de contenu. Il rend un élément ',
        code('role="separator"'),
        ' plutôt qu’un ',
        code('<hr>'),
        ', parce qu’un libellé se loge à l’intérieur et que ',
        code('<hr>'),
        ' n’accepte aucun enfant.',
      ),

      h2('Séparateur de base'),
      demo(`stack({ gap: 'none' },
  text({ tone: 'muted' }, 'Tout ce qui est au-dessus.'),
  divider(),
  text({ tone: 'muted' }, 'Tout ce qui est en dessous.'),
)`, { align: 'stretch' }),

      h2('Avec un libellé'),
      p('Les enfants deviennent un libellé centré dans le filet.'),
      demo(`stack({ gap: 'none' },
  button({ variant: 'outline', color: 'neutral', block: true }, 'Continuer avec GitHub'),
  divider('ou'),
  button({ block: true }, 'Continuer par e-mail'),
)`, { align: 'stretch' }),

      h2('Espacement'),
      p(
        code('spacing'),
        ' règle la marge au-dessus et en dessous, sur la même échelle que tout le reste.',
      ),
      demo(`stack({ gap: 'none' },
  text({ variant: 'small', tone: 'muted' }, 'Serré'),
  divider({ spacing: 'xs' }),
  text({ variant: 'small', tone: 'muted' }, 'Par défaut'),
  divider(),
  text({ variant: 'small', tone: 'muted' }, 'Aéré'),
  divider({ spacing: 'xl' }),
  text({ variant: 'small', tone: 'muted' }, 'Fin'),
)`, { align: 'stretch' }),

      h2('Vertical'),
      p(
        'Un séparateur vertical a besoin d’un parent qui lui donne une hauteur — une rangée flex dont les éléments s’étirent, ce que ',
        code('stack()'),
        ' fait par défaut.',
      ),
      demo(`stack({ direction: 'row', gap: 'none', align: 'stretch' },
  text({ variant: 'small' }, '4,1 ko'),
  divider({ orientation: 'vertical' }),
  text({ variant: 'small' }, '12 pages'),
  divider({ orientation: 'vertical' }),
  text({ variant: 'small' }, '0 îlot'),
)`),

      h2('Props'),
      propsTable([
        ['orientation', "'horizontal' | 'vertical'", "'horizontal'", 'Dans quel sens court le filet.'],
        ['spacing', 'Space', "'md'", 'Marge de part et d’autre du filet.'],
      ]),
    ],
  })
