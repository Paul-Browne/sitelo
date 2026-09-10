import { h2, p } from 'javascript-to-html'
import { fillableIcons, grid, icon, iconNames, stack, text } from 'sitelo/ui'

import { code, codeBlock } from '../lib/code.js'
import { uiLayout } from '../lib/layout.js'
import { demo, propsTable } from '../lib/ui-demo.js'

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

/**
 * The glyphs filled by painting their own path, as opposed to the ones
 * carrying a second drawing — told apart by whether the two forms are
 * the same markup, so neither demo can fall behind the set.
 */
const body = (html) => html.replace(/^<svg[^>]*>/, '')

const samePath = () =>
  fillableIcons().filter((name) => body(icon(name, { filled: true })) === body(icon(name)))

/**
 * The fill demo, written out rather than hand-listed — the source is
 * what the page prints, so a glyph that becomes fillable turns up here
 * without anyone remembering to add it.
 */
const fillDemo = ({ filled = false } = {}) => {
  const props = filled ? "{ filled: true, size: 'lg' }" : "{ size: 'lg' }"
  const calls = samePath().map((name) => `  icon('${name}', ${props}),`)

  return [
    "stack({ direction: 'row', gap: 'md', align: 'center' },",
    ...calls,
    ')',
  ].join('\n')
}

