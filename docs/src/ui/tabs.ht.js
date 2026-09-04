import { h2, p } from 'javascript-to-html'
import { code } from '../lib/code.js'
import { uiLayout } from '../lib/layout.js'
import { demo, propsTable, uiHead } from '../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Tabs',
    description:
      'Two shapes: links, one page per tab; or panels that swap in place.',
    activeHref: '/ui/tabs',
    extraHead: uiHead(),
    children: [
      p(
        'Give each item an ',
        code('href'),
        ' and the tabs are links — one page per tab, no script, ',
        code('aria-current'),
        ' on the active one. Give each item a ',
        code('panel'),
        ' and they become a real tablist whose panels swap in place.',
      ),
      p(
        'On a static site the link form is usually right: it gives each view a URL, and it survives JavaScript being off. Reach for panels when the content is small and switching should not cost a navigation.',
      ),

      h2('Link tabs'),
      p('No script at all. The active tab is whichever one you mark.'),
      demo(`tabs({
  items: [
    { label: 'Overview', href: '#overview', active: true },
    { label: 'Installation', href: '#installation' },
    { label: 'API', href: '#api' },
  ],
})`, { align: 'stretch' }),

      h2('Panel tabs'),
      p(
        'These need ',
        code('sitelo/ui/client'),
        ', which this page loads — click them and they really switch, arrow keys included. Without the script the panel the server marked active is simply the one that shows.',
      ),
      demo(`tabs({
  value: 'install',
  items: [
    { id: 'install', label: 'Install', panel: card({ variant: 'flat' }, cardBody(code('npm install sitelo javascript-to-html'))) },
    { id: 'use', label: 'Use', panel: card({ variant: 'flat' }, cardBody(code("import * as ui from 'sitelo/ui'"))) },
    { id: 'build', label: 'Build', panel: card({ variant: 'flat' }, cardBody(code('sitelo build'))) },
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
      p('The tab list scrolls horizontally rather than wrapping, so the row keeps its shape on a phone.'),
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
        'The panel form renders a proper ',
        code('role="tablist"'),
        ' with ',
        code('aria-selected'),
        ', ',
        code('aria-controls'),
        ' and roving ',
        code('tabindex'),
        '. The script adds arrow-key movement, Home and End. The link form is deliberately not a tablist — links that navigate are links, and giving them tab semantics would lie about what they do.',
      ),

      h2('Props'),
      propsTable([
        ['items', 'Array', '[]', 'Strings, or { id, label, href, panel, active, disabled } objects.'],
        ['value', 'string', '', 'Id of the active item. Falls back to active, then the first.'],
        ['variant', "'underline' | 'pills'", "'underline'", 'How the active tab is marked.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Colour of the active tab.'],
        ['label', 'string', "'Tabs'", 'Accessible name for the tablist. Panel form only.'],
      ]),
    ],
  })
