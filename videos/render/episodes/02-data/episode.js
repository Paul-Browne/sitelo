// Episode 2: fetching data. Follows videos/02-data/SCRIPT.md.

import { PROMPT } from '../../lib/director.js'
import * as files from './files.js'

export const meta = {
  title: 'Fetch API data at build time (sitelo, ep. 2)',
  description: `A sitelo page can export a data() function. It runs at build time, and whatever it returns is handed to the page. We use it to load recipes from a public API, cache the requests, and render them through a card component, which is just another function.

Code for every episode: https://github.com/Paul-Browne/sitelo/tree/main/videos
Docs: https://sitelo.js.org`,
}

const npmRun = (script, command) => `\n> ${script}\n> ${command}\n\n`
const totalMs = (output) => output.match(/total (\d+)ms/)[1]

export default function episode(d, { term, shots }) {
  const INDEX = 'src/index.ht.js'
  const API = 'src/lib/api.js'
  const CARD = 'src/lib/recipe-card.js'

  // Where episode 1 left off: its files, and the dev server running.
  d.addToTree([...term.tree, 'node_modules/'], { open: ['src', 'src/lib'] })
  d.preload({ [INDEX]: files.start.index, 'src/lib/layout.js': files.start.layout, 'src/styles.css': files.start.styles })
  d.terminal(250, 0)
  d.setTerminal(`${PROMPT}npm run dev\n${npmRun('dev', 'sitelo')}${term.devStart}`)

  d.card('title', { episode: 'Episode 2', title: 'Fetching data', sub: 'Recipes from an API, at build time' }, 5.4)
  d.wait(0.8)
  d.say('Last time, we built a two-page site. This time it gets real data: fifty recipes from an API, fetched when the site is built.')
  d.wait(Math.max(0, 5.4 - d.t))

  // ── 1. Where the data comes from ────────────────────────────────────
  d.chapter(1, 'Where the data comes from')
  d.showBrowser()
  d.load('api', 'dummyjson.com/recipes?limit=1')
  d.say('The recipes come from DummyJSON, a free fake-data API. No key, and no sign-up.')
  d.say(
    "Each recipe has a name, a cuisine, meal types, prep and cook times, a rating, and a photo. By episode six, we'll have used every one of those fields.",
    () => d.wait(1).scrollTo('bottom', 8),
  )

  // ── 2. An API module ────────────────────────────────────────────────
  d.chapter(2, 'An API module')
  d.showEditor()
  d.say('All the fetching lives in one module, src/lib/api.js.', () => {
    d.wait(1.8).newFile(API).paste(API, files.api)
  })
  d.highlight(API, d.lineOf(API, 'async function get'), d.lineOf(API, 'return res.json()'))
  d.say(
    'fetchWithCache comes from sitelo. It takes the same arguments as fetch, plus options of its own. Here, keep each response for an hour.',
  )
  d.say(
    'Why cache? In dev, a page renders on every request. And during a build, lots of pages ask for the same URL. One request is enough.',
  )
  d.highlight(API, d.lineOf(API, 'export async function getRecipes'), d.lineOf(API, 'return recipes'))
  d.say('limit=0 asks DummyJSON for everything: all fifty recipes.', null, {
    speak: 'Limit equals zero asks Dummy JSON for everything: all fifty recipes.',
  })
  d.highlight(API, d.lineOf(API, 'export async function getRecipe('), d.lineOf(API, 'return get(`/recipes/${id}`)'))
  d.say('And getRecipe fetches one recipe by its id.', null, { speak: 'And get recipe fetches one recipe by its I D.' })
  d.unhighlight()
  d.say(
    "This file lives in src/lib, and no page links it with a script tag, so it never reaches the browser. That matters when a module like this holds an API key.",
  )

  // ── 3. data() on the home page ──────────────────────────────────────
  d.chapter(3, 'data() on the home page')
  d.say('In index.ht.js, import the two functions, and export an async function called data.', () => {
    d.wait(1).type(INDEX, files.index.dataOnly, { cps: 48 })
  })
  d.highlight(INDEX, d.lineOf(INDEX, 'export async function data'), d.lineOf(INDEX, 'return { topRated, pick }') + 1)
  d.say(
    'It loads every recipe, sorts out the six best rated, and picks a recipe of the day.',
  )
  d.highlight(INDEX, d.lineOf(INDEX, 'export default ({ page, data })'))
  d.say(
    'data runs before the page renders: at build time, or on every request in dev. Whatever it returns arrives in the page function, as data.',
  )
  d.say("It's async, so it can fetch, read files, or query a database. And none of that code reaches the browser.")
  d.highlight(INDEX, d.lineOf(INDEX, 'A different recipe each day'))
  d.say(
    "Read that comment again. The recipe of the day is only of the day if the site is rebuilt every day. Episode four fixes that properly.",
  )
  d.unhighlight()
  d.say("For now, show the pick's name under the hero.", () => {
    d.wait(0.5).type(INDEX, files.index.data, { cps: 40 })
  })
  d.print(term.devData, { dur: 0.2 })
  d.showBrowser()
  d.load('data', 'localhost:5173')
  d.scrollTo(shots.data.boxes.pick.y - 380, 1.4)
  d.say("There's the recipe of the day.")

  // ── 4. Escape what you didn't write ─────────────────────────────────
  d.chapter(4, "Escape what you didn't write")
  d.showEditor()
  d.say(
    "There's a catch. In javascript-to-html, children are inserted as HTML, because that's how elements nest. Attribute values are escaped for you. Children aren't.",
  )
  d.say('So here is a small escapeHtml function.', () => {
    d.wait(0.6).newFile('src/lib/escape.js').paste('src/lib/escape.js', files.escape)
  }, { speak: 'So here is a small escape H T M L function.' })
  d.say(
    'Text from the API goes through it before it becomes a child. If the API ever returned a script tag, it would show up as text, instead of running.',
    () => d.wait(0.5).type(INDEX, files.index.escaped, { cps: 40 }),
  )
  d.print(term.devEscaped, { dur: 0.2 })
  d.say("The rule of thumb: escape anything you didn't write yourself.")

  // ── 5. A card component ─────────────────────────────────────────────
  d.chapter(5, 'A card component')
  d.say('Each recipe needs a card. A component is just a function that takes data and returns HTML. No props system, and no framework.', () => {
    d.wait(1.5).newFile(CARD).paste(CARD, files.card)
  })
  d.highlight(CARD, d.lineOf(CARD, 'export const totalTime'))
  d.say('totalTime adds the prep and cook times together. The home page will use it too.', null, {
    speak: 'total time adds the prep and cook times together. The home page will use it too.',
  })
  d.unhighlight()
  d.say(
    "Back on the home page, give the pick its total time and servings, and add a Top rated section. map sends each recipe through recipeCard. It returns an array, and javascript-to-html flattens it.",
    () => d.wait(1.2).type(INDEX, files.index.cards, { cps: 48 }),
    { speak: "Back on the home page, give the pick its total time and servings, and add a Top rated section. map sends each recipe through recipe card. It returns an array, and javascript to H T M L flattens it." },
  )
  d.highlight(INDEX, d.lineOf(INDEX, 'data.topRated.map(recipeCard)'))
  d.wait(0.8)
  d.unhighlight()
  d.say('A few rules for the grid and the cards.', () => {
    d.wait(0.4).paste('src/styles.css', files.styles)
  })
  d.print(term.devCards, { dur: 0.2 })
  d.showBrowser()
  d.load('cards', 'localhost:5173')
  d.scrollTo(shots.cards.boxes.pick.y - 120, 1.6)
  d.say('Six cards, best rated first, and the recipe of the day above them.')

  // ── 6. A page with every recipe ─────────────────────────────────────
  d.chapter(6, 'A page with every recipe')
  d.showEditor()
  d.say('A page with every recipe is one more file, recipes.ht.js, with its own data function.', () => {
    d.wait(1.6).newFile('src/recipes.ht.js').paste('src/recipes.ht.js', files.recipes)
  })
  d.say('Add it to the nav,', () => d.type('src/lib/layout.js', files.layout, { cps: 40 }))
  d.say("and point the home page's button at it.", () => d.type(INDEX, files.index.final, { cps: 40 }))
  d.print(term.devRecipes, { dur: 0.2 })
  d.showBrowser()
  d.load('home', 'localhost:5173', { dur: 0.3 })
  d.moveTo(d.pagePoint('recipesLink'), 0.8).click()
  d.hideCursor()
  d.load('recipes', 'localhost:5173/recipes')
  d.say('All fifty recipes.', () => d.wait(0.6).scrollTo('bottom', 11, { linear: true }))
  d.say(
    "Those photos come straight from DummyJSON, at 100 to 480 kB each. That's several megabytes for one page. We'll fix it in episode five.",
  )

  // ── 7. The cache, and dev vs build ──────────────────────────────────
  d.chapter(7, 'The cache, and dev vs build')
  d.showEditor()
  d.closeAll()
  d.terminal(640)
  d.say("Let's see the cache at work. Stop the dev server, clear the cache, and build.", () => {
    d.wait(0.8).interrupt().wait(0.3)
    d.run('rm -rf node_modules/.cache', '', { wait: 0.3 })
    d.run('npm run build', term.buildCold, { wait: 0.9, dur: 1 })
  })
  d.say(`The first build fetched from the API, and took ${totalMs(term.buildCold)} milliseconds.`)
  d.run('npm run build', term.buildWarm, { wait: 0.5, dur: 1 })
  d.say(`Build again, and it takes ${totalMs(term.buildWarm)}, without touching the network.`)
  d.say('During a build, responses are cached on disk, here, so the next build can reuse them. In dev, the cache is kept in memory.', () => {
    d.wait(2.2).run('ls node_modules/.cache/sitelo/fetch', term.cacheLs, { wait: 0.3, dur: 0.1 })
  })
  d.say("Error responses are never cached, so one flaky build can't poison the next one.")
  d.say(
    'And if your content lives in the repo rather than in an API, readJson and readJsonCollection, from sitelo/data, do the same job for JSON files.',
    null,
    { speak: 'And if your content lives in the repo rather than in an API, read JSON and read JSON collection, from sitelo slash data, do the same job for JSON files.' },
  )

  // ── Recap ───────────────────────────────────────────────────────────
  d.marker('Recap')
  d.terminal(250)
  d.open(INDEX)
  d.say(
    "To recap. export an async function called data to load what a page needs. It runs at build time, and never ships. fetchWithCache stops the build asking for the same thing twice. And escape the text you didn't write.",
    () => d.wait(1).highlight(INDEX, d.lineOf(INDEX, 'export async function data'), d.lineOf(INDEX, 'return { topRated, pick }') + 1),
    { speak: "To recap. export an async function called data to load what a page needs. It runs at build time, and never ships. fetch with cache stops the build asking for the same thing twice. And escape the text you didn't write." },
  )
  d.unhighlight()
  const endAt = d.t + 14
  d.card('end', {
    title: 'Routing',
    sub: 'One file becomes fifty recipe pages. Plus cuisines, a catch-all route, a 404 page and a sitemap.',
    link: 'github.com/Paul-Browne/sitelo/tree/main/videos',
  }, 14)
  d.wait(0.8)
  d.say(
    "Next time: routing. One file becomes fifty recipe pages, and we'll add cuisines, a catch-all route, a 404 page, and a sitemap. See you there.",
  )
  d.wait(Math.max(0, endAt - d.t))
}
