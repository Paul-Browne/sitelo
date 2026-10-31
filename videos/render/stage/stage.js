// Draws one frame of an episode for any time t. render.js loads a timeline
// (tracks of keyframes and segments built by lib/director.js) and calls
// seek(t) once per frame. Everything on screen is a pure function of t, so
// frames can be rendered in any order and an unchanged frame is detected by
// its key rather than by comparing pixels.

import hljs from '../node_modules/@highlightjs/cdn-assets/es/core.min.js'
import bash from '../node_modules/@highlightjs/cdn-assets/es/languages/bash.min.js'
import css from '../node_modules/@highlightjs/cdn-assets/es/languages/css.min.js'
import javascript from '../node_modules/@highlightjs/cdn-assets/es/languages/javascript.min.js'
import json from '../node_modules/@highlightjs/cdn-assets/es/languages/json.min.js'
import xml from '../node_modules/@highlightjs/cdn-assets/es/languages/xml.min.js'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('css', css)
hljs.registerLanguage('json', json)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('bash', bash)

const $ = (selector) => document.querySelector(selector)
const LINE = 34
const ZOOM = 4 / 3
const IDE_FIXED = 40 + 44 // titlebar + tabs
const WINDOW_HEIGHT = 1008

let T = null
let charWidth = 12.6
let lastKey = ''

// ── Sampling ──────────────────────────────────────────────────────────

/** The last keyframe at or before t. */
const step = (track = [], t) => {
  let lo = 0
  let hi = track.length - 1
  let found = undefined
  while (lo <= hi) {
    const mid = (lo + hi) >> 1
    if (track[mid].t <= t) {
      found = track[mid]
      lo = mid + 1
    } else hi = mid - 1
  }
  return found
}

const ease = (p) => (p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2)
const lerp = (a, b, p) => (Array.isArray(a) ? a.map((v, i) => v + (b[i] - v) * p) : a + (b - a) * p)

/** Value of a track of {t0, t1, from, to} segments at t. */
const seg = (track = [], t, initial) => {
  let value = initial
  for (const s of track) {
    if (t < s.t0) break
    if (t >= s.t1) value = s.to
    else return lerp(s.from, s.to, s.linear ? (t - s.t0) / (s.t1 - s.t0) : ease((t - s.t0) / (s.t1 - s.t0)))
  }
  return value
}

/** The span covering t with a fade-in/out alpha, or null. */
const span = (track = [], t, fade = 0.3) => {
  for (const s of track) {
    if (t >= s.t0 && t < s.t1) {
      const alpha = Math.min(1, (t - s.t0) / fade, (s.t1 - t) / fade)
      return { ...s, alpha: round(alpha) }
    }
  }
  return null
}

const round = (n) => Math.round(n * 100) / 100
const blink = (t) => Math.floor(t / 0.53) % 2 === 0

const sample = (t) => {
  const browserIn = round(seg(T.browserIn, t, 0))
  const termHeight = Math.round(seg(T.termHeight, t, 0))
  const active = step(T.active, t)?.path ?? null
  const fileKey = active && step(T.files[active], t)
  const typing = fileKey ? t - fileKey.t < 0.5 : false
  const hl = step(T.highlight, t)
  const term = step(T.term, t) ?? { lines: [], input: '', prompt: true }
  const termKey = step(T.term, t)
  const browser = step(T.browser, t) ?? null
  const cursor = seg(T.cursor, t, null)
  const click = step(T.clicks, t)
  const clickAge = click ? t - click.t : 99
  return {
    browserIn,
    termHeight,
    tree: step(T.tree, t) ?? { items: [], open: [] },
    tabs: step(T.tabs, t)?.paths ?? [],
    active,
    file: fileKey ? { text: fileKey.text, caret: fileKey.caret, sel: fileKey.sel ?? null } : null,
    caretOn: browserIn < 0.5 && !!fileKey && (typing || blink(t)) && !fileKey.hideCaret,
    hl: hl && hl.path === active ? [hl.from, hl.to] : null,
    term: { lines: term.lines, input: term.input, prompt: term.prompt, tabs: term.tabs, tab: term.tab },
    termCaretOn: browserIn < 0.5 && term.prompt && (t - (termKey?.t ?? 0) < 0.5 || blink(t)),
    browser: browser && { shot: browser.shot, url: browser.url },
    loading: browser && t - browser.t < 0.45 ? round((t - browser.t) / 0.45) : null,
    scroll: Math.round(seg(T.scroll, t, 0)),
    cursor: cursor && step(T.cursorVis, t)?.visible ? cursor.map(Math.round) : null,
    click: clickAge < 0.45 ? round(clickAge / 0.45) : null,
    callout: span(T.callouts, t, 0.25),
    overlay: withReveal(span(T.overlays, t, 0.35), t),
  }
}

