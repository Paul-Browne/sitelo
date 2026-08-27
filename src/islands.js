import { createHmac, timingSafeEqual } from 'node:crypto'

const NAME_PATTERN = /^[A-Za-z0-9][A-Za-z0-9_-]*$/

/** Loading strategies understood by `sitelo/islands/client`. */
const LOADING_STRATEGIES = new Set(['load', 'idle', 'visible'])

/** Secret set via {@link configureIslands}; falls back to the environment. */
let configuredSecret

export function isValidIslandName(name) {
  return typeof name === 'string' && NAME_PATTERN.test(name)
}

function escapeAttribute(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

/**
 * Set the secret used to sign island props.
 *
 * Call this once, from a module your pages import, when you want props
 * signing without the `SITELO_ISLANDS_SECRET` environment variable. The
 * secret is only ever read at build time on the server — it never
 * reaches the browser.
 *
 * @param {{ secret?: string | null }} options
 */
export function configureIslands({ secret } = {}) {
  configuredSecret = secret ?? undefined
}

/**
 * The active signing secret, or `undefined` when signing is off.
 * @returns {string | undefined}
 */
export function getIslandsSecret() {
  return configuredSecret ?? process.env.SITELO_ISLANDS_SECRET ?? undefined
}

/**
 * HMAC over the island name *and* its props.
 *
 * The name is part of the payload so a signature issued for one island
 * cannot be replayed against another that happens to accept the same
 * props shape.
 *
 * @param {string} name
 * @param {string} propsJson exact JSON string that travels to the client
 * @param {string} secret
 * @returns {string} hex digest
 */
export function signIslandProps(name, propsJson, secret) {
  return createHmac('sha256', secret)
    .update(`${name}\n${propsJson}`)
    .digest('hex')
}

/**
 * Constant-time signature check.
 *
 * @param {string} name
 * @param {string} propsJson
 * @param {unknown} signature
 * @param {string} secret
 * @returns {boolean}
 */
export function verifyIslandProps(name, propsJson, signature, secret) {
  if (typeof signature !== 'string' || signature.length === 0) return false

  const expected = Buffer.from(signIslandProps(name, propsJson, secret), 'utf8')
  const received = Buffer.from(signature, 'utf8')

  // timingSafeEqual throws on a length mismatch, which is itself a leak-free
  // "no" — the digest length is fixed and public.
  if (expected.length !== received.length) return false

  return timingSafeEqual(expected, received)
}

/**
 * Emit a server-island placeholder.
 *
 * The static build ships the `fallback` HTML; at runtime the client
 * loader (`sitelo/islands/client`) fetches the rendered fragment from an
 * islands endpoint and swaps it in.
 *
 * @param {string} name - Island name; maps to `src/islands/<name>.js`.
 * @param {Record<string, unknown>} [props] - JSON-serializable props.
 * @param {string} [fallback] - HTML shown until the island loads.
 * @param {object} [options]
 * @param {'load' | 'idle' | 'visible'} [options.when] - When the client
 *   loads it. `load` (default) fetches immediately, `idle` waits for an
 *   idle callback, `visible` waits until it scrolls into view.
 * @param {string} [options.rootMargin] - IntersectionObserver margin for
 *   `when: 'visible'`, e.g. `'400px'` to start loading early.
 * @returns {string}
 */
export function island(name, props = {}, fallback = '', options = {}) {
  if (!isValidIslandName(name)) {
    throw new Error(
      `[sitelo] Invalid island name "${name}". Use letters, digits, "-" or "_" (must start with a letter or digit).`,
    )
  }

  const { when = 'load', rootMargin } = options

  if (!LOADING_STRATEGIES.has(when)) {
    throw new Error(
      `[sitelo] Invalid island loading strategy "${when}" for "${name}". Use 'load', 'idle', or 'visible'.`,
    )
  }

  if (rootMargin != null && typeof rootMargin !== 'string') {
    throw new Error(
      `[sitelo] Island "${name}" rootMargin must be a string, e.g. '400px'.`,
    )
  }

  const json = JSON.stringify(props ?? {})
  const hasProps = Boolean(json) && json !== '{}'

  let attributes = ''

  if (hasProps) {
    attributes += ` data-sitelo-props="${escapeAttribute(json)}"`

    const secret = getIslandsSecret()

    if (secret) {
      attributes += ` data-sitelo-sig="${signIslandProps(name, json, secret)}"`
    }
  }

  if (when !== 'load') attributes += ` data-sitelo-when="${when}"`

  if (rootMargin && when === 'visible') {
    attributes += ` data-sitelo-root-margin="${escapeAttribute(rootMargin)}"`
  }

  return `<div data-sitelo-island="${name}"${attributes}>${fallback}</div>`
}
