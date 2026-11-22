import { mountEnhancements } from 'sitelo/enhance/client'

mountEnhancements({
  counter: () => import('./client/counter.ts'),
  clock: () => import('./client/clock.ts'),
})
