/**
 * Code samples for the "Markdown blog" example.
 */
const T = {
  en: {
    postsComment: 'posts: frontmatter + markdown',
    libComment: 'read content/, parse frontmatter, render markdown',
    indexComment: '/ — post list',
    slugComment: '/blog/:slug — one page per post',
    feedItemComment: 'every /blog/* page becomes a feed item',
    outsideSrc: "Posts live outside src/ so they're never treated as pages or assets.",
    frontmatterDoc: 'Tiny frontmatter parser — `key: value` lines between --- fences.',
    allPostsDoc: 'All posts, newest first. Runs in Node at build/dev time only.',
    myBlog: 'My Blog', latestPosts: 'Latest posts',
    postTitle: 'Hello, world', postDesc: 'The obligatory first post.',
    postBody: 'This blog is a folder of markdown files rendered to static HTML.',
    allPosts: '← All posts', rssFeed: 'RSS feed', notFound: 'Post not found',
  },
  es: {
    postsComment: 'entradas: frontmatter + markdown',
    libComment: 'lee content/, analiza el frontmatter, renderiza markdown',
    indexComment: '/ — lista de entradas',
    slugComment: '/blog/:slug — una página por entrada',
    feedItemComment: 'cada página /blog/* se convierte en un elemento del feed',
    outsideSrc: 'Las entradas viven fuera de src/, así nunca se tratan como páginas ni recursos.',
    frontmatterDoc: 'Analizador mínimo de frontmatter — líneas `clave: valor` entre vallas ---.',
    allPostsDoc: 'Todas las entradas, de más nueva a más antigua. Solo se ejecuta en Node, en compilación o desarrollo.',
    myBlog: 'Mi blog', latestPosts: 'Últimas entradas',
    postTitle: 'Hola, mundo', postDesc: 'La obligada primera entrada.',
    postBody: 'Este blog es una carpeta de archivos markdown renderizados a HTML estático.',
    allPosts: '← Todas las entradas', rssFeed: 'Feed RSS', notFound: 'Entrada no encontrada',
  },
  fr: {
    postsComment: 'articles : frontmatter + markdown',
    libComment: 'lit content/, analyse le frontmatter, rend le markdown',
    indexComment: '/ — liste des articles',
    slugComment: '/blog/:slug — une page par article',
    feedItemComment: 'chaque page /blog/* devient une entrée du flux',
    outsideSrc: 'Les articles vivent hors de src/, ils ne sont donc jamais traités comme des pages ou des ressources.',
    frontmatterDoc: 'Petit analyseur de frontmatter — des lignes `clé: valeur` entre les barrières ---.',
    allPostsDoc: 'Tous les articles, du plus récent au plus ancien. S’exécute uniquement dans Node, au build ou en dev.',
    myBlog: 'Mon blog', latestPosts: 'Derniers articles',
    postTitle: 'Bonjour, monde', postDesc: 'L’inévitable premier article.',
    postBody: 'Ce blog est un dossier de fichiers markdown rendus en HTML statique.',
    allPosts: '← Tous les articles', rssFeed: 'Flux RSS', notFound: 'Article introuvable',
  },
  de: {
    postsComment: 'Beiträge: Frontmatter + Markdown',
    libComment: 'liest content/, parst Frontmatter, rendert Markdown',
    indexComment: '/ — Beitragsliste',
    slugComment: '/blog/:slug — eine Seite pro Beitrag',
    feedItemComment: 'jede /blog/*-Seite wird zu einem Feed-Eintrag',
    outsideSrc: 'Beiträge liegen außerhalb von src/, damit sie nie als Seiten oder Assets gelten.',
    frontmatterDoc: 'Winziger Frontmatter-Parser — `key: value`-Zeilen zwischen ---Zäunen.',
    allPostsDoc: 'Alle Beiträge, neueste zuerst. Läuft nur in Node, beim Build oder in der Entwicklung.',
    myBlog: 'Mein Blog', latestPosts: 'Neueste Beiträge',
    postTitle: 'Hallo, Welt', postDesc: 'Der obligatorische erste Beitrag.',
    postBody: 'Dieser Blog ist ein Ordner voller Markdown-Dateien, die zu statischem HTML gerendert werden.',
    allPosts: '← Alle Beiträge', rssFeed: 'RSS-Feed', notFound: 'Beitrag nicht gefunden',
  },
  ru: {
    postsComment: 'записи: frontmatter + markdown',
    libComment: 'читает content/, разбирает frontmatter, рендерит markdown',
    indexComment: '/ — список записей',
    slugComment: '/blog/:slug — по странице на запись',
    feedItemComment: 'каждая страница /blog/* становится элементом ленты',
    outsideSrc: 'Записи лежат вне src/, поэтому никогда не считаются страницами или ресурсами.',
    frontmatterDoc: 'Крошечный разбор frontmatter — строки `ключ: значение` между --- .',
    allPostsDoc: 'Все записи, новые первыми. Выполняется только в Node, при сборке или разработке.',
    myBlog: 'Мой блог', latestPosts: 'Последние записи',
    postTitle: 'Привет, мир', postDesc: 'Обязательная первая запись.',
    postBody: 'Этот блог — папка markdown-файлов, отрендеренных в статический HTML.',
    allPosts: '← Все записи', rssFeed: 'RSS-лента', notFound: 'Запись не найдена',
  },
  zh: {
    postsComment: '文章：frontmatter + markdown',
    libComment: '读取 content/，解析 frontmatter，渲染 markdown',
    indexComment: '/ —— 文章列表',
    slugComment: '/blog/:slug —— 每篇文章一个页面',
    feedItemComment: '每个 /blog/* 页面都会成为一条订阅条目',
    outsideSrc: '文章放在 src/ 之外，因此永远不会被当作页面或资源。',
    frontmatterDoc: '极简 frontmatter 解析器 —— --- 围栏之间的 `key: value` 行。',
    allPostsDoc: '所有文章，最新在前。仅在 Node 中于构建或开发时运行。',
    myBlog: '我的博客', latestPosts: '最新文章',
    postTitle: '你好，世界', postDesc: '照例的第一篇文章。',
    postBody: '这个博客就是一个装满 markdown 文件的文件夹，它们被渲染成静态 HTML。',
    allPosts: '← 全部文章', rssFeed: 'RSS 订阅', notFound: '找不到文章',
  },
  pt: {
    postsComment: 'artigos: frontmatter + markdown',
    libComment: 'lê content/, analisa o frontmatter, renderiza markdown',
    indexComment: '/ — lista de artigos',
    slugComment: '/blog/:slug — uma página por artigo',
    feedItemComment: 'cada página /blog/* torna-se um item do feed',
    outsideSrc: 'Os artigos vivem fora de src/, por isso nunca são tratados como páginas ou recursos.',
    frontmatterDoc: 'Analisador mínimo de frontmatter — linhas `chave: valor` entre cercas ---.',
    allPostsDoc: 'Todos os artigos, do mais recente ao mais antigo. Corre apenas no Node, na compilação ou em desenvolvimento.',
    myBlog: 'O meu blogue',
    latestPosts: 'Últimos artigos',
    postTitle: 'Olá, mundo',
    postDesc: 'O obrigatório primeiro artigo.',
    postBody: 'Este blogue é uma pasta de ficheiros markdown renderizados para HTML estático.',
    allPosts: '← Todos os artigos',
    rssFeed: 'Feed RSS',
    notFound: 'Artigo não encontrado',
  },
}

