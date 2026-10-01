import { createHash } from 'node:crypto'
import fs from 'node:fs/promises'
import fsSync from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { installCommand } from './package-manager.js'

const RASTER_EXTENSIONS = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
  '.avif',
  '.tif',
  '.tiff',
])

const MIME_BY_FORMAT = {
  avif: 'image/avif',
  webp: 'image/webp',
  jpeg: 'image/jpeg',
  png: 'image/png',
}

const EXTENSION_BY_FORMAT = {
  avif: 'avif',
  webp: 'webp',
  jpeg: 'jpg',
  png: 'png',
}

const DEFAULT_WIDTHS = [400, 800, 1200]
const DEFAULT_FORMATS = ['webp']
const DEFAULT_QUALITY = { avif: 55, webp: 78, jpeg: 82 }
const DEFAULT_ASSETS_DIR = 'assets/img'
const DEFAULT_CACHE_DIR = 'node_modules/.sitelo/images'
const DEV_URL_PREFIX = '/_sitelo/images'

/** Passed to every sharp() call — buffers avoid libvips mmap SIGBUS on macOS. */
const SHARP_INPUT = {
  failOn: 'error',
  sequentialRead: true,
  limitInputPixels: 268_402_689,
}

/**
 * @typedef {object} ImageOptions
 * @property {number[]} widths
 * @property {Array<'avif' | 'webp' | 'jpeg' | 'png'>} formats
 * @property {Record<string, number>} quality
 * @property {string | undefined} sizes
 * @property {boolean} dimensions
 * @property {boolean} lazy
 * @property {RegExp[]} exclude
 * @property {string} assetsDir
 * @property {string} cacheDir
 * @property {boolean} remote
 * @property {boolean} prune
 * @property {boolean} dev
 * @property {number} concurrency
 */

/**
 * Convert a glob-ish pattern (`*`, `**`, `?`) into a RegExp matched against
 * root-relative image URLs.
 * @param {string} pattern
 */
function globToRegExp(pattern) {
  let source = ''

  for (let i = 0; i < pattern.length; i += 1) {
    const char = pattern[i]

    if (char === '*') {
      if (pattern[i + 1] === '*') {
        source += '.*'
        i += 1
        if (pattern[i + 1] === '/') i += 1
      } else {
        source += '[^/]*'
      }
      continue
    }

    if (char === '?') {
      source += '[^/]'
      continue
    }

    source += char.replace(/[.+^${}()|[\]\\]/g, '\\$&')
  }

  return new RegExp(`^/?${source}$`)
}

/**
 * Normalize sitelo.config.js `images` option.
 * @param {unknown} images
 * @returns {null | ImageOptions}
 */
export function normalizeImageOptions(images) {
  if (!images) return null

  if (images !== true && (typeof images !== 'object' || Array.isArray(images))) {
    throw new Error('"images" must be true or an object')
  }

  /*
   * Whatever the config file put there — every read below is checked
   * before it is used, so it arrives unchecked rather than trusted.
   */
  const options = /** @type {Record<string, unknown>} */ (
    images === true ? {} : images
  )

  const widths = options.widths ?? DEFAULT_WIDTHS
  if (
    !Array.isArray(widths) ||
    widths.length === 0 ||
    widths.some((width) => !Number.isInteger(width) || width <= 0)
  ) {
    throw new Error('"images.widths" must be a non-empty array of positive integers')
  }

  const formats = options.formats ?? DEFAULT_FORMATS
  if (!Array.isArray(formats) || formats.length === 0) {
    throw new Error('"images.formats" must be a non-empty array')
  }
  for (const format of formats) {
    if (!MIME_BY_FORMAT[format]) {
      throw new Error(
        `"images.formats" contains an unsupported format: ${format} (expected ${Object.keys(MIME_BY_FORMAT).join(', ')})`,
      )
    }
  }

  const rawExclude = options.exclude ?? []
  if (!Array.isArray(rawExclude)) {
    throw new Error('"images.exclude" must be an array of globs or regular expressions')
  }

  const exclude = rawExclude.map((pattern) =>
    pattern instanceof RegExp ? pattern : globToRegExp(String(pattern)),
  )

  const quality = options.quality ?? {}
  if (typeof quality !== 'object' || Array.isArray(quality)) {
    throw new Error('"images.quality" must be an object of per-format qualities')
  }

  if (options.sizes != null && typeof options.sizes !== 'string') {
    throw new Error('"images.sizes" must be a `sizes` attribute string')
  }

  const sizes = typeof options.sizes === 'string' ? options.sizes : undefined

  const assetsDir = options.assetsDir ?? DEFAULT_ASSETS_DIR
  if (typeof assetsDir !== 'string') {
    throw new Error('"images.assetsDir" must be a directory path')
  }

  /*
   * The build empties this directory before every run, so it has to be a
   * directory of its own inside the output. `''` or `.` is the output
   * itself, and a `..` anywhere can reach the project — `'../public'` used
   * to delete the site's own images.
   */
  const assetsPath = assetsDir.replace(/^\/+|\/+$/g, '')
  const segments = assetsPath.split(/[\\/]+/)
  if (
    /^[a-z]:/i.test(assetsPath) ||
    segments.includes('..') ||
    segments.every((segment) => segment === '' || segment === '.')
  ) {
    throw new Error(
      `"images.assetsDir" must be a directory inside the build output, e.g. 'assets/img' — got ${JSON.stringify(assetsDir)}`,
    )
  }

  const cacheDir = options.cacheDir ?? DEFAULT_CACHE_DIR
  if (typeof cacheDir !== 'string') {
    throw new Error('"images.cacheDir" must be a directory path')
  }

  // Remote encodes hammer libvips; serialise to avoid SIGBUS on macOS.
  const concurrency =
    options.concurrency ??
    (options.remote === true ? 1 : Math.max(1, Math.min(8, (os.cpus()?.length ?? 4) - 1)))

  if (typeof concurrency !== 'number' || !Number.isInteger(concurrency) || concurrency < 1) {
    throw new Error('"images.concurrency" must be a positive integer')
  }

  return {
    widths: [...new Set(widths)].sort((a, b) => a - b),
    formats: [...new Set(formats)],
    quality: { ...DEFAULT_QUALITY, ...quality },
    sizes,
    dimensions: options.dimensions !== false,
    lazy: options.lazy !== false,
    exclude,
    assetsDir: assetsPath,
    cacheDir,
    remote: options.remote === true,
    prune: options.prune !== false,
    dev: options.dev !== false,
    concurrency,
  }
}

/**
 * Lazily load sharp with an actionable error when it is not installed.
 *
 * sharp is an optional peer dependency — only sites that enable `images`
 * pay for its platform binaries.
 */
