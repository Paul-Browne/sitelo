import { h2, p } from 'javascript-to-html'
import { code } from '../lib/code.js'
import { uiLayout } from '../lib/layout.js'
import { demo, propsTable, uiStyles } from '../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Switch',
    description:
      'An on/off toggle for a setting that takes effect immediately — a checkbox underneath, with role="switch".',
    activeHref: '/ui/switch',
    extraHead: uiStyles(),
    children: [
      p(
        'A switch is for a setting that applies as soon as it is flipped. A checkbox is for a choice you confirm later, with a submit button. If your control sits in a form with a Save at the bottom, it is a checkbox.',
      ),
      p(
        'The component is called ',
        code('toggle()'),
        ' rather than ',
        code('switch()'),
        ' for a dull but unavoidable reason: ',
        code('switch'),
        ' is a reserved word, so it cannot be an import binding. Underneath it is a real ',
        code('<input type="checkbox">'),
        ' carrying ',
        code('role="switch"'),
        '.',
      ),

      h2('Basic switch'),
      demo(`stack({ direction: 'row', gap: 'lg' },
  toggle({ label: 'Public site', name: 'public' }),
  toggle({ label: 'On', name: 'on', checked: true }),
)`),

      h2('Colors'),
      demo(`stack({ direction: 'row', gap: 'lg', wrap: true },
  toggle({ label: 'Primary', checked: true, color: 'primary' }),
  toggle({ label: 'Neutral', checked: true, color: 'neutral' }),
  toggle({ label: 'Success', checked: true, color: 'success' }),
  toggle({ label: 'Warning', checked: true, color: 'warning' }),
  toggle({ label: 'Danger', checked: true, color: 'danger' }),
)`),

      h2('Disabled'),
      demo(`stack({ direction: 'row', gap: 'lg' },
  toggle({ label: 'Off, and locked', disabled: true }),
  toggle({ label: 'On, and locked', checked: true, disabled: true }),
)`),

      h2('Without a label'),
      p(
        'A switch with no visible label still needs an accessible name. Pass ',
        code('aria-label'),
        ' — it falls through to the input.',
      ),
      demo(`toggle({ 'aria-label': 'Enable Pagefind search', checked: true })`),

      h2('A settings list'),
      p(
        'The usual shape: the label on the left, the switch on the right, one row per setting.',
      ),
      demo(`return list(
  [
    ['Pagefind search', 'Indexes every page at the end of the build.', true],
    ['Image optimization', 'Resizes and converts images at build time. Needs sharp.', true],
    ['Server islands', 'Renders marked regions at request time.', false],
  ].map(([name, description, on]) =>
    listItem({
      title: name,
      description,
      end: toggle({ 'aria-label': name, checked: on }),
    }),
  ),
)`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['label', 'Child', '', 'Text beside the switch. Use aria-label when there is none.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Track colour when on.'],
        ['checked', 'boolean', 'false', 'Whether it starts on.'],
        ['name', 'string', '', 'Form field name.'],
        ['disabled', 'boolean', 'false', 'Disables the input and dims the row.'],
      ]),
      p(
        'Everything else falls through to the ',
        code('<input>'),
        ', which is where ',
        code('onchange'),
        ' and ',
        code('aria-*'),
        ' belong.',
      ),
    ],
  })
