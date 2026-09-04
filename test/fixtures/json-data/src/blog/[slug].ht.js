import { readJsonCollection } from 'sitelo/data'

const posts = () => readJsonCollection('data/posts', { sort: '-date' })

export async function generateStaticParams() {
  return (await posts()).map((post) => ({ slug: post.slug }))
}

export async function data({ params }) {
  return (await posts()).find((post) => post.slug === params.slug)
}

export default ({ data }) => `
  <html lang="en">
    <head>
      <title>${data.title}</title>
    </head>
    <body>
      <h1>${data.title}</h1>
      <time datetime="${data.date}">${data.date}</time>
      <p>${data.body}</p>
    </body>
  </html>
`
