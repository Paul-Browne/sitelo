import * as ui from 'sitelo/ui'
import { getCuisines } from '../lib/cuisines.js'
import { escapeHtml } from '../lib/escape.js'
import { layout } from '../lib/layout.js'

export async function data() {
  return { cuisines: await getCuisines() }
}

export default ({ page, data }) =>
  layout({ title: 'Cuisines', description: 'Browse recipes by cuisine.', path: page.routePath },
    ui.stack({ gap: 'lg', class: 'section' },
      ui.heading({ level: 1 }, 'Cuisines'),
      ui.grid({ columns: 'repeat(auto-fill, minmax(min(100%, 12rem), 1fr))', gap: 'md' },
        data.cuisines.map((cuisine) =>
          ui.card({ href: `/cuisines/${cuisine.slug}` },
            ui.cardMedia({ src: cuisine.recipes[0].image, alt: '', ratio: '1', sizes: '12rem' }),
            ui.cardHeader({
              title: escapeHtml(cuisine.name),
              subtitle: `${cuisine.recipes.length} ${cuisine.recipes.length === 1 ? 'recipe' : 'recipes'}`,
            }),
          ),
        ),
      ),
    ),
  )
