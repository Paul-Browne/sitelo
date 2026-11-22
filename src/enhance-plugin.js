/**
 * Checks that every enhancement a page uses has a module registered for
 * it.
 *
 * A page names an enhancement in markup (`data-sitelo-enhance="counter"`)
 * and the browser looks the name up in the map a script passes to
 * `mountEnhancements()`. Nothing connects the two until the page runs,
 * so a typo, or a module nobody registered, is otherwise a console error
 * in somebody's browser. This reads the map out of the site's own
 * source and compares it with the built pages, so the build can say so
 * instead.
 *
 * The map is read statically: an object literal in the call, or in a
 * `const` in the same file. A map put together at runtime cannot be
 * read, and then nothing is checked, rather than reporting names that
 * may well be registered.
 */

import fs from 'node:fs'
import path from 'node:path'
import { parseSync } from 'vite'

const CLIENT = 'sitelo/enhance/client'
const MOUNT = 'mountEnhancements'

/** Scripts the pages directory can hold that a browser entry may be. */
const SCRIPT_EXTENSIONS = ['.js', '.mjs', '.ts', '.mts', '.jsx', '.tsx']

/** Wrappers that change an expression's type but not its value. */
const TRANSPARENT = new Set([
  'ParenthesizedExpression',
  'TSAsExpression',
  'TSSatisfiesExpression',
  'TSNonNullExpression',
  'TSTypeAssertion',
])

/** @param {any} node */
function unwrap(node) {
  while (node && TRANSPARENT.has(node.type)) node = node.expression

  return node
}

/**
 * Call `visit` on every node under `node`, parents before children, with
 * the node that holds it.
 *
 * @param {any} node
 * @param {(node: any, parent: any) => void} visit
 * @param {any} [parent]
 */
function walk(node, visit, parent = null) {
  if (Array.isArray(node)) {
    for (const child of node) walk(child, visit, parent)
    return
  }

  if (!node || typeof node !== 'object' || typeof node.type !== 'string') return

  visit(node, parent)

  for (const value of Object.values(node)) {
    if (value && typeof value === 'object') walk(value, visit, node)
  }
}

/**
 * The keys of an object literal, or `null` if any of them is only known
 * at runtime: a spread, or a computed key that is not a plain string.
 *
 * @param {any} object
 * @returns {string[] | null}
 */
function staticKeys(object) {
  const keys = []

  for (const property of object.properties) {
    if (property.type !== 'Property') return null

    const { key } = property

    if (key.type === 'Identifier' && !property.computed) keys.push(key.name)
    else if (key.type === 'Literal' && typeof key.value === 'string') keys.push(key.value)
    else return null
  }

  return keys
}

/** @param {any} specifier */
function importedName(specifier) {
  const { imported } = specifier

  return imported.type === 'Identifier' ? imported.name : imported.value
}

/**
 * The enhancement names a module registers with `mountEnhancements()`.
 *
 * `readable` is `false` when the module uses `mountEnhancements` in a way
 * this cannot follow: a map built at runtime, the function passed around
 * or re-exported, or the client imported dynamically. Its registrations
 * are then unknown, and so is whether any name is missing.
 *
 * @param {string} source
 * @param {string} filename - Decides the syntax: `.ts`, `.tsx` and so on.
 * @returns {{ names: string[], calls: number, readable: boolean }}
 */
