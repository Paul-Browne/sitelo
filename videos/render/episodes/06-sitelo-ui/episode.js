// Episode 6: sitelo-ui. Follows videos/06-sitelo-ui/SCRIPT.md, with the
// theming chapter after the hero so its buttons show the partial palette.

import { PROMPT } from '../../lib/director.js'
import { scores } from '../../lib/output.js'
import * as files from './files.js'

export const meta = {
  title: "A component library that's just functions returning HTML (sitelo, ep. 6)",
  description: `sitelo-ui is a component library (buttons, cards, forms, modals, heroes) as plain functions. They nest inside javascript-to-html with nothing in between. We restyle the whole recipe site with it, theme it, add dark mode, try a few presets and prune the CSS to what we use.

Code for every episode: https://github.com/Paul-Browne/sitelo/tree/main/videos
Docs: https://sitelo.js.org`,
}

const npmRun = (script, command) => `\n> ${script}\n> ${command}\n\n`
const reloads = (text) => text.split('\n').filter((line) => /\((ssr|client)\)/.test(line)).join('\n')
const kB = (bytes) => (bytes / 1000).toFixed(1)
const cssBytes = (ls) => Number(ls.split('\n').find((line) => line.endsWith('.css'))?.split(' ')[0])

export default function episode(d, { term, shots }) {
  const F = files.final
  const LAYOUT = 'src/lib/layout.js'
  const CARD = 'src/lib/recipe-card.js'
  const INDEX = 'src/index.ht.js'
  const SLUG = 'src/recipes/[slug].ht.js'
  const CONFIG = 'sitelo.config.js'

  // Where episode 5 left off.
  d.addToTree([...term.tree, 'node_modules/', 'dist/'], { open: ['src', 'src/lib'] })
  d.preload(files.start)
  d.terminal(250, 0)
  d.setTerminal(`${PROMPT}npm run dev\n${npmRun('dev', 'sitelo')}${term.devStart}`)
  d.open(LAYOUT)

  d.card('title', { episode: 'Episode 6', title: 'sitelo-ui', sub: 'A component library that is just functions' }, 5.4)
  d.wait(0.8)
  d.say('This time we swap most of our hand-written markup and CSS for sitelo-ui, the component library that ships with sitelo.')
  d.wait(Math.max(0, 5.4 - d.t))

  // ── 1. What sitelo-ui is ────────────────────────────────────────────
  d.chapter(1, 'What sitelo-ui is')
  d.showBrowser()
  d.load('before', 'localhost:5173')
  d.say("Here's the site as it is: every rule in styles.css written by hand.")
  d.say("sitelo-ui is already installed. It ships with sitelo, as sitelo/ui.", null, {
    speak: 'sitelo-ui is already installed. It ships with sitelo, as sitelo slash U I.',
  })
  d.say(
    'Every component is a function that returns HTML, with the same calling convention as javascript-to-html: an optional props object first, then children.',
  )
  d.say('And most need no JavaScript. Modals are dialog elements, accordions are details, and tabs are radio buttons.')

  // ── 2. styles() and the app bar ─────────────────────────────────────
  d.chapter(2, 'styles() and the app bar')
  d.showEditor()
  d.say('In the layout, import it as a namespace, put its styles in the head, and build the page from its pieces.', () => {
    d.wait(1.8).paste(LAYOUT, files.layout.unthemed)
  })
  d.highlight(LAYOUT, d.lineOf(LAYOUT, "import * as ui from 'sitelo/ui'"))
  d.say(
    'A namespace, because a few names, like button, link and table, are javascript-to-html elements too. ui.link next to link keeps them apart.',
    null,
    { speak: 'A namespace, because a few names, like button, link and table, are javascript to H T M L elements too. U I dot link next to link keeps them apart.' },
  )
  d.highlight(LAYOUT, d.lineOf(LAYOUT, 'ui.styles()'), d.lineOf(LAYOUT, 'ui.themeScript()'))
  d.say(
    "styles links one stylesheet, which sitelo serves in dev and writes into the build. There's nothing to copy. themeScript applies a saved dark mode before the first paint, so it never flashes.",
    null,
    { speak: "styles links one stylesheet, which sitelo serves in dev and writes into the build. There's nothing to copy. theme script applies a saved dark mode before the first paint, so it never flashes." },
  )
  d.highlight(LAYOUT, d.lineOf(LAYOUT, 'ui.appBar({'), d.lineOf(LAYOUT, 'ui.appBarActions'))
  d.say('An app bar with the brand, the nav, and a dark mode toggle. Then a container for the main content, and a footer with three columns.')
  d.unhighlight()
  d.showBrowser()
  d.load('appBar', 'localhost:5173')
  d.say("It's half old styles and half new for now. The rest of the page comes next.")

  // ── 3. Cards and grids ──────────────────────────────────────────────
  d.chapter(3, 'Cards and grids')
  d.showEditor()
  d.say('The recipe card becomes a ui.card, with media and a header, and a recipeGrid puts them in a grid.', () => {
    d.wait(1.5).paste(CARD, F[CARD])
  }, { speak: 'The recipe card becomes a U I card, with media and a header, and a recipe grid puts them in a grid.' })
  d.highlight(CARD, d.lineOf(CARD, 'ui.card({ href'))
  d.say('href makes the whole card a link, with a hover lift.')
  d.highlight(CARD, d.lineOf(CARD, 'sizes:'))
  d.say(
    "Props a component doesn't know pass through as attributes. So sizes lands on the img, and image optimization still works.",
    null,
    { speak: "Props a component doesn't know pass through as attributes. So sizes lands on the image, and image optimization still works." },
  )
  d.highlight(CARD, d.lineOf(CARD, "columns: 'repeat(auto-fill"))
  d.say(
    "auto-fill rather than the grid's default, auto-fit, so a cuisine with one recipe gets one card-sized card, not one stretched across the page.",
  )
  d.unhighlight()
  d.say('Every listing page now calls recipeGrid.', () => {
    d.wait(0.5).type('src/recipes/index.ht.js', F['src/recipes/index.ht.js'], { cps: 80 })
    d.type('src/recipes/quick.ht.js', F['src/recipes/quick.ht.js'], { cps: 80 })
  }, { speak: 'Every listing page now calls recipe grid.' })
  d.showBrowser()
  d.load('cards', 'localhost:5173/recipes')
  d.say("Children are still raw HTML, so the escaping we've been doing still matters.", () => d.wait(0.5).scrollTo(900, 4))

  // ── 4. The home page hero ───────────────────────────────────────────
  d.chapter(4, 'The home page hero')
  d.showEditor()
  d.say('On the home page, a hero: an eyebrow, a title, a description, the photo, and two buttons.', () => {
    d.wait(1).paste(INDEX, F[INDEX])
  })
  d.highlight(INDEX, d.lineOf(INDEX, "sizes: '(min-width: 64rem) 34rem"))
  d.say('The photo now sits beside the text, at about 540 pixels, so its sizes changes, and the browser picks a smaller file.')
  d.unhighlight()
  d.showBrowser()
  d.load('hero', 'localhost:5173')
  d.wait(1.5)

  // ── 5. Theming ──────────────────────────────────────────────────────
  d.chapter(5, 'Theming: a palette has nine slots')
  d.showEditor()
  d.say("It's blue, because that's the default. The obvious fix is a theme with our orange.", () => {
    d.wait(1.8).type(LAYOUT, files.layout.partial, { cps: 55 })
  })
  d.showBrowser()
  d.load('partial', 'localhost:5173')
  const outline = d.callout(d.pageRect('outline'))
  d.say('The solid button is orange now. But the outline button, and the eyebrow above the title, are still blue.')
  outline.end()
  d.say(
    'Each palette has nine slots: base, hover, active, fg, soft, soft hover, soft fg, border, and ring. The ones you leave out keep the default.',
    null,
    { speak: 'Each palette has nine slots: base, hover, active, foreground, soft, soft hover, soft foreground, border, and ring. The ones you leave out keep the default.' },
  )
  d.showEditor()
  d.say('So set them all, for light and for dark, in src/lib/theme.js,', () => {
    d.wait(1).newFile('src/lib/theme.js').paste('src/lib/theme.js', F['src/lib/theme.js'])
  })
  d.say('and pass both to theme.', () => d.type(LAYOUT, files.layout.final, { cps: 55 }))
  d.showBrowser()
  d.load('themed', 'localhost:5173')
  d.say("The built-in palettes are checked for contrast against WCAG AA. Your own colours aren't, so check fg against base.", null, {
    speak: "The built-in palettes are checked for contrast against W C A G double A. Your own colours aren't, so check the foreground against the base.",
  })

  // ── 6. The recipe page ──────────────────────────────────────────────
  d.chapter(6, 'The recipe page')
  d.showEditor()
  d.say('The recipe page is mostly components now.', () => d.wait(0.6).paste(SLUG, F[SLUG]))
  d.highlight(SLUG, d.lineOf(SLUG, 'ui.breadcrumbs({'))
  d.say('Breadcrumbs, where the last item is the current page.')
  d.highlight(SLUG, d.lineOf(SLUG, "ui.chip({ href: `/cuisines/${cuisine}`"))
  d.say('Chips for the cuisine and meal. The Pagefind filter attribute passes straight through.')
  d.highlight(SLUG, d.lineOf(SLUG, 'ui.statGroup('), d.lineOf(SLUG, "label: 'Rating'"))
  d.say('A group of stats for the times, servings and rating.')
  d.highlight(SLUG, d.lineOf(SLUG, 'ui.prose('))
  d.say("And prose, which styles plain HTML you didn't build from components: the ingredients and the method.")
  d.unhighlight()
  d.say('The cuisine pages, about, privacy and terms get the same treatment, and the 404 page becomes ui.empty.', () => {
    for (const file of ['src/cuisines/[...path]?.ht.js', 'src/about.ht.js', 'src/(legal)/privacy.ht.js', 'src/(legal)/terms.ht.js', 'src/404.ht.js', 'src/search.ht.js']) {
      d.paste(file, F[file])
    }
  }, { speak: 'The cuisine pages, about, privacy and terms get the same treatment, and the 404 page becomes U I empty.' })
  d.say(
    "Then delete almost all of styles.css. A hundred and forty-three lines become thirty-two, and what's left uses the theme's tokens, so it follows dark mode too.",
    () => d.wait(1.5).paste('src/styles.css', F['src/styles.css']),
  )
  d.print(reloads(term.devPages), { dur: 0.2 })
  d.showBrowser()
  d.load('recipe', 'localhost:5173/recipes/classic-margherita-pizza')
  d.scrollTo(700, 3)
  d.load('cuisines', 'localhost:5173/cuisines')
  d.say('And the cuisines page, with a photo for each cuisine.', () => d.scrollTo(600, 3))
  d.load('home', 'localhost:5173', { dur: 0.3 })
  d.say('Now try the toggle.', () => {
    d.moveTo(d.pagePoint('toggle'), 0.8).click()
    d.hideCursor()
    d.load('homeDark', 'localhost:5173', { dur: 0.1 })
  })
  d.say('Dark mode. Reload, and it stays.')

  // ── 7. Islands render components too ───────────────────────────────
  d.chapter(7, 'Islands render components too')
  d.showEditor()
  d.say(
    'The islands use components too. An island is server code like a page, so the same functions work there. The pick goes through recipeGrid, and comments become a list with avatars, or an empty state.',
    () => {
      d.wait(2).paste('src/islands/whats-cooking.js', F['src/islands/whats-cooking.js'])
      d.wait(1).paste('src/islands/comments.js', F['src/islands/comments.js'])
    },
    { speak: 'The islands use components too. An island is server code like a page, so the same functions work there. The pick goes through recipe grid, and comments become a list with avatars, or an empty state.' },
  )
  d.showBrowser()
  d.load('recipeDark', 'localhost:5173/recipes/classic-margherita-pizza')
  d.say('Their fallbacks are skeletons now, until the island arrives.', () => d.scrollTo('bottom', 3))

  // ── 8. Presets ──────────────────────────────────────────────────────
  d.chapter(8, 'Presets')
  d.showEditor()
  d.say('A preset restyles every component at once. Neubrutalism,', () => {
    d.wait(1.5).type(LAYOUT, files.layout.neubrutalism, { cps: 50 })
  })
  d.showBrowser()
  d.load('neubrutalism', 'localhost:5173')
  d.wait(1.5)
  d.showEditor()
  d.say('superneon,', () => d.type(LAYOUT, files.layout.superneon, { cps: 50 }))
  d.showBrowser()
  d.load('superneon', 'localhost:5173')
  d.wait(1.5)
  d.showEditor()
  d.say('and terminal, with the square icon set.', () => d.type(LAYOUT, files.layout.terminal, { cps: 50 }))
  d.showBrowser()
  d.load('terminal', 'localhost:5173')
  d.say('The theme still works on top of a preset: the orange is ours. Back to the default.')
  d.showEditor()
  d.type(LAYOUT, files.layout.final, { cps: 60 })

  // ── 9. Shipping only the CSS you use ────────────────────────────────
  d.chapter(9, 'Shipping only the CSS you use')
  d.closeAll()
  d.terminal(560)
  const lsCss = `ls -l dist/su | awk '{ print $5, $9 }'`
  const gzCss = 'gzip -c dist/su/*.css | wc -c'
  d.say('Build, and look at the stylesheet sitelo-ui wrote.', () => {
    d.wait(0.5).interrupt().wait(0.3)
    d.run('npm run build', term.buildFull, { wait: 0.8, dur: 1.2 })
    d.run(lsCss, term.cssFull, { wait: 0.3, dur: 0.1 })
    d.run(gzCss, term.gzFull, { wait: 0.3, dur: 0.1 })
  })
  const full = cssBytes(term.cssFull)
  d.say(`That's the whole library: ${kB(full)} kB, or ${kB(term.gzFull)} gzipped.`, null, {
    speak: `That's the whole library: ${kB(full)} kilobytes, or ${kB(term.gzFull)} gee-zipped.`,
  })
  d.terminal(250)
  d.say('Switch on pruneCss,', () => d.open(CONFIG).type(CONFIG, files.config.prune, { cps: 50 }), {
    speak: 'Switch on prune C S S,',
  })
  d.terminal(560)
  d.run('npm run build', term.buildPruned, { wait: 0.8, dur: 1.2 })
  d.run(lsCss, term.cssPruned, { wait: 0.3, dur: 0.1 })
  d.run(gzCss, term.gzPruned, { wait: 0.3, dur: 0.1 })
  d.say(`and it's ${kB(cssBytes(term.cssPruned))} kB, ${kB(term.gzPruned)} gzipped. The build reads the classes off the pages it just wrote, and drops every rule nothing uses.`, null, {
    speak: `and it's ${kB(cssBytes(term.cssPruned))} kilobytes, ${kB(term.gzPruned)} gee-zipped. The build reads the classes off the pages it just wrote, and drops every rule nothing uses.`,
  })
  d.say('Preview it, and open a recipe.', () => {
    d.wait(0.5).typeCommand('npm run preview').wait(0.6).print(npmRun('preview', 'sitelo preview') + term.preview, { dur: 0.2 })
  })
  d.showBrowser()
  d.load('pruned', 'localhost:4173/recipes/classic-margherita-pizza')
  d.scrollTo('bottom', 2)
  d.say(
    "The comments have lost their styles. The comments island renders at request time, so the build never saw its list and avatar classes, and pruned them.",
  )
  d.showEditor()
  d.interrupt()
  d.terminal(250)
  d.say('Name what the islands need, with keep.', () => d.type(CONFIG, files.config.final, { cps: 50 }))
  d.terminal(560)
  d.run('npm run build', term.buildKept, { wait: 0.8, dur: 1.2 })
  d.run(lsCss, term.cssKept, { wait: 0.3, dur: 0.1 })
  d.typeCommand('npm run preview').wait(0.6).print(npmRun('preview', 'sitelo preview') + term.preview, { dur: 0.2 })
  d.showBrowser()
  d.load('kept', 'localhost:4173/recipes/classic-margherita-pizza')
  d.scrollTo('bottom', 2)
  d.say(`Build again: ${kB(cssBytes(term.cssKept))} kB, and the comments are styled.`, null, {
    speak: `Build again: ${kB(cssBytes(term.cssKept))} kilobytes, and the comments are styled.`,
  })
  d.showEditor()
  d.interrupt()
  d.run('npx sitelo lighthouse', term.lighthouse, { wait: 3, dur: 0.6 })
  const allPerfect = scores(term.lighthouse).every((row) => [row.perf, row.a11y, row.best, row.seo].every((n) => n === 100))
  d.say(allPerfect ? 'And Lighthouse is still 100 across the board.' : 'And Lighthouse still passes its thresholds.')

  // ── Recap ───────────────────────────────────────────────────────────
  d.marker('Recap')
  d.terminal(250)
  d.open(LAYOUT)
  d.say(
    'To recap. Import sitelo/ui as a namespace, put ui.styles in the head, and use components wherever HTML goes, islands included. ui.theme takes a whole palette, and dark mode is a toggle and one script. pruneCss ships what you use, and islands need a keep list.',
    null,
    { speak: 'To recap. Import sitelo slash U I as a namespace, put U I styles in the head, and use components wherever H T M L goes, islands included. U I theme takes a whole palette, and dark mode is a toggle and one script. prune C S S ships what you use, and islands need a keep list.' },
  )
  const endAt = d.t + 14
  d.card('end', {
    title: 'Deploying',
    sub: 'Weeknight Kitchen goes live, islands and all.',
    link: 'github.com/Paul-Browne/sitelo/tree/main/videos',
  }, 14)
  d.wait(0.8)
  d.say('Next time is the last one. We put Weeknight Kitchen on the internet, islands and all.')
  d.wait(Math.max(0, endAt - d.t))
}
