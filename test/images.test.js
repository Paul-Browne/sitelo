import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import { test } from 'node:test'

import sharp from 'sharp'

import {
  createDevImagePipeline,
  normalizeImageOptions,
  parseAttributes,
  parseVariantHint,
  placeholderStyle,
  resolveSizes,
  resolveWidths,
  rewriteHtmlImages,
  runImages,
} from '../src/images.js'

const execFileAsync = promisify(execFile)
const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const cliPath = path.join(rootDir, 'bin', 'sitelo.js')
const fixtureDir = path.join(rootDir, 'test', 'fixtures', 'images')

test('normalizeImageOptions: falsey → null', () => {
  assert.equal(normalizeImageOptions(undefined), null)
  assert.equal(normalizeImageOptions(false), null)
  assert.equal(normalizeImageOptions(null), null)
})

test('normalizeImageOptions: true → defaults', () => {
  const options = normalizeImageOptions(true)

  assert.deepEqual(options.widths, [400, 800, 1200])
  assert.deepEqual(options.formats, ['webp'])
  assert.equal(options.quality.webp, 78)
  assert.equal(options.dimensions, true)
  assert.equal(options.lazy, true)
  assert.equal(options.remote, false)
  assert.equal(options.prune, true, 'originals nothing references are pruned by default')
  assert.equal(options.dev, true)
  assert.equal(options.assetsDir, 'assets/img')
  assert.ok(options.concurrency >= 1)
})

test('normalizeImageOptions: remote defaults to low concurrency', () => {
  const options = normalizeImageOptions({ remote: true })
  assert.equal(options.remote, true)
  assert.equal(options.concurrency, 1)
})

test('normalizeImageOptions: object merges and sorts', () => {
  const options = normalizeImageOptions({
    widths: [1200, 400, 400],
    formats: ['avif', 'webp'],
    quality: { webp: 90 },
    lazy: false,
    prune: false,
  })

  assert.deepEqual(options.widths, [400, 1200])
  assert.deepEqual(options.formats, ['avif', 'webp'])
  assert.equal(options.quality.webp, 90)
  assert.equal(options.quality.avif, 55, 'unspecified qualities keep defaults')
  assert.equal(options.lazy, false)
  assert.equal(options.prune, false)
})

test('normalizeImageOptions: rejects invalid values', () => {
  assert.throws(() => normalizeImageOptions('yes'), /must be true or an object/)
  assert.throws(() => normalizeImageOptions([]), /must be true or an object/)
  assert.throws(() => normalizeImageOptions({ widths: [] }), /images\.widths/)
  assert.throws(() => normalizeImageOptions({ widths: [0] }), /images\.widths/)
  assert.throws(() => normalizeImageOptions({ formats: [] }), /images\.formats/)
  assert.throws(() => normalizeImageOptions({ formats: ['gif'] }), /unsupported format/)
})

test('normalizeImageOptions: assetsDir has to stay inside the build output', () => {
  // The build empties this directory first, so each of these used to be a
  // recursive delete of something that was not sitelo's: the project, the
  // whole of dist/, a folder beside it.
  for (const assetsDir of ['../keep', '..', 'img/../../x', '', '.', '/', './', 'C:/images', 'a\\..\\..\\b']) {
    assert.throws(
      () => normalizeImageOptions({ assetsDir }),
      /"images\.assetsDir" must be a directory inside the build output/,
      `rejects ${JSON.stringify(assetsDir)}`,
    )
  }

  assert.equal(normalizeImageOptions({ assetsDir: '/media/img/' }).assetsDir, 'media/img')
  assert.equal(normalizeImageOptions({ assetsDir: 'img' }).assetsDir, 'img')
})

test('normalizeImageOptions: exclude globs become matchers', () => {
  const { exclude } = normalizeImageOptions({ exclude: ['**/og/**', '/logo-*.png'] })

  assert.equal(exclude[0].test('/images/og/card.png'), true)
  assert.equal(exclude[0].test('/images/hero.png'), false)
  assert.equal(exclude[1].test('/logo-dark.png'), true)
  assert.equal(exclude[1].test('/nested/logo-dark.png'), false)
})

test('resolveWidths: the source width tops every ladder, and nothing upscales', () => {
  assert.deepEqual(resolveWidths(3000, [400, 800, 1200]), [400, 800, 1200, 3000])
  assert.deepEqual(resolveWidths(750, [400, 800, 1200]), [400, 750])
  assert.deepEqual(resolveWidths(300, [400, 800, 1200]), [300])
  assert.deepEqual(resolveWidths(1200, [400, 800, 1200]), [400, 800, 1200])
})

test('parseAttributes: quoted, unquoted, and boolean attributes', () => {
  const attributes = parseAttributes(
    '<img src="/a.png" alt=\'A "quote"\' width=200 data-no-optimize>',
  )

  assert.equal(attributes.get('src'), '/a.png')
  assert.equal(attributes.get('alt'), 'A "quote"')
  assert.equal(attributes.get('width'), '200')
  assert.equal(attributes.get('data-no-optimize'), null)
})

test('parseAttributes: decodes HTML entities in attribute values', () => {
  const attributes = parseAttributes(
    '<img src="https://cdn.example/img.jpeg?w=500&amp;fm=jpg&amp;env=master" alt="A &amp; B">',
  )

  assert.equal(
    attributes.get('src'),
    'https://cdn.example/img.jpeg?w=500&fm=jpg&env=master',
  )
  assert.equal(attributes.get('alt'), 'A & B')
})

test('rewriteHtmlImages: resolves entity-encoded remote query strings', async () => {
  const seen = []
  const { rewritten } = await rewriteHtmlImages({
    html: '<img src="https://cdn.example/a.jpeg?w=500&amp;fm=jpg" alt="">',
    options: normalizeImageOptions({ remote: true }),
    resolve: async (url) => {
      seen.push(url)
      return '/abs/a.jpeg'
    },
    generate: stubGenerate(),
  })

  assert.equal(rewritten, 1)
  assert.deepEqual(seen, ['https://cdn.example/a.jpeg?w=500&fm=jpg'])
})

function stubGenerate(formats = ['webp']) {
  return async () => ({
    ladders: formats.map((format) => ({
      format,
      variants: [
        { url: `/assets/img/a-400.${format}`, width: 400 },
        { url: `/assets/img/a-800.${format}`, width: 800 },
      ],
    })),
    fallback: {
      url: `/assets/img/a-800.${formats[formats.length - 1]}`,
      width: 800,
      format: formats[formats.length - 1],
    },
    width: 800,
    height: 400,
  })
}

