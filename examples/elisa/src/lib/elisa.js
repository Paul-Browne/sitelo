import { fetchWithCache } from 'sitelo'
import categoryMap from '../../categories.js'

const ELISA_URL = process.env.ELISA_URL ?? 'https://elisa.fi/kauppa'
/** Optional cap on HANDSET groups, e.g. ELISA_LIMIT=20 */
const ELISA_LIMIT = process.env.ELISA_LIMIT
  ? Number(process.env.ELISA_LIMIT)
  : null
const ELISA_CONCURRENCY = Number(process.env.ELISA_CONCURRENCY ?? 16)

const ELISA_HEADERS = {
  Accept: 'application/json',
  'User-Agent':
    'sitelo-elisa-example/1.0 (+https://sitelo.js.org; demo of elisa.fi/kauppa)',
}

/** @type {unknown[] | null} */
let devicesCache = null
/** @type {Map<string, HandsetGroup> | null} */
let groupsBySlug = null

/**
 * @typedef {{
 *   slug: string,
 *   name: string,
 *   uids: string[],
 *   variants: object[],
 *   hydrated: boolean,
 * }} HandsetGroup
 */

async function elisaFetch(path, query = {}) {
  const base = ELISA_URL.endsWith('/') ? ELISA_URL : `${ELISA_URL}/`
  const url = new URL(path.replace(/^\//, ''), base)
  for (const [key, value] of Object.entries(query)) {
    if (value != null) url.searchParams.set(key, String(value))
  }

  const res = await fetchWithCache(
    url,
    { headers: ELISA_HEADERS },
    {
      maxAge: 3600,
      cache: 'auto',
    },
  )

  if (!res.ok) {
    throw new Error(`Elisa ${res.status}: ${url}`)
  }

  return res.json()
}

/** Run `fn` over `items` with at most `concurrency` in flight. */
async function mapPool(items, concurrency, fn) {
  const results = new Array(items.length)
  let next = 0

  async function worker() {
    while (next < items.length) {
      const i = next
      next += 1
      results[i] = await fn(items[i], i)
    }
  }

  const workers = Array.from(
    { length: Math.min(concurrency, items.length) },
    () => worker(),
  )
  await Promise.all(workers)
  return results
}

function asList(payload) {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.products)) return payload.products
  if (Array.isArray(payload?.devices)) return payload.devices
  return []
}

export function slugify(value) {
  return String(value ?? '')
    .toLowerCase()
    .replace(/ä/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/å/g, 'a')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function categoryKeyToPath(key) {
  return key.replaceAll('-', '_').split('/')
}

export function pathToCategoryKey(path) {
  const segments = Array.isArray(path) ? path : [path]
  return segments.filter(Boolean).join('/').replaceAll('_', '-')
}

export function categoryHref(key) {
  return `/laitteet/${categoryKeyToPath(key).join('/')}`
}

export function productHref(slug) {
  return `/tuote/${slug}`
}

export function labelFromSegment(segment) {
  return String(segment ?? '')
    .replaceAll('_', ' ')
    .replaceAll('-', ' ')
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toLocaleUpperCase('fi-FI') + word.slice(1))
    .join(' ')
}

export function absUrl(src) {
  if (!src) return ''
  if (src.startsWith('//')) return `https:${src}`
  return src
}

export function formatPrice(value) {
  const n = Number(value)
  if (!Number.isFinite(n)) return ''
  return `${n.toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`
}

export function devicePrice(device) {
  const lowest = device?.lowestPrice
  if (typeof lowest === 'number') return lowest
  if (lowest && typeof lowest.price === 'number') return lowest.price
  const cash = device?.paymentOptions?.find(
    (opt) => !opt.monthlyBilling && typeof opt.lowestPrice === 'number',
  )
  return cash?.lowestPrice ?? cash?.openingPrice ?? null
}

export function deviceColor(device) {
  const fromMeta = device?.metaInformation?.find(
    (item) => item.groupingValue === 'color',
  )
  return (
    device?.akeneoColors?.color_webstore_label ||
    fromMeta?.content ||
    device?.productCategories?.find((c) => c.label === 'variant')?.value ||
    ''
  )
}

export function deviceColorHex(device) {
  return (
    device?.akeneoColors?.color_webstore_hexcolorcode1 ||
    device?.akeneoColors?.color_webstore_main_hexcolorcode ||
    '#ccc'
  )
}