async function loadSharp() {
  try {
    const mod = await import('sharp')
    return mod.default ?? mod
  } catch (error) {
    const code = error?.code
    const missing =
      code === 'ERR_MODULE_NOT_FOUND' || code === 'MODULE_NOT_FOUND'

    throw new Error(
      missing
        ? '"images" requires sharp, which is an optional peer dependency.\n' +
          `Install it to enable image optimization: ${installCommand('sharp')}\n` +
          '(or set `images: false` in sitelo.config.js)'
        : '"images" found sharp but could not load it.\n' +
          `This usually means the platform binary is missing — try reinstalling: ${installCommand('sharp')}\n` +
          `(original error: ${error instanceof Error ? error.message : error})`,
    )
  }
}

/**
 * Run `task` over `items` with a bounded number of concurrent workers.
 * @template T, R
 * @param {T[]} items
 * @param {number} concurrency
 * @param {(item: T, index: number) => Promise<R>} task
 * @returns {Promise<R[]>}
 */
async function mapWithConcurrency(items, concurrency, task) {
  const results = new Array(items.length)
  let cursor = 0

  const workers = Array.from(
    { length: Math.max(1, Math.min(concurrency, items.length)) },
    async () => {
      while (cursor < items.length) {
        const index = cursor
        cursor += 1
        results[index] = await task(items[index], index)
      }
    },
  )

  await Promise.all(workers)
  return results
}

/**
 * A minimal promise semaphore. Encoding is the expensive part of this module
 * and it is reached from three nested fan-outs (files → tags → variants), so
 * one shared limiter keeps sharp from being handed the whole site at once.
 * @param {number} limit
 */
function createLimiter(limit) {
  let active = 0
  /** @type {Array<() => void>} */
  const queue = []

  const next = () => {
    if (active >= limit) return
    const run = queue.shift()
    if (!run) return
    active += 1
    run()
  }

  return (task) =>
    new Promise((resolve, reject) => {
      queue.push(() => {
        task()
          .then(resolve, reject)
          .finally(() => {
            active -= 1
            next()
          })
      })
      next()
    })
}

function hash(value, length = 8) {
  return createHash('sha256').update(value).digest('hex').slice(0, length)
}

/**
 * Whether `file` sits somewhere below `dir` — not `dir` itself, and not a
 * sibling that merely shares its prefix (`/out` vs `/output`).
 * @param {string} dir
 * @param {string} file
 */
function isInside(dir, file) {
  const relative = path.relative(dir, file)

  return relative !== '' && !relative.startsWith('..') && !path.isAbsolute(relative)
}

function isExternalUrl(url) {
  return /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(url)
}

function isHttpUrl(url) {
  return /^https?:\/\//i.test(url)
}

/**
 * @typedef {object} VariantHint
 * @property {number | null} width a `?w=` value, or null for the whole ladder
 * @property {number | null} height a `?h=` value, or null to follow the aspect ratio
 * @property {'cover' | 'contain' | null} fit how a `w`×`h` box is met: filled
 *   and cropped (the default), or fitted inside without cropping
 * @property {string | null} background a `?background=` colour that pads a
 *   `contain` result out to the exact box, as sharp understands it
 * @property {string | null} position a `?position=` value saying which part
 *   of the picture a `cover` crop keeps, as sharp spells it
 * @property {string | null} format a `?format=` value, or null for the configured formats
 */

/**
 * sharp's crop positions: an edge or corner to keep, or a strategy that
 * looks at the picture. `centre` is what happens without one.
 */
const POSITIONS = new Set([
  'top',
  'right top',
  'right',
  'right bottom',
  'bottom',
  'left bottom',
  'left',
  'left top',
  'centre',
  'entropy',
  'attention',
])

/** A colour that survives a URL: bare hex, a CSS name, or `transparent`. */
const BACKGROUND_PATTERN = /^(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8}|[a-z]+)$/i

/** @type {VariantHint} */
const NO_HINT = Object.freeze({
  width: null,
  height: null,
  fit: null,
  background: null,
  position: null,
  format: null,
})

/**
 * Spell a `?position=` value the way sharp does: lower case, words
 * separated by a space with the horizontal one first, `centre` in British.
 * @param {string} raw
 */
function normalizePosition(raw) {
  const words = raw.toLowerCase().split(/[\s_-]+/).filter(Boolean)
  const horizontal = words.filter((word) => word === 'left' || word === 'right')
  const vertical = words.filter((word) => word === 'top' || word === 'bottom')

  if (words.length === horizontal.length + vertical.length && words.length > 0) {
    return [...horizontal, ...vertical].join(' ')
  }
  return words.join(' ') === 'center' ? 'centre' : words.join(' ')
}

/**
 * Read the `?w=`, `?h=`, `?fit=`, `?background=`, `?position=` and
 * `?format=` hints that pin a local image URL to one variant — the thumbnail case, where a whole
 * `srcset` ladder is overkill and the author needs to name a size. The
 * names follow vite-imagetools, and so does `w` with `h`: the box is filled
 * and cropped unless `fit=contain` asks for the whole image inside it,
 * padded out with `background` when one is given.
 *
 * Static hosts ignore the query, so a site that turns images off still
 * serves the original. Remote URLs are never parsed: their query belongs
 * to the origin.
 *
 * @param {string} src
 * @returns {VariantHint & { error?: string }}
 */
export function parseVariantHint(src) {
  if (isExternalUrl(src)) return NO_HINT

  const query = src.split('#')[0].split('?')[1]
  if (!query) return NO_HINT

  const params = new URLSearchParams(query)
  const rawFormat = params.get('format')
  const rawBackground = params.get('background')
  // `background` is padding, and only `contain` leaves anything to pad.
  const rawFit = params.get('fit') ?? (rawBackground !== null ? 'contain' : null)
  // Narrowed by the assignment rather than by the check below: ruling two
  // values out of a `string` still leaves a `string`, and the hint wants
  // the pair.
  const fit = rawFit === 'cover' || rawFit === 'contain' ? rawFit : null

  /** @type {Record<'w' | 'h', number | null>} */
  const sizes = { w: null, h: null }
  for (const name of /** @type {const} */ (['w', 'h'])) {
    const raw = params.get(name)
    if (raw === null) continue
    sizes[name] = toPositiveInt(raw)
    if (sizes[name] === null) {
      return { ...NO_HINT, error: `?${name}= must be a positive integer, not "${raw}"` }
    }
  }

  if (rawFormat !== null && !MIME_BY_FORMAT[rawFormat]) {
    return {
      ...NO_HINT,
      error: `?format= must be one of ${Object.keys(MIME_BY_FORMAT).join(', ')}, not "${rawFormat}"`,
    }
  }

  if (rawFit !== null && fit === null) {
    return { ...NO_HINT, error: `?fit= must be cover or contain, not "${rawFit}"` }
  }
  if (fit !== null && (sizes.w === null || sizes.h === null)) {
    return {
      ...NO_HINT,
      error: `?${rawBackground !== null && params.get('fit') === null ? 'background' : 'fit'}= needs both ?w= and ?h= — it says how to meet that box`,
    }
  }

  let background = null
  if (rawBackground !== null) {
    if (fit !== 'contain') {
      return { ...NO_HINT, error: '?background= pads fit=contain; cover leaves nothing to pad' }
    }
    const value = rawBackground.replace(/^#/, '')
    if (!BACKGROUND_PATTERN.test(value)) {
      return {
        ...NO_HINT,
        error: `?background= must be a hex colour (fff, 1a1a1a, ffffff80), a CSS colour name, or transparent, not "${rawBackground}"`,
      }
    }
    background = /^[0-9a-f]+$/i.test(value) ? `#${value.toLowerCase()}` : value.toLowerCase()
  }

  const rawPosition = params.get('position')
  let position = null
  if (rawPosition !== null) {
    if (sizes.w === null || sizes.h === null) {
      return { ...NO_HINT, error: '?position= needs both ?w= and ?h= — it says which part of that box to keep' }
    }
    if (fit === 'contain') {
      return { ...NO_HINT, error: '?position= picks what a cover crop keeps; contain crops nothing' }
    }
    position = normalizePosition(rawPosition)
    if (!POSITIONS.has(position)) {
      return {
        ...NO_HINT,
        error: `?position= must be an edge or corner (top, left-top, …), centre, entropy or attention, not "${rawPosition}"`,
      }
    }
  }

  return { width: sizes.w, height: sizes.h, fit, background, position, format: rawFormat }
}

/** Fast reject of HTML error pages / empty downloads before sharp touches them. */
function looksLikeRaster(buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length < 12) return false
  // JPEG
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return true
  // PNG
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return true
  }
  // GIF
  if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46) return true
  // WebP (RIFF....WEBP)
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45
  ) {
    return true
  }
  // AVIF / HEIF (....ftyp)
  if (
    buffer[4] === 0x66 &&
    buffer[5] === 0x74 &&
    buffer[6] === 0x79 &&
    buffer[7] === 0x70
  ) {
    return true
  }
  return false
}

