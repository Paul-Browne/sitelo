import { a, h2, h3, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, pageCodeTabs } from '../lib/code.js'
import { examplesLayout } from '../lib/layout.js'

const structureSnippet = `my-site/
  sitelo.config.js
  server.js              # Node host: static dist + islands
  netlify.toml           # Netlify rewrite → function
  vercel.json            # Vercel rewrite → api route
  package.json
  netlify/functions/
    islands.mjs          # Netlify islands handler
  api/islands/
    [...path].js         # Vercel islands handler
  src/
    index.ht.js          # page with an island placeholder
    js/
      islands.js         # client loader (bundled into dist/)
    islands/
      time.js            # server-only fragment module
    css/
      styles.css`

const configSnippet = `export default {
  site: 'https://example.com',
}`

const islandSnippet = `export default function time({ props, request }) {
  const label = typeof props?.label === 'string' ? props.label : 'Server time'
  const now = new Date().toISOString()
  const ua = request?.headers?.get?.('user-agent') ?? 'unknown'

  return \`
    <p><strong>\${label}:</strong> <time datetime="\${now}">\${now}</time></p>
    <p class="muted">Rendered on request for <code>\${escapeHtml(ua.slice(0, 48))}</code></p>
  \`
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}`

const pageTemplate = `import { island } from 'sitelo/islands'

export default () => \`
  <html lang="en">
    <head>
      <title>Server islands demo</title>
      <link rel="stylesheet" href="/css/styles.css">
    </head>
    <body>
      <h1>Static page, live island</h1>
      <p>This HTML was built once. The box below is filled at request time.</p>
      \${island(
        'time',
        { label: 'Right now' },
        '<p>Loading server time…</p>',
      )}
      <script type="module" src="/js/islands.js"></script>
    </body>
  </html>
\``

const pageHt = `import { html, head, title, link, body, h1, p, script } from 'javascript-to-html'
import { island } from 'sitelo/islands'

export default () =>
  html({ lang: 'en' },
    head(
      title('Server islands demo'),
      link({ rel: 'stylesheet', href: '/styles.css' }),
    ),
    body(
      h1('Static page, live island'),
      p('This HTML was built once. The box below is filled at request time.'),
      island(
        'time',
        { label: 'Right now' },
        '<p>Loading server time…</p>',
      ),
      script({ type: 'module', src: '/islands.js' }),
    ),
  )`

const pageJsx = `import { island } from 'sitelo/islands'

export default function Home() {
  return (
    <html lang="en">
      <head>
        <title>Server islands demo</title>
        <link rel="stylesheet" href="/css/styles.css" />
      </head>
      <body>
        <h1>Static page, live island</h1>
        <p>This HTML was built once. The box below is filled at request time.</p>
        {island(
          'time',
          { label: 'Right now' },
          '<p>Loading server time…</p>',
        )}
        <script type="module" src="/js/islands.js" />
      </body>
    </html>
  )
}`

const loaderSnippet = `import { mountIslands } from 'sitelo/islands/client'

mountIslands()`

const stylesSnippet = `body {
  font-family: system-ui, sans-serif;
  max-width: 36rem;
  margin: 2rem auto;
  padding: 0 1rem;
  line-height: 1.5;
}

[data-sitelo-island] {
  margin: 1.5rem 0;
  padding: 1rem 1.25rem;
  border: 1px solid #ccc;
}

[data-sitelo-island-state='loading'] {
  opacity: 0.7;
}

.muted {
  color: #666;
  font-size: 0.9rem;
}`

const serverSnippet = `import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createIslandsFromDirectory, createIslandsNodeHandler } from 'sitelo/islands/server'

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
  const relative = clean === '/' ? 'index.html' : clean.replace(/^\\/+/, '')
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
  console.log(\`Listening on http://localhost:\${port}\`)
})`

