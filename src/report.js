import path from 'node:path'
import { readdir, stat } from 'node:fs/promises'

const DEFAULT_TOP = 5

/**
 * File groups, in the order they are printed. `.html` is counted as
 * "pages" because that is exactly what sitelo emits; everything Vite
 * copied or bundled lands in one of the others.
 */
const GROUPS = [
  { key: 'pages', label: 'pages', extensions: ['.html'] },
  { key: 'js', label: 'js', extensions: ['.js', '.mjs', '.cjs'] },
  { key: 'css', label: 'css', extensions: ['.css'] },
  {
    key: 'images',
    label: 'images',
    extensions: [
      '.avif',
      '.webp',
      '.png',
      '.jpg',
      '.jpeg',
      '.gif',
      '.svg',
      '.ico',
    ],
  },
  {
    key: 'fonts',
    label: 'fonts',
    extensions: ['.woff', '.woff2', '.ttf', '.otf', '.eot'],
  },
]

const EXTENSION_GROUP = new Map(
  GROUPS.flatMap((group) => group.extensions.map((ext) => [ext, group.key])),
)

/**
 * @param {unknown} buildReport `true` (default), `false`, or an options object.
 * @returns {{ top: number } | null} null when the report is disabled.
 */
export function normalizeBuildReportOptions(buildReport) {
  if (buildReport === false) return null
  if (buildReport == null || buildReport === true) return { top: DEFAULT_TOP }

  if (typeof buildReport !== 'object' || Array.isArray(buildReport)) {
    throw new Error(
      '[sitelo] "buildReport" must be a boolean or an options object',
    )
  }

  const { top = DEFAULT_TOP } = buildReport

  if (!Number.isInteger(top) || top < 0) {
    throw new Error('[sitelo] "buildReport.top" must be a non-negative integer')
  }

  return { top }
}

/**
 * Format bytes the way Vite's build reporter does (base 1000).
 * @param {number} bytes
 */
export function formatBytes(bytes) {
  if (bytes < 1000) return `${bytes} B`
  if (bytes < 1000 * 1000) return `${(bytes / 1000).toFixed(1)} kB`
  return `${(bytes / (1000 * 1000)).toFixed(2)} MB`
}

/**
 * Format a duration in the units a reader actually wants at that scale.
 * @param {number} ms
 */
export function formatDuration(ms) {
  if (ms < 1000) return `${Math.round(ms)}ms`
  return `${(ms / 1000).toFixed(2)}s`
}

/**
 * Walk `outDir` and total up what the build actually produced.
 *
 * Vite's own table lists the modules it bundled; this covers the whole
 * output directory, including files copied from `public/`, post-build
 * image variants, and generated extras.
 *
 * @param {{ root: string, outDir: string }} args
 * @returns {Promise<{
 *   groups: Array<{ key: string, label: string, files: number, bytes: number }>,
 *   files: number,
 *   bytes: number,
 *   largest: Array<{ path: string, bytes: number }>,
 * } | null>} null when the output directory is missing.
 */
export async function collectBuildStats({ root, outDir }) {
  const siteDir = path.resolve(root, outDir)

  /** @type {Map<string, { files: number, bytes: number }>} */
  const totals = new Map()
  /** @type {Array<{ path: string, bytes: number }>} */
  const all = []

  let files = 0
  let bytes = 0

  async function walk(dir) {
    /** @type {import('node:fs').Dirent[]} */
    let entries

    try {
      entries = await readdir(dir, { withFileTypes: true })
    } catch {
      return
    }

    await Promise.all(
      entries.map(async (entry) => {
        const full = path.join(dir, entry.name)

        if (entry.isDirectory()) {
          await walk(full)
          return
        }

        if (!entry.isFile()) return

        let size
        try {
          size = (await stat(full)).size
        } catch {
          // Raced with something else writing the directory; skip it.
          return
        }

        const key =
          EXTENSION_GROUP.get(path.extname(entry.name).toLowerCase()) ?? 'other'
        const bucket = totals.get(key) ?? { files: 0, bytes: 0 }

        bucket.files += 1
        bucket.bytes += size
        totals.set(key, bucket)

        files += 1
        bytes += size
        all.push({ path: path.relative(siteDir, full), bytes: size })
      }),
    )
  }

  try {
    if (!(await stat(siteDir)).isDirectory()) return null
  } catch {
    return null
  }

  await walk(siteDir)

  if (files === 0) return null

  const groups = [...GROUPS, { key: 'other', label: 'other' }]
    .map((group) => ({
      key: group.key,
      label: group.label,
      ...(totals.get(group.key) ?? { files: 0, bytes: 0 }),
    }))
    .filter((group) => group.files > 0)

  all.sort((a, b) => b.bytes - a.bytes)

  return { groups, files, bytes, largest: all }
}

/**
 * Render the report. Returns the lines to print.
 *
 * @param {NonNullable<Awaited<ReturnType<typeof collectBuildStats>>>} stats
 * @param {Record<string, number>} [timings] phase label → milliseconds
 * @param {{ top?: number }} [options]
 * @returns {string[]}
 */
export function formatBuildReport(stats, timings = {}, options = {}) {
  const { top = DEFAULT_TOP } = options
  const lines = []

  const rows = [
    ...stats.groups.map((group) => [
      group.label,
      `${group.files} ${group.files === 1 ? 'file' : 'files'}`,
      formatBytes(group.bytes),
    ]),
  ]

  const totalRow = [
    'total',
    `${stats.files} ${stats.files === 1 ? 'file' : 'files'}`,
    formatBytes(stats.bytes),
  ]

  const width = (index) =>
    Math.max(...[...rows, totalRow].map((row) => row[index].length))

  const labelWidth = width(0)
  const countWidth = width(1)
  const bytesWidth = width(2)

  const renderRow = ([label, count, size]) =>
    `  ${label.padEnd(labelWidth)}  ${count.padStart(countWidth)}  ${size.padStart(bytesWidth)}`

  for (const row of rows) lines.push(renderRow(row))

  if (rows.length > 1) {
    lines.push(
      `  ${'─'.repeat(labelWidth + countWidth + bytesWidth + 4)}`,
    )
    lines.push(renderRow(totalRow))
  }

  const largest = stats.largest.slice(0, top)

  if (largest.length > 0) {
    const pathWidth = Math.max(...largest.map((file) => file.path.length))

    lines.push('')
    lines.push('  largest')

    for (const file of largest) {
      lines.push(
        `    ${file.path.padEnd(pathWidth)}  ${formatBytes(file.bytes).padStart(bytesWidth)}`,
      )
    }
  }

  const phases = Object.entries(timings).filter(
    ([, ms]) => typeof ms === 'number' && Number.isFinite(ms),
  )

  if (phases.length > 0) {
    lines.push('')
    lines.push(
      `  ${phases.map(([label, ms]) => `${label} ${formatDuration(ms)}`).join(' · ')}`,
    )
  }

  return lines
}

/**
 * Collect and print the build report.
 *
 * @param {{
 *   root: string,
 *   outDir: string,
 *   options: { top: number },
 *   timings?: Record<string, number>,
 *   log?: (message: string) => void,
 * }} args
 */
export async function runBuildReport({
  root,
  outDir,
  options,
  timings,
  log = console.log,
}) {
  const stats = await collectBuildStats({ root, outDir })

  if (!stats) return

  log('')
  log(`[sitelo] build report`)
  log('')

  for (const line of formatBuildReport(stats, timings, options)) log(line)

  log('')
}
