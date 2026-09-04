import { h2, p } from 'javascript-to-html'
import { code, codeBlock } from '../lib/code.js'
import { uiLayout } from '../lib/layout.js'
import { demo, propsTable, uiHead } from '../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Prose',
    description:
      'Style a block of HTML you did not write — Markdown output, a CMS field, an RSS description.',
    activeHref: '/ui/prose',
    extraHead: uiHead(),
    children: [
      p(
        'A Markdown renderer hands back bare tags: ',
        code('<h2>'),
        ', ',
        code('<p>'),
        ', ',
        code('<ul>'),
        ', ',
        code('<blockquote>'),
        ' — with no classes to hook onto. ',
        code('prose()'),
        ' wraps that HTML and styles it.',
      ),
      p(
        'It is the one deliberate exception in this library. Everywhere else, styling is scoped to ',
        code('su-'),
        ' classes precisely so it never touches markup you did not opt into; here there are no classes to target, so the rules match bare tags — but only inside the wrapper.',
      ),

      h2('Basic prose'),
      demo(`prose(
  '<h2>Getting started</h2>' +
  '<p>Write a function that returns HTML. Run <code>sitelo build</code>. Publish <code>dist/</code>.</p>' +
  '<ul><li>File-based routing</li><li>Build-time data</li><li>No client runtime</li></ul>'
)`, { align: 'stretch' }),

      h2('Everything it styles'),
      demo(`prose(
  '<h3>A heading</h3>' +
  '<p>Body copy with <a href="/docs">a link</a>, <strong>bold</strong>, and <code>inline code</code>.</p>' +
  '<blockquote><p>A pull quote, set apart from the text around it.</p></blockquote>' +
  '<ol><li>First</li><li>Second<ul><li>Nested</li></ul></li></ol>' +
  '<pre><code>export default () => "&lt;h1&gt;Hi&lt;/h1&gt;"</code></pre>' +
  '<table><thead><tr><th>Option</th><th>Default</th></tr></thead>' +
  '<tbody><tr><td>cleanUrls</td><td>true</td></tr><tr><td>outDir</td><td>dist</td></tr></tbody></table>' +
  '<hr>' +
  '<p>Press <kbd>⌘</kbd> <kbd>K</kbd> to search.</p>'
)`, { align: 'stretch' }),

      h2('Sizes'),
      demo(`stack({ gap: 'lg' },
  prose({ size: 'sm' }, '<p><strong>Small</strong> — for a card summary or a sidebar.</p>'),
  prose('<p><strong>Medium</strong> — the default, for article body copy.</p>'),
  prose({ size: 'lg' }, '<p><strong>Large</strong> — for a short, prominent introduction.</p>'),
)`, { align: 'stretch' }),

      h2('With a Markdown blog'),
      p(
        'The shape the blog example wants: render the Markdown at build time, wrap the result, and ship it.',
      ),
      codeBlock('src/blog/[slug].ht.js', `import { marked } from 'marked'
import { article, body, h1, html, head, title } from 'javascript-to-html'
import { container, prose, styles, text } from 'sitelo/ui'

export async function data({ params }) {
  return { post: await loadPost(params.slug) }
}

export default ({ data }) => html({ lang: 'en' },
  head(title(data.post.title), styles()),
  body(
    container({ size: 'sm' },
      h1(data.post.title),
      text({ variant: 'caption' }, data.post.date),
      // marked returns a string of HTML with no classes on it
      prose(marked.parse(data.post.markdown)),
    ),
  ),
)`, 'javascript'),

      h2('Components inside prose'),
      p(
        'Every prose rule excludes elements carrying an ',
        code('su-'),
        ' class, so a component dropped into a block of prose keeps its own styling instead of picking up article margins.',
      ),
      demo(`prose(
  '<p>Some rendered Markdown, and then a component:</p>',
  alert({ color: 'warning', title: 'Still a normal alert' },
    'It is not restyled by the prose block around it.'),
  '<p>And back to prose.</p>',
)`, { align: 'stretch' }),

      h2('A word about trust'),
      p(
        code('prose()'),
        ' renders its children as HTML — that is the whole point, and it is how ',
        code('javascript-to-html'),
        ' works throughout. If the HTML comes from somewhere you do not control, sanitize it before it gets here. A Markdown renderer with raw HTML disabled is usually enough.',
      ),

      h2('Props'),
      propsTable([
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Base font size; everything else scales in em from it.'],
        ['as', 'string', "'div'", 'Element to render, e.g. article.'],
      ]),
    ],
  })