const resolveAll = (url) => (url.startsWith('/img/') ? `/abs${url}` : null)

test('rewriteHtmlImages: single format produces a plain <img srcset>', async () => {
  const { html, rewritten } = await rewriteHtmlImages({
    html: '<img src="/img/a.png" alt="A" class="hero">',
    options: normalizeImageOptions(true),
    resolve: resolveAll,
    generate: stubGenerate(),
  })

  assert.equal(rewritten, 1)
  assert.match(html, /srcset="\/assets\/img\/a-400\.webp 400w, \/assets\/img\/a-800\.webp 800w"/)
  assert.match(html, /sizes="100vw"/, 'an unsized image is taken to fill the viewport')
  assert.match(html, /width="800"/)
  assert.match(html, /height="400"/)
  assert.match(html, /loading="lazy"/)
  assert.match(html, /decoding="async"/)
  assert.match(html, /class="hero"/, 'author attributes are preserved')
  assert.match(html, /alt="A"/)
  assert.equal(html.includes('<picture>'), false)
})

test('rewriteHtmlImages: multiple formats produce <picture>', async () => {
  const { html } = await rewriteHtmlImages({
    html: '<img src="/img/a.png" alt="A">',
    options: normalizeImageOptions({ formats: ['avif', 'webp'] }),
    resolve: resolveAll,
    generate: stubGenerate(['avif', 'webp']),
  })

  assert.match(html, /^<picture><source type="image\/avif"/)
  assert.match(html, /<img [^>]*src="\/assets\/img\/a-800\.webp"/)
  assert.match(html, /<\/picture>$/)
})

test('rewriteHtmlImages: author dimensions keep their aspect ratio', async () => {
  const { html } = await rewriteHtmlImages({
    html: '<img src="/img/a.png" width="200">',
    options: normalizeImageOptions(true),
    resolve: resolveAll,
    generate: stubGenerate(),
  })

  assert.match(html, /width="200"/)
  assert.match(html, /height="100"/, '2:1 source at 200px wide is 100px tall')
  assert.match(html, /sizes="200px"/, 'a sized image reports its display width')
})

test('rewriteHtmlImages: leaves images it must not touch', async () => {
  const options = normalizeImageOptions({ exclude: ['**/og/**'] })
  const cases = [
    '<img src="https://example.com/a.png">',
    '<img src="/logo.svg">',
    '<img src="/img/og/card.png">',
    '<img src="/img/a.png" srcset="/img/a-2x.png 2x">',
    '<picture><source srcset="/img/a.webp"><img src="/img/a.png"></picture>',
    '<img alt="no src">',
  ]

  for (const input of cases) {
    const { html, rewritten } = await rewriteHtmlImages({
      html: input,
      options,
      resolve: (url) => (url.startsWith('/img/') && !url.endsWith('.svg') ? `/abs${url}` : null),
      generate: stubGenerate(),
    })

    assert.equal(rewritten, 0, `expected no rewrite for: ${input}`)
    assert.equal(html, input)
  }
})

test('rewriteHtmlImages: data-no-optimize opts out and is stripped', async () => {
  const { html, rewritten } = await rewriteHtmlImages({
    html: '<img src="/img/a.png" alt="A" data-no-optimize>',
    options: normalizeImageOptions(true),
    resolve: resolveAll,
    generate: stubGenerate(),
  })

  assert.equal(rewritten, 1)
  assert.equal(html, '<img src="/img/a.png" alt="A">')
})

test('rewriteHtmlImages: a failing source is warned about, not fatal', async () => {
  const warnings = []
  const { html, rewritten } = await rewriteHtmlImages({
    html: '<img src="/img/broken.png">',
    options: normalizeImageOptions(true),
    resolve: resolveAll,
    generate: async () => {
      throw new Error('unsupported image format')
    },
    onWarn: (message) => warnings.push(message),
  })

  assert.equal(rewritten, 0)
  assert.equal(html, '<img src="/img/broken.png">')
  assert.equal(warnings.length, 1)
  assert.match(warnings[0], /unsupported image format/)
})

test('rewriteHtmlImages: a > inside an attribute value does not end the tag', async () => {
  // javascript-to-html escapes only quotes, so this is what img({ alt }) writes.
  const { html, rewritten } = await rewriteHtmlImages({
    html: '<p>before</p><img src="/img/a.png" alt="Revenue > costs, 2025" title=\'a > b\'><p>after</p>',
    options: normalizeImageOptions(true),
    resolve: resolveAll,
    generate: stubGenerate(),
  })

  assert.equal(rewritten, 1)
  assert.match(html, /^<p>before<\/p><img src="\/assets\/img\/a-800\.webp" alt="Revenue > costs, 2025" title="a > b" [^<]*><p>after<\/p>$/)
})

