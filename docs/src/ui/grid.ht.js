import { h2, p } from 'javascript-to-html'
import { code } from '../lib/code.js'
import { uiLayout } from '../lib/layout.js'
import { demo, propsTable, uiHead } from '../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Grid',
    description:
      'A responsive grid that fits as many columns as will fit — no breakpoints, no media queries.',
    activeHref: '/ui/grid',
    extraHead: uiHead(),
    children: [
      p(
        'With no ',
        code('columns'),
        ', a grid auto-fits as many tracks of at least ',
        code('min'),
        ' as the space allows, and each one shares the leftover evenly. That is the behaviour a card list wants, and it needs no breakpoints: resize this page and the demos below reflow on their own.',
      ),

      h2('Auto-fit'),
      p('The default. Tracks are at least 16rem wide.'),
      demo(`grid(
  ...['Routing', 'Data loading', 'Assets', 'Images', 'Islands', 'Search'].map((name) =>
    card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, name))),
  ),
)`, { align: 'stretch' }),

      h2('Track width'),
      p(
        code('min'),
        ' sets how narrow a track may get before the grid drops to fewer columns. Smaller means more columns.',
      ),
      demo(`grid({ min: '9rem' },
  ...['sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'].map((name) =>
    card({ variant: 'flat' }, cardBody(text({ variant: 'small', align: 'center' }, name))),
  ),
)`, { align: 'stretch' }),

      h2('A fixed number of columns'),
      p(
        'Pass a number when the count should not change with the viewport. Each track is an equal share.',
      ),
      demo(`grid({ columns: 3 },
  ...['One', 'Two', 'Three'].map((name) =>
    card({ variant: 'flat' }, cardBody(text({ variant: 'small', align: 'center' }, name))),
  ),
)`, { align: 'stretch' }),

      h2('A custom template'),
      p(
        'A string is passed straight through as ',
        code('grid-template-columns'),
        ', for a sidebar-and-content split or anything else CSS grid can express.',
      ),
      demo(`grid({ columns: '12rem 1fr', gap: 'lg' },
  card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Sidebar'))),
  card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Content, taking the rest of the row.'))),
)`, { align: 'stretch' }),

      h2('Gap and alignment'),
      demo(`grid({ min: '10rem', gap: 'xl', align: 'center' },
  card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Short'))),
  card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'A taller card, with two lines of text in it, to show what align does to its shorter neighbours.'))),
  card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Short'))),
)`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['columns', 'number | string', '', 'A fixed track count, or a raw grid-template-columns value. Omit for auto-fit.'],
        ['min', 'string', "'16rem'", 'Minimum track width when auto-fitting.'],
        ['gap', 'Space', "'md'", 'Space between tracks and rows.'],
        ['align', 'string', "'stretch'", 'Any align-items value.'],
        ['as', 'string', "'div'", 'Element to render.'],
      ]),
      p(
        'A track never gets wider than the grid itself, even when ',
        code('min'),
        ' is larger than the space available — so a 16rem minimum does not cause a horizontal scrollbar on a 320px phone.',
      ),
    ],
  })
