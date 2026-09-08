import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/zh.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: '富文本',
    description: '给不是你写的那段 HTML 上样式——Markdown 的产物、CMS 字段、RSS 里的描述。',
    activeHref: '/zh/ui/prose',
    extraHead: uiHead(),
    children: [
      p(
        'Markdown 渲染器吐回来的是光秃秃的标签：',
        code('<h2>'),
        '、',
        code('<p>'),
        '、',
        code('<ul>'),
        '、',
        code('<blockquote>'),
        '——一个可供挂钩的 class 都没有。',
        code('prose()'),
        ' 把这段 HTML 包起来，并给它上样式。',
      ),
      p(
        '这是本库唯一一处有意为之的例外。别的地方样式都限定在 ',
        code('su-'),
        ' 类上，正是为了绝不碰你没主动选择的标记；而这里没有 class 可以瞄准，于是规则只好落到光标签上——但仅限于这层包裹之内。',
      ),

      h2('基础富文本'),
      demo(`prose(
  '<h2>快速开始</h2>' +
  '<p>写一个返回 HTML 的函数。跑 <code>sitelo build</code>。发布 <code>dist/</code>。</p>' +
  '<ul><li>基于文件的路由</li><li>构建期数据</li><li>没有客户端运行时</li></ul>'
)`, { align: 'stretch' }),

      h2('它会管到的所有元素'),
      demo(`prose(
  '<h3>一个标题</h3>' +
  '<p>正文里有<a href="/zh/docs">一个链接</a>、<strong>加粗</strong>和<code>行内代码</code>。</p>' +
  '<blockquote><p>一段被单独拎出来的引文，与周围的文字分开。</p></blockquote>' +
  '<ol><li>第一</li><li>第二<ul><li>嵌套的一项</li></ul></li></ol>' +
  '<pre><code>export default () => "&lt;h1&gt;你好&lt;/h1&gt;"</code></pre>' +
  '<table><thead><tr><th>选项</th><th>默认值</th></tr></thead>' +
  '<tbody><tr><td>cleanUrls</td><td>true</td></tr><tr><td>outDir</td><td>dist</td></tr></tbody></table>' +
  '<hr>' +
  '<p>按 <kbd>⌘</kbd> <kbd>K</kbd> 搜索。</p>'
)`, { align: 'stretch' }),

      h2('尺寸'),
      demo(`stack({ gap: 'lg' },
  prose({ size: 'sm' }, '<p><strong>小</strong>——用于卡片摘要或侧栏。</p>'),
  prose('<p><strong>中</strong>——默认值，用于文章正文。</p>'),
  prose({ size: 'lg' }, '<p><strong>大</strong>——用于简短而醒目的引言。</p>'),
)`, { align: 'stretch' }),

      h2('配 Markdown 博客'),
      p(
        '博客示例想要的形态：在构建时渲染 Markdown，把结果包起来，然后发出去。',
      ),
      codeBlock('src/blog/[slug].ht.js', `import { marked } from 'marked'
import { article, body, h1, html, head, title } from 'javascript-to-html'
import { container, prose, styles, text } from 'sitelo/ui'

export async function data({ params }) {
  return { post: await loadPost(params.slug) }
}

export default ({ data }) => html({ lang: 'zh-Hans' },
  head(title(data.post.title), styles()),
  body(
    container({ size: 'sm' },
      h1(data.post.title),
      text({ variant: 'caption' }, data.post.date),
      // marked 返回的是一串不带任何 class 的 HTML
      prose(marked.parse(data.post.markdown)),
    ),
  ),
)`, 'javascript'),

      h2('富文本里的组件'),
      p(
        '所有富文本规则都排除带 ',
        code('su-'),
        ' 类的元素，所以扔进富文本块里的组件会保留自己的样式，而不是沾上文章的外边距。',
      ),
      demo(`prose(
  '<p>先是一段渲染好的 Markdown，然后来个组件：</p>',
  alert({ color: 'warning', title: '它仍是一条普通提示' },
    '外面包着的富文本块并不会改它的样式。'),
  '<p>然后又回到富文本。</p>',
)`, { align: 'stretch' }),

      h2('关于信任的一句话'),
      p(
        code('prose()'),
        ' 会把子元素当作 HTML 渲染——这正是它的用意，',
        code('javascript-to-html'),
        ' 通篇都是这么工作的。如果这段 HTML 来自你控制不了的地方，请在它到这儿之前先做净化。通常，一个关掉了原始 HTML 的 Markdown 渲染器就够了。',
      ),

      h2('属性'),
      propsTable([
        ['size', "'sm' | 'md' | 'lg'", "'md'", '基准字号；其余一切都以 em 从它开始缩放。'],
        ['as', 'string', "'div'", '渲染成哪个元素，比如 article。'],
      ]),
    ],
  })
