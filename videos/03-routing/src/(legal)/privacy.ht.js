import { h1, p, section } from 'javascript-to-html'
import { layout } from '../lib/layout.js'

export default ({ page }) =>
  layout({ title: 'Privacy', description: 'What we collect: nothing.', path: page.routePath },
    section({ class: 'prose' },
      h1('Privacy'),
      p('This site sets no cookies and runs no analytics. It is static HTML.'),
    ),
  )
