import { h2, p } from 'javascript-to-html'
import { code } from '../lib/code.js'
import { uiLayout } from '../lib/layout.js'
import { demo, propsTable, uiHead } from '../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Card',
    description:
      'A surface for grouped content, with a header, body, footer and media that all know how to sit together.',
    activeHref: '/ui/card',
    extraHead: uiHead(),
    children: [
      p(
        'A card groups related content on its own surface. The parts — ',
        code('cardHeader()'),
        ', ',
        code('cardMedia()'),
        ', ',
        code('cardBody()'),
        ', ',
        code('cardFooter()'),
        ' — are separate functions rather than props, so you use only the ones you need and put them in whatever order the design wants.',
      ),

      h2('Basic card'),
      demo(`card(
  cardHeader({ title: 'File-based routing', subtitle: 'src/about.ht.js → /about' }),
  cardBody(text({ variant: 'small', tone: 'muted' }, 'Folders become paths. Brackets become parameters. There is no router to configure.')),
)`, { align: 'stretch' }),

      h2('Variants'),
      p(
        'Outlined is the default. Elevated trades the border for a shadow, and flat tints the surface instead of either.',
      ),
      demo(`grid({ min: '13rem' },
  card({ variant: 'outlined' }, cardBody(text({ variant: 'small' }, 'Outlined'))),
  card({ variant: 'elevated' }, cardBody(text({ variant: 'small' }, 'Elevated'))),
  card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Flat'))),
)`, { align: 'stretch' }),

      h2('With a footer'),
      p(
        code('divided'),
        ' adds the hairline above the footer. The footer is pushed to the bottom, so cards in a row line their actions up even when the text above is different lengths.',
      ),
      demo(`grid({ min: '14rem' },
  card(
    cardHeader({ title: 'Basic site' }),
    cardBody(text({ variant: 'small', tone: 'muted' }, 'A minimal project plus deploy configs.')),
    cardFooter({ divided: true }, button({ size: 'sm', variant: 'soft' }, 'Open')),
  ),
  card(
    cardHeader({ title: 'Markdown blog' }),
    cardBody(text({ variant: 'small', tone: 'muted' }, 'A folder of .md files rendered to static pages, with an RSS feed and no client JavaScript at all.')),
    cardFooter({ divided: true }, button({ size: 'sm', variant: 'soft' }, 'Open')),
  ),
)`, { align: 'stretch' }),

      h2('Media'),
      p(
        code('cardMedia()'),
        ' fills the top of the card at a fixed aspect ratio, so a row of cards stays even whatever the source images measure.',
      ),
      demo(`grid({ min: '13rem' },
  card(
    cardMedia({ src: '/logo.svg', alt: '', style: 'background: var(--su-surface-2); object-fit: contain; padding: 1rem' }),
    cardBody(text({ variant: 'small' }, 'Default 16 / 9')),
  ),
  card(
    cardMedia({ src: '/logo.svg', alt: '', ratio: '4 / 3', style: 'background: var(--su-surface-2); object-fit: contain; padding: 1rem' }),
    cardBody(text({ variant: 'small' }, 'ratio: 4 / 3')),
  ),
)`, { align: 'stretch' }),

      h2('A whole card as a link'),
      p(
        'Give the card an ',
        code('href'),
        ' and the whole surface becomes one link, with the hover lift that goes with it. Do not put buttons or other links inside a card in this form — interactive content cannot nest inside a link. Use a footer button on a plain card instead.',
      ),
      demo(`grid({ min: '14rem' },
  card({ href: '/docs/routing' },
    cardHeader({ title: 'Routing', subtitle: 'Read the guide' }),
    cardBody(text({ variant: 'small', tone: 'muted' }, 'Dynamic routes, catch-alls and route groups.')),
  ),
  card({ href: '/docs/data' },
    cardHeader({ title: 'Data loading', subtitle: 'Read the guide' }),
    cardBody(text({ variant: 'small', tone: 'muted' }, 'data() runs at build time, with fetch caching.')),
  ),
)`, { align: 'stretch' }),

      h2('Padding'),
      p(
        'One prop sets the padding for every part of the card at once.',
      ),
      demo(`stack({ gap: 'md' },
  card({ padding: 'sm' }, cardBody(text({ variant: 'small' }, 'padding: sm'))),
  card({ padding: 'xl' }, cardBody(text({ variant: 'small' }, 'padding: xl'))),
)`, { align: 'stretch' }),

      h2('Free-form contents'),
      p(
        'The parts are a convenience, not a requirement — a card takes any children, and ',
        code('cardHeader()'),
        ' accepts children of its own alongside the title, for an avatar or a menu button on the right.',
      ),
      demo(`card(
  cardHeader(
    { title: 'Paul Browne', subtitle: 'Deployed 4 minutes ago' },
    avatar({ name: 'Paul Browne', size: 'sm' }),
  ),
  cardBody(
    stack({ direction: 'row', gap: 'sm', wrap: true },
      chip({ color: 'success', dot: true }, 'Build passed'),
      chip({ color: 'neutral' }, '12 pages'),
      chip({ color: 'neutral' }, '4.1 kB'),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Props'),
      p(code('card()'), ':'),
      propsTable([
        ['variant', "'outlined' | 'elevated' | 'flat'", "'outlined'", 'How the surface is separated from the page.'],
        ['href', 'string', '', 'Renders the whole card as a link.'],
        ['padding', 'Space', "'lg'", 'Padding used by every part of the card.'],
      ]),
      p('The parts:'),
      propsTable([
        ['cardHeader', 'title, subtitle', '', 'Title and subtitle, plus any children alongside them.'],
        ['cardTitle', 'as', "'h3'", 'The title on its own, when the header is hand-built.'],
        ['cardSubtitle', '', '', 'The muted line under a title.'],
        ['cardMedia', 'src, alt, ratio', "'16 / 9'", 'A cover image at a fixed aspect ratio.'],
        ['cardBody', '', '', 'The main content region.'],
        ['cardFooter', 'divided', 'false', 'Bottom row of actions; divided adds the hairline above it.'],
      ], { headers: ['Part', 'Props', 'Default', 'Description'] }),
    ],
  })
