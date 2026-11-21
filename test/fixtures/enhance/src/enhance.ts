import { mountEnhancements } from 'sitelo/enhance/client'

mountEnhancements({
  counter: () => import('./client/counter.ts'),
  // Registered but on no page: still its own chunk, never fetched.
  clock: () => import('./client/clock.ts'),
})
