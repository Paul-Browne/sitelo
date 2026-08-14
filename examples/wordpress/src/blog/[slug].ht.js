import {
  getAllPosts,
  getPostBySlug,
  featuredImage,
  sourceSite,
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
  return { post, source: sourceSite() }
}

export default ({ data }) => {
  const { post, source } = data
  const image = featuredImage(post)

  return `
    <html lang="en">
      <head>
        <title>${post.title.rendered} — Speckyboy → sitelo</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="/css/styles.css">
      </head>
      <body>
        <article>
          <p class="crumb"><a href="/blog">← Blog</a></p>
          <h1>${post.title.rendered}</h1>
          <time datetime="${post.date}">${post.date.slice(0, 10)}</time>
          ${image ? `<img class="hero" src="${image}" alt="">` : ''}
          <div class="content">
            ${post.content.rendered}
          </div>
        </article>
        <footer class="site-footer">
          Original:
          <a href="${post.link}" rel="noopener">${post.link}</a>
          · Content © <a href="${source}" rel="noopener">Speckyboy</a>
        </footer>
      </body>
    </html>
  `
}
