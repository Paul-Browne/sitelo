// node samples.js [voice …]
//
// Speaks the same two sentences in each Kokoro voice (or the ones named),
// to out/voice-samples/, for choosing a narrator. Pass the pick to render.js
// as VOICE=<voice>.

import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import ffmpeg from 'ffmpeg-static'
import { createVoice } from './lib/voice.js'

const root = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(root, 'out', 'voice-samples')
fs.mkdirSync(outDir, { recursive: true })

// Kokoro's better-rated English voices: American (a) and British (b), female and male.
const voices = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ['af_heart', 'af_bella', 'af_nicole', 'bf_emma', 'am_michael', 'am_fenrir', 'am_puck', 'bm_george', 'bm_fable']
const line =
  "sitelo turns JavaScript functions that return HTML into a static site. Every page is a function that returns a string, and that's the whole model."

const samples = voices.map((voice) => ({ voice, name: voice, text: line }))
// The same line with the stress moved: sit-EL-oh instead of SIT-el-oh.
samples.push({ voice: voices[0], name: `${voices[0]}-sit-EL-oh`, text: line.replace('sitelo', 'Sit-ello') })

for (const { voice, name, text } of samples) {
  const speak = createVoice({ cacheDir: path.join(root, 'out', '.voice'), voice })
  if (speak(text) && speak.pending()) await speak.synthesize()
  const { file } = speak(text)
  const out = path.join(outDir, `${name}.m4a`)
  spawnSync(ffmpeg, ['-y', '-loglevel', 'error', '-i', file, '-c:a', 'aac', '-b:a', '160k', out])
  console.log(path.relative(process.cwd(), out))
}
