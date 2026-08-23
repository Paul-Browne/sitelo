import {
  getHandsetGroups,
  getHandsetGroup,
  variantPayload,
  pickDefaultVariant,
  formatPrice,
} from '../lib/elisa.js'
import { escapeHtml, siteChrome } from '../lib/layout.js'

export async function generateStaticParams() {
  const started = performance.now()
  console.log(
    `[elisa] grouping HANDSETs… (${process.uptime().toFixed(1)}s since start)`,
  )
  const groups = await getHandsetGroups()
  console.log(
    `[elisa] ${groups.length} HANDSET groups in ${((performance.now() - started) / 1000).toFixed(1)}s` +
      ` (${process.uptime().toFixed(1)}s since start)`,
  )
  return groups.map((group) => ({ slug: group.slug }))
}

export async function data({ params }) {
  const group = await getHandsetGroup(params.slug)
  if (!group) throw new Error(`Product not found: ${params.slug}`)
  const variants = group.variants.map(variantPayload)
  const selected = pickDefaultVariant(variants)
  return { group, variants, selected }
}

export default ({ data }) => {
  const { group, variants, selected } = data
  const payload = JSON.stringify(variants).replaceAll('</', '<\\/')

  return siteChrome({
    title: `${group.name} — Kauppa`,
    description: selected?.description || group.name,
    body: `
      <article class="product" data-product>
        <div class="gallery">
          <div class="hero">
            ${
              selected?.picture
                ? `<img id="product-image" src="${escapeHtml(selected.picture)}" alt="">`
                : ''
            }
          </div>
          <div class="thumbs" id="product-thumbs">
            ${(selected?.images ?? [])
              .map(
                (src, i) => `
              <button type="button" data-thumb="${escapeHtml(src)}" aria-label="Kuva ${i + 1}">
                <img src="${escapeHtml(src)}" alt="">
              </button>`,
              )
              .join('')}
          </div>
        </div>
        <div class="buy">
          <p class="crumbs"><a href="/">Kauppa</a> · Tuote</p>
          <h1>${escapeHtml(group.name)}</h1>
          <p class="price" id="product-price">${escapeHtml(formatPrice(selected?.price))}</p>
          <p class="status" id="product-status">${escapeHtml(selected?.availability || '')}</p>
          <p class="muted" id="product-color">${escapeHtml(selected?.color || '')}</p>
          <ul class="swatches">
            ${variants
              .map(
                (variant) => `
              <li>
                <button
                  type="button"
                  data-uid="${escapeHtml(variant.uid)}"
                  aria-label="${escapeHtml(variant.color || variant.uid)}"
                  aria-pressed="${variant.uid === selected?.uid ? 'true' : 'false'}"
                  style="background:${escapeHtml(variant.hex)}"
                ></button>
              </li>`,
              )
              .join('')}
          </ul>
          <p class="muted">Catalog demo — no checkout.</p>
        </div>
        <div class="desc">
          <p id="product-desc">${escapeHtml(selected?.longDescription || selected?.description || '')}</p>
        </div>
        <script type="application/json" id="product-data">${payload}</script>
      </article>
      <script>
        document.querySelector('[data-product]')?.addEventListener('click', (event) => {
          const btn = event.target.closest('[data-uid], [data-thumb]')
          if (!btn) return
          import('/js/product.js').then((m) => m.handleClick(btn))
        })
      </script>
    `,
  })
}
