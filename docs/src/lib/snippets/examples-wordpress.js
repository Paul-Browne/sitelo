/**
 * Code samples for the WordPress example.
 */
const T = {
  en: {
    wpHelpers: 'WP REST helpers (paginated rip)',
    homeComment: 'home — list latest posts',
    archiveComment: '/blog — full archive',
    everyPost: '/blog/:slug — every post',
    raiseConcurrency: 'thousands of pages? raise concurrency',
    wpMax: 'WP max for /wp/v2/posts',
    walkEvery: 'Walk every page of /posts until the site is fully ripped.',
    fullArchive: 'Full archive — paginate through the whole WP site',
    ripping: 'ripping posts…', sinceStart: 'since start',
    ripEvery: 'Rip every published post (thousands are fine — 100 per request)',
    slugsOnly: 'slugs only; skip _embed for speed',
    page: 'page', posts: 'posts', ripped: 'ripped', inTime: 'in',
    mySite: 'My site', latestFromBlog: 'Latest from the blog',
    allPosts: 'All posts', blog: 'Blog', backToBlog: '← Blog',
    notFound: 'Post not found',
  },
  es: {
    wpHelpers: 'ayudantes de la REST de WP (descarga paginada)',
    homeComment: 'inicio — lista las entradas más recientes',
    archiveComment: '/blog — archivo completo',
    everyPost: '/blog/:slug — todas las entradas',
    raiseConcurrency: '¿miles de páginas? sube la concurrencia',
    wpMax: 'máximo de WP para /wp/v2/posts',
    walkEvery: 'Recorre todas las páginas de /posts hasta descargar el sitio entero.',
    fullArchive: 'Archivo completo — pagina por todo el sitio de WP',
    ripping: 'descargando entradas…', sinceStart: 'desde el inicio',
    ripEvery: 'Descarga todas las entradas publicadas (miles no son problema — 100 por petición)',
    slugsOnly: 'solo slugs; omite _embed por velocidad',
    page: 'página', posts: 'entradas', ripped: 'descargadas', inTime: 'en',
    mySite: 'Mi sitio', latestFromBlog: 'Lo último del blog',
    allPosts: 'Todas las entradas', blog: 'Blog', backToBlog: '← Blog',
    notFound: 'Entrada no encontrada',
  },
  fr: {
    wpHelpers: 'utilitaires REST WP (aspiration paginée)',
    homeComment: 'accueil — liste les derniers articles',
    archiveComment: '/blog — archive complète',
    everyPost: '/blog/:slug — tous les articles',
    raiseConcurrency: 'des milliers de pages ? augmentez la concurrence',
    wpMax: 'maximum WP pour /wp/v2/posts',
    walkEvery: 'Parcourt toutes les pages de /posts jusqu’à aspirer le site entier.',
    fullArchive: 'Archive complète — pagine à travers tout le site WP',
    ripping: 'aspiration des articles…', sinceStart: 'depuis le démarrage',
    ripEvery: 'Aspire chaque article publié (des milliers, sans souci — 100 par requête)',
    slugsOnly: 'slugs seulement ; on saute _embed pour la vitesse',
    page: 'page', posts: 'articles', ripped: 'aspirés', inTime: 'en',
    mySite: 'Mon site', latestFromBlog: 'Derniers articles du blog',
    allPosts: 'Tous les articles', blog: 'Blog', backToBlog: '← Blog',
    notFound: 'Article introuvable',
  },
  de: {
    wpHelpers: 'WP-REST-Helfer (paginiertes Abziehen)',
    homeComment: 'Startseite — listet die neuesten Beiträge',
    archiveComment: '/blog — vollständiges Archiv',
    everyPost: '/blog/:slug — jeder Beitrag',
    raiseConcurrency: 'Tausende Seiten? Nebenläufigkeit erhöhen',
    wpMax: 'WP-Maximum für /wp/v2/posts',
    walkEvery: 'Läuft jede Seite von /posts ab, bis die Website vollständig abgezogen ist.',
    fullArchive: 'Vollständiges Archiv — durch die ganze WP-Website paginieren',
    ripping: 'ziehe Beiträge ab…', sinceStart: 'seit dem Start',
    ripEvery: 'Zieht jeden veröffentlichten Beitrag ab (Tausende sind kein Problem — 100 pro Anfrage)',
    slugsOnly: 'nur Slugs; _embed der Geschwindigkeit wegen überspringen',
    page: 'Seite', posts: 'Beiträge', ripped: 'abgezogen', inTime: 'in',
    mySite: 'Meine Website', latestFromBlog: 'Neues aus dem Blog',
    allPosts: 'Alle Beiträge', blog: 'Blog', backToBlog: '← Blog',
    notFound: 'Beitrag nicht gefunden',
  },
  ru: {
    wpHelpers: 'помощники REST WP (постраничная выкачка)',
    homeComment: 'главная — список последних записей',
    archiveComment: '/blog — полный архив',
    everyPost: '/blog/:slug — каждая запись',
    raiseConcurrency: 'тысячи страниц? поднимите параллелизм',
    wpMax: 'максимум WP для /wp/v2/posts',
    walkEvery: 'Проходит все страницы /posts, пока сайт не будет выкачан целиком.',
    fullArchive: 'Полный архив — постранично по всему сайту WP',
    ripping: 'выкачиваю записи…', sinceStart: 'с момента запуска',
    ripEvery: 'Выкачивает все опубликованные записи (тысячи — не проблема, по 100 за запрос)',
    slugsOnly: 'только slug; пропускаем _embed ради скорости',
    page: 'страница', posts: 'записей', ripped: 'выкачано', inTime: 'за',
    mySite: 'Мой сайт', latestFromBlog: 'Последнее в блоге',
    allPosts: 'Все записи', blog: 'Блог', backToBlog: '← Блог',
    notFound: 'Запись не найдена',
  },
  zh: {
    wpHelpers: 'WP REST 辅助函数（分页抓取）',
    homeComment: '首页 —— 列出最新文章',
    archiveComment: '/blog —— 完整归档',
    everyPost: '/blog/:slug —— 每一篇文章',
    raiseConcurrency: '成千上万个页面？调高并发',
    wpMax: '/wp/v2/posts 的 WP 上限',
    walkEvery: '逐页遍历 /posts，直到把整个站点抓完。',
    fullArchive: '完整归档 —— 分页遍历整个 WP 站点',
    ripping: '正在抓取文章…', sinceStart: '自启动以来',
    ripEvery: '抓取每一篇已发布的文章（几千篇也没问题 —— 每次请求 100 篇）',
    slugsOnly: '只要 slug；为了速度跳过 _embed',
    page: '第', posts: '篇文章', ripped: '已抓取', inTime: '耗时',
    mySite: '我的网站', latestFromBlog: '博客最新',
    allPosts: '全部文章', blog: '博客', backToBlog: '← 博客',
    notFound: '找不到文章',
  },
}

