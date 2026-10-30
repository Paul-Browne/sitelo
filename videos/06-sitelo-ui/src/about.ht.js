import { h1, img, p } from 'javascript-to-html'
import * as ui from 'sitelo/ui'
import { layout } from './lib/layout.js'

export default ({ page }) =>
  layout({
    title: 'About',
    description: 'Why Weeknight Kitchen exists.',
    path: page.routePath,
  },
    ui.prose({ class: 'section' },
      h1('About the kitchen'),
      img({ src: '/images/kitchen.jpg', alt: 'Tomatoes, a lemon and an onion on a chopping board', sizes: '(min-width: 40rem) 40rem, 100vw' }),
      p('Weeknight Kitchen is a demo site for the sitelo video series.'),
      p('Every page is a JavaScript function that returns HTML. There is no framework and no client-side JavaScript, unless we add some.'),
    ),
  )
