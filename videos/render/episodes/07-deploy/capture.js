// Runs episode 7's checks for real, from episode 6's snapshot. Nothing is
// deployed: dist/ is served by a plain static file server (islands keep
// their fallbacks), the Netlify function is called with the same web
// Request Netlify would pass it, props are signed with a real secret and a
// tampered request is refused, and CI's commands run locally.

import path from 'node:path'
import {
  SHOWN_PROJECT_DIR,
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

/** Calls the function the way Netlify does, and prints what it returns. */
export const callFunction = (url) => `node --input-type=module -e "
import handler from './netlify/functions/islands.mjs'
const res = await handler(new Request('${url}'))
console.log(res.status, res.headers.get('cache-control') ?? '')
console.log(await res.text())"`

export default async function capture({ outDir }) {
  process.env.TZ = eveningZone()
  const project = path.join(outDir, 'weeknight-kitchen')
  const tree = projectFrom('06-sitelo-ui', project)
  const clean = normalizer({ projectDir: project, ports: { 8090: 8000, 4273: 4173 } })
  const rewrite = [[project, SHOWN_PROJECT_DIR], ['8090', '8000'], ['4273', '4173']]
  const term = { tree }
  const shots = {}
  const sh = (command, env = {}) => {
    Object.assign(process.env, env)
    const out = clean(run('sh', ['-c', command], project))
    for (const key of Object.keys(env)) delete process.env[key]
    return out
  }
  const { browser, page } = await launchBrowser()
  const scrollThrough = async () => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await sleep(2000)
    await page.evaluate(() => window.scrollTo(0, 0))
  }
  const visit = async (url, name, before) => {
    await page.goto(url, { waitUntil: 'networkidle0' })
    await sleep(800)
    if (before) await before()
    shots[name] = await shoot(page, path.join(outDir, `${name}.png`), { rewrite })
  }

  // dist/ on a plain static file server: no islands endpoint.
  term.build = sh('npm run build')
  const files404 = start('python3', ['-u', '-m', 'http.server', '8090', '--directory', 'dist'], project)
  await files404.waitFor(/Serving HTTP/)
  term.serve = clean(files404.take())
  await visit('http://localhost:8090/', 'staticHome', scrollThrough)
  await visit('http://localhost:8090/recipes/classic-margherita-pizza/', 'staticRecipe', scrollThrough)
  await page.goto('http://localhost:8090/search/', { waitUntil: 'networkidle0' })
  await page.waitForSelector('.pagefind-ui__search-input')
  await page.type('.pagefind-ui__search-input', 'pasta', { delay: 40 })
  await page.waitForSelector('.pagefind-ui__result', { timeout: 15000 })
  await sleep(1500)
  shots.staticSearch = await shoot(page, path.join(outDir, 'staticSearch.png'), { rewrite })
  await files404.stop()
  term.serveLog = clean(files404.take())

  // Netlify config, the real site URL, and the islands function.
  writeFiles(project, {
    'netlify.toml': files.netlifyToml,
    'sitelo.config.js': files.config,
    'netlify/functions/islands.mjs': files.fn,
    'knip.js': files.knip,
  })
  term.callCooking = sh(callFunction('http://localhost/_sitelo/islands/whats-cooking'))
  term.callNothing = sh(callFunction('http://localhost/about'))

  // Signed props.
  const secret = run('openssl', ['rand', '-hex', '32']).trim()
  term.secret = secret
  term.buildSigned = sh('npm run build', { SITELO_ISLANDS_SECRET: secret })
  term.placeholder = sh(`grep -o '<div data-sitelo-island="comments"[^>]*>' dist/recipes/classic-margherita-pizza/index.html`)
  const attr = (name) => term.placeholder.match(new RegExp(`${name}="([^"]*)"`))?.[1].replaceAll('&quot;', '"')
  const props = attr('data-sitelo-props')
  const sig = attr('data-sitelo-sig')
  const islandUrl = (p) => `http://localhost/_sitelo/islands/comments?props=${encodeURIComponent(p)}&sig=${sig}`
  term.signedUrl = islandUrl(props)
  term.tamperedUrl = islandUrl(props.replace(/\d+/, (n) => String(Number(n) + 1)))
  term.callSigned = sh(callFunction(term.signedUrl), { SITELO_ISLANDS_SECRET: secret })
  term.callTampered = sh(callFunction(term.tamperedUrl), { SITELO_ISLANDS_SECRET: secret })

  // What CI runs.
  writeFiles(project, { '.github/workflows/ci.yml': files.ci, '.github/workflows/rebuild.yml': files.rebuild })
  term.knip = sh('npm run knip')
  term.lighthouse = sh('npm run lighthouse')

  // The finished site, in preview, light and dark.
  const preview = start('npx', ['sitelo', 'preview', '--port', '4273', '--strictPort'], project)
  Object.assign(process.env, { SITELO_ISLANDS_SECRET: secret })
  await preview.waitFor(/Local/)
  delete process.env.SITELO_ISLANDS_SECRET
  await visit('http://localhost:4273/', 'finalHome', scrollThrough)
  await visit('http://localhost:4273/recipes/thai-green-curry', 'finalRecipe', scrollThrough)
  await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'dark' }])
  await visit('http://localhost:4273/', 'finalHomeDark', scrollThrough)
  await visit('http://localhost:4273/cuisines', 'finalCuisinesDark')
  await preview.stop()

  await browser.close()
  return { term, shots }
}
