import { h2, p } from 'javascript-to-html'
import { grainStyles } from 'sitelo/ui-extras'
import { code, codeBlock } from '../lib/code.js'
import { uiExtrasLayout } from '../lib/layout.js'
import { demo, grainSandbox, grainSandboxHead, propsTable } from '../lib/ui-demo.js'

export default () =>
  uiExtrasLayout({
    title: 'Grain',
    description:
      'A wrapper that lays a film grain over whatever it contains.',
    activeHref: '/ui-extras/grain',
    // The page's own sheet first, then what the sandbox needs.
    extraHead: [grainStyles(), ...grainSandboxHead()],
    children: [
      p(
        'Grain takes the flatness off a large area of colour — a hero, a coloured band, a card that would otherwise read as a plain rectangle. It wraps content the way ',
        code('container()'),
        ' does, but sets no width of its own: the texture is drawn on ',
        code('::after'),
        ', above the children and ignoring the pointer.',
      ),
      p(
        'It is an extra, so it comes with a stylesheet of its own. Import both from ',
        code('sitelo/ui-extras'),
        ' and put ',
        code('grainStyles()'),
        ' in the head beside ',
        code('styles()'),
        ':',
      ),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'
import { grain, grainStyles } from 'sitelo/ui-extras'

head(styles(), grainStyles())`, 'javascript'),
      p(
        'The tile is a static SVG of fractal noise, painted once. A ',
        code('filter'),
        ' over the live pixels would look much the same and cost a re-raster every time anything underneath it moved.',
      ),
      p(
        'There are two layers of control. ',
        code('opacity'),
        ' is how hard the texture is pushed once drawn; left alone the theme sets it, and that is the value the two themes are balanced on. ',
        code('type'),
        ', ',
        code('frequency'),
        ', ',
        code('octaves'),
        ', ',
        code('seed'),
        ' and ',
        code('color'),
        ' are the turbulence itself; touching any of them builds a texture for that one element instead of using the shared one in the stylesheet.',
      ),

      h2('Basic grain'),
      demo(`grain({ style: 'background: var(--su-surface-2); padding: 2rem; border-radius: 0.75rem' },
  text({ variant: 'lead', align: 'center' }, 'Textured.'),
)`, { align: 'stretch' }),

      h2('Noise type'),
      p(
        code('fractal'),
        ' sums the noise straight and gives the even speckle of film. ',
        code('turbulence'),
        ' takes its absolute value, which leaves dark veins and clumps — closer to smoke or marble than to grain.',
      ),
      demo(`grid({ min: '9rem' },
  ...['fractal', 'turbulence'].map((type) =>
    grain({ type, style: 'background: var(--su-surface-2); padding: 1.5rem 1rem; border-radius: 0.5rem' },
      text({ variant: 'small', align: 'center' }, type),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Frequency'),
      p(
        'Cycles per pixel: higher is finer. The noise is drawn at the box’s own size, one unit to the pixel, so this holds whatever the box measures — a small card and a full-width band get the same grain, and nothing repeats.',
      ),
      demo(`grid({ min: '9rem' },
  ...[0.2, 0.57, 1.2].map((frequency) =>
    grain({ frequency, style: 'background: var(--su-surface-2); padding: 1.5rem 1rem; border-radius: 0.5rem' },
      text({ variant: 'small', align: 'center' }, String(frequency)),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Octaves'),
      p(
        'How many layers of noise are summed, each finer and fainter than the last. One is plain and even; more adds detail, and each one costs the browser another pass when the tile is first drawn.',
      ),
      demo(`grid({ min: '9rem' },
  ...[1, 3, 6].map((octaves) =>
    grain({ octaves, style: 'background: var(--su-surface-2); padding: 1.5rem 1rem; border-radius: 0.5rem' },
      text({ variant: 'small', align: 'center' }, String(octaves)),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Seed'),
      p(
        'Which noise gets drawn. Any number will do, the same one always gives the same pattern, and nothing else about the texture changes — useful when two grained panels sit side by side and the repeat gives itself away.',
      ),
      demo(`grid({ min: '9rem' },
  ...[0, 7, 42].map((seed) =>
    grain({ seed, style: 'background: var(--su-surface-2); padding: 1.5rem 1rem; border-radius: 0.5rem' },
      text({ variant: 'small', align: 'center' }, String(seed)),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Colour'),
      p(
        'The noise is grey by default. ',
        code('color'),
        ' tints it — the value is multiplied into the texture inside the filter, so it has to be one that can be resolved when the page is built: ',
        code('#rgb'),
        ', ',
        code('#rrggbb'),
        ' or ',
        code('rgb()'),
        '. A named colour, ',
        code('currentColor'),
        ' or a ',
        code('var()'),
        ' cannot be, and leaves the noise grey rather than failing the build. Alpha is how much of the tint: ',
        code('#ff880080'),
        ' is half of ',
        code('#ff8800'),
        ', and alpha zero is none.',
      ),
      demo(`grid({ min: '9rem' },
  ...['#0a7a45', '#c05621', '#2f7fc7'].map((color) =>
    grain({ color, style: 'background: var(--su-surface-2); padding: 1.5rem 1rem; border-radius: 0.5rem' },
      text({ variant: 'small', align: 'center' }, color),
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
    grain({ blend, style: 'background: var(--su-primary-soft); padding: 1.5rem 1rem; border-radius: 0.5rem' },
      text({ variant: 'small', align: 'center' }, blend),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Sandbox'),
      grainSandbox(),

      h2('From script'),
      p(
        code('setGrain()'),
        ' from ',
        code('sitelo/ui-extras/client'),
        ' redraws a grain by element or by ',
        code('id'),
        ': only what is passed changes, and it returns what the grain is showing now — which ',
        code('getGrain()'),
        ' reads on its own, the theme’s opacity included. The sandbox above is nothing else.',
      ),
      codeBlock('src/main.js', `import { setGrain } from 'sitelo/ui-extras/client'

setGrain('hero', { type: 'turbulence', seed: 7 })`, 'javascript'),

      h2('Props'),
      propsTable([
        ['opacity', 'number', '', 'Opacity of the texture. Left alone, the theme sets it.'],
        ['blend', 'string', "'normal'", 'A mix-blend-mode for the texture.'],
        ['type', "'fractal' | 'turbulence'", "'fractal'", 'Which turbulence to draw.'],
        ['frequency', 'number', '0.57', 'Cycles per pixel — higher is finer.'],
        ['octaves', 'number', '3', 'Layers of noise summed together, 1–8.'],
        ['seed', 'number', '0', 'Which noise to draw.'],
        ['color', 'string', '', 'Tints the noise; alpha is how much. #rgb, #rrggbb, #rrggbbaa, rgb() or rgba().'],
        ['as', 'string', "'div'", 'Element to render, e.g. section.'],
      ]),
    ],
  })
