import assert from 'node:assert/strict'
import path from 'node:path'
import { test } from 'node:test'
import {
  matchesGlob,
  normalizePagefindOptions,
  pagefindUrl,
} from '../src/pagefind.js'

test('normalizePagefindOptions: falsey → null', () => {
  assert.equal(normalizePagefindOptions(undefined), null)
  assert.equal(normalizePagefindOptions(false), null)
  assert.equal(normalizePagefindOptions(null), null)
})

test('normalizePagefindOptions: true → defaults with syncPublic', () => {
  assert.deepEqual(normalizePagefindOptions(true), { syncPublic: true })
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
