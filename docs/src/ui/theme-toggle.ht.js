import { h2, p } from 'javascript-to-html'
import { code, codeBlock } from '../lib/code.js'
import { uiLayout } from '../lib/layout.js'
import { demo, propsTable, uiHead } from '../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Theme toggle',
    description:
      'A light/dark switch, with the inline script that keeps a stored choice from flashing on the way in.',
    activeHref: '/ui/theme-toggle',
    extraHead: uiHead(),
    children: [
      p(
        'sitelo-ui resolves dark mode from ',
        code('prefers-color-scheme'),
        ' on its own — a site that is happy following the operating system needs nothing on this page. The toggle is for letting a reader override that.',
      ),
      p(
        'It is one of the four components that need ',
        code('sitelo/ui/client'),
        ', because the choice lives in ',
        code('localStorage'),
        ' and only a script can read it.',
      ),

      h2('Setting it up'),
      p('Two things in the head, and the button wherever it belongs:'),
      codeBlock('src/index.ht.js', `import { styles, themeScript, themeToggle } from 'sitelo/ui'

head(
  themeScript(), // applies the stored choice before the first paint
  styles(),
)

body(
  appBar({ brand: 'My site' },
    appBarSpacer(),
    appBarActions(themeToggle()),
  ),
)`, 'javascript'),
      codeBlock('src/main.js', `import 'sitelo/ui/client'`, 'javascript'),
      p(
        code('themeScript()'),
        ' is blocking and inline on purpose. Anything deferred paints first, which is exactly the dark flash it exists to prevent.',
      ),

      h2('The toggle'),
      p(
        'The icon is pure CSS, read straight off the theme attribute — so it is already correct on the first paint, before any script runs. It shows what a click will switch ',
        code('to'),
        '.',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  themeToggle(),
  themeToggle({ variant: 'soft' }),
  themeToggle({ variant: 'outline' }),
)`),
      p(
        'Those buttons work — this page loads the runtime. Clicking one sets ',
        code('data-su-theme'),
        ' on ',
        code('<html>'),
        ', which is sitelo-ui’s own attribute, so only the sitelo-ui components on this page change. The rest of this site follows its own ',
        code('data-theme'),
        ', set by the toggle in the top bar. On your site there would be only one of them.',
      ),

      h2('In an app bar'),
      demo(`appBar({ brand: 'sitelo' },
  appBarNav(navLink({ href: '#docs', current: true }, 'Docs')),
  appBarSpacer(),
  appBarActions(
    themeToggle(),
    button({ size: 'sm' }, 'Get started'),
  ),
)`, { align: 'stretch' }),

      h2('How the theme resolves'),
      p(
        'In order: an explicit ',
        code('data-theme'),
        ' or ',
        code('data-su-theme'),
        ' on any ancestor wins; failing that, ',
        code('prefers-color-scheme'),
        ' decides. Both attribute names are honoured so sitelo-ui can sit inside a site that already has its own theme switch — which is exactly what these docs do.',
      ),

      h2('Driving it yourself'),
      p(
        'The runtime exports the same functions the button uses, for a custom control, or a three-way light / dark / system picker.',
      ),
      codeBlock('src/main.js', `import { getTheme, setTheme, toggleTheme } from 'sitelo/ui/client'

getTheme()          // 'light' | 'dark' — resolved, not stored
toggleTheme()       // flip
setTheme('dark')    // pin
setTheme('system')  // clear the override and follow the OS again`, 'javascript'),

      h2('Props'),
      propsTable([
        ['label', 'string', "'Toggle dark mode'", 'Accessible name and tooltip.'],
        ['variant', "'solid' | 'soft' | 'outline' | 'ghost' | 'link'", "'ghost'", 'Button variant.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'neutral'", 'Which palette to draw from.'],
      ]),
      p(
        code('themeScript()'),
        ' takes an optional ',
        code('nonce'),
        ', for a site with a content security policy.',
      ),
    ],
  })