export function registeredEnhancements(source, filename) {
  const result = { names: [], calls: 0, readable: true }

  if (!source.includes(CLIENT)) return result

  const { program, errors } = parseSync(filename, source)

  if (errors.length) return { ...result, readable: false }

  /** Local names `mountEnhancements` is imported under. */
  const direct = new Set()
  /** Local names of `import * as … from 'sitelo/enhance/client'`. */
  const namespaces = new Set()
  /** Top-level `const name = { … }`, for a map passed by name. */
  const objects = new Map()

  for (const statement of program.body) {
    if (statement.type === 'ImportDeclaration' && statement.source.value === CLIENT) {
      for (const specifier of statement.specifiers) {
        if (specifier.type === 'ImportNamespaceSpecifier') {
          namespaces.add(specifier.local.name)
        } else if (specifier.type === 'ImportSpecifier' && importedName(specifier) === MOUNT) {
          direct.add(specifier.local.name)
        }
      }
    }

    const declaration =
      statement.type === 'ExportNamedDeclaration' ? statement.declaration : statement

    if (declaration?.type === 'VariableDeclaration' && declaration.kind === 'const') {
      for (const declarator of declaration.declarations) {
        const init = unwrap(declarator.init)

        if (declarator.id.type === 'Identifier' && init?.type === 'ObjectExpression') {
          objects.set(declarator.id.name, init)
        }
      }
    }
  }

  /** Callee nodes that were read, so the walk can tell other uses from them. */
  const read = new Set()

  /** @param {any} call */
  const register = (call) => {
    result.calls += 1

    const map = unwrap(call.arguments[0])
    const object =
      map?.type === 'ObjectExpression'
        ? map
        : map?.type === 'Identifier'
          ? objects.get(map.name)
          : undefined
    const keys = object ? staticKeys(object) : null

    if (keys) result.names.push(...keys)
    else result.readable = false
  }

  walk(program, (node, parent) => {
    // Re-exported, or imported at runtime: used somewhere this cannot see.
    if (
      (node.type === 'ExportNamedDeclaration' || node.type === 'ExportAllDeclaration') &&
      node.source?.value === CLIENT
    ) {
      result.readable = false
    }

    if (node.type === 'ImportExpression' && node.source?.value === CLIENT) {
      result.readable = false
    }

    if (node.type === 'CallExpression') {
      const callee = unwrap(node.callee)

      const isMount =
        (callee.type === 'Identifier' && direct.has(callee.name)) ||
        (callee.type === 'MemberExpression' &&
          !callee.computed &&
          callee.object.type === 'Identifier' &&
          namespaces.has(callee.object.name) &&
          callee.property.name === MOUNT)

      if (isMount) {
        read.add(callee.type === 'MemberExpression' ? callee.object : callee)
        register(node)
      }
    }

    // Any other use of the binding (passed to a helper, aliased) hides
    // whatever is registered through it.
    if (
      node.type === 'Identifier' &&
      (direct.has(node.name) || namespaces.has(node.name)) &&
      !read.has(node) &&
      parent?.type !== 'ImportSpecifier' &&
      parent?.type !== 'ImportNamespaceSpecifier'
    ) {
      result.readable = false
    }
  })

  return result
}

/**
 * The enhancement names a page's markup uses.
 *
 * Element by element: a code sample showing `enhance()` output is escaped
 * text, and only a real tag is one the loader will find.
 *
 * @param {string} html
 * @returns {string[]}
 */
