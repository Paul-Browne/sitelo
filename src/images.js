import { createHash } from 'node:crypto'
import fs from 'node:fs/promises'
import fsSync from 'node:fs'
import os from 'node:os'
import path from 'node:path'

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

  const options = images === true ? {} : images

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

  const exclude = (options.exclude ?? []).map((pattern) =>
    pattern instanceof RegExp ? pattern : globToRegExp(String(pattern)),
  )

  return {
    widths: [...new Set(widths)].sort((a, b) => a - b),
    formats: [...new Set(formats)],
    quality: { ...DEFAULT_QUALITY, ...(options.quality ?? {}) },
    sizes: options.sizes,
    dimensions: options.dimensions !== false,
    lazy: options.lazy !== false,
    exclude,
    assetsDir: (options.assetsDir ?? DEFAULT_ASSETS_DIR).replace(/^\/+|\/+$/g, ''),
    cacheDir: options.cacheDir ?? DEFAULT_CACHE_DIR,
    remote: options.remote === true,
    prune: options.prune === true,
    dev: options.dev !== false,
    // Remote encodes hammer libvips; serialise to avoid SIGBUS on macOS.
    concurrency:
      options.concurrency ??
      (options.remote === true ? 1 : Math.max(1, Math.min(8, (os.cpus()?.length ?? 4) - 1))),
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
          'Install it to enable image optimization: npm install -D sharp\n' +
          '(or set `images: false` in sitelo.config.js)'
        : '"images" found sharp but could not load it.\n' +
          'This usually means the platform binary is missing — try reinstalling: npm install -D sharp\n' +
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

function isExternalUrl(url) {
  return /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(url)
}

function isHttpUrl(url) {
  return /^https?:\/\//i.test(url)
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
 * Header checks miss truncated downloads; those can SIGBUS when libvips mmaps them.
 * @param {Buffer} buffer
 */
function looksLikeCompleteRaster(buffer) {
  if (!looksLikeRaster(buffer)) return false

  // JPEG must end with the EOI marker.
  if (buffer[0] === 0xff && buffer[1] === 0xd8) {
    return (
      buffer.length >= 4 &&
      buffer[buffer.length - 2] === 0xff &&
      buffer[buffer.length - 1] === 0xd9
    )
  }

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
 * Widths to emit for an image: every configured width that the source can
 * satisfy without upscaling, plus the source width when it is smaller than
 * the whole ladder.
 * @param {number} intrinsicWidth
 * @param {number[]} widths
 */
export function resolveWidths(intrinsicWidth, widths) {
  const usable = widths.filter((width) => width < intrinsicWidth)

  if (usable.length === widths.length) return usable

  return [...new Set([...usable, intrinsicWidth])].sort((a, b) => a - b)
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
export function createImageProcessor({ sharp, options, cacheDir, outputDir, urlPrefix }) {
  /** @type {Map<string, Promise<null | object>>} */
  const inFlight = new Map()
  const stats = { sources: 0, variants: 0, originalBytes: 0, variantBytes: 0 }
  const sourceLimit = createLimiter(options.concurrency)
  const encodeLimit = createLimiter(options.concurrency)

  // Cap libvips' own thread pool — high parallel sharp() calls can SIGBUS on macOS.
  if (typeof sharp.concurrency === 'function') {
    sharp.concurrency(options.remote ? 1 : Math.min(options.concurrency, 4))
  }

  function encode(sourceBuffer, width, format) {
    return encodeLimit(() => {
      const pipeline = sharp(sourceBuffer, SHARP_INPUT).resize({
        width,
        withoutEnlargement: true,
      })

      if (format === 'png') {
        return pipeline.png({ compressionLevel: 9, palette: true }).toBuffer()
      }

      return pipeline[format]({ quality: options.quality[format] }).toBuffer()
    })
  }

  async function buildVariant({ sourceBuffer, sourceHash, name, width, format }) {
    const extension = EXTENSION_BY_FORMAT[format]
    const key = hash(`${sourceHash}:${width}:${format}:${options.quality[format]}`)
    const fileName = `${name}.${key}-${width}.${extension}`
    const cachePath = path.join(cacheDir, fileName)
    const outputPath = path.join(outputDir, fileName)

    let buffer
    try {
      buffer = await fs.readFile(cachePath)
    } catch {
      buffer = await encode(sourceBuffer, width, format)
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
      url: joinUrl(urlPrefix, fileName),
      width,
      format,
      bytes: buffer.length,
    }
  }

  /**
   * Generate every variant for one source file.
   * @param {string} sourcePath absolute path to the original image
   * @returns {Promise<null | {
   *   ladders: Array<{ format: string, variants: Array<{ url: string, width: number }> }>
   *   fallback: { url: string, width: number, format: string }
   *   width: number
   *   height: number
   * }>}
   */
  function generate(sourcePath) {
    const existing = inFlight.get(sourcePath)
    if (existing) return existing

    const promise = sourceLimit(async () => {
      const source = await fs.readFile(sourcePath)

      if (!looksLikeCompleteRaster(source)) {
        if (sourcePath.includes(`${path.sep}remote${path.sep}`)) {
          await fs.unlink(sourcePath).catch(() => {})
        }
        throw new Error('not a decodable raster image')
      }

      const metadata = await sharp(source, SHARP_INPUT).metadata()

      // Vectors scale on their own; animations would lose their frames.
      if (!metadata.width || !metadata.height) return null
      if (metadata.format === 'svg') return null
      if ((metadata.pages ?? 1) > 1) return null

      const sourceHash = hash(source, 12)
      const name = path
        .basename(sourcePath, path.extname(sourcePath))
        .replace(/[^a-zA-Z0-9._-]+/g, '-')
      const widths = resolveWidths(metadata.width, options.widths)

      if (widths.length === 0) return null

      const formats = [...options.formats]
      if (formats.length > 1) {
        const fallback = fallbackFormatFor(metadata.format)
        if (!formats.includes(fallback)) formats.push(fallback)
      }

      const jobs = []
      for (const format of formats) {
        for (const width of widths) {
          jobs.push({ sourceBuffer: source, sourceHash, name, width, format })
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
      const largestWidth = widths[widths.length - 1]

      stats.sources += 1
      stats.originalBytes += source.length

      return {
        ladders,
        fallback,
        width: largestWidth,
        height: Math.round((metadata.height / metadata.width) * largestWidth),
      }
    }).catch(async (error) => {
      if (sourcePath.includes(`${path.sep}remote${path.sep}`)) {
        await fs.unlink(sourcePath).catch(() => {})
      }
      throw error
    })

    inFlight.set(sourcePath, promise)
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
export function decodeHtmlEntities(value) {
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

function srcsetFor(variants) {
  return variants.map((variant) => `${variant.url} ${variant.width}w`).join(', ')
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
 *   generate: (sourcePath: string) => Promise<null | object>
 *   onWarn?: (message: string) => void
 * }} args
 * @returns {Promise<{ html: string, rewritten: number }>}
 */
export async function rewriteHtmlImages({ html, options, resolve, generate, onWarn }) {
  const tags = [...html.matchAll(/<img\b[^>]*>/gi)]
  if (tags.length === 0) return { html, rewritten: 0 }

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
        result = await generate(sourcePath)
      } catch (error) {
        onWarn?.(`skipped ${src}: ${error instanceof Error ? error.message : error}`)
        return null
      }

      if (!result) return null

      const aspect = result.width / result.height
      const authoredWidth = toPositiveInt(attributes.get('width'))
      const authoredHeight = toPositiveInt(attributes.get('height'))

      // An author-sized image is displayed at that width, so say so rather
      // than claiming the full ladder width.
      const displayWidth = authoredWidth ?? (authoredHeight ? Math.round(authoredHeight * aspect) : null)

      const sizes =
        attributes.get('sizes') ??
        options.sizes ??
        (displayWidth
          ? `${displayWidth}px`
          : `(max-width: ${result.width}px) 100vw, ${result.width}px`)

      const imgAttributes = new Map(attributes)
      imgAttributes.set('src', result.fallback.url)
      imgAttributes.set('sizes', sizes)

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
        imgAttributes.set('srcset', srcsetFor(result.ladders[0].variants))
        return {
          index: match.index,
          length: tag.length,
          html: `<img${serializeAttributes(imgAttributes)}>`,
        }
      }

      // Multiple formats need <picture> so the browser can negotiate.
      const sources = result.ladders
        .slice(0, -1)
        .map(
          (ladder) =>
            `<source type="${MIME_BY_FORMAT[ladder.format]}" srcset="${srcsetFor(ladder.variants)}" sizes="${String(sizes).replace(/"/g, '&quot;')}">`,
        )
        .join('')

      imgAttributes.set('srcset', srcsetFor(result.ladders[result.ladders.length - 1].variants))

      return {
        index: match.index,
        length: tag.length,
        html: `<picture>${sources}<img${serializeAttributes(imgAttributes)}></picture>`,
      }
    },
  )

  let output = ''
  let cursor = 0
  let rewritten = 0

  for (const replacement of replacements) {
    if (!replacement) continue
    output += html.slice(cursor, replacement.index) + replacement.html
    cursor = replacement.index + replacement.length
    rewritten += 1
  }

  output += html.slice(cursor)

  return { html: output, rewritten }
}

/**
 * Resolve a root-relative URL against the directories sitelo serves from.
 * @param {{ root: string, dirs: Array<string | false | undefined>, base?: string }} args
 */
export function createSourceResolver({ root, dirs, base = '/' }) {
  const basePrefix = base.replace(/\/+$/, '')
  const roots = dirs
    .filter((dir) => typeof dir === 'string' && dir.length > 0)
    .map((dir) => path.resolve(root, dir))

  return (url) => {
    if (isExternalUrl(url) || url.startsWith('data:')) return null

    const [pathname] = url.split(/[?#]/)
    if (!RASTER_EXTENSIONS.has(path.extname(pathname).toLowerCase())) return null

    let relative = pathname
    if (basePrefix && relative.startsWith(`${basePrefix}/`)) {
      relative = relative.slice(basePrefix.length)
    }
    relative = decodeURIComponent(relative.replace(/^\/+/, ''))

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
 * }}
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

/**
 * Remove source images that nothing references any more. Only runs with
 * `images.prune`, and only for files no remaining HTML or CSS points at.
 * @param {{ distDir: string, options: ImageOptions, log: (message: string) => void }} args
 */
async function pruneOriginals({ distDir, options, log }) {
  const documents = await walk(distDir, new Set(['.html', '.css', '.xml', '.json', '.js']))
  const haystack = (
    await Promise.all(documents.map((file) => fs.readFile(file, 'utf8').catch(() => '')))
  ).join('\n')

  const assetsRoot = path.join(distDir, options.assetsDir)
  const images = (await walk(distDir, RASTER_EXTENSIONS)).filter(
    (file) => !file.startsWith(assetsRoot),
  )

  let removed = 0
  let bytes = 0

  for (const image of images) {
    const url = `/${path.relative(distDir, image).split(path.sep).join('/')}`
    if (haystack.includes(url)) continue

    const { size } = await fs.stat(image)
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
    urlPrefix: joinUrl(base, options.assetsDir),
  })

  // Everything referenced by a built page already lives in dist/, whether it
  // came from public/ or from src/.
  const resolveLocal = createSourceResolver({ root: distDir, dirs: ['.'], base })

  const resolve = async (url) => {
    if (isHttpUrl(url)) {
      if (!options.remote) return null
      return fetchRemoteImage({ url, cacheDir, onWarn: warn })
    }
    return resolveLocal(url)
  }

  let rewrittenTags = 0

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
      const result = await rewriteHtmlImages({
        html,
        options,
        resolve,
        generate: processor.generate,
        onWarn: (message) =>
          warn(`[sitelo] images (${path.relative(distDir, file)}): ${message}`),
      })

      if (result.rewritten === 0) return

      rewrittenTags += result.rewritten
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
    await pruneOriginals({ distDir, options, log })
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

  async function transform(html) {
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
        return resolveLocal(url)
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
    const fileName = path.basename(decodeURIComponent(pathname))
    const filePath = path.join(outputDir, fileName)

    if (!filePath.startsWith(outputDir) || !fsSync.existsSync(filePath)) {
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
