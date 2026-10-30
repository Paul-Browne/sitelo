import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { test } from 'node:test'

import { preview } from 'vite'

import { resolveStaticFile, staticHostPlugin } from '../src/static-host.js'

test('resolveStaticFile: resolves files, directory indexes and misses', (t) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sitelo-static-'))
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }))

  fs.mkdirSync(path.join(dir, 'docs'), { recursive: true })
  fs.writeFileSync(path.join(dir, 'index.html'), 'home')
  fs.writeFileSync(path.join(dir, 'docs.html'), 'docs')
  fs.writeFileSync(path.join(dir, 'docs', 'index.html'), 'docs index')
  fs.writeFileSync(path.join(dir, 'a b.html'), 'spaced')

  assert.equal(resolveStaticFile(dir, '/index.html'), path.join(dir, 'index.html'))
  assert.equal(resolveStaticFile(dir, '/docs.html?v=1'), path.join(dir, 'docs.html'))
  assert.equal(resolveStaticFile(dir, '/docs/'), path.join(dir, 'docs', 'index.html'))
  assert.equal(resolveStaticFile(dir, '/'), path.join(dir, 'index.html'))
  assert.equal(resolveStaticFile(dir, '/a%20b.html'), path.join(dir, 'a b.html'))

  // Misses, including a directory and anything climbing out of the build.
  assert.equal(resolveStaticFile(dir, '/robots.txt'), null)
  assert.equal(resolveStaticFile(dir, '/docs'), null)
  assert.equal(resolveStaticFile(dir, '/../secret.txt'), null)
  assert.equal(resolveStaticFile(dir, '/%2e%2e/secret.txt'), null)
  assert.equal(resolveStaticFile(dir, '/%zz'), null)
})

/**
 * A build written by hand, in both shapes sitelo emits: `about/index.html`
 * (`cleanUrls`, the default) and a flat `docs.html` (`cleanUrls: false`).
 *
 * @param {import('node:test').TestContext} t
 * @param {{ notFoundPage?: boolean }} [options]
 */
function writeSite(t, { notFoundPage = true } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'sitelo-static-host-'))
  t.after(() => fs.rmSync(root, { recursive: true, force: true }))

  const page = (file, title) => {
    const target = path.join(root, 'dist', file)
    fs.mkdirSync(path.dirname(target), { recursive: true })
    fs.writeFileSync(target, `<!doctype html><title>${title}</title>`)
  }

  page('index.html', 'Home')
  page('about/index.html', 'About')
  page('docs.html', 'Docs')
  if (notFoundPage) page('404.html', 'Not found')

  return root
}

/**
 * Nothing but the plugin: no `appType`, so this also checks that the
 * plugin turns Vite's SPA fallback off by itself.
 *
 * @param {import('node:test').TestContext} t
 * @param {string} root
 * @param {import('vite').InlineConfig} [config]
 */
async function startPreview(t, root, config = {}) {
  const server = await preview({
    root,
    configFile: false,
    logLevel: 'silent',
    preview: { port: 0, open: false },
    plugins: [staticHostPlugin()],
    ...config,
  })

  t.after(() => server.close())

  const local = server.resolvedUrls?.local[0]
  assert.ok(local, 'the preview server is listening')
  // Without the base: every path below is written out in full.
  const { origin } = new URL(local)

  /** @param {string} pathname */
  return async (pathname) => {
    // Concatenated rather than resolved: `new URL('//about', origin)` is
    // another host.
    const response = await fetch(`${origin}${pathname}`, {
      redirect: 'manual',
    })
    const body = await response.text()

    return {
      status: response.status,
      location: response.headers.get('location'),
      type: response.headers.get('content-type'),
      title: body.match(/<title>([^<]*)/)?.[1],
      body,
    }
  }
}

/**
 * Vite's preview server is an SPA server by default: it answers every
 * unmatched path with `index.html` and a 200. A static host does not, and
 * Lighthouse notices — it reads that HTML as the site's robots.txt and
 * marks it malformed, costing every audited site the same SEO point.
 */
test('a miss is the build’s 404 page with a 404', async (t) => {
  const root = writeSite(t)
  const get = await startPreview(t, root)

  for (const pathname of ['/nope', '/robots.txt', '/about/nope']) {
    const missing = await get(pathname)
    assert.equal(missing.status, 404, pathname)
    assert.equal(missing.title, 'Not found', pathname)
    assert.match(missing.type ?? '', /^text\/html/)
  }

  // Read per miss: a rebuild under a running preview shows its own page.
  fs.writeFileSync(path.join(root, 'dist', '404.html'), '<!doctype html><title>Rebuilt</title>')
  assert.equal((await get('/nope')).title, 'Rebuilt')
})

test('without a 404.html a miss is still a 404', async (t) => {
  const get = await startPreview(t, writeSite(t, { notFoundPage: false }))

  const missing = await get('/nope')
  assert.equal(missing.status, 404)
  assert.equal(missing.body, 'Not found')
})

/**
 * With `cleanUrls`, `/about` is `about/index.html`. Netlify, Cloudflare
 * Pages and GitHub Pages redirect it to `/about/`; Vite on its own only
 * tries `about.html` and then falls back to the home page.
 */
test('a directory without its trailing slash is redirected to it', async (t) => {
  const get = await startPreview(t, writeSite(t))

  const about = await get('/about')
  assert.equal(about.status, 307)
  assert.equal(about.location, '/about/')

  assert.equal((await get('/about?tab=1')).location, '/about/?tab=1')
  assert.equal((await get('/about/')).title, 'About')
  assert.equal((await get('/about/index.html')).title, 'About')
  assert.equal((await get('/')).title, 'Home')

  // A doubled slash is the same path, not a protocol-relative URL to a
  // host named `about`.
  assert.equal((await get('//about')).location, '/about/')
})

test('a flat page still resolves without its extension', async (t) => {
  const get = await startPreview(t, writeSite(t))

  // `cleanUrls: false` writes `docs.html`; Vite's own fallback serves it.
  const docs = await get('/docs')
  assert.equal(docs.status, 200)
  assert.equal(docs.title, 'Docs')
  assert.equal((await get('/docs.html')).title, 'Docs')

  // No directory behind it, so no redirect either.
  assert.equal((await get('/docs/')).status, 404)
})

test('the redirect keeps the base', async (t) => {
  const get = await startPreview(t, writeSite(t), { base: '/sub/' })

  const about = await get('/sub/about')
  assert.equal(about.status, 307)
  assert.equal(about.location, '/sub/about/')
  assert.equal((await get('/sub/about/')).title, 'About')
  assert.equal((await get('/sub/nope')).status, 404)
})