export default () =>
  examplesLayout({
    title: 'Server islands',
    description:
      'Ship a static sitelo site and mount a Node host that renders islands at request time.',
    activeHref: '/examples/islands',
    children: [
      p(
        'sitelo builds static HTML. Server islands fill in the bits that must be fresh — a clock, comments, stock, anything that needs the request. This recipe builds a page with a time island, then runs a small Node server that serves ',
        code('dist/'),
        ' and ',
        code('/_sitelo/islands'),
        '.',
      ),
      p(
        'A copy of this project lives in the sitelo repo under ',
        code('examples/islands/'),
        '.',
      ),
      h2('What you get'),
      ul(
        { class: 'docs-list' },
        li('A static home page with an island placeholder and fallback HTML'),
        li(
          'A server-only island module under ',
          code('src/islands/'),
          ' that never ships to the browser',
        ),
        li(
          'A client loader that swaps in the fragment from ',
          code('/_sitelo/islands/<name>'),
        ),
        li(
          'A production-shaped ',
          code('server.js'),
          ' — static files + ',
          code('createIslandsNodeHandler'),
        ),
      ),
      h2('Project layout'),
      codeBlock('project', structureSnippet, 'bash'),
      codeBlock('sitelo.config.js', configSnippet, 'javascript'),
      h2('1. Island module'),
      p(
        'Plain ',
        code('.js'),
        ' (not ',
        code('.ht.js'),
        '). Receives ',
        code('{ name, props, request }'),
        ' and returns an HTML string. This one uses the request time and user-agent so you can see it’s rendered per request.',
      ),
      codeBlock('src/islands/time.js', islandSnippet, 'javascript'),
      h2('2. Place the island on a page'),
      p(
        code('island()'),
        ' embeds props in the placeholder. The build ships the fallback; the loader replaces it when the endpoint responds.',
      ),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: pageTemplate,
        ht: pageHt,
        jsx: pageJsx,
      }),
      h2('3. Client loader'),
      codeBlock('src/js/islands.js', loaderSnippet, 'javascript'),
      codeBlock('src/css/styles.css', stylesSnippet, 'css'),
      h2('4. Node host'),
      p(
        'After ',
        code('sitelo build'),
        ', this process serves ',
        code('dist/'),
        ' and renders islands with ',
        code('createIslandsNodeHandler'),
        ' from ',
        code('sitelo/islands/server'),
        '. Island modules stay out of ',
        code('dist/'),
        ' — the host imports them from ',
        code('src/'),
        '.',
      ),
      codeBlock('server.js', serverSnippet, 'javascript'),
      h2('5. Build and run'),
      codeBlock(
        'shell',
        `npm install
sitelo build
node server.js`,
        'bash',
      ),
      p(
        'Open ',
        code('http://localhost:3000'),
        '. You should see the fallback briefly, then the server time. Hit refresh — the timestamp changes. In ',
        code('sitelo'),
        ' (dev) and ',
        code('sitelo preview'),
        ' you don’t need ',
        code('server.js'),
        ': the CLI already serves ',
        code('/_sitelo/islands'),
        '.',
      ),
      h2('Deploy'),
      p('This example ships host stubs next to the Node server:'),
      ul(
        { class: 'docs-list' },
        li(
          code('Node'),
          ' — ',
          code('npm run build && npm start'),
          ' (set ',
          code('PORT'),
          ' on the platform). Uses ',
          code('createIslandsFromDirectory'),
          '.',
        ),
        li(
          code('Netlify'),
          ' — ',
          code('netlify.toml'),
          ' rewrites ',
          code('/_sitelo/islands/*'),
          ' to ',
          code('netlify/functions/islands.mjs'),
          '.',
        ),
        li(
          code('Vercel'),
          ' — ',
          code('vercel.json'),
          ' rewrites to ',
          code('api/islands/[...path].js'),
          '.',
        ),
        li(
          'Static-only hosts (GitHub Pages, plain S3) — placeholders keep their fallback until you add a function.',
        ),
      ),
      p(
        'For serverless or edge elsewhere, use ',
        code('createIslandsHandler'),
        ' (web ',
        code('Request'),
        ' → ',
        code('Response'),
        ') — see the ',
        a({ href: '/docs/islands' }, 'Server islands docs'),
        '. Point ',
        code("mountIslands({ endpoint })"),
        ' at that function’s URL if it isn’t same-origin.',
      ),
      h2('Notes'),
      h3('Static hosts alone'),
      p(
        'GitHub Pages, plain S3, and similar hosts have no server process. Without an islands endpoint the fallback HTML simply stays — pages still work, just without the live fragment.',
      ),
      h3('Keep props small'),
      p(
        'Props travel in the HTML attribute and the request query string. Don’t put secrets or large payloads there — fetch those inside the island module on the server.',
      ),
      p(
        a({ href: '/docs/islands' }, 'Server islands docs'),
        ' · ',
        a({ href: '/examples/basic' }, 'Basic site / deploy'),
        ' · ',
        a({ href: '/examples' }, 'All examples'),
      ),
    ],
  })
