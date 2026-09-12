import { h2, p } from 'javascript-to-html'
import { code, codeBlock } from '../lib/code.js'
import { uiLayout } from '../lib/layout.js'
import { demo, propsTable } from '../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Carousel',
    description:
      'Slides you scroll through, snapping as they go — and dots and arrows the stylesheet asks the browser to draw.',
    activeHref: '/ui/carousel',
    children: [
      p(
        'A carousel here is a scroll container and a row of slides that snap. That much every browser already knows how to do: swiping, a trackpad, shift-wheel and the arrow keys all work on the first paint, with nothing loaded and nothing to hydrate.',
      ),
      p(
        'Where the browser can, the dots and the arrows are not markup at all. They are ',
        code('::scroll-marker'),
        ' on each slide and ',
        code('::scroll-button()'),
        ' on the track — pseudo-elements the stylesheet asks for, which the browser then draws, names, wires to the scroll position, marks the current one of and disables at the ends. There is no ',
        code('data-'),
        ' attribute on this component and no module to import: the state is the scroll offset, and the browser already has it.',
      ),
      p(
        'Where it cannot, a rendered row of dots takes over: one link per slide, which works on its own, and which reaches for a few hundred bytes of script on the first scroll or the first tap to behave the way the native dots do — following the scroll, and moving the track without moving the page.',
      ),

      h2('One at a time'),
      p(
        'The default. Each slide fills the track, snaps to the start, and stops there rather than flying three slides along.',
      ),
      demo(`carousel({
  items: ['Coast', 'Harbour', 'Fields', 'Old town'].map((name, index) =>
    aspectRatio({ ratio: '16 / 7', style: 'background: var(--su-surface-2); border-radius: 0.6rem' },
      div({ style: 'display: grid; place-items: center; color: var(--su-text-muted)' },
        text({ variant: 'h6', as: 'div' }, (index + 1) + '. ' + name)))),
})`, { align: 'stretch' }),

      h2('Several at a time'),
      p(
        code('perView'),
        ' is how many slides fill the track, and ',
        code('min'),
        ' is a floor on how narrow one may get. The floor is a replacement for a media query: once a slide\'s share of the track falls below it, the slides stay that wide and fewer of them fit — the same trick ',
        code('grid()'),
        ' plays with auto-fit.',
      ),
      demo(`carousel({
  perView: 3,
  min: '12rem',
  gap: 'md',
  items: ['Routing', 'Data', 'Assets', 'Images', 'Islands', 'Search'].map((name) =>
    card({ variant: 'flat', style: 'height: 100%' },
      cardBody(stack({ gap: 'xs', align: 'center' },
        text({ variant: 'overline', tone: 'muted' }, 'Guide'),
        text({ variant: 'h6', as: 'div' }, name))))),
})`, { align: 'stretch' }),

      h2('A peek at the next one'),
      p(
        'A fractional ',
        code('perView'),
        ' leaves a sliver of the next slide showing, which is the cheapest way to say "this scrolls" without any chrome at all.',
      ),
      demo(`carousel({
  perView: 1.25,
  dots: false,
  arrows: false,
  items: ['One', 'Two', 'Three'].map((name) =>
    aspectRatio({ ratio: '16 / 6', style: 'background: var(--su-primary-soft); border-radius: 0.6rem' },
      div({ style: 'display: grid; place-items: center; color: var(--su-primary-soft-fg)' }, name))),
})`, { align: 'stretch' }),

      h2('Responsive without a breakpoint of your own'),
      p(
        code('perView'),
        ' is written as a custom property, so a media query can change it without touching the markup — and without the component having to know your breakpoints:',
      ),
      codeBlock('src/gallery.ht.js', `carousel({ class: 'gallery', perView: 2, items })`, 'javascript'),
      codeBlock('src/styles.css', `@media (min-width: 48em) {
  .gallery {
    --su-carousel-per-view: 3;
  }
}`, 'css'),

      h2('Snapping'),
      p(
        'Snapping is ',
        code('mandatory'),
        ' by default: a scroll always comes to rest on a slide. ',
        code("snap: 'proximity'"),
        ' only pulls it in when it ends up close to one, and ',
        code('snap: false'),
        ' leaves the track scrolling freely — which is what a row of small things wants, where landing between two of them is fine.',
      ),
      demo(`carousel({
  snap: false,
  perView: 4,
  min: '7rem',
  gap: 'sm',
  arrows: false,
  items: ['sitelo', 'vite', 'pagefind', 'sharp', 'lighthouse', 'rollup', 'esbuild'].map((name) =>
    chip({ size: 'lg', color: 'neutral', style: 'width: 100%; justify-content: center' }, name)),
})`, { align: 'stretch' }),

      h2('Where the dots and arrows go'),
      p(
        'Both are optional and both are on by default. Turning the dots off puts the track\'s scrollbar back, because a carousel with neither would be a scroller with nothing to say that it scrolls.',
      ),
      demo(`stack({ gap: 'lg' },
  carousel({ arrows: false, color: 'success', items: ['Dots only', 'Second', 'Third'].map((name) =>
    aspectRatio({ ratio: '16 / 5', style: 'background: var(--su-surface-2); border-radius: 0.6rem' },
      div({ style: 'display: grid; place-items: center; color: var(--su-text-muted)' }, name))) }),
  carousel({ dots: false, items: ['Arrows only', 'Second', 'Third'].map((name) =>
    aspectRatio({ ratio: '16 / 5', style: 'background: var(--su-surface-2); border-radius: 0.6rem' },
      div({ style: 'display: grid; place-items: center; color: var(--su-text-muted)' }, name))) }),
)`, { align: 'stretch' }),

      h2('When the browser has no scroll markers'),
      p(
        'Then the dots are real links, one per slide, each pointing at that slide\'s id — which is why every slide is given one. That much works with nothing loaded at all: tapping one scrolls the track to its slide, because following a fragment is something a browser already does.',
      ),
      p(
        'On the first scroll or the first tap, the track and the dots reach for ',
        code('/su/carousel.js'),
        ' from their own event attributes — the way every component here reaches its module, so nothing is fetched on a page nobody touches, and nothing at all where the native markers already exist. From then on it goes both ways: the dots follow the scroll, whatever moved it — a swipe, a trackpad, the arrow keys, a scrollbar drag — and tapping a dot scrolls the track and leaves the page where it was.',
      ),
      p(
        'That last part is what the script is really for. A bare fragment moves the window to the slide as well as the track, and a carousel that jumps the page out from under the thumb tapping it is not what anyone meant by a dot. The click is called off in the attribute rather than inside the import, because a dynamic import settles a moment later and by then the browser has already followed the link. ',
        code('scrollMargin'),
        ' is where the window lands in the one case left over: JavaScript off, where the link is still just a link.',
      ),
      p(
        'The ids they point at come from ',
        code('name'),
        ', or from the carousel\'s own ',
        code('id'),
        ', or — given neither — from a digest of the slides, so two carousels on one page do not collide without either being told about the other. Give an item its own ',
        code('id'),
        ' when a particular slide is worth linking to from elsewhere.',
      ),

      h2('Naming the slides'),
      p(
        'Each dot is named after its slide, because a dot is a control and a control with no name is a button a screen reader can only call "button". By default the name is the slide\'s number. Pass an item as an object to name it something better, or ',
        code('slideLabel'),
        ' to number them in your own words.',
      ),
      demo(`carousel({
  label: 'Product shots',
  perView: 2,
  min: '10rem',
  items: [
    { label: 'The kitchen', content: card({ variant: 'flat' }, cardBody(text({ align: 'center' }, 'Kitchen'))) },
    { label: 'The terrace', content: card({ variant: 'flat' }, cardBody(text({ align: 'center' }, 'Terrace'))) },
    { label: 'The garden', content: card({ variant: 'flat' }, cardBody(text({ align: 'center' }, 'Garden'))) },
  ],
})`, { align: 'stretch' }),

      h2('Driving it yourself'),
      p(
        'Two functions for the times the page is what moves a carousel — a "see the photos" button, a step in a form, a link elsewhere on the page:',
      ),
      codeBlock('src/main.js', `import { setSlide, getSlide } from 'sitelo/ui/client'

setSlide('gallery', 2)  // scrolls to the third slide, and marks its dot
getSlide('gallery')     // 2`, 'javascript'),
      p(
        'Or from an event attribute, with nothing bundled into the page at all:',
      ),
      codeBlock('Anywhere', `button({ onclick: "import('/su/carousel.js').then(m=>m.set('gallery',0))" }, 'Back to the start')`, 'javascript'),

      h2('What this does not do'),
      p(
        'It does not loop back to the first slide, and it does not advance on its own. Neither is something CSS can do, so neither is here — a looping or auto-playing carousel needs a script, and this component would rather not be the reason a page loads one. Auto-advancing is worth losing anyway: it moves the thing someone is reading, out from under them.',
      ),
      p(
        'With JavaScript off it also cannot mark which slide is showing once the track has been swiped, or reach one without moving the page. The first dot is marked at build time, because at rest that is the slide showing; keeping it true after that is the one thing only the script can do. Swiping, the trackpad and the keys work either way.',
      ),

      h2('Accessibility'),
      p(
        'The track is a labelled group with ',
        code('tabindex="0"'),
        ', so a keyboard can reach the scrollable region and walk it with the arrow keys in every engine, not just the ones that focus scrollers on their own. Name it with ',
        code('label'),
        ' when a page has more than one.',
      ),
      p(
        'Where the browser draws them, the dots are exposed as a tab list and the arrows as buttons that disable themselves at each end — the browser builds all of that, so none of it can drift out of step with the slide actually showing. That is the argument for this shape over a scripted one: there is no second copy of the state to get wrong.',
      ),
      p(
        'The fallback dots are links, each named after its slide, and each a 24px target rather than the 8px the dot looks like. The slide showing carries ',
        code('aria-current'),
        ', which is both what a screen reader reads and what the stylesheet colours — one piece of state to keep true rather than two that could disagree. It is rendered onto the first dot, since at rest that is the slide showing, and moves with the scroll from there. Where the native markers replace them the links are ',
        code('display: none'),
        ', so they leave the accessibility tree with the picture rather than being read out twice.',
      ),

      h2('Props'),
      propsTable([
        ['items', 'Array', '[]', 'Slides. A child, or { label, content } with any other attributes for the slide. Children are slides too and follow the items.'],
        ['perView', 'number', '1', 'How many slides fill the track. Fractional leaves a peek of the next.'],
        ['min', 'string', '', 'Floor on a slide\'s width, so a narrow screen shows fewer rather than thinner.'],
        ['gap', 'Space', "'md'", 'Between slides.'],
        ['align', "'start' | 'center' | 'end'", "'start'", 'Where a slide comes to rest.'],
        ['snap', "'mandatory' | 'proximity' | false", "'mandatory'", 'How firmly the scroll settles on a slide.'],
        ['dots', 'boolean', 'true', 'Dots under the track — native scroll markers where the browser has them, one link per slide, upgraded by a small module, where it does not. Off puts the scrollbar back, and asks for no script.'],
        ['arrows', 'boolean', 'true', 'Arrows over the track.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Colour of the dot for the slide showing.'],
        ['label', 'string', "'Carousel'", 'Accessible name for the scrollable region.'],
        ['previousLabel', 'string', "'Previous slide'", 'Accessible name for the back arrow.'],
        ['nextLabel', 'string', "'Next slide'", 'Accessible name for the forward arrow.'],
        ['slideLabel', '(index, count) => string', 'the number', 'Names a slide that did not name itself.'],
        ['name', 'string', 'the carousel id, else a digest', 'Prefix for the slide ids the fallback dots link to.'],
        ['scrollMargin', 'Space', "'lg'", 'How far above a slide the window stops when a fallback dot takes it there.'],
        ['as', 'string', "'div'", 'Element to render.'],
      ]),
    ],
  })
