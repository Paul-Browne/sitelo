import { h2, p } from 'javascript-to-html'
import { code } from '../lib/code.js'
import { uiLayout } from '../lib/layout.js'
import { demo, propsTable, uiHead } from '../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Link',
    description:
      'A styled anchor, with the security attributes an external link needs.',
    activeHref: '/ui/link',
    extraHead: uiHead(),
    children: [
      p(
        'A link is an anchor with the library’s underline treatment and palette. It is exported under two names — ',
        code('link'),
        ' and ',
        code('textLink'),
        ' — because ',
        code('link'),
        ' is also javascript-to-html’s ',
        code('<link>'),
        ' element, and importing both under one name is a syntax error. Use ',
        code('textLink'),
        ', or import the library as a namespace.',
      ),

      h2('Basic link'),
      demo(`text('Read the ', link({ href: '/docs' }, 'documentation'), ' to get started.')`, {
        align: 'stretch',
      }),

      h2('Colors'),
      demo(`stack({ direction: 'row', gap: 'lg', wrap: true },
  link({ href: '#', color: 'primary' }, 'Primary'),
  link({ href: '#', color: 'neutral' }, 'Neutral'),
  link({ href: '#', color: 'success' }, 'Success'),
  link({ href: '#', color: 'warning' }, 'Warning'),
  link({ href: '#', color: 'danger' }, 'Danger'),
)`),

      h2('Subtle'),
      p(
        'A subtle link inherits the surrounding colour and shows its underline on hover — for lists of links where an underline on every row would be noise.',
      ),
      demo(`stack({ gap: 'xs' },
  link({ href: '/docs/routing', subtle: true }, 'Routing'),
  link({ href: '/docs/data', subtle: true }, 'Data loading'),
  link({ href: '/docs/assets', subtle: true }, 'Assets and styling'),
)`, { align: 'stretch' }),

      h2('External links'),
      p(
        code('external'),
        ' adds ',
        code('target="_blank"'),
        ' and the ',
        code('rel'),
        ' that has to come with it. Say in the link text that it opens a new tab, or add a visually hidden note — a new tab with no warning is disorienting.',
      ),
      demo(`text(
  'The library is on ',
  link({ href: 'https://www.npmjs.com/package/sitelo', external: true },
    'npm',
    visuallyHidden(' (opens in a new tab)'),
  ),
  '.',
)`, { align: 'stretch' }),

      h2('In a paragraph'),
      demo(`text({ variant: 'lead' },
  'sitelo is built on ',
  link({ href: 'https://vite.dev', external: true }, 'Vite'),
  ', renders with ',
  link({ href: 'https://ht.js.org', external: true }, 'javascript-to-html'),
  ', and ships nothing to the browser unless you ask it to.',
)`, { align: 'stretch' }),

      h2('When to use a button instead'),
      p(
        'A link navigates; a button performs an action. If the thing changes state on the page rather than taking the reader somewhere, it should be a ',
        code('button()'),
        ' — and if it navigates but should look like a button, give ',
        code('button()'),
        ' an ',
        code('href'),
        ', which renders an anchor underneath.',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center', wrap: true },
  link({ href: '/docs' }, 'A link that navigates'),
  button({ href: '/docs', variant: 'outline' }, 'A link that looks like a button'),
  button({ variant: 'link' }, 'A button that looks like a link'),
)`),

      h2('Props'),
      propsTable([
        ['href', 'string', '', 'Where it goes.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Which palette to draw from.'],
        ['subtle', 'boolean', 'false', 'Inherit the surrounding colour; underline on hover only.'],
        ['external', 'boolean', 'false', 'Adds target="_blank" and rel="noopener noreferrer".'],
      ]),
    ],
  })
