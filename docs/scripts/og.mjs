/**
 * Regenerates public/og.png, the link preview every page names in
 * `og:image`, from the wordmark in public/logo.svg.
 *
 * 1200×630 is the size Open Graph asks for, and X's large card crops it to
 * 2:1 from the centre, so the wordmark sits well inside both. It is drawn the
 * way the site is: a plain sheet in the middle, ruled off by rails and rules
 * that run to the card's edges, a registration mark where each pair crosses,
 * the blueprint grid in the margins, and the wordmark in ink.
 *
 * Run `npm run docs:og` after logo.svg or the preset's colours change, then
 * commit the file it writes. Needs sharp, already an optional peer for image
 * optimization.
 */
import { readFileSync } from 'node:fs'
import sharp from 'sharp'

const publicDir = new URL('../public/', import.meta.url)
const out = (name) => new URL(name, publicDir)

/** Mirrors `OG_IMAGE` in src/lib/seo.js. */
const WIDTH = 1200
const HEIGHT = 630

/**
 * The blueprint preset's dark tokens: `--su-bg`, `--su-text`, `--su-border`
 * and `--su-bp-mark`. The grid is `--su-bp-grid` drawn a little stronger,
 * since a card is mostly seen as a thumbnail.
 */
const PLAQUE = '#0a0a0a'
const INK = '#ededed'
const LINE = '#262626'
const MARK = '#6e6e6e'
const GRID = 'rgba(255, 255, 255, 0.06)'

/** One grid square, and the lines at twice the site's weight: a card is scaled down. */
const CELL = 30
const STROKE = 2
/** A registration mark's arm, out from the line it sits on. */
const ARM = 10

/** Where the rails and the rules run: the sheet's edges. */
const SHEET = { left: 120, right: WIDTH - 120, top: 90, bottom: HEIGHT - 90 }

/** The wordmark's width on the card. Wide enough to read at thumbnail size. */
const MARK_WIDTH = 640

const round = (n) => Math.round(n * 100) / 100

function readWordmark() {
  const svg = readFileSync(out('logo.svg'), 'utf8')
  const d = svg.match(/\sd="([^"]+)"/)?.[1]
  if (!d) throw new Error('no path data in logo.svg')
  const viewBox = svg.match(/viewBox="([^"]+)"/)?.[1]
  if (!viewBox) throw new Error('no viewBox in logo.svg')
  return { d, viewBox }
}

/** The wordmark's own bounding box, measured as icons.mjs measures the S. */
async function measure({ d, viewBox }) {
  const scale = 2
  const [, , vw, vh] = viewBox.split(/[\s,]+/).map(Number)
  const probe = `<svg xmlns="http://www.w3.org/2000/svg" width="${vw * scale}" height="${vh * scale}" viewBox="${viewBox}"><path d="${d}" fill="#000" fill-rule="evenodd"/></svg>`
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

const wordmark = readWordmark()
const box = await measure(wordmark)

const s = MARK_WIDTH / box.width
const markHeight = box.height * s
const x = round((WIDTH - MARK_WIDTH) / 2)
const y = round((HEIGHT - markHeight) / 2)

const { left, right, top, bottom } = SHEET
const half = STROKE / 2

/** A line from edge to edge of the card, centred on `at`. */
const rail = (at) => `<rect x="${at - half}" y="0" width="${STROKE}" height="${HEIGHT}" fill="${LINE}"/>`
const rule = (at) => `<rect x="0" y="${at - half}" width="${WIDTH}" height="${STROKE}" fill="${LINE}"/>`

/** A cross centred where a rail and a rule meet. */
const cross = (cx, cy) =>
  `<rect x="${cx - half - ARM}" y="${cy - half}" width="${STROKE + 2 * ARM}" height="${STROKE}" fill="${MARK}"/>` +
  `<rect x="${cx - half}" y="${cy - half - ARM}" width="${STROKE}" height="${STROKE + 2 * ARM}" fill="${MARK}"/>`

const card = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
	<defs>
		<pattern id="grid" width="${CELL}" height="${CELL}" patternUnits="userSpaceOnUse">
			<path d="M ${CELL} 0 H 0 V ${CELL}" fill="none" stroke="${GRID}" stroke-width="${STROKE}"/>
		</pattern>
	</defs>
	<rect width="${WIDTH}" height="${HEIGHT}" fill="${PLAQUE}"/>
	<rect width="${WIDTH}" height="${HEIGHT}" fill="url(#grid)"/>
	<rect x="${left}" y="${top}" width="${right - left}" height="${bottom - top}" fill="${PLAQUE}"/>
	${rail(left)}${rail(right)}${rule(top)}${rule(bottom)}
	${cross(left, top)}${cross(right, top)}${cross(right, bottom)}${cross(left, bottom)}
	<path transform="translate(${round(x - box.x * s)} ${round(y - box.y * s)}) scale(${round(s)})" d="${wordmark.d}" fill="${INK}" fill-rule="evenodd"/>
</svg>
`

await sharp(Buffer.from(card))
  .png({ compressionLevel: 9, adaptiveFiltering: true })
  .toFile(out('og.png').pathname)

console.log('wrote og.png')
