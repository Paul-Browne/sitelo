import { layout } from './layout.js'

export default () =>
  layout({ title: 'Secret', description: 'Not for crawlers.', robots: 'noindex, nofollow' }, '<h1>Secret</h1>')