export default () =>
  uiLayout({
    title: 'Icons',
    description:
      'A set of 99 glyphs on one grid, rendered inline so an icon takes the colour and size of the text around it.',
    activeHref: '/ui/icons',
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
      demo(`stack({ direction: 'row', gap: 'sm', align: 'center', wrap: true },
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

      h2('Filled'),
      p(
        code('filled'),
        ' paints a glyph instead of outlining it. It is the same path either way — only the ',
        code('fill'),
        ' attribute changes — so the two forms share an outer edge exactly and cannot drift apart.',
      ),
      demo(fillDemo()),
      p('And the same names filled:'),
      demo(fillDemo({ filled: true })),
      p(
        'It is a prop rather than a second set of names because the filled state is nearly always a ',
        code('state'),
        ' — saved, liked, rated — so it wants a boolean, not a different string:',
      ),
      codeBlock('', `icon('heart', { filled: liked })
icon('bookmark', { filled: saved, label: saved ? 'Saved' : 'Save' })

// rather than
icon(liked ? 'heart-filled' : 'heart')`, 'javascript'),
      p(
        'The status glyphs fill differently, because their mark sits ',
        code('inside'),
        ' the shape. Painting the circle would swallow the tick, so the mark is knocked back out of it instead:',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  icon('check-circle', { filled: true, size: 'lg' }),
  icon('x-circle', { filled: true, size: 'lg' }),
  icon('info', { filled: true, size: 'lg' }),
  icon('help', { filled: true, size: 'lg' }),
  icon('alert-triangle', { filled: true, size: 'lg' }),
)`),
      p(
        'Those carry a second drawing — the shape solid with the mark cut out of it by ',
        code('fill-rule: evenodd'),
        ' — because a knockout cannot be had from the outline path by changing an attribute. The outer shape is drawn at the outline\u2019s outer edge, so the two forms still end on the same silhouette. It is the same prop either way; which mechanism a glyph uses is its own business.',
      ),
      p(
        'A chevron has no inside to paint at all — it is an open line — so it fills to the triangle its own three points describe, keeping the stroke that rounds the corners:',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  icon('chevron-up', { filled: true, size: 'lg' }),
  icon('chevron-down', { filled: true, size: 'lg' }),
  icon('chevron-left', { filled: true, size: 'lg' }),
  icon('chevron-right', { filled: true, size: 'lg' }),
)`),
      p(
        code('fillableIcons()'),
        ' lists everything that answers to ',
        code('filled'),
        '. A glyph without a filled form ignores it and stays outlined — filling ',
        code('eye'),
        ' would lose the pupil and ',
        code('tag'),
        ' its hole, so neither pretends to.',
      ),

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

      h2('Brands'),
      p(
        'Eight brand marks come with the set — ',
        code('facebook'),
        ', ',
        code('google'),
        ', ',
        code('instagram'),
        ', ',
        code('linkedin'),
        ', ',
        code('tiktok'),
        ', ',
        code('whatsapp'),
        ', ',
        code('x-twitter'),
        ' and ',
        code('youtube'),
        '. They still take ',
        code('size'),
        ' and ',
        code('label'),
        ' and still draw in ',
        code('currentColor'),
        ':',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center', wrap: true },
  icon('facebook', { size: 'lg' }),
  icon('instagram', { size: 'lg' }),
  icon('x-twitter', { size: 'lg' }),
  icon('youtube', { size: 'lg' }),
  icon('whatsapp', { size: 'lg' }),
  button({ variant: 'soft', color: 'neutral' }, icon('linkedin'), 'Share'),
)`),
      p(
        'They are reproductions of other people\u2019s marks rather than drawings in this library\u2019s style, so they break two of its rules on purpose: they are solid shapes rather than strokes, which is what a logo is, and their proportions are the brand\u2019s rather than this grid\u2019s. ',
        code('filled'),
        ' means nothing to them \u2014 they already are.',
      ),
      p(
        'The artwork is from Simple Icons, which releases it under CC0. That covers the drawing, not the trademark: use these to point at the thing they name \u2014 a profile link, a share button \u2014 and not on a product of your own.',
      ),
      p(
        'It is ',
        code('x-twitter'),
        ', not ',
        code('x'),
        ', because ',
        code('x'),
        ' already aliases ',
        code('close'),
        ' and a close button turning into a logo would be a nasty surprise. ',
        code('twitter'),
        ' resolves to it too.',
      ),

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
          ['cog, gears', 'gear'],
          ['delete, trash-can', 'trash'],
          ['pencil', 'edit'],
          ['notification', 'bell'],
          ['dots', 'more-horizontal'],
          ['bolt, lightning', 'zap'],
          ['arrow-back', 'arrow-left'],
          ['arrow-forward', 'arrow-right'],
          ['cart', 'shopping-cart'],
          ['bag', 'shopping-bag'],
          ['card', 'credit-card'],
          ['cash, money', 'banknote'],
          ['delivery, shipping', 'truck'],
          ['shop', 'store'],
          ['discount, sale', 'percent'],
          ['login, sign-in', 'log-in'],
          ['logout, sign-out', 'log-out'],
          ['map-pin, marker', 'location'],
          ['mobile', 'smartphone'],
          ['like', 'thumbs-up'],
          ['dislike', 'thumbs-down'],
          ['comment, message, chat', 'comment-bubble'],
          ['ai, magic', 'sparkles'],
          ['printer', 'print'],
          ['accessibility, a11y', 'universal-access'],
          ['twitter', 'x-twitter'],
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
  // One closed shape, so it can answer to \`filled\` like the built-ins.
  pin: { markup: '<path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11z"/>', fillable: true },
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
        code('styles({ inline: true })'),
        ' makes.',
      ),

      h2('Props'),
      propsTable([
        ['name', 'string', '', 'Which glyph. Can be passed as the first argument instead.'],
        ['size', "'sm' | 'md' | 'lg' | string", "'md'", 'A token, or any CSS length. Default is 1em.'],
        ['label', 'string', '', 'Announce it as an image with this name, instead of hiding it.'],
        ['spin', 'boolean', 'false', 'Rotate it continuously.'],
        ['filled', 'boolean', 'false', 'Paint the glyph rather than outline it. Ignored by glyphs that cannot be filled.'],
      ]),
      p(
        'An unknown name renders nothing at all rather than throwing — a cosmetic prop should not be able to fail a build. ',
        code('hasIcon(name)'),
        ' tells you whether one exists, and ',
        code('iconNames()'),
        ' lists them all, and ',
        code('fillableIcons()'),
        ' the ones that take ',
        code('filled'),
        '.',
      ),
    ],
  })
