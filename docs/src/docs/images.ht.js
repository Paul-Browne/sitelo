import { a, h2, h3, li, p, strong, ul } from 'javascript-to-html'
import { code, codeBlock, pageCodeTabs } from '../lib/code.js'
import { docsLayout } from '../lib/layout.js'

const enableSnippet = `export default {
  images: true,
}`

const pageTemplate = `export default () => \`
  <html lang="en">
    <body>
      <img src="/images/hero.png" alt="Sunrise over the harbour">
    </body>
  </html>
\``

const pageHt = `import { html, body, img } from 'javascript-to-html'

export default () =>
  html({ lang: 'en' },
    body(
      img({ src: '/images/hero.png', alt: 'Sunrise over the harbour' }),
    ),
  )`

const pageJsx = `export default function Home() {
  return (
    <html lang="en">
      <body>
        <img src="/images/hero.png" alt="Sunrise over the harbour" />
      </body>
    </html>
  )
}`

const outputSnippet = `<img src="/assets/img/hero.a1b2c3d4-1200.webp"
     alt="Sunrise over the harbour"
     sizes="(max-width: 1200px) 100vw, 1200px"
     width="1200" height="800"
     loading="lazy" decoding="async"
     srcset="/assets/img/hero.9f8e7d6c-400.webp 400w,
             /assets/img/hero.5b4a3c2d-800.webp 800w,
             /assets/img/hero.a1b2c3d4-1200.webp 1200w">`

const optionsSnippet = `export default {
  images: {
    widths: [400, 800, 1200],
    formats: ['avif', 'webp'],
    quality: { avif: 55, webp: 78, jpeg: 82 },
    exclude: ['**/og/**'],
  },
}`

const pictureSnippet = `<picture>
  <source type="image/avif" srcset="/assets/img/hero.*-400.avif 400w, ..." sizes="...">
  <source type="image/webp" srcset="/assets/img/hero.*-400.webp 400w, ..." sizes="...">
  <img src="/assets/img/hero.*-1200.png" alt="..." srcset="..." width="1200" height="800">
</picture>`

const optOutSnippet = `<img src="/images/exact.png" alt="Pixel art" data-no-optimize>`

const remoteSnippet = `export default {
  images: {
    remote: true,
    prune: true,
  },
}`

export default () =>
  docsLayout({
    title: 'Image optimization',
    description:
      'Automatic resizing, modern formats, and srcset for every <img> — in dev and in the build.',
    activeHref: '/docs/images',
    children: [
      p(
        'Drop a full-size image into ',
        code('src/'),
        ' or ',
        code('public/'),
        ', point an ',
        code('<img>'),
        ' at it, and sitelo resizes it, converts it to a modern format, and rewrites the tag with a ',
        code('srcset'),
        '. Nothing to import, no component to learn.',
      ),
      h2('Enable it'),
      codeBlock('sitelo.config.js', enableSnippet, 'javascript'),
      p(
        'Encoding is done by ',
        a({ href: 'https://sharp.pixelplumbing.com', rel: 'noopener' }, 'sharp'),
        ', which ships with sitelo — there is nothing else to install.',
      ),
      h2('Write a plain &lt;img&gt;'),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: pageTemplate,
        ht: pageHt,
        jsx: pageJsx,
      }),
      p('A 3000×2000 source comes out the other side like this:'),
      codeBlock('dist/index.html', outputSnippet, 'html'),
      h2('What you get'),
      ul(
        { class: 'docs-list' },
        li(
          strong('Resizing that never upscales'),
          ' — a 600px source with ',
          code('widths: [400, 800, 1200]'),
          ' emits 400 and 600, and stops there.',
        ),
        li(
          strong('Modern formats'),
          ' — one format gives a plain ',
          code('<img srcset>'),
          '; two or more wrap it in ',
          code('<picture>'),
          ' with a fallback in the original format.',
        ),
        li(
          strong('No layout shift'),
          ' — ',
          code('width'),
          ' and ',
          code('height'),
          ' are filled in from the real image, plus ',
          code('loading="lazy"'),
          ' and ',
          code('decoding="async"'),
          '.',
        ),
        li(
          strong('The same markup in dev'),
          ' — ',
          code('sitelo'),
          ' (dev) rewrites pages and serves variants on demand, so you preview what you ship.',
        ),
        li(
          strong('A shared cache'),
          ' — variants are keyed by content hash in ',
          code('node_modules/.sitelo/images'),
          ', so dev and rebuilds never encode the same image twice.',
        ),
      ),
      p(
        'The rewrite runs over the built HTML, so it covers images from ',
        code('src/'),
        ' and ',
        code('public/'),
        ' alike.',
      ),
      h2('Options'),
      codeBlock('sitelo.config.js', optionsSnippet, 'javascript'),
      ul(
        { class: 'docs-list' },
        li(code('widths'), ' — default ', code('[400, 800, 1200]'), '; the largest is also the cap'),
        li(code('formats'), ' — default ', code("['webp']"), '; ', code('avif'), ', ', code('webp'), ', ', code('jpeg'), ', ', code('png')),
        li(code('quality'), ' — default ', code('{ avif: 55, webp: 78, jpeg: 82 }'), '; per-format encoder quality (png uses compression, not quality)'),
        li(code('sizes'), ' — the ', code('sizes'), ' attribute; a ', code('sizes'), ' on the tag always wins'),
        li(code('dimensions'), ' — default ', code('true'), '; adds ', code('width'), ' / ', code('height')),
        li(code('lazy'), ' — default ', code('true'), '; adds ', code('loading'), ' and ', code('decoding')),
        li(code('exclude'), ' — glob(s) or RegExp(s) of image URLs to leave alone'),
        li(code('assetsDir'), ' — default ', code("'assets/img'")),
        li(code('cacheDir'), ' — default ', code("'node_modules/.sitelo/images'")),
        li(code('remote'), ' — default ', code('false'), '; optimize ', code('https://'), ' images at build time'),
        li(code('prune'), ' — default ', code('false'), '; delete originals nothing references any more'),
        li(code('dev'), ' — default ', code('true'), '; set ', code('false'), ' to serve untouched originals in dev'),
        li(code('concurrency'), ' — parallel encodes, default CPUs − 1 (max 8); 1 when remote is on'),
      ),
      h3('Two formats give you <picture>'),
      p(
        'AVIF is smaller but younger than WebP, so listing both lets the browser pick and keeps a fallback for old ones:',
      ),
      codeBlock('dist/index.html', pictureSnippet, 'html'),
      h2('Opting out'),
      p(
        'Tags that already have a ',
        code('srcset'),
        ', sit inside a ',
        code('<picture>'),
        ', or point at an SVG, an animated GIF, or a remote URL are left untouched. For anything else, say so:',
      ),
      codeBlock('src/index.ht.js', optOutSnippet, 'html'),
      p(
        'Social-card and favicon images live in ',
        code('<meta>'),
        ' and ',
        code('<link>'),
        ', which this never rewrites — they keep their fixed URL.',
      ),
      h2('Remote images'),
      p(
        'Content imported from a CMS often points at someone else’s server. Turn on ',
        code('remote'),
        ' and those images are downloaded, optimized, and served from your own domain:',
      ),
      codeBlock('sitelo.config.js', remoteSnippet, 'javascript'),
      p(
        'A fetch that fails leaves the tag exactly as it was, with a warning — a flaky origin never fails your build. ',
        code('prune'),
        ' then removes local originals that nothing references any more.',
      ),
    ],
  })
