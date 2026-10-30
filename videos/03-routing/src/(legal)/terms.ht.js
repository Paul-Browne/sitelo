import { h1, p, section } from 'javascript-to-html'
import { layout } from '../lib/layout.js'

export default ({ page }) =>
  layout({ title: 'Terms', description: 'The small print.', path: page.routePath },
    section({ class: 'prose' },
      h1('Terms'),
      p('Recipes come from DummyJSON, a fake data API. Cook them at your own risk.'),
    ),
  )
