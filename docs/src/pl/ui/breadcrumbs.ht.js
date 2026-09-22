import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pl.js'

export default () =>
  uiLayout({
    title: 'Okruszki',
    description: 'Ślad przodków kończący się na stronie, na której jesteś.',
    activeHref: '/pl/ui/breadcrumbs',
    children: [
      p(
        'Okruszki mówią, gdzie leży strona. Ostatni element to strona bieżąca: renderuje się jako zwykły tekst i ma ',
        code('aria-current="page"'),
        ', bo odnośnik do strony, na której już jesteś, to szum.',
      ),

      h2('Podstawowe okruszki'),
      demo(`breadcrumbs({
  items: [
    { label: 'Start', href: '/' },
    { label: 'Dokumentacja', href: '/docs' },
    { label: 'Routing' },
  ],
})`, { align: 'stretch' }),

      h2('Separator'),
      p(
        'Dowolny ciąg znaków albo znaczniki. Tak czy inaczej separatory są ukryte przed czytnikami ekranu.',
      ),
      demo(`stack({ gap: 'md' },
  breadcrumbs({
    separator: '/',
    items: [{ label: 'Start', href: '/' }, { label: 'UI', href: '/ui' }, { label: 'Okruszki' }],
  }),
  breadcrumbs({
    separator: '›',
    items: [{ label: 'Start', href: '/' }, { label: 'UI', href: '/ui' }, { label: 'Okruszki' }],
  }),
  breadcrumbs({
    separator: '·',
    items: [{ label: 'Start', href: '/' }, { label: 'UI', href: '/ui' }, { label: 'Okruszki' }],
  }),
)`, { align: 'stretch' }),

      h2('Zwykłe ciągi znaków'),
      p(
        'Element bez href to po prostu tekst, gdziekolwiek się pojawi — nie tylko na końcu.',
      ),
      demo(`breadcrumbs({
  items: ['Start', 'Archiwum', '2026', 'Marzec'],
})`, { align: 'stretch' }),

      h2('Ze ścieżki'),
      p(
        'Na witrynie statycznej ślad zwykle wyprowadza się z trasy, a nie pisze ręcznie.',
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

      h2('Nazwanie nawigacji'),
      p(
        'Całość to ',
        code('<nav>'),
        ' z dostępną nazwą, więc czytnik ekranu może do niej przeskoczyć. Zmień nazwę przez ',
        code('label'),
        ', gdy strona ma więcej niż jeden punkt orientacyjny nawigacji.',
      ),
      demo(`breadcrumbs({
  label: 'Okruszki dokumentacji',
  items: [{ label: 'Dokumentacja', href: '/docs' }, { label: 'Komponenty' }],
})`, { align: 'stretch' }),

      h2('Propsy'),
      propsTable([
        ['items', 'Array', '[]', 'Ciągi znaków albo obiekty { label, href }. Ostatni to strona bieżąca.'],
        ['separator', 'Child', "'/'", 'Rysowany między elementami, ukryty przed czytnikami ekranu.'],
        ['label', 'string', "'Breadcrumb'", 'Dostępna nazwa punktu orientacyjnego nav.'],
      ]),
    ],
  })
