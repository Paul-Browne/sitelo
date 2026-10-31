// Runs episode 5 for real, from episode 4's snapshot: installs each add-on,
// audits with Lighthouse before and after the fixes, optimizes images cold
// and cached, indexes and searches with Pagefind, and runs knip.

import fs from 'node:fs'
import path from 'node:path'
import {
  SHOWN_PROJECT_DIR,
  launchBrowser,
  normalizer,
  projectFrom,
  run,
  shoot,
  sleep,
  start,
  writeFiles,
} from '../../lib/capture-kit.js'
import * as files from './files.js'

export default async function capture({ outDir }) {
  const project = path.join(outDir, 'weeknight-kitchen')
  const tree = projectFrom('04-islands', project)
  const clean = normalizer({ projectDir: project, ports: { 5273: 5173, 4273: 4173 } })
  const rewrite = [[project, SHOWN_PROJECT_DIR], ['5273', '5173'], ['4273', '4173']]
  const term = { tree }
  const shots = {}
  const sh = (command) => clean(run('sh', ['-c', command], project))
  const { browser, page } = await launchBrowser()

  // Lighthouse: the baseline, with reports kept.
  term.installLighthouse = sh('npm install -D lighthouse')
  writeFiles(project, { 'sitelo.config.js': files.config.lighthouse })
  term.build1 = sh('npm run build')
  term.lighthouse1 = sh('npx sitelo lighthouse')
  const report = async (name, file, focus) => {
    await page.goto(`file://${path.join(project, '.sitelo/lighthouse', file)}`, { waitUntil: 'networkidle0' })
    await sleep(800)
    if (focus) {
      await page.evaluate((selector) => {
        const el = document.querySelector(selector)
        el?.querySelector('details')?.setAttribute('open', '')
        el?.scrollIntoView({ block: 'center' })
      }, focus)
      await sleep(300)
      return shoot(page, path.join(outDir, `${name}.png`), { rewrite, fullPage: false })
    }
    return shoot(page, path.join(outDir, `${name}.png`), { rewrite, maxHeight: 1600, targets: { lcp: '#largest-contentful-paint' } })
  }
  // Reports sit at the page's path: cuisines/italian/index.report.html.
  term.reports = fs.readdirSync(path.join(project, '.sitelo/lighthouse'), { recursive: true }).filter((f) => f.endsWith('.report.html')).sort()
  shots.reportHome = await report('reportHome', 'index.report.html')
  term.lcp = await page.$eval('#largest-contentful-paint .lh-metric__value', (el) => el.textContent.replace(/\s+/g, ' ').trim())
  // A listing page: its cards' h3s come straight after the h1.
  const listing = term.reports.find((f) => f.startsWith('cuisines/')) ?? term.reports.find((f) => f === 'recipes/index.report.html')
  term.listingReport = listing
  shots.reportHeadings = await report('reportHeadings', listing, '#heading-order')

  // Headings above every grid.
  writeFiles(project, files.headings)

  // Images: cold, then cached.
  term.installSharp = sh('npm install -D sharp')
  writeFiles(project, { 'sitelo.config.js': files.config.images })
  sh('rm -rf node_modules/.sitelo')
  term.build2 = sh('npm run build')
  term.heroTag = sh(`grep -o '<img[^>]*hero[^>]*>' dist/index.html`)
  const imgDir = path.join(project, 'dist/assets/img')
  term.heroFiles = fs
    .readdirSync(imgDir)
    .filter((f) => f.startsWith('hero.'))
    .map((f) => ({ width: Number(f.match(/-(\d+)\.webp$/)?.[1]), kB: Math.round(fs.statSync(path.join(imgDir, f)).size / 1000) }))
    .sort((a, b) => a.width - b.width)
  term.build3 = sh('npm run build')
  writeFiles(project, {
    'src/lib/recipe-card.js': files.card,
    'src/index.ht.js': files.index,
    'src/recipes/[slug].ht.js': files.slug.images,
  })

  // Lighthouse again, then as a check.
  term.build4 = sh('npm run build')
  term.lighthouse2 = sh('npx sitelo lighthouse')
  writeFiles(project, { 'sitelo.config.js': files.config.thresholds })

  // Pagefind.
  term.installPagefind = sh('npm install -D pagefind')
  writeFiles(project, {
    'sitelo.config.js': files.config.final,
    'src/recipes/[slug].ht.js': files.slug.final,
    'src/search.ht.js': files.searchPage,
    'src/search.js': files.searchScript,
    'src/lib/layout.js': files.layout,
    'src/styles.css': files.styles,
    '.gitignore': files.gitignore,
  })
  term.build5 = sh('npm run build')
  const preview = start('npx', ['sitelo', 'preview', '--port', '4273', '--strictPort'], project)
  await preview.waitFor(/Local/)
  await sleep(300)
  term.preview = clean(preview.take())
  await page.goto('http://localhost:4273/search', { waitUntil: 'networkidle0' })
  await page.waitForSelector('.pagefind-ui__search-input')
  await page.type('.pagefind-ui__search-input', 'curry', { delay: 60 })
  await page.waitForSelector('.pagefind-ui__result', { timeout: 15000 })
  await sleep(2000)
  shots.search = await shoot(page, path.join(outDir, 'search.png'), { rewrite, targets: { filter: '.pagefind-ui__filter-name' } })
  term.searchResults = await page.$$eval('.pagefind-ui__result-link', (links) => links.map((a) => a.textContent))
  await page.evaluate(() => {
    const details = [...document.querySelectorAll('details.pagefind-ui__filter-block')].find((d) => /cuisine/i.test(d.textContent))
    details?.setAttribute('open', '')
  })
  await sleep(500)
  shots.searchFilter = await shoot(page, path.join(outDir, 'searchFilter.png'), { rewrite })
  shots.home = await (async () => {
    await page.goto('http://localhost:4273/', { waitUntil: 'networkidle0' })
    await sleep(1500)
    return shoot(page, path.join(outDir, 'home.png'), { rewrite })
  })()
  await preview.stop()

  // knip.
  term.installKnip = sh('npm install -D knip')
  writeFiles(project, { 'knip.js': files.knip })
  term.knip1 = sh('npx knip')
  writeFiles(project, { 'src/lib/api.js': files.api, 'package.json': files.pkg.final })
  term.knip2 = sh('npx knip')
  term.sitelo = run('ls', ['node_modules/.sitelo'], project)

  await browser.close()
  return { term, shots }
}
