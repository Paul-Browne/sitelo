import { h2, p } from 'javascript-to-html'
import { code } from '../lib/code.js'
import { uiLayout } from '../lib/layout.js'
import { demo, propsTable, uiHead } from '../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Checkbox',
    description:
      'A checkbox and its label as one control — a real input, styled with CSS rather than replaced.',
    activeHref: '/ui/checkbox',
    extraHead: uiHead(),
    children: [
      p(
        code('checkbox()'),
        ' renders a ',
        code('<label>'),
        ' wrapping a real ',
        code('<input type="checkbox">'),
        ' and the box you see. The input is visually hidden but still there, so it is focusable, it submits, and the whole label is a hit target — the tick mark is drawn from the input’s own ',
        code(':checked'),
        ' state, with no script involved.',
      ),

      h2('Basic checkbox'),
      demo(`stack({ direction: 'row', gap: 'lg' },
  checkbox({ label: 'Email me updates', name: 'updates' }),
  checkbox({ label: 'Checked', name: 'checked', checked: true }),
)`),

      h2('Colors'),
      demo(`stack({ direction: 'row', gap: 'lg', wrap: true },
  checkbox({ label: 'Primary', checked: true, color: 'primary' }),
  checkbox({ label: 'Neutral', checked: true, color: 'neutral' }),
  checkbox({ label: 'Success', checked: true, color: 'success' }),
  checkbox({ label: 'Warning', checked: true, color: 'warning' }),
  checkbox({ label: 'Danger', checked: true, color: 'danger' }),
)`),

      h2('Disabled'),
      demo(`stack({ direction: 'row', gap: 'lg' },
  checkbox({ label: 'Unavailable', disabled: true }),
  checkbox({ label: 'On, and locked', checked: true, disabled: true }),
)`),

      h2('Long labels'),
      p(
        'The box stays aligned with the first line rather than centring itself against a paragraph.',
      ),
      demo(`checkbox({
  label: 'Run a Lighthouse audit after every build, and fail the build when a score drops below its threshold.',
  name: 'lighthouse',
  checked: true,
})`, { align: 'stretch' }),

      h2('Groups'),
      p(
        code('choiceGroup()'),
        ' builds a set of checkboxes from data, with a shared legend and name. Pass an array as ',
        code('value'),
        ' to tick several.',
      ),
      demo(`choiceGroup({
  legend: 'Generate',
  name: 'generate',
  type: 'checkbox',
  value: ['sitemap', 'rss'],
  options: [
    { value: 'sitemap', label: 'sitemap.xml' },
    { value: 'rss', label: 'rss.xml' },
    { value: 'pagefind', label: 'Pagefind index' },
  ],
  help: 'Each one is written into dist/ at the end of the build.',
})`, { align: 'stretch' }),

      h2('In a row'),
      demo(`choiceGroup({
  legend: 'Categories',
  name: 'categories',
  type: 'checkbox',
  direction: 'row',
  value: ['performance'],
  options: ['performance', 'accessibility', 'seo'],
})`, { align: 'stretch' }),

      h2('With a field'),
      p(
        'A single checkbox rarely needs a label above it as well. When a group does, ',
        code('field()'),
        ' gives it the same label, help and error treatment as a text field.',
      ),
      demo(`field({ label: 'Terms', error: 'You need to accept the terms to continue.' },
  checkbox({ label: 'I accept the terms', name: 'terms', color: 'danger' }),
)`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['label', 'Child', '', 'Text beside the box. Omit it for a bare control.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Colour when checked.'],
        ['checked', 'boolean', 'false', 'Whether it starts ticked.'],
        ['name', 'string', '', 'Form field name.'],
        ['value', 'string | number', '', 'Value submitted when checked.'],
        ['disabled', 'boolean', 'false', 'Disables the input and dims the label.'],
      ]),
      p(
        'Anything else lands on the ',
        code('<input>'),
        ', not the label — so ',
        code('required'),
        ', ',
        code('onchange'),
        ' and ',
        code('data-*'),
        ' go where you would expect. Use ',
        code('class'),
        ' to style the label itself.',
      ),
      p(
        'For a set built from data, see ',
        code('choiceGroup()'),
        ' on the ',
        code('Radio group'),
        ' page — it takes the same options either way, switched by ',
        code("type: 'checkbox'"),
        '.',
      ),
    ],
  })
