import { h2, p } from 'javascript-to-html'
import { code } from '../lib/code.js'
import { uiLayout } from '../lib/layout.js'
import { demo, propsTable, uiHead } from '../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Aspect ratio',
    description:
      'Hold a box at a fixed shape, so nothing on the page moves when the content loads.',
    activeHref: '/ui/aspect-ratio',
    extraHead: uiHead(),
    children: [
      p(
        'The height is known from the width before anything has loaded, so an image or an embed arriving late does not shove the rest of the page down. The child fills the box and is cropped rather than letterboxed.',
      ),

      h2('Basic aspect ratio'),
      demo(`aspectRatio({ ratio: '16 / 9', style: 'background: var(--su-surface-2)' },
  '<img src="/logo.svg" alt="" style="object-fit: contain; padding: 2rem">',
)`, { align: 'stretch' }),

      h2('Common ratios'),
      demo(`grid({ min: '9rem' },
  ...['16 / 9', '4 / 3', '1 / 1', '3 / 4'].map((ratio) =>
    stack({ gap: 'xs' },
      aspectRatio({ ratio, style: 'background: var(--su-surface-2); border-radius: 0.5rem' },
        '<img src="/logo.svg" alt="" style="object-fit: contain; padding: 1rem">'),
      text({ variant: 'caption', tone: 'muted', align: 'center' }, ratio),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Embeds'),
      p(
        'The reason this component exists: an ',
        code('<iframe>'),
        ' has no intrinsic size, so without a ratio it collapses or needs a hard-coded height.',
      ),
      demo(`aspectRatio({ ratio: '16 / 9', style: 'background: var(--su-surface-2); border-radius: 0.6rem' },
  '<div style="display: grid; place-items: center; color: var(--su-text-subtle)">an &lt;iframe&gt; would go here</div>',
)`, { align: 'stretch' }),

      h2('In a card'),
      p(
        code('cardMedia()'),
        ' already does this for the top of a card. Reach for ',
        code('aspectRatio()'),
        ' when the box is somewhere else.',
      ),
      demo(`grid({ min: '12rem' },
  card(
    cardMedia({ src: '/logo.svg', alt: '', style: 'background: var(--su-surface-2); object-fit: contain; padding: 1rem' }),
    cardBody(text({ variant: 'small' }, 'cardMedia — built in')),
  ),
  card(
    cardBody(
      stack({ gap: 'sm' },
        aspectRatio({ ratio: '1 / 1', style: 'background: var(--su-surface-2); border-radius: 0.5rem' },
          '<img src="/logo.svg" alt="" style="object-fit: contain; padding: 1rem">'),
        text({ variant: 'small' }, 'aspectRatio — anywhere else'),
      ),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Cropping'),
      p(
        'The child is stretched to fill and cropped with ',
        code('object-fit: cover'),
        '. For something that must not be cropped — a logo, a diagram — set ',
        code('object-fit: contain'),
        ' on the child, as every demo on this page does.',
      ),

      h2('Props'),
      propsTable([
        ['ratio', 'string', "'16 / 9'", 'Any CSS aspect-ratio value.'],
        ['as', 'string', "'div'", 'Element to render.'],
      ]),
    ],
  })
