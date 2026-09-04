import { a, div, h2, li, p, span, ul } from 'javascript-to-html'
import { code } from '../lib/code.js'
import { uiLayout } from '../lib/layout.js'
import { preview, uiHead } from '../lib/ui-demo.js'

/**
 * One card per component page, grouped exactly as the component
 * reference is. Each `demo` is rendered live into its card.
 */
const GROUPS = [
  ['Layout', [
    ['/ui/container', 'Container', 'A centred, width-limited page column.',
      `container({ size: 'sm', style: 'background: var(--su-surface-2); padding: 0.5rem; border-radius: 0.4rem' },
        text({ variant: 'caption', align: 'center' }, 'centred'))`],
    ['/ui/stack', 'Stack', 'A flex row or column with a spacing token for the gap.',
      `stack({ direction: 'row', gap: 'sm' }, chip('one'), chip('two'), chip('three'))`],
    ['/ui/grid', 'Grid', 'Fits as many columns as will fit, with no media queries.',
      `grid({ min: '3.5rem', gap: 'xs' },
        chip({ size: 'sm' }, '1'), chip({ size: 'sm' }, '2'), chip({ size: 'sm' }, '3'), chip({ size: 'sm' }, '4'))`],
    ['/ui/divider', 'Divider', 'A rule between sections, with or without a label.',
      `div({ style: 'width: 100%' }, divider('or'))`],
    ['/ui/aspect-ratio', 'Aspect ratio', 'Hold a box at a fixed shape, so nothing shifts on load.',
      `aspectRatio({ ratio: '16 / 9', style: 'width: 6rem; background: var(--su-surface-2); border-radius: 0.4rem' }, '')`],
    ['/ui/card', 'Card', 'A surface for grouped content, with header, body and footer.',
      `card({ variant: 'flat', style: 'width: 100%' }, cardBody(text({ variant: 'small' }, 'A card')))`],
  ]],
  ['Typography', [
    ['/ui/typography', 'Typography', 'A type scale that picks its own element.',
      `stack({ gap: 'none' }, text({ variant: 'h5', as: 'div' }, 'Heading'), text({ variant: 'caption', tone: 'muted' }, 'Caption'))`],
    ['/ui/prose', 'Prose', 'Style raw HTML from Markdown or a CMS.',
      `prose({ size: 'sm', style: 'text-align: left' }, '<p><strong>A heading</strong></p><p>And a paragraph.</p>')`],
    ['/ui/link', 'Link', 'A styled anchor, with the attributes an external link needs.',
      `text({ variant: 'small' }, 'Read the ', link({ href: '/docs' }, 'docs'), '.')`],
  ]],
  ['Inputs', [
    ['/ui/button', 'Button', 'Five variants, five colors, three sizes.',
      `stack({ direction: 'row', gap: 'sm' }, button({ size: 'sm' }, 'Save'), button({ size: 'sm', variant: 'outline' }, 'Cancel'))`],
    ['/ui/button-group', 'Button group', 'Buttons joined into one control.',
      `buttonGroup({ label: 'Preview' },
        button({ size: 'sm', variant: 'outline', color: 'neutral' }, 'One'),
        button({ size: 'sm', variant: 'outline', color: 'neutral' }, 'Two'))`],
    ['/ui/text-field', 'Text field', 'Label, control, help text and error, wired together.',
      `textField({ label: 'Email', name: 'g-email', size: 'sm', placeholder: 'ada@example.com' })`],
    ['/ui/select', 'Select', 'A native select, styled to match.',
      `selectField({ label: 'Theme', name: 'g-theme', size: 'sm', options: ['Light', 'Dark'], value: 'Dark' })`],
    ['/ui/checkbox', 'Checkbox', 'A real input, styled with CSS rather than replaced.',
      `stack({ gap: 'sm' }, checkbox({ label: 'Sitemap', checked: true }), checkbox({ label: 'RSS feed' }))`],
    ['/ui/radio', 'Radio group', 'One choice out of several, as radios sharing a name.',
      `choiceGroup({ name: 'g-plan', direction: 'row', value: 'pro', options: ['free', 'pro'] })`],
    ['/ui/switch', 'Switch', 'An on/off toggle for a setting that applies immediately.',
      `stack({ gap: 'sm' }, toggle({ label: 'Public', checked: true }), toggle({ label: 'Drafts' }))`],
    ['/ui/slider', 'Slider', 'A native range input, styled to match.',
      `div({ style: 'width: 100%' }, slider({ value: 60, 'aria-label': 'Preview' }))`],
    ['/ui/toggle-button', 'Toggle button', 'A button that stays pressed.',
      `stack({ direction: 'row', gap: 'xs' }, toggleButton({ size: 'sm', pressed: true }, 'On'), toggleButton({ size: 'sm' }, 'Off'))`],
    ['/ui/toggle-group', 'Toggle group', 'A segmented control, as buttons or as links.',
      `toggleGroup({ size: 'sm', label: 'Preview', value: 'b', items: ['a', 'b', 'c'] })`],
  ]],
  ['Data display', [
    ['/ui/avatar', 'Avatar', 'An image when there is one, initials when there is not.',
      `avatarGroup({ max: 3 }, avatar({ name: 'Ada L' }), avatar({ name: 'Grace H' }), avatar({ name: 'Alan T' }), avatar({ name: 'Barbara L' }))`],
    ['/ui/badge', 'Badge', 'A count or a dot pinned to a corner.',
      `badge({ content: 12 }, button({ size: 'sm', variant: 'soft', color: 'neutral' }, 'Inbox'))`],
    ['/ui/chip', 'Chip', 'A tag, a status, a filter.',
      `stack({ direction: 'row', gap: 'xs' }, chip({ color: 'success', dot: true }, 'passed'), chip({ color: 'neutral' }, 'static'))`],
    ['/ui/tooltip', 'Tooltip', 'A hint on hover and focus, drawn entirely in CSS.',
      `tooltip({ content: 'No script needed' }, button({ size: 'sm', variant: 'outline', color: 'neutral' }, 'Hover me'))`],
    ['/ui/table', 'Table', 'Rows and columns from data, in a scroll container.',
      `table({ dense: true, columns: [{ key: 'p', header: 'Page' }, { key: 's', header: 'Size', align: 'end' }],
        rows: [{ p: '/', s: '4.1 kB' }, { p: '/docs', s: '12.7 kB' }] })`],
    ['/ui/list', 'List', 'Rows with something on either side.',
      `list({ plain: true }, listItem({ title: 'Routing', description: 'File based' }))`],
    ['/ui/figure', 'Figure', 'An image and its caption, as one figure.',
      `figure({ src: '/logo.svg', alt: '', caption: 'A caption', style: 'width: 7rem' })`],
  ]],
  ['Feedback', [
    ['/ui/alert', 'Alert', 'A message whose icon and ARIA role follow its colour.',
      `alert({ color: 'success' }, 'Deployed.')`],
    ['/ui/empty', 'Empty', 'What a list looks like before it has anything in it.',
      `empty({ title: 'Nothing here', style: 'padding: 0' })`],
    ['/ui/progress', 'Progress', 'A bar for known work, a spinner for the rest.',
      `div({ style: 'width: 100%' }, progress({ value: 62 }))`],
    ['/ui/skeleton', 'Skeleton', 'A placeholder shaped like the content to come.',
      `div({ style: 'width: 100%' }, skeleton({ lines: 3 }))`],
    ['/ui/toast', 'Toast', 'A transient message, appended from script.',
      `stack({ direction: 'row', gap: 'xs' }, chip({ size: 'sm', color: 'success' }, 'Saved.'))`],
  ]],
  ['Navigation', [
    ['/ui/breadcrumbs', 'Breadcrumbs', 'The trail of ancestors ending at this page.',
      `breadcrumbs({ items: [{ label: 'Docs', href: '/docs' }, { label: 'UI' }] })`],
    ['/ui/pagination', 'Pagination', 'Numbered pages, windowed, as real links.',
      `pagination({ page: 2, count: 5, href: (page) => '/ui#p' + page })`],
    ['/ui/tabs', 'Tabs', 'Links, one page per tab — or panels that swap in place.',
      `tabs({ variant: 'pills', items: [{ label: 'One', href: '/ui#t1', active: true }, { label: 'Two', href: '/ui#t2' }] })`],
    ['/ui/app-bar', 'App bar', 'Brand on one side, navigation and actions on the other.',
      `appBar({ brand: 'sitelo', style: 'width: 100%; min-height: 2.5rem' }, appBarSpacer(), appBarActions(chip({ size: 'sm' }, 'v2')))`],
    ['/ui/theme-toggle', 'Theme toggle', 'Light and dark, without the flash on the way in.',
      `themeToggle()`],
  ]],
  ['Overlays', [
    ['/ui/modal', 'Modal', 'A dialog on the popover API — no script anywhere.',
      `button({ size: 'sm', variant: 'outline', color: 'neutral' }, 'Open modal')`],
    ['/ui/drawer', 'Drawer', 'A panel from the edge, same popover mechanics.',
      `button({ size: 'sm', variant: 'outline', color: 'neutral' }, 'Open drawer')`],
    ['/ui/menu', 'Menu', 'A dropdown built on details, open and close for free.',
      `chip({ color: 'neutral' }, 'Actions ▾')`],
    ['/ui/accordion', 'Accordion', 'Collapsible sections, including exclusive mode.',
      `div({ style: 'width: 100%' }, accordion({ items: [{ title: 'A question' }] }))`],
    ['/ui/collapsible', 'Collapsible', 'One "show more", without accordion chrome.',
      `collapsible({ trigger: 'Show more' }, 'Hidden until asked for.')`],
  ]],
  ['Sections', [
    ['/ui/hero', 'Hero', 'The top of a landing page: headline, sentence, actions.',
      `stack({ gap: 'xs', align: 'center' }, text({ variant: 'h6', as: 'div' }, 'A headline'), text({ variant: 'caption', tone: 'muted' }, 'And a sentence.'))`],
    ['/ui/footer', 'Footer', 'Columns of links, and a line under them.',
      `stack({ gap: 'xs', style: 'width: 100%' }, text({ variant: 'overline' }, 'Docs'), text({ variant: 'caption', tone: 'muted' }, 'Guide · Components'))`],
    ['/ui/stat', 'Stat', 'A number worth looking at, and what it means.',
      `stat({ label: 'Pages', value: '204', change: '+8', color: 'success' })`],
    ['/ui/steps', 'Steps', 'A numbered flow, with what is done marked done.',
      `div({ style: 'width: 100%' }, steps({ direction: 'vertical', current: 1, items: ['Install', 'Build'] }))`],
    ['/ui/timeline', 'Timeline', 'Entries in order, down a line.',
      `div({ style: 'width: 100%' }, timeline({ items: [{ time: 'v2.7', title: 'Sections', color: 'primary' }] }))`],
    ['/ui/mockup', 'Mockup', 'A screenshot in a browser, window, phone or terminal.',
      `mockup({ variant: 'browser', url: 'sitelo.dev', style: 'width: 100%' }, div({ style: 'height: 2.5rem; background: var(--su-surface-2)' }))`],
  ]],
  ['Styling', [
    ['/ui/theming', 'Theming', 'Every colour, radius and font, from one call.',
      `stack({ direction: 'row', gap: 'xs' },
        ...['primary', 'success', 'warning', 'danger'].map((color) =>
          div({ style: 'width: 1.5rem; height: 1.5rem; border-radius: 0.3rem; background: var(--su-' + color + ')' })))`],
  ]],
]