test('rewriteHtmlImages: mapUrl rewrites every variant URL it writes', async () => {
  const { html } = await rewriteHtmlImages({
    html: '<img src="/img/a.png"><img src="/img/a.png?w=400">',
    options: normalizeImageOptions({ formats: ['avif', 'webp'] }),
    resolve: resolveAll,
    generate: stubGenerate(['avif', 'webp']),
    mapUrl: (url) => `..${url}`,
  })

  assert.ok(!/(?:src|srcset)="\/assets/.test(html), html)
  assert.ok(!/, \/assets/.test(html), html)
  assert.match(html, /srcset="\.\.\/assets\/img\/a-400\.avif 400w, \.\.\/assets\/img\/a-800\.avif 800w"/)
})

test('rewriteHtmlImages: reports the sources it rewrote away from', async () => {
  const { sources } = await rewriteHtmlImages({
    html: '<img src="/img/a.png"><img src="/img/b.png" data-no-optimize><img src="/elsewhere.png">',
    options: normalizeImageOptions(true),
    resolve: resolveAll,
    generate: stubGenerate(),
  })

  // Only a tag that now points at variants makes its original a candidate
  // for pruning; an opted-out or unresolved one still points at its file.
  assert.deepEqual([...sources], ['/abs/img/a.png'])
})

const NONE = { width: null, height: null, fit: null, background: null, position: null, format: null }

test('parseVariantHint: reads w, h and format from local URLs only', () => {
  assert.deepEqual(parseVariantHint('/img/a.png'), NONE)
  assert.deepEqual(parseVariantHint('/img/a.png?w=400'), { ...NONE, width: 400 })
  assert.deepEqual(parseVariantHint('/img/a.png?h=300'), { ...NONE, height: 300 })
  assert.deepEqual(parseVariantHint('/img/a.png?w=400&h=300'), { ...NONE, width: 400, height: 300 })
  assert.deepEqual(parseVariantHint('/img/a.png?w=400&h=300&fit=contain'), {
    ...NONE,
    width: 400,
    height: 300,
    fit: 'contain',
  })
  assert.deepEqual(
    parseVariantHint('/img/a.png?w=400&h=300&background=FFF'),
    { ...NONE, width: 400, height: 300, fit: 'contain', background: '#fff' },
    'background implies contain and hex gets its #',
  )
  assert.equal(parseVariantHint('/img/a.png?w=1&h=1&background=%23ffffff80').background, '#ffffff80')
  assert.equal(parseVariantHint('/img/a.png?w=1&h=1&background=White').background, 'white')
  assert.equal(parseVariantHint('/img/a.png?w=1&h=1&background=transparent').background, 'transparent')
  assert.equal(parseVariantHint('/img/a.png?w=1&h=1&position=top').position, 'top')
  assert.equal(parseVariantHint('/img/a.png?w=1&h=1&position=Top-Right').position, 'right top', 'spelled as sharp spells it')
  assert.equal(parseVariantHint('/img/a.png?w=1&h=1&position=bottom+left').position, 'left bottom')
  assert.equal(parseVariantHint('/img/a.png?w=1&h=1&position=center').position, 'centre')
  assert.equal(parseVariantHint('/img/a.png?w=1&h=1&position=attention').position, 'attention')
  assert.deepEqual(parseVariantHint('/img/a.png?format=jpeg'), { ...NONE, format: 'jpeg' })
  assert.deepEqual(parseVariantHint('/img/a.png?w=400&format=avif#top'), {
    ...NONE,
    width: 400,
    format: 'avif',
  })
  assert.deepEqual(parseVariantHint('/img/a.png?v=2'), NONE)
  assert.deepEqual(
    parseVariantHint('https://cdn.example/a.jpeg?w=500&fm=jpg'),
    NONE,
    'a remote query string belongs to the origin',
  )
})

test('parseVariantHint: reports bad values', () => {
  assert.match(parseVariantHint('/img/a.png?w=big').error, /\?w= must be a positive integer/)
  assert.match(parseVariantHint('/img/a.png?w=0').error, /positive integer/)
  assert.match(parseVariantHint('/img/a.png?h=-1').error, /\?h= must be a positive integer/)
  assert.match(parseVariantHint('/img/a.png?format=gif').error, /avif, webp, jpeg, png/)
  assert.match(parseVariantHint('/img/a.png?w=1&h=1&fit=fill').error, /cover or contain/)
  assert.match(parseVariantHint('/img/a.png?w=100&fit=cover').error, /\?fit= needs both \?w= and \?h=/)
  assert.match(parseVariantHint('/img/a.png?w=100&background=fff').error, /\?background= needs both/)
  assert.match(parseVariantHint('/img/a.png?w=1&h=1&fit=cover&background=fff').error, /pads fit=contain/)
  assert.match(parseVariantHint('/img/a.png?w=1&h=1&background=rgb(1,2,3)').error, /hex colour/)
  assert.match(parseVariantHint('/img/a.png?w=1&h=1&position=middle').error, /edge or corner/)
  assert.match(parseVariantHint('/img/a.png?w=100&position=top').error, /\?position= needs both/)
  assert.match(parseVariantHint('/img/a.png?w=1&h=1&fit=contain&position=top').error, /contain crops nothing/)
  assert.match(parseVariantHint('/img/a.png?w=1&h=1&background=fff&position=top').error, /contain crops nothing/)
})

test('resolveSizes: pins a side exactly, follows the aspect ratio, never upscales', () => {
  const intrinsic = { width: 1600, height: 900 }
  const widths = [400, 800]

  assert.deepEqual(resolveSizes(intrinsic, NONE, widths), [{ width: 400 }, { width: 800 }, { width: 1600 }])
  assert.deepEqual(resolveSizes(intrinsic, { ...NONE, width: 234 }, widths), [{ width: 234 }])
  assert.deepEqual(resolveSizes(intrinsic, { ...NONE, width: 5000 }, widths), [{ width: 1600 }])
  assert.deepEqual(
    resolveSizes(intrinsic, { ...NONE, height: 456 }, widths),
    [{ width: 811, height: 456 }],
    'h alone: width follows the aspect ratio',
  )
  assert.deepEqual(
    resolveSizes(intrinsic, { ...NONE, width: 200, height: 200 }, widths),
    [{ width: 200, height: 200 }],
    'w and h: the box is filled and cropped',
  )
  assert.deepEqual(
    resolveSizes(intrinsic, { ...NONE, width: 2000, height: 1000 }, widths),
    [{ width: 1600, height: 900 }],
    'a box larger than the source is clamped to it',
  )
  assert.deepEqual(
    resolveSizes(intrinsic, { ...NONE, width: 200, height: 200, fit: 'cover' }, widths),
    [{ width: 200, height: 200 }],
    'cover is the default spelled out',
  )
  assert.deepEqual(
    resolveSizes(intrinsic, { ...NONE, width: 200, height: 200, fit: 'contain' }, widths),
    [{ width: 200, height: 113 }],
    'contain: the whole image fits inside the box',
  )
  assert.deepEqual(
    resolveSizes(intrinsic, { ...NONE, width: 3200, height: 3200, fit: 'contain' }, widths),
    [{ width: 1600, height: 900 }],
    'contain never upscales either',
  )
  assert.deepEqual(
    resolveSizes(intrinsic, { ...NONE, width: 200, height: 200, fit: 'contain', background: '#fff' }, widths),
    [{ width: 200, height: 200, inner: { width: 200, height: 113 }, background: '#fff' }],
    'a background pads the canvas out to the box',
  )
  assert.deepEqual(
    resolveSizes(intrinsic, { ...NONE, width: 3200, height: 3200, fit: 'contain', background: '#fff' }, widths),
    [{ width: 3200, height: 3200, inner: { width: 1600, height: 900 }, background: '#fff' }],
    'padding is not upscaling: the picture stays put, the canvas grows',
  )
  assert.deepEqual(
    resolveSizes(intrinsic, { ...NONE, width: 400, height: 100, position: 'top' }, widths),
    [{ width: 400, height: 100, position: 'top' }],
    'a position rides along with a cover box',
  )
})

/** Like stubGenerate, but honours a pinned width/format the way the processor does. */
function stubGenerateWithHint(formats = ['webp']) {
  return async (sourcePath, hint = {}) => {
    if (hint.width == null && hint.height == null) {
      return stubGenerate(hint.format ? [hint.format] : formats)(sourcePath)
    }

    const [{ width, height = width / 2 }] = resolveSizes({ width: 800, height: 400 }, hint, [])
    const size = hint.height == null ? String(width) : `${width}x${height}`
    const used = hint.format ? [hint.format] : formats
    return {
      ladders: used.map((format) => ({
        format,
        variants: [{ url: `/assets/img/a-${size}.${format}`, width }],
      })),
      fallback: {
        url: `/assets/img/a-${size}.${used[used.length - 1]}`,
        width,
        format: used[used.length - 1],
      },
      width,
      height,
    }
  }
}

test('rewriteHtmlImages: ?w= pins a single variant with no ladder', async () => {
  const hints = []
  const { html, rewritten } = await rewriteHtmlImages({
    html: '<img src="/img/a.png?w=400" alt="Thumb">',
    options: normalizeImageOptions(true),
    resolve: resolveAll,
    generate: async (sourcePath, hint) => {
      hints.push(hint)
      return stubGenerateWithHint()(sourcePath, hint)
    },
  })

  assert.equal(rewritten, 1)
  assert.deepEqual(hints, [{ ...NONE, width: 400 }])
  assert.equal(
    html,
    '<img src="/assets/img/a-400.webp" alt="Thumb" width="400" height="200" loading="lazy" decoding="async">',
  )
})

test('rewriteHtmlImages: ?w= with ?h= pins a cropped box', async () => {
  const { html } = await rewriteHtmlImages({
    html: '<img src="/img/a.png?w=200&h=200" alt="Square">',
    options: normalizeImageOptions(true),
    resolve: resolveAll,
    generate: stubGenerateWithHint(),
  })

  assert.equal(
    html,
    '<img src="/assets/img/a-200x200.webp" alt="Square" width="200" height="200" loading="lazy" decoding="async">',
  )
})

test('rewriteHtmlImages: ?format= alone keeps the ladder in that format', async () => {
  const { html } = await rewriteHtmlImages({
    html: '<img src="/img/a.png?format=jpeg">',
    options: normalizeImageOptions({ formats: ['avif', 'webp'] }),
    resolve: resolveAll,
    generate: stubGenerateWithHint(['avif', 'webp']),
  })

  assert.equal(html.includes('<picture>'), false, 'one format needs no <picture>')
  assert.match(html, /srcset="\/assets\/img\/a-400\.jpeg 400w, \/assets\/img\/a-800\.jpeg 800w"/)
})

test('rewriteHtmlImages: a pinned width with several formats gives one file per <source>', async () => {
  const { html } = await rewriteHtmlImages({
    html: '<img src="/img/a.png?w=400" alt="Thumb">',
    options: normalizeImageOptions({ formats: ['avif', 'webp'] }),
    resolve: resolveAll,
    generate: stubGenerateWithHint(['avif', 'webp']),
  })

  assert.equal(
    html,
    '<picture><source type="image/avif" srcset="/assets/img/a-400.avif">' +
      '<img src="/assets/img/a-400.webp" alt="Thumb" width="400" height="200" loading="lazy" decoding="async">' +
      '</picture>',
  )
})

test('rewriteHtmlImages: a bad hint is warned about and the tag left alone', async () => {
  const warnings = []
  const { html, rewritten } = await rewriteHtmlImages({
    html: '<img src="/img/a.png?w=huge">',
    options: normalizeImageOptions(true),
    resolve: resolveAll,
    generate: stubGenerate(),
    onWarn: (message) => warnings.push(message),
  })

  assert.equal(rewritten, 0)
  assert.equal(html, '<img src="/img/a.png?w=huge">')
  assert.equal(warnings.length, 1)
  assert.match(warnings[0], /\?w= must be a positive integer/)
})

test('sitelo build optimizes referenced images', async (t) => {
  const imagesDir = path.join(fixtureDir, 'src', 'images')
  const distDir = path.join(fixtureDir, 'dist')

  const cleanup = () => {
    fs.rmSync(distDir, { recursive: true, force: true })
    fs.rmSync(imagesDir, { recursive: true, force: true })
    fs.rmSync(path.join(fixtureDir, '.sitelo'), { recursive: true, force: true })
  }

  cleanup()
  t.after(cleanup)

  fs.mkdirSync(imagesDir, { recursive: true })
  // Blue, with a red band across the top so a crop's position shows.
  await sharp({
    create: {
      width: 1600,
      height: 900,
      channels: 3,
      background: { r: 90, g: 140, b: 210 },
    },
  })
    .composite([
      {
        input: {
          create: { width: 1600, height: 100, channels: 3, background: { r: 220, g: 40, b: 40 } },
        },
        top: 0,
        left: 0,
      },
    ])
    .png()
    .toFile(path.join(imagesDir, 'hero.png'))

  // Referenced only by an <img> that gets rewritten, so nothing in dist
  // points at the original once the build is done.
  await sharp({
    create: { width: 900, height: 600, channels: 3, background: { r: 40, g: 160, b: 90 } },
  })
    .png()
    .toFile(path.join(imagesDir, 'orphan.png'))

  await execFileAsync(process.execPath, [cliPath, 'build'], {
    cwd: fixtureDir,
    env: process.env,
  })

  const html = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8')
  const variants = fs.readdirSync(path.join(distDir, 'assets', 'img'))

  assert.equal(
    variants.length,
    13,
    'hero gives 400, 800 and its own 1600 plus one file per pinned tag; orphan gives 400, 800 and 900',
  )
  assert.equal(variants.filter((file) => file.endsWith('.webp')).length, 12)
  assert.equal(variants.filter((file) => file.endsWith('.jpg')).length, 1)

  assert.match(html, /<img src="\/assets\/img\/hero\.[a-f0-9]+-1600\.webp" alt="Hero" sizes="100vw"/)
  assert.match(html, /srcset="[^"]*400w[^"]*800w[^"]*1600w"/)
  assert.match(html, /width="1600" height="900"/)

  // ?w= reuses the ladder's 400px file and pins the tag to it.
  const pinned = html.match(/<img src="(\/assets\/img\/hero\.[a-f0-9]+-400\.webp)" alt="Pinned" width="400" height="225" loading="lazy" decoding="async">/)
  assert.ok(pinned, `a pinned tag has one src and no srcset:\n${html}`)
  assert.ok(html.includes(`${pinned[1]} 400w`), 'the same file serves the ladder')
  assert.match(
    html,
    /<img src="\/assets\/img\/hero\.[a-f0-9]+-300\.jpg" alt="Pinned jpeg" width="300" height="169" loading="lazy" decoding="async">/,
  )
  assert.match(
    html,
    /<img src="\/assets\/img\/hero\.[a-f0-9]+-400x225\.webp" alt="Pinned height" width="400" height="225" loading="lazy" decoding="async">/,
  )
  const square = html.match(/<img src="(\/assets\/img\/hero\.[a-f0-9]+-200x200\.webp)" alt="Square" width="200" height="200" loading="lazy" decoding="async">/)
  assert.ok(square, 'w and h together give a cropped box')
  const squareMeta = await sharp(path.join(distDir, square[1])).metadata()
  assert.deepEqual([squareMeta.width, squareMeta.height], [200, 200], 'the file really is 200×200')
  assert.match(
    html,
    /<img src="\/assets\/img\/hero\.[a-f0-9]+-200x113\.webp" alt="Contained" width="200" height="113" loading="lazy" decoding="async">/,
    'fit=contain keeps the whole image inside the box',
  )
  const padded = html.match(/<img src="(\/assets\/img\/hero\.[a-f0-9]+-200x200\.webp)" alt="Padded" width="200" height="200" loading="lazy" decoding="async">/)
  assert.ok(padded, 'a background pads the box back out to 200×200')
  assert.notEqual(padded[1], square[1], 'padded and cropped boxes are different files')
  const pixelAt = async (file, x, y) => {
    const { data, info } = await sharp(path.join(distDir, file)).raw().toBuffer({ resolveWithObject: true })
    const offset = (y * info.width + x) * info.channels
    return [...data.slice(offset, offset + 3)]
  }
  const near = (a, b) => a.every((value, i) => Math.abs(value - b[i]) <= 3)
  const blue = [90, 140, 210]
  const red = [220, 40, 40]
  assert.ok(near(await pixelAt(padded[1], 0, 0), [255, 255, 255]), 'the top bar is the background')
  assert.ok(near(await pixelAt(padded[1], 100, 100), blue), 'the picture sits in the middle')

  // A 400×100 box on a 16:9 source crops vertically: centred loses the red
  // band at the top, position=top keeps it.
  const strip = html.match(/<img src="(\/assets\/img\/hero\.[a-f0-9]+-400x100\.webp)" alt="Strip"/)
  const top = html.match(/<img src="(\/assets\/img\/hero\.[a-f0-9]+-400x100\.webp)" alt="Top"/)
  assert.ok(strip && top, 'both crops were emitted')
  assert.notEqual(strip[1], top[1], 'position is part of the file identity')
  assert.ok(near(await pixelAt(strip[1], 200, 2), blue), 'a centred crop drops the top band')
  assert.ok(near(await pixelAt(top[1], 200, 2), red), 'position=top keeps the top band')

  assert.match(html, /<img src="\/images\/hero\.png" alt="Untouched">/)

  // prune is on by default: the orphaned original goes, the one a
  // data-no-optimize tag still points at stays.
  assert.match(html, /<img src="\/assets\/img\/orphan\.[a-f0-9]+-900\.webp" alt="Orphan"/)
  assert.equal(fs.existsSync(path.join(distDir, 'images', 'orphan.png')), false, 'unreferenced original pruned')
  assert.equal(fs.existsSync(path.join(distDir, 'images', 'hero.png')), true, 'referenced original kept')
  assert.match(html, /<img src="\/logo\.svg" alt="Vector">/)
  assert.match(html, /<img src="https:\/\/example\.com\/remote\.png" alt="Remote">/)

  // Variants are cached by content hash, so a second build is a no-op.
  const before = fs.statSync(path.join(distDir, 'assets', 'img', variants[0])).mtimeMs
  await execFileAsync(process.execPath, [cliPath, 'build'], {
    cwd: fixtureDir,
    env: process.env,
  })
  assert.deepEqual(
    fs.readdirSync(path.join(distDir, 'assets', 'img')).sort(),
    variants.sort(),
    'a rebuild produces the same variant set',
  )
  assert.ok(before > 0)
})

/**
 * A project of its own under `test/.tmp`, at a path with a folder named
 * `remote` in it — the name the pipeline once mistook for its download
 * cache, deleting whatever image failed to process.
 */
function remoteProject(t) {
  const tmpRoot = path.join(rootDir, 'test', '.tmp')
  fs.mkdirSync(tmpRoot, { recursive: true })
  const holder = fs.mkdtempSync(path.join(tmpRoot, 'images-'))
  t.after(() => fs.rmSync(holder, { recursive: true, force: true }))

  const root = path.join(holder, 'remote', 'site')
  fs.mkdirSync(path.join(root, 'public'), { recursive: true })
  fs.mkdirSync(path.join(root, 'src'), { recursive: true })
  return root
}

const solid = (width, background = { r: 90, g: 140, b: 210 }) =>
  sharp({ create: { width, height: Math.round(width * 0.6), channels: 3, background } }).png()

test('dev pipeline: an image that fails is left on disk, wherever the project lives', async (t) => {
  const root = remoteProject(t)
  const broken = path.join(root, 'public', 'broken.png')
  fs.writeFileSync(broken, 'not an image at all')

  const warnings = []
  const pipeline = createDevImagePipeline({
    root,
    options: normalizeImageOptions({ cacheDir: '.cache' }),
    warn: (message) => warnings.push(message),
  })

  const html = await pipeline.transform('<img src="/broken.png" alt="">')

  assert.equal(html, '<img src="/broken.png" alt="">')
  assert.match(warnings.join('\n'), /broken\.png/)
  assert.equal(fs.readFileSync(broken, 'utf8'), 'not an image at all', 'the source file survives')
})

test('dev pipeline: an edited image gets new variants without a restart', async (t) => {
  const root = remoteProject(t)
  const file = path.join(root, 'public', 'photo.png')
  const pipeline = createDevImagePipeline({
    root,
    options: normalizeImageOptions({ cacheDir: '.cache' }),
    warn: () => {},
  })
  const srcOf = async () => (await pipeline.transform('<img src="/photo.png" alt="">')).match(/src="([^"]+)"/)[1]

  await solid(500, { r: 200, g: 30, b: 30 }).toFile(file)
  const first = await srcOf()

  fs.writeFileSync(file, 'half-written')
  assert.equal(await srcOf(), '/photo.png', 'a broken revision is skipped…')

  await solid(400, { r: 30, g: 200, b: 30 }).toFile(file)
  const second = await srcOf()

  assert.notEqual(second, '/photo.png', '…and the next good one is picked up rather than the failure being remembered')
  assert.notEqual(second, first, 'the edit shows up as a different variant')
  assert.match(second, /-400\.webp$/)
})

