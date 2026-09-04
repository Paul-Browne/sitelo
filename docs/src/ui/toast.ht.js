import { h2, p } from 'javascript-to-html'
import { code, codeBlock } from '../lib/code.js'
import { uiLayout } from '../lib/layout.js'
import { demo, preview, propsTable, uiHead } from '../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Toast',
    description:
      'A transient message in the corner, added from script into a region the page rendered.',
    activeHref: '/ui/toast',
    extraHead: uiHead(),
    children: [
      p(
        'A toast is the one component here that cannot be static: it appears in response to something happening. The page renders an empty region with ',
        code('toasts()'),
        ', and ',
        code('toast()'),
        ' from ',
        code('sitelo/ui/client'),
        ' appends to it.',
      ),
      p(
        'The region is a polite live region, so anything appended is announced without stealing focus.',
      ),

      h2('Setting it up'),
      p('Put the region anywhere in the body — it is fixed-position, so where does not matter:'),
      codeBlock('src/index.ht.js', `import { toasts } from 'sitelo/ui'

body(
  // …the page…
  toasts(),
)`, 'javascript'),
      p('And load the runtime from a bundled entry file:'),
      codeBlock('src/main.js', `import { toast } from 'sitelo/ui/client'

document.querySelector('#save').addEventListener('click', () => {
  toast('Saved.', { color: 'success' })
})`, 'javascript'),

      h2('Try it'),
      p(
        'This page renders a ',
        code('toasts()'),
        ' region and loads the runtime, so the buttons below really do produce toasts — bottom right.',
      ),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  button({
    variant: 'soft',
    color: 'success',
    onclick: "window.siteloUiToast && window.siteloUiToast('Saved.', 'success')",
  }, 'Success'),
  button({
    variant: 'soft',
    color: 'warning',
    onclick: "window.siteloUiToast && window.siteloUiToast('Two pages have no meta description.', 'warning')",
  }, 'Warning'),
  button({
    variant: 'soft',
    color: 'danger',
    onclick: "window.siteloUiToast && window.siteloUiToast('The build failed. Check the link report.', 'danger')",
  }, 'Danger'),
  button({
    variant: 'soft',
    color: 'neutral',
    onclick: "window.siteloUiToast && window.siteloUiToast('This one stays until you close it.', 'neutral', 0)",
  }, 'Until dismissed'),
)`),
      // The live region this page's buttons append into. Fixed-position,
      // so it renders here but appears in the corner of the viewport.
      preview('toasts()'),

      h2('Options'),
      p(
        code('duration'),
        ' is how long the toast stays, in milliseconds; ',
        code('0'),
        ' keeps it up until someone closes it. Every toast gets a close button, wired to the same dismiss handler an alert uses.',
      ),
      codeBlock('Options', `toast('Saved.', { color: 'success' })
toast('Still working…', { color: 'neutral', duration: 0 })
toast('Deployed in 1.7s', { color: 'success', duration: 8000 })`, 'javascript'),

      h2('What it renders'),
      p(
        'A toast is an ',
        code('alert()'),
        ' in the toasts region — same markup, same colours, same dismiss button. Nothing new to learn, and nothing extra to style.',
      ),
      demo(`stack({ gap: 'sm', style: 'width: 100%; max-width: 24rem' },
  alert({ color: 'success', dismissible: true }, 'Saved.'),
  alert({ color: 'danger', dismissible: true }, 'The build failed. Check the link report.'),
)`, { align: 'stretch' }),

      h2('When to use one'),
      p(
        'A toast is for confirming something the reader just did. It is the wrong place for anything they need to act on or read carefully — it disappears, it is easy to miss, and on a static site most messages belong in the page itself as an ',
        code('alert()'),
        '.',
      ),

      h2('Props'),
      p(code('toasts()'), ' takes no props of its own. ', code('toast()'), ' from ', code('sitelo/ui/client'), ':'),
      propsTable([
        ['message', 'string', '', 'The text. Set as textContent, so it is never parsed as markup.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'neutral'", 'Which palette to use.'],
        ['duration', 'number', '4000', 'Milliseconds before it disappears. 0 keeps it up.'],
      ], { headers: ['Argument', 'Type', 'Default', 'Description'] }),
      p(
        'It returns the element it added, or ',
        code('null'),
        ' when the page has no ',
        code('toasts()'),
        ' region.',
      ),
    ],
  })

