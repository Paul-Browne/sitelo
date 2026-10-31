// node capture.js <episode>
//
// Runs the episode's commands for real and saves what they printed and how
// the pages looked to out/<episode>/capture/. Set SITELO_TARBALL to a packed
// sitelo to capture unreleased fixes.

import fs from 'node:fs'
import path from 'node:path'

const episode = process.argv[2]
if (!episode) throw new Error('Usage: node capture.js <episode>, e.g. 01-setup')

const outDir = path.resolve('out', episode, 'capture')
fs.mkdirSync(outDir, { recursive: true })
const { default: capture } = await import(`./episodes/${episode}/capture.js`)
const tarball = process.env.SITELO_TARBALL && path.resolve(process.env.SITELO_TARBALL)
const result = await capture({ outDir, tarball })
fs.writeFileSync(path.join(outDir, 'capture.json'), JSON.stringify(result, null, 2))
console.log(`Captured ${Object.keys(result.shots).length} pages to ${path.relative(process.cwd(), outDir)}`)
