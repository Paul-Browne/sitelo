import type { Enhancer } from 'sitelo/enhance/client'

const counter: Enhancer<{ start: number }> = (element, { start }) => {
  const output = element.querySelector('output')!
  let count = start

  element.querySelector('button')!.addEventListener('click', () => {
    count += 1
    output.value = String(count)
    element.dataset.marker = 'counter-module-body'
  })
}

export default counter
