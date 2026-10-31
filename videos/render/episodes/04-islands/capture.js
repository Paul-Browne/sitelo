// Runs episode 4 for real, from episode 3's snapshot: the what's-cooking
// island on the home page (refreshed for a new pick), the comments island
// before and after it scrolls into view, the island requests themselves,
// then the build and preview.

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
} from '../../lib/capture-kit.js'
import * as files from './files.js'

export default async function capture({ outDir }) {
  process.env.TZ = eveningZone()
  const project = path.join(outDir, 'weeknight-kitchen')
  const tree = projectFrom('03-routing', project)
  const clean = normalizer({ projectDir: project, ports: { 5273: 5173, 4273: 4173 } })
  const rewrite = [[project, SHOWN_PROJECT_DIR], ['5273', '5173'], ['4273', '4173']]
  const term = { tree }
  const shots = {}
  const { browser, page } = await launchBrowser()
  const islandRequests = []
  let blockIslands = false
  await page.setRequestInterception(true)
  page.on('request', (req) => {
    if (!req.url().includes('/_sitelo/islands/')) return req.continue()
    islandRequests.push(req.url())
    return blockIslands ? req.abort() : req.continue()
  })

  const dev = await devSession({ project, page, outDir, clean, rewrite })
  term.devStart = dev.banner
  shots.before = await dev.visit('/', 'before', { targets: { pick: 'section.pick' } })

  await dev.save({
    'src/islands/whats-cooking.js': files.whatsCooking,
    'src/islands.js': files.loader,
    'src/lib/layout.js': files.layout,
    'src/index.ht.js': files.index,
    'src/styles.css': files.styles,
  })
  // Two visits with different picks, to show a refresh.
  const pickOf = () => page.$eval('section.pick h3', (h3) => h3.textContent).catch(() => null)
  shots.home1 = await dev.visit('/', 'home1', { targets: { pick: 'section.pick' }, before: () => sleep(1500) })
  const first = await pickOf()
  for (let i = 0; i < 6; i++) {
    shots.home2 = await dev.visit('/', 'home2', { targets: { pick: 'section.pick' }, before: () => sleep(1500) })
    if ((await pickOf()) !== first) break
  }
  term.picks = [first, await pickOf()]
  term.devHome = dev.take()

  // The HTML the server sends, and the fragment the island returns.
  const placeholder = `curl -s localhost:5273 | grep -o '<section class="pick">.*</section>' | sed 's#</section>.*#</section>#'`
  term.placeholderCommand = placeholder.replace('5273', '5173')
  term.placeholder = run('sh', ['-c', placeholder], project)
  term.fragment = run('curl', ['-s', 'localhost:5273/_sitelo/islands/whats-cooking'], project)

  await dev.save({ 'src/islands/comments.js': files.comments, 'src/recipes/[slug].ht.js': files.slug })
  // Before it loads: the fallback, as the server sent it. (Blocking the
  // island request leaves the fallback in place, as a failed island would.)
  blockIslands = true
  shots.recipeFallback = await dev.visit('/recipes/classic-margherita-pizza', 'recipeFallback', { targets: { comments: 'section.recipe:last-of-type' } })
  blockIslands = false
  islandRequests.length = 0
  shots.recipeComments = await dev.visit('/recipes/classic-margherita-pizza', 'recipeComments', {
    before: async () => {
      term.requestsBeforeScroll = islandRequests.length
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
      await sleep(2000)
      await page.evaluate(() => window.scrollTo(0, 0))
    },
  })
  term.commentsRequest = islandRequests.find((url) => url.includes('/comments')) ?? ''
  shots.mango = await dev.visit('/recipes/mango-salsa-chicken', 'mango', {
    before: async () => {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
      await sleep(2000)
      await page.evaluate(() => window.scrollTo(0, 0))
    },
  })
  term.devComments = dev.take()

  // Props travel through the browser: change the id and ask again.
  const url = new URL(term.commentsRequest || 'http://localhost:5273/_sitelo/islands/comments')
  const withId = (id) => {
    const u = new URL(url)
    const props = JSON.parse(u.searchParams.get('props') ?? '{}')
    u.searchParams.set('props', JSON.stringify({ ...props, recipeId: id }))
    return u.toString()
  }
  await page.goto(withId(1), { waitUntil: 'networkidle0' })
  shots.props1 = await shoot(page, path.join(outDir, 'props1.png'), { rewrite })
  await page.goto(withId(2), { waitUntil: 'networkidle0' })
  shots.props2 = await shoot(page, path.join(outDir, 'props2.png'), { rewrite })
  term.propsUrls = [withId(1), withId(2)]
  await dev.stop()

  term.build = clean(run('npm', ['run', 'build'], project))
  term.ls = run('ls', ['dist'], project)
  const preview = start('npx', ['sitelo', 'preview', '--port', '4273', '--strictPort'], project)
  await preview.waitFor(/Local/)
  await sleep(300)
  term.preview = clean(preview.take())
  await page.goto('http://localhost:4273/', { waitUntil: 'networkidle0' })
  await sleep(1500)
  shots.preview = await shoot(page, path.join(outDir, 'preview.png'), { rewrite, targets: { pick: 'section.pick' } })
  await preview.stop()

  await browser.close()
  return { term, shots }
}
