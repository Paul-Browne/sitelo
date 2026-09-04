import { h2, p } from 'javascript-to-html'
import { code } from '../lib/code.js'
import { uiLayout } from '../lib/layout.js'
import { demo, propsTable, uiHead } from '../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Tooltip',
    description:
      'A short hint on hover and focus, drawn entirely in CSS.',
    activeHref: '/ui/tooltip',
    extraHead: uiHead(),
    children: [
      p(
        'The tooltip text lives in a data attribute and is drawn by a pseudo-element, so there is no script, nothing to position at runtime, and nothing left behind in the DOM. It appears on hover and on keyboard focus, which the ',
        code(':focus-within'),
        ' half of the rule takes care of.',
      ),

      h2('Basic tooltip'),
      demo(`stack({ direction: 'row', gap: 'md' },
  tooltip({ content: 'Copy to clipboard' },
    iconButton({
      label: 'Copy',
      variant: 'soft',
      color: 'neutral',
      icon: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="7" y="7" width="9" height="9" rx="1.5"/><path d="M13 7V5.5A1.5 1.5 0 0 0 11.5 4h-6A1.5 1.5 0 0 0 4 5.5v6A1.5 1.5 0 0 0 5.5 13H7"/></svg>',
    }),
  ),
  tooltip({ content: 'Rebuild the site' },
    button({ variant: 'outline', color: 'neutral' }, 'Rebuild'),
  ),
)`),

      h2('Placement'),
      p('Above by default, below when there is no room above.'),
      demo(`stack({ direction: 'row', gap: 'lg' },
  tooltip({ content: 'Above the trigger' },
    button({ variant: 'soft', color: 'neutral' }, 'Top'),
  ),
  tooltip({ content: 'Below the trigger', placement: 'bottom' },
    button({ variant: 'soft', color: 'neutral' }, 'Bottom'),
  ),
)`),

      h2('Accessible names'),
      p(
        'The tooltip text is decoration — it is drawn from CSS ',
        code('content'),
        ', which screen readers do not reliably announce. The control inside still needs its own accessible name, which is what ',
        code('iconButton()'),
        '’s ',
        code('label'),
        ' provides. When the tooltip says something the control’s name does not, pass ',
        code('label: true'),
        ' to repeat it in a visually hidden span.',
      ),
      demo(`stack({ direction: 'row', gap: 'lg' },
  tooltip({ content: 'Deploys to production immediately', label: true },
    button({ color: 'danger' }, 'Deploy'),
  ),
)`),

      h2('On text'),
      p('A tooltip wraps inline content as happily as it wraps a button.'),
      demo(`text(
  'The build writes to ',
  tooltip({ content: 'Configurable with outDir' }, code('dist/')),
  ' and nothing else.',
)`, { align: 'stretch' }),

      h2('When not to use one'),
      p(
        'Tooltips do not appear on touch, and they vanish the moment the pointer leaves. Anything a reader must have — an error message, an explanation of a required field — belongs in ',
        code('help'),
        ' text on the field itself, not in a tooltip.',
      ),

      h2('Props'),
      propsTable([
        ['content', 'string', '', 'The hint text.'],
        ['placement', "'top' | 'bottom'", "'top'", 'Which side of the trigger it appears on.'],
        ['label', 'boolean', 'false', 'Also expose the text to screen readers, in a hidden span.'],
      ]),
    ],
  })
