// Episode 3: routing. Follows videos/03-routing/SCRIPT.md.

import { PROMPT } from '../../lib/director.js'
import * as files from './files.js'

export const meta = {
  title: 'File-based routing, from one page to 121 (sitelo, ep. 3)',
  description: `Dynamic routes, generateStaticParams, optional catch-all routes, route groups and a custom 404, all from file names. Then we turn on the sitemap and a link checker that fails the build on a dead link.

Code for every episode: https://github.com/Paul-Browne/sitelo/tree/main/videos
Docs: https://sitelo.js.org`,
}

const npmRun = (script, command) => `\n> ${script}\n> ${command}\n\n`
/** Just the dev server's reload lines, not error output from earlier visits. */
const reloads = (text) => text.split('\n').filter((line) => /\((ssr|client)\)/.test(line)).join('\n')
/** An error block, up to the line in our own source. */
const firstError = (text, file) => {
  const lines = text.split('\n')
  return lines.slice(0, lines.findIndex((line) => line.includes(file)) + 1).join('\n')
}

export default function episode(d, { term, shots }) {
  const INDEX = 'src/index.ht.js'
  const RECIPES = 'src/recipes/index.ht.js'
  const SLUG = 'src/recipes/[slug].ht.js'
  const CATCH = 'src/cuisines/[...path]?.ht.js'
  const LAYOUT = 'src/lib/layout.js'

  // Where episode 2 left off.
  d.addToTree([...term.tree, 'node_modules/'], { open: ['src', 'src/lib'] })
  d.preload({
    [INDEX]: files.start.index,
    'src/recipes.ht.js': files.start.recipes,
    'src/lib/api.js': files.start.api,
    'src/lib/recipe-card.js': files.start.card,
    [LAYOUT]: files.start.layout,
    'src/styles.css': files.start.styles,
  })
  d.terminal(250, 0)
  d.setTerminal(`${PROMPT}npm run dev\n${npmRun('dev', 'sitelo')}${term.devStart}`)

  d.card('title', { episode: 'Episode 3', title: 'Routing', sub: 'From four pages to 121, all from file names' }, 5.4)
  d.wait(0.8)
  d.say('So far the site has four pages. By the end of this video it has a hundred and twenty-one, and every one of them comes from a file name.')
  d.wait(Math.max(0, 5.4 - d.t))

  // ── 1. The plan ─────────────────────────────────────────────────────
  d.chapter(1, 'The plan')
  const reveal = []
  const plan = {
    title: 'File → URL',
    rows: [
      ['File', 'URL'],
      ['recipes/index.ht.js', '/recipes'],
      ['recipes/[slug].ht.js', '/recipes/classic-margherita-pizza'],
      ['recipes/quick.ht.js', '/recipes/quick'],
      ['cuisines/[...path]?.ht.js', '/cuisines/italian/dinner'],
      ['(legal)/privacy.ht.js', '/privacy'],
      ['404.ht.js', '404.html'],
    ],
    reveal,
  }
  const slideStart = d.t
  const step = (text, speak) => {
    reveal.push(d.t)
    d.say(text, null, { speak, tail: 0.25 })
  }
  d.say("Here's the plan. Pages are still files, and a file's path decides its URL.", null, { tail: 0.3 })
  step('A folder with an index file.')
  step('A parameter in square brackets, for fifty recipe pages.')
  step('A static page right beside it.')
  step('A catch-all for cuisines, at any depth.')
  step("A folder in parentheses that doesn't count.")
  step('And a 404 page.')
  d.wait(0.6)
  d.tracks.overlays.push({ t0: slideStart, t1: d.t, kind: 'slide', data: plan })

  // ── 2. Index routes ─────────────────────────────────────────────────
  d.chapter(2, 'Index routes')
  d.say('Start with the recipes page. Move recipes.ht.js into a new recipes folder, and call it index.ht.js.', () => {
    d.wait(3).removeFromTree('src/recipes.ht.js').addToTree(RECIPES, { open: 'src/recipes' })
    d.preload({ [RECIPES]: files.start.recipes }).open(RECIPES)
  })
  d.say('Its imports are one folder deeper now.', () => d.type(RECIPES, files.recipes.moved, { cps: 30 }))
  d.say(
    'recipes.ht.js and recipes/index.ht.js are the same URL, slash recipes. Use the folder once a section has more than one page.',
  )

  // ── 3. Slugs ────────────────────────────────────────────────────────
  d.chapter(3, 'Slugs')
  d.say('Recipe pages need URLs people can read. A slug turns "Classic Margherita Pizza" into classic-margherita-pizza.', () => {
    d.wait(2.5).newFile('src/lib/slug.js').paste('src/lib/slug.js', files.slug)
  }, { speak: 'Recipe pages need U R L\'s people can read. A slug turns Classic Margherita Pizza into classic, margherita, pizza, with dashes.' })
  d.say('Every recipe gets one when the list is fetched,', () => d.type('src/lib/api.js', files.api, { cps: 42 }))
  d.say(
    "and the card becomes a link to it. The same function builds the link and the route, so the two can't disagree.",
    () => d.type('src/lib/recipe-card.js', files.card, { cps: 42 }),
  )
  d.say('The recipe of the day links to its page too.', () => d.type(INDEX, files.index, { cps: 46 }))

  // ── 4. A page per recipe ────────────────────────────────────────────
  d.chapter(4, 'A page per recipe: [slug]')
  d.say('Now the recipe page itself: recipes/[slug].ht.js. Square brackets make a parameter.', () => {
    d.wait(1.5).newFile(SLUG)
  }, { speak: 'Now the recipe page itself: recipes, slash, slug in square brackets, dot H T dot J S. Square brackets make a parameter.' })
  d.type(SLUG, files.recipePage.params, { cps: 52 })
  d.highlight(SLUG, d.lineOf(SLUG, 'export async function generateStaticParams'), d.lineOf(SLUG, 'return recipes.map'))
  d.say('generateStaticParams tells the build which pages to write: one object per page, each with a slug. Fifty here.')
  d.unhighlight()
  d.say("data gets those params. It finds the recipe with that slug, and if there isn't one, it throws.", () => {
    d.wait(0.5).type(SLUG, files.recipePage.data, { cps: 52 })
  })
  d.say(
    'Each of the fifty data calls asks for the recipe list again, and fetchWithCache answers forty-nine of them from memory. Fifty pages, one request.',
  )
  d.say('Then render it: the photo, a meta line, the ingredients, and the method.', () => {
    d.wait(0.6).paste(SLUG, files.recipePage.final)
  })
  d.say('Plus some styles for the recipe page.', () => d.wait(0.3).paste('src/styles.css', files.styles))
  d.print(reloads(term.devSlug), { dur: 0.2 })
  d.showBrowser()
  d.load('list', 'localhost:5173/recipes', { dur: 0.3 })
  d.say('Every card is now a link to its own page.', () => {
    d.moveTo(d.pagePoint('pizza'), 0.9).click()
    d.hideCursor()
    d.load('recipe', 'localhost:5173/recipes/classic-margherita-pizza')
  })
  d.scrollTo('bottom', 4)

  // ── 5. Dev renders anything ─────────────────────────────────────────
  d.chapter(5, 'Dev renders anything, build renders what you list')
  d.load('beans', 'localhost:5173/recipes/beans-on-toast')
  d.say("The dev server will try to render any slug you give it. There's no beans on toast,")
  d.showEditor()
  d.print(firstError(term.devBeans, '[slug].ht.js:'), { dur: 0.3 })
  d.say('so data throws, and the terminal says which page failed, and why.')
  d.say("That's handy while you build a page: you don't have to list params first.")
  d.say(
    'But the build only writes what generateStaticParams returns. A page you forgot to list works in dev, and is missing from dist. So check the build, not just dev.',
  )

  // ── 6. Static beats dynamic ─────────────────────────────────────────
  d.chapter(6, 'Static beats dynamic')
  d.say('Next, a page of quick recipes: recipes/quick.ht.js.', () => {
    d.wait(1.5).newFile('src/recipes/quick.ht.js').paste('src/recipes/quick.ht.js', files.quick)
  })
  d.say(
    'Its URL, slash recipes slash quick, could match the slug page too. A static file name always beats a parameter, and a parameter beats a catch-all.',
  )
  d.say("Two files that write the same URL are a build error, not a silent overwrite.")
  d.say('Link to it from the recipes page.', () => d.type(RECIPES, files.recipes.final, { cps: 46 }))
  d.print(reloads(term.devQuick), { dur: 0.2 })
  d.showBrowser()
  d.load('listQuick', 'localhost:5173/recipes', { dur: 0.3 })
  d.moveTo(d.pagePoint('quickLink'), 0.9).click()
  d.hideCursor()
  d.load('quick', 'localhost:5173/recipes/quick')
  d.say('Every recipe that takes thirty minutes or less.', () => d.scrollTo(500, 2.5))

  // ── 7. Cuisines: an optional catch-all ──────────────────────────────
  d.chapter(7, 'Cuisines: an optional catch-all')
  d.showEditor()
  d.say('For cuisines, a helper groups the recipes by cuisine, then by meal type.', () => {
    d.wait(0.8).newFile('src/lib/cuisines.js').paste('src/lib/cuisines.js', files.cuisines)
  })
  d.say('And one file serves every cuisine page.', () => {
    d.wait(0.6).newFile(CATCH).paste(CATCH, files.catchAll.deep)
  })
  d.highlight(CATCH, d.lineOf(CATCH, 'const [cuisineSlug, mealSlug, ...rest]'))
  d.say(
    'Three dots make a catch-all. params.path is an array: just italian, or italian and dinner. Destructuring it reads like the URL.',
  )
  d.highlight(CATCH, d.lineOf(CATCH, 'export async function generateStaticParams'), d.lineOf(CATCH, 'cuisine.meals.map((meal)') + 2)
  d.say('generateStaticParams lists both depths: one page per cuisine, and one per cuisine and meal.')
  d.unhighlight()
  d.say('Add Cuisines to the nav. The layout now keeps Recipes highlighted on recipe pages, too.', () => {
    d.wait(0.6).type(LAYOUT, files.layout.cuisines, { cps: 55 })
  })
  d.showBrowser()
  d.load('italian', 'localhost:5173/cuisines/italian')
  d.say('Italian,', () => {
    d.moveTo(d.pagePoint('dinner'), 0.8).click()
    d.load('dinner', 'localhost:5173/cuisines/italian/dinner')
  })
  d.say('then dinner, and breadcrumbs lead back up.', () => {
    d.wait(1).moveTo(d.pagePoint('crumbItalian'), 0.7)
  })
  d.hideCursor()
  d.showEditor()
  d.say(
    "The question mark in the file name makes the catch-all optional. The same file also serves slash cuisines, where there's no path at all.",
  )
  d.say('So add an empty path to the params, and a page that lists every cuisine.', () => {
    d.wait(0.5).type(CATCH, files.catchAll.final, { cps: 70 })
  })
  d.print(reloads(term.devCuisines), { dur: 0.2 })
  d.showBrowser()
  d.load('cuisines', 'localhost:5173/cuisines')
  d.say('Without the question mark, slash cuisines would need an index file of its own.')

  // ── 8. Route groups and a 404 ───────────────────────────────────────
  d.chapter(8, 'Route groups and a 404')
  d.showEditor()
  d.say('Now the privacy and terms pages, in a folder called legal, in parentheses.', () => {
    d.wait(1).newFile('src/(legal)/privacy.ht.js').paste('src/(legal)/privacy.ht.js', files.privacy)
    d.newFile('src/(legal)/terms.ht.js').paste('src/(legal)/terms.ht.js', files.terms)
  })
  d.say(
    "A folder in parentheses is just for you. It groups files without adding to the URL, so this is slash privacy, not slash legal slash privacy.",
  )
  d.say('Link them from the footer.', () => d.type(LAYOUT, files.layout.final, { cps: 55 }))
  d.print(reloads(term.devLegal), { dur: 0.2 })
  d.showBrowser()
  d.load('privacy', 'localhost:5173/privacy')
  d.wait(1)
  d.showEditor()
  d.say(
    "And 404.ht.js replaces the default 404 page. Netlify, Cloudflare and GitHub Pages all serve it for unknown URLs, and so does the dev server.",
    () => d.wait(0.5).newFile('src/404.ht.js').paste('src/404.ht.js', files.notFound),
  )
  d.showBrowser()
  d.say("Try a URL that doesn't exist.", () => d.wait(0.4).load('notFound', 'localhost:5173/no-such-page'))
  d.say("There's our 404 page, sent with a 404 status, the way a host sends it.")
  d.showEditor()

  // ── 9. Sitemap and link checking ────────────────────────────────────
  d.chapter(9, 'Sitemap and link checking')
  d.say(
    "Last, a config file. site is the address the site will live at, and it turns on a sitemap. linkCheck set to error fails the build on a broken internal link.",
    () => d.wait(1).newFile('sitelo.config.js').type('sitelo.config.js', files.config, { cps: 28 }),
  )
  d.closeAll()
  d.terminal(640)
  d.say('Stop the dev server, and build.', () => {
    d.wait(0.6).interrupt().wait(0.3)
    d.run('npm run build', term.build, { wait: 0.8, dur: 1.6 })
  })
  const links = term.build.match(/checked (\d+) internal links/)[1]
  d.say(`${term.pages} pages from nine page files. And the link checker followed ${links} internal links. All good.`)
  d.say('Here is the sitemap, with the site address on every URL. We set the real one when we deploy, in episode seven.', () => {
    d.wait(1).run('head -n 12 dist/sitemap.xml', term.sitemap, { wait: 0.3, dur: 0.2 })
  }, { speak: 'Here is the sitemap, with the site address on every U R L. We set the real one when we deploy, in episode seven.' })
  d.terminal(330)
  d.say("Now break a link on purpose. Spell quick, q u i k.", () => {
    d.wait(1.8).type(RECIPES, files.recipes.broken, { cps: 20 })
  }, { speak: 'Now break a link on purpose. Spell quick, Q, U, I, K.' })
  d.run('npm run build', term.buildBroken, { wait: 0.8, dur: 1.4 })
  d.say('The build fails, and names the page and the link.')
  d.say(
    'The checker reads the built HTML, so it sees exactly what a visitor could click, catch-all pages included.',
  )
  d.say('Put it back.', () => d.type(RECIPES, files.recipes.final, { cps: 20 }))

  // ── Recap ───────────────────────────────────────────────────────────
  d.marker('Recap')
  d.say(
    'To recap. The file name is the route. Square brackets for a parameter, three dots for any depth, a question mark to include none, and parentheses for folders that don\'t count.',
  )
  d.say('generateStaticParams decides what the build writes, while dev renders anything. And site gives you a sitemap, while linkCheck keeps links honest.')
  const endAt = d.t + 14
  d.card('end', {
    title: 'Server islands',
    sub: 'Fresh HTML in a static page, rendered on every request.',
    link: 'github.com/Paul-Browne/sitelo/tree/main/videos',
  }, 14)
  d.wait(0.8)
  d.say(
    'Next time: the recipe of the day only changes when we rebuild. Server islands let one part of a static page render fresh, on every request. See you there.',
  )
  d.wait(Math.max(0, endAt - d.t))
}
