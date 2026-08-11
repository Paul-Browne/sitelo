import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, pageCodeTabs } from '../lib/code.js'
import { examplesLayout } from '../lib/layout.js'

const structureSnippet = `my-blog/
  sitelo.config.js
  content/
    hello-world.md       # posts: frontmatter + markdown
    why-static.md
  src/
    lib/
      posts.js           # read content/, parse frontmatter, render markdown
    index.ht.js          # / — post list
    blog/
      [slug].ht.js       # /blog/:slug — one page per post
    styles.css`

const configSnippet = `export default {
  site: 'https://example.com',
  rss: {
    site: 'https://example.com',
    title: 'My Blog',
    description: 'Latest posts',
    routePrefix: '/blog', // every /blog/* page becomes a feed item
  },
}`

const postSnippet = `---
title: Hello, world
date: 2026-08-01
description: The obligatory first post.
---

This blog is a folder of markdown files rendered to static HTML.`

const libSnippet = `import { readdir, readFile } from 'node:fs/promises'
import { marked } from 'marked'

// Posts live outside src/ so they're never treated as pages or assets.
const CONTENT_DIR = new URL('../../content/', import.meta.url)

/** Tiny frontmatter parser — \`key: value\` lines between --- fences. */
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

/** All posts, newest first. Runs in Node at build/dev time only. */
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
}`

const slugTemplate = `import { getPost, getPosts } from '../lib/posts.js'

export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function data({ params }) {
  const post = await getPost(params.slug)
  if (!post) throw new Error(\`Post not found: \${params.slug}\`)
  return { post }
}

export default ({ data }) => {
  const { post } = data

  return \`
    <html lang="en">
      <head>
        <title>\${post.title} — My Blog</title>
        <meta name="description" content="\${post.description}">
        <link rel="stylesheet" href="/styles.css">
      </head>
      <body>
        <article>
          <p><a href="/">← All posts</a></p>
          <h1>\${post.title}</h1>
          <time datetime="\${post.date}">\${post.date}</time>
          \${post.html}
        </article>
      </body>
    </html>
  \`
}`

const slugHt = `import {
  html, head, title, meta, link, body, article, p, a, h1, time,
} from 'javascript-to-html'
import { getPost, getPosts } from '../lib/posts.js'

export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function data({ params }) {
  const post = await getPost(params.slug)
  if (!post) throw new Error(\`Post not found: \${params.slug}\`)
  return { post }
}

export default ({ data }) => {
  const { post } = data

  return html({ lang: 'en' },
    head(
      title(\`\${post.title} — My Blog\`),
      meta({ name: 'description', content: post.description }),
      link({ rel: 'stylesheet', href: '/styles.css' }),
    ),
    body(
      article(
        p(a({ href: '/' }, '← All posts')),
        h1(post.title),
        time({ datetime: post.date }, post.date),
        post.html,
      ),
    ),
  )
}`

const slugJsx = `import { getPost, getPosts } from '../lib/posts.js'

export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function data({ params }) {
  const post = await getPost(params.slug)
  if (!post) throw new Error(\`Post not found: \${params.slug}\`)
  return { post }
}

export default function Post({ data }) {
  const { post } = data

  return (
    <html lang="en">
      <head>
        <title>{post.title} — My Blog</title>
        <meta name="description" content={post.description} />
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        <article>
          <p><a href="/">← All posts</a></p>
          <h1>{post.title}</h1>
          <time datetime={post.date}>{post.date}</time>
          <div dangerouslySetInnerHTML={{ __html: post.html }} />
        </article>
      </body>
    </html>
  )
}`

const indexTemplate = `import { getPosts } from './lib/posts.js'

export async function data() {
  return { posts: await getPosts() }
}

export default ({ data }) => \`
  <html lang="en">
    <head>
      <title>My Blog</title>
      <link rel="stylesheet" href="/styles.css">
      <link rel="alternate" type="application/rss+xml" title="My Blog" href="/rss.xml">
    </head>
    <body>
      <h1>My Blog</h1>
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
      <p><a href="/rss.xml">RSS feed</a></p>
    </body>
  </html>
\``