export function blogSnippets(lang = 'en') {
  const t = T[lang] ?? T.en
  const htmlLang = T[lang] ? lang : 'en'

  return {
    structure: `my-blog/
  sitelo.config.js
  content/
    hello-world.md       # ${t.postsComment}
    why-static.md
  src/
    lib/
      posts.js           # ${t.libComment}
    index.ht.js          # ${t.indexComment}
    blog/
      [slug].ht.js       # ${t.slugComment}
    css/
      styles.css`,

    config: `export default {
  site: 'https://example.com',
  rss: {
    site: 'https://example.com',
    title: '${t.myBlog}',
    description: '${t.latestPosts}',
    routePrefix: '/blog', // ${t.feedItemComment}
  },
}`,

    post: `---
title: ${t.postTitle}
date: 2026-08-01
description: ${t.postDesc}
---

${t.postBody}`,

    lib: `import { readdir, readFile } from 'node:fs/promises'
import { marked } from 'marked'

// ${t.outsideSrc}
const CONTENT_DIR = new URL('../../content/', import.meta.url)

/** ${t.frontmatterDoc} */
function parseFrontmatter(raw) {
  const match = /^---\\r?\\n([\\s\\S]*?)\\r?\\n---\\r?\\n?/.exec(raw)
  if (!match) return { meta: {}, body: raw }

  const meta = {}
  for (const line of match[1].split('\\n')) {
    const colon = line.indexOf(':')
    if (colon === -1) continue
    meta[line.slice(0, colon).trim()] = line.slice(colon + 1).trim()
  }

  return { meta, body: raw.slice(match[0].length) }
}

/** ${t.allPostsDoc} */
export async function getPosts() {
  const files = (await readdir(CONTENT_DIR)).filter((file) =>
    file.endsWith('.md'),
  )

  const posts = await Promise.all(
    files.map(async (file) => {
      const raw = await readFile(new URL(file, CONTENT_DIR), 'utf8')
      const { meta, body } = parseFrontmatter(raw)

      return {
        slug: file.replace(/\\.md$/, ''),
        title: meta.title ?? file,
        date: meta.date ?? '1970-01-01',
        description: meta.description ?? '',
        html: marked.parse(body),
      }
    }),
  )

  return posts.sort((a, b) => b.date.localeCompare(a.date))
}

export async function getPost(slug) {
  const posts = await getPosts()
  return posts.find((post) => post.slug === slug) ?? null
}`,

    slugTemplate: `import { getPost, getPosts } from '../lib/posts.js'

export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function data({ params }) {
  const post = await getPost(params.slug)
  if (!post) throw new Error(\`${t.notFound}: \${params.slug}\`)
  return { post }
}

export default ({ data }) => {
  const { post } = data

  return \`
    <html lang="${htmlLang}">
      <head>
        <title>\${post.title} — ${t.myBlog}</title>
        <meta name="description" content="\${post.description}">
        <link rel="stylesheet" href="/css/styles.css">
      </head>
      <body>
        <article>
          <p><a href="/">${t.allPosts}</a></p>
          <h1>\${post.title}</h1>
          <time datetime="\${post.date}">\${post.date}</time>
          \${post.html}
        </article>
      </body>
    </html>
  \`
}`,

    slugHt: `import {
  html, head, title, meta, link, body, article, p, a, h1, time,
} from 'javascript-to-html'
import { getPost, getPosts } from '../lib/posts.js'

export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function data({ params }) {
  const post = await getPost(params.slug)
  if (!post) throw new Error(\`${t.notFound}: \${params.slug}\`)
  return { post }
}

export default ({ data }) => {
  const { post } = data

  return html({ lang: '${htmlLang}' },
    head(
      title(\`\${post.title} — ${t.myBlog}\`),
      meta({ name: 'description', content: post.description }),
      link({ rel: 'stylesheet', href: '/styles.css' }),
    ),
    body(
      article(
        p(a({ href: '/' }, '${t.allPosts}')),
        h1(post.title),
        time({ datetime: post.date }, post.date),
        post.html,
      ),
    ),
  )
}`,

    slugJsx: `import { getPost, getPosts } from '../lib/posts.js'

export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function data({ params }) {
  const post = await getPost(params.slug)
  if (!post) throw new Error(\`${t.notFound}: \${params.slug}\`)
  return { post }
}

export default function Post({ data }) {
  const { post } = data

  return (
    <html lang="${htmlLang}">
      <head>
        <title>{post.title} — ${t.myBlog}</title>
        <meta name="description" content={post.description} />
        <link rel="stylesheet" href="/css/styles.css" />
      </head>
      <body>
        <article>
          <p><a href="/">${t.allPosts}</a></p>
          <h1>{post.title}</h1>
          <time datetime={post.date}>{post.date}</time>
          <div dangerouslySetInnerHTML={{ __html: post.html }} />
        </article>
      </body>
    </html>
  )
}`,

    indexTemplate: `import { getPosts } from './lib/posts.js'

export async function data() {
  return { posts: await getPosts() }
}

export default ({ data }) => \`
  <html lang="${htmlLang}">
    <head>
      <title>${t.myBlog}</title>
      <link rel="stylesheet" href="/css/styles.css">
      <link rel="alternate" type="application/rss+xml" title="${t.myBlog}" href="/rss.xml">
    </head>
    <body>
      <h1>${t.myBlog}</h1>
      <ul class="posts">
        \${data.posts
          .map(
            (post) => \`
          <li>
            <a href="/blog/\${post.slug}">\${post.title}</a>
            <time datetime="\${post.date}">\${post.date}</time>
            <p>\${post.description}</p>
          </li>\`,
          )
          .join('')}
      </ul>
      <p><a href="/rss.xml">${t.rssFeed}</a></p>
    </body>
  </html>
\``,

    indexHt: `import {
  html, head, title, link, body, h1, ul, li, a, time, p,
} from 'javascript-to-html'
import { getPosts } from './lib/posts.js'

export async function data() {
  return { posts: await getPosts() }
}

export default ({ data }) =>
  html({ lang: '${htmlLang}' },
    head(
      title('${t.myBlog}'),
      link({ rel: 'stylesheet', href: '/styles.css' }),
      link({
        rel: 'alternate',
        type: 'application/rss+xml',
        title: '${t.myBlog}',
        href: '/rss.xml',
      }),
    ),
    body(
      h1('${t.myBlog}'),
      ul({ class: 'posts' },
        ...data.posts.map((post) =>
          li(
            a({ href: \`/blog/\${post.slug}\` }, post.title),
            time({ datetime: post.date }, post.date),
            p(post.description),
          ),
        ),
      ),
      p(a({ href: '/rss.xml' }, '${t.rssFeed}')),
    ),
  )`,

    indexJsx: `import { getPosts } from './lib/posts.js'

export async function data() {
  return { posts: await getPosts() }
}

export default function Home({ data }) {
  return (
    <html lang="${htmlLang}">
      <head>
        <title>${t.myBlog}</title>
        <link rel="stylesheet" href="/css/styles.css" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="${t.myBlog}"
          href="/rss.xml"
        />
      </head>
      <body>
        <h1>${t.myBlog}</h1>
        <ul className="posts">
          {data.posts.map((post) => (
            <li key={post.slug}>
              <a href={\`/blog/\${post.slug}\`}>{post.title}</a>
              <time dateTime={post.date}>{post.date}</time>
              <p>{post.description}</p>
            </li>
          ))}
        </ul>
        <p><a href="/rss.xml">${t.rssFeed}</a></p>
      </body>
    </html>
  )
}`,
  }
}
