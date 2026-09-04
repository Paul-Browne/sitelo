import { h2, p } from 'javascript-to-html'
import { code } from '../lib/code.js'
import { uiLayout } from '../lib/layout.js'
import { demo, propsTable, uiHead } from '../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Stat',
    description:
      'A number worth looking at, with what it means and which way it moved.',
    activeHref: '/ui/stat',
    extraHead: uiHead(),
    children: [
      p(
        'A stat is a label, a value, and optionally a change. ',
        code('statGroup()'),
        ' joins several into one surface with dividers between them.',
      ),

      h2('Basic stat'),
      demo(`statGroup(
  stat({ label: 'Pages', value: '204' }),
  stat({ label: 'Build time', value: '1.1s' }),
  stat({ label: 'Client JS', value: '3.3 kB' }),
)`, { align: 'stretch' }),

      h2('With a change'),
      p(
        'The change takes its colour from ',
        code('color'),
        ' — green for a number that went the right way, red for one that did not. Do not rely on the colour alone: keep the sign or the word.',
      ),
      demo(`statGroup(
  stat({ label: 'Pages', value: '204', change: '+8 this week', color: 'success' }),
  stat({ label: 'Build time', value: '1.1s', change: '−0.3s', color: 'success' }),
  stat({ label: 'Bundle', value: '9.9 kB', change: '+1.2 kB', color: 'danger' }),
)`, { align: 'stretch' }),

      h2('With icons'),
      demo(`statGroup(
  stat({
    label: 'Deploys',
    value: '128',
    color: 'primary',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M13 3 4 14h6l-1 7 9-11h-6z"/></svg>',
  }),
  stat({
    label: 'Contributors',
    value: '17',
    color: 'primary',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="8" r="3.5"/><path d="M5 20c0-3.5 3.1-6 7-6s7 2.5 7 6"/></svg>',
  }),
)`, { align: 'stretch' }),

      h2('Help text'),
      demo(`statGroup(
  stat({
    label: 'Lighthouse',
    value: '100',
    change: 'accessibility',
    color: 'success',
    help: 'Measured on every English page in CI.',
  }),
  stat({
    label: 'Pagefind index',
    value: '204',
    help: 'Rebuilt at the end of every build.',
  }),
)`, { align: 'stretch' }),

      h2('On its own'),
      p('A single stat needs no group — it just has no surface of its own.'),
      demo(`card(
  cardBody(stat({ label: 'Total pages', value: '204', change: '+8', color: 'success' })),
)`, { align: 'stretch' }),

      h2('Fixed columns'),
      p(
        'Stats auto-fit by default. ',
        code('columns'),
        ' pins the count when the numbers should stay on one row.',
      ),
      demo(`statGroup({ columns: 'repeat(2, 1fr)' },
  stat({ label: 'Passing', value: '215', color: 'success' }),
  stat({ label: 'Failing', value: '0', color: 'success' }),
)`, { align: 'stretch' }),

      h2('From data'),
      demo(`return (() => {
  const report = [
    { label: 'Pages', value: 204 },
    { label: 'Assets', value: 208 },
    { label: 'Total', value: '9.7 MB' },
  ]

  return statGroup(
    report.map((entry) => stat({ label: entry.label, value: String(entry.value) })),
  )
})()`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['label', 'Child', '', 'What the number counts.'],
        ['value', 'Child', '', 'The number itself, set in tabular figures.'],
        ['change', 'Child', '', 'A delta, coloured by color.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", '', 'Colours the change and the icon.'],
        ['icon', 'Child', '', 'Decorative glyph above the label.'],
        ['help', 'Child', '', 'A quieter line under everything else.'],
      ]),
      p(code('statGroup()'), ' takes ', code('columns'), ' — any ', code('grid-template-columns'), ' value.'),
    ],
  })
