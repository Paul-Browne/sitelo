// Episode 7: deploying. Follows videos/07-deploy/SCRIPT.md, except that
// nothing is deployed on camera: no real or mocked-up Netlify screens. The
// Netlify steps are a checklist; everything that can be run here is real.

import { PROMPT } from '../../lib/director.js'
import { scores, strip } from '../../lib/output.js'
import { callFunction } from './capture.js'
import * as files from './files.js'

export const meta = {
  title: 'Deploy a static site with server islands to Netlify (sitelo, ep. 7)',
  description: `The last episode. We get the recipe site ready for Netlify (static pages plus one function for the server islands), sign island props, rebuild daily to keep the data fresh, and run the build, knip and Lighthouse in CI.

Code for every episode: https://github.com/Paul-Browne/sitelo/tree/main/videos
Docs: https://sitelo.js.org`,
}

const npmRun = (script, command) => `\n> ${script}\n> ${command}\n\n`

export default function episode(d, { term, shots }) {
  const CONFIG = 'sitelo.config.js'
  const FN = 'netlify/functions/islands.mjs'

  // Where episode 6 left off.
  d.addToTree([...term.tree, 'node_modules/', 'dist/'], { open: ['src'] })
  d.preload(files.start)
  d.terminal(330, 0)
  d.setTerminal('', { prompt: true })

  d.card('title', { episode: 'Episode 7', title: 'Deploying', sub: 'Static pages, plus one small function' }, 5.4)
  d.wait(0.8)
  d.say('The last episode. Weeknight Kitchen is ready for the internet: static pages, plus one small function for the islands.')
  d.wait(Math.max(0, 5.4 - d.t))

  // ── 1. What we're deploying ─────────────────────────────────────────
  d.chapter(1, "What we're deploying")
  const slideStart = d.t
  d.say('There are four parts. dist is plain files, so any static host can serve it.', null, { tail: 0.3 })
  d.say('The islands are the one part that needs a server. On Netlify, that is a function, about a dozen lines.', null, { tail: 0.3 })
  d.say("The data is fetched at build time, so we'll rebuild every day. And CI checks every push.")
  d.wait(0.4)
  d.tracks.overlays.push({
    t0: slideStart,
    t1: d.t,
    kind: 'slide',
    data: {
      title: 'What we deploy',
      prose: true,
      rows: [
        ['Part', 'Where it runs'],
        ['dist/', 'Any static host: plain files'],
        ['Islands', 'A function, on the same domain'],
        ['Data', 'Fetched at build time: rebuild daily'],
        ['Checks', 'CI on every push: build, knip, Lighthouse'],
      ],
    },
  })

  // ── 2. dist is just files ───────────────────────────────────────────
  d.chapter(2, 'dist is just files')
  d.say("To prove it, build, and serve dist with the plainest server there is: Python's.", () => {
    d.wait(2).run('npm run build', term.build, { wait: 0.8, dur: 1.2 })
    d.typeCommand('python3 -m http.server --directory dist').wait(0.4).print(term.serve, { dur: 0.1 })
  })
  d.showBrowser()
  d.load('staticHome', 'localhost:8000')
  d.say('Pages and images work,', () => d.wait(0.6).scrollTo(500, 2.5))
  d.load('staticSearch', 'localhost:8000/search')
  d.say('and so does search: it was all built ahead of time.')
  d.load('staticRecipe', 'localhost:8000/recipes/classic-margherita-pizza')
  d.scrollTo('bottom', 2.5)
  d.showEditor()
  const log = strip(term.serveLog).split('\n')
  const islandLines = log.filter((line) => line.includes('/_sitelo/islands/'))
  d.print([...log.slice(0, 3), ...islandLines].join('\n'), { dur: 0.3 })
  d.say(
    "What a plain file server can't do is run the islands. The script asks for them, gets a 404, and the fallbacks stay, the skeletons. Nothing breaks: those two sections just never fill in.",
  )
  d.interrupt()

  // ── 3. Deploying from Git ───────────────────────────────────────────
  d.chapter(3, 'Deploying from Git')
  d.terminal(250)
  d.say('For Netlify, a netlify.toml: the build command, the folder to publish, and the Node version.', () => {
    d.wait(1.5).newFile('netlify.toml').type('netlify.toml', files.netlifyToml, { cps: 40 })
  })
  d.say('sitelo needs Node 20.19 or later, so pin it.', null, { speak: 'sitelo needs Node twenty point nineteen or later, so pin it.' })
  d.say(
    "And Netlify sets URL to the site's address during its builds, so the sitemap gets the real domain without hard-coding it.",
    () => d.wait(1).open(CONFIG).type(CONFIG, files.config, { cps: 45 }),
    { speak: "And Netlify sets U R L to the site's address during its builds, so the sitemap gets the real domain without hard-coding it." },
  )
  const gitStart = d.t
  d.say(
    "Then push the project to GitHub. In Netlify, add a new site, import an existing project, and pick the repo. Netlify reads netlify.toml, so there's nothing else to fill in.",
  )
  d.wait(0.4)
  d.tracks.overlays.push({
    t0: gitStart,
    t1: d.t,
    kind: 'slide',
    data: {
      title: 'In Netlify',
      prose: true,
      rows: [
        ['Step', ''],
        ['1', 'Push the project to GitHub'],
        ['2', 'Add new site → Import an existing project'],
        ['3', 'Pick the repo. netlify.toml fills in the rest'],
      ],
    },
  })

  // ── 4. A function for the islands ───────────────────────────────────
  d.chapter(4, 'A function for the islands')
  d.say('Now the function, in netlify/functions/islands.mjs.', () => {
    d.wait(1.2).newFile(FN).paste(FN, files.fn)
  }, { speak: 'Now the function, in netlify slash functions slash islands dot M J S.' })
  d.highlight(FN, d.lineOf(FN, 'const handleIslands'), d.lineOf(FN, 'comments: () =>') + 2)
  d.say("It's built with createIslandsHandler, from the same island modules the dev server uses.")
  d.highlight(FN, d.lineOf(FN, 'export default async'), d.lineOf(FN, "?? new Response('Not found'"))
  d.say("The handler takes a web Request, and returns a Response, or null if the request isn't for an island.")
  d.highlight(FN, d.lineOf(FN, 'export const config'))
  d.say('And config.path puts the function on the URL the browser already calls.', null, {
    speak: 'And config dot path puts the function on the U R L the browser already calls.',
  })
  d.unhighlight()
  d.say(
    'This is why the islands use plain fetch. The function bundles sitelo/islands/server, sitelo/ui and javascript-to-html. Not the build toolchain.',
    null,
    { speak: 'This is why the islands use plain fetch. The function bundles sitelo islands server, sitelo U I, and javascript to H T M L. Not the build toolchain.' },
  )
  d.terminal(460)
  d.say('Call it the way Netlify does, with a Request.', () => {
    d.wait(1.5).run(callFunction('http://localhost/_sitelo/islands/whats-cooking'), term.callCooking.trim(), { wait: 0.8, dur: 0.2 })
  })
  d.say("A 200, a fresh render marked no-store, so it's never cached, and the island's HTML.")
  d.run(callFunction('http://localhost/about'), term.callNothing.trim(), { wait: 0.8, dur: 0.1 })
  d.say('Anything else, and the handler returns null, so the function says not found.')
  d.terminal(250)
  d.say('Add the function to knip\'s entries, or knip reports it as unused.', () => {
    d.wait(0.8).open('knip.js').type('knip.js', files.knip, { cps: 45 })
  })

  // ── 5. Signing island props ─────────────────────────────────────────
  d.chapter(5, 'Signing island props')
  d.terminal(460)
  d.say('Next, sign the props. Make a secret.', () => d.wait(1).run('openssl rand -hex 32', term.secret, { wait: 0.4, dur: 0.1 }))
  d.say(
    'In Netlify, add it to the environment variables as SITELO_ISLANDS_SECRET, for builds and for functions. The same variable is read at build time and at runtime, so setting it once covers both.',
    null,
    { speak: 'In Netlify, add it to the environment variables as the sitelo islands secret, for builds and for functions. The same variable is read at build time and at runtime, so setting it once covers both.' },
  )
  d.say('Here, export it, and build.', () => {
    d.wait(0.4).run(`export SITELO_ISLANDS_SECRET=${term.secret}`, '', { wait: 0.2 })
    d.run('npm run build', term.buildSigned, { wait: 0.8, dur: 1 })
  })
  d.say("The comments placeholder now carries a signature.", () => {
    d.wait(0.5).run(
      `grep -o '<div data-sitelo-island="comments"[^>]*>' dist/recipes/classic-margherita-pizza/index.html`,
      term.placeholder.trim(),
      { wait: 0.3, dur: 0.1 },
    )
  })
  d.say('Ask for those exact props, and the function renders them.', () => {
    d.wait(0.5).run(callFunction(term.signedUrl), term.callSigned.trim().split('\n').slice(0, 2).join('\n'), { wait: 0.8, dur: 0.1 })
  })
  d.say('Change the recipe id, and the signature no longer matches. 403.', () => {
    d.wait(0.5).run(callFunction(term.tamperedUrl), term.callTampered.trim(), { wait: 0.8, dur: 0.1 })
  }, { speak: 'Change the recipe I D, and the signature no longer matches. Four oh three.' })
  d.say(
    "The signature covers the island's name too, so it can't be replayed against another island. And signing proves the props came from your build. It doesn't hide them. They're still in the HTML, so never put secrets in props.",
  )

  // ── 6. Other hosts ──────────────────────────────────────────────────
  d.chapter(6, 'Other hosts')
  const hostsStart = d.t
  d.say('Netlify is one choice. The sitelo repo has config for more than a dozen hosts in examples/basic.', null, { tail: 0.3 })
  d.say('On Vercel, a vercel.json, and a function for the islands. Cloudflare serves dist from a wrangler file.', null, { tail: 0.3 })
  d.say('GitHub Pages is static only, so the islands keep their fallbacks.', null, { tail: 0.3 })
  d.say("And on your own server, createIslandsNodeHandler serves dist and the islands together. examples/islands has that, and the Vercel version.")
  d.wait(0.4)
  d.tracks.overlays.push({
    t0: hostsStart,
    t1: d.t,
    kind: 'slide',
    data: {
      title: 'Other hosts',
      prose: true,
      rows: [
        ['Host', 'Islands'],
        ['Vercel', 'vercel.json, plus api/islands/[...path].js'],
        ['Cloudflare', 'wrangler.jsonc serves dist/'],
        ['GitHub Pages', 'Static only: fallbacks stay'],
        ['Your server', 'createIslandsNodeHandler'],
      ],
    },
  })

  // ── 7. Keeping the data fresh ───────────────────────────────────────
  d.chapter(7, 'Keeping the data fresh')
  d.terminal(250)
  d.say(
    "Recipes are fetched at build time. If the API changes, the site doesn't, until it's rebuilt. So rebuild every morning.",
    () => d.wait(2.5).newFile('.github/workflows/rebuild.yml').paste('.github/workflows/rebuild.yml', files.rebuild),
    { speak: "Recipes are fetched at build time. If the A P I changes, the site doesn't, until it's rebuilt. So rebuild every morning." },
  )
  d.say(
    "In Netlify, add a build hook, and save its URL as a GitHub secret called NETLIFY_BUILD_HOOK. This workflow posts to it every day at five, and you can run it by hand too.",
    null,
    { speak: "In Netlify, add a build hook, and save its U R L as a GitHub secret called netlify build hook. This workflow posts to it every day at five, and you can run it by hand too." },
  )

  // ── 8. CI ───────────────────────────────────────────────────────────
  d.chapter(8, 'CI')
  d.say('And CI: on every push, install, build, run knip, and run Lighthouse.', () => {
    d.wait(1).newFile('.github/workflows/ci.yml').paste('.github/workflows/ci.yml', files.ci)
  })
  d.terminal(560)
  d.say("Here are the same commands, locally.", () => {
    d.wait(0.5).run('npm run knip', term.knip.replace(/\n+$/, ''), { wait: 1.5, dur: 0.1 })
    d.run('npm run lighthouse', term.lighthouse, { wait: 3, dur: 0.5 })
  })
  const perfect = scores(term.lighthouse).every((row) => row.perf + row.a11y + row.best + row.seo === 400)
  d.say(perfect ? 'knip is quiet, and Lighthouse is 100 everywhere.' : 'knip is quiet, and Lighthouse passes.')
  d.say(
    "In CI, a broken link, a missing asset, dead code, or an accessibility regression fails the check before it reaches the site. GitHub's Ubuntu runners already have Chrome, which Lighthouse needs. And this is why performance has no threshold: a shared runner scores lower than your laptop, every time.",
  )

  // ── 9. That's the series ────────────────────────────────────────────
  d.chapter(9, "That's the series")
  d.showBrowser()
  d.load('finalHome', 'localhost:4173')
  d.say(
    'Seven episodes. Functions that return HTML, data at build time, routes from file names, islands for what has to be fresh, add-ons for speed, search and hygiene, a component library, and a deploy.',
    () => d.wait(0.5).scrollTo('bottom', 9, { linear: true }),
  )
  d.load('finalRecipe', 'localhost:4173/recipes/thai-green-curry')
  d.say('And every page is still a function that returns a string.', () => d.scrollTo(900, 4))
  d.load('finalHomeDark', 'localhost:4173', { dur: 0.3 })
  d.wait(1.5)
  d.load('finalCuisinesDark', 'localhost:4173/cuisines', { dur: 0.3 })
  d.wait(1.5)
  const endAt = d.t + 14
  d.card('end', {
    label: "That's the series",
    title: 'Thanks for watching',
    sub: 'Every page is still a function that returns a string.',
    link: 'github.com/Paul-Browne/sitelo/tree/main/videos',
  }, 14)
  d.wait(0.8)
  d.say("The code for every episode is linked below. Tell me in the comments what you'd like to see next. Thanks for watching.")
  d.wait(Math.max(0, endAt - d.t))
}
