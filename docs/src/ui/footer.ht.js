import { h2, p } from 'javascript-to-html'
import { code } from '../lib/code.js'
import { uiLayout } from '../lib/layout.js'
import { demo, propsTable, uiHead } from '../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Footer',
    description:
      'The bottom of a site: columns of links, and a line under them.',
    activeHref: '/ui/footer',
    extraHead: uiHead(),
    children: [
      p(
        'A footer is a grid of columns that auto-fits, plus an optional bottom line that always spans the full width however many columns there are.',
      ),
      p(
        'It is exported as both ',
        code('footer'),
        ' and ',
        code('siteFooter'),
        ', because ',
        code('footer'),
        ' is also javascript-to-html’s ',
        code('<footer>'),
        ' element and importing both under one name is a syntax error.',
      ),

      h2('Basic footer'),
      demo(`footer(
  footerColumn({ title: 'Docs' },
    '<a href="/docs">Getting started</a>',
    '<a href="/docs/routing">Routing</a>',
    '<a href="/docs/data">Data loading</a>',
  ),
  footerColumn({ title: 'Components' },
    '<a href="/ui">Overview</a>',
    '<a href="/ui/button">Button</a>',
    '<a href="/ui/card">Card</a>',
  ),
  footerColumn({ title: 'Project' },
    '<a href="https://github.com/paul-browne/sitelo">GitHub</a>',
    '<a href="https://www.npmjs.com/package/sitelo">npm</a>',
  ),
)`, { align: 'stretch' }),

      h2('With a bottom line'),
      p(
        code('footerBottom()'),
        ' spans every column, so it stays a full-width row whatever the grid above it is doing.',
      ),
      demo(`footer(
  footerColumn({ title: 'Docs' }, '<a href="/docs">Guide</a>', '<a href="/ui">Components</a>'),
  footerColumn({ title: 'Examples' }, '<a href="/examples">All examples</a>'),
  footerBottom(
    text({ variant: 'caption' }, '© 2026 Paul Browne · MIT'),
    stack({ direction: 'row', gap: 'sm' },
      chip({ size: 'sm', color: 'neutral' }, 'v2.7'),
      chip({ size: 'sm', color: 'success', dot: true }, 'Build passing'),
    ),
  ),
)`, { align: 'stretch' }),

      h2('A brand column'),
      p(
        'A column does not have to be links. Anything you pass as children of ',
        code('footer()'),
        ' rather than of a column sits in the grid as its own cell.',
      ),
      demo(`footer(
  div(
    stack({ gap: 'sm' },
      text({ variant: 'h5', as: 'div' }, 'sitelo'),
      text({ variant: 'small', tone: 'muted' }, 'Zero-config static site generation, powered by Vite.'),
    ),
  ),
  footerColumn({ title: 'Docs' }, '<a href="/docs">Guide</a>', '<a href="/ui">Components</a>'),
  footerColumn({ title: 'Project' }, '<a href="#">GitHub</a>', '<a href="#">npm</a>'),
)`, { align: 'stretch' }),

      h2('Fixed columns'),
      p(
        'By default the columns auto-fit. ',
        code('columns'),
        ' takes any ',
        code('grid-template-columns'),
        ' value when you want a specific shape — a wide brand column and two narrow link columns, say.',
      ),
      demo(`footer({ columns: '2fr 1fr 1fr' },
  div(text({ variant: 'small', tone: 'muted' }, 'A wider first column for the brand and a sentence about it.')),
  footerColumn({ title: 'Docs' }, '<a href="/docs">Guide</a>'),
  footerColumn({ title: 'More' }, '<a href="/examples">Examples</a>'),
)`, { align: 'stretch' }),

      h2('Bottom line only'),
      demo(`footer(
  footerBottom(text({ variant: 'caption' }, '© 2026 · Built with sitelo')),
)`, { align: 'stretch' }),

      h2('Props'),
      p(code('footer()'), ':'),
      propsTable([
        ['columns', 'string', '', 'A grid-template-columns value. Auto-fits when omitted.'],
        ['as', 'string', "'footer'", 'Element to render.'],
      ]),
      propsTable([
        ['footerColumn', 'title', '', 'A titled column; children become a list of links.'],
        ['footerBottom', '', '', 'Full-width row under the columns.'],
      ], { headers: ['Part', 'Props', 'Default', 'Description'] }),
    ],
  })
