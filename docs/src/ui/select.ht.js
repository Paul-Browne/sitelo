import { h2, p } from 'javascript-to-html'
import { code } from '../lib/code.js'
import { uiLayout } from '../lib/layout.js'
import { demo, propsTable, uiStyles } from '../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Select',
    description:
      'A native select, styled to match the rest of the inputs, with options built from data.',
    activeHref: '/ui/select',
    extraHead: uiStyles(),
    children: [
      p(
        'This is a real ',
        code('<select>'),
        ' with the browser’s own dropdown — which means it works with no JavaScript, opens correctly on a phone, and is keyboard-navigable without anything from this library.',
      ),
      p(
        code('select()'),
        ' is the bare control; ',
        code('selectField()'),
        ' wraps it in a label, help text and error message, the same way ',
        code('textField()'),
        ' does.',
      ),

      h2('Basic select'),
      p(
        'Options can be plain strings, in which case the value and the label are the same.',
      ),
      demo(`selectField({
  label: 'Theme',
  name: 'theme',
  options: ['Light', 'Dark', 'System'],
})`, { align: 'stretch' }),

      h2('Values and labels'),
      p(
        'Pass objects when the value that gets submitted differs from the text a person reads. ',
        code('value'),
        ' marks the selected option.',
      ),
      demo(`selectField({
  label: 'Output',
  name: 'output',
  value: 'dist',
  options: [
    { value: 'dist', label: 'dist/ — the default' },
    { value: 'build', label: 'build/' },
    { value: 'public', label: 'public/', disabled: true },
  ],
})`, { align: 'stretch' }),

      h2('Placeholder'),
      p(
        'A placeholder renders as a disabled first option, selected when ',
        code('value'),
        ' is absent — so the field starts empty without being a valid choice.',
      ),
      demo(`selectField({
  label: 'Deploy target',
  name: 'target',
  placeholder: 'Choose a host…',
  options: ['Netlify', 'Vercel', 'Cloudflare Pages', 'GitHub Pages'],
})`, { align: 'stretch' }),

      h2('Groups'),
      p(
        'An entry with its own ',
        code('options'),
        ' array becomes an ',
        code('<optgroup>'),
        '.',
      ),
      demo(`selectField({
  label: 'Page extension',
  name: 'ext',
  value: '.ht.js',
  options: [
    { label: 'JavaScript', options: ['.ht.js', '.html.js'] },
    { label: 'TypeScript', options: ['.ht.ts', '.html.ts'] },
    { label: 'JSX', options: ['.ht.jsx', '.ht.tsx'] },
  ],
})`, { align: 'stretch' }),

      h2('Sizes'),
      demo(`stack({ gap: 'md' },
  selectField({ label: 'Small', name: 'sm', size: 'sm', options: ['One', 'Two'] }),
  selectField({ label: 'Medium', name: 'md', size: 'md', options: ['One', 'Two'] }),
  selectField({ label: 'Large', name: 'lg', size: 'lg', options: ['One', 'Two'] }),
)`, { align: 'stretch' }),

      h2('Help, error and disabled'),
      demo(`stack({ gap: 'lg' },
  selectField({
    label: 'Locale',
    name: 'locale',
    options: ['en', 'es', 'fr'],
    help: 'Used for the html lang attribute.',
  }),
  selectField({
    label: 'Framework',
    name: 'framework',
    placeholder: 'Pick one…',
    options: ['sitelo'],
    error: 'Choose a framework to continue.',
  }),
  selectField({
    label: 'Plan',
    name: 'plan',
    options: ['Free'],
    disabled: true,
  }),
)`, { align: 'stretch' }),

      h2('From data'),
      p(
        'Options are just an array, so they usually come from whatever ',
        code('data()'),
        ' already loaded for the page.',
      ),
      demo(`return (() => {
  const posts = [
    { slug: 'hello-world', title: 'Hello world' },
    { slug: 'static-first', title: 'Static first' },
    { slug: 'no-runtime', title: 'No runtime' },
  ]

  return selectField({
    label: 'Featured post',
    name: 'featured',
    value: 'static-first',
    options: posts.map((post) => ({ value: post.slug, label: post.title })),
  })
})()`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['options', 'SelectOption[]', '[]', 'Strings, { value, label, disabled } objects, or { label, options } for a group.'],
        ['value', 'string | number', '', 'Which option is selected.'],
        ['placeholder', 'string', '', 'Disabled first option, selected when there is no value.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Control height and text size.'],
        ['name', 'string', '', 'Form field name; the id is derived from it.'],
        ['invalid', 'boolean', 'false', 'Sets aria-invalid. selectField sets this for you from error.'],
        ['disabled', 'boolean', 'false', 'Disables the control.'],
      ]),
      p(
        code('selectField()'),
        ' additionally takes ',
        code('label'),
        ', ',
        code('help'),
        ', ',
        code('error'),
        ', ',
        code('required'),
        ' and ',
        code('fieldClass'),
        ' — see ',
        code('textField()'),
        '. Children are appended after the generated options, so you can hand-write any you need.',
      ),
    ],
  })
