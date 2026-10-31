// The files episode 7 adds or changes, straight from the snapshot.

import { snapshot } from '../../lib/capture-kit.js'

export const start = {
  'sitelo.config.js': snapshot('06-sitelo-ui', 'sitelo.config.js'),
  'knip.js': snapshot('06-sitelo-ui', 'knip.js'),
}
export const netlifyToml = snapshot('07-deploy', 'netlify.toml')
export const config = snapshot('07-deploy', 'sitelo.config.js')
export const fn = snapshot('07-deploy', 'netlify/functions/islands.mjs')
export const knip = snapshot('07-deploy', 'knip.js')
export const ci = snapshot('07-deploy', '.github/workflows/ci.yml')
export const rebuild = snapshot('07-deploy', '.github/workflows/rebuild.yml')
