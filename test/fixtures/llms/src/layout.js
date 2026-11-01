import { escapeHtml } from 'sitelo/page'

/** Header and footer around a page's content, as most sites have. */
export const layout = ({ title, description, robots, main = true }, content) => `
  <html lang="en">
    <head>
      <title>${escapeHtml(title)}</title>
      <meta name="description" content="${escapeHtml(description)}">
      ${robots ? `<meta name="robots" content="${robots}">` : ''}
    </head>
    <body>
      <header><nav><a href="/">Home</a> <a href="/blog/">Blog</a></nav></header>
      ${main ? `<main>${content}</main>` : content}
      <footer><p>© Example</p></footer>
    </body>
  </html>
`