const indexHt = `import {
  html, head, title, link, body, h1, ul, li, a, time, p,
} from 'javascript-to-html'
import { getPosts } from './lib/posts.js'

export async function data() {
  return { posts: await getPosts() }
}

export default ({ data }) =>
  html({ lang: 'en' },
    head(
      title('My Blog'),
      link({ rel: 'stylesheet', href: '/styles.css' }),
      link({
        rel: 'alternate',
        type: 'application/rss+xml',
        title: 'My Blog',
        href: '/rss.xml',
      }),
    ),
    body(
      h1('My Blog'),
      ul({ class: 'posts' },
        ...data.posts.map((post) =>
          li(
            a({ href: \`/blog/\${post.slug}\` }, post.title),
            time({ datetime: post.date }, post.date),
            p(post.description),
          ),
        ),
      ),
      p(a({ href: '/rss.xml' }, 'RSS feed')),
    ),
  )`

const indexJsx = `import { getPosts } from './lib/posts.js'

export async function data() {
  return { posts: await getPosts() }
}

export default function Home({ data }) {
  return (
    <html lang="en">
      <head>
        <title>My Blog</title>
        <link rel="stylesheet" href="/styles.css" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="My Blog"
          href="/rss.xml"
        />
      </head>
      <body>
        <h1>My Blog</h1>
        <ul className="posts">
          {data.posts.map((post) => (
            <li key={post.slug}>
              <a href={\`/blog/\${post.slug}\`}>{post.title}</a>
              <time dateTime={post.date}>{post.date}</time>
              <p>{post.description}</p>
            </li>
          ))}
        </ul>
        <p><a href="/rss.xml">RSS feed</a></p>
      </body>
    </html>
  )
}`

export default () =>
  examplesLayout({
    title: 'Markdown blog',
    description:
      'A folder of markdown files → a static blog with an RSS feed, built with sitelo and marked.',
    activeHref: '/examples/blog',
    children: [
      p(
        'The canonical static-site use case: markdown files in a folder, one static page per post, an RSS feed, and zero client-side JavaScript. Full source in ',
        a(
          {
            href: 'https://github.com/paul-browne/sitelo/tree/main/examples/blog',
            rel: 'noopener',
          },
          'examples/blog',
        ),
        '.',
      ),
      h2('What you get'),
      ul(
        { class: 'docs-list' },
        li('A home page listing posts, newest first'),
        li(
          code('/blog/[slug]'),
          ' — one static HTML page per markdown file via ',
          code('generateStaticParams'),
        ),
        li(code('rss.xml'), ' — generated by sitelo from the ', code('rss'), ' config'),
        li(code('sitemap.xml'), ' — enabled by setting ', code('site')),
        li('Zero JS shipped — markdown parsing happens at build time in Node'),
      ),
      h2('Project layout'),
      codeBlock('project', structureSnippet, 'bash'),
      codeBlock('sitelo.config.js', configSnippet, 'javascript'),
      h2('1. Write posts as markdown'),
      p(
        'Posts live in ',
        code('content/'),
        ' — outside ',
        code('src/'),
        ', so sitelo never treats them as pages or assets. Frontmatter is plain ',
        code('key: value'),
        ' lines:',
      ),
      codeBlock('content/hello-world.md', postSnippet, 'markdown'),
      h2('2. Read and render them in Node'),
      p(
        'A small server-only module reads the folder, parses frontmatter, and renders markdown with ',
        a({ href: 'https://marked.js.org', rel: 'noopener' }, 'marked'),
        '. Because nothing in the HTML references this module, it never ships to the browser.',
      ),
      codeBlock('src/lib/posts.js', libSnippet, 'javascript'),
      h2('3. List posts on the home page'),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: indexTemplate,
        ht: indexHt,
        jsx: indexJsx,
      }),
      h2('4. One static page per post'),
      p(
        code('generateStaticParams'),
        ' returns every slug at build time; ',
        code('data()'),
        ' loads the matching post for each page.',
      ),
      pageCodeTabs({
        file: 'src/blog/[slug].ht.js',
        template: slugTemplate,
        ht: slugHt,
        jsx: slugJsx,
      }),
      h2('5. RSS for free'),
      p(
        'With the ',
        code('rss'),
        ' config above, ',
        code('sitelo build'),
        ' emits ',
        code('dist/rss.xml'),
        ' with an item for every page under ',
        code('/blog'),
        ' — no extra code.',
      ),
      p(
        a({ href: '/docs/routing' }, 'Routing docs'),
        ' · ',
        a({ href: '/docs/data' }, 'Data loading docs'),
        ' · ',
        a({ href: '/docs/configuration' }, 'Configuration docs'),
      ),
    ],
  })
