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
  assert.equal(options.prune, false)
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
    prune: true,
  })

  assert.deepEqual(options.widths, [400, 1200])
  assert.deepEqual(options.formats, ['avif', 'webp'])
  assert.equal(options.quality.webp, 90)
  assert.equal(options.quality.avif, 55, 'unspecified qualities keep defaults')
  assert.equal(options.lazy, false)
  assert.equal(options.prune, true)
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

test('resolveWidths: never upscales past the source', () => {
  assert.deepEqual(resolveWidths(3000, [400, 800, 1200]), [400, 800, 1200])
  assert.deepEqual(resolveWidths(600, [400, 800, 1200]), [400, 600])
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
  assert.match(html, /sizes="\(max-width: 800px\) 100vw, 800px"/)
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

test('parseVariantHint: reads w and format from local URLs only', () => {
  assert.deepEqual(parseVariantHint('/img/a.png'), { width: null, format: null })
  assert.deepEqual(parseVariantHint('/img/a.png?w=400'), { width: 400, format: null })
  assert.deepEqual(parseVariantHint('/img/a.png?format=jpeg'), { width: null, format: 'jpeg' })
  assert.deepEqual(parseVariantHint('/img/a.png?w=400&format=avif#top'), {
    width: 400,
    format: 'avif',
  })
  assert.deepEqual(parseVariantHint('/img/a.png?v=2'), { width: null, format: null })
  assert.deepEqual(
    parseVariantHint('https://cdn.example/a.jpeg?w=500&fm=jpg'),
    { width: null, format: null },
    'a remote query string belongs to the origin',
  )
})

test('parseVariantHint: reports bad values', () => {
  assert.match(parseVariantHint('/img/a.png?w=big').error, /positive integer/)
  assert.match(parseVariantHint('/img/a.png?w=0').error, /positive integer/)
  assert.match(parseVariantHint('/img/a.png?format=gif').error, /avif, webp, jpeg, png/)
})

/** Like stubGenerate, but honours a pinned width/format the way the processor does. */
function stubGenerateWithHint(formats = ['webp']) {
  return async (sourcePath, hint = {}) => {
    if (hint.width == null) return stubGenerate(hint.format ? [hint.format] : formats)(sourcePath)

    const width = Math.min(hint.width, 800)
    const used = hint.format ? [hint.format] : formats
    return {
      ladders: used.map((format) => ({
        format,
        variants: [{ url: `/assets/img/a-${width}.${format}`, width }],
      })),
      fallback: {
        url: `/assets/img/a-${width}.${used[used.length - 1]}`,
        width,
        format: used[used.length - 1],
      },
      width,
      height: width / 2,
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
  assert.deepEqual(hints, [{ width: 400, format: null }])
  assert.equal(
    html,
    '<img src="/assets/img/a-400.webp" alt="Thumb" width="400" height="200" loading="lazy" decoding="async">',
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
  await sharp({
    create: {
      width: 1600,
      height: 900,
      channels: 3,
      background: { r: 90, g: 140, b: 210 },
    },
  })
    .png()
    .toFile(path.join(imagesDir, 'hero.png'))

  await execFileAsync(process.execPath, [cliPath, 'build'], {
    cwd: fixtureDir,
    env: process.env,
  })

  const html = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8')
  const variants = fs.readdirSync(path.join(distDir, 'assets', 'img'))

  assert.equal(
    variants.length,
    3,
    'a 1600px source fills the 400/800 ladder, and ?w=300&format=jpeg adds one more',
  )
  assert.equal(variants.filter((file) => file.endsWith('.webp')).length, 2)
  assert.equal(variants.filter((file) => file.endsWith('.jpg')).length, 1)

  assert.match(html, /<img src="\/assets\/img\/hero\.[a-f0-9]+-800\.webp" alt="Hero"/)
  assert.match(html, /srcset="[^"]*400w[^"]*800w"/)
  assert.match(html, /width="800" height="450"/)

  // ?w= reuses the ladder's 400px file and pins the tag to it.
  const pinned = html.match(/<img src="(\/assets\/img\/hero\.[a-f0-9]+-400\.webp)" alt="Pinned" width="400" height="225" loading="lazy" decoding="async">/)
  assert.ok(pinned, `a pinned tag has one src and no srcset:\n${html}`)
  assert.ok(html.includes(`${pinned[1]} 400w`), 'the same file serves the ladder')
  assert.match(
    html,
    /<img src="\/assets\/img\/hero\.[a-f0-9]+-300\.jpg" alt="Pinned jpeg" width="300" height="169" loading="lazy" decoding="async">/,
  )

  assert.match(html, /<img src="\/images\/hero\.png" alt="Untouched">/)
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
