import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Local JSON files as a data source.
 *
 * `fetchWithCache` covers sites whose content lives behind an API. This is
 * the same job for content that lives in the repo: a `data/` directory of
 * JSON files, read from `data()` and `generateStaticParams()`.
 *
 * Reads are memoized per resolved path, because a 500-page build asks for
 * the same collection 500 times. In a production build the memo is kept
 * outright; anywhere else it is revalidated against file mtime and size, so
 * editing a JSON file and reloading the dev server shows the edit.
 */

/*
 * Pages load this module through Vite's SSR runner while the dev server
 * loads it through Node, so the two get separate module instances of the
 * same file. The state that has to be shared — the memo, and who is
 * watching reads — hangs off a well-known symbol instead of module scope.
 */
const STATE = (globalThis[Symbol.for('sitelo.data')] ??= {
  /** @type {Map<string, { fingerprint: string | null, value: any }>} */
  cache: new Map(),
  /** @type {Set<(path: string) => void>} */
  readListeners: new Set(),
  /** Identity for functions passed as `slug`/`sort`, so they key the cache. */
  functionIds: new WeakMap(),
  nextFunctionId: 0,
})

/**
 * Directory relative paths resolve from: the project root the CLI is
 * running against (`--root`), falling back to the working directory for a
 * plain `vite` invocation or a standalone script.
 */
export function dataRoot() {
  return process.env.SITELO_ROOT || process.cwd()
}

/**
 * Absolute path for a data source. Accepts a path relative to the project
 * root, an absolute path, or a `file:` URL — `new URL('../data/', import.meta.url)`
 * is the way to point at files relative to the page module itself.
 *
 * @param {string | URL} source
 * @param {{ root?: string }} [options]
 * @returns {string}
 */
export function resolveDataPath(source, options = {}) {
  if (source instanceof URL) return fileURLToPath(source)

  if (typeof source !== 'string' || source === '') {
    throw new Error(
      '[sitelo] A JSON data path must be a non-empty string or a file: URL.',
    )
  }

  if (source.startsWith('file:')) return fileURLToPath(source)
  if (path.isAbsolute(source)) return source

  return path.resolve(options.root ?? dataRoot(), source)
}

/**
 * Parsed contents of one JSON file.
 *
 * @param {string | URL} source
 * @param {{ root?: string, cache?: 'auto' | 'memory' | 'none' }} [options]
 * @returns {Promise<any>}
 */
export async function readJson(source, options = {}) {
  const file = resolveDataPath(source, options)
  const mode = effectiveCache(options.cache)
  const key = `json ${file}`

  notifyRead(file)

  if (mode !== 'none') {
    const cached = STATE.cache.get(key)

    if (cached) {
      if (mode === 'keep') return cached.value

      const current = await fingerprint([file])
      if (current !== null && current === cached.fingerprint) return cached.value
    }
  }

  const value = await parseJsonFile(file)

  if (mode !== 'none') {
    STATE.cache.set(key, { fingerprint: await fingerprint([file]), value })
  }

  return value
}

/**
 * A collection of entries from local JSON — the shape `generateStaticParams`
 * and a list page both want.
 *
 * `source` is either a directory of `.json` files (one file per entry, slug
 * taken from the filename), or a single `.json` file holding an array of
 * entries or an object keyed by slug.
 *
 * The returned array is fresh on every call, so sorting or reversing it is
 * safe; the entry objects themselves are shared between callers, so copy
 * one before mutating it.
 *
 * @param {string | URL} source
 * @param {{
 *   root?: string
 *   cache?: 'auto' | 'memory' | 'none'
 *   slug?: string | ((entry: any, index: number) => unknown)
 *   sort?: string | ((a: any, b: any) => number)
 *   recursive?: boolean
 * }} [options]
 * @returns {Promise<any[]>}
 */
export async function readJsonCollection(source, options = {}) {
  const target = resolveDataPath(source, options)
  const mode = effectiveCache(options.cache)
  const key = `collection ${target} ${collectionKey(options)}`

  notifyRead(target)

  const cached = mode === 'none' ? undefined : STATE.cache.get(key)
  if (cached && mode === 'keep') return cached.value.slice()

  const stats = await statPath(target)
  const files = stats.isDirectory()
    ? await collectJsonFiles(target, options.recursive === true)
    : [target]

  if (cached) {
    const current = await fingerprint(files)
    if (current !== null && current === cached.fingerprint) {
      return cached.value.slice()
    }
  }

  const pairs = stats.isDirectory()
    ? await entriesFromDirectory(target, files)
    : entriesFromFile(target, await parseJsonFile(target))

  const value = finalizeEntries(pairs, options)

  if (mode !== 'none') {
    STATE.cache.set(key, { fingerprint: await fingerprint(files), value })
  }

  return value.slice()
}

