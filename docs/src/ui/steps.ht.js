import { h2, p } from 'javascript-to-html'
import { code, codeBlock } from '../lib/code.js'
import { uiLayout } from '../lib/layout.js'
import { demo, propsTable, uiHead } from '../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Steps',
    description:
      'A numbered flow, with the steps behind you marked done.',
    activeHref: '/ui/steps',
    extraHead: uiHead(),
    children: [
      p(
        code('current'),
        ' is the index of the step in progress. Everything before it is complete and gets a tick; everything after is still to come. The current one is marked ',
        code('aria-current="step"'),
        ', so it is announced as well as coloured.',
      ),

      h2('Basic steps'),
      demo(`steps({
  current: 1,
  items: [
    { title: 'Install' },
    { title: 'Write a page' },
    { title: 'Build' },
    { title: 'Deploy' },
  ],
})`, { align: 'stretch' }),

      h2('With descriptions'),
      demo(`steps({
  current: 2,
  items: [
    { title: 'Install', description: 'npm install -D sitelo' },
    { title: 'Write a page', description: 'src/index.ht.js' },
    { title: 'Build', description: 'sitelo build' },
    { title: 'Deploy', description: 'Publish dist/' },
  ],
})`, { align: 'stretch' }),

      h2('Vertical'),
      p('Better when the descriptions are longer than a few words.'),
      demo(`steps({
  direction: 'vertical',
  current: 1,
  items: [
    { title: 'Add the package', description: 'sitelo brings its own Vite, so there is nothing else to install.' },
    { title: 'Write a function that returns HTML', description: 'One file under src/ is a whole site.' },
    { title: 'Publish the output', description: 'dist/ is plain static files — any host will take them.' },
  ],
})`, { align: 'stretch' }),

      h2('Nothing done yet'),
      demo(`steps({ current: 0, items: ['Install', 'Configure', 'Deploy'] })`, { align: 'stretch' }),

      h2('All done'),
      p(
        'Set ',
        code('current'),
        ' past the last index and every step reads as complete.',
      ),
      demo(`steps({ current: 3, items: ['Install', 'Configure', 'Deploy'] })`, { align: 'stretch' }),

      h2('On a phone'),
      p(
        'A horizontal row has nowhere to go on a narrow screen, so it turns vertical on its own below 40rem — no prop needed. Narrow this window to see it.',
      ),

      h2('Labelling it'),
      p(
        'The list is an ',
        code('<ol>'),
        ', which already carries the order. Add ',
        code('label'),
        ' when the page has more than one set of steps and they need telling apart.',
      ),
      demo(`steps({
  label: 'Deployment progress',
  current: 1,
  items: ['Build', 'Upload', 'Invalidate cache'],
})`, { align: 'stretch' }),

      h2('Advancing the flow'),
      p(
        'The state is three class names and one ',
        code('aria-current'),
        ', spread across every step. ',
        code('setStep()'),
        ' moves them together, so a wizard that advances in the browser is one call rather than a loop.',
      ),
      p('An index past the last step leaves every one of them complete, which is what a finished flow looks like. Or from an event attribute, with nothing bundled:'),
      codeBlock('Anywhere', `button({ onclick: "import('/su/steps.js').then(m=>m.set('checkout',2))" }, 'Next')`, 'javascript'),
      p('Or from your own module, when there is already one running:'),
      codeBlock('src/main.js', `import { setStep } from 'sitelo/ui/client'

setStep('checkout', 2)`, 'javascript'),

      h2('Props'),
      propsTable([
        ['items', 'Array', '[]', 'Strings, or { title, description } objects.'],
        ['current', 'number', '0', 'Index of the step in progress.'],
        ['direction', "'horizontal' | 'vertical'", "'horizontal'", 'Layout. Horizontal turns vertical under 40rem.'],
        ['label', 'string', '', 'Accessible name for the list.'],
      ]),
    ],
  })
