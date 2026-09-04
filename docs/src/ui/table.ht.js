import { h2, p } from 'javascript-to-html'
import { code } from '../lib/code.js'
import { uiLayout } from '../lib/layout.js'
import { demo, propsTable, uiHead } from '../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Table',
    description:
      'Rows and columns from data, in a scroll container that keeps a wide table from breaking the page.',
    activeHref: '/ui/table',
    extraHead: uiHead(),
    children: [
      p(
        'Pass ',
        code('columns'),
        ' and ',
        code('rows'),
        ' and the table builds itself, header included. It is wrapped in a horizontal scroll container, so a table with more columns than a phone can show scrolls on its own rather than stretching the page. Exported as both ',
        code('table'),
        ' and ',
        code('dataTable'),
        '.',
      ),

      h2('Basic table'),
      demo(`table({
  columns: [
    { key: 'page', header: 'Page' },
    { key: 'size', header: 'Size' },
    { key: 'time', header: 'Render time' },
  ],
  rows: [
    { page: '/', size: '4.1 kB', time: '12 ms' },
    { page: '/docs', size: '12.7 kB', time: '31 ms' },
    { page: '/examples', size: '9.4 kB', time: '24 ms' },
  ],
})`, { align: 'stretch' }),

      h2('Alignment'),
      p('Numbers read better aligned to the end of their column.'),
      demo(`table({
  columns: [
    { key: 'page', header: 'Page' },
    { key: 'bytes', header: 'Bytes', align: 'end' },
    { key: 'gzip', header: 'Gzip', align: 'end' },
  ],
  rows: [
    { page: '/', bytes: '4,112', gzip: '1,204' },
    { page: '/docs', bytes: '12,704', gzip: '3,910' },
    { page: '/examples', bytes: '9,388', gzip: '2,744' },
  ],
})`, { align: 'stretch' }),

      h2('Custom cells'),
      p(
        'A column with a ',
        code('render'),
        ' function gets the whole row and returns whatever should be in the cell — a chip, a link, a formatted number.',
      ),
      demo(`table({
  columns: [
    { header: 'Page', render: (row) => link({ href: row.href }, row.page) },
    { key: 'size', header: 'Size', align: 'end' },
    { header: 'Status', align: 'end', render: (row) =>
      chip({ size: 'sm', dot: true, color: row.ok ? 'success' : 'danger' }, row.ok ? 'ok' : 'failed') },
  ],
  rows: [
    { page: '/docs/routing', href: '/docs/routing', size: '18.2 kB', ok: true },
    { page: '/docs/data', href: '/docs/data', size: '21.7 kB', ok: true },
    { page: '/docs/islands', href: '/docs/islands', size: '24.1 kB', ok: false },
  ],
})`, { align: 'stretch' }),

      h2('Styles'),
      p(
        code('striped'),
        ' bands alternate rows, ',
        code('hover'),
        ' highlights the row under the pointer, and ',
        code('dense'),
        ' tightens the padding for a table with many rows.',
      ),
      demo(`stack({ gap: 'lg' },
  table({
    striped: true,
    caption: 'striped',
    columns: [{ key: 'name', header: 'Name' }, { key: 'value', header: 'Value', align: 'end' }],
    rows: [{ name: 'pages', value: '169' }, { name: 'assets', value: '208' }, { name: 'total', value: '9.5 MB' }],
  }),
  table({
    hover: true,
    dense: true,
    caption: 'hover and dense',
    columns: [{ key: 'name', header: 'Name' }, { key: 'value', header: 'Value', align: 'end' }],
    rows: [{ name: 'pages', value: '169' }, { name: 'assets', value: '208' }, { name: 'total', value: '9.5 MB' }],
  }),
)`, { align: 'stretch' }),

      h2('Caption'),
      p(
        'A caption names the table for anyone who arrives at it without the surrounding text — worth adding whenever the table is not directly under a heading that already says what it is.',
      ),
      demo(`table({
  caption: 'Build output, newest first',
  columns: [
    { key: 'commit', header: 'Commit' },
    { key: 'when', header: 'When' },
    { key: 'pages', header: 'Pages', align: 'end' },
  ],
  rows: [
    { commit: '94a837a', when: '4 minutes ago', pages: '169' },
    { commit: 'dcfaaae', when: '2 hours ago', pages: '161' },
  ],
})`, { align: 'stretch' }),

      h2('From data'),
      p(
        'Rows are an ordinary array, so they are usually whatever ',
        code('data()'),
        ' already loaded — no adapter in between.',
      ),
      demo(`return (() => {
  const posts = [
    { title: 'Hello world', date: '2026-01-14', reads: 1204 },
    { title: 'Static first', date: '2026-02-02', reads: 890 },
    { title: 'No runtime', date: '2026-03-19', reads: 2317 },
  ]

  return table({
    hover: true,
    columns: [
      { key: 'title', header: 'Post' },
      { key: 'date', header: 'Published' },
      { header: 'Reads', align: 'end', render: (post) => post.reads.toLocaleString('en') },
    ],
    rows: posts,
  })
})()`, { align: 'stretch' }),

      h2('Writing the markup yourself'),
      p(
        'Omit ',
        code('columns'),
        ' and the table renders its children instead, so a table with a footer row or grouped headers can be hand-built and still get the styling and the scroll container.',
      ),

      h2('Props'),
      propsTable([
        ['columns', 'TableColumn[]', '', '{ key, header, align, render } per column. Omit to hand-write the rows.'],
        ['rows', 'object[]', '[]', 'One object per row.'],
        ['caption', 'Child', '', 'A caption above the table.'],
        ['striped', 'boolean', 'false', 'Band alternate rows.'],
        ['hover', 'boolean', 'false', 'Highlight the row under the pointer.'],
        ['dense', 'boolean', 'false', 'Tighter cell padding.'],
      ]),
    ],
  })
