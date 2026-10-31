// Runs episode 2 for real, starting from episode 1's snapshot: each stage
// of the home page in the dev server, the recipes page, then a cold and a
// warm build to show the fetch cache.

import fs from 'node:fs'
import path from 'node:path'
import {
  SHOWN_PROJECT_DIR,
  devSession,
  launchBrowser,
  normalizer,
  projectFrom,
  run,
  shoot,
  sleep,
} from '../../lib/capture-kit.js'
import * as files from './files.js'

export default async function capture({ outDir }) {
  const project = path.join(outDir, 'weeknight-kitchen')
  const tree = projectFrom('01-setup', project)
  const clean = normalizer({ projectDir: project, ports: { 5273: 5173, 4273: 4173 } })
  const rewrite = [[project, SHOWN_PROJECT_DIR]]
  const term = { tree }
  const shots = {}
  const { browser, page } = await launchBrowser()

  await page.goto('https://dummyjson.com/recipes?limit=1', { waitUntil: 'networkidle0' })
  // What Chrome's JSON viewer shows with Pretty-print ticked (headless
  // Chrome ignores the tick), at a size that reads on video.
  await page.evaluate(() => {
    const json = JSON.parse(document.body.innerText.replace(/^Pretty-print\s*/, ''))
    const pre = document.createElement('pre')
    pre.textContent = JSON.stringify(json, null, 2)
    pre.style.cssText = 'margin:0;padding:12px 16px;font:17px/1.45 monospace;white-space:pre-wrap'
    document.body.replaceChildren(pre)
    document.body.style.margin = '0'
  })
  await sleep(500)
  shots.api = await shoot(page, path.join(outDir, 'api.png'))

  const dev = await devSession({ project, page, outDir, clean, rewrite })
  term.devStart = dev.banner
  const homeTargets = { pick: 'section.pick', recipesLink: 'nav a[href="/recipes"]' }

  await dev.save({ 'src/lib/api.js': files.api, 'src/index.ht.js': files.index.data })
  shots.data = await dev.visit('/', 'data', { targets: { pick: 'section.pick' } })
  term.devData = dev.take()

  await dev.save({ 'src/lib/escape.js': files.escape, 'src/index.ht.js': files.index.escaped })
  term.devEscaped = dev.take()

  await dev.save({ 'src/lib/recipe-card.js': files.card, 'src/index.ht.js': files.index.cards, 'src/styles.css': files.styles })
  shots.cards = await dev.visit('/', 'cards', { targets: { pick: 'section.pick', grid: '.grid' } })
  term.devCards = dev.take()

  await dev.save({ 'src/recipes.ht.js': files.recipes, 'src/lib/layout.js': files.layout, 'src/index.ht.js': files.index.final })
  shots.home = await dev.visit('/', 'home', { targets: homeTargets })
  shots.recipes = await dev.visit('/recipes', 'recipes')
  term.devRecipes = dev.take()
  await dev.stop()

  fs.rmSync(path.join(project, 'node_modules/.cache'), { recursive: true, force: true })
  term.buildCold = clean(run('npm', ['run', 'build'], project))
  term.buildWarm = clean(run('npm', ['run', 'build'], project))
  term.cacheLs = run('ls', ['node_modules/.cache/sitelo/fetch'], project)

  await browser.close()
  return { term, shots }
}
