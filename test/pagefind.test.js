import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { Writable } from 'node:stream'
import { test } from 'node:test'
import {
  matchesGlob,
  normalizePagefindOptions,
  pagefindUrl,
  servePagefind,
} from '../src/pagefind.js'

test('normalizePagefindOptions: falsey → null', () => {
  assert.equal(normalizePagefindOptions(undefined), null)
  assert.equal(normalizePagefindOptions(false), null)
  assert.equal(normalizePagefindOptions(null), null)
})

test('normalizePagefindOptions: true → nothing copied into public/', () => {
  // Every build used to replace public/pagefind/ in the site's source.
  assert.deepEqual(normalizePagefindOptions(true), { syncPublic: false })
  assert.equal(normalizePagefindOptions({}).syncPublic, false)
  assert.equal(normalizePagefindOptions({ syncPublic: true }).syncPublic, true, 'still there when asked for')
  assert.throws(() => normalizePagefindOptions({ syncPublic: 'yes' }), /"pagefind.syncPublic" must be a boolean/)
})

test('normalizePagefindOptions: object merges options', () => {
  assert.deepEqual(
    normalizePagefindOptions({
      syncPublic: false,
      glob: '**/*.html',
      forceLanguage: 'en',
    }),
    {
      syncPublic: false,
      glob: '**/*.html',
      rootSelector: undefined,
      excludeSelectors: undefined,
      forceLanguage: 'en',
      verbose: undefined,
      keepIndexUrl: undefined,
      includeCharacters: undefined,
    },
  )
})

test('normalizePagefindOptions: rejects invalid values', () => {
  assert.throws(() => normalizePagefindOptions('yes'), /must be true or an object/)
  assert.throws(() => normalizePagefindOptions([]), /must be true or an object/)
})

test('pagefindUrl: index files keep the directory form', () => {
  assert.equal(pagefindUrl('index.html'), '/')
  assert.equal(pagefindUrl('docs/index.html'), '/docs/')
  assert.equal(pagefindUrl('de/docs/index.html'), '/de/docs/')
})

test('pagefindUrl: flat files drop the extension', () => {
  assert.equal(pagefindUrl('docs.html'), '/docs')
  assert.equal(pagefindUrl('docs/routing.html'), '/docs/routing')
  assert.equal(pagefindUrl('404.html'), '/404')
})

test('pagefindUrl: keepIndexUrl leaves index.html in place', () => {
  assert.equal(pagefindUrl('index.html', { keepIndexUrl: true }), '/index.html')
  assert.equal(
    pagefindUrl('docs/index.html', { keepIndexUrl: true }),
    '/docs/index.html',
  )
  // Only index files are affected; a flat page is still linked without one.
  assert.equal(pagefindUrl('docs.html', { keepIndexUrl: true }), '/docs')
})

test('pagefindUrl: normalizes Windows separators', () => {
  assert.equal(pagefindUrl(['docs', 'routing.html'].join(path.sep)), '/docs/routing')
})

test('matchesGlob: ** spans zero or more directories', () => {
  assert.ok(matchesGlob('index.html', '**/*.html'))
  assert.ok(matchesGlob('docs/routing.html', '**/*.html'))
  assert.ok(matchesGlob('de/docs/routing.html', '**/*.{html}'))
  assert.ok(!matchesGlob('docs/routing.htm', '**/*.html'))
})

test('matchesGlob: * and ? stop at a separator', () => {
  assert.ok(matchesGlob('docs.html', '*.html'))
  assert.ok(!matchesGlob('docs/routing.html', '*.html'))
  assert.ok(matchesGlob('de/index.html', '??/index.html'))
  assert.ok(!matchesGlob('de/docs/index.html', '??/index.html'))
})

