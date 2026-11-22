import type { Enhancer } from 'sitelo/enhance/client'

const clock: Enhancer = (element) => {
  element.textContent = 'clock-module-body ' + new Date().toLocaleTimeString()
}

export default clock
