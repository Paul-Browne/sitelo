import { cp, readFile, rm } from 'node:fs/promises'
import path from 'node:path'
import { installCommand } from './package-manager.js'
import { collectHtmlFiles, matchesGlob, pageUrl } from './site-paths.js'

/*
 * `pagefindUrl` and `matchesGlob` are pagefind's original names for helpers
 * the lighthouse audits now share; both work off the built site and have to
 * agree on the URL a page is reached at.
 */
export { matchesGlob, pageUrl as pagefindUrl } from './site-paths.js'

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
    throw new Error('"pagefind" must be true or an object')
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
 * Index a flat build file by file, handing pagefind the URL outright.
 *
 * pagefind derives a result URL from the path it finds a file at, which is
 * right for `docs/index.html` and wrong for `docs.html` — it would send
 * searchers to `/docs.html` while every link, the canonical tag and the
 * sitemap say `/docs`.
 *
 * @returns {Promise<number>} pages indexed
 */
async function addFlatFiles(index, siteDir, options) {
  const files = await collectHtmlFiles(siteDir)
  const pages = options.glob
    ? files.filter((file) => matchesGlob(file, options.glob))
    : files

  const results = await Promise.all(
    pages.map(async (file) =>
      index.addHTMLFile({
        url: pageUrl(file, { keepIndexUrl: options.keepIndexUrl }),
        content: await readFile(path.join(siteDir, file), 'utf8'),
      }),
    ),
  )

  const errors = results.flatMap((result) => result.errors ?? [])

  if (errors.length) {
    throw new Error(`pagefind indexing failed:\n${errors.join('\n')}`)
  }

  return pages.length
}

/**
 * Lazily load pagefind with an actionable error when it is not installed.
 *
 * pagefind is an optional peer dependency — only sites that enable
 * `pagefind` need to install it.
 */
async function loadPagefind() {
  try {
    return await import('pagefind')
  } catch (error) {
    const code = error?.code
    const missing =
      code === 'ERR_MODULE_NOT_FOUND' || code === 'MODULE_NOT_FOUND'

    throw new Error(
      missing
        ? '"pagefind" requires the pagefind package, which is an optional peer dependency.\n' +
          `Install it to enable search indexing: ${installCommand('pagefind')}\n` +
          '(or remove `pagefind` from sitelo.config.js)'
        : 'found pagefind but could not load it.\n' +
          `(original error: ${error instanceof Error ? error.message : error})`,
    )
  }
}

/**
 * Index `outDir` with Pagefind and optionally sync the bundle into `public/`.
 * @param {{
 *   root: string
 *   outDir: string
 *   publicDir: string | false | undefined
 *   options: NonNullable<ReturnType<typeof normalizePagefindOptions>>
 *   cleanUrls?: boolean
 *   log?: (message: string) => void
 * }} args
 */
export async function runPagefind({
  root,
  outDir,
  publicDir,
  options,
  cleanUrls = true,
  log = console.log,
}) {
  const { createIndex, close } = await loadPagefind()

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
      `pagefind failed to start:\n${createErrors.join('\n')}`,
    )
  }

  if (!index) {
    throw new Error('pagefind failed to create an index')
  }

  /*
   * A `cleanUrls` build is handed to pagefind whole — it walks the directory
   * and derives `/docs/` from `docs/index.html` itself, which is the URL the
   * site links. A flat build needs the URL supplied per file instead; see
   * `addFlatFiles`.
   */
  let pageCount

  if (cleanUrls) {
    const { errors: dirErrors, page_count: directoryCount } =
      await index.addDirectory({
        path: siteDir,
        ...(options.glob ? { glob: options.glob } : {}),
      })

    if (dirErrors?.length) {
      throw new Error(
        `pagefind indexing failed:\n${dirErrors.join('\n')}`,
      )
    }

    pageCount = directoryCount
  } else {
    pageCount = await addFlatFiles(index, siteDir, options)
  }

  // Write into a clean directory. The bundle is content-hashed, so without
  // this the fragments and indexes of deleted pages linger in every later
  // build — and a file left truncated by an interrupted write is never
  // replaced, which silently breaks search rather than failing the build.
  await rm(outputPath, { recursive: true, force: true })

  const { errors: writeErrors } = await index.writeFiles({ outputPath })

  if (writeErrors?.length) {
    throw new Error(
      `pagefind write failed:\n${writeErrors.join('\n')}`,
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
