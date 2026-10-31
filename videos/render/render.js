// node render.js <episode> [--draft] [--from <s>] [--to <s>] [--stills <s,s,…>]
//
// Builds the episode's timeline, speaks its narration, draws every frame on
// the stage in headless Chrome and encodes out/<episode>/<episode>.mp4, with
// captions (.srt) and a YouTube description (chapters included) beside it.
// --stills writes PNGs at the given times instead, for checking a frame.

import { spawn } from 'node:child_process'
import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'
import ffmpeg from 'ffmpeg-static'
import puppeteer from 'puppeteer-core'
import { chapterLines, srt } from './lib/captions.js'
import { Director } from './lib/director.js'
import { SCALE, STAGE } from './lib/layout.js'
import { createVoice, mixNarration } from './lib/voice.js'

const { values: args, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    draft: { type: 'boolean', default: false },
    from: { type: 'string' },
    to: { type: 'string' },
    stills: { type: 'string' },
    fps: { type: 'string', default: '30' },
  },
})
const episode = positionals[0]
if (!episode) throw new Error('Usage: node render.js <episode>, e.g. 01-setup')

const root = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(root, 'out', episode)
const capture = JSON.parse(fs.readFileSync(path.join(outDir, 'capture', 'capture.json'), 'utf8'))
const voice = createVoice({ cacheDir: path.join(root, 'out', '.voice') })
const { default: direct, meta } = await import(`./episodes/${episode}/episode.js`)
const lay = () => {
  const director = new Director({ shots: capture.shots, voice, shotsBase: `/out/${episode}/capture` })
  direct(director, capture)
  return director
}
// Lines the voice hasn't spoken yet only have estimated lengths: speak them,
// then lay the episode out again with the real ones.
let director = lay()
if (voice.pending()) {
  await voice.synthesize()
  director = lay()
}
const timeline = director.timeline()

const minutes = (s) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`
console.log(`${episode}: ${minutes(timeline.duration)}, ${director.narration.length} narration lines`)

fs.writeFileSync(path.join(outDir, 'timeline.json'), JSON.stringify(timeline))
mixNarration(director.narration, timeline.duration, path.join(outDir, 'narration.wav'))
fs.writeFileSync(path.join(outDir, `${episode}.srt`), srt(director.narration))
fs.writeFileSync(
  path.join(outDir, 'youtube.txt'),
  `${meta.title}\n\n${meta.description}\n\n${chapterLines(director.chapters, timeline.duration)}\n`,
)

// The stage loads ES modules, which Chrome refuses over file://.
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.woff2': 'font/woff2', '.svg': 'image/svg+xml' }
const server = http.createServer((req, res) => {
  const file = path.join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname))
  if (!file.startsWith(root) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    res.writeHead(404).end()
    return
  }
  res.writeHead(200, { 'content-type': types[path.extname(file)] ?? 'application/octet-stream' })
  fs.createReadStream(file).pipe(res)
})
await new Promise((resolve) => server.listen(0, resolve))

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
  args: ['--hide-scrollbars', '--font-render-hinting=none'],
})
const page = await browser.newPage()
const scale = args.draft ? 0.5 : SCALE
await page.setViewport({ ...STAGE, deviceScaleFactor: scale })
page.on('pageerror', (error) => console.error('stage:', error.message))
await page.goto(`http://localhost:${server.address().port}/stage/index.html`)
await page.waitForFunction(() => typeof window.loadTimeline === 'function')
await page.evaluate((tl) => window.loadTimeline(tl), timeline)
const frame = () => page.screenshot({ type: 'png', optimizeForSpeed: true, clip: { x: 0, y: 0, ...STAGE } })

if (args.stills) {
  const dir = path.join(outDir, 'stills')
  fs.mkdirSync(dir, { recursive: true })
  for (const t of args.stills.split(',').map(Number)) {
    await page.evaluate((time) => window.seek(time), t)
    fs.writeFileSync(path.join(dir, `${String(t).replace('.', '_')}.png`), await frame())
  }
  console.log(`Stills in ${path.relative(process.cwd(), dir)}`)
} else {
  const fps = Number(args.fps)
  const from = Number(args.from ?? 0)
  const to = Math.min(Number(args.to ?? timeline.duration), timeline.duration)
  const videoOnly = path.join(outDir, 'video-only.mp4')
  const encoder = spawn(ffmpeg, [
    '-y', '-loglevel', 'error',
    '-f', 'image2pipe', '-framerate', String(fps), '-i', '-',
    '-c:v', 'libx264', '-preset', args.draft ? 'veryfast' : 'slow', '-crf', args.draft ? '26' : '16',
    '-tune', 'animation', '-pix_fmt', 'yuv420p', '-r', String(fps), videoOnly,
  ], { stdio: ['pipe', 'inherit', 'inherit'] })
  const write = (buf) => new Promise((resolve) => (encoder.stdin.write(buf) ? resolve() : encoder.stdin.once('drain', resolve)))

  const total = Math.ceil((to - from) * fps)
  let lastKey = null
  let lastFrame = null
  let shot = 0
  const started = Date.now()
  for (let i = 0; i < total; i++) {
    const key = await page.evaluate((time) => window.seek(time), from + i / fps)
    if (key !== lastKey) {
      lastFrame = await frame()
      lastKey = key
      shot++
    }
    await write(lastFrame)
    if (i % (fps * 20) === 0) {
      const elapsed = (Date.now() - started) / 1000
      console.log(`  ${minutes(i / fps)} / ${minutes(total / fps)}  (${shot} drawn, ${elapsed.toFixed(0)}s)`)
    }
  }
  encoder.stdin.end()
  await new Promise((resolve) => encoder.on('close', resolve))

  const final = path.join(outDir, `${episode}${args.draft ? '.draft' : ''}.mp4`)
  await new Promise((resolve, reject) => {
    const mux = spawn(ffmpeg, [
      '-y', '-loglevel', 'error',
      '-i', videoOnly,
      '-ss', String(from), '-t', String(to - from), '-i', path.join(outDir, 'narration.wav'),
      // say writes mono with no channel layout, which loudnorm can't negotiate.
      '-af', 'aformat=channel_layouts=mono,loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000', '-ac', '2',
      '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', final,
    ], { stdio: 'inherit' })
    mux.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg exited ${code}`))))
  })
  fs.rmSync(videoOnly)
  console.log(`Wrote ${path.relative(process.cwd(), final)} (${shot} of ${total} frames drawn)`)

  // YouTube thumbnail: the title card at 1280×720.
  const title = timeline.overlays.find((o) => o.kind === 'title')
  if (title) {
    await page.evaluate((time) => window.seek(time), (title.t0 + title.t1) / 2)
    const png = await frame()
    await new Promise((resolve, reject) => {
      const scaler = spawn(ffmpeg, ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-i', '-', '-vf', 'scale=1280:720', path.join(outDir, 'thumbnail.png')], { stdio: ['pipe', 'inherit', 'inherit'] })
      scaler.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg exited ${code}`))))
      scaler.stdin.end(png)
    })
  }
}

await browser.close()
server.close()
