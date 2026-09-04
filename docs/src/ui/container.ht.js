import { h2, p } from 'javascript-to-html'
import { code } from '../lib/code.js'
import { uiLayout } from '../lib/layout.js'
import { demo, propsTable, uiHead } from '../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Container',
    description:
      'A centred, width-limited column — the outermost wrapper on most pages.',
    activeHref: '/ui/container',
    extraHead: uiHead(),
    children: [
      p(
        'A container centres its contents, caps the width so lines of text stay readable, and keeps a gutter so nothing touches the edge of a phone screen. It is usually the first thing inside ',
        code('body()'),
        '.',
      ),

      h2('Basic container'),
      demo(`container(
  text({ variant: 'lead' }, 'Everything inside stays centred and stops growing at the size limit.'),
)`, { align: 'stretch' }),

      h2('Sizes'),
      p(
        'Five steps, from a single readable column up to no limit at all. ',
        code('sm'),
        ' is about 40rem — roughly the width prose wants.',
      ),
      demo(`stack({ gap: 'sm' },
  container({ size: 'sm', style: 'background: var(--su-surface-2); padding-block: 0.75rem' },
    text({ variant: 'small', align: 'center' }, 'sm — 40rem'),
  ),
  container({ size: 'md', style: 'background: var(--su-surface-2); padding-block: 0.75rem' },
    text({ variant: 'small', align: 'center' }, 'md — 56rem'),
  ),
  container({ size: 'lg', style: 'background: var(--su-surface-2); padding-block: 0.75rem' },
    text({ variant: 'small', align: 'center' }, 'lg — 72rem (default)'),
  ),
)`, { align: 'stretch' }),

      h2('A custom width'),
      p(
        code('width'),
        ' takes any CSS length and overrides ',
        code('size'),
        ', for the one page that needs something the scale does not have.',
      ),
      demo(`container({ width: '30rem', style: 'background: var(--su-surface-2); padding-block: 0.75rem' },
  text({ variant: 'small', align: 'center' }, 'width: 30rem'),
)`, { align: 'stretch' }),

      h2('Gutter'),
      p(
        'The gutter is the padding held between the content and the viewport edge. It takes a spacing token, a number of spacing units, or a raw length.',
      ),
      demo(`container({ size: 'sm', gutter: 'xl', style: 'background: var(--su-surface-2); padding-block: 0.75rem' },
  text({ variant: 'small' }, 'A wider gutter, for a page whose content should not run to the edge on a tablet.'),
)`, { align: 'stretch' }),

      h2('As another element'),
      p(
        code('as'),
        ' changes the tag without changing anything else — useful when the container is also the page’s ',
        code('<main>'),
        ' or a ',
        code('<section>'),
        '.',
      ),
      demo(`container({ as: 'main', size: 'md' },
  heading({ level: 2, size: 'h4' }, 'A main element'),
  text({ tone: 'muted' }, 'Same layout, correct landmark.'),
)`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['size', "'sm' | 'md' | 'lg' | 'xl' | 'full'", "'lg'", 'Which width limit to apply.'],
        ['width', 'string', '', 'A raw max-width, overriding size.'],
        ['gutter', 'Space', "'md'", 'Inline padding held against the viewport edge.'],
        ['as', 'string', "'div'", 'Element to render, e.g. main or section.'],
      ]),
    ],
  })
