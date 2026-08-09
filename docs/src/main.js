import abb from './lib/abb.js'
import Prism from 'prismjs'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-bash'

Prism.highlightAll()

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

abb({
  element: '#atmosphere',
  background: '#071410',
  colors: ['#1a9a5c', '#0a1c16', '#04100c', '#0a3d55', '#145c45', '#020805'],
  speed: reduceMotion ? 0 : 0.45,
  opacity: 0.9,
  saturate: 1.05,
  blur: 48,
  grain: {
    strength: 1.2,
    opacity: 0.28,
    blur: 0,
  },
})

const buttons = document.querySelectorAll('[data-copy]')

for (const button of buttons) {
  button.addEventListener('click', async () => {
    const value = button.getAttribute('data-copy') ?? ''
    try {
      await navigator.clipboard.writeText(value)
      const previous = button.textContent
      button.textContent = 'Copied'
      button.classList.add('is-copied')
      window.setTimeout(() => {
        button.textContent = previous
        button.classList.remove('is-copied')
      }, 1400)
    } catch {
      button.textContent = 'Failed'
      window.setTimeout(() => {
        button.textContent = 'Copy'
      }, 1400)
    }
  })
}

for (const button of document.querySelectorAll('.code-copy')) {
  button.addEventListener('click', async () => {
    const source = button
      .closest('.code-glow')
      ?.querySelector('.code code')?.textContent
    if (!source) return
    try {
      await navigator.clipboard.writeText(source)
      button.textContent = 'Copied'
      button.classList.add('is-copied')
      window.setTimeout(() => {
        button.textContent = 'Copy'
        button.classList.remove('is-copied')
      }, 1400)
    } catch {
      button.textContent = 'Failed'
      window.setTimeout(() => {
        button.textContent = 'Copy'
      }, 1400)
    }
  })
}

startHeroTypewriter()
initDocsSearch()

/**
 * Pagefind search — the index only exists in production builds
 * (`pagefind --site docs/dist` runs after `sitelo build`), so probe for it
 * and stay hidden in dev.
 */
async function initDocsSearch() {
  const mount = document.querySelector('#docs-search')
  if (!mount) return

  try {
    const probe = await fetch('/pagefind/pagefind-ui.js', { method: 'HEAD' })
    if (!probe.ok) return
  } catch {
    return
  }

  const style = document.createElement('link')
  style.rel = 'stylesheet'
  style.href = '/pagefind/pagefind-ui.css'
  document.head.appendChild(style)

  await new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = '/pagefind/pagefind-ui.js'
    script.onload = resolve
    script.onerror = reject
    document.body.appendChild(script)
  })

  new window.PagefindUI({
    element: '#docs-search',
    showSubResults: true,
    showImages: false,
  })

  const input = mount.querySelector('input')
  if (input) {
    input.setAttribute('spellcheck', 'false')
    input.setAttribute('autocorrect', 'off')
    input.setAttribute('autocomplete', 'off')
  }
}

function startHeroTypewriter() {
  const el = document.querySelector('.hero-typed')
  if (!el) return

  const phrases = (el.getAttribute('data-phrases') ?? '')
    .split('|')
    .map((p) => p.trim())
    .filter(Boolean)

  if (phrases.length < 2) return

  if (reduceMotion) {
    el.textContent = phrases[0]
    return
  }

  const typeMs = 75
  const deleteMs = 38
  const holdMs = 2500
  const gapMs = 320

  let index = 0
  el.textContent = phrases[0]
  el.classList.add('is-typing')

  const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms))

  async function deleteText() {
    while (el.textContent.length > 0) {
      el.textContent = el.textContent.slice(0, -1)
      await wait(deleteMs)
    }
  }

  async function typeText(text) {
    for (let i = 1; i <= text.length; i += 1) {
      el.textContent = text.slice(0, i)
      await wait(typeMs)
    }
  }

  async function loop() {
    while (true) {
      await wait(holdMs)
      await deleteText()
      await wait(gapMs)
      index = (index + 1) % phrases.length
      await typeText(phrases[index])
    }
  }

  loop()
}
