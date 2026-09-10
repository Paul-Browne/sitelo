import { h2, p } from 'javascript-to-html'
import { code } from '../lib/code.js'
import { uiLayout } from '../lib/layout.js'
import { demo, propsTable } from '../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Tabs',
    description:
      'Three shapes: links, one page per tab; panels that swap in place; or panels the URL drives.',
    activeHref: '/ui/tabs',
    children: [
      p(
        'Give each item an ',
        code('href'),
        ' and the tabs are links — one page per tab, no script, ',
        code('aria-current'),
        ' on the active one. Give each item a ',
        code('panel'),
        ' and they become a radio group whose panels swap in place, still with no script.',
      ),
      p(
        'On a static site the link form is usually right: it gives each view a URL, and it survives JavaScript being off. Reach for panels when the content is small and switching should not cost a navigation.',
      ),

      h2('Link tabs'),
      p(
        'These really are links — click one and it navigates. The underline comes from ',
        code('active'),
        ' or ',
        code('value'),
        ' at build time, not from the click, so each page marks its own tab. Nothing about a link tab reacts to the URL on its own: for that, switch in place with panels below.',
      ),
      demo(`tabs({
  items: [
    { label: 'Breadcrumbs', href: '/ui/breadcrumbs' },
    { label: 'Tabs', href: '/ui/tabs', active: true },
    { label: 'Pagination', href: '/ui/pagination' },
  ],
})`, { align: 'stretch' }),

      h2('Panel tabs'),
      p(
        'The tab is a ',
        code('<label>'),
        ' for a radio the stylesheet keeps out of sight, and the panel that follows the checked radio is the one CSS shows. Nothing is imported on this page: switching, and the arrow keys that move between the tabs, are things a radio group already does.',
      ),
      demo(`tabs({
  value: 'install',
  items: [
    { id: 'install', label: 'Install', panel: card({ variant: 'flat' }, cardBody(code('npm install sitelo javascript-to-html'))) },
    { id: 'use', label: 'Use', panel: card({ variant: 'flat' }, cardBody(code("import * as ui from 'sitelo/ui'"))) },
    { id: 'build', label: 'Build', panel: card({ variant: 'flat' }, cardBody(code('sitelo build'))) },
  ],
})`, { align: 'stretch' }),

      h2('Deep-linkable tabs'),
      p(
        'Give the panelled items a fragment ',
        code('href'),
        ' as well and the radios give way to links: the URL names the tab, ',
        code(':target'),
        ' picks it out, the panel that follows it shows, and the choice survives a reload, a shared link and the back button. The id is on the tab and not on the panel because the browser scrolls whatever the URL names to the top of the window — naming the panel would scroll the tabs off the screen you just clicked them on. Only one element in a document can be ',
        code(':target'),
        ', so this form is for one set of tabs on a page. The scroll itself cannot be called off: following a fragment moves the window by definition. All a page can do is choose what gets scrolled to and where it lands, which is what the id on the tab and its ',
        code('scroll-margin-block-start'),
        ' are for — set it with the ',
        code('scrollMargin'),
        ' prop, and give a sticky header at least its own height.',
      ),
      demo(`tabs({
  items: [
    { id: 'setup', label: 'Setup', href: '#tab-setup', panel: card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'This panel is #tab-setup — copy the URL and it comes back.'))) },
    { id: 'deploy', label: 'Deploy', href: '#tab-deploy', panel: card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'And this one is #tab-deploy.'))) },
  ],
})`, { align: 'stretch' }),

      h2('Pills'),
      demo(`stack({ gap: 'lg' },
  tabs({
    variant: 'pills',
    items: [
      { label: 'All', href: '#all', active: true },
      { label: 'Guides', href: '#guides' },
      { label: 'Examples', href: '#examples' },
    ],
  }),
  tabs({
    variant: 'pills',
    value: 'js',
    items: [
      { id: 'js', label: 'JavaScript', panel: card({ variant: 'flat' }, cardBody(code('src/index.ht.js'))) },
      { id: 'ts', label: 'TypeScript', panel: card({ variant: 'flat' }, cardBody(code('src/index.ht.ts'))) },
      { id: 'jsx', label: 'JSX', panel: card({ variant: 'flat' }, cardBody(code('src/index.ht.jsx'))) },
    ],
  }),
)`, { align: 'stretch' }),

      h2('Colors'),
      demo(`stack({ gap: 'lg' },
  tabs({ color: 'primary', items: [{ label: 'Primary', href: '#p', active: true }, { label: 'Other', href: '#p2' }] }),
  tabs({ color: 'neutral', items: [{ label: 'Neutral', href: '#n', active: true }, { label: 'Other', href: '#n2' }] }),
  tabs({ color: 'danger', items: [{ label: 'Danger', href: '#d', active: true }, { label: 'Other', href: '#d2' }] }),
)`, { align: 'stretch' }),

      h2('Many tabs'),
      p('The tab list scrolls horizontally rather than wrapping, so the row keeps its shape on a phone. Panel tabs wrap instead — each panel has to follow its own tab, which leaves no row element to scroll.'),
      demo(`tabs({
  items: [
    'Overview', 'Routing', 'Data', 'Assets', 'Images', 'Islands', 'TypeScript', 'CLI', 'Deployment',
  ].map((label, index) => ({ label, href: '#many-' + index, active: index === 0 })),
})`, { align: 'stretch' }),

      h2('Disabled'),
      demo(`tabs({
  value: 'now',
  items: [
    { id: 'now', label: 'Available', panel: card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'This one works.'))) },
    { id: 'soon', label: 'Coming soon', disabled: true, panel: card({ variant: 'flat' }, cardBody('')) },
  ],
})`, { align: 'stretch' }),

      h2('Accessibility'),
      p(
        'The panel form is a real radio group: the tabs are ',
        code('<label>'),
        ' elements for radios sharing a ',
        code('name'),
        ', so a screen reader announces which of how many is chosen, and arrow keys, Home and End work with nothing loaded. The deep-linkable form is plain links instead, and carries no ',
        code('aria-current'),
        ' — it would be written once and be wrong after the first click. It is deliberately not an ARIA tablist — ',
        code('aria-selected'),
        ' is written once, on the server, and CSS cannot keep it true as you click. The link form is not a tablist either: links that navigate are links, and giving them tab semantics would lie about what they do.',
      ),

      h2('Props'),
      propsTable([
        ['items', 'Array', '[]', 'Strings, or { id, label, href, panel, active, disabled } objects.'],
        ['value', 'string', '', 'Id of the active item. Falls back to active, then the first.'],
        ['variant', "'underline' | 'pills'", "'underline'", 'How the active tab is marked.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Colour of the active tab.'],
        ['label', 'string', "'Tabs'", 'Accessible name for the group. Panel form only.'],
        ['name', 'string', "first item's id", 'The radio group name. Only two sets of panel tabs on one page need it.'],
        ['href', 'string', '', 'On an item: a page to link to, or — alongside panel — the fragment that names it.'],
        ['scrollMargin', 'Space', "'lg'", 'How far above the tab the window stops. :target form only.'],
      ]),
    ],
  })
