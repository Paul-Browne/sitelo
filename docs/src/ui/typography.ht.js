import { h2, p } from 'javascript-to-html'
import { code } from '../lib/code.js'
import { uiLayout } from '../lib/layout.js'
import { demo, propsTable, uiHead } from '../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Typography',
    description:
      'A type scale that picks its own element, so the document outline follows the visual one.',
    activeHref: '/ui/typography',
    extraHead: uiHead(),
    children: [
      p(
        code('text()'),
        ' renders a piece of text at one of the library’s sizes. The variant picks a sensible element — ',
        code("variant: 'h2'"),
        ' renders an actual ',
        code('<h2>'),
        ' — so headings land in the document outline without anyone having to think about it.',
      ),

      h2('Variants'),
      demo(`stack({ gap: 'sm' },
  text({ variant: 'h1' }, 'Heading 1'),
  text({ variant: 'h2' }, 'Heading 2'),
  text({ variant: 'h3' }, 'Heading 3'),
  text({ variant: 'h4' }, 'Heading 4'),
  text({ variant: 'h5' }, 'Heading 5'),
  text({ variant: 'h6' }, 'Heading 6'),
  text({ variant: 'lead' }, 'Lead — one step up from body text, for the sentence under a title.'),
  text({ variant: 'body' }, 'Body — the default.'),
  text({ variant: 'small' }, 'Small — captions that are still sentences.'),
  text({ variant: 'caption' }, 'Caption — the small print.'),
  text({ variant: 'overline' }, 'Overline'),
)`, { align: 'stretch' }),

      h2('Headings'),
      p(
        code('heading()'),
        ' takes an outline ',
        code('level'),
        ' and sizes itself to match. ',
        code('size'),
        ' decouples the two: an ',
        code('<h1>'),
        ' that looks like an h3 is still an h1 to a screen reader.',
      ),
      demo(`stack({ gap: 'sm' },
  heading({ level: 2 }, 'A level-2 heading, sized to match'),
  heading({ level: 2, size: 'h5' }, 'A level-2 heading, sized like an h5'),
)`, { align: 'stretch' }),

      h2('Tone'),
      p('Three weights of emphasis, from full contrast down to the quietest readable grey.'),
      demo(`stack({ gap: 'xs' },
  text('Default — the colour body copy is set in.'),
  text({ tone: 'muted' }, 'Muted — secondary text, still comfortably readable.'),
  text({ tone: 'subtle' }, 'Subtle — labels and metadata.'),
)`, { align: 'stretch' }),

      h2('Alignment'),
      demo(`stack({ gap: 'xs' },
  text({ align: 'start' }, 'Start'),
  text({ align: 'center' }, 'Center'),
  text({ align: 'end' }, 'End'),
)`, { align: 'stretch' }),

      h2('Truncating and clamping'),
      p(
        code('truncate'),
        ' cuts a single line with an ellipsis. ',
        code('lines'),
        ' clamps to a number of lines instead, which is what a card summary usually wants.',
      ),
      demo(`stack({ gap: 'md' },
  card({ variant: 'flat' }, cardBody(
    text({ truncate: true }, 'A single line that keeps going well past the width of its container and gets cut off with an ellipsis rather than wrapping.'),
  )),
  card({ variant: 'flat' }, cardBody(
    text({ lines: 2, tone: 'muted' }, 'Clamped to two lines. This paragraph runs on for a while so that there is something for the clamp to actually cut, and then it keeps going a little longer still, past the point where the third line would have started.'),
  )),
)`, { align: 'stretch' }),

      h2('Inline code and keys'),
      demo(`text(
  'Run ', code('sitelo build'), ' or press ', kbd('⌘'), ' ', kbd('K'), ' to search.',
)`, { align: 'stretch' }),

      h2('Composing'),
      p(
        'Text takes children, not just a string — so links, code and emphasis nest inside it the same way they would in HTML.',
      ),
      demo(`text({ variant: 'lead' },
  'Pages are functions that return ',
  code('HTML'),
  '. See the ',
  link({ href: '/docs/pages' }, 'writing pages'),
  ' guide.',
)`, { align: 'stretch' }),

      h2('Changing the element'),
      p(
        code('as'),
        ' overrides the element without changing the look — for a visual heading that must not appear in the outline, or a ',
        code('<span>'),
        ' inside a line of text.',
      ),
      demo(`stack({ gap: 'xs' },
  text({ variant: 'h4', as: 'div' }, 'Looks like a heading, is a div'),
  text({ variant: 'caption', as: 'p' }, 'Caption styling on a paragraph'),
)`, { align: 'stretch' }),

      h2('Visually hidden'),
      p(
        code('visuallyHidden()'),
        ' keeps content in the accessibility tree but off the screen — the label a screen reader needs where sighted readers get it from context.',
      ),
      demo(`text(
  'Build status: ',
  chip({ color: 'success', dot: true }, 'passing'),
  visuallyHidden(' — last build succeeded 4 minutes ago'),
)`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['variant', "'h1'…'h6' | 'lead' | 'body' | 'small' | 'caption' | 'overline'", "'body'", 'Size, weight and default element.'],
        ['tone', "'default' | 'muted' | 'subtle'", "'default'", 'How much contrast the text carries.'],
        ['align', "'start' | 'center' | 'end'", "'start'", 'Text alignment.'],
        ['truncate', 'boolean', 'false', 'One line, cut with an ellipsis.'],
        ['lines', 'number', '', 'Clamp to this many lines.'],
        ['as', 'string', '', 'Override the element the variant would pick.'],
      ]),
      p(
        code('heading()'),
        ' takes ',
        code('level'),
        ' (1–6) and an optional ',
        code('size'),
        '; everything else is the same.',
      ),
    ],
  })
