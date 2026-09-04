import { h2, p } from 'javascript-to-html'
import { code } from '../lib/code.js'
import { uiLayout } from '../lib/layout.js'
import { demo, propsTable, uiHead } from '../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Accordion',
    description:
      'Collapsible sections, using the browser’s own <details> — including its exclusive mode.',
    activeHref: '/ui/accordion',
    extraHead: uiHead(),
    children: [
      p(
        'Each section is a ',
        code('<details>'),
        '. Opening, closing, keyboard support and find-in-page all come from the browser, and the accordion works with JavaScript off — which for an FAQ, the most common use, matters.',
      ),

      h2('Basic accordion'),
      demo(`accordion({
  items: [
    { title: 'What is sitelo?', content: 'A static site generator built on Vite. Pages are functions that return HTML.' },
    { title: 'Does it ship a runtime?', content: 'No. Nothing reaches the browser unless you link a script yourself.' },
    { title: 'Can I use TypeScript?', content: 'Yes — .ht.ts and .ht.tsx are page extensions like any other.' },
  ],
})`, { align: 'stretch' }),

      h2('Open by default'),
      demo(`accordion({
  items: [
    { title: 'Open on arrival', content: 'This one has open: true.', open: true },
    { title: 'Closed', content: 'This one does not.' },
  ],
})`, { align: 'stretch' }),

      h2('One at a time'),
      p(
        'A shared ',
        code('name'),
        ' makes the sections mutually exclusive — opening one closes the others. That is the browser’s own behaviour for ',
        code('<details name>'),
        ', not a script.',
      ),
      demo(`accordion({
  name: 'demo-exclusive',
  items: [
    { title: 'First', content: 'Open another and this one closes.', open: true },
    { title: 'Second', content: 'And so does this one.' },
    { title: 'Third', content: 'Only one is ever open.' },
  ],
})`, { align: 'stretch' }),

      h2('Rich content'),
      p(
        'Build the sections with ',
        code('accordionItem()'),
        ' when the content is more than a paragraph.',
      ),
      demo(`accordion(
  accordionItem({ title: 'Install', open: true },
    stack({ gap: 'sm' },
      text({ variant: 'small', tone: 'muted' }, 'Add the package and its markup companion:'),
      code('npm install sitelo javascript-to-html'),
    ),
  ),
  accordionItem({ title: 'Configure' },
    stack({ gap: 'sm' },
      text({ variant: 'small', tone: 'muted' }, 'Optional. Vite options live under the vite key.'),
      code('sitelo.config.js'),
    ),
  ),
  accordionItem({ title: 'Deploy' },
    stack({ gap: 'sm' },
      text({ variant: 'small', tone: 'muted' }, 'Publish the output directory to any static host.'),
      stack({ direction: 'row', gap: 'sm', wrap: true },
        chip({ size: 'sm' }, 'Netlify'),
        chip({ size: 'sm' }, 'Vercel'),
        chip({ size: 'sm' }, 'Cloudflare Pages'),
        chip({ size: 'sm' }, 'GitHub Pages'),
      ),
    ),
  ),
)`, { align: 'stretch' }),

      h2('An FAQ'),
      p(
        'The shape this component exists for: content that is already in the HTML, collapsed for scanning, and findable by a search engine because it never left the page.',
      ),
      demo(`return (() => {
  const faq = [
    ['Is it really zero-config?', 'A project with one file in src/ and no config builds. Everything else is opt-in.'],
    ['How do dynamic routes work?', 'Brackets in filenames. generateStaticParams lists what to build.'],
    ['What about search?', 'Set pagefind: true and the build indexes every page.'],
  ]

  return accordion({
    name: 'demo-faq',
    items: faq.map(([title, content]) => ({ title, content })),
  })
})()`, { align: 'stretch' }),

      h2('Props'),
      p(code('accordion()'), ':'),
      propsTable([
        ['items', 'Array', '[]', 'Strings, or { title, content, open } objects.'],
        ['name', 'string', '', 'A shared name makes the sections mutually exclusive.'],
      ]),
      p(code('accordionItem()'), ':'),
      propsTable([
        ['title', 'Child', '', 'The summary line.'],
        ['open', 'boolean', 'false', 'Whether it starts expanded.'],
        ['name', 'string', '', 'Same effect as on the parent, when building items by hand.'],
      ]),
    ],
  })
