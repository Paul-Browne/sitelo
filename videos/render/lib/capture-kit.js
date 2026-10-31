// Helpers for capture scripts: run real commands, keep their output, and
// screenshot real pages, so the rendered video shows what actually happens.

import { execFileSync, spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import puppeteer from 'puppeteer-core'
import { BROWSER_VIEWPORT, SCALE } from './layout.js'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/** Where the project appears to live, in place of the capture's scratch path. */
export const SHOWN_PROJECT_DIR = '/Users/paul/weeknight-kitchen'

/**
 * Rewrites what would give the recording machine away: the scratch path
 * becomes SHOWN_PROJECT_DIR, spare ports become Vite's defaults, and clock
 * times run from a fixed evening so re-captures don't drift.
 */
export const normalizer = ({ projectDir, ports = {} }) => {
  let clock = 19 * 3600 + 42 * 60 + 10
  return (text) => {
    let out = text.split(projectDir).join(SHOWN_PROJECT_DIR)
    for (const [from, to] of Object.entries(ports)) out = out.split(String(from)).join(String(to))
    return out.replace(/\d{1,2}:\d{2}:\d{2} [AP]M/g, () => {
      const h = Math.floor(clock / 3600) % 12 || 12
      const m = String(Math.floor(clock / 60) % 60).padStart(2, '0')
      const s = String(clock % 60).padStart(2, '0')
      clock += 3
      return `${h}:${m}:${s} PM`
    })
  }
}

// Read per command, so a capture can set variables (TZ, say) before running things.
const env = () => ({ ...process.env, FORCE_COLOR: '1', NO_UPDATE_NOTIFIER: '1', npm_config_fund: 'false' })

/** Runs a command to completion and returns its combined output. */
export const run = (cmd, args, cwd) => {
  try {
    return execFileSync(cmd, args, { cwd, env: env(), encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
  } catch (error) {
    return `${error.stdout ?? ''}${error.stderr ?? ''}`
  }
}

/** Starts a long-running command; `take()` returns output since the last take. */
export const start = (cmd, args, cwd) => {
  const child = spawn(cmd, args, { cwd, env: env(), detached: true })
  let buffer = ''
  child.stdout.on('data', (chunk) => (buffer += chunk))
  child.stderr.on('data', (chunk) => (buffer += chunk))
  return {
    take() {
      const out = buffer
      buffer = ''
      return out
    },
    async waitFor(pattern, ms = 20000) {
      const deadline = Date.now() + ms
      while (!pattern.test(buffer)) {
        if (Date.now() > deadline) throw new Error(`Timed out waiting for ${pattern}:\n${buffer}`)
        await sleep(100)
      }
    },
    async stop() {
      try {
        process.kill(-child.pid, 'SIGINT')
      } catch {}
      await new Promise((resolve) => (child.exitCode === null ? child.on('exit', resolve) : resolve()))
    },
  }
}

/** A browser whose page renders at exactly the size of the video's browser window. */
export const launchBrowser = async () => {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--hide-scrollbars'] })
  const page = await browser.newPage()
  await page.setViewport({ ...BROWSER_VIEWPORT, deviceScaleFactor: BROWSER_VIEWPORT.zoom * SCALE })
  return { browser, page }
}

/**
 * The dev toolbar is position: fixed, so a full-page screenshot would put
 * it at the bottom of the page rather than the window. It's shot on its own,
 * with a transparent background, for the stage to pin over the page.
 */
const shootToolbar = async (page, file) => {
  const box = await page.$eval('#hp-dev-toolbar', (el) => {
    const r = el.getBoundingClientRect()
    return { x: r.x, y: r.y, width: r.width, height: r.height }
  })
  const style = await page.addStyleTag({
    content: 'html,body{background:transparent!important}body>:not(#hp-dev-toolbar){visibility:hidden!important}',
  })
  const pad = 24
  const clip = { x: box.x - pad, y: box.y - pad, width: box.width + pad * 2, height: box.height + pad * 2 }
  await page.screenshot({ path: file, omitBackground: true, clip })
  await style.evaluate((el) => el.remove())
  return { file: path.basename(file), ...clip }
}

/**
 * Screenshots the whole page and returns it with the page-space boxes of
 * `targets` (selector → box), which episodes use to aim the mouse cursor.
 */
export const shoot = async (page, file, { targets = {}, fullPage = true, rewrite = [], maxHeight } = {}) => {
  await page.evaluate(() => document.fonts.ready)
  // A full-page shot shows images below the fold, so lazy ones must load
  // too: decode() on a lazy image that never starts loading waits forever.
  await page.evaluate(async () => {
    for (const img of document.images) img.loading = 'eager'
    const decoded = Promise.all([...document.images].map((img) => img.decode().catch(() => {})))
    await Promise.race([decoded, new Promise((resolve) => setTimeout(resolve, 10000))])
  })
  // Rewrite text (machine paths in error overlays, say), shadow roots included.
  await page.evaluate((pairs) => {
    const walk = (root) => {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
      while (walker.nextNode()) {
        for (const [from, to] of pairs) walker.currentNode.nodeValue = walker.currentNode.nodeValue.split(from).join(to)
      }
      for (const el of root.querySelectorAll('*')) if (el.shadowRoot) walk(el.shadowRoot)
    }
    walk(document)
  }, rewrite)
  const boxes = {}
  for (const [name, selector] of Object.entries(targets)) {
    boxes[name] = await page.$eval(selector, (el) => {
      const r = el.getBoundingClientRect()
      return { x: r.x + scrollX, y: r.y + scrollY, width: r.width, height: r.height }
    })
  }
  const title = await page.title()
  // Kept inline: the server that served it is gone by render time.
  const favicon = await page.evaluate(async () => {
    const href = document.querySelector('link[rel~="icon"]')?.href
    if (!href) return null
    const blob = await fetch(href).then((r) => (r.ok ? r.blob() : null)).catch(() => null)
    if (!blob) return null
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.readAsDataURL(blob)
    })
  })
  let toolbar = null
  if (await page.$('#hp-dev-toolbar')) {
    toolbar = await shootToolbar(page, file.replace(/\.png$/, '.toolbar.png'))
    await page.addStyleTag({ content: '#hp-dev-toolbar{display:none!important}' })
  }
  let height = await page.evaluate(() => document.documentElement.scrollHeight)
  if (maxHeight && height > maxHeight) {
    // Long pages (a Lighthouse report, say): just the top of them.
    height = maxHeight
    await page.screenshot({ path: file, captureBeyondViewport: true, clip: { x: 0, y: 0, width: BROWSER_VIEWPORT.width, height } })
  } else {
    await page.screenshot({ path: file, fullPage, captureBeyondViewport: fullPage })
  }
  return { file: path.basename(file), height: fullPage ? height : BROWSER_VIEWPORT.height, title, favicon, boxes, toolbar }
}

export const writeFiles = (root, files) => {
  for (const [file, content] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true })
    fs.writeFileSync(path.join(root, file), content)
  }
}

