# Netlify Functions stub for sitelo islands.
#
# netlify.toml rewrites:
#   /_sitelo/islands/*  →  /.netlify/functions/islands/:splat
#
# The function may see either path; we normalize to /_sitelo/islands/<name>
# so createIslandsHandler matches the client’s default endpoint.

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
    /\/(?:\.netlify\/functions\/islands|_sitelo\/islands)\/([^/]+)\/?$/,
  )
  if (!match) return request

  url.pathname = `/_sitelo/islands/${match[1]}`
  return new Request(url, request)
}

export default async (request) => {
  const response = await handleIslands(normalizeIslandRequest(request))
  return response ?? new Response('Not found', { status: 404 })
}
