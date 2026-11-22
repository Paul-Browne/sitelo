import type { Enhancer } from 'sitelo/enhance/client'

const clock: Enhancer<{ format: 'short' | 'medium' }> = (element, { format }) => {
  element.textContent =
    'clock-module-body ' + new Date().toLocaleTimeString([], { timeStyle: format })
}

export default clock
