import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { test } from 'node:test'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { promisify } from 'node:util'

import {
  clearDataCache,
  dataRoot,
  onDataRead,
  readJson,
  readJsonCollection,
  resolveDataPath,
} from '../src/data.js'
import { createFixture } from './helpers/fixture.js'

const execFileAsync = promisify(execFile)
const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const cliPath = path.join(rootDir, 'bin', 'sitelo.js')

/** A throwaway project root holding the JSON files a test needs. */
function createDataDir(t, files) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sitelo-data-'))

  for (const [name, contents] of Object.entries(files)) {
    const file = path.join(dir, name)
    fs.mkdirSync(path.dirname(file), { recursive: true })
    fs.writeFileSync(
      file,
      typeof contents === 'string' ? contents : JSON.stringify(contents),
      'utf8',
    )
  }

  const previousRoot = process.env.SITELO_ROOT
  process.env.SITELO_ROOT = dir
  clearDataCache()

  t.after(() => {
    if (previousRoot === undefined) delete process.env.SITELO_ROOT
    else process.env.SITELO_ROOT = previousRoot
    clearDataCache()
    fs.rmSync(dir, { recursive: true, force: true })
  })

  return dir
}

test('dataRoot: SITELO_ROOT wins over the working directory', (t) => {
  const dir = createDataDir(t, {})
  assert.equal(dataRoot(), dir)
})

test('resolveDataPath: relative, absolute, and file: URLs', (t) => {
  const dir = createDataDir(t, {})
  const absolute = path.join(dir, 'data', 'site.json')

  assert.equal(resolveDataPath('data/site.json'), absolute)
  assert.equal(resolveDataPath(absolute), absolute)
  assert.equal(resolveDataPath(pathToFileURL(absolute)), absolute)
  assert.equal(resolveDataPath(pathToFileURL(absolute).href), absolute)
  assert.equal(
    resolveDataPath('site.json', { root: path.join(dir, 'data') }),
    absolute,
  )
  assert.throws(() => resolveDataPath(''), /non-empty string or a file: URL/)
})

test('readJson: parses a file relative to the project root', async (t) => {
  createDataDir(t, { 'data/site.json': { title: 'Local JSON' } })

  assert.deepEqual(await readJson('data/site.json'), { title: 'Local JSON' })
})

test('readJson: missing file names the path and the root', async (t) => {
  const dir = createDataDir(t, {})

  await assert.rejects(readJson('data/site.json'), (error) => {
    assert.match(error.message, /No JSON data at data\/site\.json/)
    assert.ok(error.message.includes(dir))
    return true
  })
})

test('readJson: invalid JSON names the file', async (t) => {
  createDataDir(t, { 'data/site.json': '{ "title": ' })

  await assert.rejects(
    readJson('data/site.json'),
    /Invalid JSON in data\/site\.json/,
  )
})

test('readJsonCollection: a directory slugs entries by filename', async (t) => {
  createDataDir(t, {
    'data/posts/hello-world.json': { title: 'Hello', date: '2026-01-02' },
    'data/posts/second.json': { title: 'Second', date: '2026-02-03' },
    'data/posts/notes.txt': 'ignored',
  })

  assert.deepEqual(await readJsonCollection('data/posts'), [
    { slug: 'hello-world', title: 'Hello', date: '2026-01-02' },
    { slug: 'second', title: 'Second', date: '2026-02-03' },
  ])
})

test('readJsonCollection: a slug in the file wins over the filename', async (t) => {
  createDataDir(t, {
    'data/posts/hello-world.json': { slug: 'hello', title: 'Hello' },
  })

  assert.deepEqual(await readJsonCollection('data/posts'), [
    { slug: 'hello', title: 'Hello' },
  ])
})

test('readJsonCollection: recursive slugs include the subdirectory', async (t) => {
  createDataDir(t, {
    'data/docs/guide/intro.json': { title: 'Intro' },
    'data/docs/index.json': { title: 'Docs' },
  })

  assert.deepEqual(
    (await readJsonCollection('data/docs', { recursive: true })).map(
      (entry) => entry.slug,
    ),
    ['guide/intro', 'index'],
  )
  assert.deepEqual(
    (await readJsonCollection('data/docs')).map((entry) => entry.slug),
    ['index'],
  )
})

