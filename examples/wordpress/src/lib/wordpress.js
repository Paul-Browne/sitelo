import { fetchWithCache } from 'sitelo'

/** Real public WordPress site used by this example (~2k posts). */
const WP_URL = process.env.WP_URL ?? 'https://speckyboy.com'
/** Optional cap for quicker local builds, e.g. WP_LIMIT=50 */
const WP_LIMIT = process.env.WP_LIMIT ? Number(process.env.WP_LIMIT) : null
const PER_PAGE = 100 // WP max for /wp/v2/posts

const WP_HEADERS = {
  Accept: 'application/json',
  // Cloudflare (and similar) often block bare clients — identify ourselves.
  'User-Agent':
    'sitelo-wordpress-example/1.0 (+https://sitelo.js.org; demo of Speckyboy)',
}

async function wpFetch(path, query = {}) {
  const url = new URL(`/wp-json/wp/v2${path}`, WP_URL)
  for (const [key, value] of Object.entries(query)) {
    if (value != null) url.searchParams.set(key, String(value))
  }

  const res = await fetchWithCache(
    url,
    { headers: WP_HEADERS },
    {
      maxAge: 3600,
      cache: 'auto',
    },
  )

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

/** Walk every page of /posts until the site is fully ripped (or WP_LIMIT). */
export async function getAllPosts({
  perPage = PER_PAGE,
  embed = false,
  onPage,
} = {}) {
  // When WP_LIMIT is set, don't over-fetch the first page.
  const pageSize =
    WP_LIMIT != null ? Math.min(perPage, WP_LIMIT) : perPage

  const first = await wpFetch('/posts', {
    page: 1,
    per_page: pageSize,
    _embed: embed ? '1' : undefined,
  })

  let posts = [...first.data]
  onPage?.(1, first.totalPages, posts.length)

  if (WP_LIMIT != null && posts.length >= WP_LIMIT) {
    return posts.slice(0, WP_LIMIT)
  }

  for (let page = 2; page <= first.totalPages; page += 1) {
    const next = await wpFetch('/posts', {
      page,
      per_page: pageSize,
      _embed: embed ? '1' : undefined,
    })
    posts.push(...next.data)
    onPage?.(page, first.totalPages, posts.length)

    if (WP_LIMIT != null && posts.length >= WP_LIMIT) {
      return posts.slice(0, WP_LIMIT)
    }
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

export function sourceSite() {
  return WP_URL.replace(/\/$/, '')
}
