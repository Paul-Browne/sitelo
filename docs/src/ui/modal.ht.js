import { h2, p } from 'javascript-to-html'
import { code } from '../lib/code.js'
import { uiLayout } from '../lib/layout.js'
import { demo, propsTable } from '../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Modal',
    description:
      'A real <dialog>, opened modally — the browser handles the backdrop, focus, Escape and a click outside.',
    activeHref: '/ui/modal',
    children: [
      p(
        'A modal is a ',
        code('<dialog>'),
        '. Any button with ',
        code('commandfor'),
        ' set to the modal’s ',
        code('id'),
        ' and ',
        code("command: 'show-modal'"),
        ' opens it modally: the page behind goes inert, so focus and a screen reader both stay inside. No script anywhere — the backdrop, Escape and a click outside are all the browser’s.',
      ),
      p(
        'That is why ',
        code('id'),
        ' is required and why the component throws without one: the id is the entire wiring.',
      ),

      h2('Basic modal'),
      p('Every modal on this page really opens — try it.'),
      demo(`fragment(
  button({ commandfor: 'demo-basic', command: 'show-modal' }, 'Open modal'),
  modal({ id: 'demo-basic', title: 'Rebuild the site?' },
    'This runs sitelo build and republishes dist/.',
  ),
)`),

      h2('With a footer'),
      p(
        'A close button is any button pointing at the same id with ',
        code("command: 'close'"),
        '.',
      ),
      demo(`fragment(
  button({ color: 'danger', commandfor: 'demo-confirm', command: 'show-modal' }, 'Delete page…'),
  modal({
    id: 'demo-confirm',
    title: 'Delete this page?',
    footer: stack({ direction: 'row', gap: 'sm' },
      button({
        variant: 'ghost',
        color: 'neutral',
        commandfor: 'demo-confirm',
        command: 'close',
      }, 'Cancel'),
      button({ color: 'danger' }, 'Delete'),
    ),
  }, 'This cannot be undone. The generated HTML is removed on the next build.'),
)`),

      h2('Sizes'),
      demo(`fragment(
  stack({ direction: 'row', gap: 'sm', wrap: true },
    button({ variant: 'outline', color: 'neutral', commandfor: 'demo-sm', command: 'show-modal' }, 'Small'),
    button({ variant: 'outline', color: 'neutral', commandfor: 'demo-md', command: 'show-modal' }, 'Medium'),
    button({ variant: 'outline', color: 'neutral', commandfor: 'demo-lg', command: 'show-modal' }, 'Large'),
  ),
  modal({ id: 'demo-sm', size: 'sm', title: 'Small' }, 'size: sm — about 24rem.'),
  modal({ id: 'demo-md', title: 'Medium' }, 'The default — about 32rem.'),
  modal({ id: 'demo-lg', size: 'lg', title: 'Large' }, 'size: lg — about 48rem.'),
)`),

      h2('Forms inside a modal'),
      demo(`fragment(
  button({ variant: 'soft', commandfor: 'demo-form', command: 'show-modal' }, 'New page…'),
  modal({
    id: 'demo-form',
    title: 'New page',
    footer: stack({ direction: 'row', gap: 'sm' },
      button({ variant: 'ghost', color: 'neutral', commandfor: 'demo-form', command: 'close' }, 'Cancel'),
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
        ' drops the × in the corner. Escape and clicking outside still close it; with ',
        code("closedby: 'closerequest'"),
        ' only Escape does.',
      ),
      demo(`fragment(
  button({ variant: 'outline', color: 'neutral', commandfor: 'demo-bare', command: 'show-modal' }, 'No close button'),
  modal({ id: 'demo-bare', title: 'Press Escape', closable: false },
    'Or click anywhere outside this dialog.',
  ),
)`),

      h2('Long content'),
      p('The body scrolls; the header and footer stay put.'),
      demo(`fragment(
  button({ variant: 'outline', color: 'neutral', commandfor: 'demo-long', command: 'show-modal' }, 'Long modal'),
  modal({
    id: 'demo-long',
    title: 'Release notes',
    footer: button({ commandfor: 'demo-long', command: 'close' }, 'Close'),
  },
    stack({ gap: 'md' },
      ...Array.from({ length: 12 }, (unused, index) =>
        text({ variant: 'small', tone: 'muted' }, 'Change ' + (index + 1) + ' — something was fixed.'),
      ),
    ),
  ),
)`),

      h2('Background scrolling'),
      p(
        'The page behind an open modal does not scroll. That is the one thing a modal dialog leaves to you, and it is done in CSS here — no script, and nothing to initialise. Pass ',
        code('lockScroll: false'),
        ' to let the background scroll as usual.',
      ),

      h2('Browser support'),
      p(
        'Opening a dialog from a button’s command works in every current browser — Chrome 135, Firefox 144 and Safari 26.2 or later. In an older one, button() adds an onclick that fetches a few hundred bytes of /su/dialog.js to do the same — only there, and only on the first click. Safari does not close a dialog on a click outside (closedby) yet, and the same file does that there.',
      ),

      h2('Props'),
      propsTable([
        ['id', 'string', '', 'Required. What a trigger’s commandfor points at.'],
        ['title', 'Child', '', 'Heading, and the dialog’s accessible name.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Maximum width.'],
        ['footer', 'Child', '', 'Bottom row, on its own tinted band.'],
        ['closable', 'boolean', 'true', 'Show the × in the header.'],
        ['closeLabel', 'string', "'Close'", 'Accessible name for that button.'],
        ['lockScroll', 'boolean', 'true', 'Stop the page behind it scrolling while it is open.'],
      ]),
      p(
        code('closeButton({ target })'),
        ' renders that × on its own, for a header you build yourself.',
      ),
    ],
  })
