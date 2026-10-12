/**
 * Regenerates the favicon and app icons from the "S" in public/logo.svg.
 *
 * The full wordmark is unreadable at 16px, so the icons use the S on its own,
 * in ink on the near-black sheet the site is drawn on — the blueprint
 * preset's dark page and text colours, and its square corners.
 *
 * Run `npm run docs:icons` after logo.svg or the preset's colours change, then
 * commit the four files it writes. Needs sharp, already an optional peer for
 * image optimization.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import sharp from 'sharp'

const publicDir = new URL('../public/', import.meta.url)
const out = (name) => new URL(name, publicDir)

/** --paper and --ink in the dark theme: the preset's `--su-bg` and `--su-text`. */
const PLAQUE = '#0a0a0a'
const INK = '#ededed'

const BOX = 512
/** Cap height inside a 512 box. Large, so the counters survive down to 16px. */
const CAP = 360
/** Android may crop a maskable icon to the inner 80%, so that S runs smaller. */
const MASKABLE_CAP = 250

const round = (n) => Math.round(n * 100) / 100

/**
 * logo.svg draws the whole wordmark as one evenodd path. Every glyph is its
 * own subpath, and the S is the first, so it ends where the second `M` starts.
 */
function readGlyph() {
  const svg = readFileSync(out('logo.svg'), 'utf8')
  const d = svg.match(/\sd="([^"]+)"/)?.[1]
  if (!d) throw new Error('no path data in logo.svg')
  const viewBox = svg.match(/viewBox="([^"]+)"/)?.[1]
  if (!viewBox) throw new Error('no viewBox in logo.svg')
  const next = d.indexOf('M', 1)
  return { d: d.slice(0, next === -1 ? undefined : next).trim(), viewBox }
}

/**
 * The glyph's own bounding box, measured rather than hard-coded so a redrawn
 * logo still centres correctly. Rendering oversampled and trimming the
 * transparent margin is cheaper than walking the béziers.
 */
async function measure({ d, viewBox }) {
  const scale = 4
  const [, , vw, vh] = viewBox.split(/[\s,]+/).map(Number)
  const probe = `<svg xmlns="http://www.w3.org/2000/svg" width="${vw * scale}" height="${vh * scale}" viewBox="${viewBox}"><path d="${d}" fill="#000"/></svg>`
  const { info } = await sharp(Buffer.from(probe))
    .trim({ threshold: 1 })
    .toBuffer({ resolveWithObject: true })
  return {
    x: -info.trimOffsetLeft / scale,
    y: -info.trimOffsetTop / scale,
    width: info.width / scale,
    height: info.height / scale,
  }
}

/** The glyph centred in a BOX-sized square. */
function mark({ d, box: b }, { cap }) {
  const s = cap / b.height
  const x = round((BOX - b.width * s) / 2)
  const y = round((BOX - cap) / 2)
  return `<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="sitelo" width="${BOX}" height="${BOX}" viewBox="0 0 ${BOX} ${BOX}">
	<rect width="${BOX}" height="${BOX}" fill="${PLAQUE}"/>
	<path transform="translate(${round(x - b.x * s)} ${round(y - b.y * s)}) scale(${round(s)})" d="${d}" fill="${INK}"/>
</svg>
`
}

const glyph = readGlyph()
const shape = { d: glyph.d, box: await measure(glyph) }

// rel="icon": a square tile, as nothing on the site is rounded.
const square = mark(shape, { cap: CAP })
writeFileSync(out('favicon.svg'), square)

// apple-touch and PWA icons: the same tile; the platform applies its own mask.
const maskable = Buffer.from(mark(shape, { cap: MASKABLE_CAP }))

await sharp(Buffer.from(square)).resize(192, 192).png().toFile(out('icon-192.png').pathname)
await sharp(Buffer.from(square)).resize(BOX, BOX).png().toFile(out('icon-512.png').pathname)
await sharp(maskable).resize(BOX, BOX).png().toFile(out('icon-maskable-512.png').pathname)

console.log('wrote favicon.svg, icon-192.png, icon-512.png, icon-maskable-512.png')
