import { h2, p } from 'javascript-to-html'
import { code } from '../lib/code.js'
import { uiLayout } from '../lib/layout.js'
import { demo, propsTable, uiHead } from '../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'List',
    description:
      'Rows of content with an optional thing on either side — the shape most settings screens and feeds are built from.',
    activeHref: '/ui/list',
    extraHead: uiHead(),
    children: [
      p(
        'A list is a bordered surface of rows. Each row has a title, an optional description, and slots at the start and end for an avatar, an icon or a control.',
      ),

      h2('Basic list'),
      demo(`list(
  listItem({ title: 'Routing', description: 'src/about.ht.js becomes /about' }),
  listItem({ title: 'Data loading', description: 'data() runs once, at build time' }),
  listItem({ title: 'Assets', description: 'Only what your HTML references is bundled' }),
)`, { align: 'stretch' }),

      h2('Start and end slots'),
      demo(`list(
  listItem({
    start: avatar({ name: 'Ada Lovelace', size: 'sm' }),
    title: 'Ada Lovelace',
    description: 'Pushed 3 commits to main',
    end: chip({ size: 'sm', color: 'neutral' }, '2h'),
  }),
  listItem({
    start: avatar({ name: 'Grace Hopper', size: 'sm', color: 'success' }),
    title: 'Grace Hopper',
    description: 'Opened a pull request',
    end: chip({ size: 'sm', color: 'success', dot: true }, 'open'),
  }),
)`, { align: 'stretch' }),

      h2('Rows that link'),
      p(
        'A row with an ',
        code('href'),
        ' puts the anchor inside the ',
        code('<li>'),
        ' rather than around it, so the list stays a valid list. Do not also put a button in the row — interactive content cannot nest inside a link.',
      ),
      demo(`list(
  listItem({ title: 'Getting started', description: 'Install and first page', href: '/docs' }),
  listItem({ title: 'Routing', description: 'File-based, with dynamic segments', href: '/docs/routing' }),
  listItem({ title: 'Deployment', description: 'Netlify, Vercel, Pages, Amplify', href: '/docs/deployment' }),
)`, { align: 'stretch' }),

      h2('Rows with controls'),
      p(
        'When a row holds a switch or a button, leave the row itself unlinked and let the control be the interactive part.',
      ),
      demo(`list(
  listItem({
    title: 'Pagefind search',
    description: 'Indexes every page at the end of the build',
    end: toggle({ 'aria-label': 'Pagefind search', checked: true }),
  }),
  listItem({
    title: 'Image optimization',
    description: 'Resizes and converts images. Needs sharp.',
    end: toggle({ 'aria-label': 'Image optimization', checked: true }),
  }),
  listItem({
    title: 'Server islands',
    description: 'Renders marked regions at request time',
    end: toggle({ 'aria-label': 'Server islands' }),
  }),
)`, { align: 'stretch' }),

      h2('Plain'),
      p(
        code('plain'),
        ' drops the border and background, for a list that sits inside a card or a sidebar that already has its own surface.',
      ),
      demo(`card(
  cardHeader({ title: 'Recent builds' }),
  cardBody(
    list({ plain: true },
      listItem({ title: '94a837a', description: 'main · 4 minutes ago', end: chip({ size: 'sm', color: 'success', dot: true }, 'passed') }),
      listItem({ title: 'dcfaaae', description: 'main · 2 hours ago', end: chip({ size: 'sm', color: 'success', dot: true }, 'passed') }),
      listItem({ title: 'a46a461', description: 'main · yesterday', end: chip({ size: 'sm', color: 'danger', dot: true }, 'failed') }),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Free-form rows'),
      p(
        'Without ',
        code('title'),
        ' or ',
        code('description'),
        ', a row renders whatever children it is given — for a layout the two-line shape does not cover.',
      ),
      demo(`list(
  listItem(
    stack({ direction: 'row', gap: 'md', align: 'center', justify: 'space-between', style: 'width: 100%' },
      stack({ gap: 'none' },
        text({ variant: 'small' }, 'Custom row'),
        text({ variant: 'caption', tone: 'muted' }, 'Anything you like inside'),
      ),
      button({ size: 'sm', variant: 'soft' }, 'Action'),
    ),
  ),
)`, { align: 'stretch' }),

      h2('From data'),
      demo(`return (() => {
  const locales = [
    { code: 'en', name: 'English', pages: 24 },
    { code: 'es', name: 'Español', pages: 24 },
    { code: 'zh', name: '简体中文', pages: 24 },
  ]

  return list(
    locales.map((locale) =>
      listItem({
        start: avatar({ name: locale.code, size: 'sm', color: 'neutral', square: true }),
        title: locale.name,
        description: locale.pages + ' pages',
        end: chip({ size: 'sm', color: 'neutral' }, locale.code),
      }),
    ),
  )
})()`, { align: 'stretch' }),

      h2('Props'),
      p(code('list()'), ':'),
      propsTable([
        ['plain', 'boolean', 'false', 'Drop the border and background.'],
        ['as', 'string', "'ul'", 'Element to render, e.g. ol.'],
      ]),
      p(code('listItem()'), ':'),
      propsTable([
        ['title', 'Child', '', 'The row’s main line.'],
        ['description', 'Child', '', 'A muted second line.'],
        ['start', 'Child', '', 'Leading slot — an avatar or icon.'],
        ['end', 'Child', '', 'Trailing slot — a chip, a control, a timestamp.'],
        ['href', 'string', '', 'Makes the row a link, with the anchor inside the li.'],
        ['interactive', 'boolean', 'false', 'Hover highlight without making it a link.'],
      ]),
    ],
  })
