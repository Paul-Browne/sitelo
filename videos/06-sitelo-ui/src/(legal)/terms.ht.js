import { h1, p } from 'javascript-to-html'
import * as ui from 'sitelo/ui'
import { layout } from '../lib/layout.js'

export default ({ page }) =>
  layout({ title: 'Terms', description: 'The small print.', path: page.routePath },
    ui.prose({ class: 'section' },
      h1('Terms'),
      p('Recipes come from DummyJSON, a fake data API. Cook them at your own risk.'),
    ),
  )
