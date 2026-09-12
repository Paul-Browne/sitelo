import { a, div, h2, li, p, span, ul } from 'javascript-to-html'
import { grainStyles } from 'sitelo/ui-extras'
import { code, codeBlock } from '../lib/code.js'
import { uiExtrasLayout } from '../lib/layout.js'
import { preview } from '../lib/ui-demo.js'

/**
 * One card per extra, grouped the way the sidebar is. Each `demo` is
 * rendered live into its card, the same as the `/ui` gallery.
 */
const GROUPS = [
  ['Texture', [
    ['/ui-extras/grain', 'Grain', 'Lay a film grain over anything, so a flat area of colour is not.',
      `grain({ style: 'width: 100%; background: var(--su-surface-2); padding: 0.75rem; border-radius: 0.4rem' },
        text({ variant: 'caption', align: 'center' }, 'grained'))`],
  ]],
]

/**
 * Every extra's sheet, so the gallery can draw each one. A real page
 * links only the sheets of the extras it uses.
 */
const SHEETS = [grainStyles()]

/** One gallery card. The preview is inert, the name is a stretched link. */
const galleryCard = ([href, name, summary, source]) =>
  li(
    div(
      { class: 'ui-gallery-card' },
      div(
        { class: 'ui-gallery-preview', 'data-pagefind-ignore': '', inert: true },
        preview(source),
      ),
      a({ class: 'ui-gallery-name', href }, name),
      span({ class: 'ui-gallery-summary' }, summary),
    ),
  )

export default () =>
  uiExtrasLayout({
    title: 'sitelo UI extras',
    pageTitle: 'sitelo UI extras — the components that are not for everyone',
    description:
      'Textures and effects for sitelo-ui, each with a stylesheet of its own: link only what the page uses.',
    activeHref: '/ui-extras',
    extraHead: SHEETS,
    children: [
      p(
        a({ href: '/ui' }, 'sitelo UI'),
        ' is the core: what most sites reach for, in one stylesheet. This is the rest — the textured, the decorative, the fancy — under its own entry point, ',
        code('sitelo/ui-extras'),
        ', so nothing here weighs on a page that never asks for it.',
      ),
      p(
        'Each extra ships its own stylesheet rather than a place in ',
        code('ui.css'),
        ': ',
        code('grain()'),
        ' comes with ',
        code('grainStyles()'),
        ', which goes in the head beside ',
        code('styles()'),
        ' and is served and copied by the same plugin, from the same base. A page links the sheets of the extras it uses, and only those.',
      ),
      codeBlock('src/index.ht.js', `import { html, head, body } from 'javascript-to-html'
import { styles, container, hero } from 'sitelo/ui'
import { grain, grainStyles } from 'sitelo/ui-extras'

export default () => html({ lang: 'en' },
  head(styles(), grainStyles()),
  body(
    grain({ as: 'section' },
      container(hero({ title: 'Hello' })),
    ),
  ),
)`, 'javascript'),
      p(
        'The calling convention, the ',
        code('su-'),
        ' class prefix and the theme tokens are the core’s, so an extra drops into a page the same way any component does, and follows ',
        code('theme()'),
        ' the same way. Every example here is rendered by the build that renders the page around it, in this site’s light and dark themes.',
      ),

      ...GROUPS.flatMap(([group, components]) => [
        h2(group),
        ul({ class: 'ui-gallery' }, ...components.map(galleryCard)),
      ]),

      h2('Calling from the page'),
      p(
        'An extra that can be driven from script has its calls under ',
        code('sitelo/ui-extras/client'),
        ' — ',
        code('setGrain()'),
        ' and ',
        code('getGrain()'),
        ' for grain — the same shape as ',
        code('sitelo/ui/client'),
        ', and reachable from an event attribute the same way: ',
        code("import('/su/grain.js').then(m=>m.set('hero',{seed:7}))"),
        '.',
      ),
    ],
  })
