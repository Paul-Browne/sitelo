// The API episodes are written in. Each call does something on screen at
// the current time and moves the clock on by however long it takes; say()
// starts a line of narration and runs its actions underneath it. The result
// is a set of tracks that stage.js samples frame by frame.

import { diffWordsWithSpace } from 'diff'
import { BROWSER_CHROME, BROWSER_VIEWPORT, WINDOW } from './layout.js'

export const PROMPT = '\x1b[36;1m~/weeknight-kitchen\x1b[0m \x1b[32;1m$\x1b[0m '
const ZOOM = BROWSER_VIEWPORT.zoom

/** Deterministic jitter so typing has a human rhythm but renders the same every time. */
const jitter = (i) => 0.65 + ((Math.sin(i * 12.9898) * 43758.5453) % 1 + 1) % 1 * 0.7

export class Director {
  constructor({ shots, voice, shotsBase }) {
    this.t = 0
    this.voice = voice
    this.shots = shots
    this.shotsBase = shotsBase
    this.tracks = {
      files: {},
      active: [],
      tabs: [],
      tree: [],
      highlight: [],
      term: [],
      termHeight: [],
      browserIn: [],
      browser: [],
      scroll: [],
      cursor: [],
      cursorVis: [],
      clicks: [],
      callouts: [],
      overlays: [],
    }
    this.narration = []
    this.chapters = []
    this.s = {
      files: {},
      caret: {},
      tabs: [],
      tree: { items: [], open: [] },
      term: { lines: [], input: '', prompt: true },
      termHeight: 0,
      browserIn: 0,
      scroll: 0,
      cursor: null,
      shot: null,
    }
  }

  // ── Clock and narration ───────────────────────────────────────────

  wait(seconds) {
    this.t += seconds
    return this
  }

  /**
   * Speaks `text` from now and runs `actions` alongside it. The clock ends
   * up after whichever finishes last. `speak` overrides what the voice says
   * (for pronunciation); captions always use `text`.
   */
  say(text, actions, { speak, tail = 0.45, delay = 0 } = {}) {
    const start = this.t + delay
    const clip = this.voice(speak ?? text)
    this.narration.push({ t: start, text, ...clip })
    if (actions) actions()
    this.t = Math.max(this.t, start + clip.duration + tail)
    return this
  }

  /** A YouTube chapter with no on-screen card (the cold open, say). */
  marker(title) {
    this.chapters.push({ t: this.t, title })
    return this
  }

  chapter(num, title, { dur = 2.1 } = {}) {
    this.chapters.push({ t: this.t, title })
    this.tracks.overlays.push({ t0: this.t, t1: this.t + dur, kind: 'chapter', data: { num, title } })
    return this.wait(dur)
  }

  card(kind, data, dur) {
    this.tracks.overlays.push({ t0: this.t, t1: this.t + dur, kind, data })
    return this
  }

  // ── Editor ────────────────────────────────────────────────────────

