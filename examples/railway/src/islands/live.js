import * as ui from 'sitelo/ui'

import { statRow } from '../lib/stats.js'

/*
 * Runs on the server for every request, never in the browser, and is
 * never copied into dist/. The RAILWAY_* variables are set on every
 * Railway deploy; locally they fall back to something readable.
 */
export default function live() {
  const commit = process.env.RAILWAY_GIT_COMMIT_SHA
  // `europe-west4-drams3a` → `europe-west4`: the zone is noise here.
  const region = process.env.RAILWAY_REPLICA_REGION?.split('-').slice(0, 2).join('-')

  return statRow(
    ui.stat({ label: 'Rendered at', value: `${new Date().toISOString().slice(11, 19)} UTC` }),
    ui.stat({ label: 'Region', value: region ?? 'local' }),
    ui.stat({ label: 'Commit', value: commit ? commit.slice(0, 7) : 'dev' }),
    ui.stat({ label: 'Server uptime', value: formatUptime(process.uptime()) }),
  )
}

function formatUptime(seconds) {
  const s = Math.floor(seconds)

  if (s < 60) return `${s}s`
  if (s < 3600) return `${Math.floor(s / 60)}m ${s % 60}s`

  return `${Math.floor(s / 3600)}h ${Math.floor((s % 3600) / 60)}m`
}
