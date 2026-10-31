// Narration. Kokoro, an open-source model that runs locally, is the default
// voice; macOS `say` is the fallback, with VOICE=say:<name>. Each line is
// spoken once into a WAV in the cache, keyed by voice, speed and wording, so
// re-renders only synthesize what changed.

import { execFileSync, spawnSync } from 'node:child_process'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import ffmpeg from 'ffmpeg-static'

export const SAMPLE_RATE = 48000
export const DEFAULT_VOICE = 'af_heart'

/**
 * Words the voice gets wrong, written the way they should sound. Captions
 * keep the original spelling; only the audio uses these.
 */
const PRONOUNCE = [
  // Said "sit-el-o". Spelled plainly, both voices say "site-low".
  [/\bsitelo-ui\b/gi, 'Sit-el-oh U I'],
  [/\bsitelo\b/gi, 'Sit-el-oh'],
  [/\.ht\.js\b/g, ' dot H T dot J S'],
  [/\bht\.js\b/g, 'H T dot J S'],
  [/\bjavascript-to-html\b/gi, 'javascript to H T M L'],
  [/\.html\b/g, ' dot H T M L'],
  [/\.css\b/g, ' dot C S S'],
  [/\.json\b/g, ' dot jason'],
  [/\bpageTitle\b/g, 'page title'],
  [/\bweeknight-kitchen\b/g, 'weeknight kitchen'],
  [/\bnpm\b/g, 'N P M'],
  // Run together, these come out as "yoo-arr-rell", "sty-lish-eet" and "eez".
  [/\bURLs\b/g, "U R L's"],
  [/\bURL\b/g, 'U R L'],
  [/\bstylesheet(s?)\b/gi, 'style sheet$1'],
  [/\bES\b/g, 'E S'],
  [/\bVite\b/g, 'veet'],
  [/\bJSX\b/g, 'J S X'],
  [/\bsrc\b/g, 'source'],
  [/\bdist\b/g, 'dist'],
  [/\bCSS\b/g, 'C S S'],
  [/\bMB\b/g, 'megabytes'],
  [/\bkB\b/g, 'kilobytes'],
  [/\bJPEG\b/g, 'jay-peg'],
  [/\bDummyJSON\b/g, 'Dummy JSON'],
  [/\bgzip\b/g, 'gee-zip'],
  [/aria-current/g, 'aria current'],
  [/\b404\b/g, 'four oh four'],
  [/\b5173\b/g, 'fifty-one seventy-three'],
  [/\b4173\b/g, 'forty-one seventy-three'],
  // Code names: generateStaticParams → generate Static Params, params.path → params dot path.
  [/\.js\b/g, ' dot J S'],
  [/([a-z])([A-Z])/g, '$1 $2'],
  [/([a-z])\.([a-z])/gi, '$1 dot $2'],
]

export const pronounce = (text) => PRONOUNCE.reduce((out, [pattern, spoken]) => out.replace(pattern, spoken), text)

/** Reads a 16-bit PCM WAV's samples. */
export const readWav = (file) => {
  const buf = fs.readFileSync(file)
  let offset = 12
  while (offset < buf.length) {
    const id = buf.toString('ascii', offset, offset + 4)
    const size = buf.readUInt32LE(offset + 4)
    if (id === 'data') {
      return new Int16Array(buf.buffer.slice(buf.byteOffset + offset + 8, buf.byteOffset + offset + 8 + size))
    }
    offset += 8 + size + (size % 2)
  }
  throw new Error(`No data chunk in ${file}`)
}

export const writeWav = (file, samples) => {
  const header = Buffer.alloc(44)
  header.write('RIFF', 0)
  header.writeUInt32LE(36 + samples.byteLength, 4)
  header.write('WAVE', 8)
  header.write('fmt ', 12)
  header.writeUInt32LE(16, 16)
  header.writeUInt16LE(1, 20)
  header.writeUInt16LE(1, 22)
  header.writeUInt32LE(SAMPLE_RATE, 24)
  header.writeUInt32LE(SAMPLE_RATE * 2, 28)
  header.writeUInt16LE(2, 32)
  header.writeUInt16LE(16, 34)
  header.write('data', 36)
  header.writeUInt32LE(samples.byteLength, 40)
  fs.writeFileSync(file, Buffer.concat([header, Buffer.from(samples.buffer, samples.byteOffset, samples.byteLength)]))
}

/** Silence a voice leaves at either end, so lines sit where the timeline puts them. */
const trim = (samples) => {
  const threshold = 300
  let start = 0
  let end = samples.length
  while (start < end && Math.abs(samples[start]) < threshold) start++
  while (end > start && Math.abs(samples[end - 1]) < threshold) end--
  const pad = Math.round(SAMPLE_RATE * 0.03)
  return samples.slice(Math.max(0, start - pad), Math.min(samples.length, end + pad))
}