test('readJsonCollection: an array file uses slug, then id', async (t) => {
  createDataDir(t, {
    'data/posts.json': [
      { slug: 'hello', title: 'Hello' },
      { id: 7, title: 'Seven' },
      { title: 'Anonymous' },
    ],
  })

  assert.deepEqual(await readJsonCollection('data/posts.json'), [
    { slug: 'hello', title: 'Hello' },
    { id: 7, title: 'Seven', slug: '7' },
    { title: 'Anonymous' },
  ])
})

test('readJsonCollection: an object file is keyed by slug', async (t) => {
  createDataDir(t, {
    'data/posts.json': { hello: { title: 'Hello' }, second: { title: 'Second' } },
  })

  assert.deepEqual(await readJsonCollection('data/posts.json'), [
    { slug: 'hello', title: 'Hello' },
    { slug: 'second', title: 'Second' },
  ])
})

test('readJsonCollection: slug option picks a field or computes one', async (t) => {
  createDataDir(t, {
    'data/products.json': [
      { sku: 'A-1', name: 'Desk' },
      { sku: 'B-2', name: 'Chair' },
    ],
  })

  assert.deepEqual(
    (await readJsonCollection('data/products.json', { slug: 'sku' })).map(
      (entry) => entry.slug,
    ),
    ['A-1', 'B-2'],
  )
  assert.deepEqual(
    (
      await readJsonCollection('data/products.json', {
        slug: (entry) => entry.name.toLowerCase(),
      })
    ).map((entry) => entry.slug),
    ['desk', 'chair'],
  )
})

test('readJsonCollection: a missing slug field is an error', async (t) => {
  createDataDir(t, { 'data/products.json': [{ name: 'Desk' }] })

  await assert.rejects(
    readJsonCollection('data/products.json', { slug: 'sku' }),
    /has no slug — it has no "sku" field/,
  )
})

test('readJsonCollection: duplicate slugs name both entries', async (t) => {
  createDataDir(t, {
    'data/posts/hello.json': { title: 'Hello' },
    'data/posts/second.json': { slug: 'hello', title: 'Second' },
  })

  await assert.rejects(
    readJsonCollection('data/posts'),
    /Duplicate slug "hello" in data\/posts\/hello\.json and data\/posts\/second\.json/,
  )
})

test('readJsonCollection: sorts by field, descending, or a comparator', async (t) => {
  createDataDir(t, {
    'data/posts/a.json': { title: 'A', date: '2026-01-02', rank: 2 },
    'data/posts/b.json': { title: 'B', date: '2026-03-04', rank: 10 },
    'data/posts/c.json': { title: 'C', rank: 1 },
  })

  const slugs = (entries) => entries.map((entry) => entry.slug)

  assert.deepEqual(
    slugs(await readJsonCollection('data/posts', { sort: 'date' })),
    ['a', 'b', 'c'],
  )
  assert.deepEqual(
    slugs(await readJsonCollection('data/posts', { sort: '-date' })),
    ['b', 'a', 'c'],
  )
  assert.deepEqual(
    slugs(await readJsonCollection('data/posts', { sort: 'rank' })),
    ['c', 'a', 'b'],
  )
  assert.deepEqual(
    slugs(
      await readJsonCollection('data/posts', {
        sort: (a, b) => a.title.localeCompare(b.title),
      }),
    ),
    ['a', 'b', 'c'],
  )
})

test('readJsonCollection: rejects entries that are not objects', async (t) => {
  createDataDir(t, { 'data/posts.json': ['hello'] })

  await assert.rejects(
    readJsonCollection('data/posts.json'),
    /must be a JSON object — a collection entry cannot be a string/,
  )
})

test('readJsonCollection: rejects a file that is not a collection', async (t) => {
  createDataDir(t, { 'data/posts.json': 42 })

  await assert.rejects(
    readJsonCollection('data/posts.json'),
    /must contain an array of entries or an object keyed by slug/,
  )
})

test('readJsonCollection: each call gets its own array to sort', async (t) => {
  createDataDir(t, {
    'data/posts/a.json': { title: 'A' },
    'data/posts/b.json': { title: 'B' },
  })

  const first = await readJsonCollection('data/posts')
  first.reverse()

  assert.deepEqual(
    (await readJsonCollection('data/posts')).map((entry) => entry.slug),
    ['a', 'b'],
  )
})

