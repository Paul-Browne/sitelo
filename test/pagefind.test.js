import assert from 'node:assert/strict'
import { test } from 'node:test'
import { normalizePagefindOptions } from '../src/pagefind.js'

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
