import { getPost, getPosts } from '../lib/posts.js'

export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function data({ params }) {
  const post = await getPost(params.slug)
  if (!post) throw new Error(`Post not found: ${params.slug}`)
  return { post }
}

export default ({ data }) => {
  const { post } = data

  return `
    <html lang="en">
      <head>
        <title>${post.title} — My Blog</title>
        <meta name="description" content="${post.description}">
        <link rel="stylesheet" href="/css/styles.css">
      </head>
      <body>
        <article>
          <p><a href="/">← All posts</a></p>
          <h1>${post.title}</h1>
          <time datetime="${post.date}">${post.date}</time>
          ${post.html}
        </article>
      </body>
    </html>
  `
}