test('sitelo build prunes only the originals it replaced', async (t) => {
  const root = remoteProject(t)
  const pub = (...parts) => path.join(root, 'public', ...parts)
  const page = (route, body) => {
    const dir = path.join(root, 'src', ...route)
    fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(
      path.join(dir, 'index.ht.js'),
      `export default () => ${JSON.stringify(`<!doctype html><html lang="en"><head><title>t</title><link rel="manifest" href="/site.webmanifest"></head><body>${body}</body></html>`)}`,
    )
  }

  fs.mkdirSync(pub('icons'), { recursive: true })
  fs.mkdirSync(pub('blog', 'post'), { recursive: true })
  await solid(180).toFile(pub('apple-touch-icon.png'))
  await solid(192).toFile(pub('icons', 'icon-192.png'))
  fs.writeFileSync(pub('site.webmanifest'), JSON.stringify({ icons: [{ src: '/icons/icon-192.png' }] }))
  await solid(1000).toFile(pub('hero.png'))
  await solid(600).toFile(pub('blog', 'post', 'cover.png'))
  fs.writeFileSync(pub('broken.png'), 'not an image at all')
  fs.writeFileSync(path.join(root, 'sitelo.config.js'), "export default { images: { cacheDir: '.cache' } }\n")

  page([], '<img src="/hero.png" alt="Hero"><img src="/broken.png" alt="Broken">')
  page(['blog', 'post'], '<img src="cover.png" alt="Cover"><a href="cover.png">Full size</a>')

  await execFileAsync(process.execPath, [cliPath, 'build', '--root', root], { env: process.env })

  const dist = (...parts) => path.join(root, 'dist', ...parts)
  const post = fs.readFileSync(dist('blog', 'post', 'index.html'), 'utf8')

  assert.equal(fs.existsSync(dist('hero.png')), false, 'an original only a rewritten tag used is pruned')
  assert.ok(fs.existsSync(dist('apple-touch-icon.png')), 'a file no tag pointed at is not a candidate')
  assert.ok(fs.existsSync(dist('icons', 'icon-192.png')), 'nor is one a web manifest lists')
  assert.match(post, /<img src="\/assets\/img\/cover\.[a-f0-9]+-600\.webp" alt="Cover"/, 'a relative src resolves against its page')
  assert.ok(fs.existsSync(dist('blog', 'post', 'cover.png')), 'an original a relative link still points at stays')
  assert.ok(fs.existsSync(dist('broken.png')), 'an image that failed is left for the page that uses it')
  assert.ok(fs.existsSync(pub('broken.png')), 'and the source is never touched')
})

