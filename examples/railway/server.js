/*
 * The production server: serves dist/ as static files and renders the
 * modules in src/islands/ at request time. Railway runs it with
 * `npm start` after `npm run build`, and sets PORT.
 */
import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  createIslandsFromDirectory,
  createIslandsNodeHandler,
} from 'sitelo/islands/server'

const root = path.dirname(fileURLToPath(import.meta.url))
const dist = path.join(root, 'dist')
const port = Number(process.env.PORT) || 3000

const handleIslands = createIslandsNodeHandler({
  islands: createIslandsFromDirectory(path.join(root, 'src/islands')),
})

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.wasm': 'application/wasm',
}

/*
 * HTML is revalidated on every visit so a deploy shows up at once. A
 * file with a content hash in its name (`ui-5dc16813.css`) never
 * changes, so it is cached for good; anything else for an hour.
 */
function cacheControl(filePath) {
  if (filePath.endsWith('.html')) return 'no-cache'
  if (/-[0-9a-f]{8,}\.\w+$/.test(filePath)) return 'public, max-age=31536000, immutable'

  return 'public, max-age=3600'
}

function sendFile(req, res, filePath, status = 200) {
  res.statusCode = status
  res.setHeader('Content-Type', MIME[path.extname(filePath)] ?? 'application/octet-stream')
  res.setHeader('Content-Length', fs.statSync(filePath).size)
  res.setHeader('Cache-Control', cacheControl(filePath))

  if (req.method === 'HEAD') {
    res.end()
    return
  }

  fs.createReadStream(filePath).pipe(res)
}

function isFile(filePath) {
  return fs.statSync(filePath, { throwIfNoEntry: false })?.isFile() ?? false
}

/** A URL path → a file under dist/, or null. Never escapes dist/. */
function resolveStatic(urlPath) {
  let clean

  try {
    clean = decodeURIComponent(urlPath.split('?')[0])
  } catch {
    return null
  }

  const candidate = path.normalize(path.join(dist, clean))

  if (candidate !== dist && !candidate.startsWith(dist + path.sep)) return null
  if (isFile(candidate)) return candidate

  const asIndex = path.join(candidate, 'index.html')

  return isFile(asIndex) ? asIndex : null
}

const server = http.createServer((req, res) => {
  handleIslands(req, res, () => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.statusCode = 405
      res.setHeader('Allow', 'GET, HEAD')
      res.end()
      return
    }

    const file = resolveStatic(req.url ?? '/')

    if (file) {
      sendFile(req, res, file)
      return
    }

    const notFound = path.join(dist, '404.html')

    if (isFile(notFound)) {
      sendFile(req, res, notFound, 404)
    } else {
      res.statusCode = 404
      res.setHeader('Content-Type', 'text/plain; charset=utf-8')
      res.end('Not found')
    }
  }).catch((error) => {
    console.error(error)
    if (!res.headersSent) res.statusCode = 500
    res.end()
  })
})

server.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`)
})

// Railway sends SIGTERM before replacing a deploy: finish what is in
// flight, then exit.
process.on('SIGTERM', () => {
  server.close(() => process.exit(0))
})
