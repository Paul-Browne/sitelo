import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pl.js'

export default () =>
  uiLayout({
    title: 'Paginacja',
    description:
      'Numerowane strony, w okienku wokół bieżącej, jako prawdziwe odnośniki.',
    activeHref: '/pl/ui/pagination',
    children: [
      p(
        code('href'),
        ' to funkcja z numeru strony na URL, więc paginacja działa zarówno dla ',
        code('/blog/2'),
        ', jak i dla ',
        code('/blog?page=2'),
        '. To sprawia, że każda strona jest prawdziwym odnośnikiem — indeksowalnym, otwieralnym w nowej karcie i działającym bez JavaScriptu, czyli tym, czego chce witryna statyczna.',
      ),

      h2('Podstawowa paginacja'),
      demo(`pagination({ page: 1, count: 5, href: (page) => '#page-' + page })`),

      h2('Okienko'),
      p(
        'Pierwsza i ostatnia strona są pokazane zawsze, plus okienko wokół bieżącej, z wielokropkiem wszędzie tam, gdzie ciąg przeskakuje.',
      ),
      demo(`stack({ gap: 'md' },
  pagination({ page: 1, count: 12, href: (page) => '#a-' + page }),
  pagination({ page: 6, count: 12, href: (page) => '#b-' + page }),
  pagination({ page: 12, count: 12, href: (page) => '#c-' + page }),
)`, { align: 'start' }),

      h2('Sąsiedzi'),
      p(
        code('siblings'),
        ' to liczba stron po obu stronach bieżącej.',
      ),
      demo(`stack({ gap: 'md' },
  pagination({ page: 6, count: 12, siblings: 0, href: (page) => '#d-' + page }),
  pagination({ page: 6, count: 12, siblings: 1, href: (page) => '#e-' + page }),
  pagination({ page: 6, count: 12, siblings: 3, href: (page) => '#f-' + page }),
)`, { align: 'start' }),

      h2('Końce'),
      p(
        'Poprzednia jest wyłączona na pierwszej stronie, a następna na ostatniej, więc kontrolka nigdy nie proponuje strony, która nie istnieje.',
      ),
      demo(`stack({ gap: 'md' },
  pagination({ page: 1, count: 3, href: (page) => '#g-' + page }),
  pagination({ page: 3, count: 3, href: (page) => '#h-' + page }),
  pagination({ page: 1, count: 1, href: (page) => '#i-' + page }),
)`, { align: 'start' }),

      h2('Kolory i etykiety'),
      demo(`stack({ gap: 'md' },
  pagination({ page: 3, count: 6, color: 'neutral', href: (page) => '#j-' + page }),
  pagination({
    page: 3,
    count: 6,
    color: 'success',
    previousLabel: 'Nowsze',
    nextLabel: 'Starsze',
    href: (page) => '#k-' + page,
  }),
)`, { align: 'start' }),

      h2('Bez href'),
      p(
        'Bez ',
        code('href'),
        ' numery renderują się jako przyciski niosące ',
        code('data-su-page'),
        ' — dla strony, która filtruje w miejscu własnym skryptem. Gdy możesz, wybieraj odnośniki: przeżyją wyłączony JavaScript.',
      ),
      demo(`pagination({ page: 2, count: 4 })`),

      h2('Na blogu'),
      p(
        'Typowy kształt na witrynie statycznej: ',
        code('generateStaticParams'),
        ' tworzy po jednej stronie na wycinek, a ',
        code('href'),
        ' na nie wskazuje.',
      ),
      demo(`return (() => {
  const posts = 47
  const perPage = 10
  const current = 3

  return stack({ gap: 'md', align: 'center' },
    text({ variant: 'small', tone: 'muted' },
      'Pokazano ' + ((current - 1) * perPage + 1) + '–' + Math.min(current * perPage, posts) + ' z ' + posts,
    ),
    pagination({
      page: current,
      count: Math.ceil(posts / perPage),
      href: (page) => page === 1 ? '#blog' : '#blog-' + page,
    }),
  )
})()`, { align: 'stretch' }),

      h2('Propsy'),
      propsTable([
        ['page', 'number', '1', 'Bieżąca strona. Przycinana do zakresu.'],
        ['count', 'number', '1', 'Ile jest stron.'],
        ['href', '(page: number) => string', '', 'Z numeru strony na URL. Bez tego strony renderują się jako przyciski.'],
        ['siblings', 'number', '1', 'Strony pokazane po obu stronach bieżącej.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Kolor bieżącej strony.'],
        ['label', 'string', "'Pagination'", 'Dostępna nazwa punktu orientacyjnego nav.'],
        ['previousLabel', 'Child', "'‹'", 'Treść kontrolki wstecz.'],
        ['nextLabel', 'Child', "'›'", 'Treść kontrolki naprzód.'],
      ]),
    ],
  })
