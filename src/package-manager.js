import fs from 'node:fs'
import path from 'node:path'

/**
 * How each supported manager installs a dev dependency.
 *
 * Yarn Classic and Yarn Berry share `yarn add -D`.
 */
const INSTALL_COMMANDS = {
  npm: (pkg) => `npm install -D ${pkg}`,
  pnpm: (pkg) => `pnpm add -D ${pkg}`,
  yarn: (pkg) => `yarn add -D ${pkg}`,
  bun: (pkg) => `bun add -d ${pkg}`,
}

/** Lockfile -> manager, checked in this order. */
const LOCKFILES = [
  ['bun.lock', 'bun'],
  ['bun.lockb', 'bun'],
  ['pnpm-lock.yaml', 'pnpm'],
  ['yarn.lock', 'yarn'],
  ['package-lock.json', 'npm'],
  ['npm-shrinkwrap.json', 'npm'],
]

/** How far up the tree to look for a lockfile (monorepo roots). */
const MAX_LOCKFILE_DEPTH = 6

/**
 * Read the manager out of `npm_config_user_agent`, e.g.
 * `pnpm/10.29.2 npm/? node/v24.12.0 darwin arm64`.
 *
 * Yarn Classic does not set this variable at all, which is why
 * {@link detectFromLockfile} exists.
 *
 * @param {string | undefined} userAgent
 * @returns {string | null}
 */
export function detectFromUserAgent(userAgent) {
  if (typeof userAgent !== 'string' || userAgent === '') return null

  const name = userAgent.trim().split(/[/\s]/)[0]

  return name in INSTALL_COMMANDS ? name : null
}

/**
 * Walk up from `startDir` looking for a lockfile.
 *
 * @param {string} startDir
 * @returns {string | null}
 */
export function detectFromLockfile(startDir) {
  let dir = path.resolve(startDir)

  for (let depth = 0; depth < MAX_LOCKFILE_DEPTH; depth += 1) {
    for (const [file, manager] of LOCKFILES) {
      if (fs.existsSync(path.join(dir, file))) return manager
    }

    const parent = path.dirname(dir)
    if (parent === dir) break
    dir = parent
  }

  return null
}

/**
 * Best guess at the package manager running this build.
 *
 * @param {object} [options]
 * @param {string} [options.cwd] Where to start looking for a lockfile.
 * @param {string | null} [options.userAgent] Omit to read
 *   `npm_config_user_agent`; pass `null` to ignore the environment and
 *   force lockfile detection.
 * @returns {'npm' | 'pnpm' | 'yarn' | 'bun'}
 */
export function detectPackageManager({
  cwd = process.cwd(),
  userAgent = process.env.npm_config_user_agent,
} = {}) {
  return detectFromUserAgent(userAgent) ?? detectFromLockfile(cwd) ?? 'npm'
}

/**
 * The command to suggest for installing an optional peer dependency,
 * phrased for whichever package manager the user is actually using.
 *
 * @param {string} pkg
 * @param {{ cwd?: string, userAgent?: string }} [options]
 * @returns {string}
 */
export function installCommand(pkg, options) {
  return INSTALL_COMMANDS[detectPackageManager(options)](pkg)
}
