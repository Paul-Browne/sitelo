import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pl.js'

export default () =>
  uiLayout({
    title: 'Separator',
    description: 'Linia między sekcjami, z etykietą pośrodku albo bez niej.',
    activeHref: '/pl/ui/divider',
    children: [
      p(
        'Separator oddziela grupy treści. Renderuje element z ',
        code('role="separator"'),
        ' zamiast ',
        code('<hr>'),
        ', bo etykieta ma trafić do środka, a ',
        code('<hr>'),
        ' nie przyjmuje dzieci.',
      ),

      h2('Podstawowy separator'),
      demo(`stack({ gap: 'none' },
  text({ tone: 'muted' }, 'Wszystko powyżej.'),
  divider(),
  text({ tone: 'muted' }, 'Wszystko poniżej.'),
)`, { align: 'stretch' }),

      h2('Z etykietą'),
      p('Dzieci stają się etykietą wyśrodkowaną w linii.'),
      demo(`stack({ gap: 'none' },
  button({ variant: 'outline', color: 'neutral', block: true }, 'Kontynuuj przez GitHuba'),
  divider('albo'),
  button({ block: true }, 'Kontynuuj przez e-mail'),
)`, { align: 'stretch' }),

      h2('Odstęp'),
      p(
        code('spacing'),
        ' ustawia margines nad i pod, z tej samej skali, której używa wszystko inne.',
      ),
      demo(`stack({ gap: 'none' },
  text({ variant: 'small', tone: 'muted' }, 'Ciasno'),
  divider({ spacing: 'xs' }),
  text({ variant: 'small', tone: 'muted' }, 'Domyślnie'),
  divider(),
  text({ variant: 'small', tone: 'muted' }, 'Przestronnie'),
  divider({ spacing: 'xl' }),
  text({ variant: 'small', tone: 'muted' }, 'Koniec'),
)`, { align: 'stretch' }),

      h2('Pionowo'),
      p(
        'Pionowy separator potrzebuje rodzica, który da mu wysokość — rzędu flex, którego elementy się rozciągają, czyli tego, co ',
        code('stack()'),
        ' robi domyślnie.',
      ),
      demo(`stack({ direction: 'row', gap: 'none', align: 'stretch' },
  text({ variant: 'small' }, '4,1 kB'),
  divider({ orientation: 'vertical' }),
  text({ variant: 'small' }, '12 stron'),
  divider({ orientation: 'vertical' }),
  text({ variant: 'small' }, '0 wysp'),
)`),

      h2('Propsy'),
      propsTable([
        ['orientation', "'horizontal' | 'vertical'", "'horizontal'", 'W którą stronę biegnie linia.'],
        ['spacing', 'Space', "'md'", 'Margines po obu stronach linii.'],
      ]),
    ],
  })
