import { h2, p } from 'javascript-to-html'
import { code, codeBlock } from '../lib/code.js'
import { uiLayout } from '../lib/layout.js'
import { demo, propsTable } from '../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Alert',
    description:
      'A message about the state of something, with an icon and an announcement role that follow the colour.',
    activeHref: '/ui/alert',
    children: [
      p(
        'An alert tells the reader something about the page or an action they took. The colour picks the icon and the ARIA role together: ',
        code('danger'),
        ' and ',
        code('warning'),
        ' announce themselves as ',
        code('role="alert"'),
        ', everything quieter is a polite ',
        code('role="status"'),
        '.',
      ),

      h2('Colors'),
      demo(`stack({ gap: 'sm' },
  alert({ color: 'primary', title: 'Heads up' }, 'A new version of sitelo is available.'),
  alert({ color: 'success', title: 'Deployed' }, '169 pages published in 1.7 seconds.'),
  alert({ color: 'warning', title: 'Slow page' }, 'One page took over 500 ms to render.'),
  alert({ color: 'danger', title: 'Build failed' }, 'Two internal links point at pages that do not exist.'),
  alert({ color: 'neutral', title: 'Note' }, 'Islands are disabled in this project.'),
)`, { align: 'stretch' }),

      h2('Without a title'),
      p('A one-line alert does not need a heading above the sentence.'),
      demo(`stack({ gap: 'sm' },
  alert({ color: 'success' }, 'Saved.'),
  alert({ color: 'danger' }, 'That email address is already in use.'),
)`, { align: 'stretch' }),

      h2('Variants'),
      demo(`stack({ gap: 'sm' },
  alert({ color: 'warning', variant: 'soft', title: 'Soft' }, 'The default — a tinted surface.'),
  alert({ color: 'warning', variant: 'outline', title: 'Outline' }, 'Transparent, with a coloured border.'),
  alert({ color: 'warning', variant: 'solid', title: 'Solid' }, 'The full palette colour, for something that must not be missed.'),
)`, { align: 'stretch' }),

      h2('Icons'),
      p(
        'Each colour has a default icon. Pass your own markup as ',
        code('icon'),
        ', or ',
        code('icon: false'),
        ' for none.',
      ),
      demo(`stack({ gap: 'sm' },
  alert({ color: 'primary', icon: false, title: 'No icon' }, 'Just the text.'),
  alert({
    color: 'primary',
    title: 'A custom icon',
    icon: icon('star'),
  }, 'Any SVG works — icons are markup, not a dependency.'),
)`, { align: 'stretch' }),

      h2('Dismissible'),
      p('The close button carries its own handler:'),
      codeBlock(
        'Rendered markup',
        `onclick="import('/su/alert.js').then(m=>m.dismiss(this))"`,
        'html',
      ),
      p(
        'So the alert below really closes with nothing imported on this page. If that module never arrives, the button renders and does nothing, which is why an alert should never be the only place a message appears.',
      ),
      demo(`alert({ color: 'primary', title: 'Dismissible', dismissible: true },
  'Click the × — the handler fetches itself on the first press.',
)`, { align: 'stretch' }),

      h2('Rich content'),
      p('Alerts take any children, so an action or a list can live inside one.'),
      demo(`alert({ color: 'danger', title: 'Link check failed' },
  stack({ gap: 'sm' },
    text({ variant: 'small' }, 'Two links point at pages that were not generated:'),
    list({ plain: true },
      listItem({ title: '/docs/old-routing', description: 'linked from /docs' }),
      listItem({ title: '/blog/draft', description: 'linked from /blog' }),
    ),
    stack({ direction: 'row', gap: 'sm' },
      button({ size: 'sm', color: 'danger' }, 'Show details'),
      button({ size: 'sm', variant: 'ghost', color: 'danger' }, 'Ignore'),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Picks the palette, the default icon and the ARIA role.'],
        ['variant', "'soft' | 'outline' | 'solid'", "'soft'", 'How much weight the alert carries.'],
        ['title', 'Child', '', 'Bold first line.'],
        ['icon', 'Child | false', '', 'Custom icon markup, or false for none.'],
        ['dismissible', 'boolean', 'false', 'Adds a close button that imports its own handler.'],
        ['dismissLabel', 'string', "'Dismiss'", 'Accessible name for that button.'],
      ]),
    ],
  })
