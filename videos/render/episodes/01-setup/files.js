// Every state the episode's files pass through, in order. capture.js writes
// them to a real project and screenshots the result; episode.js types them
// into the on-screen editor. Keeping both on one list means what the viewer
// sees typed is what was actually run.

export const packageJson = {
  afterInit: `{
  "name": "weeknight-kitchen",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \\"Error: no test specified\\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "module",
  "dependencies": {
    "javascript-to-html": "^1.2.0",
    "sitelo": "^2.9.16"
  }
}
`,
  withScripts: `{
  "name": "weeknight-kitchen",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev": "sitelo",
    "build": "sitelo build",
    "preview": "sitelo preview"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "module",
  "dependencies": {
    "javascript-to-html": "^1.2.0",
    "sitelo": "^2.9.16"
  }
}
`,
}

export const index = {
  template: `export default () => \`
  <html lang="en">
    <head><title>Weeknight Kitchen</title></head>
    <body><h1>Dinner, sorted.</h1></body>
  </html>
\`
`,
  elements: `import { body, h1, head, html, title } from 'javascript-to-html'

export default () =>
  html({ lang: 'en' },
    head(title('Weeknight Kitchen')),
    body(h1('Dinner, sorted.')),
  )
`,
  broken: `import { body, h1, head, html } from 'javascript-to-html'

export default () =>
  html({ lang: 'en' },
    head(title('Weeknight Kitchen')),
    body(h1('Dinner, sorted.')),
  )
`,
  withLayout: `import { h1 } from 'javascript-to-html'
import { layout } from './lib/layout.js'

export default ({ page }) =>
  layout({
    title: 'Home',
    description: 'Quick, reliable recipes for busy weeknights.',
    path: page.routePath,
  },
    h1('Dinner, sorted.'),
  )
`,
  hero: `import { a, h1, img, p, section } from 'javascript-to-html'
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
`,
}

export const layout = `import { a, body, footer, head, header, html, img, link, main, meta, nav, p, title } from 'javascript-to-html'

const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
]

export const layout = ({ title: pageTitle, description, path }, ...children) =>
  html({ lang: 'en' },
    head(
      meta({ charset: 'utf-8' }),
      meta({ name: 'viewport', content: 'width=device-width, initial-scale=1' }),
      title(\`\${pageTitle} · Weeknight Kitchen\`),
      meta({ name: 'description', content: description }),
      link({ rel: 'icon', href: '/images/logo.svg' }),
      link({ rel: 'stylesheet', href: '/styles.css' }),
    ),
    body(
      header({ class: 'site-header' },
        a({ class: 'brand', href: '/' },
          img({ src: '/images/logo.svg', alt: '', width: 32, height: 32 }),
          'Weeknight Kitchen',
        ),
        nav(
          links.map(({ href, label }) =>
            a({ href, 'aria-current': href === path ? 'page' : null }, label),
          ),
        ),
      ),
      main(...children),
      footer({ class: 'site-footer' },
        p('Built with sitelo · Recipes from DummyJSON'),
      ),
    ),
  )
`

export const about = `import { h1, img, p, section } from 'javascript-to-html'
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
`

// The finished stylesheet is the snapshot's own, read by both scripts.
export const snapshot = new URL('../../../01-setup/', import.meta.url)
