import { island } from 'sitelo/islands'

export default () => `
  <html lang="en">
    <head>
      <title>Server islands demo</title>
      <link rel="stylesheet" href="/styles.css">
    </head>
    <body>
      <h1>Static page, live island</h1>
      <p>This HTML was built once. The box below is filled at request time.</p>
      ${island(
        'time',
        { label: 'Right now' },
        '<p>Loading server time…</p>',
      )}
      <script type="module" src="/islands.js"></script>
    </body>
  </html>
`