test('sitelo build --logLevel silent prints no image lines', async (t) => {
  const root = remoteProject(t)

  await solid(600).toFile(path.join(root, 'public', 'hero.png'))
  fs.writeFileSync(path.join(root, 'sitelo.config.js'), "export default { images: { cacheDir: '.cache' }, buildReport: false }\n")
  fs.writeFileSync(
    path.join(root, 'src', 'index.ht.js'),
    `export default () => '<!doctype html><html lang="en"><head><title>t</title></head><body><img src="/hero.png" alt="Hero"></body></html>'\n`,
  )

  const build = async (...args) => {
    const { stdout, stderr } = await execFileAsync(
      process.execPath,
      [cliPath, 'build', '--root', root, ...args],
      { env: process.env },
    )
    return `${stdout}${stderr}`
  }

  assert.match(await build(), /\[sitelo\] images optimized 1 source/)

  // The progress lines a remote pass prints go through the same `log`.
  const quiet = await build('--logLevel', 'silent')
  assert.doesNotMatch(quiet, /images/)
  assert.match(
    fs.readFileSync(path.join(root, 'dist', 'index.html'), 'utf8'),
    /<img src="\/assets\/img\/hero\.[a-f0-9]+-600\.webp"/,
    'the images are still optimized',
  )

  assert.doesNotMatch(await build('--logLevel', 'warn'), /images/)
})

