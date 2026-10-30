import { article, h2, img, li, ol, ul } from 'javascript-to-html'
import { island } from 'sitelo/islands'
import * as ui from 'sitelo/ui'
import { getRecipes } from '../lib/api.js'
import { escapeHtml } from '../lib/escape.js'
import { layout } from '../lib/layout.js'
import { totalTime } from '../lib/recipe-card.js'
import { slugify } from '../lib/slug.js'

export async function generateStaticParams() {
  const recipes = await getRecipes()
  return recipes.map((recipe) => ({ slug: recipe.slug }))
}

export async function data({ params }) {
  const recipes = await getRecipes()
  const recipe = recipes.find((recipe) => recipe.slug === params.slug)
  if (!recipe) throw new Error(`No recipe called "${params.slug}"`)
  return recipe
}

export default ({ page, data: recipe }) => {
  const cuisine = slugify(recipe.cuisine)

  return layout({
    title: escapeHtml(recipe.name),
    description: `${recipe.cuisine} recipe, ready in ${totalTime(recipe)} minutes.`,
    path: page.routePath,
    islands: true,
  },
    ui.stack({ gap: 'lg', class: 'section recipe' },
      ui.breadcrumbs({
        items: [
          { label: 'Recipes', href: '/recipes' },
          { label: escapeHtml(recipe.cuisine), href: `/cuisines/${cuisine}` },
          escapeHtml(recipe.name),
        ],
      }),
      // Only what is inside data-pagefind-body gets indexed
      article({ 'data-pagefind-body': true },
        ui.stack({ gap: 'lg' },
          img({
            class: 'recipe-image',
            src: recipe.image,
            alt: recipe.name,
            sizes: '(min-width: 48rem) 48rem, 100vw',
            loading: 'eager',
            fetchpriority: 'high',
            // Pagefind shows this image next to the search result
            'data-pagefind-meta': 'image[src], image_alt[alt]',
          }),
          ui.heading({ level: 1 }, escapeHtml(recipe.name)),
          ui.stack({ direction: 'row', gap: 'xs', wrap: true },
            ui.chip({ href: `/cuisines/${cuisine}`, color: 'primary', 'data-pagefind-filter': 'cuisine' },
              escapeHtml(recipe.cuisine),
            ),
            recipe.mealType.map((meal) =>
              ui.chip({ href: `/cuisines/${cuisine}/${slugify(meal)}`, variant: 'outline', 'data-pagefind-filter': 'meal' },
                escapeHtml(meal),
              ),
            ),
          ),
          ui.statGroup(
            ui.stat({ label: 'Prep', value: `${recipe.prepTimeMinutes} min` }),
            ui.stat({ label: 'Cook', value: `${recipe.cookTimeMinutes} min` }),
            ui.stat({ label: 'Serves', value: recipe.servings }),
            ui.stat({ label: 'Rating', value: `★ ${recipe.rating}` }),
          ),
          ui.prose(
            h2('Ingredients'),
            ul(recipe.ingredients.map((ingredient) => li(escapeHtml(ingredient)))),
            h2('Method'),
            ol(recipe.instructions.map((step) => li(escapeHtml(step)))),
          ),
        ),
      ),
      ui.heading({ level: 2 }, 'Comments'),
      island('comments', { recipeId: recipe.id }, ui.skeleton({ variant: 'text', lines: 3 }), {
        when: 'visible',
      }),
    ),
  )
}
