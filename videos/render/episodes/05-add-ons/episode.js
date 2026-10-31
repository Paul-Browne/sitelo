// Episode 5: add-ons. Follows videos/05-add-ons/SCRIPT.md.

import { PROMPT } from '../../lib/director.js'
import { scores, strip } from '../../lib/output.js'
import * as files from './files.js'

export const meta = {
  title: 'Lighthouse, image optimization, search and dead code in one config file (sitelo, ep. 5)',
  description: `We audit the site with Lighthouse, find an 11-second Largest Contentful Paint and a heading-order bug, fix both, and add Pagefind search and knip. Every add-on is an optional peer dependency and one line in sitelo.config.js.

Code for every episode: https://github.com/Paul-Browne/sitelo/tree/main/videos
Docs: https://sitelo.js.org`,
}

const ms = (output, phase) => strip(output).match(new RegExp(`${phase} ([\\d.]+m?s)`))[1]
const spokenTime = (t) => (t.endsWith('ms') ? `${parseInt(t)} milliseconds` : `${parseFloat(t).toFixed(1)} seconds`)

export default function episode(d, { term, shots }) {
  const CONFIG = 'sitelo.config.js'
  const SLUG = 'src/recipes/[slug].ht.js'
  const REPORTS = 'file:///Users/paul/weeknight-kitchen/.sitelo/lighthouse'

  // Where episode 4 left off.
  d.addToTree([...term.tree, 'node_modules/'], { open: ['src'] })
  d.preload(files.start)
  d.terminal(330, 0)
  d.setTerminal('', { prompt: true })

  d.card('title', { episode: 'Episode 5', title: 'Add-ons', sub: 'Lighthouse, image optimization, search, and knip' }, 5.4)
  d.wait(0.8)
  d.say('Four optional extras this time. Each one is an npm install, and a line of config.')
  d.wait(Math.max(0, 5.4 - d.t))

  // ── 1. The plan ─────────────────────────────────────────────────────
  d.chapter(1, 'The plan')
  const slideStart = d.t
  d.say(
    "sitelo keeps these out of the default install: sharp alone is a native image library. Install the ones you want, switch them on in sitelo.config.js, and the build does the rest.",
  )
  d.wait(0.5)
  d.tracks.overlays.push({
    t0: slideStart,
    t1: d.t,
    kind: 'slide',
    data: {
      title: 'Four add-ons',
      rows: [
        ['Add-on', 'Install', 'Switch on'],
        ['Audits', 'lighthouse', 'lighthouse: { … }'],
        ['Images', 'sharp', 'images: { … }'],
        ['Search', 'pagefind', 'pagefind: true'],
        ['Dead code', 'knip', 'knip.js'],
      ],
    },
  })

  // ── 2. Lighthouse: the baseline ─────────────────────────────────────
  d.chapter(2, 'Lighthouse: the baseline')
  d.say('First, measure. Install Lighthouse,', () => d.run('npm install -D lighthouse', term.installLighthouse, { wait: 1.2, dur: 0.3 }))
  d.say('and tell sitelo which built pages to audit.', () => {
    d.wait(0.3).open(CONFIG).type(CONFIG, files.config.lighthouse, { cps: 60 })
  })
  d.highlight(CONFIG, d.lineOf(CONFIG, 'sample: 2'))
  d.say(
    'sample: 2 audits two random pages from each pattern. A hundred and seventeen pages at a few seconds each adds up.',
    null,
    { speak: 'sample two audits two random pages from each pattern. A hundred and seventeen pages at a few seconds each adds up.' },
  )
  d.highlight(CONFIG, d.lineOf(CONFIG, 'output: true'))
  d.say('And output: true keeps the full reports.', null, { speak: 'And output true keeps the full reports.' })
  d.unhighlight()
  d.terminal(560)
  d.run('npm run build', term.build1, { wait: 0.6, dur: 1 })
  d.addToTree('dist/')
  d.say('Build, then run sitelo lighthouse. It audits the real build, through the same server as sitelo preview, in headless Chrome, as a phone.', () => {
    d.wait(2).run('npx sitelo lighthouse', term.lighthouse1, { wait: 3, dur: 0.8 })
  })
  d.addToTree('.sitelo/')
  const before = scores(term.lighthouse1)
  const home = before.find((row) => row.page === '/')
  const listings = before.filter((row) => row.a11y < 100)
  d.say(
    `Two problems. The home page scores ${home.perf} for performance, and the listing pages score ${listings[0]?.a11y ?? 98} for accessibility.`,
  )
  d.showBrowser()
  d.load('reportHome', `${REPORTS}/index.report.html`)
  d.scrollTo(shots.reportHome.boxes.lcp.y - 300, 1.2)
  const lcp = d.callout(d.pageRect('lcp'), { label: 'LCP' })
  const lcpSeconds = parseFloat(term.lcp)
  d.say(`The home page report says why. Largest Contentful Paint: ${lcpSeconds} seconds. That's the 1.76 MB hero image.`, null, {
    speak: `The home page report says why. Largest contentful paint: ${lcpSeconds} seconds. That's the one point seven six megabyte hero image.`,
  })
  lcp.end()
  d.load('reportHeadings', `${REPORTS}/${term.listingReport}`)
  d.say('And a cuisine page fails one accessibility check: heading elements are not in a sequentially descending order.')

  // ── 3. Fixing the heading order ─────────────────────────────────────
  d.chapter(3, 'Fixing the heading order')
  d.showEditor()
  d.say(
    'The cards use h3. That is right on the home page, where they sit under Top rated. But on listing pages they come straight after the h1, so someone jumping by heading with a screen reader skips a level.',
    null,
    { speak: 'The cards use H 3. That is right on the home page, where they sit under Top rated. But on listing pages they come straight after the H 1, so someone jumping by heading with a screen reader skips a level.' },
  )
  d.say('So give each grid a heading. The count becomes an h2.', () => {
    for (const [file, content] of Object.entries(files.headings)) d.type(file, content, { cps: 70 })
  }, { speak: 'So give each grid a heading. The count becomes an H 2.' })

  // ── 4. Image optimization ───────────────────────────────────────────
  d.chapter(4, 'Image optimization')
  d.say('Now the images. Install sharp,', () => d.run('npm install -D sharp', term.installSharp, { wait: 1, dur: 0.3 }))
  d.say("and switch images on. remote: true includes the API's photos too.", () => {
    d.wait(0.3).type(CONFIG, files.config.images, { cps: 55 })
  }, { speak: "and switch images on. remote true includes the A P I's photos too." })
  d.say('Clear the image cache, and build.', () => {
    d.wait(0.6).run('rm -rf node_modules/.sitelo', '', { wait: 0.3 })
    d.run('npm run build', term.build2, { wait: 0.8, dur: 4 })
  })
  d.say(
    "Every img in the built HTML is resized to a ladder of widths, converted to WebP, and given a srcset, a width and height, and lazy loading. The API's photos too: they're downloaded once at build time, and served from our own site.",
    null,
    { speak: "Every image tag in the built H T M L is resized to a ladder of widths, converted to webp, and given a source set, a width and height, and lazy loading. The A P I's photos too: they're downloaded once at build time, and served from our own site." },
  )
  d.say('Here is the hero now.', () => {
    d.wait(0.6).run(`grep -o '<img[^>]*hero[^>]*>' dist/index.html`, term.heroTag, { wait: 0.3, dur: 0.1 })
  })
  const hero = Object.fromEntries(term.heroFiles.map((f) => [f.width, f.kB]))
  d.say(
    `The 1.76 MB JPEG became WebP files from 400 pixels wide, at ${hero[400]} kB, up to the original 3000. At 1200 pixels it's ${hero[1200]} kB. A phone downloads the small one.`,
    null,
    { speak: `The one point seven six megabyte jay-peg became webp files from 400 pixels wide, at ${hero[400]} kilobytes, up to the original 3000. At 1200 pixels it's ${hero[1200]} kilobytes. A phone downloads the small one.` },
  )
  d.say(
    "The report's 9.4 MB to 11 MB is every size of every image added up. No visitor downloads all of them: each img fetches one. And the originals that nothing points at any more are pruned.",
    null,
    { speak: "The report's nine point four to eleven megabytes is every size of every image added up. No visitor downloads all of them: each image fetches one. And the originals that nothing points at any more are pruned." },
  )
  d.run('npm run build', term.build3, { wait: 0.6, dur: 2 })
  d.say(`Build again, and images take ${spokenTime(ms(term.build3, 'images'))}. Encodes are cached by content hash, in dev too.`)
  d.terminal(250)
  d.say(
    "Two attributes make the ladder work better. sizes tells the browser how wide a card is. Without it, the browser assumes the image fills the screen, and picks a bigger file than a card needs.",
    () => d.wait(3).type('src/lib/recipe-card.js', files.card, { cps: 70 }),
  )
  d.say(
    "And the hero is the first thing on screen, so it shouldn't wait: load it eagerly, at high priority. Attributes you write yourself are kept.",
    () => {
      d.wait(1).type('src/index.ht.js', files.index, { cps: 70 })
      d.type(SLUG, files.slug.images, { cps: 70 })
    },
  )
  d.say('The dev server rewrites images the same way, so what you test is what you ship.')

  // ── 5. Lighthouse again, now with thresholds ────────────────────────
  d.chapter(5, 'Lighthouse again, now with thresholds')
  d.terminal(560)
  d.run('npm run build', term.build4, { wait: 0.6, dur: 1.6 })
  d.run('npx sitelo lighthouse', term.lighthouse2, { wait: 3, dur: 0.6 })
  const after = scores(term.lighthouse2)
  const perfs = after.map((row) => row.perf)
  const allOthers100 = after.every((row) => row.a11y === 100 && row.best === 100 && row.seo === 100)
  const homeAfter = after.find((row) => row.page === '/')
  d.say(
    `Measure again. The home page went from ${home.perf} to ${homeAfter.perf}${Math.min(...perfs) === 100 ? ', and every score is 100' : `, performance is ${Math.min(...perfs)} or better everywhere`}${allOthers100 && Math.min(...perfs) < 100 ? ', and everything else is 100' : ''}.`,
  )
  d.terminal(250)
  d.say('Now make it a check. With thresholds, a score under its threshold fails the command. That is what we will run in CI, in episode seven.', () => {
    d.wait(1.5).type(CONFIG, files.config.thresholds, { cps: 60 })
  })
  d.say(
    'Performance has no threshold, on purpose. It depends on the machine: the same page that scores 100 here scores lower on a shared CI runner. The other three are properties of the HTML, and score the same anywhere.',
  )

  // ── 6. Search with Pagefind ─────────────────────────────────────────
  d.chapter(6, 'Search with Pagefind')
  d.say('Search next. Install Pagefind, and switch it on.', () => {
    d.run('npm install -D pagefind', term.installPagefind, { wait: 1, dur: 0.3 })
    d.type(CONFIG, files.config.final, { cps: 55 })
  })
  d.say(
    "On the recipe page, mark what gets indexed with data-pagefind-body. Once one page has it, only those pages are indexed: fifty recipes, not a hundred and twenty pages of lists. The cuisine and meal links become filters, and the photo becomes each result's thumbnail.",
    () => d.wait(1).type(SLUG, files.slug.final, { cps: 70 }),
    { speak: "On the recipe page, mark what gets indexed with data pagefind body. Once one page has it, only those pages are indexed: fifty recipes, not a hundred and twenty pages of lists. The cuisine and meal links become filters, and the photo becomes each result's thumbnail." },
  )
  d.say('Then a search page, and a small script.', () => {
    d.wait(0.3).newFile('src/search.ht.js').paste('src/search.ht.js', files.searchPage)
    d.newFile('src/search.js').paste('src/search.js', files.searchScript)
  })
  d.say(
    "search.js loads Pagefind's interface at runtime, because slash pagefind only exists after a build. Linking it straight from the page would fail the missing-asset check, on a clean checkout.",
  )
  d.say('Add Search to the nav, and give the results the site’s colours.', () => {
    d.type('src/lib/layout.js', files.layout, { cps: 60 })
    d.paste('src/styles.css', files.styles)
  })
  d.say(
    'The build copies the index into public/pagefind too, so the dev server and preview can search without a rebuild. Ignore it in git.',
    () => d.wait(2).open('.gitignore').type('.gitignore', files.gitignore, { cps: 40 }),
  )
  d.terminal(560)
  d.run('npm run build', term.build5, { wait: 0.8, dur: 2.2 })
  d.addToTree('public/')
  d.say('Pagefind runs over the built HTML after the build, and writes a static index.')
  d.say('Preview it.', () => d.typeCommand('npm run preview').wait(0.6).print(`\n> preview\n> sitelo preview\n\n${term.preview}`, { dur: 0.2 }))
  d.showBrowser()
  d.load('search', 'localhost:4173/search')
  d.say(
    `Search for curry: ${term.searchResults.length} results, each with its photo.`,
  )
  d.load('searchFilter', 'localhost:4173/search', { dur: 0.2 })
  d.say('And the cuisine filter, from those data attributes. Search runs in the browser, against a static index. No server, and no API key.', null, {
    speak: 'And the cuisine filter, from those data attributes. Search runs in the browser, against a static index. No server, and no A P I key.',
  })

  // ── 7. Dead code with knip ──────────────────────────────────────────
  d.chapter(7, 'Dead code with knip')
  d.showEditor()
  d.interrupt()
  d.terminal(330)
  d.say('Last, knip. It finds files, exports and dependencies that nothing uses.', () => {
    d.wait(1.5).run('npm install -D knip', term.installKnip, { wait: 1, dur: 0.3 })
  })
  d.say(
    "On its own it would call the whole site unused, because nothing imports a page. knipConfig, from sitelo/knip, reads sitelo.config.js, and marks pages and islands as entry points.",
    () => d.wait(1).newFile('knip.js').paste('knip.js', files.knip),
  )
  d.highlight('knip.js', d.lineOf('knip.js', "entry: ["))
  d.say("Scripts a page links by URL are the one thing it can't see, so list them. The exclamation mark marks them as production code.", null, {
    speak: "Scripts a page links by U R L are the one thing it can't see, so list them. The exclamation mark marks them as production code.",
  })
  d.unhighlight()
  d.run('npx knip', term.knip1, { wait: 2, dur: 0.2 })
  d.say(
    'And it found something real. getRecipe fetched the recipe of the day, which the island replaced last episode. Delete it,',
    () => d.wait(4).type('src/lib/api.js', files.api, { cps: 40 }),
  )
  d.say('and knip is quiet.', () => d.run('npx knip', '', { wait: 2 }))
  d.say('Add scripts for Lighthouse and knip, and that is all four.', () => {
    d.preload({ 'package.json': files.pkg.installed }).open('package.json')
    d.type('package.json', files.pkg.final, { cps: 45 })
  })

  // ── Recap ───────────────────────────────────────────────────────────
  d.marker('Recap')
  d.open(CONFIG)
  d.say(
    `To recap. sitelo lighthouse audits the real build, and thresholds make it a check. images resized, converted and lazy-loaded every image, and the home page went from ${home.perf} to ${homeAfter.perf}. pagefind plus data-pagefind-body is search with no server. And knipConfig makes knip understand a sitelo site.`,
    null,
    { speak: `To recap. sitelo lighthouse audits the real build, and thresholds make it a check. images resized, converted and lazy-loaded every image, and the home page went from ${home.perf} to ${homeAfter.perf}. pagefind, plus data pagefind body, is search with no server. And knip config makes knip understand a sitelo site.` },
  )
  const endAt = d.t + 14
  d.card('end', {
    title: 'sitelo-ui',
    sub: 'Components, a theme, dark mode, and only the CSS you use.',
    link: 'github.com/Paul-Browne/sitelo/tree/main/videos',
  }, 14)
  d.wait(0.8)
  d.say('Next time: sitelo-ui. We swap most of our CSS for components, add a theme and dark mode, and ship only the CSS we use.')
  d.wait(Math.max(0, endAt - d.t))
}