test('matchesGlob: braces alternate, commas outside them are literal', () => {
  assert.ok(matchesGlob('docs/routing.html', '{docs,examples}/*.html'))
  assert.ok(matchesGlob('examples/blog.html', '{docs,examples}/*.html'))
  assert.ok(!matchesGlob('about.html', '{docs,examples}/*.html'))
  assert.ok(matchesGlob('a,b.html', 'a,b.html'))
})

test('matchesGlob: dots are literal, not any-character', () => {
  assert.ok(!matchesGlob('docsXhtml', '*.html'))
})

/** A built index on disk, and a way to ask `servePagefind` for a URL. */
function pagefindServer(t, options = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'sitelo-pagefind-'))
  t.after(() => fs.rmSync(root, { recursive: true, force: true }))

  const dir = path.join(root, 'dist', 'pagefind')
  fs.mkdirSync(path.join(dir, 'fragment'), { recursive: true })
  fs.writeFileSync(path.join(dir, 'pagefind-ui.js'), 'export {}')
  fs.writeFileSync(path.join(dir, 'pagefind-entry.json'), '{}')
  fs.writeFileSync(path.join(dir, 'wasm.en.pagefind'), 'binary')
  fs.writeFileSync(path.join(dir, 'fragment', 'en_1.pf_fragment'), 'binary')
  fs.writeFileSync(path.join(root, 'secret.txt'), 'not yours')

  const warnings = []
  const middleware = servePagefind({ dir, warn: (message) => warnings.push(message), ...options })

  const request = (url, method = 'GET') =>
    new Promise((resolve) => {
      const chunks = []
      const res = new Writable({
        write(chunk, encoding, done) {
          chunks.push(chunk)
          done()
        },
      })
      res.headers = {}
      res.setHeader = (name, value) => {
        res.headers[name.toLowerCase()] = value
      }
      res.on('finish', () => resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks).toString() }))
      middleware({ url, method }, res, () => resolve({ passed: true }))
    })

  return { root, dir, request, warnings }
}

test('servePagefind: answers /pagefind/ from the build, typed for the browser', async (t) => {
  const { request } = pagefindServer(t)

  const script = await request('/pagefind/pagefind-ui.js?v=1')
  assert.equal(script.status, 200)
  assert.equal(script.body, 'export {}')
  assert.equal(script.headers['content-type'], 'text/javascript; charset=utf-8')
  assert.equal(script.headers['cache-control'], 'no-cache')

  assert.equal((await request('/pagefind/pagefind-entry.json')).headers['content-type'], 'application/json; charset=utf-8')
  assert.equal((await request('/pagefind/fragment/en_1.pf_fragment')).headers['content-type'], 'application/octet-stream')
  assert.equal((await request('/pagefind/pagefind-ui.js', 'HEAD')).body, '', 'HEAD has headers and no body')
})

test('servePagefind: passes on everything that is not a file in the bundle', async (t) => {
  const { request } = pagefindServer(t)

  for (const url of [
    '/other/pagefind-ui.js',
    '/pagefind/missing.js',
    '/pagefind/fragment',
    '/pagefind/../secret.txt',
    '/pagefind/..%2F..%2Fsecret.txt',
    '/pagefind/%E0',
  ]) {
    assert.deepEqual(await request(url), { passed: true }, url)
  }

  assert.deepEqual(await request('/pagefind/pagefind-ui.js', 'POST'), { passed: true })
})

test('servePagefind: serves under a path base, and says when there is no build yet', async (t) => {
  const based = pagefindServer(t, { base: '/repo/' })
  assert.equal((await based.request('/repo/pagefind/pagefind-ui.js')).status, 200)
  assert.deepEqual(await based.request('/pagefind/pagefind-ui.js'), { passed: true }, 'outside the base is not the site')

  const empty = pagefindServer(t)
  fs.rmSync(empty.dir, { recursive: true })
  await empty.request('/pagefind/pagefind-ui.js')
  await empty.request('/pagefind/pagefind.js')
  assert.equal(empty.warnings.length, 1, 'once, not once per request')
  assert.match(empty.warnings[0], /run `sitelo build` once/)
})