  #keyTree() {
    this.tracks.tree.push({ t: this.t, items: [...this.s.tree.items], open: [...this.s.tree.open] })
  }

  addToTree(paths, { open = [] } = {}) {
    for (const p of [].concat(paths)) if (!this.s.tree.items.includes(p)) this.s.tree.items.push(p)
    for (const dir of [].concat(open)) if (!this.s.tree.open.includes(dir)) this.s.tree.open.push(dir)
    this.#keyTree()
    return this
  }

  removeFromTree(prefix) {
    this.s.tree.items = this.s.tree.items.filter((p) => !p.startsWith(prefix))
    this.#keyTree()
    return this
  }

  #keyFile(path, text, caret, extra = {}) {
    this.s.files[path] = text
    this.s.caret[path] = caret
    ;(this.tracks.files[path] ??= []).push({ t: this.t, text, caret, ...extra })
  }

  open(path) {
    if (!this.s.tabs.includes(path)) {
      this.s.tabs.push(path)
      // Like an editor that closes old tabs: keep six, dropping the oldest.
      while (this.s.tabs.length > 6) {
        this.s.tabs.splice(this.s.tabs.findIndex((tab) => tab !== this.s.active && tab !== path), 1)
      }
      this.tracks.tabs.push({ t: this.t, paths: [...this.s.tabs] })
    }
    if (this.s.active !== path) {
      this.s.active = path
      this.tracks.active.push({ t: this.t, path })
    }
    return this
  }

  closeAll() {
    this.s.tabs = []
    this.s.active = null
    this.tracks.tabs.push({ t: this.t, paths: [] })
    this.tracks.active.push({ t: this.t, path: null })
    return this
  }

  /** Creates a file as the editor would: in the tree, open, empty. */
  newFile(path, content = '') {
    const dirs = path.split('/').slice(0, -1).map((_, i, parts) => parts.slice(0, i + 1).join('/'))
    this.addToTree(path, { open: dirs })
    this.#keyFile(path, content, 0)
    this.open(path)
    return this.wait(0.4)
  }

  /** Puts the caret somewhere without typing, e.g. to scroll to the top. */
  caret(path, index) {
    this.open(path)
    this.#keyFile(path, this.s.files[path], index)
    return this
  }

  #typeInsert(path, pos, insert, cps) {
    let text = this.s.files[path]
    // Typing whole lines above existing code: open a blank line first, as
    // you would, rather than pushing the rest of the line along.
    const openLine = (pos === 0 || text[pos - 1] === '\n') && insert.endsWith('\n') && insert.length > 1 && pos < text.length
    if (openLine) {
      text = `${text.slice(0, pos)}\n${text.slice(pos)}`
      this.#keyFile(path, text, pos)
      this.wait(0.15)
      insert = insert.slice(0, -1)
    }
    let i = 0
    let n = 0
    while (i < insert.length) {
      let chunk = insert[i]
      let dt = (1 / cps) * jitter(n++)
      if (chunk === '\n') {
        // Editors auto-indent: the newline and its indentation land together.
        const indent = insert.slice(i + 1).match(/^ */)[0]
        chunk += indent
        dt += 0.12
      }
      text = text.slice(0, pos) + chunk + text.slice(pos)
      pos += chunk.length
      i += chunk.length
      this.wait(dt)
      this.#keyFile(path, text, pos)
    }
    // The opened line's newline is already there, just past the caret.
    return openLine ? pos + 1 : pos
  }

  #delete(path, pos, length) {
    const text = this.s.files[path]
    if (length <= 6) {
      this.#keyFile(path, text, pos + length)
      this.wait(0.15)
      for (let k = length - 1; k >= 0; k--) {
        this.#keyFile(path, text.slice(0, pos + k) + text.slice(pos + length), pos + k)
        this.wait(0.06)
      }
    } else {
      this.#keyFile(path, text, pos + length, { sel: [pos, pos + length] })
      this.wait(0.45)
      this.#keyFile(path, text.slice(0, pos) + text.slice(pos + length), pos)
      this.wait(0.15)
    }
  }

  /** Edits the file into `to`, typing only what changed. */
  type(path, to, { cps = 32 } = {}) {
    this.open(path)
    const parts = diffWordsWithSpace(this.s.files[path], to)
    let pos = 0
    let lastCaret = this.s.caret[path] ?? 0
    for (let k = 0; k < parts.length; k++) {
      const part = parts[k]
      if (!part.added && !part.removed) {
        pos += part.value.length
        continue
      }
      if (Math.abs(pos - lastCaret) > 1) {
        // Click to the next change before editing it.
        this.#keyFile(path, this.s.files[path], pos)
        this.wait(0.3)
      }
      if (part.removed) this.#delete(path, pos, part.value.length)
      else pos = this.#typeInsert(path, pos, part.value, cps)
      lastCaret = pos
    }
    if (this.s.files[path] !== to) throw new Error(`type() ended with the wrong text in ${path}`)
    return this.wait(0.3)
  }

  /** Selects everything and types the new content over it. */
  retype(path, to, { cps = 32 } = {}) {
    this.open(path)
    const text = this.s.files[path]
    this.#keyFile(path, text, text.length, { sel: [0, text.length] })
    this.wait(0.5)
    this.#keyFile(path, '', 0)
    this.wait(0.2)
    this.#typeInsert(path, 0, to, cps)
    return this.wait(0.3)
  }

  /** Pastes in the new content at once, flashing the lines that changed. */
  paste(path, to) {
    this.open(path)
    const from = this.s.files[path] ?? ''
    let start = 0
    while (start < from.length && start < to.length && from[start] === to[start]) start++
    let end = 0
    while (end < from.length - start && end < to.length - start && from.at(-1 - end) === to.at(-1 - end)) end++
    start = to.lastIndexOf('\n', start - 1) + 1
    const sel = [start, to.length - end]
    this.#keyFile(path, to, start, { sel, hideCaret: true })
    this.wait(0.6)
    this.#keyFile(path, to, start)
    return this.wait(0.3)
  }

  /** Files that exist before the episode starts, so later edits type only what changed. */
  preload(files) {
    for (const [path, content] of Object.entries(files)) this.#keyFile(path, content, 0)
    return this
  }

  /** Highlights lines from..to (1-based, inclusive) until the next highlight. */
  highlight(path, from, to = from) {
    this.open(path)
    this.tracks.highlight.push({ t: this.t, path, from: from - 1, to: to - 1 })
    return this
  }

  unhighlight() {
    this.tracks.highlight.push({ t: this.t, path: null })
    return this
  }

  /** Line number (1-based) of the first line containing `needle`. */
  lineOf(path, needle) {
    const index = this.s.files[path].split('\n').findIndex((line) => line.includes(needle))
    if (index < 0) throw new Error(`"${needle}" not in ${path}`)
    return index + 1
  }

  // ── Terminal ──────────────────────────────────────────────────────

  #keyTerm() {
    this.s.term.lines = this.s.term.lines.slice(-200)
    const tabs = Object.keys(this.s.terms ?? {})
    this.tracks.term.push({
      t: this.t,
      lines: [...this.s.term.lines],
      input: this.s.term.input,
      prompt: this.s.term.prompt,
      ...(tabs.length > 1 && { tabs, tab: this.s.termName }),
    })
  }

  /**
   * Switches to the terminal tab called `name`, opening it if it's new, so
   * one can run a server while another runs commands.
   */
  terminalTab(name) {
    this.s.terms ??= { [this.s.termName ?? 'zsh']: this.s.term }
    this.s.termName ??= 'zsh'
    this.s.terms[this.s.termName] = this.s.term
    this.s.term = this.s.terms[name] ??= { lines: [], input: '', prompt: true }
    this.s.termName = name
    this.#keyTerm()
    return this.wait(0.3)
  }

  terminal(height, dur = 0.45) {
    this.tracks.termHeight.push({ t0: this.t, t1: this.t + dur, from: this.s.termHeight, to: height })
    this.s.termHeight = height
    return this.wait(dur)
  }

  typeCommand(cmd, { cps = 22 } = {}) {
    this.s.term.prompt = true
    for (let i = 1; i <= cmd.length; i++) {
      this.s.term.input = cmd.slice(0, i)
      this.wait((1 / cps) * jitter(i))
      this.#keyTerm()
    }
    this.wait(0.35)
    this.s.term.lines.push(PROMPT + cmd)
    this.s.term.input = ''
    this.s.term.prompt = false
    this.#keyTerm()
    return this
  }

  /** Prints output a few lines at a time over `dur` seconds. */
  print(text, { dur = 0.5 } = {}) {
    const lines = text.replace(/\n+$/, '').split('\n')
    const steps = Math.max(1, Math.min(lines.length, Math.round(dur * 20)))
    const per = Math.ceil(lines.length / steps)
    for (let i = 0; i < lines.length; i += per) {
      this.s.term.lines.push(...lines.slice(i, i + per))
      this.#keyTerm()
      this.wait(dur / steps)
    }
    return this
  }

  /** Sets what the terminal shows, without typing it or moving the clock. */
  setTerminal(text, { prompt = false } = {}) {
    this.s.term.lines = text.replace(/\n+$/, '').split('\n')
    this.s.term.input = ''
    this.s.term.prompt = prompt
    this.#keyTerm()
    return this
  }

  prompt() {
    this.s.term.prompt = true
    this.#keyTerm()
    return this
  }

  run(cmd, output, { wait = 0.5, dur = 0.5 } = {}) {
    this.typeCommand(cmd)
    this.wait(wait)
    if (output) this.print(output, { dur })
    return this.prompt()
  }

  interrupt() {
    this.s.term.lines.push('^C')
    return this.prompt()
  }

  clearTerminal() {
    this.s.term.lines = []
    this.#keyTerm()
    return this
  }

  // ── Browser ───────────────────────────────────────────────────────

  showBrowser(dur = 0.55) {
    this.tracks.browserIn.push({ t0: this.t, t1: this.t + dur, from: this.s.browserIn, to: 1 })
    this.s.browserIn = 1
    return this.wait(dur)
  }

  showEditor(dur = 0.45) {
    this.tracks.browserIn.push({ t0: this.t, t1: this.t + dur, from: this.s.browserIn, to: 0 })
    this.s.browserIn = 0
    this.hideCursor()
    return this.wait(dur)
  }

  load(shot, url, { dur = 0.6 } = {}) {
    if (!this.shots[shot]) throw new Error(`No capture called ${shot}`)
    this.s.shot = shot
    this.tracks.browser.push({ t: this.t, shot, url })
    this.tracks.scroll.push({ t0: this.t, t1: this.t, from: 0, to: 0 })
    this.s.scroll = 0
    return this.wait(dur)
  }

  scrollTo(y, dur = 1.2, { linear = false } = {}) {
    const max = Math.max(0, this.shots[this.s.shot].height - BROWSER_VIEWPORT.height)
    const to = y === 'bottom' ? max : Math.max(0, Math.min(y, max))
    this.tracks.scroll.push({ t0: this.t, t1: this.t + dur, from: this.s.scroll, to, linear })
    this.s.scroll = to
    return this.wait(dur)
  }

  /** Stage coordinates of a captured element (or a page point) at the current scroll. */
  pagePoint(target, { dx = 0.5, dy = 0.5 } = {}) {
    const box = typeof target === 'string' ? this.shots[this.s.shot].boxes[target] : target
    if (!box) throw new Error(`No box ${target} in ${this.s.shot}`)
    return [
      WINDOW.x + (box.x + (box.width ?? 0) * dx) * ZOOM,
      WINDOW.y + BROWSER_CHROME + (box.y + (box.height ?? 0) * dy - this.s.scroll) * ZOOM,
    ]
  }

  /** Stage rectangle around a captured element, at the current scroll. */
  pageRect(target, pad = 8) {
    const box = this.shots[this.s.shot].boxes[target]
    if (!box) throw new Error(`No box ${target} in ${this.s.shot}`)
    return [
      WINDOW.x + (box.x - pad) * ZOOM,
      WINDOW.y + BROWSER_CHROME + (box.y - pad - this.s.scroll) * ZOOM,
      (box.width + pad * 2) * ZOOM,
      (box.height + pad * 2) * ZOOM,
    ]
  }

  /** Stage rectangle of the dev toolbar in the current shot. */
  toolbarRect(pad = 0) {
    const tb = this.shots[this.s.shot].toolbar
    const inset = 24 // the transparent margin captured around the toolbar
    return [
      WINDOW.x + (tb.x + inset - pad) * ZOOM,
      WINDOW.y + BROWSER_CHROME + (tb.y + inset - pad) * ZOOM,
      (tb.width - inset * 2 + pad * 2) * ZOOM,
      (tb.height - inset * 2 + pad * 2) * ZOOM,
    ]
  }

  moveTo(point, dur = 0.7) {
    const from = this.s.cursor ?? [point[0] + 220, point[1] + 160]
    if (!this.s.cursor) this.tracks.cursorVis.push({ t: this.t, visible: true })
    this.tracks.cursor.push({ t0: this.t, t1: this.t + dur, from, to: point })
    this.s.cursor = point
    return this.wait(dur)
  }

  click() {
    this.tracks.clicks.push({ t: this.t })
    return this.wait(0.25)
  }

  hideCursor() {
    if (this.s.cursor) this.tracks.cursorVis.push({ t: this.t, visible: false })
    this.s.cursor = null
    return this
  }

  /**
   * Rings a stage rectangle from now without moving the clock. It stays for
   * `dur` seconds, or until the returned end() is called.
   */
  callout(rect, { label, dur = 3600 } = {}) {
    const span = { t0: this.t, t1: this.t + dur, rect, label }
    this.tracks.callouts.push(span)
    return { end: () => (span.t1 = this.t) }
  }

  // ── Output ────────────────────────────────────────────────────────

  timeline() {
    const shots = {}
    for (const [name, shot] of Object.entries(this.shots)) {
      shots[name] = {
        src: `${this.shotsBase}/${shot.file}`,
        height: shot.height,
        title: shot.title,
        favicon: shot.favicon,
        toolbar: shot.toolbar && { ...shot.toolbar, src: `${this.shotsBase}/${shot.toolbar.file}` },
      }
    }
    return { duration: this.t, ...this.tracks, shots }
  }
}
