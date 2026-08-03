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
