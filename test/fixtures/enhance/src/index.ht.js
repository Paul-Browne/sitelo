import { enhance, enhanceAttributes } from 'sitelo/enhance'

export default () => `
  <html lang="en">
    <head>
      <title>Enhance fixture</title>
    </head>
    <body>
      ${enhance(
        'counter',
        {},
        '<button type="button">Add one</button> <output>5</output>',
        { when: 'visible' },
      )}
      <p>Built at <time ${enhanceAttributes('clock', { format: 'short' })}>build time</time></p>
      <pre><code>&lt;div data-sitelo-enhance="only-in-a-code-sample"&gt;&lt;/div&gt;</code></pre>
      <script type="module" src="/enhance.ts"></script>
    </body>
  </html>
`
