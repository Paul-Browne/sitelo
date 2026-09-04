import { h2, p } from 'javascript-to-html'
import { code } from '../lib/code.js'
import { uiLayout } from '../lib/layout.js'
import { demo, propsTable, uiHead } from '../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Drawer',
    description:
      'A panel that comes in from the edge — same popover mechanics as a modal, different shape.',
    activeHref: '/ui/drawer',
    extraHead: uiHead(),
    children: [
      p(
        'A drawer is a full-height panel anchored to one side. Like ',
        code('modal()'),
        ', it is a ',
        code('popover'),
        ': a button with a matching ',
        code('popovertarget'),
        ' opens it, and the browser handles the backdrop, the outside click and Escape.',
      ),
      p(
        'Its most common job on a static site is the navigation menu on a phone.',
      ),

      h2('Basic drawer'),
      demo(`fragment(
  button({ popovertarget: 'drawer-basic' }, 'Open drawer'),
  drawer({ id: 'drawer-basic', title: 'Settings' },
    stack({ gap: 'md' },
      toggle({ label: 'Pagefind search', checked: true }),
      toggle({ label: 'Image optimization', checked: true }),
      toggle({ label: 'Server islands' }),
    ),
  ),
)`),

      h2('Sides'),
      demo(`fragment(
  stack({ direction: 'row', gap: 'sm' },
    button({ variant: 'outline', color: 'neutral', popovertarget: 'drawer-start' }, 'From the start'),
    button({ variant: 'outline', color: 'neutral', popovertarget: 'drawer-end' }, 'From the end'),
  ),
  drawer({ id: 'drawer-start', side: 'start', title: 'Start' },
    text({ variant: 'small', tone: 'muted' }, 'Anchored to the leading edge — the left in a left-to-right language.'),
  ),
  drawer({ id: 'drawer-end', title: 'End' },
    text({ variant: 'small', tone: 'muted' }, 'The default: anchored to the trailing edge.'),
  ),
)`),

      h2('Width'),
      p('Any CSS length. It is capped at 90% of the viewport, so a wide drawer still fits a phone.'),
      demo(`fragment(
  stack({ direction: 'row', gap: 'sm' },
    button({ variant: 'outline', color: 'neutral', popovertarget: 'drawer-narrow' }, 'Narrow'),
    button({ variant: 'outline', color: 'neutral', popovertarget: 'drawer-wide' }, 'Wide'),
  ),
  drawer({ id: 'drawer-narrow', width: '14rem', title: 'Narrow' },
    text({ variant: 'small', tone: 'muted' }, 'width: 14rem'),
  ),
  drawer({ id: 'drawer-wide', width: '34rem', title: 'Wide' },
    text({ variant: 'small', tone: 'muted' }, 'width: 34rem'),
  ),
)`),

      h2('As a navigation menu'),
      p('The pattern most sites want: a menu button in the bar, the links in a drawer.'),
      demo(`fragment(
  appBar({ brand: 'sitelo' },
    appBarSpacer(),
    appBarActions(
      iconButton({
        label: 'Open navigation',
        variant: 'ghost',
        color: 'neutral',
        popovertarget: 'drawer-nav',
        icon: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h14M3 10h14M3 14h14"/></svg>',
      }),
    ),
  ),
  drawer({ id: 'drawer-nav', title: 'Navigation' },
    navLink({ href: '#docs', current: true }, 'Docs'),
    navLink({ href: '#ui' }, 'UI'),
    navLink({ href: '#examples' }, 'Examples'),
    navLink({ href: '#about' }, 'About'),
    divider({ spacing: 'sm' }),
    button({ block: true }, 'Get started'),
  ),
)`, { align: 'stretch' }),

      h2('A filter panel'),
      demo(`fragment(
  button({ variant: 'soft', color: 'neutral', popovertarget: 'drawer-filters' }, 'Filters'),
  drawer({ id: 'drawer-filters', title: 'Filters', width: '22rem' },
    stack({ gap: 'lg' },
      choiceGroup({
        legend: 'Type',
        name: 'drawer-type',
        value: 'guide',
        options: [
          { value: 'guide', label: 'Guides' },
          { value: 'example', label: 'Examples' },
          { value: 'all', label: 'Everything' },
        ],
      }),
      choiceGroup({
        legend: 'Tags',
        name: 'drawer-tags',
        type: 'checkbox',
        value: ['routing'],
        options: ['routing', 'data', 'islands'],
      }),
      stack({ direction: 'row', gap: 'sm' },
        button({ variant: 'ghost', color: 'neutral', popovertarget: 'drawer-filters', popovertargetaction: 'hide' }, 'Cancel'),
        button('Apply'),
      ),
    ),
  ),
)`),

      h2('Props'),
      propsTable([
        ['id', 'string', '', 'Required. What a trigger’s popovertarget points at.'],
        ['title', 'Child', '', 'Heading, and the dialog’s accessible name.'],
        ['side', "'start' | 'end'", "'end'", 'Which edge it is anchored to.'],
        ['width', 'string', "'20rem'", 'Panel width, capped at 90vw.'],
        ['closable', 'boolean', 'true', 'Show the × in the header.'],
        ['closeLabel', 'string', "'Close'", 'Accessible name for that button.'],
      ]),
    ],
  })