/**
 * Whether a JPEG's image data runs to its end-of-image marker.
 *
 * Found by walking the segments rather than by looking at the last two
 * bytes: plenty of complete JPEGs carry data after the marker — a phone's
 * motion photo appends its video there — and an `FF D9` inside an EXIF
 * thumbnail is not the end of the picture, so it is skipped with its
 * segment.
 *
 * @param {Buffer} buffer
 */
function jpegIsComplete(buffer) {
  let i = 2

  while (i + 1 < buffer.length) {
    if (buffer[i] !== 0xff) return false

    const marker = buffer[i + 1]

    if (marker === 0xd9) return true
    // Fill bytes before a marker, and the markers that carry no length.
    if (marker === 0xff) {
      i += 1
      continue
    }
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      i += 2
      continue
    }
    if (i + 3 >= buffer.length) return false

    i += 2 + buffer.readUInt16BE(i + 2)

    // A scan is followed by entropy-coded data, which runs to the next
    // marker that is neither a stuffed `FF 00` nor a restart.
    if (marker === 0xda) {
      while (i + 1 < buffer.length) {
        if (buffer[i] !== 0xff) {
          i += 1
          continue
        }

        const next = buffer[i + 1]

        if (next === 0x00 || (next >= 0xd0 && next <= 0xd7)) i += 2
        else if (next === 0xff) i += 1
        else break
      }
    }
  }

  return false
}

/**
 * Header checks miss truncated downloads; those can SIGBUS when libvips mmaps them.
 * @param {Buffer} buffer
 */
function looksLikeCompleteRaster(buffer) {
  if (!looksLikeRaster(buffer)) return false

  if (buffer[0] === 0xff && buffer[1] === 0xd8) return jpegIsComplete(buffer)

  // PNG must contain an IEND chunk.
  if (buffer[0] === 0x89 && buffer[1] === 0x50) {
    return buffer.includes(Buffer.from('IEND'))
  }

  return true
}

async function writeFileAtomic(filePath, data) {
  const tmpPath = `${filePath}.${process.pid}.${Date.now()}.tmp`
  await fs.writeFile(tmpPath, data)
  await fs.rename(tmpPath, filePath)
}

function joinUrl(...parts) {
  return `/${parts.map((part) => String(part).replace(/^\/+|\/+$/g, '')).filter(Boolean).join('/')}`
}

/**
 * Pick the fallback (widely supported) format for a source image.
 * @param {string | undefined} sourceFormat
 */
function fallbackFormatFor(sourceFormat) {
  return sourceFormat === 'png' ? 'png' : 'jpeg'
}

/**
 * Widths to emit for an image: every configured width below the source's,
 * topped by the source width itself — so a screen wider than the ladder
 * gets the full picture, and nothing is ever upscaled.
 * @param {number} intrinsicWidth
 * @param {number[]} widths
 */
export function resolveWidths(intrinsicWidth, widths) {
  return [...widths.filter((width) => width < intrinsicWidth), intrinsicWidth]
}

/**
 * The sizes to emit for an image: the ladder, or the one size a hint pins.
 * A pinned side is honoured exactly, short of upscaling; with only `h`
 * given the width follows the aspect ratio, and with both the box is
 * filled and cropped — or, with `fit=contain`, the image is scaled to sit
 * inside it, and with a `background` the canvas is padded out to the box
 * around that `inner` image. `height` is only present when it was pinned.
 * @param {{ width: number, height: number }} intrinsic
 * @param {VariantHint} hint
 * @param {number[]} widths
 * @returns {Array<{
 *   width: number
 *   height?: number
 *   inner?: { width: number, height: number }
 *   background?: string
 *   position?: string
 * }>}
 */
export function resolveSizes(intrinsic, hint, widths) {
  if (hint.height === null) {
    const resolved = hint.width
      ? [Math.min(hint.width, intrinsic.width)]
      : resolveWidths(intrinsic.width, widths)
    return resolved.map((width) => ({ width }))
  }

  if (hint.width && hint.fit === 'contain') {
    const scale = Math.min(hint.width / intrinsic.width, hint.height / intrinsic.height, 1)
    const inner = {
      width: Math.round(intrinsic.width * scale),
      height: Math.round(intrinsic.height * scale),
    }

    if (!hint.background) return [inner]

    // Padding is not upscaling: the picture stays at `inner`, the canvas
    // is the box asked for.
    return [{ width: hint.width, height: hint.height, inner, background: hint.background }]
  }

  const height = Math.min(hint.height, intrinsic.height)
  const width = hint.width
    ? Math.min(hint.width, intrinsic.width)
    : Math.round((intrinsic.width / intrinsic.height) * height)

  return [hint.position ? { width, height, position: hint.position } : { width, height }]
}

/**
 * Create the variant generator. Variants are keyed by a content hash so the
 * cache is shared between dev and build, and across rebuilds.
 *
 * @param {{
 *   sharp: any
 *   options: ImageOptions
 *   cacheDir: string
 *   outputDir: string
 *   urlPrefix: string
 * }} args
 */
