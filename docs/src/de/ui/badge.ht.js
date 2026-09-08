import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/de.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Badge',
    description:
      'Eine Zahl oder ein Punkt, an die Ecke dessen geheftet, was das Badge umschließt.',
    activeHref: '/de/ui/badge',
    extraHead: uiHead(),
    children: [
      p(
        'Ein Badge umschließt etwas und heftet ihm oben in die Ecke eine Markierung: ungelesene Nachrichten auf einem Posteingang-Button, ein Online-Punkt auf einem Avatar. Was es markiert, bekommt es als Kinder.',
      ),

      h2('Einfaches Badge'),
      demo(`stack({ direction: 'row', gap: 'xl', align: 'center' },
  badge({ content: 4 }, button({ variant: 'soft', color: 'neutral' }, 'Posteingang')),
  badge({ content: 12 }, avatar({ name: 'Ada Lovelace' })),
)`),

      h2('Farben'),
      demo(`stack({ direction: 'row', gap: 'xl', align: 'center', wrap: true },
  badge({ content: 3, color: 'primary' }, button({ variant: 'soft', color: 'neutral' }, 'Primary')),
  badge({ content: 3, color: 'neutral' }, button({ variant: 'soft', color: 'neutral' }, 'Neutral')),
  badge({ content: 3, color: 'success' }, button({ variant: 'soft', color: 'neutral' }, 'Success')),
  badge({ content: 3, color: 'warning' }, button({ variant: 'soft', color: 'neutral' }, 'Warning')),
  badge({ content: 3, color: 'danger' }, button({ variant: 'soft', color: 'neutral' }, 'Danger')),
)`),

      h2('Maximum'),
      p(
        'Eine Zahl über ',
        code('max'),
        ' erscheint als ',
        code('n+'),
        ', damit ein Badge nie so breit wird, dass es das Element aus dem Gleichgewicht bringt, auf dem es sitzt.',
      ),
      demo(`stack({ direction: 'row', gap: 'xl', align: 'center', wrap: true },
  badge({ content: 9 }, button({ variant: 'soft', color: 'neutral' }, 'Neun')),
  badge({ content: 250 }, button({ variant: 'soft', color: 'neutral' }, 'Bei 99 gedeckelt')),
  badge({ content: 250, max: 999 }, button({ variant: 'soft', color: 'neutral' }, 'max: 999')),
)`),

      h2('Punkt'),
      p(
        'Ein Punkt sagt „etwas hat sich geändert“, ohne zu sagen, wie viel. Gib ihm ein ',
        code('label'),
        ' — ein nackter Punkt bedeutet einem Screenreader nichts, deshalb bleibt er ohne Label vollständig aus dem Accessibility-Baum heraus.',
      ),
      demo(`stack({ direction: 'row', gap: 'xl', align: 'center' },
  badge({ dot: true, color: 'success', label: 'Online' }, avatar({ name: 'Ada Lovelace' })),
  badge({ dot: true, color: 'warning', label: 'Braucht Aufmerksamkeit' },
    iconButton({
      label: 'Einstellungen',
      variant: 'soft',
      color: 'neutral',
      icon: icon('settings'),
    }),
  ),
)`),

      h2('Die Zahl beschriften'),
      p(
        'Eine nackte Zahl ist ohne Kontext mehrdeutig. ',
        code('label'),
        ' wird zum zugänglichen Namen des Badges, sodass es als „4 ungelesene Nachrichten“ vorgelesen wird statt nur „4“.',
      ),
      demo(`badge({ content: 4, label: '4 ungelesene Nachrichten' },
  button({ variant: 'soft', color: 'neutral' }, 'Posteingang'),
)`),

      h2('Props'),
      propsTable([
        ['content', 'string | number', '', 'Was das Badge zeigt. Wird ignoriert, wenn dot gesetzt ist.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'danger'", 'Farbe des Badges.'],
        ['dot', 'boolean', 'false', 'Ein kleiner Punkt statt eines Werts.'],
        ['max', 'number', '99', 'Zahlen darüber erscheinen als n+.'],
        ['label', 'string', '', 'Zugänglicher Name des Badges selbst.'],
      ]),
    ],
  })
