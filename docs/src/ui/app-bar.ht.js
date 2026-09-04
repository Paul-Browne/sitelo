import { h2, p } from 'javascript-to-html'
import { code } from '../lib/code.js'
import { uiLayout } from '../lib/layout.js'
import { demo, propsTable, uiHead } from '../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'App bar',
    description:
      'The bar across the top of a site: brand on one side, navigation and actions on the other.',
    activeHref: '/ui/app-bar',
    extraHead: uiHead(),
    children: [
      p(
        'An app bar is a ',
        code('<header>'),
        ' with a row inside it. The pieces are separate so you can arrange them: ',
        code('appBarNav()'),
        ' for links, ',
        code('appBarSpacer()'),
        ' to push what follows to the far end, and ',
        code('appBarActions()'),
        ' for the buttons at the end.',
      ),

      h2('Basic app bar'),
      demo(`appBar({ brand: 'sitelo' },
  appBarSpacer(),
  appBarActions(
    button({ size: 'sm', variant: 'soft' }, 'Sign in'),
  ),
)`, { align: 'stretch' }),

      h2('With navigation'),
      p(
        code('navLink()'),
        ' is the link style for a bar; ',
        code('current'),
        ' marks the active page with ',
        code('aria-current'),
        ' as well as colour.',
      ),
      demo(`appBar({ brand: 'sitelo' },
  appBarNav(
    navLink({ href: '#docs', current: true }, 'Docs'),
    navLink({ href: '#ui' }, 'UI'),
    navLink({ href: '#examples' }, 'Examples'),
  ),
  appBarSpacer(),
  appBarActions(
    button({ size: 'sm', variant: 'outline', color: 'neutral' }, 'GitHub'),
    button({ size: 'sm' }, 'Get started'),
  ),
)`, { align: 'stretch' }),

      h2('A brand with a mark'),
      p(
        'The brand takes any markup, and links to ',
        code('/'),
        ' unless ',
        code('href'),
        ' says otherwise.',
      ),
      demo(`appBar({
  href: '#home',
  brand: stack({ direction: 'row', gap: 'sm', inline: true, align: 'center' },
    avatar({ name: 'S', size: 'sm', square: true, color: 'primary' }),
    'sitelo',
  ),
},
  appBarSpacer(),
  appBarActions(chip({ size: 'sm', color: 'neutral' }, 'v2.6.3')),
)`, { align: 'stretch' }),

      h2('Sticky and blurred'),
      p(
        code('sticky'),
        ' pins the bar to the top of the scroll container; ',
        code('blur'),
        ' makes it translucent so content passes under it. Both are shown here inside a scrolling box rather than on the page itself.',
      ),
      demo(`div({ style: 'height: 12rem; overflow: auto; border: 1px solid var(--su-border); border-radius: 0.6rem' },
  appBar({ brand: 'sitelo', sticky: true, blur: true },
    appBarSpacer(),
    appBarActions(chip({ size: 'sm', color: 'primary' }, 'sticky')),
  ),
  container({ size: 'sm', style: 'padding-block: 1rem' },
    stack({ gap: 'md' },
      ...Array.from({ length: 6 }, (unused, index) =>
        text({ variant: 'small', tone: 'muted' }, 'Scroll me — paragraph ' + (index + 1) + '.'),
      ),
    ),
  ),
)`, { align: 'stretch' }),

      h2('With a drawer on small screens'),
      p(
        'The usual pattern: links in the bar on desktop, a button that opens a ',
        code('drawer()'),
        ' on a phone. The drawer is a popover, so the button needs no script.',
      ),
      demo(`fragment(
  appBar({ brand: 'sitelo' },
    appBarSpacer(),
    appBarActions(
      themeToggle(),
      iconButton({
        label: 'Open navigation',
        variant: 'ghost',
        color: 'neutral',
        popovertarget: 'app-bar-drawer',
        icon: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h14M3 10h14M3 14h14"/></svg>',
      }),
    ),
  ),
  drawer({ id: 'app-bar-drawer', title: 'Navigation' },
    navLink({ href: '#docs' }, 'Docs'),
    navLink({ href: '#ui' }, 'UI'),
    navLink({ href: '#examples' }, 'Examples'),
  ),
)`, { align: 'stretch' }),

      h2('Props'),
      p(code('appBar()'), ':'),
      propsTable([
        ['brand', 'Child', '', 'Content of the brand link at the start.'],
        ['href', 'string', "'/'", 'Where the brand links to.'],
        ['sticky', 'boolean', 'false', 'Pins the bar to the top on scroll.'],
        ['blur', 'boolean', 'false', 'Translucent background with a backdrop blur.'],
        ['as', 'string', "'header'", 'Element to render.'],
      ]),
      p('The pieces:'),
      propsTable([
        ['appBarNav', '', '', 'A nav element holding the links.'],
        ['appBarSpacer', '', '', 'Flexible gap; everything after it goes to the far end.'],
        ['appBarActions', '', '', 'Trailing cluster of buttons.'],
        ['navLink', 'href, current, color', '', 'A link styled for the bar; current marks the active page.'],
      ], { headers: ['Piece', 'Props', 'Default', 'Description'] }),
    ],
  })
