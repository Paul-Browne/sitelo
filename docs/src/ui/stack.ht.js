import { h2, p } from 'javascript-to-html'
import { code } from '../lib/code.js'
import { uiLayout } from '../lib/layout.js'
import { demo, propsTable, uiHead } from '../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Stack',
    description:
      'A flex row or column with a spacing token for the gap — the layout primitive most pages are built from.',
    activeHref: '/ui/stack',
    extraHead: uiHead(),
    children: [
      p(
        'Stack puts space between things. It is a flex container with one job, and it is the answer to most "how do I space these out" questions — vertically by default, horizontally with ',
        code("direction: 'row'"),
        '.',
      ),
      p(
        'Gaps come from the spacing scale, so the rhythm of a page stays consistent without anyone picking pixel values.',
      ),

      h2('Basic stack'),
      demo(`stack({ gap: 'md' },
  card(cardBody('First')),
  card(cardBody('Second')),
  card(cardBody('Third')),
)`, { align: 'stretch' }),

      h2('Direction'),
      demo(`stack({ direction: 'row', gap: 'md' },
  button('One'),
  button({ variant: 'outline' }, 'Two'),
  button({ variant: 'outline' }, 'Three'),
)`),

      h2('Gap'),
      p(
        'A token name (',
        code("'xs'"),
        ' … ',
        code("'3xl'"),
        '), a number of spacing units, or a raw CSS length.',
      ),
      demo(`stack({ gap: 'lg' },
  stack({ direction: 'row', gap: 'xs' }, chip('xs'), chip('xs'), chip('xs')),
  stack({ direction: 'row', gap: 'md' }, chip('md'), chip('md'), chip('md')),
  stack({ direction: 'row', gap: 6 }, chip('6 units'), chip('6 units')),
  stack({ direction: 'row', gap: '3rem' }, chip('3rem'), chip('3rem')),
)`, { align: 'stretch' }),

      h2('Alignment'),
      p(
        code('align'),
        ' and ',
        code('justify'),
        ' take raw flexbox values, so anything CSS understands works.',
      ),
      demo(`stack({ gap: 'md' },
  stack({ direction: 'row', gap: 'sm', justify: 'space-between', style: 'background: var(--su-surface-2); padding: 0.6rem; border-radius: 0.5rem' },
    chip('start'),
    chip('end'),
  ),
  stack({ direction: 'row', gap: 'sm', justify: 'center', align: 'center', style: 'background: var(--su-surface-2); padding: 0.6rem; border-radius: 0.5rem' },
    button({ size: 'sm' }, 'Centred'),
    chip('and aligned'),
  ),
)`, { align: 'stretch' }),

      h2('Wrapping'),
      p(
        'A row of chips or buttons that might not fit needs ',
        code('wrap'),
        ' — without it they squash instead of moving to the next line.',
      ),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  ...['routing', 'data', 'islands', 'images', 'pagefind', 'lighthouse', 'sitemap', 'rss'].map(
    (name) => chip({ color: 'neutral' }, name),
  ),
)`, { align: 'stretch' }),

      h2('Inline'),
      p(
        code('inline'),
        ' makes the stack an ',
        code('inline-flex'),
        ', so it sits in a line of text rather than taking the full width.',
      ),
      demo(`text(
  'Built with ',
  stack({ direction: 'row', gap: 'xs', inline: true, align: 'center' },
    chip({ color: 'primary', size: 'sm' }, 'sitelo'),
    chip({ color: 'neutral', size: 'sm' }, 'vite'),
  ),
  ' and nothing else.',
)`, { align: 'stretch' }),

      h2('As another element'),
      demo(`stack({ as: 'nav', direction: 'row', gap: 'sm' },
  navLink({ href: '/docs' }, 'Docs'),
  navLink({ href: '/ui', current: true }, 'UI'),
  navLink({ href: '/examples' }, 'Examples'),
)`),

      h2('Props'),
      propsTable([
        ['direction', "'row' | 'column'", "'column'", 'Main axis.'],
        ['gap', 'Space', "'md'", 'Space between children.'],
        ['align', 'string', "'stretch'", 'Any align-items value.'],
        ['justify', 'string', "'flex-start'", 'Any justify-content value.'],
        ['wrap', 'boolean | string', 'false', 'true means wrap; a string is passed through as flex-wrap.'],
        ['inline', 'boolean', 'false', 'Renders as inline-flex.'],
        ['as', 'string', "'div'", 'Element to render, e.g. nav or ul.'],
      ]),
    ],
  })
