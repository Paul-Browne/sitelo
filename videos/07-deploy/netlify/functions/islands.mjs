import { createIslandsHandler } from 'sitelo/islands/server'

// The same island modules `sitelo` serves in dev and preview
const handleIslands = createIslandsHandler({
  islands: {
    'whats-cooking': () => import('../../src/islands/whats-cooking.js'),
    comments: () => import('../../src/islands/comments.js'),
  },
})

export default async (request) =>
  (await handleIslands(request)) ?? new Response('Not found', { status: 404 })

// Netlify routes this path straight to the function: no redirect needed
export const config = { path: '/_sitelo/islands/*' }
