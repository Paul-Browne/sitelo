// Runs episode 1 for real (install, dev server, build, preview) and keeps
// the terminal output and page screenshots the video is assembled from.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  SHOWN_PROJECT_DIR,
  eveningZone,
  launchBrowser,
  normalizer,
  run,
  shoot,
  sleep,
  start,
  writeFiles,
} from '../../lib/capture-kit.js'
import * as files from './files.js'

const snapshot = fileURLToPath(files.snapshot)
const read = (file) => fs.readFileSync(path.join(snapshot, file))

export default async function capture({ outDir, tarball }) {
  process.env.TZ = eveningZone()
  const project = path.join(outDir, 'weeknight-kitchen')
  fs.rmSync(project, { recursive: true, force: true })
  fs.mkdirSync(project, { recursive: true })
  const clean = normalizer({ projectDir: project, ports: { 5273: 5173, 4273: 4173 } })
  const rewrite = [[project, SHOWN_PROJECT_DIR]]
  const term = {}
  const shots = {}

  // The finished files must match the snapshot viewers download.
  for (const [file, content] of Object.entries({
    'src/index.ht.js': files.index.hero,
    'src/about.ht.js': files.about,
    'src/lib/layout.js': files.layout,
  })) {
    if (read(file).toString() !== content) throw new Error(`files.js has drifted from videos/01-setup/${file}`)
  }

  term.nodeVersion = run('node', ['-v'], project)
  term.npmInit = clean(run('npm', ['init', '-y'], project))
  run('npm', ['pkg', 'set', 'type=module'], project)
  term.npmInstall = run('npm', ['install', 'sitelo', 'javascript-to-html'], project)
  const installed = fs.readFileSync(path.join(project, 'package.json'), 'utf8')
  if (installed !== files.packageJson.afterInit) {
    console.warn(`package.json after install differs from files.packageJson.afterInit:\n${installed}`)
  }
  // Unreleased fixes: install the local build over the registry one, unsaved.
  if (tarball) run('npm', ['install', '--no-save', tarball], project)
  writeFiles(project, { 'package.json': files.packageJson.withScripts })

  const { browser, page } = await launchBrowser()
  const dev = start('npx', ['sitelo', '--port', '5273', '--strictPort'], project)
  const visit = async (url, name, targets) => {
    await page.goto(url, { waitUntil: 'networkidle0' })
    await sleep(300)
    shots[name] = await shoot(page, path.join(outDir, `${name}.png`), { targets, rewrite })
  }
  // After a save, give the dev server a moment to see it before reloading.
  const save = async (changes) => {
    writeFiles(project, changes)
    await sleep(1200)
  }

  await save({ 'src/index.ht.js': files.index.template })
  await dev.waitFor(/Local/)
  await sleep(300)
  term.devStart = clean(dev.take())
  await visit('http://localhost:5273/', 'template', {
    toolbarFile: '#hp-dev-toolbar .hp-meta',
    toolbarIslands: '#hp-dev-toolbar .hp-pill',
  })

  await save({ 'src/index.ht.js': files.index.elements })
  await visit('http://localhost:5273/', 'elements')
  term.devElements = clean(dev.take())

  await save({ 'src/index.ht.js': files.index.broken })
  await page.goto('http://localhost:5273/', { waitUntil: 'networkidle0' }).catch(() => {})
  await sleep(800)
  term.devBroken = clean(dev.take())
  shots.broken = await shoot(page, path.join(outDir, 'broken.png'), { rewrite })

  await save({ 'src/index.ht.js': files.index.elements })
  await visit('http://localhost:5273/', 'fixed')
  term.devFixed = clean(dev.take())

  await save({ 'src/lib/layout.js': files.layout, 'src/index.ht.js': files.index.withLayout })
  await visit('http://localhost:5273/', 'layout')
  term.devLayout = clean(dev.take())

  fs.mkdirSync(path.join(project, 'src/images'), { recursive: true })
  for (const image of ['hero.jpg', 'kitchen.jpg', 'logo.svg']) {
    fs.copyFileSync(path.join(snapshot, 'src/images', image), path.join(project, 'src/images', image))
  }
  await save({ 'src/styles.css': read('src/styles.css').toString() })
  await visit('http://localhost:5273/', 'styled')
  await save({ 'src/index.ht.js': files.index.hero })
  await visit('http://localhost:5273/', 'hero', { aboutLink: 'nav a[href="/about"]' })
  await save({ 'src/about.ht.js': files.about })
  await visit('http://localhost:5273/about', 'about', { homeLink: 'nav a[href="/"]' })
  term.devStyled = clean(dev.take())
  await dev.stop()
  term.devStop = clean(dev.take())

  term.build = clean(run('npm', ['run', 'build'], project))
  const list = (dir) =>
    fs.readdirSync(dir, { recursive: true }).filter((f) => fs.statSync(path.join(dir, f)).isFile()).sort()
  term.distFiles = list(path.join(project, 'dist'))

  const preview = start('npm', ['run', 'preview', '--', '--port', '4273', '--strictPort'], project)
  await preview.waitFor(/Local/)
  await sleep(300)
  // The port flags are only there to dodge whatever already holds 4173.
  term.preview = clean(preview.take()).replace(' --port 4173 --strictPort', '')
  await visit('http://localhost:4273/about', 'previewAbout')
  await preview.stop()
  term.previewStop = clean(preview.take())

  // Cold open: the finished site from episode 7, in sitelo preview so its
  // islands render. Trailing slashes: the snapshot pins sitelo 2.9.13, whose
  // preview served the home page for clean URLs.
  const ep7 = fileURLToPath(new URL('../../../07-deploy/', import.meta.url))
  if (!fs.existsSync(path.join(ep7, 'dist/index.html'))) run('npm', ['run', 'build'], ep7)
  const site = start('npx', ['sitelo', 'preview', '--port', '4390', '--strictPort'], ep7)
  await site.waitFor(/Local/)
  const cold = async (url, name) => {
    await page.goto(url, { waitUntil: 'networkidle0' })
    await sleep(1500)
    shots[name] = await shoot(page, path.join(outDir, `${name}.png`))
  }
  await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }])
  await cold('http://localhost:4390/', 'coldHome')
  await cold('http://localhost:4390/recipes/classic-margherita-pizza/', 'coldRecipe')
  await page.goto('http://localhost:4390/search/', { waitUntil: 'networkidle0' })
  await page.waitForSelector('.pagefind-ui__search-input')
  await page.type('.pagefind-ui__search-input', 'pasta', { delay: 40 })
  await page.waitForSelector('.pagefind-ui__result', { timeout: 15000 })
  await sleep(1500)
  shots.coldSearch = await shoot(page, path.join(outDir, 'coldSearch.png'))
  await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'dark' }])
  await cold('http://localhost:4390/', 'coldHomeDark')
  await site.stop()

  await browser.close()
  return { term, shots }
}
