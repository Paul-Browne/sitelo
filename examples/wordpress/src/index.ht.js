import { getPosts, postPath, sourceSite } from './lib/wordpress.js'

export async function data() {
  const posts = await getPosts({ perPage: 8 })
  return { posts, source: sourceSite() }
}

export default ({ data }) => `
  <html lang="en">
    <head>
      <title>Speckyboy → sitelo</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta name="description" content="Static rebuild of Speckyboy posts via the WordPress REST API.">
      <link rel="stylesheet" href="/css/styles.css">
    </head>
    <body>
      <header class="site-header">
        <p class="eyebrow">sitelo · WordPress example</p>
        <h1>Speckyboy → static</h1>
        <p class="lede">
          Latest posts ripped from
          <a href="${data.source}" rel="noopener">${data.source.replace(/^https?:\/\//, '')}</a>
          via <code>/wp-json/wp/v2/posts</code>.
        </p>
      </header>
      <main>
        <h2>Latest</h2>
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
        <p><a class="more" href="/blog">All posts →</a></p>
      </main>
      <footer class="site-footer">
        Content © <a href="${data.source}" rel="noopener">Speckyboy</a>.
        Built with <a href="https://sitelo.js.org">sitelo</a>.
      </footer>
    </body>
  </html>
`