/** Drop every memoized read. The dev server calls this when a file changes. */
export function clearDataCache() {
  STATE.cache.clear()
}

/**
 * Watch which paths the site reads. The dev server uses it to reload the
 * browser when a JSON file a page actually read changes — pages declare
 * their own data, so nothing has to be configured.
 *
 * @param {(path: string) => void} listener called with each resolved path
 * @returns {() => void} unsubscribe
 */
export function onDataRead(listener) {
  STATE.readListeners.add(listener)
  return () => STATE.readListeners.delete(listener)
}

/**
 * `auto` keeps the memo in a production build — nothing edits `data/`
 * mid-build — and revalidates everywhere else so the dev server picks up
 * an edit. `memory` and `none` force one or the other.
 *
 * @param {unknown} mode
 * @returns {'keep' | 'revalidate' | 'none'}
 */
function effectiveCache(mode = 'auto') {
  if (mode === 'memory') return 'keep'
  if (mode === 'none') return 'none'

  if (mode !== 'auto') {
    throw new Error(
      `[sitelo] Unknown JSON data cache mode "${mode}". Use 'auto', 'memory', or 'none'.`,
    )
  }

  return process.env.NODE_ENV === 'production' ? 'keep' : 'revalidate'
}

/**
 * Cache key for the options that change what a collection looks like.
 * Functions are keyed by identity — two different sorts must not share an
 * entry.
 */
function collectionKey(options) {
  return JSON.stringify([
    describeOption(options.slug),
    describeOption(options.sort),
    options.recursive === true,
  ])
}

function describeOption(value) {
  if (typeof value !== 'function') return value ?? null

  let id = STATE.functionIds.get(value)

  if (id === undefined) {
    id = `fn:${(STATE.nextFunctionId += 1)}`
    STATE.functionIds.set(value, id)
  }

  return id
}

/**
 * mtime and size of every file an entry was built from. `null` when a file
 * has gone missing, so the caller re-reads and reports it properly.
 *
 * @param {string[]} files
 * @returns {Promise<string | null>}
 */
async function fingerprint(files) {
  try {
    const stats = await Promise.all(files.map((file) => fs.stat(file)))

    return stats
      .map((stat, index) => `${files[index]}:${stat.mtimeMs}:${stat.size}`)
      .join('\n')
  } catch {
    return null
  }
}

async function statPath(target) {
  try {
    return await fs.stat(target)
  } catch (error) {
    throw notFound(target, error)
  }
}

async function parseJsonFile(file) {
  let raw

  try {
    raw = await fs.readFile(file, 'utf8')
  } catch (error) {
    throw notFound(file, error)
  }

  try {
    return JSON.parse(raw)
  } catch (error) {
    throw new Error(
      `[sitelo] Invalid JSON in ${describePath(file)}: ${error.message}`,
    )
  }
}

function notFound(target, error) {
  if (error?.code !== 'ENOENT') return error

  return new Error(
    `[sitelo] No JSON data at ${describePath(target)} — relative paths resolve from the project root (${dataRoot()}).`,
  )
}

/** Every `.json` file under `dir`, sorted, so a build is reproducible. */
async function collectJsonFiles(dir, recursive) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue

    const full = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      if (recursive) files.push(...(await collectJsonFiles(full, true)))
      continue
    }

    if (entry.isFile() && entry.name.endsWith('.json')) files.push(full)
  }

  return files.sort()
}

/**
 * One file per entry. The path under `dir` is the slug, so
 * `data/posts/hello-world.json` is `/blog/hello-world` without anything in
 * the file saying so.
 */
async function entriesFromDirectory(dir, files) {
  return Promise.all(
    files.map(async (file) => {
      const value = await parseJsonFile(file)
      const source = describePath(file)

      return {
        entry: { slug: slugFromFile(dir, file), ...requireEntry(value, source) },
        source,
      }
    }),
  )
}

