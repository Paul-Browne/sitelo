export function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

export function siteChrome({ title, description = '', body }) {
  return `
  <html lang="fi">
    <head>
      <meta charset="utf-8">
      <title>${escapeHtml(title)}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      ${
        description
          ? `<meta name="description" content="${escapeHtml(description)}">`
          : ''
      }
      <link rel="stylesheet" href="/css/styles.css">
    </head>
    <body>
      <header class="site-header">
        <p class="eyebrow">sitelo · Elisa kauppa example</p>
        <p class="brand"><a href="/">Kauppa</a></p>
      </header>
      ${body}
      <footer class="site-footer">
        Catalog data © <a href="https://elisa.fi/kauppa" rel="noopener">Elisa</a>.
        Built with <a href="https://sitelo.dev">sitelo</a>. No checkout.
      </footer>
    </body>
  </html>
`
}