export function wordpressSnippets(lang = 'en') {
  const t = T[lang] ?? T.en
  const htmlLang = T[lang] ? lang : 'en'

  const staticParams = `export async function generateStaticParams() {
  const ripStarted = performance.now()
  console.log(
    \`[wordpress] ${t.ripping} (\${process.uptime().toFixed(1)}s ${t.sinceStart})\`,
  )

  // ${t.ripEvery}
  const posts = await getAllPosts({
    embed: false, // ${t.slugsOnly}
    onPage: (page, totalPages, count) => {
      console.log(\`[wordpress] ${t.page} \${page}/\${totalPages} (\${count} ${t.posts})\`)
    },
  })

  const ripSeconds = ((performance.now() - ripStarted) / 1000).toFixed(1)
  console.log(
    \`[wordpress] ${t.ripped} \${posts.length} ${t.posts} ${t.inTime} \${ripSeconds}s\` +
      \` (\${process.uptime().toFixed(1)}s ${t.sinceStart})\`,
  )

  return posts.map((post) => ({ slug: post.slug }))
}

export async function data({ params }) {
  const post = await getPostBySlug(params.slug)
  if (!post) throw new Error(\`${t.notFound}: \${params.slug}\`)
  return { post }
}`

  return {
    structure: `my-site/
  sitelo.config.js
  src/
    lib/
      wordpress.js       # ${t.wpHelpers}
    index.ht.js          # ${t.homeComment}
    blog/
      index.ht.js        # ${t.archiveComment}
      [slug].ht.js       # ${t.everyPost}
    css/
      styles.css`,

    config: `export default {
  site: 'https://example.com',
  // ${t.raiseConcurrency}
  renderConcurrency: 16,
  renderBatchSize: 128,
}`,

    wpLib: `import { fetchWithCache } from 'sitelo'

const WP_URL = process.env.WP_URL ?? 'https://your-wordpress-site.com'
const PER_PAGE = 100 // ${t.wpMax}

async function wpFetch(path, query = {}) {
  const url = new URL(\`/wp-json/wp/v2\${path}\`, WP_URL)
  for (const [key, value] of Object.entries(query)) {
    if (value != null) url.searchParams.set(key, String(value))
  }

  const res = await fetchWithCache(url, undefined, {
    maxAge: 3600,
    cache: 'auto',
  })

  if (!res.ok) {
    throw new Error(\`WordPress \${res.status}: \${url}\`)
  }

  return {
    data: await res.json(),
    totalPages: Number(res.headers.get('X-WP-TotalPages') ?? 1),
    total: Number(res.headers.get('X-WP-Total') ?? 0),
  }
}

export async function getPosts({ page = 1, perPage = 20, embed = true } = {}) {
  const { data } = await wpFetch('/posts', {
    page,
    per_page: perPage,
    _embed: embed ? '1' : undefined,
  })
  return data
}

/** ${t.walkEvery} */
export async function getAllPosts({
  perPage = PER_PAGE,
  embed = false,
  onPage,
} = {}) {
  const first = await wpFetch('/posts', {
    page: 1,
    per_page: perPage,
    _embed: embed ? '1' : undefined,
  })

  const posts = [...first.data]
  onPage?.(1, first.totalPages, posts.length)

  for (let page = 2; page <= first.totalPages; page += 1) {
    const next = await wpFetch('/posts', {
      page,
      per_page: perPage,
      _embed: embed ? '1' : undefined,
    })
    posts.push(...next.data)
    onPage?.(page, first.totalPages, posts.length)
  }

  return posts
}

export async function getPostBySlug(slug) {
  const { data } = await wpFetch('/posts', {
    slug,
    _embed: '1',
  })
  return data[0] ?? null
}

export function postPath(post) {
  return \`/blog/\${post.slug}\`
}

export function featuredImage(post) {
  return post._embedded?.['wp:featuredmedia']?.[0]?.source_url
}`,

    homeTemplate: `import { getPosts, postPath } from './lib/wordpress.js'

export async function data() {
  const posts = await getPosts({ perPage: 5 })
  return { posts }
}

export default ({ data }) => \`
  <html lang="${htmlLang}">
    <head>
      <title>${t.mySite}</title>
      <link rel="stylesheet" href="/css/styles.css">
    </head>
    <body>
      <h1>${t.latestFromBlog}</h1>
      <ul>
        \${data.posts
          .map(
            (post) => \`
          <li>
            <a href="\${postPath(post)}">\${post.title.rendered}</a>
          </li>\`,
          )
          .join('')}
      </ul>
      <p><a href="/blog">${t.allPosts}</a></p>
    </body>
  </html>
\``,

    homeHt: `import { html, head, title, link, body, h1, ul, li, a, p } from 'javascript-to-html'
import { getPosts, postPath } from './lib/wordpress.js'

export async function data() {
  const posts = await getPosts({ perPage: 5 })
  return { posts }
}

export default ({ data }) =>
  html({ lang: '${htmlLang}' },
    head(
      title('${t.mySite}'),
      link({ rel: 'stylesheet', href: '/styles.css' }),
    ),
    body(
      h1('${t.latestFromBlog}'),
      ul(
        ...data.posts.map((post) =>
          li(a({ href: postPath(post) }, post.title.rendered)),
        ),
      ),
      p(a({ href: '/blog' }, '${t.allPosts}')),
    ),
  )`,

    homeJsx: `import { getPosts, postPath } from './lib/wordpress.js'

export async function data() {
  const posts = await getPosts({ perPage: 5 })
  return { posts }
}

export default function Home({ data }) {
  return (
    <html lang="${htmlLang}">
      <head>
        <title>${t.mySite}</title>
        <link rel="stylesheet" href="/css/styles.css" />
      </head>
      <body>
        <h1>${t.latestFromBlog}</h1>
        <ul>
          {data.posts.map((post) => (
            <li key={post.slug}>
              <a href={postPath(post)}>{post.title.rendered}</a>
            </li>
          ))}
        </ul>
        <p><a href="/blog">${t.allPosts}</a></p>
      </body>
    </html>
  )
}`,

    blogIndexTemplate: `import { getAllPosts, postPath } from '../lib/wordpress.js'

export async function data() {
  // ${t.fullArchive}
  const posts = await getAllPosts({ embed: false })
  return { posts }
}

export default ({ data }) => \`
  <html lang="${htmlLang}">
    <head>
      <title>${t.blog}</title>
      <link rel="stylesheet" href="/css/styles.css">
    </head>
    <body>
      <h1>${t.blog} (\${data.posts.length})</h1>
      <ul>
        \${data.posts
          .map(
            (post) => \`
          <li>
            <a href="\${postPath(post)}">\${post.title.rendered}</a>
            <time>\${post.date.slice(0, 10)}</time>
          </li>\`,
          )
          .join('')}
      </ul>
    </body>
  </html>
\``,

    blogIndexHt: `import { html, head, title, link, body, h1, ul, li, a, time } from 'javascript-to-html'
import { getAllPosts, postPath } from '../lib/wordpress.js'

export async function data() {
  // ${t.fullArchive}
  const posts = await getAllPosts({ embed: false })
  return { posts }
}

export default ({ data }) =>
  html({ lang: '${htmlLang}' },
    head(
      title('${t.blog}'),
      link({ rel: 'stylesheet', href: '/styles.css' }),
    ),
    body(
      h1(\`${t.blog} (\${data.posts.length})\`),
      ul(
        ...data.posts.map((post) =>
          li(
            a({ href: postPath(post) }, post.title.rendered),
            time(post.date.slice(0, 10)),
          ),
        ),
      ),
    ),
  )`,

    blogIndexJsx: `import { getAllPosts, postPath } from '../lib/wordpress.js'

export async function data() {
  // ${t.fullArchive}
  const posts = await getAllPosts({ embed: false })
  return { posts }
}

export default function BlogIndex({ data }) {
  return (
    <html lang="${htmlLang}">
      <head>
        <title>${t.blog}</title>
        <link rel="stylesheet" href="/css/styles.css" />
      </head>
      <body>
        <h1>${t.blog} ({data.posts.length})</h1>
        <ul>
          {data.posts.map((post) => (
            <li key={post.slug}>
              <a href={postPath(post)}>{post.title.rendered}</a>
              <time>{post.date.slice(0, 10)}</time>
            </li>
          ))}
        </ul>
      </body>
    </html>
  )
}`,

    blogPostTemplate: `import {
  getAllPosts,
  getPostBySlug,
  featuredImage,
} from '../lib/wordpress.js'

${staticParams}

export default ({ data }) => {
  const { post } = data
  const image = featuredImage(post)

  return \`
    <html lang="${htmlLang}">
      <head>
        <title>\${post.title.rendered}</title>
        <link rel="stylesheet" href="/css/styles.css">
      </head>
      <body>
        <article>
          <p><a href="/blog">${t.backToBlog}</a></p>
          <h1>\${post.title.rendered}</h1>
          <time>\${post.date.slice(0, 10)}</time>
          \${image ? \`<img src="\${image}" alt="">\` : ''}
          <div class="content">
            \${post.content.rendered}
          </div>
        </article>
      </body>
    </html>
  \`
}`,

    blogPostHt: `import {
  html, head, title, link, body, article, p, a, h1, time, img, div,
} from 'javascript-to-html'
import {
  getAllPosts,
  getPostBySlug,
  featuredImage,
} from '../lib/wordpress.js'

${staticParams}

export default ({ data }) => {
  const { post } = data
  const image = featuredImage(post)

  return html({ lang: '${htmlLang}' },
    head(
      title(post.title.rendered),
      link({ rel: 'stylesheet', href: '/styles.css' }),
    ),
    body(
      article(
        p(a({ href: '/blog' }, '${t.backToBlog}')),
        h1(post.title.rendered),
        time(post.date.slice(0, 10)),
        image ? img({ src: image, alt: '' }) : '',
        div({ class: 'content' }, post.content.rendered),
      ),
    ),
  )
}`,

    blogPostJsx: `import {
  getAllPosts,
  getPostBySlug,
  featuredImage,
} from '../lib/wordpress.js'

${staticParams}

export default function BlogPost({ data }) {
  const { post } = data
  const image = featuredImage(post)

  return (
    <html lang="${htmlLang}">
      <head>
        <title>{post.title.rendered}</title>
        <link rel="stylesheet" href="/css/styles.css" />
      </head>
      <body>
        <article>
          <p><a href="/blog">${t.backToBlog}</a></p>
          <h1>{post.title.rendered}</h1>
          <time>{post.date.slice(0, 10)}</time>
          {image ? <img src={image} alt="" /> : null}
          <div
            className="content"
            dangerouslySetInnerHTML={{ __html: post.content.rendered }}
          />
        </article>
      </body>
    </html>
  )
}`,

    env: `WP_URL=https://your-wordpress-site.com`,

    build: `WP_URL=https://your-wordpress-site.com sitelo build`,
  }
}