export function enhancementsUsed(html) {
  const names = new Set()

  for (const [tag] of html.matchAll(/<[a-z][a-z0-9-]*\b(?:[^>"']|"[^"]*"|'[^']*')*>/gi)) {
    const name = tag.match(/\sdata-sitelo-enhance="([^"]*)"/)?.[1]

    if (name) names.add(name)
  }

  return [...names]
}

/**
 * How many single-character edits turn `a` into `b`.
 *
 * @param {string} a
 * @param {string} b
 */
function distance(a, b) {
  let previous = Array.from({ length: b.length + 1 }, (_, i) => i)

  for (let i = 1; i <= a.length; i++) {
    const current = [i]

    for (let j = 1; j <= b.length; j++) {
      current[j] = Math.min(
        previous[j] + 1,
        current[j - 1] + 1,
        previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      )
    }

    previous = current
  }

  return previous[b.length]
}

/**
 * What to say about one page's missing names.
 *
 * @param {string} page
 * @param {string[]} missing
 * @param {{ names: Set<string>, calls: number }} registry
 * @param {string} pagesDir
 */
export function missingEnhancementMessage(page, missing, registry, pagesDir) {
  const list = missing.map((name) => `"${name}"`).join(', ')
  const example = `mountEnhancements({ '${missing[0]}': () => import('./…') })`

  if (registry.calls === 0) {
    return (
      `[sitelo] ${page} uses enhancement ${list}, but nothing under ${pagesDir}/ calls ${MOUNT}() ` +
      `from ${CLIENT}, so it never loads. Register it in a script the page links: ${example}.`
    )
  }

  const known = [...registry.names].sort()

  /** The registered name a typo most likely meant, if one is close. */
  const closest = (name) => {
    const best = known
      .map((candidate) => ({ candidate, d: distance(name, candidate) }))
      .sort((x, y) => x.d - y.d)[0]

    return best && best.d <= Math.max(1, Math.floor(name.length / 3))
      ? best.candidate
      : null
  }

  const near = missing
    .map((name) => [name, closest(name)])
    .filter(([, candidate]) => candidate)
  const suggestion =
    missing.length === 1 && near.length
      ? `Did you mean "${near[0][1]}"?`
      : near.length
        ? `Did you mean ${near.map(([name, candidate]) => `"${candidate}" for "${name}"`).join(', ')}?`
        : `Register it in a script the page links: ${example}.`

  return (
    `[sitelo] ${page} uses enhancement ${list}, which no ${MOUNT}() call registers. ` +
    `${suggestion} Registered: ${known.join(', ') || 'none'}.`
  )
}

/**
 * Every script under `dir`, skipping dot-directories and `node_modules`.
 *
 * @param {string} dir
 * @returns {string[]}
 */
function scriptsUnder(dir) {
  if (!fs.existsSync(dir)) return []

  const found = []

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue

    const full = path.join(dir, entry.name)

    if (entry.isDirectory()) found.push(...scriptsUnder(full))
    else if (
      SCRIPT_EXTENSIONS.some((ext) => entry.name.endsWith(ext)) &&
      !entry.name.endsWith('.d.ts')
    ) {
      found.push(full)
    }
  }

  return found
}

/**
 * The plugin: a build fails on a page that names an unregistered
 * enhancement (or warns, with `missingAssets: 'warn'`), and the dev
 * server warns as each page renders.
 *
 * @param {{ root?: string, pagesDir?: string, missingAssets?: 'error' | 'warn' }} [options]
 * @returns {import('vite').Plugin}
 */
export function enhanceCheck({ root: pagesRoot, pagesDir = 'src', missingAssets = 'error' } = {}) {
  let pagesPath = ''
  let serving = false
  /** @type {Pick<import('vite').Logger, 'warn'>} */
  let logger = console
  /** @type {{ names: Set<string>, calls: number, readable: boolean } | null} */
  let registry = null
  const warned = new Set()

  const readRegistry = () => {
    if (registry) return registry

    const found = { names: new Set(), calls: 0, readable: true }

    for (const file of scriptsUnder(pagesPath)) {
      const source = fs.readFileSync(file, 'utf8')

      if (!source.includes(MOUNT)) continue

      const { names, calls, readable } = registeredEnhancements(source, file)

      for (const name of names) found.names.add(name)
      found.calls += calls
      found.readable &&= readable
    }

    registry = found
    return found
  }

  /**
   * The message for a page, or `null` when it is fine or cannot be told.
   *
   * @param {string} page
   * @param {string} html
   */
  const check = (page, html) => {
    const used = enhancementsUsed(html)

    if (!used.length) return null

    const known = readRegistry()

    if (!known.readable) return null

    const missing = used.filter((name) => !known.names.has(name))

    return missing.length
      ? missingEnhancementMessage(page, missing, known, pagesDir)
      : null
  }

  return {
    name: 'sitelo:enhance-check',

    configResolved(config) {
      pagesPath = path.join(
        pagesRoot ? path.resolve(config.root, pagesRoot) : config.root,
        pagesDir,
      )
      serving = config.command === 'serve'
      if (config.logger) logger = config.logger
    },

    configureServer(server) {
      // A script changed, and with it, maybe, what is registered.
      server.watcher?.on('all', (_event, file) => {
        if (SCRIPT_EXTENSIONS.some((ext) => file.endsWith(ext))) {
          registry = null
          warned.clear()
        }
      })
    },

    /*
     * Dev renders a page on request, so it is checked here, as it is
     * served. A warning rather than an error: the page still works
     * everywhere but in the enhancement.
     */
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        if (!serving) return

        const page = ctx?.path ?? '/'
        const message = check(page, html)

        if (message && !warned.has(`${page}\0${message}`)) {
          warned.add(`${page}\0${message}`)
          logger.warn(message)
        }
      },
    },

    /*
     * The pages are emitted by vite-plugin-html-pages' own generateBundle,
     * which runs before this one, so they are in the bundle by now and
     * nothing has been written yet.
     */
    generateBundle(_options, bundle) {
      registry = null

      const messages = []

      for (const output of Object.values(bundle)) {
        if (output.type !== 'asset' || !output.fileName.endsWith('.html')) continue

        const html =
          typeof output.source === 'string'
            ? output.source
            : new TextDecoder().decode(output.source)
        const message = check(output.fileName, html)

        if (message) messages.push(message)
      }

      if (!messages.length) return

      if (missingAssets === 'warn') {
        for (const message of messages) logger.warn(message)
        return
      }

      this.error(messages.join('\n'))
    },
  }
}
