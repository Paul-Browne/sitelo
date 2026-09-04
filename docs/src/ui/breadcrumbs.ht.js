import { h2, p } from 'javascript-to-html'
import { code } from '../lib/code.js'
import { uiLayout } from '../lib/layout.js'
import { demo, propsTable, uiHead } from '../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Breadcrumbs',
    description:
      'The trail of ancestors ending at the page you are on.',
    activeHref: '/ui/breadcrumbs',
    extraHead: uiHead(),
    children: [
      p(
        'Breadcrumbs say where a page sits. The last item is the current page: it is rendered as plain text and marked ',
        code('aria-current="page"'),
        ', because a link to the page you are already on is noise.',
      ),

      h2('Basic breadcrumbs'),
      demo(`breadcrumbs({
  items: [
    { label: 'Home', href: '/' },
    { label: 'Docs', href: '/docs' },
    { label: 'Routing' },
  ],
})`, { align: 'stretch' }),

      h2('Separator'),
      p('Any string or markup. The separators are hidden from screen readers either way.'),
      demo(`stack({ gap: 'md' },
  breadcrumbs({
    separator: '/',
    items: [{ label: 'Home', href: '/' }, { label: 'UI', href: '/ui' }, { label: 'Breadcrumbs' }],
  }),
  breadcrumbs({
    separator: '›',
    items: [{ label: 'Home', href: '/' }, { label: 'UI', href: '/ui' }, { label: 'Breadcrumbs' }],
  }),
  breadcrumbs({
    separator: '·',
    items: [{ label: 'Home', href: '/' }, { label: 'UI', href: '/ui' }, { label: 'Breadcrumbs' }],
  }),
)`, { align: 'stretch' }),

      h2('Plain strings'),
      p('An item with no href is just text, wherever it appears — not only at the end.'),
      demo(`breadcrumbs({
  items: ['Home', 'Archive', '2026', 'March'],
})`, { align: 'stretch' }),

      h2('From a path'),
      p(
        'On a static site the trail is usually derived from the route, not hand-written.',
      ),
      demo(`return (() => {
  const path = '/docs/guides/routing'
  const segments = path.split('/').filter(Boolean)

  return breadcrumbs({
    items: [
      { label: 'Home', href: '/' },
      ...segments.map((segment, index) => ({
        label: segment.replace(/-/g, ' '),
        href: index === segments.length - 1 ? undefined : '/' + segments.slice(0, index + 1).join('/'),
      })),
    ],
  })
})()`, { align: 'stretch' }),

      h2('Labelling the nav'),
      p(
        'The whole thing is a ',
        code('<nav>'),
        ' with an accessible name, so a screen reader can jump to it. Change the name with ',
        code('label'),
        ' when a page has more than one navigation landmark.',
      ),
      demo(`breadcrumbs({
  label: 'Documentation breadcrumb',
  items: [{ label: 'Docs', href: '/docs' }, { label: 'Components' }],
})`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['items', 'Array', '[]', 'Strings, or { label, href } objects. The last one is the current page.'],
        ['separator', 'Child', "'/'", 'Drawn between items, hidden from screen readers.'],
        ['label', 'string', "'Breadcrumb'", 'Accessible name for the nav landmark.'],
      ]),
    ],
  })
