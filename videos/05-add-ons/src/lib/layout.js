import { a, body, footer, head, header, html, img, link, main, meta, nav, p, script, title } from 'javascript-to-html'

const links = [
  { href: '/', label: 'Home' },
  { href: '/recipes', label: 'Recipes' },
  { href: '/cuisines', label: 'Cuisines' },
  { href: '/about', label: 'About' },
  { href: '/search', label: 'Search' },
]

// "/recipes" stays highlighted on "/recipes/classic-margherita-pizza" too
const isCurrent = (href, path = '') =>
  href === '/' ? path === '/' : path === href || path.startsWith(`${href}/`)

export const layout = ({ title: pageTitle, description, path, islands = false }, ...children) =>
  html({ lang: 'en' },
    head(
      meta({ charset: 'utf-8' }),
      meta({ name: 'viewport', content: 'width=device-width, initial-scale=1' }),
      title(`${pageTitle} · Weeknight Kitchen`),
      meta({ name: 'description', content: description }),
      link({ rel: 'icon', href: '/images/logo.svg' }),
      link({ rel: 'stylesheet', href: '/styles.css' }),
      // Only pages with islands load the (tiny) client loader
      islands ? script({ type: 'module', src: '/islands.js' }) : '',
    ),
    body(
      header({ class: 'site-header' },
        a({ class: 'brand', href: '/' },
          img({ src: '/images/logo.svg', alt: '', width: 32, height: 32 }),
          'Weeknight Kitchen',
        ),
        nav(
          links.map(({ href, label }) =>
            a({ href, 'aria-current': isCurrent(href, path) ? 'page' : null }, label),
          ),
        ),
      ),
      main(...children),
      footer({ class: 'site-footer' },
        p('Built with sitelo · Recipes from DummyJSON'),
        p(a({ href: '/privacy' }, 'Privacy'), ' · ', a({ href: '/terms' }, 'Terms')),
      ),
    ),
  )
