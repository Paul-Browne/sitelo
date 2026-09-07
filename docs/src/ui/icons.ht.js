import { h2, p } from 'javascript-to-html'
import { grid, icon, iconNames, stack, text } from 'sitelo/ui'

import { code, codeBlock } from '../lib/code.js'
import { uiLayout } from '../lib/layout.js'
import { demo, propsTable, uiHead } from '../lib/ui-demo.js'

/** One cell: the glyph at a readable size, with the name to type. */
const cell = (name) =>
  stack(
    {
      gap: 'xs',
      align: 'center',
      title: name,
      style:
        'padding: 0.85rem 0.5rem; border: 1px solid var(--su-border); border-radius: var(--su-radius-md); text-align: center; min-width: 0',
    },
    icon(name, { size: '1.5rem' }),
    text(
      {
        variant: 'caption',
        tone: 'muted',
        style: 'font-family: var(--su-font-mono); overflow-wrap: anywhere',
      },
      name,
    ),
  )

/* Alphabetical, straight from the library, so the page cannot fall
 * behind the set it documents. */
const gallery = () => grid({ min: '7.5rem', gap: 'sm' }, ...iconNames().map(cell))

export default () =>
  uiLayout({
    title: 'Icons',
    description:
      'A set of 63 glyphs on one grid, rendered inline so an icon takes the colour and size of the text around it.',
    activeHref: '/ui/icons',
    extraHead: uiHead(),
    children: [
      p(
        code('icon()'),
        ' returns an inline ',
        code('<svg>'),
        '. Every glyph is drawn on the same 24×24 grid as unfilled strokes in ',
        code('currentColor'),
        ', so it inherits the colour and the font size of whatever it sits in and needs no styling of its own.',
      ),

      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  icon('check'),
  icon('search'),
  icon('trash'),
  icon('settings'),
)`),

      h2('In a component'),
      p(
        'An icon is a child like any other. Because it sizes itself in ',
        code('em'),
        ', it matches the label beside it without being told how big that label is:',
      ),
      demo(`stack({ direction: 'row', gap: 'sm', align: 'center' },
  button({ color: 'primary' }, icon('download'), 'Download'),
  button({ variant: 'outline' }, icon('external-link'), 'Open'),
  button({ size: 'sm', variant: 'soft', color: 'danger' }, icon('trash'), 'Delete'),
  iconButton({ label: 'Search', variant: 'soft', icon: icon('search') }),
)`),

      h2('Size'),
      p(
        'The default is ',
        code('1em'),
        ' — the size of the surrounding text. ',
        code('size'),
        ' takes a token or any CSS length when you want to break away from it:',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  icon('star', { size: 'sm' }),
  icon('star'),
  icon('star', { size: 'lg' }),
  icon('star', { size: '2rem' }),
  icon('star', { size: '3rem' }),
)`),

      h2('Colour'),
      p(
        'There is no colour prop. An icon is drawn in ',
        code('currentColor'),
        ', so it takes the colour of its context — which is what makes one set work inside five palettes:',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  text({ style: 'color: var(--su-primary)' }, icon('heart', { size: 'lg' })),
  text({ style: 'color: var(--su-success)' }, icon('check-circle', { size: 'lg' })),
  text({ style: 'color: var(--su-warning)' }, icon('alert-triangle', { size: 'lg' })),
  text({ style: 'color: var(--su-danger)' }, icon('x-circle', { size: 'lg' })),
  text({ tone: 'muted' }, icon('info', { size: 'lg' })),
)`),

      h2('Accessible names'),
      p(
        'An icon is ',
        code('aria-hidden'),
        ' by default, which is right far more often than not: an icon next to the word “Delete” should not be announced a second time. Give it a ',
        code('label'),
        ' only when the icon carries the whole meaning, and it becomes ',
        code('role="img"'),
        ' with that name.',
      ),
      codeBlock('', `icon('trash')                      // decorative — hidden
button(icon('trash'), 'Delete')    // the word does the talking

icon('trash', { label: 'Delete' }) // announced as an image

// An icon-only button labels the button, not the glyph inside it
iconButton({ label: 'Delete', icon: icon('trash') })`, 'javascript'),

      h2('Spin'),
      p(
        code('spin'),
        ' rotates the glyph — meant for ',
        code('spinner'),
        ', though nothing stops you spinning ',
        code('refresh'),
        ' while something reloads. It slows to a crawl rather than stopping under ',
        code('prefers-reduced-motion'),
        ', because a spinner that stops looks broken.',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  icon('spinner', { spin: true, size: 'lg' }),
  icon('refresh', { spin: true, size: 'lg' }),
  button({ variant: 'soft' }, icon('spinner', { spin: true }), 'Saving…'),
)`),

      h2('The set'),
      p(
        'Names describe the drawing rather than the job it does — ',
        code('x-circle'),
        ', not ',
        code('error'),
        ' — because the same drawing gets used for unrelated jobs, and a name that describes the picture stays true when it does. The aliases below cover the common intents.',
      ),
      gallery(),

      h2('Aliases'),
      p('Each of these renders a glyph listed above, under the name you are more likely to reach for:'),
      grid(
        { min: '15rem', gap: 'xs' },
        ...[
          ['success', 'check-circle'],
          ['warning', 'alert-triangle'],
          ['danger, error', 'x-circle'],
          ['x, cross', 'close'],
          ['question', 'help'],
          ['loading', 'spinner'],
          ['cog, gear', 'settings'],
          ['delete, trash-can', 'trash'],
          ['pencil', 'edit'],
          ['notification', 'bell'],
          ['dots', 'more-horizontal'],
          ['bolt, lightning', 'zap'],
          ['arrow-back', 'arrow-left'],
          ['arrow-forward', 'arrow-right'],
        ].map(([alias, target]) =>
          text({ variant: 'small' }, code(alias), ' → ', code(target)),
        ),
      ),

      h2('Your own icons'),
      p(
        code('registerIcons()'),
        ' adds a glyph, or replaces a built-in. The markup is the ',
        code('<svg>'),
        '’s contents — shapes on the same 24×24 grid, left unfilled so ',
        code('currentColor'),
        ' reaches them. Call it once from a module your pages import:',
      ),
      codeBlock('src/lib/icons.js', `import { registerIcons } from 'sitelo/ui'

registerIcons({
  logo: '<path d="M4 20 12 4l8 16z"/>',
  // A name that already exists replaces it everywhere, which is how you
  // restyle a built-in without forking the library.
  check: '<path d="m5 13 4 4 10-11"/>',
})`, 'javascript'),
      codeBlock('', `import { icon } from 'sitelo/ui'

icon('logo')                  // your glyph
icon('check')                 // now yours as well

registerIcons({ check: null }) // and back to the built-in`, 'javascript'),

      h2('Why inline, and not a sprite'),
      p(
        'Icons render into the page rather than being pulled from an ',
        code('icons.svg'),
        ' with ',
        code('<use>'),
        '. A sprite saves on the order of a hundred gzipped bytes of HTML per page and costs a round trip to do it — repeated markup is exactly the case gzip is best at, so most of what a sprite exists to dedupe has been deduped already. Inline also means there is no file to emit, no base path to configure, and nothing that can go missing from ',
        code('dist'),
        ' — the same trade ',
        code('styles()'),
        ' makes.',
      ),

      h2('Props'),
      propsTable([
        ['name', 'string', '', 'Which glyph. Can be passed as the first argument instead.'],
        ['size', "'sm' | 'md' | 'lg' | string", "'md'", 'A token, or any CSS length. Default is 1em.'],
        ['label', 'string', '', 'Announce it as an image with this name, instead of hiding it.'],
        ['spin', 'boolean', 'false', 'Rotate it continuously.'],
      ]),
      p(
        'An unknown name renders nothing at all rather than throwing — a cosmetic prop should not be able to fail a build. ',
        code('hasIcon(name)'),
        ' tells you whether one exists, and ',
        code('iconNames()'),
        ' lists them all.',
      ),
    ],
  })
