import { a, h2, p, strong } from 'javascript-to-html'
import { code } from '../lib/code.js'
import { uiLayout } from '../lib/layout.js'
import { demo, propsTable, uiHead } from '../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Button group',
    description:
      'Buttons that belong together, joined into one control with shared borders and rounded ends.',
    activeHref: '/ui/button-group',
    extraHead: uiHead(),
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

      h2('Links'),
      p(
        'Buttons with an ',
        code('href'),
        ' group exactly the same way — for a row of things that each go somewhere, none of which is the one you are on.',
      ),
      demo(`buttonGroup({ label: 'Share' },
  button({ href: '#rss', variant: 'outline', color: 'neutral' }, 'RSS'),
  button({ href: '#json', variant: 'outline', color: 'neutral' }, 'JSON'),
  button({ href: '#sitemap', variant: 'outline', color: 'neutral' }, 'Sitemap'),
)`),

      h2('Button group or toggle group?'),
      p(
        'A button group is a container: it joins whatever you put in it and holds no state. If one of the items is ',
        strong('selected'),
        ' — a segmented control, a filter, the section you are currently in — that is ',
        a({ href: '/ui/toggle-group' }, 'toggle group'),
        ', which builds the items from data and marks the active one for you.',
      ),
      p(
        'The rule of thumb: if pressing one makes the others wrong, it is a toggle group. If each does its own separate thing, it is a button group.',
      ),
      demo(`stack({ gap: 'lg' },
  stack({ gap: 'xs' },
    text({ variant: 'caption', tone: 'muted' }, 'buttonGroup — three separate actions'),
    buttonGroup({ label: 'Row actions' },
      button({ variant: 'outline', color: 'neutral' }, 'Edit'),
      button({ variant: 'outline', color: 'neutral' }, 'Duplicate'),
      button({ variant: 'outline', color: 'neutral' }, 'Delete'),
    ),
  ),
  stack({ gap: 'xs' },
    text({ variant: 'caption', tone: 'muted' }, 'toggleGroup — one choice out of three'),
    toggleGroup({
      label: 'Text alignment',
      value: 'Center',
      items: ['Left', 'Center', 'Right'],
    }),
  ),
)`, { align: 'start' }),

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
