import { h2, p } from 'javascript-to-html'
import { code } from '../lib/code.js'
import { uiLayout } from '../lib/layout.js'
import { demo, propsTable, uiHead } from '../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Empty',
    description:
      'What a list looks like before it has anything in it.',
    activeHref: '/ui/empty',
    extraHead: uiHead(),
    children: [
      p(
        'A blank space reads as a bug. An empty state says which space is blank, why, and what to do next — and it is the case most easily forgotten, because during development there is always data.',
      ),

      h2('Basic empty state'),
      demo(`empty({
  title: 'No posts yet',
  description: 'Add a Markdown file to src/posts and it will appear here.',
})`, { align: 'stretch' }),

      h2('With an icon'),
      p(
        'The icon is decoration — it is marked ',
        code('aria-hidden'),
        ', because the title already says what is going on.',
      ),
      demo(`empty({
  icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 5h10l2 3h4v11H4z"/></svg>',
  title: 'Nothing here',
  description: 'This folder has no pages in it.',
})`, { align: 'stretch' }),

      h2('With an action'),
      p('Children become the action row.'),
      demo(`empty({
  icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5" stroke-linecap="round"/></svg>',
  title: 'No results for “islands”',
  description: 'Check the spelling, or browse the documentation instead.',
},
  button({ href: '/docs' }, 'Browse the docs'),
  button({ variant: 'outline', color: 'neutral' }, 'Clear search'),
)`, { align: 'stretch' }),

      h2('In a card'),
      demo(`card(
  cardHeader({ title: 'Deploys' }),
  cardBody(
    empty({
      title: 'No deploys yet',
      description: 'Push to main and the first build will show up here.',
    }, button({ size: 'sm' }, 'Connect a repository')),
  ),
)`, { align: 'stretch' }),

      h2('In place of a table'),
      p(
        'Swap the table for an empty state rather than rendering a header with no rows under it.',
      ),
      demo(`return (() => {
  const rows = []

  return card(
    cardHeader({ title: 'Build history' }),
    rows.length
      ? table({ columns: [{ key: 'commit', header: 'Commit' }], rows })
      : cardBody(empty({
          title: 'No builds recorded',
          description: 'Runs appear here once the site has been deployed at least once.',
        })),
  )
})()`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['icon', 'Child', '', 'Decorative glyph above the title; hidden from screen readers.'],
        ['title', 'Child', '', 'What is empty, in a few words.'],
        ['description', 'Child', '', 'Why it is empty, or what to do about it.'],
      ]),
      p('Children render as the action row under the description.'),
    ],
  })
