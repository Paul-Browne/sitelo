import * as ui from 'sitelo/ui'
import { layout } from './lib/layout.js'

export default ({ page }) =>
  layout({ title: 'Not found', description: 'This page does not exist.', path: page.routePath },
    ui.empty({
      class: 'section',
      icon: ui.icon('search'),
      title: 'Nothing cooking here',
      description: 'That page does not exist.',
    },
      ui.button({ href: '/recipes' }, 'Browse all recipes'),
    ),
  )
