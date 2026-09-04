import { h2, p } from 'javascript-to-html'
import { code } from '../lib/code.js'
import { uiLayout } from '../lib/layout.js'
import { demo, propsTable, uiHead } from '../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Pagination',
    description:
      'Numbered pages, windowed around the current one, as real links.',
    activeHref: '/ui/pagination',
    extraHead: uiHead(),
    children: [
      p(
        code('href'),
        ' is a function from page number to URL, so pagination works for ',
        code('/blog/2'),
        ' and ',
        code('/blog?page=2'),
        ' alike. That makes every page a real link — crawlable, openable in a new tab, and working with no JavaScript, which is what a static site wants.',
      ),

      h2('Basic pagination'),
      demo(`pagination({ page: 1, count: 5, href: (page) => '#page-' + page })`),

      h2('Windowing'),
      p(
        'The first and last pages are always shown, plus a window around the current one, with an ellipsis wherever the sequence jumps.',
      ),
      demo(`stack({ gap: 'md' },
  pagination({ page: 1, count: 12, href: (page) => '#a-' + page }),
  pagination({ page: 6, count: 12, href: (page) => '#b-' + page }),
  pagination({ page: 12, count: 12, href: (page) => '#c-' + page }),
)`, { align: 'start' }),

      h2('Siblings'),
      p(
        code('siblings'),
        ' is how many pages sit either side of the current one.',
      ),
      demo(`stack({ gap: 'md' },
  pagination({ page: 6, count: 12, siblings: 0, href: (page) => '#d-' + page }),
  pagination({ page: 6, count: 12, siblings: 1, href: (page) => '#e-' + page }),
  pagination({ page: 6, count: 12, siblings: 3, href: (page) => '#f-' + page }),
)`, { align: 'start' }),

      h2('Ends'),
      p(
        'Previous is disabled on the first page and next on the last, so the control never offers a page that does not exist.',
      ),
      demo(`stack({ gap: 'md' },
  pagination({ page: 1, count: 3, href: (page) => '#g-' + page }),
  pagination({ page: 3, count: 3, href: (page) => '#h-' + page }),
  pagination({ page: 1, count: 1, href: (page) => '#i-' + page }),
)`, { align: 'start' }),

      h2('Colors and labels'),
      demo(`stack({ gap: 'md' },
  pagination({ page: 3, count: 6, color: 'neutral', href: (page) => '#j-' + page }),
  pagination({
    page: 3,
    count: 6,
    color: 'success',
    previousLabel: 'Newer',
    nextLabel: 'Older',
    href: (page) => '#k-' + page,
  }),
)`, { align: 'start' }),

      h2('Without hrefs'),
      p(
        'With no ',
        code('href'),
        ', the numbers render as buttons carrying ',
        code('data-su-page'),
        ' — for a page that filters in place with its own script. Prefer links when you can: they survive JavaScript being off.',
      ),
      demo(`pagination({ page: 2, count: 4 })`),

      h2('In a blog'),
      p(
        'The usual shape on a static site: ',
        code('generateStaticParams'),
        ' produces one page per slice, and ',
        code('href'),
        ' points at them.',
      ),
      demo(`return (() => {
  const posts = 47
  const perPage = 10
  const current = 3

  return stack({ gap: 'md', align: 'center' },
    text({ variant: 'small', tone: 'muted' },
      'Showing ' + ((current - 1) * perPage + 1) + '–' + Math.min(current * perPage, posts) + ' of ' + posts,
    ),
    pagination({
      page: current,
      count: Math.ceil(posts / perPage),
      href: (page) => page === 1 ? '#blog' : '#blog-' + page,
    }),
  )
})()`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['page', 'number', '1', 'The current page. Clamped into range.'],
        ['count', 'number', '1', 'How many pages there are.'],
        ['href', '(page: number) => string', '', 'Page number to URL. Without it, pages render as buttons.'],
        ['siblings', 'number', '1', 'Pages shown either side of the current one.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Colour of the current page.'],
        ['label', 'string', "'Pagination'", 'Accessible name for the nav landmark.'],
        ['previousLabel', 'Child', "'‹'", 'Content of the previous control.'],
        ['nextLabel', 'Child', "'›'", 'Content of the next control.'],
      ]),
    ],
  })
