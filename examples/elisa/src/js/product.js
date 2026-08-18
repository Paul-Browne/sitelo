function variants() {
  const el = document.querySelector('#product-data')
  if (!el) return []
  try {
    return JSON.parse(el.textContent)
  } catch {
    return []
  }
}

function formatPrice(value) {
  const n = Number(value)
  if (!Number.isFinite(n)) return ''
  return `${n.toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`
}

function paint(variant) {
  if (!variant) return
  const image = document.querySelector('#product-image')
  const price = document.querySelector('#product-price')
  const status = document.querySelector('#product-status')
  const color = document.querySelector('#product-color')
  const desc = document.querySelector('#product-desc')
  const thumbs = document.querySelector('#product-thumbs')

  if (image && variant.picture) image.src = variant.picture
  if (price) price.textContent = formatPrice(variant.price)
  if (status) status.textContent = variant.availability || ''
  if (color) color.textContent = variant.color || ''
  if (desc) desc.textContent = variant.longDescription || variant.description || ''

  if (thumbs) {
    thumbs.innerHTML = (variant.images || [])
      .map(
        (src, i) =>
          `<button type="button" data-thumb="${src}" aria-label="Kuva ${i + 1}"><img src="${src}" alt=""></button>`,
      )
      .join('')
  }

  for (const btn of document.querySelectorAll('[data-uid]')) {
    btn.setAttribute('aria-pressed', btn.dataset.uid === variant.uid ? 'true' : 'false')
  }
}

/** @param {HTMLElement} target */
export function handleClick(target) {
  if (target.dataset.thumb) {
    const image = document.querySelector('#product-image')
    if (image) image.src = target.dataset.thumb
    return
  }

  const uid = target.dataset.uid
  if (!uid) return
  const variant = variants().find((item) => item.uid === uid)
  paint(variant)
}