/** A slide whose rows appear one by one: how many are showing at t. */
const withReveal = (overlay, t) => {
  if (!overlay?.data?.reveal) return overlay
  const { reveal, ...data } = overlay.data
  return { ...overlay, data: { ...data, shown: reveal.filter((at) => at <= t).length } }
}

// ── Rendering ─────────────────────────────────────────────────────────

const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const languageOf = (path) =>
  ({ js: 'javascript', mjs: 'javascript', css: 'css', json: 'json', html: 'xml', svg: 'xml', sh: 'bash' })[
    path.split('.').pop()
  ] ?? 'plaintext'

const highlighted = new Map()
const highlight = (text, language) => {
  const key = `${language}\0${text}`
  if (!highlighted.has(key)) {
    highlighted.set(key, language === 'plaintext' ? escapeHtml(text) : hljs.highlight(text, { language }).value)
    if (highlighted.size > 400) highlighted.delete(highlighted.keys().next().value)
  }
  return highlighted.get(key)
}

const ansiToHtml = (text) => {
  let out = ''
  let state = {}
  const open = () => {
    const classes = []
    if (state.b) classes.push('a-b')
    if (state.d) classes.push('a-d')
    if (state.i) classes.push('a-i')
    if (state.u) classes.push('a-u')
    if (state.fg) classes.push(`a-${state.fg}`)
    if (state.bg) classes.push(`a-bg${state.bg}`)
    return classes.length ? `<span class="${classes.join(' ')}">` : '<span>'
  }
  out += open()
  for (const part of text.split(/(\x1b\[[0-9;]*m)/)) {
    const m = part.match(/^\x1b\[([0-9;]*)m$/)
    if (!m) {
      out += escapeHtml(part)
      continue
    }
    for (const code of (m[1] || '0').split(';').map(Number)) {
      if (code === 0) state = {}
      else if (code === 1) state.b = true
      else if (code === 2) state.d = true
      else if (code === 3) state.i = true
      else if (code === 4) state.u = true
      else if (code === 22) state.b = state.d = false
      else if (code === 23) state.i = false
      else if (code === 24) state.u = false
      else if ((code >= 30 && code <= 37) || (code >= 90 && code <= 97)) state.fg = code
      else if (code === 39) state.fg = null
      else if (code >= 41 && code <= 47) state.bg = code
      else if (code === 49) state.bg = null
    }
    out += `</span>${open()}`
  }
  return `${out}</span>`
}

export const PROMPT = '\x1b[36;1m~/weeknight-kitchen\x1b[0m \x1b[32;1m$\x1b[0m '

const ICONS = {
  js: ['JS', '#e5c07b'],
  json: ['{}', '#e5c07b'],
  css: ['#', '#61afef'],
  html: ['<>', '#e06c75'],
  jpg: ['▣', '#c678dd'],
  png: ['▣', '#c678dd'],
  svg: ['◆', '#d19a66'],
  md: ['M', '#61afef'],
  toml: ['⚙', '#abb2bf'],
  yml: ['⚙', '#abb2bf'],
}

const treeRows = ({ items, open }, active) => {
  const dirs = new Set()
  const files = new Set()
  for (const item of items) {
    const parts = item.replace(/\/$/, '').split('/')
    for (let i = 1; i < parts.length; i++) dirs.add(parts.slice(0, i).join('/'))
    if (item.endsWith('/')) dirs.add(parts.join('/'))
    else files.add(item)
  }
  const openSet = new Set(open)
  const rows = []
  const walk = (parent, depth) => {
    const children = (set) =>
      [...set].filter((p) => (p.includes('/') ? p.slice(0, p.lastIndexOf('/')) : '') === parent).sort()
    for (const dir of children(dirs)) {
      const isOpen = openSet.has(dir)
      rows.push({ depth, name: dir.split('/').pop(), dir: true, open: isOpen, dim: dir === 'node_modules' || dir === 'dist' })
      if (isOpen) walk(dir, depth + 1)
    }
    for (const file of children(files)) rows.push({ depth, name: file.split('/').pop(), path: file, active: file === active })
  }
  walk('', 0)
  return rows
    .map((row) => {
      const pad = `style="padding-left:${16 + row.depth * 18}px"`
      if (row.dir) {
        return `<div class="tree-row${row.dim ? ' dim' : ''}" ${pad}><span class="chev">${row.open ? '▾' : '▸'}</span>${escapeHtml(row.name)}</div>`
      }
      const [glyph, color] = ICONS[row.name.split('.').pop()] ?? ['·', '#abb2bf']
      return `<div class="tree-row${row.active ? ' active' : ''}" ${pad}><span class="chev"></span><span class="icon" style="color:${color}">${glyph}</span>${escapeHtml(row.name)}</div>`
    })
    .join('')
}

const lineCol = (text, index) => {
  const before = text.slice(0, index)
  const line = before.split('\n').length - 1
  return [line, index - (before.lastIndexOf('\n') + 1)]
}

const renderEditor = (s) => {
  const editorHeight = WINDOW_HEIGHT - IDE_FIXED - s.termHeight
  const names = s.tabs.map((p) => p.split('/').pop())
  $('.tabs').innerHTML = s.tabs
    .map((p, i) => {
      const [glyph, color] = ICONS[p.split('.').pop()] ?? ['·', '#abb2bf']
      // Two tabs with the same name get their folder alongside, as editors do.
      const dir = names.indexOf(names[i]) !== names.lastIndexOf(names[i]) ? p.split('/').slice(-2, -1)[0] : ''
      return `<span class="tab-item${p === s.active ? ' active' : ''}"><span class="icon" style="color:${color};font:700 11px var(--mono)">${glyph}</span>${escapeHtml(names[i])}${dir ? `<span class="tab-dir">${escapeHtml(dir)}</span>` : ''}</span>`
    })
    .join('')
  $('.tree-items').innerHTML = treeRows(s.tree, s.active)
  $('.editor-empty').style.display = s.file ? 'none' : 'grid'
  $('.scroller').style.display = s.file ? 'flex' : 'none'
  if (!s.file) return

  const { text, caret, sel } = s.file
  const lines = text.split('\n')
  const visible = Math.max(1, Math.floor((editorHeight - 12) / LINE))
  const [caretLine, caretCol] = lineCol(text, caret)
  let first
  if (s.hl) {
    const center = Math.floor((s.hl[0] + s.hl[1]) / 2)
    first = center - Math.floor(visible / 2)
  } else {
    first = caretLine - (visible - 3)
  }
  first = Math.max(0, Math.min(first, Math.max(0, lines.length - visible + 1)))

  $('.code').innerHTML = highlight(text, languageOf(s.active))
  $('.scroller').style.transform = `translateY(${-first * LINE}px)`
  $('.gutter').innerHTML = lines
    .map((_, i) => `<div${i === caretLine ? ' class="cur"' : ''}>${i + 1}</div>`)
    .join('')
  $('.caret').style.display = s.caretOn ? 'block' : 'none'
  $('.caret').style.transform = `translate(${caretCol * charWidth}px, ${caretLine * LINE}px)`

  let hl = `<div class="curline" style="top:${caretLine * LINE}px;height:${LINE}px"></div>`
  if (s.hl) {
    hl += `<div style="top:${s.hl[0] * LINE}px;height:${(s.hl[1] - s.hl[0] + 1) * LINE}px"></div>`
  }
  $('.hl-lines').innerHTML = hl

  let selection = ''
  if (sel && sel[1] > sel[0]) {
    const [l0, c0] = lineCol(text, sel[0])
    const [l1, c1] = lineCol(text, sel[1])
    for (let l = l0; l <= l1; l++) {
      const start = l === l0 ? c0 : 0
      const end = l === l1 ? c1 : lines[l].length + 1
      selection += `<div style="top:${l * LINE}px;height:${LINE}px;left:${start * charWidth}px;width:${Math.max(end - start, 0.5) * charWidth}px"></div>`
    }
  }
  $('.selection').innerHTML = selection
}

const termCache = new Map()
const renderTerminal = (s) => {
  $('.term-tabs').innerHTML = (s.term.tabs ?? [])
    .map((name) => `<span class="${name === s.term.tab ? 'on' : ''}">${escapeHtml(name)}</span>`)
    .join('')
  $('.panel').style.height = `${s.termHeight}px`
  $('.panel').style.display = s.termHeight > 0 ? 'flex' : 'none'
  const key = s.term.lines.join('\n')
  if (!termCache.has(key)) {
    termCache.clear()
    termCache.set(key, s.term.lines.map(ansiToHtml).join('\n'))
  }
  let html = termCache.get(key)
  if (s.term.prompt) {
    html += `${s.term.lines.length ? '\n' : ''}${ansiToHtml(PROMPT + s.term.input)}`
    html += `<span class="tcaret" style="opacity:${s.termCaretOn ? 1 : 0}"></span>`
  }
  const term = $('.term')
  term.innerHTML = html
  term.scrollTop = term.scrollHeight
}

const images = new Map()
const preload = (src) => {
  if (!images.has(src)) {
    const img = new Image()
    img.src = src
    images.set(src, img.decode().catch(() => {}))
  }
  return images.get(src)
}

const setSrc = async (img, src) => {
  if (!src) {
    img.removeAttribute('src')
    return
  }
  if (img.getAttribute('src') !== src) {
    img.setAttribute('src', src)
    await img.decode().catch(() => {})
  }
}

const renderBrowser = async (s) => {
  const el = $('#browser')
  el.style.display = s.browserIn > 0 ? 'flex' : 'none'
  el.style.opacity = Math.min(1, s.browserIn * 1.6)
  el.style.transform = `translateY(${(1 - s.browserIn) * 70}px) scale(${0.98 + 0.02 * s.browserIn})`
  if (!s.browser) return
  const shot = T.shots[s.browser.shot]
  await setSrc($('.page'), shot.src)
  $('.page-wrap').style.transform = `translateY(${-s.scroll * ZOOM}px)`
  const devbar = $('.devbar')
  if (shot.toolbar) {
    await setSrc(devbar, shot.toolbar.src)
    devbar.style.display = 'block'
    devbar.style.left = `${shot.toolbar.x * ZOOM}px`
    devbar.style.top = `${shot.toolbar.y * ZOOM}px`
    devbar.style.width = `${shot.toolbar.width * ZOOM}px`
  } else devbar.style.display = 'none'
  $('.tab-title').textContent = shot.title || s.browser.url
  const favicon = $('.favicon')
  if (shot.favicon) {
    await setSrc(favicon, shot.favicon)
    favicon.style.visibility = 'visible'
  } else favicon.style.visibility = 'hidden'
  const [host, ...rest] = s.browser.url.split('/')
  $('.url').innerHTML = `${escapeHtml(host)}<span class="dim">${rest.length && rest.join('/') ? '/' + escapeHtml(rest.join('/')) : ''}</span>`
  $('.loading').style.width = s.loading === null ? '0' : `${s.loading * 100}%`
  $('.loading').style.opacity = s.loading === null ? 0 : 1 - Math.max(0, s.loading - 0.8) * 5
}

const renderPointer = (s) => {
  const cursor = $('.cursor')
  cursor.style.display = s.cursor ? 'block' : 'none'
  if (s.cursor) {
    cursor.style.left = `${s.cursor[0] - 4}px`
    cursor.style.top = `${s.cursor[1] - 2}px`
  }
  const ring = $('.click-ring')
  ring.style.display = s.click !== null && s.cursor ? 'block' : 'none'
  if (s.click !== null && s.cursor) {
    ring.style.left = `${s.cursor[0]}px`
    ring.style.top = `${s.cursor[1]}px`
    ring.style.transform = `scale(${0.4 + s.click})`
    ring.style.opacity = 1 - s.click
  }
  const callout = $('.callout')
  callout.style.display = s.callout ? 'block' : 'none'
  if (s.callout) {
    const [x, y, w, h] = s.callout.rect
    Object.assign(callout.style, { left: `${x}px`, top: `${y}px`, width: `${w}px`, height: `${h}px`, opacity: s.callout.alpha })
    $('.callout-label').textContent = s.callout.label ?? ''
  }
}

const renderOverlay = (s) => {
  for (const el of document.querySelectorAll('.overlay')) el.style.display = 'none'
  const o = s.overlay
  if (!o) return
  if (o.kind === 'chapter') {
    const el = $('.chapter')
    el.style.display = 'grid'
    el.style.opacity = o.alpha
    $('.chapter-num').textContent = o.data.num
    $('.chapter-title').textContent = o.data.title
    $('.chapter-card').style.transform = `scale(${0.94 + 0.06 * o.alpha})`
  } else if (o.kind === 'slide') {
    const el = $('.slide')
    el.style.display = 'grid'
    el.style.opacity = o.alpha
    $('.slide-title').textContent = o.data.title
    const [head, ...rows] = o.data.rows
    $('.slide-table').classList.toggle('prose', !!o.data.prose)
    $('.slide-table').innerHTML =
      `<tr>${head.map((h) => `<th>${escapeHtml(h)}</th>`).join('')}</tr>` +
      rows
        .map((row, i) => `<tr${o.data.shown !== undefined && i >= o.data.shown ? ' class="dim"' : ''}>${row.map((c) => `<td>${escapeHtml(c)}</td>`).join('')}</tr>`)
        .join('')
  } else {
    const el = $(o.kind === 'title' ? '.title-card' : '.end-card')
    el.style.display = 'flex'
    el.style.opacity = o.fadeIn === false ? 1 : o.alpha
    el.querySelector('.card-title').textContent = o.data.title
    el.querySelector('.card-sub').textContent = o.data.sub ?? ''
    if (o.kind === 'title') el.querySelector('.episode').textContent = o.data.episode
    else {
      el.querySelector('.next-label').textContent = o.data.label ?? 'Next time'
      el.querySelector('.card-link').textContent = o.data.link ?? ''
    }
  }
}

const render = async (s) => {
  renderEditor(s)
  renderTerminal(s)
  await renderBrowser(s)
  renderPointer(s)
  renderOverlay(s)
}

// ── API for render.js ─────────────────────────────────────────────────

window.loadTimeline = async (timeline) => {
  T = timeline
  await document.fonts.load(`21px 'JetBrains Mono'`)
  await document.fonts.load(`700 21px 'JetBrains Mono'`)
  for (const weight of [400, 500, 600, 800]) await document.fonts.load(`${weight} 20px Inter`)
  await document.fonts.ready
  const probe = document.createElement('span')
  probe.style.font = `21px 'JetBrains Mono'`
  probe.textContent = 'x'.repeat(100)
  document.body.append(probe)
  charWidth = probe.getBoundingClientRect().width / 100
  probe.remove()
  const sources = []
  for (const shot of Object.values(T.shots)) {
    sources.push(shot.src)
    if (shot.toolbar) sources.push(shot.toolbar.src)
    if (shot.favicon) sources.push(shot.favicon)
  }
  await Promise.all(sources.map(preload))
  return { charWidth }
}

window.seek = async (t) => {
  const s = sample(t)
  const key = JSON.stringify(s)
  if (key !== lastKey) {
    await render(s)
    lastKey = key
  }
  return key
}
