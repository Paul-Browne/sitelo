import { h2, p } from 'javascript-to-html'
import { code, codeBlock } from '../lib/code.js'
import { uiLayout } from '../lib/layout.js'
import { demo, propsTable } from '../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Slider',
    description:
      'A native range input, styled to match the other controls.',
    activeHref: '/ui/slider',
    children: [
      p(
        'This is a real ',
        code('<input type="range">'),
        ' — arrow keys, Home and End, and the correct announcement all come from the browser. Only the track and thumb are styled.',
      ),

      h2('Basic slider'),
      demo(`sliderField({ label: 'Quality', name: 'quality', value: 70 })`, { align: 'stretch' }),

      h2('Range and step'),
      demo(`stack({ gap: 'lg' },
  sliderField({ label: 'Volume', name: 'volume', min: 0, max: 100, value: 40 }),
  sliderField({ label: 'Columns', name: 'columns', min: 1, max: 6, step: 1, value: 3 }),
  sliderField({ label: 'Scale', name: 'scale', min: 0.5, max: 2, step: 0.25, value: 1 }),
)`, { align: 'stretch' }),

      h2('Showing the value'),
      p(
        code('showValue'),
        ' puts an ',
        code('<output>'),
        ' beside the track carrying the value the page was built with, and the input fetches its own handler on the first drag, so the number follows the thumb. There is nothing to import: a value that silently went stale would be worse than no value at all, so this one is not left to you.',
      ),
      demo(`sliderField({
  label: 'Image quality',
  name: 'jpeg-quality',
  min: 40,
  max: 100,
  value: 82,
  showValue: true,
  help: 'Higher is larger and slower to build.',
})`, { align: 'stretch' }),

      h2('Setting it from your own code'),
      p(
        'A slider is a form control, so the reader owns it — but a preset, a reset button, or a value arriving over the network still has to be able to move it. Give it an ',
        code('id'),
        ' and ',
        code('setSlider'),
        ' does, taking the ',
        code('<output>'),
        ' with it.',
      ),
      codeBlock('src/main.js', `import { setSlider } from 'sitelo/ui/client'

setSlider('volume', 50)`, 'javascript'),
      p('Or reach the module the way the components reach theirs, and skip the bundle entirely:'),
      codeBlock('Anywhere', `button({ onclick: "import('/su/slider.js').then(m=>m.set('volume',50))" }, 'Half')`, 'javascript'),
      p(
        'The browser clamps to ',
        code('min'),
        ' and ',
        code('max'),
        ' and snaps to ',
        code('step'),
        ', so what comes back is where the slider landed rather than what it was handed. ',
        code('input'),
        ' and ',
        code('change'),
        ' follow, because a preview listening for the drag has no other way to hear a move it did not cause. ',
        code('getSlider()'),
        ' reads the value back.',
      ),

      h2('Try it'),
      p('This page loads the runtime, so the buttons below really do move the slider.'),
      demo(`stack({ gap: 'md' },
  slider({ id: 'demo-slider', value: 40, showValue: true, 'aria-label': 'Demo' }),
  stack({ direction: 'row', gap: 'sm', wrap: true },
    button({ size: 'sm', variant: 'outline', onclick: "import('/su/slider.js').then(m=>m.set('demo-slider',0))" }, 'Min'),
    button({ size: 'sm', variant: 'outline', onclick: "import('/su/slider.js').then(m=>m.set('demo-slider',50))" }, 'Half'),
    button({ size: 'sm', variant: 'outline', onclick: "import('/su/slider.js').then(m=>m.set('demo-slider',100))" }, 'Max'),
  ),
)`, { align: 'stretch' }),

      h2('Colors'),
      demo(`stack({ gap: 'lg' },
  slider({ value: 70, color: 'primary', 'aria-label': 'Primary' }),
  slider({ value: 55, color: 'success', 'aria-label': 'Success' }),
  slider({ value: 35, color: 'warning', 'aria-label': 'Warning' }),
  slider({ value: 20, color: 'danger', 'aria-label': 'Danger' }),
)`, { align: 'stretch' }),

      h2('Disabled'),
      demo(`sliderField({ label: 'Locked', name: 'locked', value: 50, disabled: true })`, {
        align: 'stretch',
      }),

      h2('Without a label'),
      p(
        'A bare ',
        code('slider()'),
        ' is the control on its own — give it an ',
        code('aria-label'),
        ' when there is no visible label to point at it.',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  text({ variant: 'small', tone: 'muted' }, 'Aa'),
  slider({ min: 12, max: 24, value: 16, 'aria-label': 'Text size' }),
  text({ tone: 'muted' }, 'Aa'),
)`, { align: 'stretch' }),

      h2('In a form'),
      demo(`card(
  cardBody(
    stack({ gap: 'lg' },
      sliderField({ label: 'Max image width', name: 'max-width', min: 640, max: 2560, step: 160, value: 1280, showValue: true }),
      sliderField({ label: 'Quality', name: 'q', min: 40, max: 100, value: 82, showValue: true }),
    ),
  ),
  cardFooter({ divided: true, style: 'justify-content: flex-end' },
    button({ type: 'submit' }, 'Save'),
  ),
)`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['min', 'number | string', '0', 'Lower bound.'],
        ['max', 'number | string', '100', 'Upper bound.'],
        ['step', 'number | string', '', 'Increment. Omit for the browser default of 1.'],
        ['value', 'number | string', '', 'Initial value.'],
        ['showValue', 'boolean', 'false', 'Adds an <output> with the build-time value.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Thumb colour.'],
        ['name', 'string', '', 'Form field name; the id is derived from it.'],
        ['disabled', 'boolean', 'false', 'Disables the control.'],
      ]),
      p(
        code('sliderField()'),
        ' additionally takes ',
        code('label'),
        ', ',
        code('help'),
        ', ',
        code('error'),
        ' and ',
        code('required'),
        ' — see ',
        code('textField()'),
        '.',
      ),
    ],
  })
