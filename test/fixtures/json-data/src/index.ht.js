import { readJson, readJsonCollection } from 'sitelo/data'

export async function data() {
  return {
    site: await readJson('data/site.json'),
    posts: await readJsonCollection('data/posts', { sort: '-date' }),
  }
}

export default ({ data }) => `
  <html lang="en">
    <head>
      <title>${data.site.title}</title>
      <meta name="description" content="${data.site.description}">
    </head>
    <body>
      <h1>${data.site.title}</h1>
      <ul>
        ${data.posts
          .map(
            (post) =>
              `<li><a href="/blog/${post.slug}">${post.title}</a></li>`,
          )
          .join('')}
      </ul>
    </body>
  </html>
`