/** Reads a file from an episode's snapshot folder, e.g. snapshot('02-data', 'src/index.ht.js'). */
export const snapshot = (episode, file) => fs.readFileSync(path.join(SNAPSHOTS, episode, file), 'utf8')
const SNAPSHOTS = path.resolve(import.meta.dirname, '../..')

/** The project's files as the editor's tree lists them, without installed or built output. */
export const listProject = (project) =>
  fs
    .readdirSync(project, { recursive: true })
    .filter((f) => !/^(node_modules|dist|\.sitelo|public\/pagefind)(\/|$)/.test(f) && !f.endsWith('SCRIPT.md'))
    .filter((f) => fs.statSync(path.join(project, f)).isFile())
    .sort()

/**
 * Starts a project as the previous episode left it: its snapshot copied
 * into a fresh folder and installed from its lockfile.
 */
export const projectFrom = (episode, project) => {
  fs.rmSync(project, { recursive: true, force: true })
  fs.cpSync(path.join(SNAPSHOTS, episode), project, {
    recursive: true,
    filter: (src) => !/\/(node_modules|dist|\.sitelo|pagefind)(\/|$)|SCRIPT\.md$/.test(src.slice(SNAPSHOTS.length)),
  })
  run('npm', ['ci', '--no-audit'], project)
  return listProject(project)
}

/**
 * A running dev server and a page looking at it. save() writes files and
 * gives the server a moment to notice; visit() screenshots a route.
 */
export const devSession = async ({ project, page, outDir, clean, rewrite, port = 5273 }) => {
  const dev = start('npx', ['sitelo', '--port', String(port), '--strictPort'], project)
  await dev.waitFor(/Local/)
  await sleep(300)
  return {
    banner: clean(dev.take()),
    async save(changes, wait = 1200) {
      writeFiles(project, changes)
      await sleep(wait)
    },
    async visit(route, name, { targets, before } = {}) {
      await page.goto(`http://localhost:${port}${route}`, { waitUntil: 'networkidle0' })
      await sleep(300)
      if (before) await before(page)
      return shoot(page, path.join(outDir, `${name}.png`), { targets, rewrite })
    },
    take: () => clean(dev.take()),
    async stop() {
      await dev.stop()
      return clean(dev.take())
    },
  }
}

/**
 * A time zone where it's early evening right now. The what's-cooking island
 * reads the server's clock: running servers in this zone makes it suggest
 * dinner, like the evening timestamps in the terminal, whenever a capture runs.
 */
export const eveningZone = () => {
  const offset = (new Date().getUTCHours() - 19 + 24) % 24
  return offset <= 12 ? `Etc/GMT+${offset}` : `Etc/GMT-${24 - offset}`
}
