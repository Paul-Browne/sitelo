import { h2, p } from 'javascript-to-html'
import { code } from '../lib/code.js'
import { uiLayout } from '../lib/layout.js'
import { demo, propsTable, uiHead } from '../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Skeleton',
    description:
      'A placeholder in the shape of the content that has not arrived yet.',
    activeHref: '/ui/skeleton',
    extraHead: uiHead(),
    children: [
      p(
        'A skeleton stands in for content while it loads. On a static site that is rarer than in an app — the HTML is already there — but it is what an island’s ',
        code('fallback'),
        ' should usually be, and what a client-rendered region shows before its data lands.',
      ),
      p(
        'Skeletons are decorative: each one is ',
        code('aria-hidden'),
        ', so a screen reader is not read a list of empty boxes.',
      ),

      h2('Shapes'),
      demo(`stack({ gap: 'md' },
  skeleton({ height: '2.5rem' }),
  skeleton({ variant: 'text', width: '70%' }),
  skeleton({ variant: 'circle', width: '3rem', height: '3rem' }),
)`, { align: 'stretch' }),

      h2('Text'),
      p(
        code('lines'),
        ' renders a paragraph’s worth, with the last line short so it reads as prose rather than a block.',
      ),
      demo(`stack({ gap: 'lg' },
  skeleton({ lines: 2 }),
  skeleton({ lines: 4 }),
)`, { align: 'stretch' }),

      h2('In the shape of the real thing'),
      p(
        'A skeleton is most convincing when it matches the layout it replaces — same card, same rows, same sizes.',
      ),
      demo(`grid({ min: '14rem' },
  card(
    cardBody(
      stack({ gap: 'md' },
        stack({ direction: 'row', gap: 'sm', align: 'center' },
          skeleton({ variant: 'circle', width: '2.5rem', height: '2.5rem' }),
          stack({ gap: 'xs', style: 'flex: 1' },
            skeleton({ variant: 'text', width: '60%' }),
            skeleton({ variant: 'text', width: '40%' }),
          ),
        ),
        skeleton({ lines: 3 }),
      ),
    ),
  ),
  card(
    cardBody(
      stack({ direction: 'row', gap: 'sm', align: 'center' },
        avatar({ name: 'Ada Lovelace' }),
        stack({ gap: 'none' },
          text({ variant: 'small' }, 'Ada Lovelace'),
          text({ variant: 'caption', tone: 'muted' }, 'Pushed 3 commits'),
        ),
      ),
    ),
  ),
)`, { align: 'stretch' }),

      h2('As an island fallback'),
      p(
        'A server island ships its fallback in the static HTML and swaps in the rendered fragment at request time. A skeleton the same shape as the fragment keeps the page from jumping when it arrives.',
      ),
      demo(`card(
  cardHeader({ title: 'Comments' }),
  cardBody(
    stack({ gap: 'md' },
      skeleton({ lines: 2 }),
      divider({ spacing: 'xs' }),
      skeleton({ lines: 2 }),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Motion'),
      p(
        'The shimmer stops for anyone who has asked their system to reduce motion — that is handled in the stylesheet, with no prop to set.',
      ),

      h2('Props'),
      propsTable([
        ['variant', "'rect' | 'text' | 'circle'", "'rect'", 'The shape of the placeholder.'],
        ['width', 'string', '', 'Any CSS width.'],
        ['height', 'string', '', 'Any CSS height.'],
        ['lines', 'number', '', 'Render this many text lines, the last one short.'],
      ]),
    ],
  })