function createImageProcessor({ sharp, options, cacheDir, outputDir, urlPrefix }) {
  /**
   * Source path → the revision last read and the decode of it. One entry
   * per file: an edit replaces it rather than adding another.
   * @type {Map<string, { stamp: string, promise: Promise<null | object> }>}
   */
  const sources = new Map()
  /** @type {Map<string, Promise<object>>} */
  const variants = new Map()
  /** @type {Map<string, Promise<null | object>>} */
  const inFlight = new Map()
  /** Where {@link fetchRemoteImage} keeps downloads: the only files this may delete. */
  const remoteDir = path.join(cacheDir, 'remote')
  const stats = { sources: 0, variants: 0, originalBytes: 0, variantBytes: 0 }
  const sourceLimit = createLimiter(options.concurrency)
  const encodeLimit = createLimiter(options.concurrency)

  // Cap libvips' own thread pool — high parallel sharp() calls can SIGBUS on macOS.
  if (typeof sharp.concurrency === 'function') {
    sharp.concurrency(options.remote ? 1 : Math.min(options.concurrency, 4))
  }

  /**
   * @param {Buffer} sourceBuffer
   * @param {ReturnType<typeof resolveSizes>[number]} size a width to scale
   *   to, or an exact box to fill and crop — both already clamped to the
   *   source — optionally around a smaller `inner` picture on a `background`
   * @param {string} format
   */
  function encode(sourceBuffer, size, format) {
    return encodeLimit(() => {
      const picture = size.inner ?? size
      let pipeline = sharp(sourceBuffer, SHARP_INPUT).resize(
        size.height
          ? { width: picture.width, height: picture.height, fit: 'cover', position: size.position ?? 'centre' }
          : { width: size.width, withoutEnlargement: true },
      )

      if (size.inner) {
        const top = Math.floor((size.height - size.inner.height) / 2)
        const left = Math.floor((size.width - size.inner.width) / 2)
        pipeline = pipeline.extend({
          top,
          left,
          bottom: size.height - size.inner.height - top,
          right: size.width - size.inner.width - left,
          background: size.background,
        })
      }

      if (format === 'png') {
        return pipeline.png({ compressionLevel: 9, palette: true }).toBuffer()
      }

      return pipeline[format]({ quality: options.quality[format] }).toBuffer()
    })
  }

  /**
   * Encode one variant, or return it from the cache. Memoized per output
   * file: a ladder and a `?w=` hint can ask for the same width at the same
   * moment, and two writers racing for one path would trip over each other.
   *
   * `height` is only set for a `?h=` variant; the ladder's names and cache
   * keys are unchanged by its absence.
   */
  function buildVariant({ sourceBuffer, sourceHash, name, width, height, inner, background, position, format }) {
    const extension = EXTENSION_BY_FORMAT[format]
    const size = height ? `${width}x${height}` : String(width)
    // Only the box variants have these; the ladder's keys stay as they were.
    const framing = (background ? `:${background}` : '') + (position ? `@${position}` : '')
    const key = hash(`${sourceHash}:${size}${framing}:${format}:${options.quality[format]}`)
    const fileName = `${name}.${key}-${size}.${extension}`

    const existing = variants.get(fileName)
    if (existing) return existing

    const promise = (async () => {
      const cachePath = path.join(cacheDir, fileName)
      const outputPath = path.join(outputDir, fileName)

      let buffer
      try {
        buffer = await fs.readFile(cachePath)
      } catch {
        buffer = await encode(sourceBuffer, { width, height, inner, background, position }, format)
        await fs.mkdir(path.dirname(cachePath), { recursive: true })
        await writeFileAtomic(cachePath, buffer)
      }

      if (outputPath !== cachePath) {
        await fs.mkdir(path.dirname(outputPath), { recursive: true })
        await writeFileAtomic(outputPath, buffer)
      }

      stats.variants += 1
      stats.variantBytes += buffer.length

      return {
        // Not `joinUrl`: the prefix may be a whole URL (a CDN `base`).
        url: `${urlPrefix.replace(/\/+$/, '')}/${fileName}`,
        width,
        format,
        bytes: buffer.length,
      }
    })()

    variants.set(fileName, promise)
    return promise
  }

  /**
   * Which revision of a file this is: its size and modification time.
   *
   * The dev server is one process that outlives edits to the images it
   * serves, so a path alone is not a cache key — an edited picture kept
   * its old variants, and one that failed once stayed failed, until the
   * server was restarted. A build reads each file once and pays one
   * `stat` per tag for the same guarantee.
   * @param {string} sourcePath
   */
  async function revisionOf(sourcePath) {
    const { size, mtimeMs } = await fs.stat(sourcePath)

    return `${size}:${mtimeMs}`
  }

  /**
   * Read and decode one revision of a source file. Memoized so a page that
   * references the same image at several pinned widths reads and probes it
   * once.
   * @param {string} sourcePath
   * @param {string} stamp from {@link revisionOf}
   * @returns {Promise<null | { source: Buffer, metadata: any, sourceHash: string, name: string }>}
   */
  function loadSource(sourcePath, stamp) {
    const existing = sources.get(sourcePath)
    if (existing?.stamp === stamp) return existing.promise

    const promise = (async () => {
      const source = await fs.readFile(sourcePath)

      if (!looksLikeCompleteRaster(source)) {
        throw new Error('not a decodable raster image')
      }

      const metadata = await sharp(source, SHARP_INPUT).metadata()

      // Vectors scale on their own; animations would lose their frames.
      if (!metadata.width || !metadata.height) return null
      if (metadata.format === 'svg') return null
      if ((metadata.pages ?? 1) > 1) return null

      stats.sources += 1
      stats.originalBytes += source.length

      return {
        source,
        metadata,
        sourceHash: hash(source, 12),
        name: path
          .basename(sourcePath, path.extname(sourcePath))
          .replace(/[^a-zA-Z0-9._-]+/g, '-'),
      }
    })()

    sources.set(sourcePath, { stamp, promise })
    return promise
  }

  /**
   * Generate the variants for one source file: the whole configured ladder,
   * or the single size and/or format a `?w=` / `?h=` / `?fit=` /
   * `?background=` / `?position=` / `?format=` hint pins.
   * @param {string} sourcePath absolute path to the original image
   * @param {VariantHint} [hint]
   * @returns {Promise<null | {
   *   ladders: Array<{ format: string, variants: Array<{ url: string, width: number }> }>
   *   fallback: { url: string, width: number, format: string }
   *   width: number
   *   height: number
   * }>}
   */
  async function generate(sourcePath, hint = NO_HINT) {
    const stamp = await revisionOf(sourcePath)
    const prefix = `${sourcePath}\0`
    const key = [stamp, hint.width, hint.height, hint.fit, hint.background, hint.position, hint.format]
      .map((part) => part ?? '')
      .join('\0')
    const existing = inFlight.get(prefix + key)
    if (existing) return existing

    // Results for an earlier revision of this file can never be asked for again.
    for (const stale of inFlight.keys()) {
      if (stale.startsWith(prefix) && !stale.startsWith(`${prefix}${stamp}\0`)) inFlight.delete(stale)
    }

    const promise = sourceLimit(async () => {
      const loaded = await loadSource(sourcePath, stamp)
      if (!loaded) return null

      const { source, metadata, sourceHash, name } = loaded
      const sizes = resolveSizes(metadata, hint, options.widths)

      if (sizes.length === 0) return null

      const formats = hint.format ? [hint.format] : [...options.formats]
      if (formats.length > 1) {
        const fallback = fallbackFormatFor(metadata.format)
        if (!formats.includes(fallback)) formats.push(fallback)
      }

      const jobs = []
      for (const format of formats) {
        for (const size of sizes) {
          jobs.push({ sourceBuffer: source, sourceHash, name, ...size, format })
        }
      }

      const built = await Promise.all(jobs.map(buildVariant))

      const ladders = formats.map((format) => ({
        format,
        variants: built
          .filter((variant) => variant.format === format)
          .sort((a, b) => a.width - b.width),
      }))

      const fallbackLadder = ladders[ladders.length - 1]
      const fallback = fallbackLadder.variants[fallbackLadder.variants.length - 1]
      const largest = sizes[sizes.length - 1]

      return {
        ladders,
        fallback,
        width: largest.width,
        height: largest.height ?? Math.round((metadata.height / metadata.width) * largest.width),
      }
    }).catch(async (error) => {
      /*
       * A download that will not decode is thrown away so the next run
       * fetches it again. Only a download: this used to test for a
       * `remote` folder anywhere in the path, and deleted the site's own
       * images whenever the project happened to live under one.
       */
      if (isInside(remoteDir, sourcePath)) {
        await fs.unlink(sourcePath).catch(() => {})
      }
      throw error
    })

    inFlight.set(prefix + key, promise)
    return promise
  }

  return { generate, stats }
}

