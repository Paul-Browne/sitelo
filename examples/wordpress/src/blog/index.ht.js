import { getAllPosts, postPath } from '../lib/wordpress.js'

export async function data() {
  // Full archive — paginate through the whole WP site
  const posts = await getAllPosts({ embed: false })
  return { posts }
}

export default ({ data }) => `
  <html lang="en">
    <head>
      <title>Blog</title>
      <link rel="stylesheet" href="/styles.css">
    </head>
    <body>
      <h1>Blog (${data.posts.length})</h1>
      <ul>
        ${data.posts
          .map(
            (post) => `
          <li>
            <a href="${postPath(post)}">${post.title.rendered}</a>
            <time>${post.date.slice(0, 10)}</time>
          </li>`,
          )
          .join('')}
      </ul>
    </body>
  </html>
`
