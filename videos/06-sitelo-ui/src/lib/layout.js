import { body, head, html, img, link, meta, script, title } from 'javascript-to-html'
import * as ui from 'sitelo/ui'
import { orange, orangeDark } from './theme.js'

const links = [
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
      ui.styles(),
      ui.theme(orange, { dark: orangeDark }),
      ui.themeScript(),
      link({ rel: 'stylesheet', href: '/styles.css' }),
      // Only pages with islands load the (tiny) client loader
      islands ? script({ type: 'module', src: '/islands.js' }) : '',
    ),
    body(
      ui.appBar({
        brand: [img({ src: '/images/logo.svg', alt: '', width: 28, height: 28 }), 'Weeknight Kitchen'],
        sticky: true,
        blur: true,
      },
        ui.appBarSpacer(),
        ui.appBarNav(
          links.map(({ href, label }) => ui.navLink({ href, current: isCurrent(href, path) }, label)),
        ),
        ui.appBarActions(ui.themeToggle()),
      ),
      ui.container({ as: 'main' }, ...children),
      ui.siteFooter(
        ui.footerColumn({ title: 'Recipes' },
          ui.link({ href: '/recipes' }, 'All recipes'),
          ui.link({ href: '/recipes/quick' }, 'Ready in 30 minutes'),
          ui.link({ href: '/cuisines' }, 'Cuisines'),
        ),
        ui.footerColumn({ title: 'Kitchen' },
          ui.link({ href: '/about' }, 'About'),
          ui.link({ href: '/search' }, 'Search'),
        ),
        ui.footerColumn({ title: 'Legal' },
          ui.link({ href: '/privacy' }, 'Privacy'),
          ui.link({ href: '/terms' }, 'Terms'),
        ),
        ui.footerBottom(
          ui.text({ variant: 'small', tone: 'muted' }, 'Built with sitelo · Recipes from DummyJSON'),
        ),
      ),
    ),
  )
