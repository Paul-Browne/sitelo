import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { SITE_PRESET, sitePresetCss } from '../src/lib/ui-theme.js'

/** Where the preset is written, for `styles.css` to import. */
const OUT = fileURLToPath(new URL('../src/site-preset.css', import.meta.url))

/** The preset's own sheet, watched in dev so the docs follow an edit to it. */
const SOURCE = fileURLToPath(
  import.meta.resolve('sitelo/ui').replace(/index\.js$/, `presets/${SITE_PRESET}.css`),
)

/** Writes the file, unless what is there already is what would be written. */
function write() {
  const css = `/* Written by plugins/site-preset.js on every dev start and build — do not edit. */\n${sitePresetCss()}\n`

  let current
  try {
    current = readFileSync(OUT, 'utf8')
  } catch {
    // Not written yet: a fresh clone.
  }

  if (current !== css) writeFileSync(OUT, css)
}

/**
 * Writes the site's preset to `src/site-preset.css`, which `styles.css`
 * imports.
 *
 * `styles({ preset })` would link it as a second file, and that file
 * would restyle every `su-` class on the page — the component demos'
 * included, which have to show the library as it ships. So the docs take
 * the preset in the form `sitePresetCss()` gives it, with its rules held
 * out of the demos by `@scope`, and take it inside their own sheet: one
 * request rather than two, hashed and cached with the rest.
 *
 * A file on disk rather than a transform of `styles.css`, because a build
 * never runs one: vite-plugin-html-pages bundles the sheets in `src/`
 * with esbuild directly, which follows an `@import` to a file and nothing
 * else. So the file is written before anything reads the sheet — when
 * the config is resolved, for dev and build alike — and is not committed,
 * since it is only ever the preset restated.
 *
 * @returns {import('vite').Plugin}
 */
export function sitePreset() {
  return {
    name: 'sitelo-docs:site-preset',

    configResolved() {
      write()
    },

    configureServer(server) {
      server.watcher.add(SOURCE)
      server.watcher.on('change', (file) => {
        if (file === SOURCE) write()
      })
    },
  }
}
