import { h2, p } from 'javascript-to-html'
import { code } from '../lib/code.js'
import { uiLayout } from '../lib/layout.js'
import { demo, propsTable, uiHead } from '../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Collapsible',
    description:
      'One "show more", without the borders and grouping of an accordion.',
    activeHref: '/ui/collapsible',
    extraHead: uiHead(),
    children: [
      p(
        'A collapsible is a single ',
        code('<details>'),
        ' — the same element an accordion is built from, with none of its chrome. Use it for one optional detail in the middle of a page; use ',
        code('accordion()'),
        ' when there is a set of them.',
      ),
      p(
        'It needs no script, and because the content stays in the document it is findable with the browser’s own find-in-page and by a search engine.',
      ),

      h2('Basic collapsible'),
      demo(`collapsible({ trigger: 'Show the generated config' },
  text({ variant: 'small' }, 'Everything sitelo writes when you run the build with no config file of your own.'),
)`, { align: 'stretch' }),

      h2('Open by default'),
      demo(`collapsible({ trigger: 'Why this exists', open: true },
  text({ variant: 'small' }, 'Because a page that hides its explanation behind a click is a page nobody reads.'),
)`, { align: 'stretch' }),

      h2('Rich content'),
      demo(`collapsible({ trigger: 'Show the full output' },
  stack({ gap: 'sm' },
    code('dist/index.html'),
    code('dist/404.html'),
    code('dist/sitemap.xml'),
  ),
)`, { align: 'stretch' }),

      h2('Inside other things'),
      p('A collapsible sits happily inside a card, an alert or a table cell.'),
      demo(`stack({ gap: 'md' },
  card(
    cardHeader({ title: 'Build failed', subtitle: '2 broken links' }),
    cardBody(
      collapsible({ trigger: 'Show the failing links' },
        list({ plain: true },
          listItem({ title: '/docs/old-routing', description: 'linked from /docs' }),
          listItem({ title: '/blog/draft', description: 'linked from /blog' }),
        ),
      ),
    ),
  ),
  alert({ color: 'warning', title: 'Slow page' },
    stack({ gap: 'sm' },
      text({ variant: 'small' }, 'One page took over 500 ms to render.'),
      collapsible({ trigger: 'Show timings' },
        text({ variant: 'small' }, '/examples/wordpress — 512 ms'),
      ),
    ),
  ),
)`, { align: 'stretch' }),

      h2('The trigger'),
      p(
        'Keep it to text and icons. A ',
        code('<summary>'),
        ' is already interactive, so a button or a link inside one nests two controls where there is a single action — the same rule ',
        code('menu()'),
        ' follows.',
      ),

      h2('Collapsible or accordion?'),
      p(
        'One disclosure on its own: ',
        code('collapsible()'),
        '. A set of them, bordered and grouped, optionally with only one open at a time: ',
        code('accordion()'),
        '.',
      ),

      h2('Props'),
      propsTable([
        ['trigger', 'Child', '', 'The summary content. Text and icons only.'],
        ['open', 'boolean', 'false', 'Whether it starts expanded.'],
      ]),
    ],
  })
