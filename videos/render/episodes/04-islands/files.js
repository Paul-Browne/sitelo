// The states episode 4's files pass through.

import { snapshot } from '../../lib/capture-kit.js'

const before = (file) => snapshot('03-routing', file)
const after = (file) => snapshot('04-islands', file)

export const start = {
  index: before('src/index.ht.js'),
  layout: before('src/lib/layout.js'),
  slug: before('src/recipes/[slug].ht.js'),
  styles: before('src/styles.css'),
}

export const whatsCooking = after('src/islands/whats-cooking.js')
export const comments = after('src/islands/comments.js')
export const loader = after('src/islands.js')
export const layout = after('src/lib/layout.js')
export const index = after('src/index.ht.js')
export const slug = after('src/recipes/[slug].ht.js')
export const styles = after('src/styles.css')