test('dev pipeline: a JPEG with data after its end marker is still optimized', async (t) => {
  const root = remoteProject(t)
  const jpeg = await sharp({ create: { width: 800, height: 600, channels: 3, background: { r: 200, g: 120, b: 40 } } })
    .jpeg()
    .toBuffer()

  // What a phone's motion photo looks like: a complete JPEG, then a video.
  fs.writeFileSync(path.join(root, 'public', 'motion.jpg'), Buffer.concat([jpeg, Buffer.from('ftypmp42 and then a video')]))
  // And one that really is cut short.
  fs.writeFileSync(path.join(root, 'public', 'cut.jpg'), jpeg.subarray(0, jpeg.length >> 1))

  const warnings = []
  const pipeline = createDevImagePipeline({
    root,
    options: normalizeImageOptions({ cacheDir: '.cache' }),
    warn: (message) => warnings.push(message),
  })
  const html = await pipeline.transform('<img src="/motion.jpg" alt=""><img src="/cut.jpg" alt="">')

  assert.match(html, /<img src="\/_sitelo\/images\/motion\.[a-f0-9]+-800\.webp"/)
  assert.match(html, /<img src="\/cut\.jpg" alt="">/)
  assert.match(warnings.join('\n'), /cut\.jpg: not a decodable raster image/)
})

