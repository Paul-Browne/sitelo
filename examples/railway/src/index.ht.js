import { island } from 'sitelo/islands'
import * as ui from 'sitelo/ui'

import { layout } from './lib/layout.js'
import { statRow } from './lib/stats.js'

/** What the island's box shows until the server answers. */
const loading = statRow(
  ...['Rendered at', 'Region', 'Commit', 'Server uptime'].map((label) =>
    ui.stat({ label, value: ui.skeleton({ width: '6rem' }) }),
  ),
)

const next = [
  ['Edit this page', 'src/index.ht.js is a function that returns HTML. Change it, push, and Railway rebuilds.'],
  ['Add a page', 'src/about.ht.js becomes /about. Dynamic routes, data loading and the rest are in the docs.'],
  ['Add an island', 'Anything in src/islands/ renders on the server per request, like the box above.'],
]

export default () =>
  layout(
    {
      title: 'My sitelo site',
      description: 'A static sitelo site with server islands, deployed on Railway.',
    },
    ui.stack(
      { gap: 'xl' },
      ui.hero(
        {
          eyebrow: 'Deployed on Railway',
          title: 'Static pages, live islands',
          description:
            'This page was rendered once, at build time. The numbers below were not: they come from the server on every request.',
        },
        ui.button({ href: 'https://sitelo.dev/docs' }, 'Read the docs'),
        ui.button(
          { href: 'https://github.com/paul-browne/sitelo', variant: 'outline', color: 'neutral' },
          'sitelo on GitHub',
        ),
      ),
      island('live', {}, loading),
      ui.grid(
        { min: '14rem' },
        ...next.map(([title, text]) =>
          ui.card(ui.cardHeader({ title }), ui.cardBody(ui.text({ tone: 'muted' }, text))),
        ),
      ),
    ),
  )
