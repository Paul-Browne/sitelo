import { h1, img, p, section } from 'javascript-to-html'
import { layout } from './lib/layout.js'

export default ({ page }) =>
  layout({
    title: 'About',
    description: 'Why Weeknight Kitchen exists.',
    path: page.routePath,
  },
    section({ class: 'prose' },
      h1('About the kitchen'),
      img({ src: '/images/kitchen.jpg', alt: 'Tomatoes, a lemon and an onion on a chopping board' }),
      p('Weeknight Kitchen is a demo site for the sitelo video series.'),
      p('Every page is a JavaScript function that returns HTML. There is no framework and no client-side JavaScript, unless we add some.'),
    ),
  )
