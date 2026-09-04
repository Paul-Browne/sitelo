import { h2, p } from 'javascript-to-html'
import { code } from '../lib/code.js'
import { uiLayout } from '../lib/layout.js'
import { demo, propsTable, uiHead } from '../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Figure',
    description:
      'An image and its caption, as one figure — with the space held before the image arrives.',
    activeHref: '/ui/figure',
    extraHead: uiHead(),
    children: [
      p(
        'A ',
        code('<figure>'),
        ' ties a caption to what it describes, which a paragraph under an image does not. Pass ',
        code('src'),
        ' for the common case, or children for anything else worth captioning.',
      ),

      h2('Basic figure'),
      demo(`figure({
  src: '/logo.svg',
  alt: 'The sitelo wordmark',
  caption: 'The wordmark, as it appears in the top bar.',
  style: '--su-figure-bg: var(--su-surface-2)',
})`, { align: 'stretch' }),

      h2('With a held ratio'),
      p(
        code('ratio'),
        ' wraps the image in an ',
        code('aspectRatio()'),
        ', so the caption never jumps down the page when the image loads.',
      ),
      demo(`grid({ min: '13rem' },
  figure({ src: '/logo.svg', alt: '', ratio: '16 / 9', caption: 'ratio: 16 / 9' }),
  figure({ src: '/logo.svg', alt: '', ratio: '1 / 1', caption: 'ratio: 1 / 1' }),
)`, { align: 'stretch' }),

      h2('Captioning something else'),
      p('Without ', code('src'), ', the children are the figure’s content.'),
      demo(`figure({ caption: 'Table 1 — output of a default build.' },
  table({
    dense: true,
    columns: [{ key: 'file', header: 'File' }, { key: 'size', header: 'Size', align: 'end' }],
    rows: [
      { file: 'index.html', size: '4.1 kB' },
      { file: '404.html', size: '860 B' },
      { file: 'sitemap.xml', size: '155 B' },
    ],
  }),
)`, { align: 'stretch' }),

      h2('Code with a caption'),
      p(
        'Note the ',
        code('text'),
        ' prop on ',
        code('code()'),
        ': children render as HTML everywhere in this library, so a sample containing tags needs escaping or the browser builds it instead of showing it.',
      ),
      demo(`figure({ caption: 'The whole of a sitelo page.' },
  code({ text: 'export default () => "<h1>Hello</h1>"' }),
)`, { align: 'stretch' }),

      h2('Alt text'),
      p(
        'The ',
        code('alt'),
        ' attribute is always written, empty if you give nothing — an image with no ',
        code('alt'),
        ' at all is announced by its filename, which is worse than silence. A caption is not a substitute: the caption is read by everyone, the alt describes the image to someone who cannot see it.',
      ),
      p(
        'When the caption already says everything the image does, ',
        code("alt: ''"),
        ' is the correct answer.',
      ),

      h2('In prose'),
      p(
        'Figures coming out of a Markdown renderer are styled by ',
        code('prose()'),
        ' already. This component is for figures you build yourself.',
      ),

      h2('Props'),
      propsTable([
        ['src', 'string', '', 'Image source. Omit and use children instead.'],
        ['alt', 'string', "''", 'Alt text. Always written, even when empty.'],
        ['caption', 'Child', '', 'The figcaption.'],
        ['ratio', 'string', '', 'Holds the space before the image loads.'],
      ]),
    ],
  })
