import {
  getCategoryKeys,
  getCategoryIds,
  getDevicesForCategory,
  getChildCategories,
  getParentKey,
  categoryKeyToPath,
  pathToCategoryKey,
  categoryHref,
  productHref,
  labelFromSegment,
  isHandset,
  groupSlug,
  absUrl,
  devicePrice,
  formatPrice,
} from '../lib/elisa.js'
import { escapeHtml, siteChrome } from '../lib/layout.js'

export function generateStaticParams() {
  return getCategoryKeys().map((key) => ({
    path: categoryKeyToPath(key),
  }))
}

export async function data({ params }) {
  const key = pathToCategoryKey(params.path)
  const ids = getCategoryIds(key)
  if (!ids.length) throw new Error(`Unknown category: ${key}`)

  const [devices, children] = await Promise.all([
    getDevicesForCategory(ids),
    Promise.resolve(getChildCategories(key)),
  ])

  const crumbs = []
  let cursor = key
  while (cursor) {
    crumbs.unshift({
      href: categoryHref(cursor),
      label: labelFromSegment(cursor.split('/').at(-1)),
    })
    cursor = getParentKey(cursor)
  }

  return {
    key,
    title: labelFromSegment(key.split('/').at(-1)),
    crumbs,
    children,
    devices,
  }
}

export default ({ data }) =>
  siteChrome({
    title: `${data.title} — Kauppa`,
    body: `
      <main>
        <nav class="crumbs">
          <a href="/">Kauppa</a>
          ${data.crumbs
            .map(
              (c) =>
                ` · <a href="${c.href}">${escapeHtml(c.label)}</a>`,
            )
            .join('')}
        </nav>
        <h1>${escapeHtml(data.title)}</h1>
        <p class="muted">${data.devices.length} tuotetta</p>
        ${
          data.children.length
            ? `<ul class="child-nav">${data.children
                .map(
                  (child) => `
              <li>
                <a href="${categoryHref(child)}">${escapeHtml(
                  labelFromSegment(child.split('/').at(-1)),
                )}</a>
              </li>`,
                )
                .join('')}</ul>`
            : ''
        }
        <ul class="product-grid">
          ${data.devices
            .map((device) => {
              const img = absUrl(device.picture || device.defaultImage)
              const name = device.mainProductName || device.name || device.uid
              const price = formatPrice(devicePrice(device))
              const href = isHandset(device)
                ? productHref(groupSlug(device))
                : ''
              const inner = `
                ${img ? `<img src="${escapeHtml(img)}" alt="">` : ''}
                <span class="name">${escapeHtml(name)}</span>
                ${price ? `<p class="price">${escapeHtml(price)}</p>` : ''}
              `
              return `<li>${
                href
                  ? `<a class="card" href="${href}">${inner}</a>`
                  : `<div class="card">${inner}</div>`
              }</li>`
            })
            .join('')}
        </ul>
      </main>
    `,
  })
