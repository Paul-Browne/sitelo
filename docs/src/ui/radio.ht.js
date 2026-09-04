import { h2, p } from 'javascript-to-html'
import { code } from '../lib/code.js'
import { uiLayout } from '../lib/layout.js'
import { demo, propsTable, uiHead } from '../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Radio group',
    description:
      'One choice out of several, as real radio inputs sharing a name — with a legend and a group role.',
    activeHref: '/ui/radio',
    extraHead: uiHead(),
    children: [
      p(
        'Radios are for picking exactly one option out of a small, visible set. ',
        code('radio()'),
        ' renders one; ',
        code('choiceGroup()'),
        ' builds the whole set from an array and gives it the legend and ',
        code('role="radiogroup"'),
        ' that make it a group rather than a pile of inputs.',
      ),
      p(
        'They share a ',
        code('name'),
        ', so the browser handles the mutual exclusivity and the arrow-key navigation between them. Nothing here ships a script.',
      ),

      h2('Basic radio group'),
      demo(`choiceGroup({
  legend: 'Plan',
  name: 'plan',
  value: 'pro',
  options: [
    { value: 'free', label: 'Free' },
    { value: 'pro', label: 'Pro' },
    { value: 'team', label: 'Team' },
  ],
})`, { align: 'stretch' }),

      h2('In a row'),
      p(
        'Short labels read better on one line. Long ones should stay stacked, which is the default.',
      ),
      demo(`choiceGroup({
  legend: 'Form factor',
  name: 'form-factor',
  direction: 'row',
  value: 'desktop',
  options: ['desktop', 'mobile'],
})`, { align: 'stretch' }),

      h2('Plain strings'),
      p(
        'When the value and the label are the same, pass strings.',
      ),
      demo(`choiceGroup({
  legend: 'Log level',
  name: 'log-level',
  direction: 'row',
  value: 'warn',
  options: ['info', 'warn', 'error', 'silent'],
})`, { align: 'stretch' }),

      h2('Disabled options'),
      demo(`choiceGroup({
  legend: 'Renderer',
  name: 'renderer',
  value: 'static',
  options: [
    { value: 'static', label: 'Static' },
    { value: 'islands', label: 'Server islands' },
    { value: 'ssr', label: 'Full SSR', disabled: true },
  ],
  help: 'Full SSR needs a Node host, which this project does not have.',
})`, { align: 'stretch' }),

      h2('One at a time'),
      p(
        'Use ',
        code('radio()'),
        ' directly when the options are not uniform enough to come from an array — for instance when each one carries its own description.',
      ),
      demo(`stack({ gap: 'md' },
  radio({ name: 'deploy', value: 'push', label: 'On every push', checked: true }),
  radio({ name: 'deploy', value: 'tag', label: 'On tagged releases only' }),
  radio({ name: 'deploy', value: 'manual', label: 'Manually' }),
)`, { align: 'stretch' }),

      h2('Colors'),
      demo(`stack({ direction: 'row', gap: 'lg', wrap: true },
  radio({ label: 'Primary', name: 'c1', checked: true, color: 'primary' }),
  radio({ label: 'Neutral', name: 'c2', checked: true, color: 'neutral' }),
  radio({ label: 'Success', name: 'c3', checked: true, color: 'success' }),
  radio({ label: 'Warning', name: 'c4', checked: true, color: 'warning' }),
  radio({ label: 'Danger', name: 'c5', checked: true, color: 'danger' }),
)`),

      h2('In a card'),
      demo(`card(
  cardHeader({ title: 'Build settings', subtitle: 'Applied on the next deploy' }),
  cardBody(
    stack({ gap: 'lg' },
      choiceGroup({
        legend: 'Clean URLs',
        name: 'clean-urls',
        direction: 'row',
        value: 'on',
        options: [
          { value: 'on', label: 'On' },
          { value: 'off', label: 'Off' },
        ],
      }),
      choiceGroup({
        legend: 'Images',
        name: 'images',
        value: 'optimise',
        options: [
          { value: 'optimise', label: 'Resize and convert' },
          { value: 'copy', label: 'Copy as-is' },
        ],
      }),
    ),
  ),
  cardFooter({ divided: true, style: 'justify-content: flex-end' },
    button({ type: 'submit' }, 'Save'),
  ),
)`, { align: 'stretch' }),

      h2('Props'),
      p(code('choiceGroup()'), ':'),
      propsTable([
        ['legend', 'Child', '', 'Label for the whole group.'],
        ['name', 'string', '', 'Shared form name — what makes the radios exclusive.'],
        ['options', 'Array', '[]', 'Strings, or { value, label, disabled } objects.'],
        ['value', 'string | number | Array', '', 'Which option is checked. An array for checkboxes.'],
        ['type', "'radio' | 'checkbox'", "'radio'", 'Which control to build. Also picks the group role.'],
        ['direction', "'row' | 'column'", "'column'", 'How the options are laid out.'],
        ['help', 'Child', '', 'Hint under the group.'],
      ]),
      p(code('radio()'), ' takes the same props as ', code('checkbox()'), ': ', code('label'), ', ', code('color'), ', ', code('checked'), ', ', code('name'), ', ', code('value'), ' and ', code('disabled'), '.'),
    ],
  })
