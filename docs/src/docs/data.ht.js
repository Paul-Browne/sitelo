import { h2, h3, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, pageCodeTabs } from '../lib/code.js'
import { docsLayout } from '../lib/layout.js'
import { dataSnippets } from '../lib/snippets/data.js'

const s = dataSnippets('en')

export default () =>
  docsLayout({
    title: 'Data loading',
    description: 'Build-time data() and fetchWithCache for API-driven static sites.',
    activeHref: '/docs/data',
    children: [
      p(
        'Export a ',
        code('data()'),
        ' function and its result appears as ',
        code('ctx.data'),
        ' in your render function. It runs at build time, and per-request in the dev server.',
      ),
      pageCodeTabs({
        file: 'src/blog/[slug].ht.js',
        template: s.dataTemplate,
        ht: s.dataHt,
        jsx: s.dataJsx,
      }),
      h2('fetchWithCache'),
      p(
        'Building many pages against the same API? Import ',
        code('fetchWithCache'),
        ' from sitelo:',
      ),
      codeBlock('src/blog/[slug].ht.js', s.cache, 'javascript'),
      h3('Options'),
      ul(
        { class: 'docs-list' },
        li(code('maxAge'), ' — cache TTL in seconds (default ', code('3600'), ')'),
        li(code('cacheKey'), ' — custom key (default: hash of URL + method + headers + body)'),
        li(code('forceRefresh'), ' — bypass the cache'),
        li(
          code('cache'),
          ' — ',
          code("'auto'"),
          ' | ',
          code("'memory'"),
          ' | ',
          code("'fs'"),
          ' | ',
          code("'none'"),
        ),
      ),
      h3('Cache modes'),
      ul(
        { class: 'docs-list' },
        li(code('auto'), ' (default) — memory in dev, filesystem in production builds'),
        li(code('memory'), ' — in-process, cleared when the process exits'),
        li(code('fs'), ' — persisted under ', code('node_modules/.cache/')),
        li(code('none'), ' — always fetch'),
      ),
      p(
        'Only ',
        code('GET'),
        ' requests are cached by default (pass a ',
        code('cacheKey'),
        ' to cache other methods). Error responses are never cached.',
      ),
      h2('Local JSON files'),
      p(
        'No API? Keep the content in the repo as JSON and read it with ',
        code('sitelo/data'),
        '.',
      ),
      codeBlock('project', s.jsonTree, 'bash'),
      codeBlock('src/blog/[slug].ht.js', s.jsonCollection, 'javascript'),
      p(
        'Relative paths resolve from the project root, so ',
        code('data/posts'),
        ' means the same thing wherever you run the CLI from. ',
        code('readJson'),
        ' returns one parsed file; ',
        code('readJsonCollection'),
        ' returns an array of entries, each with a ',
        code('slug'),
        ' — from a directory of ',
        code('.json'),
        ' files (one per entry, slug from the filename), or from a single file holding an array of entries or an object keyed by slug.',
      ),
      codeBlock('src/blog/[slug].ht.js', s.jsonSources, 'javascript'),
      h3('Collection options'),
      ul(
        { class: 'docs-list' },
        li(
          code('slug'),
          ' — field name or function; defaults to the filename, the object key, or the entry’s own ',
          code('slug'),
          ' / ',
          code('id'),
        ),
        li(
          code('sort'),
          ' — field name (',
          code("'date'"),
          ' ascending, ',
          code("'-date'"),
          ' descending) or a compare function',
        ),
        li(
          code('recursive'),
          ' — include ',
          code('.json'),
          ' files in subdirectories, slugged by their path',
        ),
        li(code('root'), ' — directory relative paths resolve from'),
        li(
          code('cache'),
          ' — ',
          code("'auto'"),
          ' | ',
          code("'memory'"),
          ' | ',
          code("'none'"),
        ),
      ),
      p(
        'Reads are memoized per file, so a 500-page build parses each file once. The dev server revalidates against mtime instead, and reloads the browser when a JSON file a page read changes. Duplicate slugs, missing files, and malformed JSON fail the build, each named by path.',
      ),
    ],
  })
