import { a, body, footer, head, header, html, img, link, main, meta, nav, p, title } from 'javascript-to-html'

const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
]

export const layout = ({ title: pageTitle, description, path }, ...children) =>
  html({ lang: 'en' },
    head(
      meta({ charset: 'utf-8' }),
      meta({ name: 'viewport', content: 'width=device-width, initial-scale=1' }),
      title(`${pageTitle} · Weeknight Kitchen`),
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
