import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/it.js'

export default () =>
  uiLayout({
    title: 'Breadcrumb',
    description: 'La scia di antenati che finisce sulla pagina in cui ti trovi.',
    activeHref: '/it/ui/breadcrumbs',
    children: [
      p(
        'I breadcrumb dicono dove sta una pagina. L’ultimo elemento è la pagina corrente: viene renderizzato come semplice testo e marcato ',
        code('aria-current="page"'),
        ', perché un link alla pagina su cui sei già è rumore.',
      ),

      h2('Breadcrumb di base'),
      demo(`breadcrumbs({
  items: [
    { label: 'Home', href: '/' },
    { label: 'Documentazione', href: '/docs' },
    { label: 'Routing' },
  ],
})`, { align: 'stretch' }),

      h2('Separatore'),
      p(
        'Qualunque stringa o markup. In ogni caso i separatori sono nascosti agli screen reader.',
      ),
      demo(`stack({ gap: 'md' },
  breadcrumbs({
    separator: '/',
    items: [{ label: 'Home', href: '/' }, { label: 'UI', href: '/ui' }, { label: 'Breadcrumb' }],
  }),
  breadcrumbs({
    separator: '›',
    items: [{ label: 'Home', href: '/' }, { label: 'UI', href: '/ui' }, { label: 'Breadcrumb' }],
  }),
  breadcrumbs({
    separator: '·',
    items: [{ label: 'Home', href: '/' }, { label: 'UI', href: '/ui' }, { label: 'Breadcrumb' }],
  }),
)`, { align: 'stretch' }),

      h2('Semplici stringhe'),
      p(
        'Un elemento senza href è solo testo, ovunque compaia — non soltanto alla fine.',
      ),
      demo(`breadcrumbs({
  items: ['Home', 'Archivio', '2026', 'Marzo'],
})`, { align: 'stretch' }),

      h2('A partire da un percorso'),
      p(
        'Su un sito statico la scia si ricava di solito dalla rotta, non la si scrive a mano.',
      ),
      demo(`return (() => {
  const path = '/docs/guides/routing'
  const segments = path.split('/').filter(Boolean)

  return breadcrumbs({
    items: [
      { label: 'Home', href: '/' },
      ...segments.map((segment, index) => ({
        label: segment.replace(/-/g, ' '),
        href: index === segments.length - 1 ? undefined : '/' + segments.slice(0, index + 1).join('/'),
      })),
    ],
  })
})()`, { align: 'stretch' }),

      h2('Dare un nome alla nav'),
      p(
        'L’insieme è un ',
        code('<nav>'),
        ' con un nome accessibile, così uno screen reader può saltarci sopra. Cambia il nome con ',
        code('label'),
        ' quando una pagina ha più di un punto di riferimento di navigazione.',
      ),
      demo(`breadcrumbs({
  label: 'Breadcrumb della documentazione',
  items: [{ label: 'Documentazione', href: '/docs' }, { label: 'Componenti' }],
})`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['items', 'Array', '[]', 'Stringhe, oppure oggetti { label, href }. L’ultimo è la pagina corrente.'],
        ['separator', 'Child', "'/'", 'Disegnato fra gli elementi, nascosto agli screen reader.'],
        ['label', 'string', "'Breadcrumb'", 'Nome accessibile del punto di riferimento nav.'],
      ]),
    ],
  })
