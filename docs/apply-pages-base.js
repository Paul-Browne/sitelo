import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.join(__dirname, 'dist')
const base = (process.argv[2] ?? '/sitelo').replace(/\/+$/, '') || ''

if (!base) {
  console.log('[docs] no base prefix requested, skipping')
  process.exit(0)
}

if (!fs.existsSync(distDir)) {
  console.error(`[docs] missing ${distDir} — run docs:build first`)
  process.exit(1)
}

/** Root-absolute href/src → prefixed for GitHub project pages. */
function rewriteHtml(html) {
  return html.replace(
    /\b(href|src)="\/(?!\/)/g,
    `$1="${base}/`,
  )
}

function rewriteSitemap(xml) {
  // sitelo writes <loc>${site}${route}</loc>; site should already include base.
  return xml
}

function walk(dir) {
  let count = 0
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      count += walk(full)
      continue
    }
    if (entry.name.endsWith('.html')) {
      const before = fs.readFileSync(full, 'utf8')
      const after = rewriteHtml(before)
      if (after !== before) {
        fs.writeFileSync(full, after)
        count += 1
      }
    } else if (entry.name === 'sitemap.xml') {
      rewriteSitemap(fs.readFileSync(full, 'utf8'))
    }
  }
  return count
}

const updated = walk(distDir)
console.log(`[docs] prefixed ${updated} HTML file(s) with base ${base}/`)
