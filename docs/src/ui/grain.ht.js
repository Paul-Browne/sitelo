import { h2, p } from 'javascript-to-html'
import { code } from '../lib/code.js'
import { uiLayout } from '../lib/layout.js'
import { demo, propsTable } from '../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Grain',
    description:
      'A wrapper that lays a film grain over whatever it contains.',
    activeHref: '/ui/grain',
    children: [
      p(
        'Grain takes the flatness off a large area of colour — a hero, a coloured band, a card that would otherwise read as a plain rectangle. It wraps content the way ',
        code('container()'),
        ' does, but sets no width of its own: the texture is drawn on ',
        code('::after'),
        ', above the children and ignoring the pointer.',
      ),
      p(
        'The tile is a static SVG of fractal noise, painted once and repeated. A ',
        code('filter'),
        ' over the live pixels would look much the same and cost a re-raster every time anything underneath it moved.',
      ),

      h2('Basic grain'),
      demo(`grain({ style: 'background: var(--su-surface-2); padding: 2rem; border-radius: 0.75rem' },
  text({ variant: 'lead', align: 'center' }, 'Textured.'),
)`, { align: 'stretch' }),

      h2('Intensity'),
      p(
        'Three steps. The theme sets the base strength and the intensity scales it, because a near-black surface takes grain more readily than paper does — measured as perceived lightness, the same tile is about 1.6× the speckle over the dark ground. So ',
        code('medium'),
        ' is a lower opacity in dark mode, and the two land in the same place.',
      ),
      demo(`grid({ min: '9rem' },
  ...['soft', 'medium', 'strong'].map((intensity) =>
    grain({ intensity, style: 'background: var(--su-surface-2); padding: 1.5rem 1rem; border-radius: 0.5rem' },
      text({ variant: 'small', align: 'center' }, intensity),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Scale'),
      p(
        'The size of one noise tile. Smaller is finer — closer to film, further from sand.',
      ),
      demo(`grid({ min: '9rem' },
  ...['60px', '180px', '420px'].map((scale) =>
    grain({ scale, intensity: 'strong', style: 'background: var(--su-surface-2); padding: 1.5rem 1rem; border-radius: 0.5rem' },
      text({ variant: 'small', align: 'center' }, scale),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Around a container'),
      p(
        'Grain has no width limit of its own, which is what makes this work: the wrapper runs full bleed and the ',
        code('container()'),
        ' inside keeps the text centred and readable.',
      ),
      demo(`grain({ as: 'section', style: 'background: var(--su-primary-soft); padding-block: 2.5rem; border-radius: 0.75rem' },
  container({ size: 'sm' },
    stack({ gap: 'sm', align: 'center' },
      heading({ level: 2, size: 'h4' }, 'A textured band'),
      text({ tone: 'muted', align: 'center' }, 'Full width outside, a readable column inside.'),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Over a card'),
      p(
        'The texture inherits the box’s ',
        code('border-radius'),
        ', so wrapping something rounded does not square its corners off.',
      ),
      demo(`grid({ min: '12rem' },
  grain({ style: 'border-radius: var(--su-radius-lg)' },
    card({ variant: 'elevated' },
      cardBody(text({ variant: 'small' }, 'Grained')),
    ),
  ),
  card({ variant: 'elevated' },
    cardBody(text({ variant: 'small' }, 'Plain')),
  ),
)`, { align: 'stretch' }),

      h2('Blending'),
      p(
        'By default the texture is laid over the content at its own opacity. ',
        code('blend'),
        ' takes any ',
        code('mix-blend-mode'),
        ' — ',
        code('overlay'),
        ' and ',
        code('soft-light'),
        ' push the grain into the colour underneath rather than greying it out.',
      ),
      demo(`grid({ min: '9rem' },
  ...['normal', 'overlay', 'soft-light'].map((blend) =>
    grain({ blend, intensity: 'strong', style: 'background: var(--su-primary-soft); padding: 1.5rem 1rem; border-radius: 0.5rem' },
      text({ variant: 'small', align: 'center' }, blend),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['intensity', "'soft' | 'medium' | 'strong'", "'medium'", 'How far the texture is pushed, relative to the theme’s base.'],
        ['opacity', 'number', '', 'A raw opacity, overriding intensity and the theme.'],
        ['scale', 'string', "'180px'", 'The size of one noise tile.'],
        ['blend', 'string', "'normal'", 'A mix-blend-mode for the texture.'],
        ['as', 'string', "'div'", 'Element to render, e.g. section.'],
      ]),
    ],
  })
