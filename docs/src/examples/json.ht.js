import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, pageCodeTabs } from '../lib/code.js'
import { examplesLayout } from '../lib/layout.js'
import { jsonSnippets } from '../lib/snippets/examples-json.js'

const s = jsonSnippets('en')

export default () =>
  examplesLayout({
    title: 'Local JSON',
    description:
      'A product catalogue built entirely from JSON files in the repo — no API, no database.',
    activeHref: '/examples/json',
    children: [
      p(
        'Content that lives in the repo as JSON, turned into static pages by ',
        code('sitelo/data'),
        '. No API, no database, and no client-side JavaScript. Full source in ',
        a(
          {
            href: 'https://github.com/paul-browne/sitelo/tree/main/examples/json',
            rel: 'noopener',
          },
          'examples/json',
        ),
        '.',
      ),
      h2('What you get'),
      ul(
        { class: 'docs-list' },
        li('A home page listing every category and product'),
        li(
          code('/products/[slug]'),
          ' — one static page per file in ',
          code('data/products/'),
        ),
        li(
          code('/categories/[slug]'),
          ' — one page per key in ',
          code('data/categories.json'),
        ),
        li('Adding a JSON file adds a page; no route to register'),
        li('Zero JS shipped — the files are read in Node at build time'),
      ),
      h2('Project layout'),
      codeBlock('project', s.structure, 'bash'),
      p(
        'Data lives outside ',
        code('src/'),
        ', so sitelo never treats it as pages or assets.',
      ),
      h2('1. Put the content in data/'),
      p(
        'One file per product. The filename is the slug, so ',
        code('aeron-chair.json'),
        ' becomes ',
        code('/products/aeron-chair'),
        ' — nothing in the file has to say so:',
      ),
      codeBlock('data/products/aeron-chair.json', s.product, 'json'),
      p(
        'Categories are a single file instead: an object keyed by slug, which ',
        code('readJsonCollection'),
        ' reads as a collection just the same.',
      ),
      codeBlock('data/categories.json', s.categories, 'json'),
      h2('2. Read it in one place'),
      p(
        'A small server-only module wraps the reads. Nothing in the HTML references it, so it never ships to the browser — and because ',
        code('sitelo/data'),
        ' memoizes per file, every page calling these helpers still parses each JSON file once for the whole build.',
      ),
      codeBlock('src/lib/catalogue.js', s.lib, 'javascript'),
      h2('3. List everything on the home page'),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.indexTemplate,
        ht: s.indexHt,
        jsx: s.indexJsx,
      }),
      h2('4. One page per JSON file'),
      p(
        code('generateStaticParams'),
        ' returns a slug per file at build time; ',
        code('data()'),
        ' loads the matching entry for each page.',
      ),
      pageCodeTabs({
        file: 'src/products/[slug].ht.js',
        template: s.slugTemplate,
        ht: s.slugHt,
        jsx: s.slugJsx,
      }),
      h2('5. Edit and watch'),
      codeBlock('terminal', s.build, 'bash'),
      p(
        'Under ',
        code('sitelo'),
        ', changing a price reloads the open page — the dev server watches the JSON files pages actually read. Duplicate slugs, missing files, and malformed JSON fail the build with the offending path named.',
      ),
      p(
        a({ href: '/docs/data' }, 'Data loading docs'),
        ' · ',
        a({ href: '/docs/routing' }, 'Routing docs'),
        ' · ',
        a({ href: '/docs/configuration' }, 'Configuration docs'),
      ),
    ],
  })
