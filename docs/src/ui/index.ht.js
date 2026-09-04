import { a, div, h2, li, p, span, ul } from 'javascript-to-html'
import { code } from '../lib/code.js'
import { uiLayout } from '../lib/layout.js'
import { preview, uiStyles } from '../lib/ui-demo.js'

/** Cards on this page: one per component page, with a live preview. */
const COMPONENTS = [
  {
    href: '/ui/button',
    name: 'Button',
    summary: 'Five variants, five colors, three sizes — and an anchor whenever it navigates.',
    demo: `stack({ direction: 'row', gap: 'sm' },
      button({ size: 'sm' }, 'Save'),
      button({ size: 'sm', variant: 'outline' }, 'Cancel'),
    )`,
  },
  {
    href: '/ui/button-group',
    name: 'Button group',
    summary: 'Buttons that belong together, joined into one control.',
    demo: `buttonGroup({ label: 'Preview' },
      button({ size: 'sm', variant: 'outline', color: 'neutral' }, 'One'),
      button({ size: 'sm', variant: 'outline', color: 'neutral' }, 'Two'),
      button({ size: 'sm', variant: 'outline', color: 'neutral' }, 'Three'),
    )`,
  },
  {
    href: '/ui/text-field',
    name: 'Text field',
    summary: 'Label, control, help text and error message, wired together.',
    demo: `textField({ label: 'Email', name: 'preview-email', size: 'sm', placeholder: 'ada@example.com' })`,
  },
  {
    href: '/ui/select',
    name: 'Select',
    summary: 'A native select, styled to match, with options built from data.',
    demo: `selectField({ label: 'Theme', name: 'preview-theme', size: 'sm', options: ['Light', 'Dark', 'System'], value: 'Dark' })`,
  },
  {
    href: '/ui/checkbox',
    name: 'Checkbox',
    summary: 'A real input, styled with CSS rather than replaced.',
    demo: `stack({ gap: 'sm' },
      checkbox({ label: 'Sitemap', checked: true }),
      checkbox({ label: 'RSS feed' }),
    )`,
  },
  {
    href: '/ui/radio',
    name: 'Radio group',
    summary: 'One choice out of several, as radios sharing a name.',
    demo: `choiceGroup({ name: 'preview-plan', direction: 'row', value: 'pro', options: ['free', 'pro'] })`,
  },
  {
    href: '/ui/switch',
    name: 'Switch',
    summary: 'An on/off toggle for a setting that applies immediately.',
    demo: `stack({ gap: 'sm' },
      toggle({ label: 'Public site', checked: true }),
      toggle({ label: 'Drafts' }),
    )`,
  },
]

export default () =>
  uiLayout({
    title: 'sitelo UI',
    pageTitle: 'sitelo UI — components for sitelo',
    description:
      'A component library for sitelo: buttons, cards, forms, tables and modals, as functions that return HTML.',
    activeHref: '/ui',
    extraHead: uiStyles(),
    children: [
      p(
        'sitelo-ui is a component library for sitelo. Every component is a function that returns a string of HTML, so it nests straight into the page you are already writing — no compiler, no runtime, no hydration.',
      ),
      p(
        'Every example on these pages is rendered by the same build that renders the page around it. What you see is what the code beneath it produced, and it follows this site’s light and dark themes because sitelo-ui reads the same ',
        code('data-theme'),
        ' attribute the docs do.',
      ),

      h2('Inputs'),
      ul(
        { class: 'ui-gallery' },
        ...COMPONENTS.map((component) =>
          li(
            /*
             * The card is a div, not an anchor: these previews contain
             * real buttons and inputs, and interactive content cannot
             * nest inside a link. The name's anchor stretches over the
             * whole card instead, and `inert` takes the demo controls
             * out of the tab order and the accessibility tree.
             */
            div(
              { class: 'ui-gallery-card' },
              div(
                { class: 'ui-gallery-preview', 'data-pagefind-ignore': '', inert: true },
                preview(component.demo),
              ),
              a(
                { class: 'ui-gallery-name', href: component.href },
                component.name,
              ),
              span({ class: 'ui-gallery-summary' }, component.summary),
            ),
          ),
        ),
      ),

      h2('Getting set up'),
      p(
        'Two lines: import the components, and put ',
        code('styles()'),
        ' in the head. The ',
        a({ href: '/docs/ui' }, 'Components page in the docs'),
        ' covers installation, theming, the calling convention, and the optional client runtime — and lists every export, including the groups that do not have pages here yet.',
      ),
      p(
        'The ',
        code('examples/ui'),
        ' directory in the repository renders the whole set on one page.',
      ),
    ],
  })
