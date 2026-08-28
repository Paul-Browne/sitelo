/**
 * Code samples for the Configuration page.
 */
const T = {
  en: {
    myBlog: 'My Blog',
    latestPosts: 'Latest posts',
    viteOnly: 'Vite options only; sitelo still injects the plugin',
    registerPlugin: 'Register the plugin yourself',
    linkCheckModes: "'warn' (default), 'error', or an options object",
    failBuild: 'fail the build on a dead link',
    verifyFragments: 'also verify #fragment targets',
    hideToolbar: 'hide for everyone on this project',
    brokenLinks: 'broken internal links',
    escapesOutDir: 'escapes the output directory',
    noSuchPage: 'no such page',
    mySite: 'My site',
    home: 'Home',
    hello: 'Hello',
    onlyIndexed: 'Only this region is indexed.',
    indexAfterBuild:
      'Index only exists after `sitelo build` (synced to public/pagefind by default)',
    thenPreview: 'then: sitelo preview — or sitelo (dev) using public/pagefind',
  },
  es: {
    myBlog: 'Mi blog',
    latestPosts: 'Últimas entradas',
    viteOnly: 'Solo opciones de Vite; sitelo sigue inyectando el plugin',
    registerPlugin: 'Registra el plugin tú mismo',
    linkCheckModes: "'warn' (por defecto), 'error', o un objeto de opciones",
    failBuild: 'falla la compilación si hay un enlace roto',
    verifyFragments: 'verifica también los destinos #fragmento',
    hideToolbar: 'ocúltala para todo el mundo en este proyecto',
    brokenLinks: 'enlaces internos rotos',
    escapesOutDir: 'se sale del directorio de salida',
    noSuchPage: 'no existe esa página',
    mySite: 'Mi sitio',
    home: 'Inicio',
    hello: 'Hola',
    onlyIndexed: 'Solo se indexa esta región.',
    indexAfterBuild:
      'El índice solo existe tras `sitelo build` (se sincroniza a public/pagefind por defecto)',
    thenPreview:
      'luego: sitelo preview — o sitelo (dev) usando public/pagefind',
  },
  fr: {
    myBlog: 'Mon blog',
    latestPosts: 'Derniers articles',
    viteOnly: 'Options Vite uniquement ; sitelo injecte toujours le plugin',
    registerPlugin: 'Enregistrer le plugin soi-même',
    linkCheckModes: "'warn' (par défaut), 'error', ou un objet d’options",
    failBuild: 'fait échouer le build sur un lien mort',
    verifyFragments: 'vérifie aussi les cibles #fragment',
    hideToolbar: 'masquer pour tout le monde sur ce projet',
    brokenLinks: 'liens internes cassés',
    escapesOutDir: 'sort du répertoire de sortie',
    noSuchPage: 'page inexistante',
    mySite: 'Mon site',
    home: 'Accueil',
    hello: 'Bonjour',
    onlyIndexed: 'Seule cette zone est indexée.',
    indexAfterBuild: 'L’index n’existe qu’après `sitelo build` (synchronisé vers public/pagefind par défaut)',
    thenPreview: 'ensuite : sitelo preview — ou sitelo (dev) avec public/pagefind',
  },
  de: {
    myBlog: 'Mein Blog',
    latestPosts: 'Neueste Beiträge',
    viteOnly: 'Nur Vite-Optionen; sitelo bindet das Plugin trotzdem ein',
    registerPlugin: 'Das Plugin selbst registrieren',
    linkCheckModes: "'warn' (Standard), 'error', oder ein Optionsobjekt",
    failBuild: 'lässt den Build bei einem toten Link fehlschlagen',
    verifyFragments: 'prüft auch #fragment-Ziele',
    hideToolbar: 'für alle in diesem Projekt ausblenden',
    brokenLinks: 'defekte interne Links',
    escapesOutDir: 'verlässt das Ausgabeverzeichnis',
    noSuchPage: 'Seite existiert nicht',
    mySite: 'Meine Website',
    home: 'Startseite',
    hello: 'Hallo',
    onlyIndexed: 'Nur dieser Bereich wird indexiert.',
    indexAfterBuild: 'Der Index existiert erst nach `sitelo build` (wird standardmäßig nach public/pagefind synchronisiert)',
    thenPreview: 'danach: sitelo preview — oder sitelo (dev) mit public/pagefind',
  },
  ru: {
    myBlog: 'Мой блог',
    latestPosts: 'Последние записи',
    viteOnly: 'Только параметры Vite; sitelo всё равно подключит плагин',
    registerPlugin: 'Подключить плагин самостоятельно',
    linkCheckModes: "'warn' (по умолчанию), 'error' или объект параметров",
    failBuild: 'прервать сборку при битой ссылке',
    verifyFragments: 'проверять также цели #fragment',
    hideToolbar: 'скрыть для всех в этом проекте',
    brokenLinks: 'битых внутренних ссылок',
    escapesOutDir: 'выходит за пределы каталога сборки',
    noSuchPage: 'такой страницы нет',
    mySite: 'Мой сайт',
    home: 'Главная',
    hello: 'Привет',
    onlyIndexed: 'Индексируется только эта область.',
    indexAfterBuild: 'Индекс появляется только после `sitelo build` (по умолчанию синхронизируется в public/pagefind)',
    thenPreview: 'затем: sitelo preview — или sitelo (dev) с public/pagefind',
  },
  zh: {
    myBlog: '我的博客',
    latestPosts: '最新文章',
    viteOnly: '仅 Vite 选项；sitelo 仍会注入插件',
    registerPlugin: '自行注册插件',
    linkCheckModes: "'warn'（默认）、'error'，或一个选项对象",
    failBuild: '遇到死链时让构建失败',
    verifyFragments: '同时校验 #fragment 目标',
    hideToolbar: '为本项目的所有人隐藏',
    brokenLinks: '个失效的内部链接',
    escapesOutDir: '超出了输出目录',
    noSuchPage: '没有这个页面',
    mySite: '我的网站',
    home: '首页',
    hello: '你好',
    onlyIndexed: '只有这个区域会被索引。',
    indexAfterBuild: '索引只在 `sitelo build` 之后存在（默认同步到 public/pagefind）',
    thenPreview: '然后：sitelo preview — 或使用 public/pagefind 的 sitelo (dev)',
  },
  pt: {
    myBlog: 'O meu blogue',
    latestPosts: 'Últimos artigos',
    viteOnly: 'Apenas opções do Vite; o sitelo continua a injetar o plugin',
    registerPlugin: 'Registar o plugin manualmente',
    linkCheckModes: "'warn' (por omissão), 'error', ou um objeto de opções",
    failBuild: 'falha a compilação perante uma ligação morta',
    verifyFragments: 'verifica também os destinos #fragmento',
    hideToolbar: 'ocultar para toda a gente neste projeto',
    brokenLinks: 'ligações internas partidas',
    escapesOutDir: 'sai do diretório de saída',
    noSuchPage: 'não existe essa página',
    mySite: 'O meu site',
    home: 'Início',
    hello: 'Olá',
    onlyIndexed: 'Só esta região é indexada.',
    indexAfterBuild: 'O índice só existe depois de `sitelo build` (sincronizado para public/pagefind por omissão)',
    thenPreview: 'depois: sitelo preview — ou sitelo (dev) a usar public/pagefind',
  },
}

