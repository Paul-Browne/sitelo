import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createIslandsNodeHandler } from 'sitelo/islands/server'

const root = path.dirname(fileURLToPath(import.meta.url))
const dist = path.join(root, 'dist')
const port = Number(process.env.PORT) || 3000

const handleIslands = createIslandsNodeHandler({
  islands: {
    time: () => import('./src/islands/time.js'),
  },
})

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml',
  '.json': 'application/json',
}

function sendFile(res, filePath) {
  const ext = path.extname(filePath)
  res.statusCode = 200
  res.setHeader('Content-Type', MIME[ext] ?? 'application/octet-stream')
  fs.createReadStream(filePath).pipe(res)
}

function resolveStatic(urlPath) {
  const clean = decodeURIComponent(urlPath.split('?')[0])
  const relative = clean === '/' ? 'index.html' : clean.replace(/^\/+/, '')
  const candidate = path.normalize(path.join(dist, relative))

  if (!candidate.startsWith(dist + path.sep) && candidate !== dist) {
    return null
  }
  if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
    return candidate
  }

  const asIndex = path.join(candidate, 'index.html')
  if (fs.existsSync(asIndex) && fs.statSync(asIndex).isFile()) {
    return asIndex
  }

  return null
}

const server = http.createServer(async (req, res) => {
  await handleIslands(req, res, () => {
    const file = resolveStatic(req.url ?? '/')
    if (file) {
      sendFile(res, file)
      return
    }

    const notFound = path.join(dist, '404.html')
    res.statusCode = 404
    if (fs.existsSync(notFound)) {
      sendFile(res, notFound)
    } else {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8')
      res.end('Not found')
    }
  })
})

server.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`)
})
