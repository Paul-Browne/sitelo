import { h2, p } from 'javascript-to-html'
import { code } from '../lib/code.js'
import { uiLayout } from '../lib/layout.js'
import { demo, propsTable, uiHead } from '../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Modal',
    description:
      'A dialog built on the popover API — the browser handles opening, the backdrop, click-outside and Escape.',
    activeHref: '/ui/modal',
    extraHead: uiHead(),
    children: [
      p(
        'A modal is a ',
        code('popover'),
        ' element. Any button whose ',
        code('popovertarget'),
        ' matches the modal’s ',
        code('id'),
        ' opens it — no script anywhere, including the backdrop, light dismiss, Escape and focus handling, all of which the browser owns.',
      ),
      p(
        'That is why ',
        code('id'),
        ' is required and why the component throws without one: the id is the entire wiring.',
      ),

      h2('Basic modal'),
      p('Every modal on this page really opens — try it.'),
      demo(`fragment(
  button({ popovertarget: 'demo-basic' }, 'Open modal'),
  modal({ id: 'demo-basic', title: 'Rebuild the site?' },
    'This runs sitelo build and republishes dist/.',
  ),
)`),

      h2('With a footer'),
      p(
        'A close button is any button pointing at the same id with ',
        code('popovertargetaction="hide"'),
        '.',
      ),
      demo(`fragment(
  button({ color: 'danger', popovertarget: 'demo-confirm' }, 'Delete page…'),
  modal({
    id: 'demo-confirm',
    title: 'Delete this page?',
    footer: stack({ direction: 'row', gap: 'sm' },
      button({
        variant: 'ghost',
        color: 'neutral',
        popovertarget: 'demo-confirm',
        popovertargetaction: 'hide',
      }, 'Cancel'),
      button({ color: 'danger' }, 'Delete'),
    ),
  }, 'This cannot be undone. The generated HTML is removed on the next build.'),
)`),

      h2('Sizes'),
      demo(`fragment(
  stack({ direction: 'row', gap: 'sm', wrap: true },
    button({ variant: 'outline', color: 'neutral', popovertarget: 'demo-sm' }, 'Small'),
    button({ variant: 'outline', color: 'neutral', popovertarget: 'demo-md' }, 'Medium'),
    button({ variant: 'outline', color: 'neutral', popovertarget: 'demo-lg' }, 'Large'),
  ),
  modal({ id: 'demo-sm', size: 'sm', title: 'Small' }, 'size: sm — about 24rem.'),
  modal({ id: 'demo-md', title: 'Medium' }, 'The default — about 32rem.'),
  modal({ id: 'demo-lg', size: 'lg', title: 'Large' }, 'size: lg — about 48rem.'),
)`),

      h2('Forms inside a modal'),
      demo(`fragment(
  button({ variant: 'soft', popovertarget: 'demo-form' }, 'New page…'),
  modal({
    id: 'demo-form',
    title: 'New page',
    footer: stack({ direction: 'row', gap: 'sm' },
      button({ variant: 'ghost', color: 'neutral', popovertarget: 'demo-form', popovertargetaction: 'hide' }, 'Cancel'),
      button({ type: 'submit' }, 'Create'),
    ),
  },
    stack({ gap: 'md' },
      textField({ label: 'Title', name: 'modal-title', placeholder: 'About' }),
      selectField({ label: 'Extension', name: 'modal-ext', options: ['.ht.js', '.ht.ts', '.ht.jsx'] }),
    ),
  ),
)`),

      h2('Without a close button'),
      p(
        code('closable: false'),
        ' drops the × in the corner. Escape and clicking outside still close it — a popover cannot be made truly modal-blocking, and that is usually the right behaviour anyway.',
      ),
      demo(`fragment(
  button({ variant: 'outline', color: 'neutral', popovertarget: 'demo-bare' }, 'No close button'),
  modal({ id: 'demo-bare', title: 'Press Escape', closable: false },
    'Or click anywhere outside this dialog.',
  ),
)`),

      h2('Long content'),
      p('The body scrolls; the header and footer stay put.'),
      demo(`fragment(
  button({ variant: 'outline', color: 'neutral', popovertarget: 'demo-long' }, 'Long modal'),
  modal({
    id: 'demo-long',
    title: 'Release notes',
    footer: button({ popovertarget: 'demo-long', popovertargetaction: 'hide' }, 'Close'),
  },
    stack({ gap: 'md' },
      ...Array.from({ length: 12 }, (unused, index) =>
        text({ variant: 'small', tone: 'muted' }, 'Change ' + (index + 1) + ' — something was fixed.'),
      ),
    ),
  ),
)`),

      h2('Browser support'),
      p(
        'The popover API is available in every current browser. In one too old to know it, the modal renders inline in the page instead of on top of it — visible and usable, just not overlaid. Nothing disappears.',
      ),

      h2('Props'),
      propsTable([
        ['id', 'string', '', 'Required. What a trigger’s popovertarget points at.'],
        ['title', 'Child', '', 'Heading, and the dialog’s accessible name.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Maximum width.'],
        ['footer', 'Child', '', 'Bottom row, on its own tinted band.'],
        ['closable', 'boolean', 'true', 'Show the × in the header.'],
        ['closeLabel', 'string', "'Close'", 'Accessible name for that button.'],
      ]),
      p(
        code('closeButton({ target })'),
        ' renders that × on its own, for a header you build yourself.',
      ),
    ],
  })
