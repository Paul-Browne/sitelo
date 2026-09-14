export default () => `
  <html lang="en">
    <head>
      <title>images fixture</title>
    </head>
    <body>
      <img src="/images/hero.png" alt="Hero">
      <img src="/images/hero.png" alt="Thumb" width="200">
      <img src="/images/hero.png?w=400" alt="Pinned">
      <img src="/images/hero.png?w=300&format=jpeg" alt="Pinned jpeg">
      <img src="/images/hero.png?h=225" alt="Pinned height">
      <img src="/images/hero.png?w=200&h=200" alt="Square">
      <img src="/images/hero.png?w=200&h=200&fit=contain" alt="Contained">
      <img src="/images/hero.png?w=200&h=200&background=fff" alt="Padded">
      <img src="/images/hero.png?w=400&h=100" alt="Strip">
      <img src="/images/hero.png?w=400&h=100&position=top" alt="Top">
      <img src="/images/hero.png" alt="Untouched" data-no-optimize>
      <img src="/images/orphan.png" alt="Orphan">
      <img src="/logo.svg" alt="Vector">
      <img src="https://example.com/remote.png" alt="Remote">
    </body>
  </html>
`
