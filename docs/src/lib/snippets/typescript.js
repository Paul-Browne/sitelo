/**
 * Code samples for the TypeScript page.
 *
 * Shared verbatim by every locale — pure code, nothing to translate.
 */

export const typedTemplate = `import { definePageModule } from 'sitelo/page'

export default definePageModule({
  generateStaticParams: () => [{ slug: 'hello' }],
  data: ({ params }) => ({ title: params.slug }),
  render: ({ data }) => \`<html><body><h1>\${data.title}</h1></body></html>\`,
})`

export const typedHt = `import { html, body, h1 } from 'javascript-to-html'
import { definePageModule } from 'sitelo/page'

export default definePageModule({
  generateStaticParams: () => [{ slug: 'hello' }],
  data: ({ params }) => ({ title: params.slug }),
  render: ({ data }) =>
    html(
      body(h1(data.title))
    ),
})`

export const typedJsx = `import { definePageModule } from 'sitelo/page'

export default definePageModule({
  generateStaticParams: () => [{ slug: 'hello' }],
  data: ({ params }) => ({ title: params.slug }),
  render: ({ data }) => (
    <html>
      <body>
        <h1>{data.title}</h1>
      </body>
    </html>
  ),
})`
