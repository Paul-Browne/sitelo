import { h2, p } from 'javascript-to-html'
import { code, codeBlock } from '../lib/code.js'
import { uiLayout } from '../lib/layout.js'
import { demo, propsTable, uiHead } from '../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Toggle button',
    description:
      'A button that stays pressed — a setting shown as a button rather than a checkbox.',
    activeHref: '/ui/toggle-button',
    extraHead: uiHead(),
    children: [
      p(
        'A toggle button is on or off, and says so with ',
        code('aria-pressed'),
        '. Bold in a text editor, a filter that is applied, a panel that is showing.',
      ),
      p(
        'There is no hidden input and no script behind it: on a static page a toggle button ',
        code('shows'),
        ' a state rather than changing one. Add your own listener, or reach for ',
        code('checkbox()'),
        ' when it belongs in a form and ',
        code('toggle()'),
        ' — the switch — when it is a setting in a list.',
      ),

      h2('Basic toggle'),
      demo(`stack({ direction: 'row', gap: 'sm' },
  toggleButton({ pressed: true }, 'Bold'),
  toggleButton('Italic'),
  toggleButton('Underline'),
)`),

      h2('Variants'),
      demo(`stack({ gap: 'md' },
  stack({ direction: 'row', gap: 'sm' },
    toggleButton({ variant: 'outline', pressed: true }, 'Outline on'),
    toggleButton({ variant: 'outline' }, 'Outline off'),
  ),
  stack({ direction: 'row', gap: 'sm' },
    toggleButton({ variant: 'ghost', pressed: true }, 'Ghost on'),
    toggleButton({ variant: 'ghost' }, 'Ghost off'),
  ),
  stack({ direction: 'row', gap: 'sm' },
    toggleButton({ variant: 'soft', pressed: true }, 'Soft on'),
    toggleButton({ variant: 'soft' }, 'Soft off'),
  ),
)`, { align: 'start' }),

      h2('Sizes'),
      demo(`stack({ direction: 'row', gap: 'sm', align: 'center' },
  toggleButton({ size: 'sm', pressed: true }, 'Small'),
  toggleButton({ size: 'md', pressed: true }, 'Medium'),
  toggleButton({ size: 'lg', pressed: true }, 'Large'),
)`),

      h2('With icons'),
      p(
        'An icon-only toggle needs an accessible name — pass ',
        code('aria-label'),
        ', which falls through to the button.',
      ),
      demo(`stack({ direction: 'row', gap: 'sm' },
  toggleButton({
    pressed: true,
    'aria-label': 'Bold',
    title: 'Bold',
    startIcon: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 4h5a3 3 0 0 1 0 6H6zM6 10h6a3 3 0 0 1 0 6H6z"/></svg>',
  }),
  toggleButton({
    'aria-label': 'Italic',
    title: 'Italic',
    startIcon: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 4H8M12 16H8M13 4l-6 12"/></svg>',
  }),
)`),

      h2('Disabled'),
      demo(`stack({ direction: 'row', gap: 'sm' },
  toggleButton({ pressed: true, disabled: true }, 'On, locked'),
  toggleButton({ disabled: true }, 'Off, locked'),
)`),

      h2('Making it do something'),
      p(
        'One listener flips the attribute; the styling follows it.',
      ),
      codeBlock('src/main.js', `for (const button of document.querySelectorAll('[aria-pressed]')) {
  button.addEventListener('click', () => {
    const on = button.getAttribute('aria-pressed') === 'true'
    button.setAttribute('aria-pressed', String(!on))
  })
}`, 'javascript'),

      h2('Props'),
      propsTable([
        ['pressed', 'boolean', 'false', 'Sets aria-pressed. There is no script behind it.'],
        ['variant', "'outline' | 'ghost' | 'soft'", "'outline'", 'How the unpressed button looks.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Same scale as button().'],
        ['disabled', 'boolean', 'false', 'Disables the button.'],
      ]),
      p(
        'Everything else falls through to ',
        code('button()'),
        ' — ',
        code('startIcon'),
        ', ',
        code('endIcon'),
        ', ',
        code('onclick'),
        ' and the rest. For a set of them, see ',
        code('toggleGroup()'),
        '.',
      ),
    ],
  })
