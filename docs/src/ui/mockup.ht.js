import { h2, p } from 'javascript-to-html'
import { code } from '../lib/code.js'
import { uiLayout } from '../lib/layout.js'
import { demo, propsTable } from '../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Mockup',
    description:
      'A screenshot in a frame — browser, window, phone or terminal.',
    activeHref: '/ui/mockup',
    children: [
      p(
        'For showing a product on a landing page or a screenshot in documentation. The frame is decoration: the dots, the address bar and the notch are all ',
        code('aria-hidden'),
        ', so a screen reader gets what is inside and not a description of chrome.',
      ),

      h2('Browser'),
      demo(`mockup({ variant: 'browser', url: 'sitelo.dev' },
  div({ style: 'padding: 1.5rem; background: var(--su-surface-2)' },
    stack({ gap: 'sm' },
      text({ variant: 'h5', as: 'div' }, 'Hello world'),
      text({ variant: 'small', tone: 'muted' }, 'Rendered at build time, served as a static file.'),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Window'),
      p('The same frame without an address bar, for anything that is not a web page.'),
      demo(`mockup({ variant: 'window' },
  div({ style: 'padding: 1.5rem' },
    text({ variant: 'small' }, 'A window with no URL.'),
  ),
)`, { align: 'stretch' }),

      h2('Traffic lights'),
      p(
        'The buttons follow the theme by default. ',
        code("dots: 'mac'"),
        ' paints them the macOS red, yellow and green instead — the same three in either theme, since the point of them is to be recognisable.',
      ),
      demo(`mockup({ variant: 'browser', url: 'sitelo.dev', dots: 'mac' },
  div({ style: 'padding: 1.5rem' },
    text({ variant: 'small' }, 'A window you have seen before.'),
  ),
)`, { align: 'stretch' }),

      h2('Terminal'),
      p(
        'The ',
        code('code'),
        ' variant is dark in both themes, the way a terminal is.',
      ),
      demo(`mockup({ variant: 'code' },
  '<div>$ npm install -D sitelo</div>' +
  '<div>$ npx sitelo build</div>' +
  '<div style="opacity: .7">✓ built in 1.09s</div>' +
  '<div style="opacity: .7">  204 pages · 9.7 MB</div>',
)`, { align: 'stretch' }),

      h2('Phone'),
      p(
        'A current handset: a Dynamic Island floating clear of the bezel, rather than a notch cut into it. Leave room for it at the top of the screen.',
      ),
      demo(`mockup({ variant: 'phone' },
  div({ style: 'padding: 3rem 1rem 1rem' },
    stack({ gap: 'md' },
      text({ variant: 'h6', as: 'div' }, 'sitelo'),
      text({ variant: 'caption', tone: 'muted' }, 'Static sites, no framework.'),
      button({ size: 'sm', block: true }, 'Get started'),
    ),
  ),
)`),

      h2('Frame and island'),
      p(
        code('frame'),
        ' tints the outer rail — any CSS color, so a device finish is a hex rather than a name this library would have to keep a list of. ',
        code('notch: false'),
        ' leaves the island off for anything that has none.',
      ),
      demo(`stack({ direction: 'row', gap: 'md', wrap: true },
  mockup({ variant: 'phone', size: 'sm', frame: '#a8674a' }, ''),
  mockup({ variant: 'phone', size: 'sm', frame: '#2c3644' }, ''),
  mockup({ variant: 'phone', size: 'sm', frame: '#c9ced4', notch: false }, ''),
)`, { align: 'stretch' }),

      h2('With a screenshot'),
      p(
        'An ',
        code('<img>'),
        ' inside the body fills the frame’s width. Pair it with ',
        code('aspectRatio()'),
        ' if the image loads late and the page should not jump.',
      ),
      demo(`mockup({ variant: 'browser', url: 'sitelo.dev/ui' },
  aspectRatio({ ratio: '16 / 9', style: 'background: var(--su-surface-2)' },
    '<img src="/logo.svg" alt="The sitelo UI gallery" style="object-fit: contain; padding: 3rem">',
  ),
)`, { align: 'stretch' }),

      h2('Sizes'),
      p(
        'A mockup fills its container by default. ',
        code('size'),
        ' pins it to a fixed width instead. The phone has its own three — 22rem of phone would be a tablet — and it keeps its proportions at all of them: the corners, the rail and the island are fractions of the width rather than fixed lengths.',
      ),
      demo(`stack({ gap: 'md', align: 'flex-start' },
  mockup({ variant: 'window', size: 'sm' }, div({ style: 'padding: 1rem' }, text({ variant: 'small' }, 'size: sm'))),
  mockup({ variant: 'window' }, div({ style: 'padding: 1rem' }, text({ variant: 'small' }, 'default — full width'))),
)`, { align: 'stretch' }),

      h2('In a hero'),
      p(
        'The pairing this exists for: pass a mockup as a hero’s ',
        code('media'),
        '.',
      ),
      demo(`hero({
  level: 2,
  align: 'start',
  title: 'See it running',
  description: 'Static HTML by the time it reaches the browser.',
  media: mockup({ variant: 'browser', url: 'example.com' },
    div({ style: 'padding: 1.25rem; background: var(--su-surface-2)' },
      text({ variant: 'small' }, 'A page, framed.'),
    ),
  ),
}, button('Get started'))`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['variant', "'browser' | 'window' | 'phone' | 'code'", "'browser'", 'Which frame to draw.'],
        ['url', 'string', '', 'Shown in the address bar. Browser variant only.'],
        ['dots', "'mono' | 'mac'", "'mono'", 'What the three buttons look like.'],
        ['frame', 'string', '', 'Tints the outer rail. Any CSS color. Phone only.'],
        ['notch', 'boolean', 'true', 'Draw the Dynamic Island. Phone only.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Fixed width. Medium fills the container.'],
      ]),
    ],
  })
