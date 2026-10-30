import { a, article, h1, h2, img, li, ol, p, ul } from 'javascript-to-html'
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
  },
    article({ class: 'recipe' },
      img({ src: recipe.image, alt: recipe.name }),
      h1(escapeHtml(recipe.name)),
      p({ class: 'meta' },
        a({ href: `/cuisines/${cuisine}` }, escapeHtml(recipe.cuisine)),
        ' · ',
        recipe.mealType.map((meal, i) => [
          i > 0 ? ', ' : '',
          a({ href: `/cuisines/${cuisine}/${slugify(meal)}` }, escapeHtml(meal)),
        ]),
        ` · ${totalTime(recipe)} min · serves ${recipe.servings} · ★ ${recipe.rating}`,
      ),
      h2('Ingredients'),
      ul(recipe.ingredients.map((ingredient) => li(escapeHtml(ingredient)))),
      h2('Method'),
      ol(recipe.instructions.map((step) => li(escapeHtml(step)))),
    ),
  )
}