/** One gallery card. The preview is inert, the name is a stretched link. */
const galleryCard = ([href, name, summary, source]) =>
  li(
    /*
     * A div, not an anchor: these previews contain real buttons and
     * inputs, and interactive content cannot nest inside a link. The
     * name's anchor stretches over the whole card instead, and `inert`
     * takes the demo controls out of the tab order and the
     * accessibility tree.
     */
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
  uiLayout({
    title: 'sitelo UI',
    pageTitle: 'sitelo UI — components for sitelo',
    description:
      'A component library for sitelo: buttons, cards, forms, tables and modals, as functions that return HTML.',
    activeHref: '/ui',
    extraHead: uiHead(),
    children: [
      p(
        'sitelo-ui is a component library for sitelo. Every component is a function that returns a string of HTML, so it nests straight into the page you are already writing — no compiler, no runtime, no hydration.',
      ),
      p(
        'Every example in this section is rendered by the same build that renders the page around it. What you see is what the code beneath it produced, and it follows this site’s light and dark themes because sitelo-ui reads the same ',
        code('data-theme'),
        ' attribute the docs do.',
      ),

      ...GROUPS.flatMap(([group, components]) => [
        h2(group),
        ul({ class: 'ui-gallery' }, ...components.map(galleryCard)),
      ]),

      h2('Getting set up'),
      p(
        'Two lines: import the components, and put ',
        code('styles()'),
        ' in the head. The ',
        a({ href: '/docs/ui' }, 'Components page in the docs'),
        ' covers installation, theming, the calling convention and the optional client runtime, and lists every export in one table.',
      ),
      p(
        'The ',
        code('examples/ui'),
        ' directory in the repository renders the whole set on a single page.',
      ),
    ],
  })
