/**
 * Code samples for the "Writing pages" page.
 *
 * The code is identical across locales; only the greeting rendered by the
 * sample page is translated, so a Spanish reader sees Spanish output.
 */
const T = {
  en: { hello: 'Hello', staticAsItGets: 'Static as it gets' },
  es: { hello: 'Hola', staticAsItGets: 'Más estático imposible' },
}

export function pagesSnippets(lang = 'en') {
  const t = T[lang] ?? T.en

  return {
    fnTemplate: `export default ({ params, data, dev }) => \`
  <html>
    <body><h1>${t.hello}</h1></body>
  </html>
\``,

    fnHt: `import { html, body, h1 } from 'javascript-to-html'

export default ({ params, data, dev }) =>
  html(
    body(h1('${t.hello}'))
  )`,

    fnJsx: `export default function Page({ params, data, dev }) {
  return (
    <html>
      <body><h1>${t.hello}</h1></body>
    </html>
  )
}`,

    string: `export default \`<html><body><h1>${t.staticAsItGets}</h1></body></html>\``,

    structuredTemplate: `export default {
  generateStaticParams: () => [{ slug: 'hello' }],
  data: ({ params }) => ({ title: params.slug }),
  render: ({ data }) => \`<html><body><h1>\${data.title}</h1></body></html>\`,
}`,

    structuredHt: `import { html, body, h1 } from 'javascript-to-html'

export default {
  generateStaticParams: () => [{ slug: 'hello' }],
  data: ({ params }) => ({ title: params.slug }),
  render: ({ data }) =>
    html(
      body(h1(data.title))
    ),
}`,

    structuredJsx: `export default {
  generateStaticParams: () => [{ slug: 'hello' }],
  data: ({ params }) => ({ title: params.slug }),
  render: ({ data }) => (
    <html>
      <body><h1>{data.title}</h1></body>
    </html>
  ),
}`,
  }
}
