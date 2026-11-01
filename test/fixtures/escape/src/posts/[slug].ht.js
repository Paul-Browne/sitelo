import { definePageModule, escapeHtml } from 'sitelo/page'

const posts = [
  {
    slug: 'hello',
    title: '<script>alert(1)</script> & friends',
    summary: `Ada's "first" post`,
  },
]

export default definePageModule({
  generateStaticParams: () => posts.map(({ slug }) => ({ slug })),
  data: ({ params }) => posts.find((post) => post.slug === params.slug),
  render: ({ data }) => `
    <html lang="en">
      <head>
        <title>${escapeHtml(data.title)}</title>
      </head>
      <body>
        <h1 title="${escapeHtml(data.summary)}">${escapeHtml(data.title)}</h1>
      </body>
    </html>
  `,
})
