import { a, h1, img, p, section } from 'javascript-to-html'
import { layout } from './lib/layout.js'

export default ({ page }) =>
  layout({
    title: 'Home',
    description: 'Quick, reliable recipes for busy weeknights.',
    path: page.routePath,
  },
    section({ class: 'hero' },
      img({ src: '/images/hero.jpg', alt: 'A bowl of pasta with tomatoes and basil on a wooden table' }),
      h1('Dinner, sorted.'),
      p({ class: 'lead' }, 'Fifty recipes you can actually cook on a Tuesday.'),
      a({ class: 'button', href: '/about' }, 'Meet the kitchen'),
    ),
  )
