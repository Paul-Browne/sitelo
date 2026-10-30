import { h1, p } from 'javascript-to-html'
import * as ui from 'sitelo/ui'
import { layout } from '../lib/layout.js'

export default ({ page }) =>
  layout({ title: 'Privacy', description: 'What we collect: nothing.', path: page.routePath },
    ui.prose({ class: 'section' },
      h1('Privacy'),
      p('This site sets no cookies and runs no analytics. It is static HTML.'),
    ),
  )
