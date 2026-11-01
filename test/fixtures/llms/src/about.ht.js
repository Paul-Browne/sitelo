import { layout } from './layout.js'

// No <main>: the body is the content, without the header and footer.
export default () =>
  layout(
    { title: 'About · Example', description: 'Who writes this.', main: false },
    '<h1>About</h1><p>Written by one person.</p>',
  )
