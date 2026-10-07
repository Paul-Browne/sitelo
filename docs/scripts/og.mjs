/**
 * Regenerates public/og.png, the link preview every page names in
 * `og:image`, from the wordmark in public/logo.svg.
 *
 * 1200×630 is the size Open Graph asks for, and X's large card crops it to
 * 2:1 from the centre, so the wordmark sits well inside both. It is drawn the
 * way the site is: the dark plaque, two of the background's drifting washes,
 * and the same cool-to-neon sweep as the favicon.
 *
 * Run `npm run docs:og` after logo.svg or the accent tokens change, then
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

/** --paper, --accent and --glow-cool, and the favicon's three gradient stops. */
const PLAQUE = '#071410'
const ACCENT = '#3dff9a'
const COOL = '#8fd4ff'
const STOPS = [
  [0, '#8fd4ff'],
  [0.3, '#3dff9a'],
  [1, '#1fb56d'],
]

/** The wordmark's width on the card. Wide enough to read at thumbnail size. */
const MARK_WIDTH = 760

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
const stops = STOPS.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('')

const card = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
	<defs>
		<radialGradient id="warm" cx="0.18" cy="0.95" r="0.7">
			<stop offset="0" stop-color="${ACCENT}" stop-opacity="0.22"/>
			<stop offset="1" stop-color="${ACCENT}" stop-opacity="0"/>
		</radialGradient>
		<radialGradient id="cool" cx="0.88" cy="0.05" r="0.65">
			<stop offset="0" stop-color="${COOL}" stop-opacity="0.18"/>
			<stop offset="1" stop-color="${COOL}" stop-opacity="0"/>
		</radialGradient>
		<linearGradient id="mark" gradientUnits="userSpaceOnUse" x1="${x}" y1="${y}" x2="${round(x + MARK_WIDTH)}" y2="${round(y + markHeight)}">${stops}</linearGradient>
	</defs>
	<rect width="${WIDTH}" height="${HEIGHT}" fill="${PLAQUE}"/>
	<rect width="${WIDTH}" height="${HEIGHT}" fill="url(#warm)"/>
	<rect width="${WIDTH}" height="${HEIGHT}" fill="url(#cool)"/>
	<path transform="translate(${round(x - box.x * s)} ${round(y - box.y * s)}) scale(${round(s)})" d="${wordmark.d}" fill="url(#mark)" fill-rule="evenodd"/>
</svg>
`

await sharp(Buffer.from(card))
  .png({ compressionLevel: 9, adaptiveFiltering: true })
  .toFile(out('og.png').pathname)

console.log('wrote og.png')
