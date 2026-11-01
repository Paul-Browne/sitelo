import { escapeHtml } from 'sitelo/page'

export default function time({ props, request }) {
  const label = typeof props?.label === 'string' ? props.label : 'Server time'
  const now = new Date().toISOString()
  const ua = request?.headers?.get?.('user-agent') ?? 'unknown'

  return `
    <p><strong>${escapeHtml(label)}:</strong> <time datetime="${now}">${now}</time></p>
    <p class="muted">Rendered on request for <code>${escapeHtml(ua.slice(0, 48))}</code></p>
  `
}
