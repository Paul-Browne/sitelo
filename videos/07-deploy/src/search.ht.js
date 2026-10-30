import { div, script } from 'javascript-to-html'
import * as ui from 'sitelo/ui'
import { layout } from './lib/layout.js'

export default ({ page }) =>
  layout({ title: 'Search', description: 'Search every recipe.', path: page.routePath },
    ui.stack({ gap: 'md', class: 'section' },
      ui.heading({ level: 1 }, 'Search'),
      ui.text({ variant: 'lead', tone: 'muted' }, 'Find a recipe by name, ingredient or method.'),
      div({ id: 'search' }),
    ),
    script({ type: 'module', src: '/search.js' }),
  )
