/**
 * Code samples for the Server islands page.
 */
const T = {
  en: {
    staticContent: '…static content…',
    loadingComments: '<p>Loading comments…</p>',
    loadWithPage: 'Load as soon as the page does — the default.',
    waitIdle: 'Wait for an idle callback.',
    waitVisible: 'Wait until it scrolls into view.',
    startEarly: 'start loading 400px early',
    perIsland: "per-island; 0 disables. Default 10000",
    visibleDefault: "default for `when: 'visible'` islands",
    serverComment: 'e.g. a Node server, or a serverless/edge function',
    notIslandRequest: 'Web Request → Response | null (null = not an island request)',
  },
  es: {
    staticContent: '…contenido estático…',
    loadingComments: '<p>Cargando comentarios…</p>',
    loadWithPage: 'Carga en cuanto lo hace la página — el valor por defecto.',
    waitIdle: 'Espera a un callback de inactividad.',
    waitVisible: 'Espera a que entre en pantalla.',
    startEarly: 'empieza a cargar 400px antes',
    perIsland: 'por isla; 0 lo desactiva. Por defecto 10000',
    visibleDefault: "valor por defecto para islas con `when: 'visible'`",
    serverComment: 'p. ej. un servidor Node, o una función serverless/edge',
    notIslandRequest:
      'Web Request → Response | null (null = no es una petición de isla)',
  },
}

export function islandsSnippets(lang = 'en') {
  const t = T[lang] ?? T.en

  return {
    islandModule: `export default async function comments({ props, request }) {
  const comments = await fetchComments(props.postId)
  return \`<ul>\${comments.map((c) => \`<li>\${c.text}</li>\`).join('')}</ul>\`
}`,

    pageTemplate: `import { island } from 'sitelo/islands'

export default ({ params }) => \`
  <html>
    <body>
      <article>${t.staticContent}</article>
      \${island('comments', { postId: params.slug }, '${t.loadingComments}')}
      <script type="module" src="/islands.js"></script>
    </body>
  </html>
\``,

    pageHt: `import { html, body, article, script } from 'javascript-to-html'
import { island } from 'sitelo/islands'

export default ({ params }) =>
  html(
    body(
      article('${t.staticContent}'),
      island('comments', { postId: params.slug }, '${t.loadingComments}'),
      script({ type: 'module', src: '/islands.js' }),
    ),
  )`,

    pageJsx: `import { island } from 'sitelo/islands'

export default function Post({ params }) {
  return (
    <html>
      <body>
        <article>${t.staticContent}</article>
        {island('comments', { postId: params.slug }, '${t.loadingComments}')}
        <script type="module" src="/islands.js" />
      </body>
    </html>
  )
}`,

    loader: `import { mountIslands } from 'sitelo/islands/client'

mountIslands()`,

    server: `// ${t.serverComment}
import { createIslandsHandler } from 'sitelo/islands/server'

const handleIslands = createIslandsHandler({
  islands: {
    comments: () => import('./src/islands/comments.js'),
  },
})

// ${t.notIslandRequest}
export default { fetch: (request) => handleIslands(request) }`,

    strategy: `// ${t.loadWithPage}
island('cart', { id }, '<p>…</p>')

// ${t.waitIdle}
island('recommendations', { id }, '<p>…</p>', { when: 'idle' })

// ${t.waitVisible}
island('comments', { postId }, '${t.loadingComments}', {
  when: 'visible',
  rootMargin: '400px',   // ${t.startEarly}
})`,

    mountOptions: `mountIslands({
  timeout: 5000,        // ${t.perIsland}
  rootMargin: '300px',  // ${t.visibleDefault}
})`,

    forged: `GET /_sitelo/islands/profile?props={"userId":"someone-else"}`,

    secret: `SITELO_ISLANDS_SECRET=$(openssl rand -hex 32) sitelo build`,

    configure: `import { configureIslands } from 'sitelo/islands'

configureIslands({ secret: process.env.MY_SECRET })`,
  }
}