test('readJsonCollection: an edit is picked up outside a production build', async (t) => {
  const dir = createDataDir(t, { 'data/posts/a.json': { title: 'A' } })

  assert.equal((await readJsonCollection('data/posts'))[0].title, 'A')

  fs.writeFileSync(
    path.join(dir, 'data', 'posts', 'a.json'),
    JSON.stringify({ title: 'Edited' }),
    'utf8',
  )

  assert.equal((await readJsonCollection('data/posts'))[0].title, 'Edited')

  fs.writeFileSync(
    path.join(dir, 'data', 'posts', 'b.json'),
    JSON.stringify({ title: 'Added' }),
    'utf8',
  )

  assert.deepEqual(
    (await readJsonCollection('data/posts')).map((entry) => entry.slug),
    ['a', 'b'],
  )
})

test('readJsonCollection: a production build keeps the memo', async (t) => {
  const dir = createDataDir(t, { 'data/posts/a.json': { title: 'A' } })
  const previousEnv = process.env.NODE_ENV
  process.env.NODE_ENV = 'production'
  t.after(() => {
    if (previousEnv === undefined) delete process.env.NODE_ENV
    else process.env.NODE_ENV = previousEnv
  })

  assert.equal((await readJsonCollection('data/posts'))[0].title, 'A')

  fs.writeFileSync(
    path.join(dir, 'data', 'posts', 'a.json'),
    JSON.stringify({ title: 'Edited' }),
    'utf8',
  )

  assert.equal((await readJsonCollection('data/posts'))[0].title, 'A')
  assert.equal(
    (await readJsonCollection('data/posts', { cache: 'none' }))[0].title,
    'Edited',
  )
})

test('readJsonCollection: rejects an unknown cache mode', async (t) => {
  createDataDir(t, { 'data/posts.json': [] })

  await assert.rejects(
    readJsonCollection('data/posts.json', { cache: 'forever' }),
    /Unknown JSON data cache mode "forever"/,
  )
})

test('onDataRead: reports every path read, cached or not', async (t) => {
  const dir = createDataDir(t, {
    'data/site.json': { title: 'Site' },
    'data/posts/a.json': { title: 'A' },
  })

  const seen = []
  const stop = onDataRead((target) => seen.push(target))
  t.after(stop)

  await readJson('data/site.json')
  await readJsonCollection('data/posts')
  await readJsonCollection('data/posts')

  assert.deepEqual(seen, [
    path.join(dir, 'data', 'site.json'),
    path.join(dir, 'data', 'posts'),
    path.join(dir, 'data', 'posts'),
  ])

  stop()
  await readJson('data/site.json')
  assert.equal(seen.length, 3)
})

test('sitelo build renders a site from local JSON', async (t) => {
  const fixtureDir = createFixture('json-data')
  const distDir = path.join(fixtureDir, 'dist')

  // Fixtures resolve `sitelo/data` the way a real project does.
  fs.mkdirSync(path.join(fixtureDir, 'node_modules'), { recursive: true })
  fs.symlinkSync(rootDir, path.join(fixtureDir, 'node_modules', 'sitelo'), 'dir')

  t.after(() => {
    fs.rmSync(distDir, { recursive: true, force: true })
    fs.rmSync(path.join(fixtureDir, '.sitelo'), {
      recursive: true,
      force: true,
    })
  })

  await execFileAsync(process.execPath, [cliPath, 'build'], {
    cwd: fixtureDir,
    env: process.env,
  })

  const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8')
  const postHtml = fs.readFileSync(
    path.join(distDir, 'blog', 'hello-world', 'index.html'),
    'utf8',
  )

  assert.match(indexHtml, /<title>JSON fixture site<\/title>/)
  // `sort: '-date'` puts the newer post first.
  assert.match(
    indexHtml,
    /Second post[\s\S]*Hello world/,
    'expected posts ordered newest first',
  )
  assert.match(postHtml, /<h1>Hello world<\/h1>/)
  assert.match(postHtml, /The first post\./)
  assert.ok(
    fs.existsSync(path.join(distDir, 'blog', 'second-post', 'index.html')),
    'expected a page per JSON file',
  )
})
