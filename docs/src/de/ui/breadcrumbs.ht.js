import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/de.js'

export default () =>
  uiLayout({
    title: 'Breadcrumbs',
    description:
      'Die Spur der Vorfahren, die bei der Seite endet, auf der du stehst.',
    activeHref: '/de/ui/breadcrumbs',
    children: [
      p(
        'Breadcrumbs sagen, wo eine Seite sitzt. Der letzte Eintrag ist die aktuelle Seite: er wird als reiner Text gerendert und mit ',
        code('aria-current="page"'),
        ' markiert, denn ein Link auf die Seite, auf der man schon ist, ist Rauschen.',
      ),

      h2('Einfache Breadcrumbs'),
      demo(`breadcrumbs({
  items: [
    { label: 'Start', href: '/' },
    { label: 'Doku', href: '/docs' },
    { label: 'Routing' },
  ],
})`, { align: 'stretch' }),

      h2('Trennzeichen'),
      p('Beliebiger String oder Markup. Die Trennzeichen bleiben in jedem Fall vor Screenreadern verborgen.'),
      demo(`stack({ gap: 'md' },
  breadcrumbs({
    separator: '/',
    items: [{ label: 'Start', href: '/' }, { label: 'UI', href: '/ui' }, { label: 'Breadcrumbs' }],
  }),
  breadcrumbs({
    separator: '›',
    items: [{ label: 'Start', href: '/' }, { label: 'UI', href: '/ui' }, { label: 'Breadcrumbs' }],
  }),
  breadcrumbs({
    separator: '·',
    items: [{ label: 'Start', href: '/' }, { label: 'UI', href: '/ui' }, { label: 'Breadcrumbs' }],
  }),
)`, { align: 'stretch' }),

      h2('Einfache Strings'),
      p('Ein Eintrag ohne href ist nur Text, wo immer er steht — nicht nur am Ende.'),
      demo(`breadcrumbs({
  items: ['Start', 'Archiv', '2026', 'März'],
})`, { align: 'stretch' }),

      h2('Aus einem Pfad'),
      p(
        'Auf einer statischen Website wird die Spur meist aus der Route abgeleitet, nicht von Hand geschrieben.',
      ),
      demo(`return (() => {
  const path = '/docs/guides/routing'
  const segments = path.split('/').filter(Boolean)

  return breadcrumbs({
    items: [
      { label: 'Start', href: '/' },
      ...segments.map((segment, index) => ({
        label: segment.replace(/-/g, ' '),
        href: index === segments.length - 1 ? undefined : '/' + segments.slice(0, index + 1).join('/'),
      })),
    ],
  })
})()`, { align: 'stretch' }),

      h2('Das nav beschriften'),
      p(
        'Das Ganze ist ein ',
        code('<nav>'),
        ' mit zugänglichem Namen, sodass ein Screenreader dorthin springen kann. Ändere den Namen mit ',
        code('label'),
        ', wenn eine Seite mehr als einen Navigations-Landmark hat.',
      ),
      demo(`breadcrumbs({
  label: 'Breadcrumb der Dokumentation',
  items: [{ label: 'Doku', href: '/docs' }, { label: 'Komponenten' }],
})`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['items', 'Array', '[]', 'Strings oder { label, href }-Objekte. Der letzte ist die aktuelle Seite.'],
        ['separator', 'Child', "'/'", 'Wird zwischen den Einträgen gezeichnet, vor Screenreadern verborgen.'],
        ['label', 'string', "'Breadcrumb'", 'Zugänglicher Name des nav-Landmarks.'],
      ]),
    ],
  })
