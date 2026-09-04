import { h2, p } from 'javascript-to-html'
import { code } from '../lib/code.js'
import { uiLayout } from '../lib/layout.js'
import { demo, propsTable, uiHead } from '../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Toggle group',
    description:
      'A segmented control: toggle buttons joined into one, or links where each segment is its own page.',
    activeHref: '/ui/toggle-group',
    extraHead: uiHead(),
    children: [
      p(
        'A toggle group is a row of choices that reads as a single control. Build it from ',
        code('items'),
        ', and say which one is on with ',
        code('value'),
        '.',
      ),

      h2('Basic group'),
      demo(`toggleGroup({
  label: 'Text alignment',
  value: 'center',
  items: [
    { value: 'left', label: 'Left' },
    { value: 'center', label: 'Center' },
    { value: 'right', label: 'Right' },
  ],
})`),

      h2('Plain strings'),
      demo(`toggleGroup({ label: 'Density', value: 'comfortable', items: ['compact', 'comfortable', 'spacious'] })`),

      h2('Links'),
      p(
        'This is the form a static site usually wants: each segment is a page. Items with an ',
        code('href'),
        ' render as anchors and the active one is marked ',
        code('aria-current="page"'),
        ' — not ',
        code('aria-pressed'),
        ', because a link is not a button you have pushed in.',
      ),
      demo(`toggleGroup({
  label: 'Section',
  value: 'ui',
  items: [
    { value: 'docs', label: 'Docs', href: '/docs' },
    { value: 'ui', label: 'UI', href: '/ui' },
    { value: 'examples', label: 'Examples', href: '/examples' },
  ],
})`),

      h2('More than one on'),
      p(
        'Pass an array as ',
        code('value'),
        '. The container is a plain ',
        code('group'),
        ' either way — a ',
        code('radiogroup'),
        ' would be wrong, since these are pressed buttons rather than radios.',
      ),
      demo(`toggleGroup({
  label: 'Formatting',
  value: ['bold', 'underline'],
  items: [
    { value: 'bold', label: 'Bold' },
    { value: 'italic', label: 'Italic' },
    { value: 'underline', label: 'Underline' },
  ],
})`),

      h2('Sizes and variants'),
      demo(`stack({ gap: 'md' },
  toggleGroup({ size: 'sm', label: 'Small', value: 'a', items: ['a', 'b', 'c'] }),
  toggleGroup({ size: 'md', label: 'Medium', value: 'a', items: ['a', 'b', 'c'] }),
  toggleGroup({ size: 'lg', label: 'Large', value: 'a', items: ['a', 'b', 'c'] }),
  toggleGroup({ variant: 'ghost', label: 'Ghost', value: 'b', items: ['a', 'b', 'c'] }),
)`, { align: 'start' }),

      h2('Disabled items'),
      demo(`toggleGroup({
  label: 'Renderer',
  value: 'static',
  items: [
    { value: 'static', label: 'Static' },
    { value: 'islands', label: 'Islands' },
    { value: 'ssr', label: 'SSR', disabled: true },
  ],
})`),

      h2('In a toolbar'),
      demo(`stack({ direction: 'row', gap: 'md', wrap: true, align: 'center' },
  toggleGroup({ label: 'Alignment', value: 'Left', size: 'sm', items: ['Left', 'Center', 'Right'] }),
  divider({ orientation: 'vertical' }),
  toggleGroup({ label: 'Style', value: ['Bold'], size: 'sm', items: ['Bold', 'Italic'] }),
)`),

      h2('When to use something else'),
      p(
        'If the choice is submitted with a form, use ',
        code('choiceGroup()'),
        ' — real radios, no script needed. If each segment is a page, prefer the link form above. A toggle group is for a choice the page itself acts on.',
      ),

      h2('Props'),
      propsTable([
        ['items', 'Array', '[]', 'Strings, or { value, label, href, disabled } objects.'],
        ['value', 'string | number | Array', '', 'Which item is on. An array when several can be.'],
        ['label', 'string', '', 'Accessible name for the group.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Applied to every item.'],
        ['variant', "'outline' | 'ghost' | 'soft'", "'outline'", 'How an item that is off looks.'],
      ]),
    ],
  })
