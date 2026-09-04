import { h2, h3, p } from 'javascript-to-html'
import { code } from '../lib/code.js'
import { uiLayout } from '../lib/layout.js'
import { demo, propsTable, uiHead } from '../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Text field',
    description:
      'Single- and multi-line text inputs, with the label, help text, error message and ids wired together for you.',
    activeHref: '/ui/text-field',
    extraHead: uiHead(),
    children: [
      p(
        'There are two layers here. ',
        code('input()'),
        ' and ',
        code('textarea()'),
        ' are the bare controls; ',
        code('textField()'),
        ' and ',
        code('textareaField()'),
        ' wrap one in a label, help text and an error message, and connect them with ',
        code('for'),
        ' and ',
        code('aria-describedby'),
        '. Reach for the second unless you are building the layout yourself.',
      ),

      h2('Basic text field'),
      demo(`textField({ label: 'Name', name: 'name', placeholder: 'Ada Lovelace' })`, {
        align: 'stretch',
      }),

      h2('Help text'),
      p(
        'Help text is linked with ',
        code('aria-describedby'),
        ', so a screen reader reads it as part of the field rather than as loose text after it.',
      ),
      demo(`textField({
  label: 'Email',
  name: 'email',
  type: 'email',
  help: 'We only use it to send build failures.',
})`, { align: 'stretch' }),

      h2('Required and error'),
      p(
        'An ',
        code('error'),
        ' marks the field invalid, colours the border, sets ',
        code('aria-invalid'),
        ' and points ',
        code('aria-describedby'),
        ' at the message — one prop, all four.',
      ),
      demo(`stack({ gap: 'lg' },
  textField({ label: 'Project', name: 'project', required: true, value: '' }),
  textField({
    label: 'Site',
    name: 'site',
    error: 'That is not a URL.',
    value: 'sitelo dot dev',
  }),
)`, { align: 'stretch' }),

      h2('Sizes'),
      demo(`stack({ gap: 'md' },
  textField({ label: 'Small', name: 'small', size: 'sm', placeholder: 'sm' }),
  textField({ label: 'Medium', name: 'medium', size: 'md', placeholder: 'md' }),
  textField({ label: 'Large', name: 'large', size: 'lg', placeholder: 'lg' }),
)`, { align: 'stretch' }),

      h2('Adornments'),
      p(
        'A prefix or suffix attached to the control itself, for units and fixed fragments of a value.',
      ),
      demo(`stack({ gap: 'md' },
  textField({ label: 'Site', name: 'url', startAdornment: 'https://', placeholder: 'example.com' }),
  textField({ label: 'Build timeout', name: 'timeout', endAdornment: 'seconds', value: '30' }),
)`, { align: 'stretch' }),

      h2('Disabled and read-only'),
      demo(`stack({ gap: 'md' },
  textField({ label: 'Disabled', name: 'disabled', value: 'Cannot edit', disabled: true }),
  textField({ label: 'Read-only', name: 'readonly', value: 'dist/', readonly: true }),
)`, { align: 'stretch' }),

      h2('Multiline'),
      p(
        code('textareaField()'),
        ' is the same field around a ',
        code('<textarea>'),
        '. Its value is element content rather than an attribute, which the component handles for you.',
      ),
      demo(`textareaField({
  label: 'Description',
  name: 'description',
  rows: 4,
  help: 'Shown in search results and social cards.',
  value: 'Zero-config static site generation powered by Vite.',
})`, { align: 'stretch' }),

      h2('In a form'),
      demo(`card(
  cardBody(
    stack({ gap: 'md' },
      textField({ label: 'Name', name: 'contact-name', required: true }),
      textField({ label: 'Email', name: 'contact-email', type: 'email', required: true }),
      textareaField({ label: 'Message', name: 'message', rows: 3 }),
    ),
  ),
  cardFooter({ divided: true, style: 'justify-content: flex-end' },
    button({ variant: 'ghost', color: 'neutral' }, 'Cancel'),
    button({ type: 'submit' }, 'Send'),
  ),
)`, { align: 'stretch' }),

      h2('Building it yourself'),
      p(
        code('field()'),
        ' is the wrapper on its own — it takes any control as children, so you can put two inputs on one row, or a control this library does not have, under the same label and error treatment.',
      ),
      p(
        'One label cannot name two controls, so each input needs its own accessible name here. That is what the ',
        code('aria-label'),
        's are doing: the visible label names the pair, and each input says which end it is.',
      ),
      demo(`field({ label: 'Date range', help: 'Both ends are inclusive.' },
  stack({ direction: 'row', gap: 'sm' },
    input({ type: 'date', name: 'from', 'aria-label': 'From' }),
    input({ type: 'date', name: 'to', 'aria-label': 'To' }),
  ),
)`, { align: 'stretch' }),

      h2('Props'),
      h3('textField and textareaField'),
      propsTable([
        ['label', 'Child', '', 'The field label. Also derives the control id when there is no name.'],
        ['name', 'string', '', 'Form field name; the id is derived from it.'],
        ['help', 'Child', '', 'Hint under the control, linked with aria-describedby.'],
        ['error', 'Child | false', '', 'Error message. Also sets aria-invalid on the control.'],
        ['required', 'boolean', 'false', 'Marks the label and the control.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Control height and text size.'],
        ['type', 'string', "'text'", 'Any input type. textField only.'],
        ['startAdornment', 'Child', '', 'Prefix attached to the control. textField only.'],
        ['endAdornment', 'Child', '', 'Suffix attached to the control. textField only.'],
        ['value', 'string | number', '', 'Initial value.'],
        ['fieldClass', 'string', '', 'Class for the wrapper rather than the control.'],
      ]),
      p(
        'Ids are derived from ',
        code('name'),
        ' — or from ',
        code('label'),
        ' when there is no name — rather than from a counter, so the same page renders the same HTML on every build. Pass ',
        code('id'),
        ' to override.',
      ),
      h3('field'),
      propsTable([
        ['label', 'Child', '', 'The label text.'],
        ['help', 'Child', '', 'Hint under the control.'],
        ['error', 'Child | false', '', 'Error message; also adds the invalid state to the wrapper.'],
        ['required', 'boolean', 'false', 'Adds the required marker to the label.'],
        ['for', 'string', '', 'Id of the control being labelled.'],
      ]),
    ],
  })
