import { h2, p } from 'javascript-to-html'
import { code } from '../lib/code.js'
import { uiLayout } from '../lib/layout.js'
import { demo, propsTable, uiHead } from '../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Chip',
    description:
      'A compact label — a tag, a status, a filter, a count.',
    activeHref: '/ui/chip',
    extraHead: uiHead(),
    children: [
      p(
        'Chips are small pieces of metadata: the tags on a blog post, the status of a build, the categories on a page. They are inline by default, so a row of them wants a ',
        code('stack'),
        ' with ',
        code('wrap'),
        '.',
      ),

      h2('Basic chip'),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  chip('static'),
  chip('vite'),
  chip('zero-runtime'),
)`),

      h2('Colors'),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  chip({ color: 'primary' }, 'primary'),
  chip({ color: 'neutral' }, 'neutral'),
  chip({ color: 'success' }, 'success'),
  chip({ color: 'warning' }, 'warning'),
  chip({ color: 'danger' }, 'danger'),
)`),

      h2('Variants'),
      demo(`stack({ gap: 'sm' },
  stack({ direction: 'row', gap: 'sm', wrap: true },
    chip({ variant: 'soft', color: 'primary' }, 'soft'),
    chip({ variant: 'soft', color: 'success' }, 'soft'),
    chip({ variant: 'soft', color: 'danger' }, 'soft'),
  ),
  stack({ direction: 'row', gap: 'sm', wrap: true },
    chip({ variant: 'outline', color: 'primary' }, 'outline'),
    chip({ variant: 'outline', color: 'success' }, 'outline'),
    chip({ variant: 'outline', color: 'danger' }, 'outline'),
  ),
  stack({ direction: 'row', gap: 'sm', wrap: true },
    chip({ variant: 'solid', color: 'primary' }, 'solid'),
    chip({ variant: 'solid', color: 'success' }, 'solid'),
    chip({ variant: 'solid', color: 'danger' }, 'solid'),
  ),
)`, { align: 'start' }),

      h2('Sizes'),
      demo(`stack({ direction: 'row', gap: 'sm', align: 'center', wrap: true },
  chip({ size: 'sm' }, 'small'),
  chip({ size: 'md' }, 'medium'),
  chip({ size: 'lg' }, 'large'),
)`),

      h2('Status dot'),
      p(
        'A dot in front turns a chip into a status. Colour alone is not enough to carry meaning, so keep the word.',
      ),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  chip({ color: 'success', dot: true }, 'Build passed'),
  chip({ color: 'warning', dot: true }, 'Queued'),
  chip({ color: 'danger', dot: true }, 'Failed'),
  chip({ color: 'neutral', dot: true }, 'Skipped'),
)`),

      h2('Links'),
      p(
        'Give a chip an ',
        code('href'),
        ' and it renders an anchor — the usual shape for a tag list, where each tag is a page.',
      ),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  chip({ href: '/docs/routing', color: 'primary' }, 'routing'),
  chip({ href: '/docs/data', color: 'primary' }, 'data'),
  chip({ href: '/docs/islands', color: 'primary' }, 'islands'),
)`),

      h2('As a button'),
      p(
        code('as'),
        ' changes the element, for a filter that toggles rather than navigates.',
      ),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  chip({ as: 'button', variant: 'solid', color: 'primary', 'aria-pressed': 'true' }, 'All'),
  chip({ as: 'button', variant: 'outline', color: 'neutral', 'aria-pressed': 'false' }, 'Guides'),
  chip({ as: 'button', variant: 'outline', color: 'neutral', 'aria-pressed': 'false' }, 'Examples'),
)`),

      h2('In a table'),
      demo(`table({
  striped: true,
  columns: [
    { key: 'page', header: 'Page' },
    { header: 'Status', align: 'end', render: (row) =>
      chip({ size: 'sm', dot: true, color: row.ok ? 'success' : 'danger' }, row.ok ? 'ok' : 'failed') },
  ],
  rows: [
    { page: '/', ok: true },
    { page: '/docs', ok: true },
    { page: '/blog/[slug]', ok: false },
  ],
})`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'neutral'", 'Which palette to draw from.'],
        ['variant', "'soft' | 'outline' | 'solid'", "'soft'", 'How much weight the chip carries.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Padding and text size.'],
        ['href', 'string', '', 'Renders an anchor.'],
        ['dot', 'boolean', 'false', 'Adds a status dot before the label.'],
        ['as', 'string', "'span'", 'Element to render when there is no href.'],
      ]),
    ],
  })