/** One file holding the whole collection: an array, or an object of entries. */
function entriesFromFile(file, value) {
  const label = describePath(file)

  if (Array.isArray(value)) {
    return value.map((item, index) => ({
      entry: { ...requireEntry(item, `${label}[${index}]`) },
      source: `${label}[${index}]`,
    }))
  }

  if (isPlainObject(value)) {
    return Object.entries(value).map(([slug, item]) => ({
      entry: { slug, ...requireEntry(item, `${label}["${slug}"]`) },
      source: `${label}["${slug}"]`,
    }))
  }

  throw new Error(
    `[sitelo] ${label} must contain an array of entries or an object keyed by slug, not ${describeValue(value)}.`,
  )
}

function requireEntry(value, source) {
  if (isPlainObject(value)) return value

  throw new Error(
    `[sitelo] ${source} must be a JSON object — a collection entry cannot be ${describeValue(value)}.`,
  )
}

function slugFromFile(dir, file) {
  return path
    .relative(dir, file)
    .replace(/\.json$/, '')
    .split(path.sep)
    .join('/')
}

/**
 * Settle each entry's slug, reject duplicates, then sort. Duplicate slugs
 * are two pages fighting over one URL, which is worth a build error rather
 * than whichever entry happens to render last.
 */
function finalizeEntries(pairs, options) {
  const pick = slugPicker(options.slug)

  const resolved = pairs.map(({ entry, source }, index) => {
    const raw = pick ? pick(entry, index) : (entry.slug ?? entry.id)

    if (pick && (raw === undefined || raw === null || raw === '')) {
      throw new Error(
        `[sitelo] ${source} has no slug — ${
          typeof options.slug === 'string'
            ? `it has no "${options.slug}" field`
            : 'the "slug" function returned nothing'
        }.`,
      )
    }

    const slug = raw === undefined || raw === null ? undefined : String(raw)

    return {
      entry:
        slug === undefined || entry.slug === slug ? entry : { ...entry, slug },
      source,
      slug,
    }
  })

  const seen = new Map()

  for (const item of resolved) {
    if (item.slug === undefined) continue

    const previous = seen.get(item.slug)

    if (previous !== undefined) {
      throw new Error(
        `[sitelo] Duplicate slug "${item.slug}" in ${previous} and ${item.source}.`,
      )
    }

    seen.set(item.slug, item.source)
  }

  const entries = resolved.map((item) => item.entry)
  const compare = comparator(options.sort)

  return compare ? entries.sort(compare) : entries
}

function slugPicker(slug) {
  if (slug == null) return undefined
  if (typeof slug === 'function') return slug

  if (typeof slug !== 'string' || slug === '') {
    throw new Error(
      '[sitelo] "slug" must be a field name or a function returning one.',
    )
  }

  return (entry) => entry[slug]
}

/**
 * `sort` is a compare function, or a field name — `'date'` ascending,
 * `'-date'` descending, which is how a blog index wants its posts.
 */
function comparator(sort) {
  if (sort == null) return undefined
  if (typeof sort === 'function') return sort

  if (typeof sort !== 'string' || sort === '' || sort === '-') {
    throw new Error(
      '[sitelo] "sort" must be a field name (optionally prefixed with "-") or a compare function.',
    )
  }

  const descending = sort.startsWith('-')
  const field = descending ? sort.slice(1) : sort

  return (a, b) => {
    const left = a?.[field]
    const right = b?.[field]

    // Entries missing the field sort last either way, rather than leading a
    // descending list with the ones that say nothing.
    if (left == null && right == null) return 0
    if (left == null) return 1
    if (right == null) return -1

    const result =
      typeof left === 'number' && typeof right === 'number'
        ? left - right
        : String(left).localeCompare(String(right))

    return descending ? -result : result
  }
}

function notifyRead(target) {
  for (const listener of STATE.readListeners) {
    try {
      listener(target)
    } catch {
      // A watcher that throws must not fail the page that read the file.
    }
  }
}

function isPlainObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function describeValue(value) {
  if (value === null) return 'null'
  if (Array.isArray(value)) return 'an array'
  return `a ${typeof value}`
}

/** Paths inside the project read better relative to it. */
function describePath(target) {
  const relative = path.relative(dataRoot(), target)

  if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) {
    return target
  }

  return relative.split(path.sep).join('/')
}
