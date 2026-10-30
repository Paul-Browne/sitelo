import { a, h1, li, ul } from 'javascript-to-html'
import { getCuisines } from '../lib/cuisines.js'
import { escapeHtml } from '../lib/escape.js'
import { layout } from '../lib/layout.js'

export async function data() {
  return { cuisines: await getCuisines() }
}

export default ({ page, data }) =>
  layout({ title: 'Cuisines', description: 'Browse recipes by cuisine.', path: page.routePath },
    h1('Cuisines'),
    ul({ class: 'pills' },
      data.cuisines.map((cuisine) =>
        li(a({ href: `/cuisines/${cuisine.slug}` }, `${escapeHtml(cuisine.name)} (${cuisine.recipes.length})`)),
      ),
    ),
  )
