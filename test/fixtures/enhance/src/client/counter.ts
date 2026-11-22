import type { Enhancer } from 'sitelo/enhance/client'

// The start value is read from the markup, which already says it.
const counter: Enhancer = (element) => {
  const output = element.querySelector('output')!
  let count = Number(output.value)

  element.querySelector('button')!.addEventListener('click', () => {
    count += 1
    output.value = String(count)
    element.dataset.marker = 'counter-module-body'
  })
}

export default counter
