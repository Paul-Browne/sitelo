import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/de.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Trenner',
    description:
      'Eine Linie zwischen Abschnitten, mit oder ohne Beschriftung in der Mitte.',
    activeHref: '/de/ui/divider',
    extraHead: uiHead(),
    children: [
      p(
        'Ein Trenner trennt Inhaltsgruppen. Er rendert ein Element mit ',
        code('role="separator"'),
        ' statt eines ',
        code('<hr>'),
        ', weil die Beschriftung hineingehört und ',
        code('<hr>'),
        ' keine Kinder aufnimmt.',
      ),

      h2('Einfacher Trenner'),
      demo(`stack({ gap: 'none' },
  text({ tone: 'muted' }, 'Alles darüber.'),
  divider(),
  text({ tone: 'muted' }, 'Alles darunter.'),
)`, { align: 'stretch' }),

      h2('Mit Beschriftung'),
      p('Kinder werden zu einer Beschriftung, zentriert in der Linie.'),
      demo(`stack({ gap: 'none' },
  button({ variant: 'outline', color: 'neutral', block: true }, 'Weiter mit GitHub'),
  divider('oder'),
  button({ block: true }, 'Weiter mit E-Mail'),
)`, { align: 'stretch' }),

      h2('Abstand'),
      p(
        code('spacing'),
        ' setzt den Abstand darüber und darunter, aus derselben Skala wie alles andere.',
      ),
      demo(`stack({ gap: 'none' },
  text({ variant: 'small', tone: 'muted' }, 'Eng'),
  divider({ spacing: 'xs' }),
  text({ variant: 'small', tone: 'muted' }, 'Standard'),
  divider(),
  text({ variant: 'small', tone: 'muted' }, 'Großzügig'),
  divider({ spacing: 'xl' }),
  text({ variant: 'small', tone: 'muted' }, 'Ende'),
)`, { align: 'stretch' }),

      h2('Vertikal'),
      p(
        'Ein vertikaler Trenner braucht ein Elternelement, das ihm Höhe gibt — eine Flex-Reihe, deren Elemente sich strecken, was ',
        code('stack()'),
        ' standardmäßig tut.',
      ),
      demo(`stack({ direction: 'row', gap: 'none', align: 'stretch' },
  text({ variant: 'small' }, '4,1 kB'),
  divider({ orientation: 'vertical' }),
  text({ variant: 'small' }, '12 Seiten'),
  divider({ orientation: 'vertical' }),
  text({ variant: 'small' }, '0 Islands'),
)`),

      h2('Props'),
      propsTable([
        ['orientation', "'horizontal' | 'vertical'", "'horizontal'", 'In welche Richtung die Linie läuft.'],
        ['spacing', 'Space', "'md'", 'Abstand zu beiden Seiten der Linie.'],
      ]),
    ],
  })
