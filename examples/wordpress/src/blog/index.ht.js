import { getAllPosts, postPath, sourceSite } from '../lib/wordpress.js'

export async function data() {
  // Full archive — paginate through the whole WP site (or WP_LIMIT)
  const posts = await getAllPosts({ embed: false })
  return { posts, source: sourceSite() }
}

export default ({ data }) => `
  <html lang="en">
    <head>
      <title>Blog — Speckyboy → sitelo</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="stylesheet" href="/css/styles.css">
    </head>
    <body>
      <header class="site-header">
        <p><a href="/">← Home</a></p>
        <h1>Blog (${data.posts.length})</h1>
        <p class="lede">
          Every published post from
          <a href="${data.source}" rel="noopener">${data.source.replace(/^https?:\/\//, '')}</a>.
        </p>
      </header>
      <main>
        <ul class="post-list">
          ${data.posts
            .map(
              (post) => `
            <li>
              <a href="${postPath(post)}">${post.title.rendered}</a>
              <time datetime="${post.date}">${post.date.slice(0, 10)}</time>
            </li>`,
            )
            .join('')}
        </ul>
      </main>
      <footer class="site-footer">
        Content © <a href="${data.source}" rel="noopener">Speckyboy</a>.
      </footer>
    </body>
  </html>
`
