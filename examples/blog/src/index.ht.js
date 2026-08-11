import { getPosts } from './lib/posts.js'

export async function data() {
  return { posts: await getPosts() }
}

export default ({ data }) => `
  <html lang="en">
    <head>
      <title>My Blog</title>
      <meta name="description" content="A markdown blog built with sitelo">
      <link rel="stylesheet" href="/css/styles.css">
      <link rel="alternate" type="application/rss+xml" title="My Blog" href="/rss.xml">
    </head>
    <body>
      <h1>My Blog</h1>
      <ul class="posts">
        ${data.posts
          .map(
            (post) => `
          <li>
            <a href="/blog/${post.slug}">${post.title}</a>
            <time datetime="${post.date}">${post.date}</time>
            <p>${post.description}</p>
          </li>`,
          )
          .join('')}
      </ul>
      <p><a href="/rss.xml">RSS feed</a></p>
    </body>
  </html>
`
