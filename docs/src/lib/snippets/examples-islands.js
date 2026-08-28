/**
 * Code samples for the "Server islands" example.
 */
const T = {
  en: {
    nodeHost: 'Node host: static dist + islands',
    netlifyRewrite: 'Netlify rewrite → function',
    vercelRewrite: 'Vercel rewrite → api route',
    netlifyHandler: 'Netlify islands handler',
    vercelHandler: 'Vercel islands handler',
    pagePlaceholder: 'page with an island placeholder',
    clientLoader: 'client loader (bundled into dist/)',
    serverOnlyFragment: 'server-only fragment module',
    serverTime: 'Server time', rightNow: 'Right now',
    renderedOnRequest: 'Rendered on request for',
    demoTitle: 'Server islands demo',
    staticLive: 'Static page, live island',
    builtOnce: 'This HTML was built once. The box below is filled at request time.',
    loadingTime: '<p>Loading server time…</p>',
    listening: 'Listening on', notFound: 'Not found',
  },
  es: {
    nodeHost: 'host Node: dist estático + islas',
    netlifyRewrite: 'rewrite de Netlify → función',
    vercelRewrite: 'rewrite de Vercel → ruta api',
    netlifyHandler: 'manejador de islas para Netlify',
    vercelHandler: 'manejador de islas para Vercel',
    pagePlaceholder: 'página con un marcador de isla',
    clientLoader: 'cargador de cliente (se empaqueta en dist/)',
    serverOnlyFragment: 'módulo de fragmento solo de servidor',
    serverTime: 'Hora del servidor', rightNow: 'Ahora mismo',
    renderedOnRequest: 'Renderizado bajo petición para',
    demoTitle: 'Demo de islas de servidor',
    staticLive: 'Página estática, isla en vivo',
    builtOnce: 'Este HTML se generó una sola vez. El recuadro de abajo se rellena en el momento de la petición.',
    loadingTime: '<p>Cargando la hora del servidor…</p>',
    listening: 'Escuchando en', notFound: 'No encontrado',
  },
  fr: {
    nodeHost: 'hôte Node : dist statique + îlots',
    netlifyRewrite: 'rewrite Netlify → fonction',
    vercelRewrite: 'rewrite Vercel → route api',
    netlifyHandler: 'gestionnaire d’îlots Netlify',
    vercelHandler: 'gestionnaire d’îlots Vercel',
    pagePlaceholder: 'page avec un emplacement d’îlot',
    clientLoader: 'chargeur client (inclus dans dist/)',
    serverOnlyFragment: 'module de fragment côté serveur uniquement',
    serverTime: 'Heure du serveur', rightNow: 'À l’instant',
    renderedOnRequest: 'Rendu à la requête pour',
    demoTitle: 'Démo des îlots serveur',
    staticLive: 'Page statique, îlot en direct',
    builtOnce: 'Ce HTML a été construit une seule fois. L’encadré ci-dessous est rempli au moment de la requête.',
    loadingTime: '<p>Chargement de l’heure du serveur…</p>',
    listening: 'À l’écoute sur', notFound: 'Introuvable',
  },
  de: {
    nodeHost: 'Node-Host: statisches dist + Islands',
    netlifyRewrite: 'Netlify-Rewrite → Funktion',
    vercelRewrite: 'Vercel-Rewrite → api-Route',
    netlifyHandler: 'Netlify-Island-Handler',
    vercelHandler: 'Vercel-Island-Handler',
    pagePlaceholder: 'Seite mit einem Island-Platzhalter',
    clientLoader: 'Client-Loader (wird nach dist/ gebündelt)',
    serverOnlyFragment: 'reines Server-Fragmentmodul',
    serverTime: 'Serverzeit', rightNow: 'Gerade jetzt',
    renderedOnRequest: 'Auf Anfrage gerendert für',
    demoTitle: 'Server-Islands-Demo',
    staticLive: 'Statische Seite, lebendige Island',
    builtOnce: 'Dieses HTML wurde einmal gebaut. Der Kasten unten wird zur Anfragezeit gefüllt.',
    loadingTime: '<p>Serverzeit wird geladen…</p>',
    listening: 'Lauscht auf', notFound: 'Nicht gefunden',
  },
  ru: {
    nodeHost: 'хост на Node: статический dist + острова',
    netlifyRewrite: 'rewrite Netlify → функция',
    vercelRewrite: 'rewrite Vercel → api-маршрут',
    netlifyHandler: 'обработчик островов для Netlify',
    vercelHandler: 'обработчик островов для Vercel',
    pagePlaceholder: 'страница с плейсхолдером острова',
    clientLoader: 'клиентский загрузчик (собирается в dist/)',
    serverOnlyFragment: 'серверный модуль-фрагмент',
    serverTime: 'Время сервера', rightNow: 'Прямо сейчас',
    renderedOnRequest: 'Отрендерено по запросу для',
    demoTitle: 'Демо серверных островов',
    staticLive: 'Статическая страница, живой остров',
    builtOnce: 'Этот HTML собран один раз. Блок ниже заполняется в момент запроса.',
    loadingTime: '<p>Загрузка времени сервера…</p>',
    listening: 'Слушаю на', notFound: 'Не найдено',
  },
  zh: {
    nodeHost: 'Node 宿主：静态 dist + 区块',
    netlifyRewrite: 'Netlify 重写 → 函数',
    vercelRewrite: 'Vercel 重写 → api 路由',
    netlifyHandler: 'Netlify 区块处理器',
    vercelHandler: 'Vercel 区块处理器',
    pagePlaceholder: '带区块占位符的页面',
    clientLoader: '客户端加载器（打包进 dist/）',
    serverOnlyFragment: '仅服务端的片段模块',
    serverTime: '服务器时间', rightNow: '此刻',
    renderedOnRequest: '按请求渲染，用户代理为',
    demoTitle: '服务端区块演示',
    staticLive: '静态页面，动态区块',
    builtOnce: '这段 HTML 只构建了一次。下面的方框在请求时才被填充。',
    loadingTime: '<p>正在加载服务器时间…</p>',
    listening: '正在监听', notFound: '未找到',
  },
  pt: {
    nodeHost: 'host Node: dist estático + ilhas',
    netlifyRewrite: 'rewrite do Netlify → função',
    vercelRewrite: 'rewrite do Vercel → rota api',
    netlifyHandler: 'handler de ilhas do Netlify',
    vercelHandler: 'handler de ilhas do Vercel',
    pagePlaceholder: 'página com um marcador de ilha',
    clientLoader: 'carregador de cliente (incluído em dist/)',
    serverOnlyFragment: 'módulo de fragmento só de servidor',
    serverTime: 'Hora do servidor',
    rightNow: 'Agora mesmo',
    renderedOnRequest: 'Renderizado a pedido para',
    demoTitle: 'Demonstração de ilhas de servidor',
    staticLive: 'Página estática, ilha ao vivo',
    builtOnce: 'Este HTML foi compilado uma só vez. A caixa abaixo é preenchida no momento do pedido.',
    loadingTime: '<p>A carregar a hora do servidor…</p>',
    listening: 'À escuta em',
    notFound: 'Não encontrado',
  },
}

