// Captions (.srt) and YouTube chapter lines from the narration timeline.

const stamp = (seconds, sep = ',') => {
  const ms = Math.round(seconds * 1000)
  const h = String(Math.floor(ms / 3600000)).padStart(2, '0')
  const m = String(Math.floor(ms / 60000) % 60).padStart(2, '0')
  const s = String(Math.floor(ms / 1000) % 60).padStart(2, '0')
  return `${h}:${m}:${s}${sep}${String(ms % 1000).padStart(3, '0')}`
}

/** Splits a line into caption-sized pieces at sentence, then clause, boundaries. */
const chunks = (text, max = 84) => {
  const sentences = text.match(/[^.!?]+[.!?]+["')]*\s*|[^.!?]+$/g) ?? [text]
  const out = []
  for (const sentence of sentences.map((s) => s.trim()).filter(Boolean)) {
    if (sentence.length <= max) {
      out.push(sentence)
      continue
    }
    let current = ''
    for (const word of sentence.split(' ')) {
      if ((current + ' ' + word).trim().length > max && current) {
        out.push(current.trim())
        current = ''
      }
      current += ` ${word}`
    }
    if (current.trim()) out.push(current.trim())
  }
  return out
}

export const srt = (narration) => {
  const cues = []
  for (const clip of narration) {
    const pieces = chunks(clip.text)
    const total = pieces.reduce((n, p) => n + p.length, 0)
    let t = clip.t
    for (const piece of pieces) {
      const dur = (clip.duration * piece.length) / total
      cues.push({ start: t, end: t + dur, text: piece })
      t += dur
    }
  }
  return cues.map((c, i) => `${i + 1}\n${stamp(c.start)} --> ${stamp(c.end)}\n${c.text}\n`).join('\n')
}

/**
 * YouTube's chapter rules: the first starts at 0:00 and each runs at least
 * 10 seconds. A shorter one is folded into the chapter before it (or, at
 * the start, the one after).
 */
export const chapterLines = (chapters, duration) => {
  const list = chapters.map((c) => ({ ...c }))
  if (list.length) list[0].t = 0
  for (let i = 0; i < list.length; i++) {
    const end = list[i + 1]?.t ?? duration
    if (end - list[i].t >= 10) continue
    if (i === 0 && list.length > 1) list[1].t = 0
    list.splice(i, 1)
    i = -1
  }
  return list
    .map(({ t, title }) => {
      const s = Math.floor(t)
      const time = s >= 3600 ? stamp(s, '').slice(0, 8) : `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
      return `${time} ${title}`
    })
    .join('\n')
}
