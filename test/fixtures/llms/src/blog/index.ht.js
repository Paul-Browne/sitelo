import { layout } from '../layout.js'
import { posts } from './posts.js'

export default () =>
  layout(
    { title: 'Blog · Example', description: 'Every post.' },
    `<h1>Blog</h1><ul>${posts.map((p) => `<li><a href="${p.slug}/">${p.title}</a></li>`).join('')}</ul>`,
  )