test('runImages: variant URLs follow a full-URL or relative base', async (t) => {
  const build = async (base) => {
    const root = remoteProject(t)
    const dist = path.join(root, 'dist')
    fs.mkdirSync(path.join(dist, 'blog'), { recursive: true })
    await solid(600).toFile(path.join(dist, 'a.png'))
    fs.writeFileSync(path.join(dist, 'index.html'), '<img src="/a.png" alt="">')
    fs.writeFileSync(path.join(dist, 'blog', 'index.html'), '<img src="../a.png" alt="">')

    await runImages({
      root,
      outDir: 'dist',
      base,
      options: normalizeImageOptions({ cacheDir: '.cache', prune: false }),
      log: () => {},
      warn: (message) => assert.fail(message),
    })

    return ['index.html', path.join('blog', 'index.html')].map((file) => fs.readFileSync(path.join(dist, file), 'utf8'))
  }

  const [cdnHome, cdnBlog] = await build('https://cdn.example/site/')
  assert.match(cdnHome, /src="https:\/\/cdn\.example\/site\/assets\/img\/a\.[a-f0-9]+-600\.webp"/)
  assert.match(cdnBlog, /src="https:\/\/cdn\.example\/site\/assets\/img\/a\.[a-f0-9]+-600\.webp"/)

  const [relHome, relBlog] = await build('./')
  assert.match(relHome, /src="assets\/img\/a\.[a-f0-9]+-600\.webp"/)
  assert.match(relBlog, /src="\.\.\/assets\/img\/a\.[a-f0-9]+-600\.webp"/, 'relative to the page, one level down')
  assert.match(relBlog, /srcset="\.\.\/assets\/img\/a\.[a-f0-9]+-400\.webp 400w, \.\.\/assets/)
})

test('normalizeImageOptions: placeholder is off unless asked for', () => {
  assert.equal(normalizeImageOptions(true).placeholder, null)
  assert.equal(normalizeImageOptions({ placeholder: false }).placeholder, null)
  assert.deepEqual(normalizeImageOptions({ placeholder: true }).placeholder, { blur: 20, bytes: 500 })
  assert.deepEqual(normalizeImageOptions({ placeholder: { blur: 8 } }).placeholder, { blur: 8, bytes: 500 })
  assert.deepEqual(normalizeImageOptions({ placeholder: { bytes: 300 } }).placeholder, { blur: 20, bytes: 300 })

  assert.throws(() => normalizeImageOptions({ placeholder: 'blur' }), /"images\.placeholder" must be true or an object/)
  assert.throws(() => normalizeImageOptions({ placeholder: [] }), /"images\.placeholder" must be true or an object/)
  for (const blur of [0, -4, '20px', Infinity]) {
    assert.throws(() => normalizeImageOptions({ placeholder: { blur } }), /placeholder\.blur/, `rejects blur ${String(blur)}`)
  }
  for (const bytes of [0, 12.5, '500']) {
    assert.throws(() => normalizeImageOptions({ placeholder: { bytes } }), /placeholder\.bytes/, `rejects bytes ${bytes}`)
  }
})

test('placeholderStyle: a blurred SVG background, safe in a URL and an attribute', () => {
  const style = placeholderStyle('UklGRg+/=', 20)

  assert.match(style, /^background-image:url\("data:image\/svg\+xml,/)
  assert.ok(style.includes("stdDeviation='20'"), 'the blur is the radius asked for')
  assert.ok(style.includes("href='data:image/webp;base64,UklGRg+/='"), 'the WebP rides inside as it is')
  assert.ok(style.includes("filter='url(%23b)'"), 'a bare # would end the data URL')

  const url = style.match(/url\("([^"]*)"\)/)[1]
  assert.doesNotMatch(url, /[<>#"]/, 'nothing in it reads as markup or ends it early')
  assert.match(
    style,
    /;background-origin:content-box;background-repeat:no-repeat$/,
    'only the content box is painted, so padding keeps its own colour',
  )
})

/** Wrap a stub generator so its result carries a placeholder. */
const withPlaceholder = (generate, placeholder = 'UklGRg==') =>
  async (...args) => ({ ...(await generate(...args)), placeholder })

test('rewriteHtmlImages: placeholder paints a blurred background, last on the tag', async () => {
  const { html } = await rewriteHtmlImages({
    html: '<img src="/img/a.png" alt="A">',
    options: normalizeImageOptions({ placeholder: true }),
    resolve: resolveAll,
    generate: withPlaceholder(stubGenerate()),
  })

  const style = placeholderStyle('UklGRg==', 20).replace(/"/g, '&quot;')
  assert.equal(
    html,
    '<img src="/assets/img/a-800.webp" alt="A" sizes="100vw" width="800" height="400" loading="lazy" decoding="async" ' +
      `srcset="/assets/img/a-400.webp 400w, /assets/img/a-800.webp 800w" style="${style}">`,
  )
})

test('rewriteHtmlImages: an author style has the last word, and data-no-placeholder opts out', async () => {
  const run = async (html, placeholder = true, formats = ['webp']) =>
    (
      await rewriteHtmlImages({
        html,
        options: normalizeImageOptions({ placeholder, formats }),
        resolve: resolveAll,
        generate: withPlaceholder(stubGenerate(formats)),
      })
    ).html

  const styled = await run('<img src="/img/a.png" alt="A" style="border-radius:8px">', { blur: 12 })
  const [, style] = styled.match(/style="([^"]*)"/)
  assert.ok(style.startsWith('background-image:url(&quot;data:image/svg+xml,'))
  assert.ok(style.includes("stdDeviation='12'"), 'blur is configurable')
  assert.ok(style.endsWith(';border-radius:8px'), 'the author style comes after ours, so it wins')
  assert.equal(styled.match(/style=/g).length, 1, 'one style attribute, merged')

  const optedOut = await run('<img src="/img/a.png" alt="A" data-no-placeholder>')
  assert.match(optedOut, /srcset=/, 'the tag is still optimized')
  assert.doesNotMatch(optedOut, /style=|data-no-placeholder/, 'no placeholder, and the marker is stripped')

  assert.doesNotMatch(await run('<img src="/img/a.png" alt="A">', false), /style=/, 'off means off')

  const picture = await run('<img src="/img/a.png" alt="A">', true, ['avif', 'webp'])
  assert.match(picture, /^<picture><source [^>]*><img [^>]*style="background-image:[^"]*"><\/picture>$/, 'it goes on the <img> inside <picture>')
})

/**
 * A 640×400 picture of 20px blocks of seeded random colour: as busy as a
 * picture gets at placeholder size, so the byte budget has work to do.
 */
const busy = () => {
  const data = Buffer.alloc(32 * 20 * 3)
  let state = 1
  for (let i = 0; i < data.length; i += 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0
    data[i] = state >>> 24
  }
  return sharp(data, { raw: { width: 32, height: 20, channels: 3 } })
    .resize(640, 400, { kernel: 'nearest' })
    .png()
}

/** The placeholder WebP in a rewritten tag, or null when it has none. */
const placeholderIn = async (html) => {
  const base64 = html.match(/;base64,([A-Za-z0-9+/=]+)'/)?.[1]
  if (!base64) return null
  const buffer = Buffer.from(base64, 'base64')
  return { base64, buffer, meta: await sharp(buffer).metadata() }
}

test('dev pipeline: a placeholder is the largest WebP whose base64 fits the budget', async (t) => {
  const root = remoteProject(t)
  await busy().toFile(path.join(root, 'public', 'busy.png'))

  const placeholderFor = async (placeholder) => {
    const pipeline = createDevImagePipeline({
      root,
      options: normalizeImageOptions({ cacheDir: '.cache', placeholder }),
      warn: (message) => assert.fail(message),
    })
    return placeholderIn(await pipeline.transform('<img src="/busy.png" alt="">'))
  }

  const fitted = await placeholderFor(true)
  assert.equal(fitted.meta.format, 'webp')
  assert.ok(fitted.base64.length <= 500, `fits 500 bytes of base64, got ${fitted.base64.length}`)
  assert.ok(fitted.meta.width < 64, `a busy picture steps down from 64px to fit, got ${fitted.meta.width}px`)
  assert.ok(Math.abs(fitted.meta.width / fitted.meta.height - 1.6) < 0.15, 'the picture keeps its shape')

  const roomy = await placeholderFor({ bytes: 100_000 })
  assert.equal(roomy.meta.width, 64, 'the longest side never needs more than 64px')
  assert.ok(roomy.base64.length > 500, 'which is more than the default budget would allow')

  const tight = await placeholderFor({ bytes: 1 })
  assert.equal(tight.meta.width, 8, 'a budget nothing fits gets the smallest')
})

test('dev pipeline: no placeholder for a see-through picture, one for an opaque picture with alpha', async (t) => {
  const root = remoteProject(t)
  const red = { r: 200, g: 30, b: 30, alpha: 1 }
  await sharp({ create: { width: 600, height: 400, channels: 4, background: red } })
    .png()
    .toFile(path.join(root, 'public', 'opaque.png'))
  // The same, with its top-left corner cut out.
  await sharp({ create: { width: 600, height: 400, channels: 4, background: red } })
    .composite([
      {
        input: { create: { width: 60, height: 60, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } },
        left: 0,
        top: 0,
        blend: 'dest-in',
      },
    ])
    .png()
    .toFile(path.join(root, 'public', 'cutout.png'))

  const pipeline = createDevImagePipeline({
    root,
    options: normalizeImageOptions({ cacheDir: '.cache', placeholder: true }),
    warn: (message) => assert.fail(message),
  })
  const transform = (src) => pipeline.transform(`<img src="${src}" alt="">`)

  const opaque = await transform('/opaque.png')
  assert.ok(await placeholderIn(opaque), 'an alpha channel alone is not a reason to skip it')

  const cutout = await transform('/cutout.png')
  assert.match(cutout, /srcset=/, 'the see-through picture is still optimized')
  assert.equal(await placeholderIn(cutout), null, 'but the placeholder would show through it')

  assert.equal(
    await placeholderIn(await transform('/opaque.png?w=300&h=300&background=transparent')),
    null,
    'see-through padding counts too',
  )
  assert.ok(await placeholderIn(await transform('/opaque.png?w=300&h=300&background=fff')), 'opaque padding does not')
})

test('dev pipeline: a cropped box gets a placeholder of what the crop keeps', async (t) => {
  const root = remoteProject(t)
  // Blue, with a red band across the top ninth.
  await sharp({ create: { width: 1600, height: 900, channels: 3, background: { r: 90, g: 140, b: 210 } } })
    .composite([
      { input: { create: { width: 1600, height: 100, channels: 3, background: { r: 220, g: 40, b: 40 } } }, top: 0, left: 0 },
    ])
    .png()
    .toFile(path.join(root, 'public', 'banded.png'))

  const pipeline = createDevImagePipeline({
    root,
    options: normalizeImageOptions({ cacheDir: '.cache', placeholder: true }),
    warn: (message) => assert.fail(message),
  })
  const topRow = async (src) => {
    const { buffer, meta } = await placeholderIn(await pipeline.transform(`<img src="${src}" alt="">`))
    const { data, info } = await sharp(buffer).raw().toBuffer({ resolveWithObject: true })
    const offset = Math.floor(info.width / 2) * info.channels
    return { pixel: [...data.slice(offset, offset + 3)], meta }
  }

  // A 400×100 box keeps a quarter of the band with position=top, none centred.
  const top = await topRow('/banded.png?w=400&h=100&position=top')
  assert.deepEqual([top.meta.width, top.meta.height], [64, 16], 'the placeholder has the box’s shape')
  assert.ok(top.pixel[0] > top.pixel[2], `position=top keeps the red band, got ${top.pixel}`)

  const centred = await topRow('/banded.png?w=400&h=100')
  assert.ok(centred.pixel[2] > centred.pixel[0], `a centred crop drops it, got ${centred.pixel}`)
})

test('dev pipeline: placeholders are cached on disk and shared by the ladder and a pinned width', async (t) => {
  const root = remoteProject(t)
  await solid(800).toFile(path.join(root, 'public', 'photo.png'))
  const options = normalizeImageOptions({ cacheDir: '.cache', placeholder: true })
  const cacheDir = path.join(root, '.cache')
  const cached = () => fs.readdirSync(cacheDir).filter((file) => file.endsWith('-placeholder.txt'))
  const html = '<img src="/photo.png" alt=""><img src="/photo.png?w=200" alt="">'

  const first = await createDevImagePipeline({ root, options, warn: assert.fail }).transform(html)
  const styles = first.match(/style="[^"]*"/g)
  assert.equal(styles.length, 2)
  assert.equal(styles[0], styles[1], 'the ladder and ?w=200 show the same picture, so the same placeholder')
  assert.equal(cached().length, 1, 'made once')

  // A fresh process reads the cache rather than decoding the source again.
  fs.writeFileSync(path.join(cacheDir, cached()[0]), 'Q0FDSEVE')
  const second = await createDevImagePipeline({ root, options, warn: assert.fail }).transform(html)
  assert.equal(second.match(/;base64,Q0FDSEVE'/g)?.length, 2, 'both tags come from the cache')
})

test('runImages: the build log counts placeholders', async (t) => {
  const root = remoteProject(t)
  const dist = path.join(root, 'dist')
  fs.mkdirSync(dist, { recursive: true })
  await solid(600).toFile(path.join(dist, 'a.png'))
  fs.writeFileSync(path.join(dist, 'index.html'), '<img src="/a.png" alt="">')

  const lines = []
  await runImages({
    root,
    outDir: 'dist',
    options: normalizeImageOptions({ cacheDir: '.cache', placeholder: true }),
    log: (message) => lines.push(message),
    warn: (message) => assert.fail(message),
  })

  assert.match(lines.join('\n'), /images optimized 1 source → 2 variants, 1 placeholder across 1 tag/)
  assert.match(fs.readFileSync(path.join(dist, 'index.html'), 'utf8'), /style="background-image:url\(&quot;data:image\/svg\+xml,/)
})
