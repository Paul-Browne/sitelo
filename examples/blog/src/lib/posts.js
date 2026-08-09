import { readdir, readFile } from 'node:fs/promises'
import { marked } from 'marked'

// Posts live outside src/ so they're never treated as pages or assets.
const CONTENT_DIR = new URL('../../content/', import.meta.url)

/** Tiny frontmatter parser — `key: value` lines between --- fences. */
function parseFrontmatter(raw) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw)
  if (!match) return { meta: {}, body: raw }

  const meta = {}
  for (const line of match[1].split('\n')) {
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
        slug: file.replace(/\.md$/, ''),
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
}
