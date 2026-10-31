// Episode 4: server islands. Follows videos/04-islands/SCRIPT.md.

import { PROMPT } from '../../lib/director.js'
import * as files from './files.js'

export const meta = {
  title: 'Fresh HTML inside a static page: server islands (sitelo, ep. 4)',
  description: `A static page can't know what time it is when you visit. A server island can: it's a function that renders a fragment of HTML on the server, per request, inside an otherwise static page. No client framework, about 1.7 kB of JavaScript.

Code for every episode: https://github.com/Paul-Browne/sitelo/tree/main/videos
Docs: https://sitelo.js.org`,
}

const npmRun = (script, command) => `\n> ${script}\n> ${command}\n\n`
const reloads = (text) => text.split('\n').filter((line) => /\((ssr|client)\)/.test(line)).join('\n')
const shown = (url) => decodeURIComponent(url.replace(/^https?:\/\//, '')).replace(':4273', ':4173').replace(':5273', ':5173')

export default function episode(d, { term, shots }) {
  const INDEX = 'src/index.ht.js'
  const LAYOUT = 'src/lib/layout.js'
  const SLUG = 'src/recipes/[slug].ht.js'
  const COOKING = 'src/islands/whats-cooking.js'
  const COMMENTS = 'src/islands/comments.js'

  // Where episode 3 left off.
  d.addToTree([...term.tree, 'node_modules/'], { open: ['src'] })
  d.preload({ [INDEX]: files.start.index, [LAYOUT]: files.start.layout, [SLUG]: files.start.slug, 'src/styles.css': files.start.styles })
  d.terminal(250, 0)
  d.setTerminal(`${PROMPT}npm run dev\n${npmRun('dev', 'sitelo')}${term.devStart}`)
  d.open(INDEX)

  d.card('title', { episode: 'Episode 4', title: 'Server islands', sub: 'Fresh HTML inside a static page' }, 5.4)
  d.wait(0.8)
  d.say('Every page so far is built once, ahead of time. This time, part of a page is rendered fresh for every visitor.')
  d.wait(Math.max(0, 5.4 - d.t))

  // ── 1. The problem with build time ──────────────────────────────────
  d.chapter(1, 'The problem with build time')
  d.highlight(INDEX, d.lineOf(INDEX, 'A different recipe each day'), d.lineOf(INDEX, 'const pick ='))
  d.say("Remember this comment from episode two? The recipe of the day only changes when the site is rebuilt.")
  d.say(
    "Everything so far happens once, at build time. That's why the site is fast, and cheap to host. But some things depend on when someone visits.",
  )
  d.unhighlight()

  // ── 2. What an island is ────────────────────────────────────────────
  d.chapter(2, 'What an island is')
  const reveal = []
  const slideStart = d.t
  const steps = {
    title: 'A server island',
    prose: true,
    rows: [
      ['When', 'What happens'],
      ['Build', 'The page is written once, with a placeholder and fallback HTML'],
      ['Visit', 'The browser loads that static page, the same for everyone'],
      ['Load', 'A small script asks the server for the island'],
      ['Request', 'The island function renders fresh HTML on the server'],
      ['Swap', 'The script puts that HTML in place of the fallback'],
    ],
    reveal,
  }
  d.say('An island is a function that returns HTML, like a page. But it runs on the server when the page is requested, not when it is built.', null, { tail: 0.3 })
  const step = (text) => {
    reveal.push(d.t)
    d.say(text, null, { tail: 0.25 })
  }
  step('The page is built once, with a placeholder, and some fallback HTML inside it.')
  step('Every visitor gets that same static page.')
  step('A small script asks the server for the island,')
  step('the island function renders fresh HTML,')
  step('and the script swaps it in.')
  d.say("If the server isn't there, the fallback stays, and the page still works.")
  d.wait(0.4)
  d.tracks.overlays.push({ t0: slideStart, t1: d.t, kind: 'slide', data: steps })

  // ── 3. The first island ─────────────────────────────────────────────
  d.chapter(3, 'The first island')
  d.say("Islands live in src/islands. They're plain JS files, not ht.js, because they're fragments, not pages.", () => {
    d.wait(2.4).newFile(COOKING).paste(COOKING, files.whatsCooking)
  }, { speak: "Islands live in source slash islands. They're plain J S files, not H T dot J S, because they're fragments, not pages." })
  d.highlight(COOKING, d.lineOf(COOKING, 'const mealFor'), d.lineOf(COOKING, "hour < 11"))
  d.say("This one picks a meal from the server's clock: breakfast, lunch, a snack, or dinner.")
  d.highlight(COOKING, d.lineOf(COOKING, 'const res = await fetch'), d.lineOf(COOKING, 'const pick ='))
  d.say('It fetches recipes for that meal, and picks one at random.')
  d.highlight(COOKING, d.lineOf(COOKING, '${recipeCard('))
  d.say("And it returns it as a card, with the same recipeCard function the pages use. Components don't care when they run.")
  d.highlight(COOKING, d.lineOf(COOKING, 'A plain fetch'), d.lineOf(COOKING, 'stay away from build-time helpers'))
  d.say(
    "Notice the plain fetch. An island should get fresh data: that's the point of it. And in production it runs in a serverless function, so it should import as little as possible. fetchWithCache comes from sitelo's main entry, which brings the whole build toolchain with it.",
  )
  d.unhighlight()

  // ── 4. Placing it in a page ─────────────────────────────────────────
  d.chapter(4, 'Placing it in a page')
  d.say('The browser side is two lines in src/islands.js: import mountIslands, and call it.', () => {
    d.wait(1.5).newFile('src/islands.js').type('src/islands.js', files.loader, { cps: 34 })
  })
  d.say('The layout gets an islands option that links that script, so only pages with islands load it.', () => {
    d.wait(0.5).type(LAYOUT, files.layout, { cps: 55 })
  })
  d.say(
    "On the home page, the recipe-of-the-day code goes, and the island goes in its place: island, its name, its props, and fallback HTML.",
    () => d.wait(0.5).type(INDEX, files.index, { cps: 60 }),
  )
  d.highlight(INDEX, d.lineOf(INDEX, "island('whats-cooking'"))
  d.say(
    "The fallback is real HTML, something useful, not a spinner. It's what a visitor sees if JavaScript is off, or if the island fails.",
  )
  d.unhighlight()
  d.print(reloads(term.devHome), { dur: 0.2 })

  // ── 5. Seeing it work ───────────────────────────────────────────────
  d.chapter(5, 'Seeing it work')
  d.showBrowser()
  d.load('home1', 'localhost:5173')
  d.scrollTo(shots.home1.boxes.pick.y - 140, 1.4)
  d.say(`It's evening on the server, so it suggests dinner. Refresh,`)
  d.load('home2', 'localhost:5173', { dur: 0.3 })
  d.scrollTo(shots.home2.boxes.pick.y - 140, 0)
  d.say('and you get something else.')
  d.showEditor()
  d.say("Let's look at what the server actually sends. In a second terminal, fetch the home page, and pick out that section.", () => {
    d.wait(2).terminalTab('zsh 2').terminal(420)
    d.run(term.placeholderCommand, term.placeholder.replace(/\n+$/, ''), { wait: 0.4, dur: 0.1 })
  })
  d.say('The placeholder, with the fallback inside. No recipe.')
  d.say('And this is what the script fetches: slash underscore sitelo, slash islands, slash whats-cooking. A fragment of HTML.', () => {
    d.wait(0.5).run('curl -s localhost:5173/_sitelo/islands/whats-cooking', term.fragment.trim(), { wait: 0.4, dur: 0.1 })
  }, { speak: "And this is what the script fetches: slash underscore sitelo, slash islands, slash what's cooking. A fragment of H T M L." })
  d.say('The page is the same static file for everyone. Only the island is rendered per request.')

  // ── 6. Props, and loading on scroll ─────────────────────────────────
  d.chapter(6, 'Props, and loading on scroll')
  d.terminalTab('zsh').terminal(250)
  d.say('Now comments on every recipe page, from a second island.', () => {
    d.wait(1).newFile(COMMENTS).paste(COMMENTS, files.comments)
  })
  d.highlight(COMMENTS, d.lineOf(COMMENTS, 'export default async function comments'), d.lineOf(COMMENTS, 'if (!Number.isInteger'))
  d.say('This one takes props: which recipe to show comments for.')
  d.unhighlight()
  d.say(
    "On the recipe page, place it with the recipe's id as a prop, and when set to visible.",
    () => d.wait(0.6).type(SLUG, files.slug, { cps: 60 }),
  )
  d.highlight(SLUG, d.lineOf(SLUG, "island('comments'"), d.lineOf(SLUG, "when: 'visible'"))
  d.say(
    "Props are serialized into the placeholder, and sent back with the request. when visible waits until the island scrolls into view. There's also idle, and the default, load, which fetches straight away.",
  )
  d.unhighlight()
  d.paste('src/styles.css', files.styles)
  d.print(reloads(term.devComments), { dur: 0.2 })
  d.showBrowser()
  d.load('recipeFallback', 'localhost:5173/recipes/classic-margherita-pizza')
  d.say("Open a recipe. Nothing has asked for comments yet. Scroll down,", () => {
    d.wait(1.8).scrollTo('bottom', 3)
  })
  d.load('recipeComments', 'localhost:5173/recipes/classic-margherita-pizza', { dur: 0.2 })
  d.scrollTo('bottom', 0)
  d.say('and as the section comes into view, the island loads.')
  d.load('mango', 'localhost:5173/recipes/mango-salsa-chicken', { dur: 0.3 })
  d.scrollTo('bottom', 1.5)
  d.say('A recipe with no comments gets an empty state, from the same island.')

  // ── 7. Props are untrusted ──────────────────────────────────────────
  d.chapter(7, 'Props are untrusted')
  d.load('props1', shown(term.propsUrls[0]))
  d.say('Here is the request the comments island made, with its props in the URL.', null, {
    speak: 'Here is the request the comments island made, with its props in the U R L.',
  })
  d.load('props2', shown(term.propsUrls[1]))
  d.say('Change the recipe id to 2, and you get different comments.', null, { speak: 'Change the recipe I D to two, and you get different comments.' })
  d.showEditor()
  d.open(COMMENTS)
  d.highlight(COMMENTS, d.lineOf(COMMENTS, 'Props come from the browser'), d.lineOf(COMMENTS, 'if (!Number.isInteger'))
  d.say(
    'Props travel through the browser, so anyone can change them. Treat them like a query string: check the type, and escape what comes back.',
  )
  d.unhighlight()
  d.say(
    "Here that's fine: they're public comments. If props ever pick something private, set SITELO_ISLANDS_SECRET. sitelo then signs every placeholder at build time, and rejects anything else. We turn that on in episode seven.",
    null,
    { speak: "Here that's fine: they're public comments. If props ever pick something private, set the sitelo islands secret variable. sitelo then signs every placeholder at build time, and rejects anything else. We turn that on in episode seven." },
  )

  // ── 8. What the build ships ─────────────────────────────────────────
  d.chapter(8, 'What the build ships')
  d.closeAll()
  d.terminal(640)
  d.say('Stop the dev server, and build.', () => {
    d.wait(0.6).interrupt().wait(0.3)
    d.run('npm run build', term.build, { wait: 0.8, dur: 1.4 })
  })
  d.say('There is now one JavaScript file, at 1.7 kB. That is the whole client side of islands.', null, {
    speak: 'There is now one JavaScript file, at one point seven kilobytes. That is the whole client side of islands.',
  })
  d.say("In dist, islands.js is there, but the island modules aren't. They're server code, and never ship.", () => {
    d.wait(0.8).run('ls dist', term.ls, { wait: 0.3, dur: 0.1 })
  })
  d.say('Preview serves the islands too.', () => {
    d.wait(0.5).typeCommand('npm run preview').wait(0.6).print(npmRun('preview', 'sitelo preview') + term.preview, { dur: 0.2 })
  })
  d.showBrowser()
  d.load('preview', 'localhost:4173')
  d.scrollTo(shots.preview.boxes.pick.y - 140, 1.4)
  d.say(
    "A static host can't run them on its own, though. In episode seven, we deploy with the small function that does.",
  )

  // ── Recap ───────────────────────────────────────────────────────────
  d.marker('Recap')
  d.showEditor()
  d.open(INDEX)
  d.say(
    'To recap. Islands are functions in src/islands that render on the server, per request. island places one in a page, and mountIslands loads them. And props are untrusted input: validate them, and sign them when it matters.',
    () => d.wait(3).highlight(INDEX, d.lineOf(INDEX, "island('whats-cooking'")),
  )
  d.unhighlight()
  const endAt = d.t + 14
  d.card('end', {
    title: 'Add-ons',
    sub: 'Lighthouse, image optimization, Pagefind search, and knip.',
    link: 'github.com/Paul-Browne/sitelo/tree/main/videos',
  }, 14)
  d.wait(0.8)
  d.say(
    "Next time: add-ons. Lighthouse tells us what's slow, image optimization fixes it, Pagefind adds search, and knip finds code we no longer need.",
  )
  d.wait(Math.max(0, endAt - d.t))
}
