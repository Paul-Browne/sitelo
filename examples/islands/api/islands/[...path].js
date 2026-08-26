/**
 * Vercel serverless stub for sitelo islands.
 *
 * vercel.json rewrites /_sitelo/islands/:path* → /api/islands/:path*
 * so the browser keeps mountIslands() defaults while this function sees
 * /api/islands/<name>. We accept either path.
 */
import { createIslandsHandler } from 'sitelo/islands/server'

const handleIslands = createIslandsHandler({
  endpoint: '/_sitelo/islands',
  islands: {
    time: () => import('../../src/islands/time.js'),
  },
})

function normalizeIslandRequest(request) {
  const url = new URL(request.url)
  const match = url.pathname.match(
    /\/(?:api\/islands|_sitelo\/islands)\/([^/]+)\/?$/,
  )
  if (!match) return request

  url.pathname = `/_sitelo/islands/${match[1]}`
  return new Request(url, request)
}

export default async function handler(request) {
  const response = await handleIslands(normalizeIslandRequest(request))
  return response ?? new Response('Not found', { status: 404 })
}
