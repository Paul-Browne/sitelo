import Prism from 'prismjs'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-bash'

Prism.highlightAll()

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
