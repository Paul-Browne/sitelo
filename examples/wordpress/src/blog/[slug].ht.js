import {
  getAllPosts,
  getPostBySlug,
  featuredImage,
  sourceSite,
} from '../lib/wordpress.js'

export async function generateStaticParams() {
  const ripStarted = performance.now()
  console.log(
    `[wordpress] ripping posts… (${process.uptime().toFixed(1)}s since start)`,
  )

  // Rip every published post (thousands are fine — 100 per request).
  // embed: true so posts (incl. featured images) land in the in-memory
  // cache and data() can skip ~2k per-slug API round-trips.
  const posts = await getAllPosts({
    embed: true,
    onPage: (page, totalPages, count) => {
      console.log(`[wordpress] page ${page}/${totalPages} (${count} posts)`)
    },
  })

  const ripSeconds = ((performance.now() - ripStarted) / 1000).toFixed(1)
  console.log(
    `[wordpress] ripped ${posts.length} posts in ${ripSeconds}s` +
      ` (${process.uptime().toFixed(1)}s since start)`,
  )

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
