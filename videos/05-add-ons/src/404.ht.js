import { a, h1, p, section } from 'javascript-to-html'
import { layout } from './lib/layout.js'

export default ({ page }) =>
  layout({ title: 'Not found', description: 'This page does not exist.', path: page.routePath },
    section({ class: 'prose' },
      h1('Nothing cooking here'),
      p('That page does not exist. Try ', a({ href: '/recipes' }, 'all recipes'), ' instead.'),
    ),
  )
