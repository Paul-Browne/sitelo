// Reading numbers out of captured command output, for narration that
// quotes what actually happened.

export const strip = (text) => text.replace(/\x1b\[[0-9;]*m/g, '')

/** Rows of a `sitelo lighthouse` table: { page, perf, a11y, best, seo }. */
export const scores = (output) =>
  strip(output)
    .split('\n')
    .map((line) => line.match(/^\s+(\/\S*)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)/))
    .filter(Boolean)
    .map(([, page, perf, a11y, best, seo]) => ({ page, perf: +perf, a11y: +a11y, best: +best, seo: +seo }))
