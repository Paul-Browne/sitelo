import {
  getAllPosts,
  getPostBySlug,
  featuredImage,
} from '../lib/wordpress.js'

export async function generateStaticParams() {
  // Rip every published post (thousands are fine — 100 per request)
  const posts = await getAllPosts({
    embed: false, // slugs only; skip _embed for speed
    onPage: (page, totalPages, count) => {
      console.log(`[wordpress] page ${page}/${totalPages} (${count} posts)`)
    },
  })

  return posts.map((post) => ({ slug: post.slug }))
}

export async function data({ params }) {
  const post = await getPostBySlug(params.slug)
  if (!post) throw new Error(`Post not found: ${params.slug}`)
  return { post }
}

export default ({ data }) => {
  const { post } = data
  const image = featuredImage(post)

  return `
    <html lang="en">
      <head>
        <title>${post.title.rendered}</title>
        <link rel="stylesheet" href="/styles.css">
      </head>
      <body>
        <article>
          <p><a href="/blog">← Blog</a></p>
          <h1>${post.title.rendered}</h1>
          <time>${post.date.slice(0, 10)}</time>
          ${image ? `<img src="${image}" alt="">` : ''}
          <div class="content">
            ${post.content.rendered}
          </div>
        </article>
      </body>
    </html>
  `
}
