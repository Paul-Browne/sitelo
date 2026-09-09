import { h2, p } from 'javascript-to-html'
import { code, codeBlock } from '../lib/code.js'
import { uiLayout } from '../lib/layout.js'
import { demo, propsTable, uiHead } from '../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Progress',
    description:
      'A bar for work with a known end, a spinner for work without one.',
    activeHref: '/ui/progress',
    extraHead: uiHead(),
    children: [
      p(
        'Use a determinate bar whenever you know how much is left — it is the only one that tells the reader anything. Omit ',
        code('value'),
        ' and the bar animates instead, which says "still working" and nothing more.',
      ),

      h2('Determinate'),
      demo(`stack({ gap: 'lg' },
  progress({ value: 25 }),
  progress({ value: 60 }),
  progress({ value: 100 }),
)`, { align: 'stretch' }),

      h2('Indeterminate'),
      demo(`progress()`, { align: 'stretch' }),
      p(
        'A bar with no ',
        code('label'),
        ' is marked ',
        code('aria-hidden'),
        ' — a progressbar role with no accessible name tells a screen reader nothing, so an unlabelled bar is treated as decoration. Label anything a reader is meant to follow.',
      ),

      h2('Labels'),
      p(
        'A label names what is happening; ',
        code('showValue'),
        ' adds the percentage on the right.',
      ),
      demo(`stack({ gap: 'lg' },
  progress({ value: 72, label: 'Rendering pages', showValue: true }),
  progress({ value: 30, max: 60, label: 'Optimising images', showValue: true }),
  progress({ label: 'Waiting for the deploy' }),
)`, { align: 'stretch' }),

      h2('Colors and height'),
      demo(`stack({ gap: 'lg' },
  progress({ value: 80, color: 'success', label: 'Passed', showValue: true }),
  progress({ value: 45, color: 'warning', label: 'Degraded', showValue: true }),
  progress({ value: 20, color: 'danger', label: 'Failing', showValue: true }),
  progress({ value: 60, color: 'neutral', height: 'xs' }),
  progress({ value: 60, color: 'primary', height: '1rem' }),
)`, { align: 'stretch' }),

      h2('A scale other than 100'),
      p(
        code('max'),
        ' lets you pass the raw numbers — pages built out of pages total — instead of working out a percentage first.',
      ),
      demo(`progress({ value: 118, max: 169, label: '118 of 169 pages', showValue: true })`, {
        align: 'stretch',
      }),

      h2('Moving it from the browser'),
      p(
        'A bar is server-rendered HTML: the percentage is a custom property on the fill and a number in ',
        code('aria-valuenow'),
        ', and nothing on the page changes either on its own. Give the bar an ',
        code('id'),
        ' and ',
        code('setProgress'),
        ' moves both together — the fill, the announced value, and the percentage beside the label.',
      ),
      codeBlock('src/main.js', `import { setProgress } from 'sitelo/ui/client'

const request = new XMLHttpRequest()

request.upload.addEventListener('progress', (event) => {
  setProgress('upload', event.loaded, { max: event.total })
})`, 'javascript'),
      p(
        'The maximum is remembered, so later calls are just a value. Or reach the module the way the components reach theirs, and skip the bundle entirely:',
      ),
      codeBlock('Anywhere', `button({ onclick: "import('/su/progress.js').then(m=>m.set('upload',100))" }, 'Finish')`, 'javascript'),
      p(
        'Passing ',
        code('null'),
        ' — or anything that is not a finite number — hands the bar back to the indeterminate animation, so work that stops reporting numbers does not have to be special-cased. ',
        code('getProgress()'),
        ' reads the current value back, on the bar’s own scale.',
      ),

      h2('Try it'),
      p('This page loads the runtime, so the buttons below really do move the bar.'),
      demo(`stack({ gap: 'md' },
  progress({ id: 'demo-progress', value: 0, label: 'Uploading', showValue: true }),
  stack({ direction: 'row', gap: 'sm', wrap: true },
    button({ size: 'sm', variant: 'outline', onclick: "import('/su/progress.js').then(m=>m.set('demo-progress',0))" }, 'Reset'),
    button({ size: 'sm', variant: 'outline', onclick: "import('/su/progress.js').then(m=>m.set('demo-progress',35))" }, '35%'),
    button({ size: 'sm', variant: 'outline', onclick: "import('/su/progress.js').then(m=>m.set('demo-progress',80))" }, '80%'),
    button({ size: 'sm', variant: 'outline', onclick: "import('/su/progress.js').then(m=>m.set('demo-progress',100))" }, 'Done'),
    button({ size: 'sm', variant: 'ghost', onclick: "import('/su/progress.js').then(m=>m.set('demo-progress',null))" }, 'Unknown'),
  ),
)`, { align: 'stretch' }),
      p(
        'An unlabelled bar is moved too, but it stays ',
        code('aria-hidden'),
        ' — it was rendered without a name on purpose, and announcing a value on it now would put a nameless progressbar in the accessibility tree.',
      ),

      h2('Spinner'),
      p(
        'There is no spinner component — the spinner is an icon, and ',
        code('spin'),
        ' is what turns it. Like every icon it is sized in ',
        code('em'),
        ', so it matches whatever text it sits beside without being told a size.',
      ),
      demo(`stack({ direction: 'row', gap: 'lg', align: 'center' },
  icon('spinner', { spin: true, size: 'sm' }),
  icon('spinner', { spin: true }),
  icon('spinner', { spin: true, size: 'lg' }),
)`),

      h2('Spinner in context'),
      p(
        'Give a standalone spinner a ',
        code('label'),
        ' so it is announced. One inside a button does not need one — the button already says what it is doing.',
      ),
      demo(`stack({ gap: 'md' },
  stack({ direction: 'row', gap: 'sm', align: 'center' },
    icon('spinner', { spin: true, label: 'Loading' }),
    text({ variant: 'small', tone: 'muted' }, 'Fetching the latest build…'),
  ),
  stack({ direction: 'row', gap: 'sm' },
    button({ loading: true }, 'Deploying'),
    button({ variant: 'outline', loading: true }, 'Checking links'),
  ),
)`, { align: 'start' }),

      h2('Props'),
      p(code('progress()'), ' — exported as ', code('progressBar'), ' too:'),
      propsTable([
        ['value', 'number', '', 'How far along. Omit for the indeterminate animation.'],
        ['max', 'number', '100', 'What value counts as complete.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Fill colour.'],
        ['label', 'Child', '', 'Text above the bar; also its accessible name.'],
        ['showValue', 'boolean', 'false', 'Show the percentage beside the label.'],
        ['height', 'Space', "'0.5rem'", 'Bar thickness.'],
      ]),
      p(code('setProgress()'), ' from ', code('sitelo/ui/client'), ':'),
      propsTable([
        ['target', 'Element | string', '', 'The bar, or the id of one. A selector is tried if no element has that id.'],
        ['value', 'number | null', '', 'Where to move it. null returns it to the indeterminate animation.'],
        ['options.max', 'number', '100', 'What counts as complete. Remembered for the calls after it.'],
      ]),
      p(
        'The spinner has no props of its own — it is ',
        code("icon('spinner', { spin: true })"),
        ', and takes whatever ',
        code('icon()'),
        ' takes.',
      ),
    ],
  })
