import { a, h2, h3, li, p, ul } from 'javascript-to-html'
import { code, codeBlock } from '../lib/code.js'
import { examplesLayout } from '../lib/layout.js'

const structureSnippet = `my-site/
  sitelo.config.js
  src/
    lib/
      wordpress.js       # WP REST helpers (paginated rip)
    index.ht.js          # home — list latest posts
    blog/
      index.ht.js        # /blog — full archive
      [slug].ht.js       # /blog/:slug — every post
    styles.css`

const configSnippet = `// sitelo.config.js
export default {
  site: 'https://example.com',
  // thousands of pages? raise concurrency
  renderConcurrency: 16,
  renderBatchSize: 128,
}`

const wpLibSnippet = `// src/lib/wordpress.js
import { fetchWithCache } from 'sitelo'

const WP_URL = process.env.WP_URL ?? 'https://your-wordpress-site.com'
const PER_PAGE = 100 // WP max for /wp/v2/posts

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

/** Walk every page of /posts until the site is fully ripped. */
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
}`

const homeSnippet = `// src/index.ht.js
import { getPosts, postPath } from './lib/wordpress.js'

export async function data() {
  const posts = await getPosts({ perPage: 5 })
  return { posts }
}

export default ({ data }) => \`
  <html lang="en">
    <head>
      <title>My site</title>
      <link rel="stylesheet" href="/styles.css">
    </head>
    <body>
      <h1>Latest from the blog</h1>
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
      <p><a href="/blog">All posts</a></p>
    </body>
  </html>
\``

const blogIndexSnippet = `// src/blog/index.ht.js
import { getAllPosts, postPath } from '../lib/wordpress.js'

export async function data() {
  // Full archive — paginate through the whole WP site
  const posts = await getAllPosts({ embed: false })
  return { posts }
}

export default ({ data }) => \`
  <html lang="en">
    <head>
      <title>Blog</title>
      <link rel="stylesheet" href="/styles.css">
    </head>
    <body>
      <h1>Blog (\${data.posts.length})</h1>
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
\``

const blogPostSnippet = `// src/blog/[slug].ht.js
import {
  getAllPosts,
  getPostBySlug,
  featuredImage,
} from '../lib/wordpress.js'

export async function generateStaticParams() {
  // Rip every published post (thousands are fine — 100 per request)
  const posts = await getAllPosts({
    embed: false, // slugs only; skip _embed for speed
    onPage: (page, totalPages, count) => {
      console.log(\`[wordpress] page \${page}/\${totalPages} (\${count} posts)\`)
    },
  })

  return posts.map((post) => ({ slug: post.slug }))
}

export async function data({ params }) {
  const post = await getPostBySlug(params.slug)
  if (!post) throw new Error(\`Post not found: \${params.slug}\`)
  return { post }
}

export default ({ data }) => {
  const { post } = data
  const image = featuredImage(post)

  return \`
    <html lang="en">
      <head>
        <title>\${post.title.rendered}</title>
        <link rel="stylesheet" href="/styles.css">
      </head>
      <body>
        <article>
          <p><a href="/blog">← Blog</a></p>
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
}`

const envSnippet = `# .env (optional)
WP_URL=https://your-wordpress-site.com`

export default () =>
  examplesLayout({
    title: 'WordPress',
    description:
      'Rip an entire WordPress site via the REST API — thousands of posts, statically generated with sitelo.',
    activeHref: '/examples/wordpress',
    children: [
      p(
        'Treat WordPress as a headless CMS and ',
        'rip the whole site',
        ': paginate through ',
        code('/wp-json/wp/v2/posts'),
        ', generate one HTML file per slug, and cache API responses between builds.',
      ),
      h2('What you get'),
      ul(
        { class: 'docs-list' },
        li('A home page listing recent posts'),
        li(code('/blog'), ' — full archive of every post'),
        li(
          code('/blog/[slug]'),
          ' — one static HTML page per post (works at thousands of posts)',
        ),
        li(
          code('fetchWithCache'),
          ' so rebuilds reuse WP responses instead of re-downloading everything',
        ),
      ),
      h2('Project layout'),
      codeBlock('project', structureSnippet, 'bash'),
      codeBlock('sitelo.config.js', configSnippet, 'javascript'),
      h2('1. Point at your WordPress site'),
      p(
        'The REST API is on by default in modern WordPress. Confirm it at ',
        code('https://your-site.com/wp-json/wp/v2/posts'),
        '.',
      ),
      p(
        'Set ',
        code('WP_URL'),
        ' in the environment (or hardcode it while experimenting):',
      ),
      codeBlock('.env', envSnippet, 'bash'),
      h2('2. Shared WordPress helpers'),
      p(
        code('getAllPosts()'),
        ' reads ',
        code('X-WP-TotalPages'),
        ' and walks every page (WordPress caps ',
        code('per_page'),
        ' at 100). Skip ',
        code('_embed'),
        ' while collecting slugs — only fetch embeds for individual posts.',
      ),
      codeBlock('src/lib/wordpress.js', wpLibSnippet, 'javascript'),
      h2('3. Home page'),
      codeBlock('src/index.ht.js', homeSnippet, 'javascript'),
      h2('4. Blog index'),
      p('Use ', code('getAllPosts()'), ' so the archive isn’t capped at 50–100 items.'),
      codeBlock('src/blog/index.ht.js', blogIndexSnippet, 'javascript'),
      h2('5. Rip every post into static pages'),
      p(
        code('generateStaticParams'),
        ' must return ',
        'every',
        ' slug you want in ',
        code('dist/'),
        '. Paginate the API here — don’t call ',
        code('getPosts({ perPage: 100 })'),
        ' once and stop.',
      ),
      codeBlock('src/blog/[slug].ht.js', blogPostSnippet, 'javascript'),
      h2('6. Build'),
      codeBlock(
        'shell',
        `WP_URL=https://your-wordpress-site.com sitelo build`,
        'bash',
      ),
      p(
        'First build pages through WordPress once and fills the fetch cache. Later builds reuse cached list/detail responses (',
        code("cache: 'auto'"),
        ' → filesystem in production) until ',
        code('maxAge'),
        ' expires. Raise ',
        code('renderConcurrency'),
        ' in ',
        code('sitelo.config.js'),
        ' if you’re rendering thousands of post pages.',
      ),
      h2('Notes'),
      h3('HTML from WordPress'),
      p(
        code('title.rendered'),
        ' and ',
        code('content.rendered'),
        ' are HTML strings from WP. Drop them into your template as-is (as above), or sanitize them if you don’t fully trust the CMS.',
      ),
      h3('Private content'),
      p(
        'Public REST routes only expose published posts. For drafts or custom auth, pass headers into ',
        code('fetchWithCache'),
        '’s second argument (standard ',
        code('fetch'),
        ' init) and use a stable ',
        code('cacheKey'),
        '.',
      ),
      p(
        a({ href: '/docs/data' }, 'Data loading docs'),
        ' · ',
        a({ href: '/docs/routing' }, 'Routing docs'),
      ),
    ],
  })