const ATTRIBUTE_PATTERN =
  /([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g

/**
 * Decode the HTML entities browsers resolve in attribute values.
 * Needed so `src="…?a=1&amp;b=2"` fetches as `…?a=1&b=2`.
 * @param {string} value
 */
function decodeHtmlEntities(value) {
  return String(value)
    .replace(/&quot;/gi, '"')
    .replace(/&#0*39;/g, "'")
    .replace(/&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) =>
      String.fromCodePoint(Number.parseInt(hex, 16)),
    )
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&amp;/gi, '&')
}

/**
 * Parse the attributes of a single tag into an ordered map.
 * @param {string} tag
 */
export function parseAttributes(tag) {
  const body = tag.replace(/^<\s*[a-zA-Z][^\s/>]*/, '').replace(/\/?>$/, '')
  /** @type {Map<string, string | null>} */
  const attributes = new Map()

  for (const match of body.matchAll(ATTRIBUTE_PATTERN)) {
    const [, name, doubleQuoted, singleQuoted, unquoted] = match
    const raw = doubleQuoted ?? singleQuoted ?? unquoted ?? null
    const value = raw == null ? null : decodeHtmlEntities(raw)
    if (!attributes.has(name.toLowerCase())) {
      attributes.set(name.toLowerCase(), value)
    }
  }

  return attributes
}

function serializeAttributes(attributes) {
  const parts = []

  for (const [name, value] of attributes) {
    if (value === null) {
      parts.push(name)
      continue
    }
    parts.push(
      `${name}="${String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;')}"`,
    )
  }

  return parts.length > 0 ? ` ${parts.join(' ')}` : ''
}

/**
 * Read an HTML attribute as a positive integer, ignoring `50%`, `auto`, etc.
 * @param {string | null | undefined} value
 */
function toPositiveInt(value) {
  if (value == null) return null
  const parsed = Number(String(value).trim())
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null
}

function srcsetFor(variants, mapUrl = (url) => url) {
  return variants.map((variant) => `${mapUrl(variant.url)} ${variant.width}w`).join(', ')
}

/**
 * Find `<picture>` ranges so their `<img>` fallbacks are left alone.
 * @param {string} html
 */
function pictureRanges(html) {
  const ranges = []
  const pattern = /<picture\b[^>]*>[\s\S]*?<\/picture\s*>/gi
  let match

  while ((match = pattern.exec(html)) !== null) {
    ranges.push([match.index, match.index + match[0].length])
  }

  return ranges
}

/**
 * Rewrite every eligible `<img>` in `html` to a responsive variant set.
 *
 * @param {{
 *   html: string
 *   options: ImageOptions
 *   resolve: (url: string) => Promise<string | null> | string | null
 *   generate: (sourcePath: string, hint?: VariantHint) => Promise<null | object>
 *   onWarn?: (message: string) => void
 *   mapUrl?: (url: string) => string
 * }} args `mapUrl` rewrites each variant URL on its way into the page —
 *   for a site built with a relative `base`, where it depends on the page
 * @returns {Promise<{ html: string, rewritten: number, sources: Set<string> }>}
 *   `sources` holds the path of every file a tag was rewritten away from.
 */
export async function rewriteHtmlImages({ html, options, resolve, generate, onWarn, mapUrl = (url) => url }) {
  // Quote-aware: a `>` inside an attribute value — `alt="costs > revenue"`,
  // which javascript-to-html writes as is — does not end the tag.
  const tags = [...html.matchAll(/<img\b(?:[^>"']|"[^"]*"|'[^']*')*>/gi)]
  if (tags.length === 0) return { html, rewritten: 0, sources: new Set() }

  const ranges = pictureRanges(html)
  const insidePicture = (index) =>
    ranges.some(([start, end]) => index >= start && index < end)

  const replacements = await mapWithConcurrency(
    tags,
    options.concurrency,
    async (match) => {
      const tag = match[0]
      const attributes = parseAttributes(tag)
      const src = attributes.get('src')

      if (!src) return null
      // Already responsive, opted out, or a fallback inside <picture>.
      if (attributes.has('srcset')) return null
      if (attributes.has('data-no-optimize')) {
        attributes.delete('data-no-optimize')
        return { index: match.index, length: tag.length, html: `<img${serializeAttributes(attributes)}>` }
      }
      if (insidePicture(match.index)) return null
      if (options.exclude.some((pattern) => pattern.test(src))) return null

      const hint = parseVariantHint(src)
      if (hint.error) {
        onWarn?.(`skipped ${src}: ${hint.error}`)
        return null
      }

      let sourcePath
      try {
        sourcePath = await resolve(src)
      } catch (error) {
        onWarn?.(`could not resolve ${src}: ${error instanceof Error ? error.message : error}`)
        return null
      }

      if (!sourcePath) return null

      let result
      try {
        result = await generate(sourcePath, hint)
      } catch (error) {
        onWarn?.(`skipped ${src}: ${error instanceof Error ? error.message : error}`)
        return null
      }

      if (!result) return null

      const aspect = result.width / result.height
      const authoredWidth = toPositiveInt(attributes.get('width'))
      const authoredHeight = toPositiveInt(attributes.get('height'))

      // An author-sized image is displayed at that width, so say so. Anything
      // else is taken to fill the viewport: the ladder tops out at the source
      // width, so the browser can always pick the rung that covers the screen.
      const displayWidth = authoredWidth ?? (authoredHeight ? Math.round(authoredHeight * aspect) : null)

      const sizes =
        attributes.get('sizes') ?? options.sizes ?? (displayWidth ? `${displayWidth}px` : '100vw')

      // A pinned size is one file per format: there is no ladder for the
      // browser to choose from, so no srcset and no sizes.
      const pinned = hint.width !== null || hint.height !== null

      const imgAttributes = new Map(attributes)
      imgAttributes.set('src', mapUrl(result.fallback.url))
      if (!pinned) imgAttributes.set('sizes', sizes)

      if (options.dimensions) {
        // Complete whichever dimension the author left off, keeping their
        // aspect ratio intact; only fill in both when neither is set.
        if (authoredWidth && !authoredHeight) {
          imgAttributes.set('height', String(Math.round(authoredWidth / aspect)))
        } else if (authoredHeight && !authoredWidth) {
          imgAttributes.set('width', String(Math.round(authoredHeight * aspect)))
        } else if (!authoredWidth && !authoredHeight) {
          imgAttributes.set('width', String(result.width))
          imgAttributes.set('height', String(result.height))
        }
      }

      if (options.lazy) {
        if (!imgAttributes.has('loading')) imgAttributes.set('loading', 'lazy')
        if (!imgAttributes.has('decoding')) imgAttributes.set('decoding', 'async')
      }

      if (result.ladders.length === 1) {
        if (!pinned) imgAttributes.set('srcset', srcsetFor(result.ladders[0].variants, mapUrl))
        return {
          index: match.index,
          length: tag.length,
          html: `<img${serializeAttributes(imgAttributes)}>`,
          source: sourcePath,
        }
      }

      // Multiple formats need <picture> so the browser can negotiate.
      const sources = result.ladders
        .slice(0, -1)
        .map((ladder) =>
          pinned
            ? `<source type="${MIME_BY_FORMAT[ladder.format]}" srcset="${mapUrl(ladder.variants[0].url)}">`
            : `<source type="${MIME_BY_FORMAT[ladder.format]}" srcset="${srcsetFor(ladder.variants, mapUrl)}" sizes="${String(sizes).replace(/"/g, '&quot;')}">`,
        )
        .join('')

      if (!pinned) {
        imgAttributes.set('srcset', srcsetFor(result.ladders[result.ladders.length - 1].variants, mapUrl))
      }

      return {
        index: match.index,
        length: tag.length,
        html: `<picture>${sources}<img${serializeAttributes(imgAttributes)}></picture>`,
        source: sourcePath,
      }
    },
  )

  let output = ''
  let cursor = 0
  let rewritten = 0
  /** @type {Set<string>} */
  const sources = new Set()

  for (const replacement of replacements) {
    if (!replacement) continue
    output += html.slice(cursor, replacement.index) + replacement.html
    cursor = replacement.index + replacement.length
    rewritten += 1
    if (replacement.source) sources.add(replacement.source)
  }

  output += html.slice(cursor)

  return { html: output, rewritten, sources }
}

/**
 * Resolve an image URL against the directories sitelo serves from.
 *
 * A root-relative URL is looked up as it stands, less any path `base`. A
 * relative one is resolved against the page it sits in, the way the
 * browser will: `cover.png` on `/blog/post/` is `/blog/post/cover.png`,
 * not a `cover.png` at the root that happens to share the name.
 *
 * @param {{ root: string, dirs: Array<string | false | undefined>, base?: string }} args
 * @returns {(url: string, from?: string) => string | null} `from` is the
 *   URL path of the page the reference is on; `/` when omitted
 */
function createSourceResolver({ root, dirs, base = '/' }) {
  // Only a path base prefixes URLs on the page. A full-URL base makes them
  // external, and a relative one (`./`) makes them relative.
  const basePrefix = base.startsWith('/') ? base.replace(/\/+$/, '') : ''
  const roots = dirs.flatMap((dir) =>
    typeof dir === 'string' && dir.length > 0 ? [path.resolve(root, dir)] : [],
  )

  return (url, from = '/') => {
    if (isExternalUrl(url) || url.startsWith('data:')) return null

    let [pathname] = url.split(/[?#]/)
    if (!RASTER_EXTENSIONS.has(path.extname(pathname).toLowerCase())) return null

    if (!pathname.startsWith('/')) {
      const pageDir = from.endsWith('/') ? from : `${path.posix.dirname(from)}/`
      pathname = path.posix.join(pageDir, pathname)
    }

    if (basePrefix && pathname.startsWith(`${basePrefix}/`)) {
      pathname = pathname.slice(basePrefix.length)
    }

    let relative
    try {
      relative = decodeURIComponent(pathname.replace(/^\/+/, ''))
    } catch {
      return null
    }

    if (!relative || relative.includes('..')) return null

    for (const dir of roots) {
      const candidate = path.join(dir, relative)
      if (!candidate.startsWith(dir)) continue
      if (fsSync.existsSync(candidate)) return candidate
    }

    return null
  }
}

/**
 * Where variant URLs start, for the `base` the site is built with.
 *
 * A path base goes in front (`/repo/assets/img`) and a full URL is kept
 * whole (`https://cdn.example/assets/img`). A relative base (`./`) has no
 * one answer — it depends on the page — so variants are written
 * root-relative here and made relative per page by the caller.
 *
 * @param {string} base
 * @param {string} assetsDir
 */
function variantUrlPrefix(base, assetsDir) {
  if (isUrlBase(base)) return `${base.replace(/\/+$/, '')}/${assetsDir}`
  if (!base.startsWith('/')) return joinUrl(assetsDir)

  return joinUrl(base, assetsDir)
}

/** A `base` that is a whole URL — `https://cdn.example/` or `//cdn.example/`. */
function isUrlBase(base) {
  return /^(?:[a-z][a-z0-9+.-]*:)?\/\//i.test(base)
}

/**
 * Download a remote image into the cache so it can be optimized like a local
 * one. Returns null when the fetch fails — the tag is then left untouched.
 * @param {{ url: string, cacheDir: string, onWarn?: (message: string) => void }} args
 */
async function fetchRemoteImage({ url, cacheDir, onWarn }) {
  const remoteDir = path.join(cacheDir, 'remote')
  const { pathname } = new URL(url)
  const extension = path.extname(pathname).toLowerCase()

  if (!RASTER_EXTENSIONS.has(extension)) return null

  // Keep the remote basename so generated variants stay recognizable; the
  // URL hash keeps same-named images from different origins apart.
  const name = path.basename(pathname, extension).replace(/[^a-zA-Z0-9._-]+/g, '-') || 'image'
  const cachePath = path.join(remoteDir, `${name}-${hash(url)}${extension}`)

  if (fsSync.existsSync(cachePath)) {
    try {
      const cached = await fs.readFile(cachePath)
      if (looksLikeCompleteRaster(cached)) return cachePath
    } catch {
      /* fall through and re-fetch */
    }
    await fs.unlink(cachePath).catch(() => {})
  }

  try {
    const buffer = await downloadRemoteRaster(url)
    await fs.mkdir(remoteDir, { recursive: true })
    await writeFileAtomic(cachePath, buffer)
    return cachePath
  } catch (error) {
    onWarn?.(`could not fetch ${url}: ${formatFetchError(error)}`)
    return null
  }
}

const REMOTE_FETCH_RETRIES = 3
const REMOTE_FETCH_TIMEOUT_MS = 20_000

function formatFetchError(error) {
  if (!(error instanceof Error)) return String(error)
  const cause = error.cause
  if (cause instanceof Error) {
    const code = 'code' in cause ? cause.code : undefined
    return code ? `${error.message} (${code})` : `${error.message} (${cause.message})`
  }
  return error.message
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Fetch a remote raster with retries — CDNs often drop connections under load.
 * @param {string} url
 * @returns {Promise<Buffer>}
 */
async function downloadRemoteRaster(url) {
  let lastError = null

  for (let attempt = 0; attempt <= REMOTE_FETCH_RETRIES; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: {
          Accept: 'image/*,*/*;q=0.8',
          'User-Agent': 'sitelo-images/1.0',
        },
        signal: AbortSignal.timeout(REMOTE_FETCH_TIMEOUT_MS),
      })

      if (response.ok) {
        const buffer = Buffer.from(await response.arrayBuffer())
        if (!looksLikeCompleteRaster(buffer)) {
          throw new Error(
            `response is not a complete raster image (${response.headers.get('content-type') ?? 'unknown type'})`,
          )
        }
        return buffer
      }

      const retryable = response.status === 429 || response.status === 503
      lastError = new Error(`HTTP ${response.status}`)
      if (!retryable || attempt === REMOTE_FETCH_RETRIES) throw lastError
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      // Non-retryable content errors
      if (lastError.message.startsWith('response is not a complete')) throw lastError
      if (attempt === REMOTE_FETCH_RETRIES) throw lastError
    }

    const wait = Math.min(8_000, 400 * 2 ** attempt) + Math.floor(Math.random() * 200)
    await sleep(wait)
  }

  throw lastError ?? new Error('fetch failed')
}

/**
 * Recursively list files under `dir` whose extension is in `extensions`.
 * @param {string} dir
 * @param {Set<string>} extensions
 */
async function walk(dir, extensions) {
  /** @type {string[]} */
  const files = []

  let entries
  try {
    entries = await fs.readdir(dir, { withFileTypes: true })
  } catch {
    return files
  }

  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await walk(full, extensions)))
    } else if (extensions.has(path.extname(entry.name).toLowerCase())) {
      files.push(full)
    }
  }

  return files
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} kB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/**
 * Throttled progress lines for long remote image passes.
 * @param {{
 *   total: number
 *   log: (message: string) => void
 *   stats: () => { sources: number, variants: number }
 *   every?: number
 *   intervalMs?: number
 * }} options
 */
function createImageProgressLogger({
  total,
  log,
  stats,
  every = 50,
  intervalMs = 5000,
}) {
  let done = 0
  let lastLoggedAt = 0
  let stopped = false

  const write = () => {
    const { sources, variants } = stats()
    const detail =
      sources > 0
        ? `, ${sources} source${sources === 1 ? '' : 's'} → ${variants} variant${variants === 1 ? '' : 's'}`
        : ''

    log(`[sitelo] images: ${done}/${total} pages${detail}…`)
    lastLoggedAt = Date.now()
  }

  const maybeWrite = () => {
    if (stopped) return
    const now = Date.now()
    const milestone = done % every === 0 || done === total
    if (done === 1 || milestone || now - lastLoggedAt >= intervalMs) write()
  }

  // Pages can take minutes when they reference many remotes — tick on a timer
  // so stats keep updating even while a single page is in flight.
  const timer = setInterval(() => {
    if (stopped) return
    const { sources } = stats()
    if (done === 0 && sources === 0) return
    if (Date.now() - lastLoggedAt >= intervalMs) write()
  }, intervalMs)
  timer.unref?.()

  return {
    pageDone() {
      done += 1
      maybeWrite()
    },
    stop() {
      stopped = true
      clearInterval(timer)
    },
  }
}

/** Every text file a reference to an image can sit in. */
const REFERENCE_EXTENSIONS = new Set([
  '.html',
  '.htm',
  '.css',
  '.js',
  '.mjs',
  '.cjs',
  '.json',
  '.webmanifest',
  '.xml',
  '.rss',
  '.atom',
  '.txt',
  '.svg',
])

/**
 * Remove the originals this run rewrote away from, once nothing else in
 * the build mentions them.
 *
 * Only the files a tag was actually rewritten from are candidates. Pruning
 * used to consider every raster in `dist/`, and so deleted what no `<img>`
 * ever pointed at: an `apple-touch-icon.png` a phone asks for by name, the
 * icons a `.webmanifest` lists, an image another site hotlinks.
 *
 * A candidate is kept if its file name appears in any text file in the
 * build — as written, percent-encoded or entity-encoded — not only its
 * root-relative URL. That keeps one linked as `photo.jpg` from a page in
 * the same folder, or as `/my%20photo.jpg`, at the price of sometimes
 * keeping a file whose name merely appears. Variant names never contain
 * the original's (`hero.png` becomes `hero.1a2b3c4d-800.webp`), so a
 * rewritten tag does not count as a mention of its own source.
 *
 * @param {{ distDir: string, options: ImageOptions, candidates: Iterable<string>, log: (message: string) => void }} args
 */
async function pruneOriginals({ distDir, options, candidates, log }) {
  const assetsRoot = path.join(distDir, options.assetsDir)
  const originals = [...new Set(candidates)].filter(
    (file) => isInside(distDir, file) && !isInside(assetsRoot, file),
  )

  if (originals.length === 0) return

  const documents = await walk(distDir, REFERENCE_EXTENSIONS)
  const haystack = (
    await Promise.all(documents.map((file) => fs.readFile(file, 'utf8').catch(() => '')))
  ).join('\n')

  let removed = 0
  let bytes = 0

  for (const image of originals) {
    const name = path.basename(image)
    const spellings = new Set([
      name,
      encodeURIComponent(name),
      encodeURI(name),
      name.replaceAll('&', '&amp;'),
    ])

    if ([...spellings].some((spelling) => haystack.includes(spelling))) continue

    let size
    try {
      ;({ size } = await fs.stat(image))
    } catch {
      continue
    }

    await fs.rm(image)
    removed += 1
    bytes += size
  }

  if (removed > 0) {
    await removeEmptyDirectories(distDir, distDir)
    log(`[sitelo] images pruned ${removed} unreferenced original${removed === 1 ? '' : 's'} (${formatBytes(bytes)})`)
  }
}

/**
 * Depth-first removal of directories left empty by pruning. `root` itself is
 * always kept.
 * @param {string} dir
 * @param {string} root
 */
async function removeEmptyDirectories(dir, root) {
  const entries = await fs.readdir(dir, { withFileTypes: true })

  for (const entry of entries) {
    if (entry.isDirectory()) {
      await removeEmptyDirectories(path.join(dir, entry.name), root)
    }
  }

  if (dir === root) return

  const remaining = await fs.readdir(dir)
  if (remaining.length === 0) await fs.rmdir(dir)
}

/**
 * Optimize every image referenced by the built HTML in `outDir`.
 * @param {{
 *   root: string
 *   outDir: string
 *   base?: string
 *   options: ImageOptions
 *   log?: (message: string) => void
 *   warn?: (message: string) => void
 * }} args
 */
export async function runImages({
  root,
  outDir,
  base = '/',
  options,
  log = console.log,
  warn = console.warn,
}) {
  const sharp = await loadSharp()
  const distDir = path.resolve(root, outDir)
  const cacheDir = path.resolve(root, options.cacheDir)
  const htmlFiles = await walk(distDir, new Set(['.html']))

  if (htmlFiles.length === 0) return

  const processor = createImageProcessor({
    sharp,
    options,
    cacheDir,
    outputDir: path.join(distDir, options.assetsDir),
    urlPrefix: variantUrlPrefix(base, options.assetsDir),
  })

  // Everything referenced by a built page already lives in dist/, whether it
  // came from public/ or from src/.
  const resolveLocal = createSourceResolver({ root: distDir, dirs: ['.'], base })

  /** @param {string} url @param {string} page the page's URL path */
  const resolve = async (url, page) => {
    if (isHttpUrl(url)) {
      if (!options.remote) return null
      return fetchRemoteImage({ url, cacheDir, onWarn: warn })
    }
    return resolveLocal(url, page)
  }

  // With a relative `base` the page is where a variant URL starts from.
  const relativeBase = !base.startsWith('/') && !isUrlBase(base)

  let rewrittenTags = 0
  /** Originals some tag was rewritten away from: the only prune candidates. */
  const replaced = new Set()

  if (options.remote) {
    log(
      `[sitelo] images: optimizing remote images in ${htmlFiles.length} HTML file${htmlFiles.length === 1 ? '' : 's'}…`,
    )
  }

  const progressEvery = Math.max(1, Math.min(50, Math.floor(htmlFiles.length / 20)))
  const logProgress = options.remote
    ? createImageProgressLogger({
        total: htmlFiles.length,
        log,
        stats: () => processor.stats,
        every: progressEvery,
      })
    : null

  await mapWithConcurrency(htmlFiles, options.concurrency, async (file) => {
    try {
      const html = await fs.readFile(file, 'utf8')
      // The URL path the file is served at, so a relative `src` resolves
      // the way the browser will resolve it.
      const page = `/${path.relative(distDir, file).split(path.sep).join('/')}`
      const result = await rewriteHtmlImages({
        html,
        options,
        resolve: (url) => resolve(url, page),
        generate: processor.generate,
        ...(relativeBase
          ? { mapUrl: (url) => path.posix.relative(path.posix.dirname(page), url) }
          : {}),
        onWarn: (message) =>
          warn(`[sitelo] images (${path.relative(distDir, file)}): ${message}`),
      })

      if (result.rewritten === 0) return

      rewrittenTags += result.rewritten
      for (const source of result.sources) replaced.add(source)
      await fs.writeFile(file, result.html)
    } finally {
      logProgress?.pageDone()
    }
  })

  logProgress?.stop()

  const { stats } = processor

  if (stats.sources === 0) {
    log('[sitelo] images found nothing to optimize')
    return
  }

  log(
    `[sitelo] images optimized ${stats.sources} source${stats.sources === 1 ? '' : 's'} ` +
      `→ ${stats.variants} variants across ${rewrittenTags} tag${rewrittenTags === 1 ? '' : 's'} ` +
      `(${formatBytes(stats.originalBytes)} → ${formatBytes(stats.variantBytes)})`,
  )

  if (options.prune) {
    await pruneOriginals({ distDir, options, candidates: replaced, log })
  }
}

/**
 * Dev-mode pipeline: rewrite pages on the fly and serve generated variants
 * straight out of the shared cache, so dev and build produce the same markup.
 *
 * @param {{
 *   root: string
 *   pagesDir?: string
 *   publicDir?: string | false
 *   base?: string
 *   options: ImageOptions
 *   warn?: (message: string) => void
 * }} args
 */
export function createDevImagePipeline({
  root,
  pagesDir = 'src',
  publicDir = 'public',
  base = '/',
  options,
  warn = console.warn,
}) {
  const cacheDir = path.resolve(root, options.cacheDir)
  const outputDir = path.join(cacheDir, 'dev')
  // Dev pages are served with `/src/...` URLs for files under pagesDir, so the
  // project root is checked too — the same tag resolves in dev and in build.
  const resolveLocal = createSourceResolver({
    root,
    dirs: [pagesDir, publicDir, '.'],
    base,
  })

  let processorPromise
  let disabled = false

  async function getProcessor() {
    if (!processorPromise) {
      processorPromise = loadSharp().then((sharp) =>
        createImageProcessor({
          sharp,
          options,
          cacheDir,
          outputDir,
          urlPrefix: DEV_URL_PREFIX,
        }),
      )
    }
    return processorPromise
  }

  /**
   * @param {string} html
   * @param {{ url?: string }} [context] the URL the page was requested at,
   *   so a relative `src` resolves against it
   */
  async function transform(html, context = {}) {
    const page = (context.url ?? '/').split(/[?#]/)[0] || '/'

    if (disabled) return html

    let processor
    try {
      processor = await getProcessor()
    } catch (error) {
      // Warn once and serve originals; a dev server should not be unusable
      // because an optional dependency is missing.
      disabled = true
      warn(
        `[sitelo] images are disabled in dev: ${
          error instanceof Error ? error.message : error
        }`,
      )
      return html
    }

    const result = await rewriteHtmlImages({
      html,
      options,
      resolve: async (url) => {
        if (isHttpUrl(url)) {
          return options.remote ? fetchRemoteImage({ url, cacheDir, onWarn: warn }) : null
        }
        return resolveLocal(url, page)
      },
      generate: processor.generate,
      onWarn: (message) => warn(`[sitelo] images: ${message}`),
    })

    return result.html
  }

  /** Serve `/_sitelo/images/<file>` out of the dev cache. */
  function middleware(req, res, next) {
    const rawUrl = req.url ?? ''
    const markerIndex = rawUrl.indexOf(`${DEV_URL_PREFIX}/`)

    if (markerIndex === -1 || (req.method ?? 'GET') !== 'GET') {
      return next()
    }

    const [pathname] = rawUrl.slice(markerIndex + DEV_URL_PREFIX.length + 1).split('?')
    let fileName = ''
    try {
      fileName = path.basename(decodeURIComponent(pathname))
    } catch {
      // A malformed escape names no file we wrote.
    }
    const filePath = path.join(outputDir, fileName)

    if (!fileName || !filePath.startsWith(outputDir) || !fsSync.existsSync(filePath)) {
      res.statusCode = 404
      res.end('Not found')
      return
    }

    const extension = path.extname(fileName).slice(1)
    const format = extension === 'jpg' ? 'jpeg' : extension

    res.statusCode = 200
    res.setHeader('Content-Type', MIME_BY_FORMAT[format] ?? 'application/octet-stream')
    res.setHeader('Cache-Control', 'no-cache')
    fsSync.createReadStream(filePath).pipe(res)
  }

  return { transform, middleware }
}
