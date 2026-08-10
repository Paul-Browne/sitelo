import { cp, rm } from 'node:fs/promises'
import path from 'node:path'

/**
 * Normalize sitelo.config.js `pagefind` option.
 * @param {unknown} pagefind
 * @returns {null | {
 *   syncPublic: boolean
 *   glob?: string
 *   rootSelector?: string
 *   excludeSelectors?: string[]
 *   forceLanguage?: string
 *   verbose?: boolean
 *   keepIndexUrl?: boolean
 *   includeCharacters?: string
 * }}
 */
export function normalizePagefindOptions(pagefind) {
  if (!pagefind) return null

  if (pagefind === true) {
    return { syncPublic: true }
  }

  if (typeof pagefind !== 'object' || Array.isArray(pagefind)) {
    throw new Error('[sitelo] "pagefind" must be true or an object')
  }

  return {
    syncPublic: pagefind.syncPublic !== false,
    glob: pagefind.glob,
    rootSelector: pagefind.rootSelector,
    excludeSelectors: pagefind.excludeSelectors,
    forceLanguage: pagefind.forceLanguage,
    verbose: pagefind.verbose,
    keepIndexUrl: pagefind.keepIndexUrl,
    includeCharacters: pagefind.includeCharacters,
  }
}

/**
 * Index `outDir` with Pagefind and optionally sync the bundle into `public/`.
 * @param {{
 *   root: string
 *   outDir: string
 *   publicDir: string | false | undefined
 *   options: NonNullable<ReturnType<typeof normalizePagefindOptions>>
 *   log?: (message: string) => void
 * }} args
 */
export async function runPagefind({
  root,
  outDir,
  publicDir,
  options,
  log = console.log,
}) {
  const { createIndex, close } = await import('pagefind')

  const siteDir = path.resolve(root, outDir)
  const outputPath = path.join(siteDir, 'pagefind')

  const { index, errors: createErrors } = await createIndex({
    rootSelector: options.rootSelector,
    excludeSelectors: options.excludeSelectors,
    forceLanguage: options.forceLanguage,
    verbose: options.verbose,
    keepIndexUrl: options.keepIndexUrl,
    includeCharacters: options.includeCharacters,
  })

  if (createErrors?.length) {
    throw new Error(
      `[sitelo] pagefind failed to start:\n${createErrors.join('\n')}`,
    )
  }

  if (!index) {
    throw new Error('[sitelo] pagefind failed to create an index')
  }

  const { errors: dirErrors, page_count: pageCount } = await index.addDirectory({
    path: siteDir,
    ...(options.glob ? { glob: options.glob } : {}),
  })

  if (dirErrors?.length) {
    throw new Error(
      `[sitelo] pagefind indexing failed:\n${dirErrors.join('\n')}`,
    )
  }

  const { errors: writeErrors } = await index.writeFiles({ outputPath })

  if (writeErrors?.length) {
    throw new Error(
      `[sitelo] pagefind write failed:\n${writeErrors.join('\n')}`,
    )
  }

  await close()

  log(
    `[sitelo] pagefind indexed ${pageCount} page${pageCount === 1 ? '' : 's'} → ${path.relative(root, outputPath) || outputPath}`,
  )

  if (!options.syncPublic || publicDir === false) return

  const publicRoot = path.resolve(root, publicDir ?? 'public')
  const publicPagefind = path.join(publicRoot, 'pagefind')

  await rm(publicPagefind, { recursive: true, force: true })
  await cp(outputPath, publicPagefind, { recursive: true })

  log(
    `[sitelo] pagefind synced → ${path.relative(root, publicPagefind) || publicPagefind} (for sitelo / preview)`,
  )
}
