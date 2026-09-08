import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/zh.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: '标签页',
    description: '两种形态：一种是链接，一个标签一个页面；另一种是就地切换的面板。',
    activeHref: '/zh/ui/tabs',
    extraHead: uiHead(),
    children: [
      p(
        '给每一项一个 ',
        code('href'),
        '，这些标签就是链接——一个标签对应一个页面，不用脚本，当前项带 ',
        code('aria-current'),
        '。给每一项一个 ',
        code('panel'),
        '，它们就变成真正的 tablist，面板会就地切换。',
      ),
      p(
        '在静态站点上，链接形态通常才是对的：它给每个视图一个 URL，而且关掉 JavaScript 也照样能用。只有当内容不多、切换不该付出一次跳转成本时，才用面板形态。',
      ),

      h2('链接式标签'),
      p('完全没有脚本。哪个是当前项，由你标出来。'),
      demo(`tabs({
  items: [
    { label: '概览', href: '#overview', active: true },
    { label: '安装', href: '#installation' },
    { label: 'API', href: '#api' },
  ],
})`, { align: 'stretch' }),

      h2('面板式标签'),
      p(
        '每个标签会在第一次点击时导入自己的处理函数——',
        code("onclick=\"import('/su/tabs.js').then(m=>m.select(this))\""),
        '——所以这些是真能切换的，方向键也能用，而本页并没有导入任何东西。在那个模块到达之前，显示的就是服务端标记为当前的那个面板。',
      ),
      demo(`tabs({
  value: 'install',
  items: [
    { id: 'install', label: '安装', panel: card({ variant: 'flat' }, cardBody(code('npm install sitelo javascript-to-html'))) },
    { id: 'use', label: '使用', panel: card({ variant: 'flat' }, cardBody(code("import * as ui from 'sitelo/ui'"))) },
    { id: 'build', label: '构建', panel: card({ variant: 'flat' }, cardBody(code('sitelo build'))) },
  ],
})`, { align: 'stretch' }),

      h2('胶囊样式'),
      demo(`stack({ gap: 'lg' },
  tabs({
    variant: 'pills',
    items: [
      { label: '全部', href: '#all', active: true },
      { label: '指南', href: '#guides' },
      { label: '示例', href: '#examples' },
    ],
  }),
  tabs({
    variant: 'pills',
    value: 'js',
    items: [
      { id: 'js', label: 'JavaScript', panel: card({ variant: 'flat' }, cardBody(code('src/index.ht.js'))) },
      { id: 'ts', label: 'TypeScript', panel: card({ variant: 'flat' }, cardBody(code('src/index.ht.ts'))) },
      { id: 'jsx', label: 'JSX', panel: card({ variant: 'flat' }, cardBody(code('src/index.ht.jsx'))) },
    ],
  }),
)`, { align: 'stretch' }),

      h2('颜色'),
      demo(`stack({ gap: 'lg' },
  tabs({ color: 'primary', items: [{ label: 'Primary', href: '#p', active: true }, { label: '其他', href: '#p2' }] }),
  tabs({ color: 'neutral', items: [{ label: 'Neutral', href: '#n', active: true }, { label: '其他', href: '#n2' }] }),
  tabs({ color: 'danger', items: [{ label: 'Danger', href: '#d', active: true }, { label: '其他', href: '#d2' }] }),
)`, { align: 'stretch' }),

      h2('很多标签'),
      p('标签栏会横向滚动而不是换行，这样在手机上这一排也能保持原样。'),
      demo(`tabs({
  items: [
    '概览', '路由', '数据', '资源', '图片', '区块', 'TypeScript', 'CLI', '部署',
  ].map((label, index) => ({ label, href: '#many-' + index, active: index === 0 })),
})`, { align: 'stretch' }),

      h2('禁用'),
      demo(`tabs({
  value: 'now',
  items: [
    { id: 'now', label: '已可用', panel: card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, '这个是能用的。'))) },
    { id: 'soon', label: '即将推出', disabled: true, panel: card({ variant: 'flat' }, cardBody('')) },
  ],
})`, { align: 'stretch' }),

      h2('无障碍'),
      p(
        '面板形态会渲染一个像样的 ',
        code('role="tablist"'),
        '，带上 ',
        code('aria-selected'),
        '、',
        code('aria-controls'),
        ' 和轮转的 ',
        code('tabindex'),
        '。脚本再补上方向键、Home 和 End。链接形态刻意不是 tablist——会跳转的链接就是链接，给它们套上标签页语义等于谎报它们的行为。',
      ),

      h2('属性'),
      propsTable([
        ['items', 'Array', '[]', '字符串，或 { id, label, href, panel, active, disabled } 对象。'],
        ['value', 'string', '', '当前项的 id。没有就回退到 active，再回退到第一项。'],
        ['variant', "'underline' | 'pills'", "'underline'", '当前标签怎么标出来。'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", '当前标签的颜色。'],
        ['label', 'string', "'Tabs'", 'tablist 的无障碍名称。仅面板形态有效。'],
      ]),
    ],
  })
