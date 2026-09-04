import { h2, p } from 'javascript-to-html'
import { code } from '../lib/code.js'
import { uiLayout } from '../lib/layout.js'
import { demo, propsTable, uiHead } from '../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Hero',
    description:
      'The top of a landing page: a headline, a sentence, and what to do about it.',
    activeHref: '/ui/hero',
    extraHead: uiHead(),
    children: [
      p(
        'A hero is the first thing on a marketing or documentation home page. It renders a ',
        code('<section>'),
        ' with an ',
        code('<h1>'),
        ' inside — so it is the page’s heading, not a decorative banner that happens to be large.',
      ),

      h2('Basic hero'),
      demo(`hero({
  level: 2,
  title: 'Static sites, without the framework',
  description: 'Write functions that return HTML. Get a complete site.',
},
  button({ size: 'lg' }, 'Get started'),
  button({ size: 'lg', variant: 'outline', color: 'neutral' }, 'Read the docs'),
)`, { align: 'stretch' }),

      h2('With an eyebrow'),
      p('A short line above the title — a version, a category, an announcement.'),
      demo(`hero({
  level: 2,
  eyebrow: 'sitelo 2.7',
  title: 'Now with a component library',
  description: 'Seventy components, no runtime, one optional script.',
},
  button({ size: 'lg', href: '/ui' }, 'Browse the components'),
)`, { align: 'stretch' }),

      h2('Left aligned'),
      demo(`hero({
  level: 2,
  align: 'start',
  eyebrow: 'Open source',
  title: 'Built in the open',
  description: 'MIT licensed, and small enough to read in an afternoon.',
},
  button({ href: 'https://github.com/paul-browne/sitelo' }, 'View on GitHub'),
)`, { align: 'stretch' }),

      h2('With media'),
      p(
        'Passing ',
        code('media'),
        ' switches to two columns once there is room for them, and stacks back to one on a narrow screen. It pairs naturally with ',
        code('mockup()'),
        '.',
      ),
      demo(`hero({
  level: 2,
  align: 'start',
  title: 'See it running',
  description: 'Every page is static HTML by the time it reaches the browser.',
  media: mockup({ variant: 'browser', url: 'example.com' },
    div({ style: 'padding: 1.5rem; background: var(--su-surface-2)' },
      text({ variant: 'h5', as: 'div' }, 'Hello world'),
      text({ variant: 'small', tone: 'muted' }, 'Rendered at build time.'),
    ),
  ),
},
  button('Get started'),
)`, { align: 'stretch' }),

      h2('Inside a container'),
      p(
        'A hero has no width limit of its own — put it in a ',
        code('container()'),
        ' so it lines up with everything else on the page.',
      ),
      demo(`container({ size: 'md', style: 'background: var(--su-surface-2); border-radius: 0.6rem' },
  hero({
    level: 2,
    title: 'Contained',
    description: 'The container sets the width; the hero sets the rhythm.',
  }),
)`, { align: 'stretch' }),

      h2('Heading level'),
      p(
        'The title is the page ',
        code('<h1>'),
        ' by default, which is right for a landing page. A hero used part way down a page is not the page heading, so lower it with ',
        code('level'),
        ' — every demo on this page does, since the page already has an h1 of its own.',
      ),

      h2('Just a title'),
      p('Every part is optional, and nothing empty is rendered.'),
      demo(`hero({ level: 2, title: 'Documentation' })`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['eyebrow', 'Child', '', 'Small uppercase line above the title.'],
        ['title', 'Child', '', 'Rendered as the page h1.'],
        ['description', 'Child', '', 'The sentence under it.'],
        ['media', 'Child', '', 'Beside the text on a wide screen, above it on a narrow one.'],
        ['align', "'center' | 'start'", "'center'", 'Text alignment when there is no media.'],
        ['level', 'number', '1', 'Heading level for the title. Lower it for a hero part way down a page.'],
        ['as', 'string', "'section'", 'Element to render.'],
      ]),
      p('Children become the action row under the description.'),
    ],
  })
