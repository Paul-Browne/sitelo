import { enhance } from 'sitelo/enhance'

export default () => `
  <html lang="en">
    <head>
      <title>Enhance fixture</title>
    </head>
    <body>
      ${enhance(
        'counter',
        { start: 5 },
        '<button type="button">Add one</button> <output>5</output>',
        { when: 'visible' },
      )}
      <script type="module" src="/enhance.ts"></script>
    </body>
  </html>
`
