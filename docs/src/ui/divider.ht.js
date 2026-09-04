import { h2, p } from 'javascript-to-html'
import { code } from '../lib/code.js'
import { uiLayout } from '../lib/layout.js'
import { demo, propsTable, uiHead } from '../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Divider',
    description:
      'A rule between sections, with or without a label in the middle.',
    activeHref: '/ui/divider',
    extraHead: uiHead(),
    children: [
      p(
        'A divider separates groups of content. It renders a ',
        code('role="separator"'),
        ' element rather than an ',
        code('<hr>'),
        ', because a label goes inside it and ',
        code('<hr>'),
        ' takes no children.',
      ),

      h2('Basic divider'),
      demo(`stack({ gap: 'none' },
  text({ tone: 'muted' }, 'Everything above.'),
  divider(),
  text({ tone: 'muted' }, 'Everything below.'),
)`, { align: 'stretch' }),

      h2('With a label'),
      p('Children become a label centred in the rule.'),
      demo(`stack({ gap: 'none' },
  button({ variant: 'outline', color: 'neutral', block: true }, 'Continue with GitHub'),
  divider('or'),
  button({ block: true }, 'Continue with email'),
)`, { align: 'stretch' }),

      h2('Spacing'),
      p(
        code('spacing'),
        ' sets the margin above and below, from the same scale everything else uses.',
      ),
      demo(`stack({ gap: 'none' },
  text({ variant: 'small', tone: 'muted' }, 'Tight'),
  divider({ spacing: 'xs' }),
  text({ variant: 'small', tone: 'muted' }, 'Default'),
  divider(),
  text({ variant: 'small', tone: 'muted' }, 'Roomy'),
  divider({ spacing: 'xl' }),
  text({ variant: 'small', tone: 'muted' }, 'End'),
)`, { align: 'stretch' }),

      h2('Vertical'),
      p(
        'A vertical divider needs a parent that gives it a height — a flex row whose items stretch, which is what ',
        code('stack()'),
        ' does by default.',
      ),
      demo(`stack({ direction: 'row', gap: 'none', align: 'stretch' },
  text({ variant: 'small' }, '4.1 kB'),
  divider({ orientation: 'vertical' }),
  text({ variant: 'small' }, '12 pages'),
  divider({ orientation: 'vertical' }),
  text({ variant: 'small' }, '0 islands'),
)`),

      h2('Props'),
      propsTable([
        ['orientation', "'horizontal' | 'vertical'", "'horizontal'", 'Which way the rule runs.'],
        ['spacing', 'Space', "'md'", 'Margin on either side of the rule.'],
      ]),
    ],
  })
