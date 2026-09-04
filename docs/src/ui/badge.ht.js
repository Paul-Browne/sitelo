import { h2, p } from 'javascript-to-html'
import { code } from '../lib/code.js'
import { uiLayout } from '../lib/layout.js'
import { demo, propsTable, uiHead } from '../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Badge',
    description:
      'A count or a dot pinned to the corner of whatever it wraps.',
    activeHref: '/ui/badge',
    extraHead: uiHead(),
    children: [
      p(
        'A badge wraps something and pins a marker to its top corner: unread messages on an inbox button, an online dot on an avatar. It takes the thing it marks as children.',
      ),

      h2('Basic badge'),
      demo(`stack({ direction: 'row', gap: 'xl', align: 'center' },
  badge({ content: 4 }, button({ variant: 'soft', color: 'neutral' }, 'Inbox')),
  badge({ content: 12 }, avatar({ name: 'Ada Lovelace' })),
)`),

      h2('Colors'),
      demo(`stack({ direction: 'row', gap: 'xl', align: 'center', wrap: true },
  badge({ content: 3, color: 'primary' }, button({ variant: 'soft', color: 'neutral' }, 'Primary')),
  badge({ content: 3, color: 'neutral' }, button({ variant: 'soft', color: 'neutral' }, 'Neutral')),
  badge({ content: 3, color: 'success' }, button({ variant: 'soft', color: 'neutral' }, 'Success')),
  badge({ content: 3, color: 'warning' }, button({ variant: 'soft', color: 'neutral' }, 'Warning')),
  badge({ content: 3, color: 'danger' }, button({ variant: 'soft', color: 'neutral' }, 'Danger')),
)`),

      h2('Maximum'),
      p(
        'A count above ',
        code('max'),
        ' renders as ',
        code('n+'),
        ', so a badge never grows wide enough to unbalance the thing it sits on.',
      ),
      demo(`stack({ direction: 'row', gap: 'xl', align: 'center' },
  badge({ content: 9 }, button({ variant: 'soft', color: 'neutral' }, 'Nine')),
  badge({ content: 250 }, button({ variant: 'soft', color: 'neutral' }, 'Capped at 99')),
  badge({ content: 250, max: 999 }, button({ variant: 'soft', color: 'neutral' }, 'max: 999')),
)`),

      h2('Dot'),
      p(
        'A dot says "something changed" without saying how much. Give it a ',
        code('label'),
        ' — a bare dot means nothing to a screen reader, so without one it is hidden from the accessibility tree entirely.',
      ),
      demo(`stack({ direction: 'row', gap: 'xl', align: 'center' },
  badge({ dot: true, color: 'success', label: 'Online' }, avatar({ name: 'Ada Lovelace' })),
  badge({ dot: true, color: 'warning', label: 'Needs attention' },
    iconButton({
      label: 'Settings',
      variant: 'soft',
      color: 'neutral',
      icon: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="10" cy="10" r="3"/><path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.4 4.4l1.4 1.4M14.2 14.2l1.4 1.4M4.4 15.6l1.4-1.4M14.2 5.8l1.4-1.4"/></svg>',
    }),
  ),
)`),

      h2('Labelling the count'),
      p(
        'A bare number is ambiguous out of context. ',
        code('label'),
        ' becomes the badge’s accessible name, so it reads as "4 unread messages" rather than "4".',
      ),
      demo(`badge({ content: 4, label: '4 unread messages' },
  button({ variant: 'soft', color: 'neutral' }, 'Inbox'),
)`),

      h2('Props'),
      propsTable([
        ['content', 'string | number', '', 'What the badge shows. Ignored when dot is set.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'danger'", 'Badge colour.'],
        ['dot', 'boolean', 'false', 'A small dot instead of a value.'],
        ['max', 'number', '99', 'Counts above this render as n+.'],
        ['label', 'string', '', 'Accessible name for the badge itself.'],
      ]),
    ],
  })