export function isHandset(device) {
  return String(device?.uid ?? '').startsWith('HANDSET-')
}

export function groupSlug(device) {
  return device.urlKey || slugify(device.mainProductName || device.name)
}

export async function getDevices() {
  if (devicesCache) return devicesCache
  const payload = await elisaFetch('/rest/products/devices')
  devicesCache = asList(payload)
  return devicesCache
}

function buildGroups(devices) {
  /** @type {Map<string, HandsetGroup>} */
  const map = new Map()
  for (const device of devices) {
    if (!isHandset(device)) continue
    const slug = groupSlug(device)
    if (!slug) continue
    let group = map.get(slug)
    if (!group) {
      group = {
        slug,
        name: device.mainProductName || device.name || slug,
        uids: [],
        variants: [],
        hydrated: false,
      }
      map.set(slug, group)
    }
    group.uids.push(device.uid)
    group.variants.push(device)
  }
  return map
}

export async function getHandsetGroups() {
  if (groupsBySlug) {
    const all = [...groupsBySlug.values()]
    return ELISA_LIMIT != null ? all.slice(0, ELISA_LIMIT) : all
  }
  const devices = await getDevices()
  groupsBySlug = buildGroups(devices)
  const all = [...groupsBySlug.values()]
  return ELISA_LIMIT != null ? all.slice(0, ELISA_LIMIT) : all
}

export async function getHandsetGroup(slug) {
  await getHandsetGroups()
  return groupsBySlug?.get(slug) ?? null
}

export async function getDeviceByUid(uid) {
  const payload = await elisaFetch('/rest/products', { uid })
  const list = asList(payload)
  return list[0] ?? (payload && payload.uid ? payload : null)
}

export async function hydrateGroup(group) {
  if (!group || group.hydrated) return group
  const details = await mapPool(
    group.uids,
    ELISA_CONCURRENCY,
    async (uid) => (await getDeviceByUid(uid)) ?? group.variants.find((v) => v.uid === uid),
  )
  group.variants = details.filter(Boolean)
  group.hydrated = true
  group.name =
    group.variants[0]?.mainProductName ||
    group.variants[0]?.name ||
    group.name
  return group
}

export async function getHydratedGroup(slug) {
  const group = await getHandsetGroup(slug)
  if (!group) return null
  return hydrateGroup(group)
}

export async function getDevicesForCategory(ids) {
  const idSet = new Set(ids)
  const devices = await getDevices()
  return devices.filter((device) =>
    Array.isArray(device.categories)
      ? device.categories.some((id) => idSet.has(id))
      : false,
  )
}

export function getCategoryKeys() {
  return Object.keys(categoryMap)
}

export function getCategoryIds(key) {
  return categoryMap[key] ?? []
}

export function getDepartments() {
  return getCategoryKeys().filter((key) => !key.includes('/'))
}

export function getChildCategories(key) {
  const prefix = `${key}/`
  return getCategoryKeys().filter((candidate) => {
    if (!candidate.startsWith(prefix)) return false
    return candidate.slice(prefix.length).split('/').length === 1
  })
}

export function getParentKey(key) {
  const i = key.lastIndexOf('/')
  return i === -1 ? null : key.slice(0, i)
}

export function variantPayload(device) {
  const images = Array.isArray(device.images)
    ? device.images.map((img) => absUrl(img.large || img.small)).filter(Boolean)
    : []
  const picture = absUrl(device.picture || device.defaultImage || images[0])
  return {
    uid: device.uid,
    name: device.name,
    color: deviceColor(device),
    hex: deviceColorHex(device),
    picture,
    images: images.length ? images : picture ? [picture] : [],
    price: devicePrice(device),
    availability: device.availabilityStatus || '',
    sellable: device.availabilityStatus === 'SELLABLE',
    description:
      device.descriptions?.SHORT ||
      device.attributes?.device_type_short_description?.data ||
      '',
    longDescription:
      device.descriptions?.MEDIUM ||
      device.attributes?.device_type_medium_description?.data ||
      '',
  }
}

export function pickDefaultVariant(variants) {
  return variants.find((v) => v.sellable) ?? variants[0] ?? null
}

export { categoryMap }
