import { getPosts, postPath } from './lib/wordpress.js'

export async function data() {
  const posts = await getPosts({ perPage: 5 })
  return { posts }
}

export default ({ data }) => `
  <html lang="en">
    <head>
      <title>My site</title>
      <link rel="stylesheet" href="/styles.css">
    </head>
    <body>
      <h1>Latest from the blog</h1>
      <ul>
        ${data.posts
          .map(
            (post) => `
          <li>
            <a href="${postPath(post)}">${post.title.rendered}</a>
          </li>`,
          )
          .join('')}
      </ul>
      <p><a href="/blog">All posts</a></p>
    </body>
  </html>
`
