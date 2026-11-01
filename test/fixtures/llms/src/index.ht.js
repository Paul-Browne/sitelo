import { layout } from './layout.js'

export default () =>
  layout(
    { title: 'Example', description: 'Notes on <b>tags</b> & building small sites.' },
    '<h1>Welcome</h1><p>Read the <a href="blog/">blog</a>.</p>',
  )
