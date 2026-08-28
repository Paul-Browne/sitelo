import { a, h2, h3, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, pageCodeTabs } from '../lib/code.js'
import { examplesLayout } from '../lib/layout.js'
import { wordpressSnippets } from '../lib/snippets/examples-wordpress.js'

const s = wordpressSnippets('en')

export default () =>
  examplesLayout({
    title: 'WordPress',
    description:
      'Rip an entire WordPress site via the REST API — thousands of posts, statically generated with sitelo.',
    activeHref: '/examples/wordpress',
    children: [
      p(
        'Treat WordPress as a headless CMS and ',
        'rip the whole site',
        ': paginate through ',
        code('/wp-json/wp/v2/posts'),
        ', generate one HTML file per slug, and cache API responses between builds.',
      ),
      h2('What you get'),
      ul(
        { class: 'docs-list' },
        li('A home page listing recent posts'),
        li(code('/blog'), ' — full archive of every post'),
        li(
          code('/blog/[slug]'),
          ' — one static HTML page per post (works at thousands of posts)',
        ),
        li(
          code('fetchWithCache'),
          ' so rebuilds reuse WP responses instead of re-downloading everything',
        ),
      ),
      h2('Project layout'),
      codeBlock('project', s.structure, 'bash'),
      codeBlock('sitelo.config.js', s.config, 'javascript'),
      h2('1. Point at your WordPress site'),
      p(
        'The REST API is on by default in modern WordPress. Confirm it at ',
        code('https://your-site.com/wp-json/wp/v2/posts'),
        '.',
      ),
      p(
        'Set ',
        code('WP_URL'),
        ' in the environment (or hardcode it while experimenting):',
      ),
      codeBlock('.env', s.env, 'bash'),
      h2('2. Shared WordPress helpers'),
      p(
        code('getAllPosts()'),
        ' reads ',
        code('X-WP-TotalPages'),
        ' and walks every page (WordPress caps ',
        code('per_page'),
        ' at 100). Skip ',
        code('_embed'),
        ' while collecting slugs — only fetch embeds for individual posts.',
      ),
      codeBlock('src/lib/wordpress.js', s.wpLib, 'javascript'),
      h2('3. Home page'),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.homeTemplate,
        ht: s.homeHt,
        jsx: s.homeJsx,
      }),
      h2('4. Blog index'),
      p('Use ', code('getAllPosts()'), ' so the archive isn’t capped at 50–100 items.'),
      pageCodeTabs({
        file: 'src/blog/index.ht.js',
        template: s.blogIndexTemplate,
        ht: s.blogIndexHt,
        jsx: s.blogIndexJsx,
      }),
      h2('5. Rip every post into static pages'),
      p(
        code('generateStaticParams'),
        ' must return ',
        'every',
        ' slug you want in ',
        code('dist/'),
        '. Paginate the API here — don’t call ',
        code('getPosts({ perPage: 100 })'),
        ' once and stop.',
      ),
      pageCodeTabs({
        file: 'src/blog/[slug].ht.js',
        template: s.blogPostTemplate,
        ht: s.blogPostHt,
        jsx: s.blogPostJsx,
      }),
      h2('6. Build'),
      codeBlock('shell', s.build, 'bash'),
      p(
        'First build pages through WordPress once and fills the fetch cache. Later builds reuse cached list/detail responses (',
        code("cache: 'auto'"),
        ' → filesystem in production) until ',
        code('maxAge'),
        ' expires. Raise ',
        code('renderConcurrency'),
        ' in ',
        code('sitelo.config.js'),
        ' if you’re rendering thousands of post pages.',
      ),
      h2('Notes'),
      h3('HTML from WordPress'),
      p(
        code('title.rendered'),
        ' and ',
        code('content.rendered'),
        ' are HTML strings from WP. Drop them into your template as-is (as above), or sanitize them if you don’t fully trust the CMS.',
      ),
      h3('Private content'),
      p(
        'Public REST routes only expose published posts. For drafts or custom auth, pass headers into ',
        code('fetchWithCache'),
        '’s second argument (standard ',
        code('fetch'),
        ' init) and use a stable ',
        code('cacheKey'),
        '.',
      ),
      p(
        a({ href: '/docs/data' }, 'Data loading docs'),
        ' · ',
        a({ href: '/docs/routing' }, 'Routing docs'),
      ),
    ],
  })
