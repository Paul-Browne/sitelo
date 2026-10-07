import { body, head, html, link, main, meta, script, title as titleEl } from 'javascript-to-html'
import * as ui from 'sitelo/ui'

/** The shell every page shares: head, app bar, footer. */
export function layout({ title, description }, ...children) {
  return html(
    { lang: 'en' },
    head(
      meta({ charset: 'utf-8' }),
      meta({ name: 'viewport', content: 'width=device-width, initial-scale=1' }),
      titleEl(title),
      meta({ name: 'description', content: description }),
      ui.themeScript(),
      ui.styles(),
      link({ rel: 'icon', href: 'data:,' }),
    ),
    body(
      { style: 'background: var(--su-bg); color: var(--su-text); margin: 0' },
      ui.appBar(
        { brand: 'My sitelo site', sticky: true, blur: true },
        ui.appBarSpacer(),
        ui.appBarActions(ui.themeToggle()),
      ),
      main(ui.container({ size: 'md', style: 'padding-block: 3rem 5rem' }, ...children)),
      ui.container(
        { size: 'md' },
        ui.footer(
          ui.text(
            { variant: 'caption', tone: 'muted' },
            'Built with ',
            ui.link({ href: 'https://sitelo.dev' }, 'sitelo'),
            ', running on ',
            ui.link({ href: 'https://railway.com' }, 'Railway'),
            '.',
          ),
        ),
      ),
      script({ type: 'module', src: '/js/islands.js' }),
    ),
  )
}
