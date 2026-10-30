import { div, h1, p, script } from 'javascript-to-html'
import { layout } from './lib/layout.js'

export default ({ page }) =>
  layout({ title: 'Search', description: 'Search every recipe.', path: page.routePath },
    h1('Search'),
    p({ class: 'lead' }, 'Find a recipe by name, ingredient or method.'),
    div({ id: 'search' }),
    script({ type: 'module', src: '/search.js' }),
  )