const toInt16 = (floats) => Int16Array.from(floats, (v) => Math.max(-32768, Math.min(32767, Math.round(v * 32767))))

/** Resamples 16-bit mono PCM to SAMPLE_RATE. */
const resample = (samples, rate) => {
  const pcm = ['-f', 's16le', '-ac', '1']
  const result = spawnSync(ffmpeg, ['-loglevel', 'error', ...pcm, '-ar', String(rate), '-i', '-', ...pcm, '-ar', String(SAMPLE_RATE), '-'], {
    input: Buffer.from(samples.buffer, samples.byteOffset, samples.byteLength),
    maxBuffer: 1 << 30,
  })
  if (result.status !== 0) throw new Error(`ffmpeg resample failed: ${result.stderr}`)
  return new Int16Array(result.stdout.buffer, result.stdout.byteOffset, result.stdout.byteLength / 2).slice()
}

const concat = (parts, gapSeconds) => {
  const gap = Math.round(gapSeconds * SAMPLE_RATE)
  const out = new Int16Array(parts.reduce((n, p) => n + p.length, 0) + gap * (parts.length - 1))
  let offset = 0
  for (const part of parts) {
    out.set(part, offset)
    offset += part.length + gap
  }
  return out
}

let kokoro = null
const speakKokoro = async (text, voice, speed) => {
  if (!kokoro) {
    // The model (326 MB) downloads from Hugging Face on first use, then is cached.
    const { KokoroTTS } = await import('kokoro-js')
    kokoro = await KokoroTTS.from_pretrained('onnx-community/Kokoro-82M-v1.0-ONNX', { dtype: 'fp32', device: 'cpu' })
  }
  // Kokoro truncates input past ~510 phonemes, so long lines go a few sentences at a time.
  const chunks = []
  for (const sentence of text.match(/[^.!?]+[.!?]+\s*|[^.!?]+$/g) ?? [text]) {
    if (chunks.length && chunks.at(-1).length + sentence.length < 300) chunks[chunks.length - 1] += sentence
    else chunks.push(sentence)
  }
  const parts = []
  for (const chunk of chunks) {
    const audio = await kokoro.generate(chunk.trim(), { voice, speed })
    parts.push(trim(resample(toInt16(audio.audio), audio.sampling_rate)))
  }
  return concat(parts, 0.3)
}

const speakSay = (text, voice, rate, file) => {
  const raw = `${file}.raw.wav`
  execFileSync('say', ['-v', voice, '-r', String(rate), '--file-format=WAVE', `--data-format=LEI16@${SAMPLE_RATE}`, '-o', raw, text])
  const samples = readWav(raw)
  fs.rmSync(raw)
  return samples
}

/**
 * Returns voice(text) → { file, duration }. A line that isn't cached yet gets
 * an estimated duration and is queued; render.js calls voice.synthesize() to
 * speak the queue, then lays the timeline out again with real durations.
 */
export const createVoice = ({
  cacheDir,
  voice = process.env.VOICE ?? DEFAULT_VOICE,
  speed = Number(process.env.SPEED ?? 1),
  rate = Number(process.env.RATE ?? 182),
}) => {
  fs.mkdirSync(cacheDir, { recursive: true })
  const say = voice.startsWith('say:')
  const settings = say ? `${voice}\0${rate}` : `${voice}\0${speed}`
  const queue = new Map()
  const line = (text) => {
    const spoken = pronounce(text)
    const hash = crypto.createHash('sha1').update(`${settings}\0${spoken}`).digest('hex').slice(0, 16)
    const file = path.join(cacheDir, `${hash}.wav`)
    if (fs.existsSync(file)) return { file, duration: readWav(file).length / SAMPLE_RATE }
    queue.set(file, spoken)
    return { file, duration: spoken.split(/\s+/).length / 2.6 }
  }
  line.pending = () => queue.size
  line.synthesize = async () => {
    let done = 0
    for (const [file, spoken] of queue) {
      const samples = say ? speakSay(spoken, voice.slice(4), rate, file) : await speakKokoro(spoken, voice, speed)
      writeWav(file, trim(samples))
      process.stdout.write(`\r  speaking ${++done}/${queue.size}`)
    }
    if (done) process.stdout.write('\n')
    queue.clear()
  }
  return line
}

/** Lays every narration clip onto one track at its start time. */
export const mixNarration = (clips, duration, file) => {
  const out = new Int16Array(Math.ceil((duration + 0.5) * SAMPLE_RATE))
  for (const clip of clips) {
    const samples = readWav(clip.file)
    const offset = Math.round(clip.t * SAMPLE_RATE)
    for (let i = 0; i < samples.length && offset + i < out.length; i++) {
      out[offset + i] = Math.max(-32768, Math.min(32767, out[offset + i] + samples[i]))
    }
  }
  writeWav(file, out)
}