export function configurationSnippets(lang = 'en') {
  const t = T[lang] ?? T.en
  const htmlLang = T[lang] ? lang : 'en'

  return {
    config: `export default {
  site: 'https://example.com',
  rss: {
    site: 'https://example.com',
    title: '${t.myBlog}',
    description: '${t.latestPosts}',
    routePrefix: '/blog',
  },
  vite: {
    publicDir: 'static',
    build: {
      emptyOutDir: true,
      outDir: 'public',
    },
    server: {
      port: 8888,
    },
  },
}`,

    viteOnly: `// ${t.viteOnly}
export default {
  publicDir: 'static',
  server: { port: 8888 },
}`,

    vitePlugin: `// ${t.registerPlugin}
import htmlPages from 'sitelo'

export default {
  plugins: [htmlPages({
    site: 'https://example.com',
  })],
}`,

    rss: `export default {
  rss: {
    site: 'https://example.com',
    title: '${t.myBlog}',
    description: '${t.latestPosts}',
    routePrefix: '/blog',
  },
}`,

    devToolbarOff: `// sitelo.config.js
export default {
  devToolbar: false, // ${t.hideToolbar}
}`,

    linkCheck: `export default {
  linkCheck: true,   // ${t.linkCheckModes}
}`,

    linkCheckOptions: `export default {
  linkCheck: {
    mode: 'error',                    // ${t.failBuild}
    checkFragments: true,             // ${t.verifyFragments}
    exclude: ['/api/**', /^\\/legacy\\//],
  },
}`,

    linkCheckOutput: `[sitelo] 3 ${t.brokenLinks}

  index.html
    ../escape           -> ${t.escapesOutDir}
    /abuot              -> ${t.noSuchPage}
    /blog/missing-post  -> ${t.noSuchPage}`,

    pagefind: `export default {
  pagefind: true,
}`,

    installPagefind: `npm install -D pagefind`,

    pagefindPageTemplate: `export default () => \`
  <html lang="${htmlLang}">
    <head>
      <title>${t.mySite}</title>
      <link rel="stylesheet" href="/styles.css">
      <script type="module" src="/main.js"></script>
    </head>
    <body>
      <header>
        <a href="/">${t.home}</a>
        <div id="search"></div>
      </header>
      <main data-pagefind-body>
        <h1>${t.hello}</h1>
        <p>${t.onlyIndexed}</p>
      </main>
    </body>
  </html>
\``,

    pagefindPageHt: `import {
  html, head, title, link, script, body, header, a, div, main, h1, p,
} from 'javascript-to-html'

export default () =>
  html({ lang: '${htmlLang}' },
    head(
      title('${t.mySite}'),
      link({ rel: 'stylesheet', href: '/styles.css' }),
      script({ type: 'module', src: '/main.js' }),
    ),
    body(
      header(
        a({ href: '/' }, '${t.home}'),
        div({ id: 'search' }),
      ),
      main({ 'data-pagefind-body': '' },
        h1('${t.hello}'),
        p('${t.onlyIndexed}'),
      ),
    ),
  )`,

    pagefindPageJsx: `export default function Home() {
  return (
    <html lang="${htmlLang}">
      <head>
        <title>${t.mySite}</title>
        <link rel="stylesheet" href="/styles.css" />
        <script type="module" src="/main.js" />
      </head>
      <body>
        <header>
          <a href="/">${t.home}</a>
          <div id="search" />
        </header>
        <main data-pagefind-body="">
          <h1>${t.hello}</h1>
          <p>${t.onlyIndexed}</p>
        </main>
      </body>
    </html>
  )
}`,

    pagefindMain: `async function initSearch() {
  const mount = document.querySelector('#search')
  if (!mount) return

  // ${t.indexAfterBuild}
  try {
    const probe = await fetch('/pagefind/pagefind-ui.js', { method: 'HEAD' })
    if (!probe.ok) return
  } catch {
    return
  }

  const style = document.createElement('link')
  style.rel = 'stylesheet'
  style.href = '/pagefind/pagefind-ui.css'
  document.head.appendChild(style)

  await new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = '/pagefind/pagefind-ui.js'
    script.onload = resolve
    script.onerror = reject
    document.body.appendChild(script)
  })

  new window.PagefindUI({
    element: '#search',
    showImages: false,
  })
}

initSearch()`,

    pagefindBuild: `sitelo build
# ${t.thenPreview}`,

    pagefindGitignore: `public/pagefind/`,
  }
}
