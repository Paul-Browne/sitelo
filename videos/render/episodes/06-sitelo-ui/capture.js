// Runs episode 6 for real, from episode 5's snapshot: the site restyled
// with sitelo-ui stage by stage in the dev server (default theme, partial
// theme, full theme, dark mode, presets), then pruned CSS in the build,
// with and without the islands' classes kept.

import path from 'node:path'
import {
  SHOWN_PROJECT_DIR,
  devSession,
  eveningZone,
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

const F = files.final

export default async function capture({ outDir }) {
  process.env.TZ = eveningZone()
  const project = path.join(outDir, 'weeknight-kitchen')
  const tree = projectFrom('05-add-ons', project)
  const clean = normalizer({ projectDir: project, ports: { 5273: 5173, 4273: 4173 } })
  const rewrite = [[project, SHOWN_PROJECT_DIR], ['5273', '5173'], ['4273', '4173']]
  const term = { tree }
  const shots = {}
  const sh = (command) => clean(run('sh', ['-c', command], project))
  const { browser, page } = await launchBrowser()
  const dark = (on) => page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: on ? 'dark' : 'light' }])
  const settle = () => sleep(1500)

  // The site needs a build first, for the Pagefind index the search page loads.
  sh('npm run build')
  const dev = await devSession({ project, page, outDir, clean, rewrite })
  term.devStart = dev.banner
  shots.before = await dev.visit('/', 'before', { before: settle })

  // 1. styles() and the app bar.
  await dev.save({ 'src/lib/layout.js': files.layout.unthemed })
  shots.appBar = await dev.visit('/', 'appBar', { before: settle })

  // 2. Cards and grids (the islands too, since they used the old card).
  await dev.save({
    'src/lib/recipe-card.js': F['src/lib/recipe-card.js'],
    'src/recipes/index.ht.js': F['src/recipes/index.ht.js'],
    'src/recipes/quick.ht.js': F['src/recipes/quick.ht.js'],
    'src/cuisines/[...path]?.ht.js': F['src/cuisines/[...path]?.ht.js'],
    'src/index.ht.js': F['src/index.ht.js'],
    'src/islands/whats-cooking.js': F['src/islands/whats-cooking.js'],
    'src/islands/comments.js': F['src/islands/comments.js'],
  })
  shots.cards = await dev.visit('/recipes', 'cards', { before: settle })

  // 3. The hero, still in the default theme.
  shots.hero = await dev.visit('/', 'hero', { before: settle })

  // 4. Theming: three slots, then all nine.
  await dev.save({ 'src/lib/layout.js': files.layout.partial })
  shots.partial = await dev.visit('/', 'partial', { before: settle, targets: { outline: 'a.su-btn--outline', eyebrow: '.su-hero-eyebrow, .su-eyebrow' } })
  await dev.save({ 'src/lib/theme.js': F['src/lib/theme.js'], 'src/lib/layout.js': files.layout.final })
  shots.themed = await dev.visit('/', 'themed', { before: settle })
  term.devTheme = dev.take()

  // 5. The recipe page and the rest.
  await dev.save({
    'src/recipes/[slug].ht.js': F['src/recipes/[slug].ht.js'],
    'src/about.ht.js': F['src/about.ht.js'],
    'src/(legal)/privacy.ht.js': F['src/(legal)/privacy.ht.js'],
    'src/(legal)/terms.ht.js': F['src/(legal)/terms.ht.js'],
    'src/404.ht.js': F['src/404.ht.js'],
    'src/search.ht.js': F['src/search.ht.js'],
    'src/styles.css': F['src/styles.css'],
  })
  const scrollThrough = async () => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await sleep(2000)
    await page.evaluate(() => window.scrollTo(0, 0))
  }
  shots.recipe = await dev.visit('/recipes/classic-margherita-pizza', 'recipe', { before: scrollThrough })
  shots.cuisines = await dev.visit('/cuisines', 'cuisines', { before: settle })
  shots.home = await dev.visit('/', 'home', { before: settle, targets: { island: '[data-sitelo-island]', toggle: '[data-su-theme-toggle]' } })
  // Dark mode once the old stylesheet's colours are gone.
  await dark(true)
  shots.homeDark = await dev.visit('/', 'homeDark', { before: settle })
  shots.recipeDark = await dev.visit('/recipes/classic-margherita-pizza', 'recipeDark', { before: scrollThrough })
  await dark(false)
  term.devPages = dev.take()

  // 6. Presets.
  for (const name of ['neubrutalism', 'superneon', 'terminal']) {
    await dev.save({ 'src/lib/layout.js': files.layout[name] })
    shots[name] = await dev.visit('/', name, { before: settle })
  }
  await dev.save({ 'src/lib/layout.js': files.layout.final })
  await dev.stop()

  // 7. Only the CSS you use.
  const css = () => sh(`ls -l dist/su | awk '{ print $5, $9 }'`)
  const gz = () => sh(`gzip -c dist/su/*.css | wc -c`).trim()
  term.buildFull = sh('npm run build')
  term.cssFull = css()
  term.gzFull = gz()
  writeFiles(project, { 'sitelo.config.js': files.config.prune })
  term.buildPruned = sh('npm run build')
  term.cssPruned = css()
  term.gzPruned = gz()
  const preview = async (name) => {
    const server = start('npx', ['sitelo', 'preview', '--port', '4273', '--strictPort'], project)
    await server.waitFor(/Local/)
    await sleep(300)
    term.preview = clean(server.take())
    await page.goto('http://localhost:4273/recipes/classic-margherita-pizza', { waitUntil: 'networkidle0' })
    await scrollThrough()
    shots[name] = await shoot(page, path.join(outDir, `${name}.png`), { rewrite })
    await server.stop()
  }
  await preview('pruned')
  writeFiles(project, { 'sitelo.config.js': files.config.final })
  term.buildKept = sh('npm run build')
  term.cssKept = css()
  await preview('kept')
  term.lighthouse = sh('npx sitelo lighthouse')

  await browser.close()
  return { term, shots }
}
