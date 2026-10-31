// Runs episode 3 for real, from episode 2's snapshot: each new route in the
// dev server, an unknown slug, the 404 page, then the build with its sitemap
// and link checker, once clean and once with a broken link.

import fs from 'node:fs'
import path from 'node:path'
import {
  SHOWN_PROJECT_DIR,
  devSession,
  launchBrowser,
  normalizer,
  projectFrom,
  run,
  sleep,
} from '../../lib/capture-kit.js'
import * as files from './files.js'

export default async function capture({ outDir }) {
  const project = path.join(outDir, 'weeknight-kitchen')
  const tree = projectFrom('02-data', project)
  const clean = normalizer({ projectDir: project, ports: { 5273: 5173 } })
  const rewrite = [[project, SHOWN_PROJECT_DIR], ['5273', '5173']]
  const term = { tree }
  const shots = {}
  const { browser, page } = await launchBrowser()
  const dev = await devSession({ project, page, outDir, clean, rewrite })
  term.devStart = dev.banner

  fs.mkdirSync(path.join(project, 'src/recipes'))
  fs.renameSync(path.join(project, 'src/recipes.ht.js'), path.join(project, 'src/recipes/index.ht.js'))
  await dev.save({ 'src/recipes/index.ht.js': files.recipes.moved })
  shots.moved = await dev.visit('/recipes', 'moved')
  dev.take()

  await dev.save({
    'src/lib/slug.js': files.slug,
    'src/lib/api.js': files.api,
    'src/lib/recipe-card.js': files.card,
    'src/index.ht.js': files.index,
    'src/styles.css': files.styles,
    'src/recipes/[slug].ht.js': files.recipePage.final,
  })
  shots.list = await dev.visit('/recipes', 'list', { targets: { pizza: 'a.card[href="/recipes/classic-margherita-pizza"]' } })
  shots.recipe = await dev.visit('/recipes/classic-margherita-pizza', 'recipe')
  term.devSlug = dev.take()

  await page.goto('http://localhost:5273/recipes/beans-on-toast', { waitUntil: 'networkidle0' }).catch(() => {})
  await sleep(800)
  term.devBeans = dev.take()
  shots.beans = await dev.visit('/recipes/beans-on-toast', 'beans')
  dev.take()

  await dev.save({ 'src/recipes/quick.ht.js': files.quick, 'src/recipes/index.ht.js': files.recipes.final })
  shots.listQuick = await dev.visit('/recipes', 'listQuick', { targets: { quickLink: '.lead a[href="/recipes/quick"]' } })
  shots.quick = await dev.visit('/recipes/quick', 'quick')
  term.devQuick = dev.take()

  await dev.save({
    'src/lib/cuisines.js': files.cuisines,
    'src/cuisines/[...path]?.ht.js': files.catchAll.deep,
    'src/lib/layout.js': files.layout.cuisines,
  })
  shots.italian = await dev.visit('/cuisines/italian', 'italian', { targets: { dinner: 'ul.pills a[href="/cuisines/italian/dinner"]' } })
  shots.dinner = await dev.visit('/cuisines/italian/dinner', 'dinner', {
    targets: { crumbItalian: '.breadcrumbs a[href="/cuisines/italian"]', crumbCuisines: '.breadcrumbs a[href="/cuisines"]' },
  })
  await dev.save({ 'src/cuisines/[...path]?.ht.js': files.catchAll.final })
  shots.cuisines = await dev.visit('/cuisines', 'cuisines', { targets: { italian: 'ul.pills a[href="/cuisines/italian"]' } })
  term.devCuisines = dev.take()

  await dev.save({
    'src/(legal)/privacy.ht.js': files.privacy,
    'src/(legal)/terms.ht.js': files.terms,
    'src/lib/layout.js': files.layout.final,
    'src/404.ht.js': files.notFound,
  })
  shots.privacy = await dev.visit('/privacy', 'privacy')
  term.devLegal = dev.take()
  shots.notFound = await dev.visit('/no-such-page', 'notFound')
  await dev.stop()

  fs.writeFileSync(path.join(project, 'sitelo.config.js'), files.config)
  term.build = clean(run('npm', ['run', 'build'], project))
  term.sitemap = run('head', ['-n', '12', 'dist/sitemap.xml'], project)
  term.pages = run('sh', ['-c', 'find dist -name "*.html" | wc -l'], project).trim()

  fs.writeFileSync(path.join(project, 'src/recipes/index.ht.js'), files.recipes.broken)
  term.buildBroken = clean(run('npm', ['run', 'build'], project))
  fs.writeFileSync(path.join(project, 'src/recipes/index.ht.js'), files.recipes.final)

  await browser.close()
  return { term, shots }
}
