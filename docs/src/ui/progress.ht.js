import { h2, p } from 'javascript-to-html'
import { code } from '../lib/code.js'
import { uiLayout } from '../lib/layout.js'
import { demo, propsTable, uiHead } from '../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Progress',
    description:
      'A bar for work with a known end, a spinner for work without one.',
    activeHref: '/ui/progress',
    extraHead: uiHead(),
    children: [
      p(
        'Use a determinate bar whenever you know how much is left — it is the only one that tells the reader anything. Omit ',
        code('value'),
        ' and the bar animates instead, which says "still working" and nothing more.',
      ),

      h2('Determinate'),
      demo(`stack({ gap: 'lg' },
  progress({ value: 25 }),
  progress({ value: 60 }),
  progress({ value: 100 }),
)`, { align: 'stretch' }),

      h2('Indeterminate'),
      demo(`progress()`, { align: 'stretch' }),
      p(
        'A bar with no ',
        code('label'),
        ' is marked ',
        code('aria-hidden'),
        ' — a progressbar role with no accessible name tells a screen reader nothing, so an unlabelled bar is treated as decoration. Label anything a reader is meant to follow.',
      ),

      h2('Labels'),
      p(
        'A label names what is happening; ',
        code('showValue'),
        ' adds the percentage on the right.',
      ),
      demo(`stack({ gap: 'lg' },
  progress({ value: 72, label: 'Rendering pages', showValue: true }),
  progress({ value: 30, max: 60, label: 'Optimising images', showValue: true }),
  progress({ label: 'Waiting for the deploy' }),
)`, { align: 'stretch' }),

      h2('Colors and height'),
      demo(`stack({ gap: 'lg' },
  progress({ value: 80, color: 'success', label: 'Passed', showValue: true }),
  progress({ value: 45, color: 'warning', label: 'Degraded', showValue: true }),
  progress({ value: 20, color: 'danger', label: 'Failing', showValue: true }),
  progress({ value: 60, color: 'neutral', height: 'xs' }),
  progress({ value: 60, color: 'primary', height: '1rem' }),
)`, { align: 'stretch' }),

      h2('A scale other than 100'),
      p(
        code('max'),
        ' lets you pass the raw numbers — pages built out of pages total — instead of working out a percentage first.',
      ),
      demo(`progress({ value: 118, max: 169, label: '118 of 169 pages', showValue: true })`, {
        align: 'stretch',
      }),

      h2('Spinner'),
      p(
        'A spinner is sized in ',
        code('em'),
        ', so it matches whatever text it sits beside without being told a size.',
      ),
      demo(`stack({ direction: 'row', gap: 'lg', align: 'center' },
  spinner({ size: 'sm' }),
  spinner(),
  spinner({ size: 'lg' }),
)`),

      h2('Spinner in context'),
      p(
        'Give a standalone spinner a ',
        code('label'),
        ' so it is announced. One inside a button does not need one — the button already says what it is doing.',
      ),
      demo(`stack({ gap: 'md' },
  stack({ direction: 'row', gap: 'sm', align: 'center' },
    spinner({ label: 'Loading' }),
    text({ variant: 'small', tone: 'muted' }, 'Fetching the latest build…'),
  ),
  stack({ direction: 'row', gap: 'sm' },
    button({ loading: true }, 'Deploying'),
    button({ variant: 'outline', loading: true }, 'Checking links'),
  ),
)`, { align: 'start' }),

      h2('Props'),
      p(code('progress()'), ' — exported as ', code('progressBar'), ' too:'),
      propsTable([
        ['value', 'number', '', 'How far along. Omit for the indeterminate animation.'],
        ['max', 'number', '100', 'What value counts as complete.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Fill colour.'],
        ['label', 'Child', '', 'Text above the bar; also its accessible name.'],
        ['showValue', 'boolean', 'false', 'Show the percentage beside the label.'],
        ['height', 'Space', "'0.5rem'", 'Bar thickness.'],
      ]),
      p(code('spinner()'), ':'),
      propsTable([
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Diameter. Medium is sized in em, to match the text beside it.'],
        ['label', 'string', '', 'Accessible name. Without one the spinner is hidden from screen readers.'],
      ]),
    ],
  })
