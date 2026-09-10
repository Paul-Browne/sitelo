import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/zh.js'

export default () =>
  uiLayout({
    title: '标签页',
    description: '三种形态：链接，一个标签一个页面；就地切换的面板；以及由 URL 决定的面板。',
    activeHref: '/zh/ui/tabs',
    children: [
      p(
        '给每一项一个 ',
        code('href'),
        '，这些标签就是链接——一个标签对应一个页面，不用脚本，当前项带 ',
        code('aria-current'),
        '。给每一项一个 ',
        code('panel'),
        '，它们就变成一组单选按钮，面板就地切换，而且依然不用脚本。',
      ),
      p(
        '在静态站点上，链接形态通常才是对的：它给每个视图一个 URL，而且关掉 JavaScript 也照样能用。只有当内容不多、切换不该付出一次跳转成本时，才用面板形态。',
      ),

      h2('链接式标签'),
      p(
        '它们真的是链接——点一下就会跳转。下划线来自构建时的 ',
        code('active'),
        ' 或 ',
        code('value'),
        '，而不是这次点击，所以每个页面各自标出自己的那一项。链接式标签本身不会对 URL 作出反应：想要那样，就用下面就地切换的面板。',
      ),
      demo(`tabs({
  items: [
    { label: '面包屑', href: '/zh/ui/breadcrumbs' },
    { label: '标签页', href: '/zh/ui/tabs', active: true },
    { label: '分页', href: '/zh/ui/pagination' },
  ],
})`, { align: 'stretch' }),

      h2('面板式标签'),
      p(
        '标签就是一个 ',
        code('<label>'),
        '，对应一个被样式表藏起来的单选按钮；紧跟在选中单选按钮之后的面板，就是 CSS 显示的那一个。本页没有导入任何东西：切换，以及在标签之间用方向键移动，本来就是一组单选按钮会做的事。',
      ),
      demo(`tabs({
  value: 'install',
  items: [
    { id: 'install', label: '安装', panel: card({ variant: 'flat' }, cardBody(code('npm install sitelo javascript-to-html'))) },
    { id: 'use', label: '使用', panel: card({ variant: 'flat' }, cardBody(code("import * as ui from 'sitelo/ui'"))) },
    { id: 'build', label: '构建', panel: card({ variant: 'flat' }, cardBody(code('sitelo build'))) },
  ],
})`, { align: 'stretch' }),

      h2('可链接的标签'),
      p(
        '再给面板项一个带片段的 ',
        code('href'),
        '，单选按钮就让位给链接：URL 指名哪个标签，',
        code(':target'),
        ' 把它挑出来，紧跟其后的面板就显示出来，这个选择还能挺过刷新、分享链接和后退按钮。id 放在标签上而不是面板上，因为浏览器会把 URL 指名的元素滚到窗口顶端——放在面板上，就会把你刚点过的那排标签顶出屏幕。一个文档里只能有一个 ',
        code(':target'),
        '，所以这种形态适合一页只放一组标签。滚动本身取消不了：跟随片段就意味着移动窗口。能选的只是滚到哪里、停在哪儿——标签上的 id 和它的 ',
        code('scroll-margin-block-start'),
        ' 就是干这个的——用 ',
        code('scrollMargin'),
        ' 这个 prop 来设置，粘性页头至少要留出它自己的高度。',
      ),
      demo(`tabs({
  items: [
    { id: 'setup', label: '配置', href: '#tab-setup', panel: card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, '这个面板是 #tab-setup——把 URL 复制走，它还会回来。'))) },
    { id: 'deploy', label: '部署', href: '#tab-deploy', panel: card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, '而这个是 #tab-deploy。'))) },
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
      p('标签栏会横向滚动而不是换行，这样在手机上这一排也能保持原样。面板式标签则相反，会换行——每个面板都必须紧跟自己的标签，于是没有一排元素可供滚动。'),
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
        '面板形态是一组真正的单选按钮：标签是 ',
        code('<label>'),
        ' 元素，对应共用同一个 ',
        code('name'),
        ' 的单选按钮，所以读屏软件会念出选中的是几个里的哪一个，方向键、Home 和 End 也不用加载任何脚本就能用。可链接的那种形态只是普通链接，不带 ',
        code('aria-current'),
        '——它只会写死一次，第一次点击之后就不对了。它刻意不是 ARIA tablist——',
        code('aria-selected'),
        ' 只在服务端写一次，CSS 无法在你点击时让它保持为真。链接形态同样不是 tablist：会跳转的链接就是链接，给它们套上标签页语义等于谎报它们的行为。',
      ),

      h2('属性'),
      propsTable([
        ['items', 'Array', '[]', '字符串，或 { id, label, href, panel, active, disabled } 对象。'],
        ['value', 'string', '', '当前项的 id。没有就回退到 active，再回退到第一项。'],
        ['variant', "'underline' | 'pills'", "'underline'", '当前标签怎么标出来。'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", '当前标签的颜色。'],
        ['label', 'string', "'Tabs'", '这一组的无障碍名称。仅面板形态有效。'],
        ['name', 'string', '第一项的 id', '单选按钮组的 name。只有一页上有两组面板式标签时才需要。'],
        ['href', 'string', '', '在项上：要链接到的页面；或者与 panel 一起，给出为它命名的片段。'],
        ['scrollMargin', 'Space', "'md'", '窗口停在标签上方多远。仅 :target 形态有效。'],
      ]),
    ],
  })