export function islandsExampleSnippets(lang = 'en') {
  const t = T[lang] ?? T.en
  const htmlLang = T[lang] ? lang : 'en'

  return {
    structure: `my-site/
  sitelo.config.js
  server.js              # ${t.nodeHost}
  netlify.toml           # ${t.netlifyRewrite}
  vercel.json            # ${t.vercelRewrite}
  package.json
  netlify/functions/
    islands.mjs          # ${t.netlifyHandler}
  api/islands/
    [...path].js         # ${t.vercelHandler}
  src/
    index.ht.js          # ${t.pagePlaceholder}
    js/
      islands.js         # ${t.clientLoader}
    islands/
      time.js            # ${t.serverOnlyFragment}
    css/
      styles.css`,

    config: `export default {
  site: 'https://example.com',
}`,

    island: `export default function time({ props, request }) {
  const label = typeof props?.label === 'string' ? props.label : '${t.serverTime}'
  const now = new Date().toISOString()
  const ua = request?.headers?.get?.('user-agent') ?? 'unknown'

  return \`
    <p><strong>\${label}:</strong> <time datetime="\${now}">\${now}</time></p>
    <p class="muted">${t.renderedOnRequest} <code>\${escapeHtml(ua.slice(0, 48))}</code></p>
  \`
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}`,

    pageTemplate: `import { island } from 'sitelo/islands'

export default () => \`
  <html lang="${htmlLang}">
    <head>
      <title>${t.demoTitle}</title>
      <link rel="stylesheet" href="/css/styles.css">
    </head>
    <body>
      <h1>${t.staticLive}</h1>
      <p>${t.builtOnce}</p>
      \${island(
        'time',
        { label: '${t.rightNow}' },
        '${t.loadingTime}',
      )}
      <script type="module" src="/js/islands.js"></script>
    </body>
  </html>
\``,

    pageHt: `import { html, head, title, link, body, h1, p, script } from 'javascript-to-html'
import { island } from 'sitelo/islands'

export default () =>
  html({ lang: '${htmlLang}' },
    head(
      title('${t.demoTitle}'),
      link({ rel: 'stylesheet', href: '/styles.css' }),
    ),
    body(
      h1('${t.staticLive}'),
      p('${t.builtOnce}'),
      island(
        'time',
        { label: '${t.rightNow}' },
        '${t.loadingTime}',
      ),
      script({ type: 'module', src: '/islands.js' }),
    ),
  )`,

    pageJsx: `import { island } from 'sitelo/islands'

export default function Home() {
  return (
    <html lang="${htmlLang}">
      <head>
        <title>${t.demoTitle}</title>
        <link rel="stylesheet" href="/css/styles.css" />
      </head>
      <body>
        <h1>${t.staticLive}</h1>
        <p>${t.builtOnce}</p>
        {island(
          'time',
          { label: '${t.rightNow}' },
          '${t.loadingTime}',
        )}
        <script type="module" src="/js/islands.js" />
      </body>
    </html>
  )
}`,

    loader: `import { mountIslands } from 'sitelo/islands/client'

mountIslands()`,

    styles: `body {
  font-family: system-ui, sans-serif;
  max-width: 36rem;
  margin: 2rem auto;
  padding: 0 1rem;
  line-height: 1.5;
}

[data-sitelo-island] {
  margin: 1.5rem 0;
  padding: 1rem 1.25rem;
  border: 1px solid #ccc;
}

[data-sitelo-island-state='loading'] {
  opacity: 0.7;
}

.muted {
  color: #666;
  font-size: 0.9rem;
}`,

    server: `import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createIslandsFromDirectory, createIslandsNodeHandler } from 'sitelo/islands/server'

const root = path.dirname(fileURLToPath(import.meta.url))
const dist = path.join(root, 'dist')
const port = Number(process.env.PORT) || 3000

const handleIslands = createIslandsNodeHandler({
  islands: createIslandsFromDirectory(path.join(root, 'src/islands')),
})

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml',
  '.json': 'application/json',
}

function sendFile(res, filePath) {
  const ext = path.extname(filePath)
  res.statusCode = 200
  res.setHeader('Content-Type', MIME[ext] ?? 'application/octet-stream')
  fs.createReadStream(filePath).pipe(res)
}

function resolveStatic(urlPath) {
  const clean = decodeURIComponent(urlPath.split('?')[0])
  const relative = clean === '/' ? 'index.html' : clean.replace(/^\\/+/, '')
  const candidate = path.normalize(path.join(dist, relative))

  if (!candidate.startsWith(dist + path.sep) && candidate !== dist) {
    return null
  }
  if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
    return candidate
  }

  const asIndex = path.join(candidate, 'index.html')
  if (fs.existsSync(asIndex) && fs.statSync(asIndex).isFile()) {
    return asIndex
  }

  return null
}

const server = http.createServer(async (req, res) => {
  await handleIslands(req, res, () => {
    const file = resolveStatic(req.url ?? '/')
    if (file) {
      sendFile(res, file)
      return
    }

    const notFound = path.join(dist, '404.html')
    res.statusCode = 404
    if (fs.existsSync(notFound)) {
      sendFile(res, notFound)
    } else {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8')
      res.end('${t.notFound}')
    }
  })
})

server.listen(port, () => {
  console.log(\`${t.listening} http://localhost:\${port}\`)
})`,

    buildRun: `npm install
sitelo build
node server.js`,
  }
}
