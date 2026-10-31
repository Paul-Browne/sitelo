// Episode 1, as narration plus what happens on screen under each line.
// The wording follows videos/01-setup/SCRIPT.md; terminal output and pages
// come from capture.js, so they are what sitelo really printed and drew.

import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import * as files from './files.js'

export const meta = {
  title: 'Build a static site with plain JavaScript functions (sitelo, ep. 1)',
  description: `sitelo turns JavaScript functions that return HTML into a static site, with Vite underneath. In this first episode we install it, write two pages with javascript-to-html, share a layout between them, and build the site.

Code for every episode: https://github.com/Paul-Browne/sitelo/tree/main/videos
Docs: https://sitelo.js.org`,
}

const styles = fs.readFileSync(fileURLToPath(new URL('src/styles.css', files.snapshot)), 'utf8')

/** npm run prints this header before the script's own output. */
const npmRun = (script, command) => `\n> weeknight-kitchen@1.0.0 ${script}\n> ${command}\n\n`

/** The first error block, up to the line in our own file; the rest repeats it. */
const firstError = (text) => {
  const lines = text.split('\n')
  const end = lines.findIndex((line) => /index\.ht\.js:\d+:\d+\)/.test(line))
  return lines.slice(0, end + 1).join('\n')
}

export default function episode(d, { term }) {
  const INDEX = 'src/index.ht.js'
  const LAYOUT = 'src/lib/layout.js'

  // ── Cold open ───────────────────────────────────────────────────────
  d.marker("What we're building")
  d.showBrowser(0)
  d.load('coldHome', 'localhost:4173', { dur: 0.2 })
  d.say(
    "Over this series, we'll build this: Weeknight Kitchen. A recipe site with more than a hundred pages, search, optimized images, and a few parts rendered on the server for every request.",
    () => d.wait(1).scrollTo('bottom', 9, { linear: true }),
  )
  d.say('Every page on it is a JavaScript function that returns a string of HTML. That is the whole model.', () => {
    d.load('coldRecipe', 'localhost:4173/recipes/classic-margherita-pizza')
    d.scrollTo(700, 4)
  })
  d.say('There is search,', () => d.load('coldSearch', 'localhost:4173/search'))
  d.wait(0.6)
  d.say('and dark mode.', () => d.load('coldHomeDark', 'localhost:4173'))
  d.wait(0.8)
  d.say('Today, we go from an empty folder to a two-page site, built and ready to ship.')

  // ── Title ───────────────────────────────────────────────────────────
  d.card('title', { episode: 'Episode 1', title: 'Your first sitelo site', sub: 'From an empty folder to a two-page site' }, 4.6)
  d.wait(1.2).showEditor(0.1).terminal(560, 0.1).wait(3.3)

  // ── 1. Install ──────────────────────────────────────────────────────
  d.chapter(1, 'Install')
  d.say(
    "I've opened an empty folder called weeknight-kitchen in my editor. sitelo needs Node 20.19 or later, or 22.12 or later.",
    () => d.wait(2.5).run('node -v', term.nodeVersion, { wait: 0.3, dur: 0.1 }),
    { speak: "I've opened an empty folder called weeknight kitchen in my editor. sitelo needs Node twenty point nineteen or later, or twenty-two point twelve or later." },
  )
  d.say('Create a package.json,', () => {
    d.run('npm init -y', term.npmInit, { wait: 0.6, dur: 0.4 })
    d.addToTree('package.json')
  })
  d.say('and set the package type to module, because sitelo uses ES modules.', () => {
    d.run('npm pkg set type=module', '', { wait: 0.4 })
  })
  d.say('Then install two packages: sitelo, and javascript-to-html.', () => {
    d.typeCommand('npm install sitelo javascript-to-html')
  })
  d.wait(1.6).print(term.npmInstall, { dur: 0.3 }).prompt()
  d.addToTree(['node_modules/', 'package-lock.json'])
  d.say(
    "sitelo brings Vite with it, so there's no Vite to install, and no Vite config to write. javascript-to-html is optional. Pages can be template literals, JSX, or this, and I'll show you why I like it in a minute.",
  )
  d.terminal(250)
  d.newFile('package.json', files.packageJson.afterInit)
  d.say('In package.json, replace the test script with three scripts: dev, build, and preview.', () => {
    d.wait(0.5).type('package.json', files.packageJson.withScripts, { cps: 30 })
    d.highlight('package.json', d.lineOf('package.json', '"dev"'), d.lineOf('package.json', '"preview"'))
  })
  d.say("Those are the only three commands you'll need.")
  d.unhighlight()

  // ── 2. The first page ───────────────────────────────────────────────
  d.chapter(2, 'The first page')
  d.say('Pages live in a folder called src. Any file in there that ends in .ht.js is a page, and index.ht.js is the home page.', () => {
    d.wait(1.5).newFile(INDEX)
  })
  d.type(INDEX, files.index.template, { cps: 34 })
  d.say('The default export is a function that returns HTML. sitelo calls it to render the page, and adds the doctype for you.', () => {
    d.highlight(INDEX, 1, 6)
  })
  d.unhighlight()
  d.say('Start the dev server.', () => {
    d.terminal(330)
    // A server keeps the terminal: no prompt until it's stopped.
    d.typeCommand('npm run dev').wait(0.9).print(npmRun('dev', 'sitelo') + term.devStart, { dur: 0.3 })
  })
  d.showBrowser()
  d.load('template', 'localhost:5173')
  d.say("And there's our page, at localhost 5173.")
  const toolbar = d.callout(d.toolbarRect(8), { label: 'Dev toolbar' })
  d.say('At the bottom is the dev toolbar. It shows which file rendered this page,', () => {
    d.wait(2.2).moveTo(d.pagePoint('toolbarFile'), 0.8)
  })
  d.say('and how many server islands it has. Islands are episode four.', () => {
    d.moveTo(d.pagePoint('toolbarIslands'), 0.6)
  })
  d.say('The toolbar only exists in dev. It never ships.')
  toolbar.end()
  d.hideCursor()

  // ── 3. javascript-to-html ───────────────────────────────────────────
  d.chapter(3, 'javascript-to-html')
  d.showEditor()
  d.say('Now the same page, written with javascript-to-html.')
  d.retype(INDEX, files.index.elements, { cps: 30 })
  d.print(term.devElements, { dur: 0.2 })
  d.say('Every HTML element is a function. The first argument can be an object of attributes, and everything after it is children.', () => {
    d.highlight(INDEX, 3, 7)
  })
  d.say(
    'Arrays are flattened, so you can map over a list and pass the result straight in. We will lean on that a lot in episode two.',
  )
  d.say("And it's still just strings. Nothing here runs in the browser.")
  d.unhighlight()
  d.showBrowser()
  d.load('elements', 'localhost:5173')
  d.say('Same page as before.')
  d.showEditor()
  d.say("Now let's break it on purpose. I'll take title out of the import, and save.", () => {
    d.wait(2.4).type(INDEX, files.index.broken)
  })
  d.print(firstError(term.devBroken), { dur: 0.4 })
  d.wait(0.4)
  d.say('The terminal says what went wrong: title is not defined, in index.ht.js, on line 5.', () => {
    d.highlight(INDEX, 5)
  })
  d.unhighlight()
  d.showBrowser()
  d.load('broken', 'localhost:5173')
  d.say("The browser shows the same error in an overlay, so you can't miss it.")
  d.showEditor()
  d.say('Put the import back, save,', () => d.type(INDEX, files.index.elements))
  d.print(term.devFixed, { dur: 0.2 })
  d.showBrowser()
  d.load('fixed', 'localhost:5173')
  d.say('and the page is back. The server never stopped.')

  // ── 4. A layout is just a function ──────────────────────────────────
  d.chapter(4, 'A layout is just a function')
  d.showEditor()
  d.terminal(200)
  d.say('Real pages share a head, a header, and a footer. In sitelo, a layout is just a function.', () => {
    d.wait(1.8).newFile(LAYOUT).paste(LAYOUT, files.layout)
  })
  d.highlight(LAYOUT, d.lineOf(LAYOUT, 'export const layout'), d.lineOf(LAYOUT, "html({ lang: 'en' }"))
  d.say(
    "It takes some options, and the page's content as children, and it returns the whole document. No layout convention, no special file name, no slots.",
  )
  d.highlight(LAYOUT, d.lineOf(LAYOUT, 'const links'), d.lineOf(LAYOUT, "label: 'About'"))
  d.say('The nav is an array of links,')
  d.highlight(LAYOUT, d.lineOf(LAYOUT, 'links.map('), d.lineOf(LAYOUT, "'aria-current'"))
  d.say('mapped to anchors. path tells the layout which page it is rendering, so the current link gets aria-current.')
  d.highlight(LAYOUT, d.lineOf(LAYOUT, 'export const layout'))
  d.say('One detail: title is also the element function we imported, so the option is renamed to pageTitle.')
  d.unhighlight()
  d.say(
    "The file lives in src/lib, and doesn't end in .ht.js, so it isn't a page. Name it layout.ht.js, and you'd get a page at slash layout.",
  )
  d.say("Back in index.ht.js, call the layout with a title, a description, and the page's route path, which sitelo passes to every page.", () => {
    d.wait(1).type(INDEX, files.index.withLayout, { cps: 40 })
  })
  d.print(term.devLayout, { dur: 0.2 })
  d.showBrowser()
  d.load('layout', 'localhost:5173')
  d.say("Now the page has the header, the nav and the footer. It isn't styled yet, because the layout links a stylesheet we haven't written.")

  // ── 5. Styles and images ────────────────────────────────────────────
  d.chapter(5, 'Styles and images')
  d.showEditor()
  d.say('Here is a stylesheet. The layout links slash styles.css, and root URLs map onto the src folder, so that means this file.', () => {
    d.wait(0.6).newFile('src/styles.css').paste('src/styles.css', styles)
  })
  d.say('I will also add three images to src/images: a hero photo, a kitchen photo, and the logo.', () => {
    d.wait(1.6).addToTree(['src/images/hero.jpg', 'src/images/kitchen.jpg', 'src/images/logo.svg'], { open: 'src/images' })
  })
  d.print(term.devStyled.split('\n')[0], { dur: 0.1 })
  d.showBrowser()
  d.load('styled', 'localhost:5173')
  d.say('The styles apply straight away. CSS changes update in place, without reloading the page.')
  d.showEditor()
  d.say('Now give the home page a hero section: the photo, a heading, a line of text, and a button.', () => {
    d.wait(0.5).type(INDEX, files.index.hero, { cps: 44 })
  })
  d.print(term.devStyled.split('\n').slice(1).join('\n'), { dur: 0.2 })
  d.showBrowser()
  d.load('hero', 'localhost:5173')
  d.say('When you build the site, linked CSS and JavaScript are bundled and minified. Other files, like these images, are copied as they are.', () => {
    d.wait(1).scrollTo('bottom', 4).wait(1).scrollTo(0, 2)
  })
  d.say("And if a page links a stylesheet or script that doesn't exist, the build fails, instead of shipping a broken page.")

  // ── 6. A second page ────────────────────────────────────────────────
  d.chapter(6, 'A second page')
  d.showEditor()
  d.say('The about page is one more file, about.ht.js. Same layout, different content.', () => {
    d.wait(1.2).newFile('src/about.ht.js').paste('src/about.ht.js', files.about)
  })
  d.showBrowser()
  d.load('hero', 'localhost:5173', { dur: 0.1 })
  d.say('about.ht.js is slash about. Click About in the nav,', () => {
    d.wait(1.2).moveTo(d.pagePoint('aboutLink'), 0.9).click()
    d.load('about', 'localhost:5173/about')
  })
  d.say('and the highlight moves, because the layout knows which page it is on.', () => {
    d.moveTo(d.pagePoint('homeLink', { dx: 1.6 }), 0.6)
  })
  d.hideCursor()
  d.say("That's all routing is for now. Episode three goes a lot further.")

  // ── 7. Build and preview ────────────────────────────────────────────
  d.chapter(7, 'Build and preview')
  d.showEditor()
  d.closeAll()
  d.terminal(640)
  d.say('Stop the dev server, and build the site.', () => {
    d.wait(0.8).interrupt().wait(0.4)
    d.run('npm run build', term.build, { wait: 0.8, dur: 1.2 })
  })
  d.addToTree(
    term.distFiles.map((f) => `dist/${f}`),
    { open: ['dist', 'dist/about', 'dist/images'] },
  )
  d.say('sitelo renders every page to HTML, and prints a build report.')
  d.say('Three pages: our two, plus a 404 page that sitelo generated, because we did not write one.')
  d.say('And 2.28 MB of images for two pages, most of it one 1.76 MB JPEG. Remember that number for episode five.')
  d.say(
    'In dist, about slash index.html keeps the URL clean: the link stays slash about. Next to it are the 404 page, the stylesheet, and the images.',
  )
  d.say('npm run preview serves dist the way a static host would.', () => {
    d.wait(1.2).typeCommand('npm run preview').wait(0.8).print(term.preview, { dur: 0.2 })
  })
  d.showBrowser()
  d.load('previewAbout', 'localhost:4173/about')
  d.say("That's what we'll deploy in episode seven.")

  // ── Recap ───────────────────────────────────────────────────────────
  d.marker('Recap')
  d.showEditor()
  d.say('To recap. Pages are functions in src that return HTML. A layout is just a function in src/lib.', () => {
    d.wait(0.5).open(INDEX)
  })
  d.say('npm run dev to work on the site, and npm run build to ship it.')
  const endAt = d.t + 14
  d.card('end', {
    title: 'Real data',
    sub: 'Pulling recipes from an API at build time, and putting them on the page.',
    link: 'github.com/Paul-Browne/sitelo/tree/main/videos',
  }, 14)
  d.wait(0.8)
  d.say("Next time: real data. We'll pull recipes from an API at build time, and put them on the page. The code for every episode is linked below. See you there.")
  d.wait(Math.max(0, endAt - d.t))
}
