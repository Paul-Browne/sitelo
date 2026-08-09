import { fetchWithCache } from 'sitelo'

const WP_URL = process.env.WP_URL ?? 'https://your-wordpress-site.com'
const PER_PAGE = 100 // WP max for /wp/v2/posts

async function wpFetch(path, query = {}) {
  const url = new URL(`/wp-json/wp/v2${path}`, WP_URL)
  for (const [key, value] of Object.entries(query)) {
    if (value != null) url.searchParams.set(key, String(value))
  }

  const res = await fetchWithCache(url, undefined, {
    maxAge: 3600,
    cache: 'auto',
  })

  if (!res.ok) {
    throw new Error(`WordPress ${res.status}: ${url}`)
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
  return `/blog/${post.slug}`
}

export function featuredImage(post) {
  return post._embedded?.['wp:featuredmedia']?.[0]?.source_url
}
