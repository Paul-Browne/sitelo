import { h2, p } from 'javascript-to-html'
import { code } from '../lib/code.js'
import { uiLayout } from '../lib/layout.js'
import { demo, propsTable, uiHead } from '../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Menu',
    description:
      'A dropdown built on <details>, so it opens and closes with no script at all.',
    activeHref: '/ui/menu',
    extraHead: uiHead(),
    children: [
      p(
        'A menu is a ',
        code('<details>'),
        ' with a styled panel. That is a deliberate choice over the popover API: a popover lives in the top layer and cannot be positioned against its trigger without anchor positioning, which is not yet everywhere. A ',
        code('<details>'),
        ' positions itself correctly today and needs nothing loaded.',
      ),
      p(
        'The trigger is that ',
        code('<summary>'),
        ', styled as a button — so you pass the label and the button props to ',
        code('menu()'),
        ' rather than passing a rendered ',
        code('button()'),
        '. A summary is already interactive, and a button inside one nests two controls where there is a single action: invalid markup, and two tab stops for one thing.',
      ),
      p(
        'Close-on-outside-click and Escape come from an ',
        code('ontoggle'),
        ' handler that imports them the first time a menu is opened — and only then. If that module never arrives, a menu still opens and closes from its own summary.',
      ),

      h2('Basic menu'),
      demo(`menu({ trigger: 'Actions' },
  menuItem({ href: '#edit' }, 'Edit'),
  menuItem({ href: '#duplicate' }, 'Duplicate'),
  menuSeparator(),
  menuItem({ href: '#delete' }, 'Delete'),
)`),

      h2('Alignment'),
      p(
        'A menu opens from the start edge of its trigger. ',
        code("align: 'end'"),
        ' flips it, which is what a menu near the right edge of a bar needs.',
      ),
      demo(`stack({ direction: 'row', gap: 'xl', justify: 'space-between', style: 'width: 100%' },
  menu({ trigger: 'Start-aligned', variant: 'soft' },
    menuItem({ href: '#a' }, 'First'),
    menuItem({ href: '#b' }, 'Second'),
  ),
  menu({ trigger: 'End-aligned', variant: 'soft', align: 'end' },
    menuItem({ href: '#c' }, 'First'),
    menuItem({ href: '#d' }, 'Second'),
  ),
)`, { align: 'stretch' }),

      h2('Icon triggers'),
      p(
        'An icon with no ',
        code('trigger'),
        ' text needs a ',
        code('label'),
        ' — it becomes the accessible name the icon cannot provide.',
      ),
      demo(`stack({ direction: 'row', gap: 'md' },
  menu({
    align: 'end',
    label: 'More actions',
    variant: 'ghost',
    icon: icon('more-horizontal'),
  },
    menuItem({ href: '#rename' }, 'Rename'),
    menuItem({ href: '#move' }, 'Move'),
    menuSeparator(),
    menuItem({ href: '#archive' }, 'Archive'),
  ),
)`),

      h2('Items with icons'),
      demo(`menu({ trigger: 'File' },
  menuItem({
    href: '#new',
    icon: icon('plus'),
  }, 'New page'),
  menuItem({
    href: '#open',
    icon: icon('folder'),
  }, 'Open…'),
  menuSeparator(),
  menuItem({
    href: '#build',
    icon: icon('zap'),
  }, 'Build site'),
)`),

      h2('Buttons instead of links'),
      p(
        'An item with no ',
        code('href'),
        ' renders a ',
        code('<button>'),
        ' — for an action that happens on the page rather than a navigation.',
      ),
      demo(`menu({ trigger: 'Export', variant: 'soft', color: 'primary' },
  menuItem({ onclick: "window.siteloUiToast && window.siteloUiToast('Exported as JSON.', 'success')" }, 'As JSON'),
  menuItem({ onclick: "window.siteloUiToast && window.siteloUiToast('Exported as CSV.', 'success')" }, 'As CSV'),
)`),

      h2('In an app bar'),
      demo(`appBar({ brand: 'sitelo' },
  appBarSpacer(),
  appBarActions(
    themeToggle(),
    menu({
      align: 'end',
      label: 'More',
      variant: 'ghost',
      icon: icon('more-horizontal'),
    },
      menuItem({ href: '/docs' }, 'Docs'),
      menuItem({ href: '/examples' }, 'Examples'),
      menuSeparator(),
      menuItem({ href: 'https://github.com/paul-browne/sitelo' }, 'GitHub'),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Accessibility'),
      p(
        'The panel is a ',
        code('role="menu"'),
        ' whose items are ',
        code('role="menuitem"'),
        ', and the summary carries ',
        code('aria-haspopup'),
        '. A ',
        code('<details>'),
        ' is not a native menu widget, so this is a reasonable approximation rather than a perfect one — for a plain list of links, a ',
        code('nav'),
        ' inside the details is just as valid and claims less.',
      ),

      h2('Props'),
      p(code('menu()'), ' — the trigger props are the button ones:'),
      propsTable([
        ['trigger', 'Child', '', 'Visible label. Pass text, not a rendered button().'],
        ['icon', 'Child', '', 'Markup before the label, or on its own for an icon-only trigger.'],
        ['label', 'string', '', 'Accessible name. Required when there is an icon and no trigger text.'],
        ['variant', "'solid' | 'soft' | 'outline' | 'ghost' | 'link'", "'outline'", 'Trigger styling.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'neutral'", 'Which palette the trigger draws from.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Trigger size.'],
        ['align', "'start' | 'end'", "'start'", 'Which edge of the trigger the panel lines up with.'],
        ['triggerClass', 'string', '', 'Extra classes for the trigger rather than the wrapping details.'],
      ]),
      p(code('menuItem()'), ':'),
      propsTable([
        ['href', 'string', '', 'Renders an anchor; without it, a button.'],
        ['icon', 'Child', '', 'Markup before the label.'],
        ['as', 'string', "'button'", 'Element to render when there is no href.'],
      ]),
      p(code('menuSeparator()'), ' takes no props — it is the hairline between groups of items.'),
    ],
  })
