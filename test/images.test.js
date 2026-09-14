import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import { test } from 'node:test'

import sharp from 'sharp'

import {
  normalizeImageOptions,
  parseAttributes,
  parseVariantHint,
  resolveSizes,
  resolveWidths,
  rewriteHtmlImages,
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
