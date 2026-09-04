import { h2, p } from 'javascript-to-html'
import { code } from '../lib/code.js'
import { uiLayout } from '../lib/layout.js'
import { demo, propsTable, uiHead } from '../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Mockup',
    description:
      'A screenshot in a frame — browser, window, phone or terminal.',
    activeHref: '/ui/mockup',
    extraHead: uiHead(),
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
      demo(`mockup({ variant: 'phone' },
  div({ style: 'padding: 2.5rem 1rem 1rem' },
    stack({ gap: 'md' },
      text({ variant: 'h6', as: 'div' }, 'sitelo'),
      text({ variant: 'caption', tone: 'muted' }, 'Static sites, no framework.'),
      button({ size: 'sm', block: true }, 'Get started'),
    ),
  ),
)`),

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
        ' pins it to a fixed width instead — and the phone is always phone-width.',
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
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Fixed width. Medium fills the container.'],
      ]),
    ],
  })
