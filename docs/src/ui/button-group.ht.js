import { h2, p } from 'javascript-to-html'
import { code } from '../lib/code.js'
import { uiLayout } from '../lib/layout.js'
import { demo, propsTable, uiStyles } from '../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Button group',
    description:
      'Buttons that belong together, joined into one control with shared borders and rounded ends.',
    activeHref: '/ui/button-group',
    extraHead: uiStyles(),
    children: [
      p(
        'Buttons can be grouped by wrapping them in ',
        code('buttonGroup()'),
        '. They need to be immediate children: the group rounds the first and last button and pulls the rest together, so anything between them breaks the seam.',
      ),

      h2('Basic button group'),
      demo(`buttonGroup({ label: 'Basic button group' },
  button('One'),
  button('Two'),
  button('Three'),
)`),

      h2('Variants'),
      p(
        'The group itself carries no colour. Set ',
        code('variant'),
        ' and ',
        code('color'),
        ' on the buttons, and keep them the same across the group — that is what makes it read as one control.',
      ),
      demo(`stack({ gap: 'md', align: 'flex-start' },
  buttonGroup({ label: 'Solid' },
    button({ variant: 'solid' }, 'One'),
    button({ variant: 'solid' }, 'Two'),
    button({ variant: 'solid' }, 'Three'),
  ),
  buttonGroup({ label: 'Outline' },
    button({ variant: 'outline', color: 'neutral' }, 'One'),
    button({ variant: 'outline', color: 'neutral' }, 'Two'),
    button({ variant: 'outline', color: 'neutral' }, 'Three'),
  ),
  buttonGroup({ label: 'Soft' },
    button({ variant: 'soft' }, 'One'),
    button({ variant: 'soft' }, 'Two'),
    button({ variant: 'soft' }, 'Three'),
  ),
)`, { align: 'start' }),

      h2('Sizes and colors'),
      demo(`stack({ gap: 'md', align: 'flex-start' },
  buttonGroup({ label: 'Small' },
    button({ size: 'sm', variant: 'outline', color: 'neutral' }, 'Left'),
    button({ size: 'sm', variant: 'outline', color: 'neutral' }, 'Center'),
    button({ size: 'sm', variant: 'outline', color: 'neutral' }, 'Right'),
  ),
  buttonGroup({ label: 'Large' },
    button({ size: 'lg', variant: 'soft', color: 'danger' }, 'Cancel'),
    button({ size: 'lg', variant: 'soft', color: 'danger' }, 'Discard'),
  ),
)`, { align: 'start' }),

      h2('Marking the current choice'),
      p(
        'A group is markup, not state — there is no selected index to set. For a segmented control, give the active button the emphasis and mark it with ',
        code('aria-pressed'),
        ' so the choice is announced too.',
      ),
      demo(`buttonGroup({ label: 'Text alignment' },
  button({ variant: 'solid', color: 'neutral', 'aria-pressed': 'true' }, 'Left'),
  button({ variant: 'outline', color: 'neutral', 'aria-pressed': 'false' }, 'Center'),
  button({ variant: 'outline', color: 'neutral', 'aria-pressed': 'false' }, 'Right'),
)`),

      h2('Links'),
      p(
        'Buttons with an ',
        code('href'),
        ' group exactly the same way, which is the usual shape for a static site: one page per segment.',
      ),
      demo(`buttonGroup({ label: 'Docs sections' },
  button({ href: '/docs', variant: 'outline', color: 'neutral' }, 'Docs'),
  button({ href: '/ui', variant: 'outline', color: 'neutral' }, 'UI'),
  button({ href: '/examples', variant: 'outline', color: 'neutral' }, 'Examples'),
)`),

      h2('With an icon button'),
      demo(`buttonGroup({ label: 'Editor actions' },
  button({ variant: 'outline', color: 'neutral' }, 'Save'),
  iconButton({
    label: 'More actions',
    variant: 'outline',
    color: 'neutral',
    icon: '<svg viewBox="0 0 20 20" fill="currentColor"><circle cx="4" cy="10" r="1.6"/><circle cx="10" cy="10" r="1.6"/><circle cx="16" cy="10" r="1.6"/></svg>',
  }),
)`),

      h2('Props'),
      propsTable([
        ['label', 'string', '', 'Accessible name for the group; becomes aria-label on role="group".'],
      ]),
      p(
        'Everything else falls through to the wrapper. The buttons inside take their own props — see ',
        code('button()'),
        '.',
      ),
    ],
  })
