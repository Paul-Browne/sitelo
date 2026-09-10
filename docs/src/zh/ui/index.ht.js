import { a, div, h2, li, p, span, ul } from 'javascript-to-html'
import { code, uiLayout } from '../../lib/zh.js'
import { preview } from '../../lib/ui-demo.js'

/**
 * 每个组件页面一张卡片，分组方式和组件参考表完全一致。
 * 每段 `demo` 都会实时渲染进它自己的卡片里。
 */
const GROUPS = [
  ['布局', [
    ['/zh/ui/container', '容器', '居中且限宽的一栏页面内容。',
      `container({ size: 'sm', style: 'background: var(--su-surface-2); padding: 0.5rem; border-radius: 0.4rem' },
        text({ variant: 'caption', align: 'center' }, '居中'))`],
    ['/zh/ui/stack', '堆叠', '用间距令牌当间隙的 flex 行或列。',
      `stack({ direction: 'row', gap: 'sm' }, chip('一'), chip('二'), chip('三'))`],
    ['/zh/ui/grid', '网格', '能塞几列就排几列，不用媒体查询。',
      `grid({ min: '3.5rem', gap: 'xs' },
        chip({ size: 'sm' }, '1'), chip({ size: 'sm' }, '2'), chip({ size: 'sm' }, '3'), chip({ size: 'sm' }, '4'))`],
    ['/zh/ui/divider', '分割线', '区块之间的一条线，可带文字也可不带。',
      `div({ style: 'width: 100%' }, divider('或'))`],
    ['/zh/ui/aspect-ratio', '宽高比', '把盒子固定成某个形状，加载时页面就不会跳。',
      `aspectRatio({ ratio: '16 / 9', style: 'width: 6rem; background: var(--su-surface-2); border-radius: 0.4rem' }, '')`],
    ['/zh/ui/grain', '颗粒', '给任何东西铺一层胶片颗粒，让一大片纯色不再发平。',
      `grain({ intensity: 'strong', style: 'width: 100%; background: var(--su-surface-2); padding: 0.75rem; border-radius: 0.4rem' },
        text({ variant: 'caption', align: 'center' }, '带颗粒'))`],
    ['/zh/ui/card', '卡片', '承载成组内容的一块面，含头部、主体和页脚。',
      `card({ variant: 'flat', style: 'width: 100%' }, cardBody(text({ variant: 'small' }, '一张卡片')))`],
  ]],
  ['排版', [
    ['/zh/ui/typography', '排版', '会自己挑元素的字号体系。',
      `stack({ gap: 'none' }, text({ variant: 'h5', as: 'div' }, '标题'), text({ variant: 'caption', tone: 'muted' }, '说明'))`],
    ['/zh/ui/prose', '富文本', '给来自 Markdown 或 CMS 的原始 HTML 上样式。',
      `prose({ size: 'sm', style: 'text-align: left' }, '<p><strong>一个标题</strong></p><p>还有一段。</p>')`],
    ['/zh/ui/link', '链接', '带样式的锚点，并附上外链该有的属性。',
      `text({ variant: 'small' }, '读一读', link({ href: '/zh/docs' }, '文档'), '。')`],
    ['/zh/ui/icons', '图标', '同一套网格上的 99 个图形，尺寸和颜色随周围文字。',
      `stack({ direction: 'row', gap: 'sm', align: 'center' },
        icon('check'), icon('search'), icon('heart'), icon('zap'), icon('settings'))`],
  ]],
  ['输入', [
    ['/zh/ui/button', '按钮', '五种变体、五种颜色、三种尺寸。',
      `stack({ direction: 'row', gap: 'sm' }, button({ size: 'sm' }, '保存'), button({ size: 'sm', variant: 'outline' }, '取消'))`],
    ['/zh/ui/button-group', '按钮组', '把几个按钮拼成一个控件。',
      `buttonGroup({ label: '预览' },
        button({ size: 'sm', variant: 'outline', color: 'neutral' }, '一'),
        button({ size: 'sm', variant: 'outline', color: 'neutral' }, '二'))`],
    ['/zh/ui/text-field', '文本框', '标签、控件、帮助文本和错误信息，全都接好。',
      `textField({ label: '邮箱', name: 'g-email', size: 'sm', placeholder: 'ada@example.com' })`],
    ['/zh/ui/select', '下拉选择', '原生 select，样式配套。',
      `selectField({ label: '主题', name: 'g-theme', size: 'sm', options: ['浅色', '深色'], value: '深色' })`],
    ['/zh/ui/checkbox', '复选框', '真正的 input，用 CSS 装扮而不是替换掉。',
      `stack({ gap: 'sm' }, checkbox({ label: 'Sitemap', checked: true }), checkbox({ label: 'RSS 订阅' }))`],
    ['/zh/ui/radio', '单选组', '几个里挑一个，共用一个 name 的单选钮。',
      `choiceGroup({ name: 'g-plan', direction: 'row', value: 'pro', options: ['免费', 'pro'] })`],
    ['/zh/ui/switch', '开关', '给「一拨就生效」的设置用的开关。',
      `stack({ gap: 'sm' }, toggle({ label: '公开', checked: true }), toggle({ label: '草稿' }))`],
    ['/zh/ui/slider', '滑块', '原生 range 输入，样式配套。',
      `div({ style: 'width: 100%' }, slider({ value: 60, 'aria-label': '预览' }))`],
    ['/zh/ui/toggle-button', '切换按钮', '一个会保持按下状态的按钮。',
      `stack({ direction: 'row', gap: 'xs' }, toggleButton({ size: 'sm', pressed: true }, '开'), toggleButton({ size: 'sm' }, '关'))`],
    ['/zh/ui/toggle-group', '切换组', '分段控件，可以是按钮，也可以是链接。',
      `toggleGroup({ size: 'sm', label: '预览', value: 'b', items: ['a', 'b', 'c'] })`],
  ]],
  ['数据展示', [
    ['/zh/ui/avatar', '头像', '有图就用图，没图就用姓名首字母。',
      `avatarGroup({ max: 3 }, avatar({ name: 'Ada L' }), avatar({ name: 'Grace H' }), avatar({ name: 'Alan T' }), avatar({ name: 'Barbara L' }))`],
    ['/zh/ui/badge', '徽标', '别在角上的一个计数或小圆点。',
      `badge({ content: 12 }, button({ size: 'sm', variant: 'soft', color: 'neutral' }, '收件箱'))`],
    ['/zh/ui/chip', '标签片', '一个标签、一个状态、一个筛选项。',
      `stack({ direction: 'row', gap: 'xs' }, chip({ color: 'success', dot: true }, '通过'), chip({ color: 'neutral' }, '静态'))`],
    ['/zh/ui/tooltip', '提示框', '悬停和聚焦时的提示，完全用 CSS 画出来。',
      `tooltip({ content: '不需要脚本' }, button({ size: 'sm', variant: 'outline', color: 'neutral' }, '把鼠标放上来'))`],
    ['/zh/ui/table', '表格', '由数据生成的行列，外面套着滚动容器。',
      `table({ dense: true, columns: [{ key: 'p', header: '页面' }, { key: 's', header: '大小', align: 'end' }],
        rows: [{ p: '/', s: '4.1 kB' }, { p: '/docs', s: '12.7 kB' }] })`],
    ['/zh/ui/list', '列表', '两侧可以各放一样东西的行。',
      `list({ plain: true }, listItem({ title: '路由', description: '基于文件' }))`],
    ['/zh/ui/figure', '图注', '一张图和它的说明，合成一个 figure。',
      `figure({ src: '/logo.svg', alt: '', caption: '一段说明', style: 'width: 7rem' })`],
  ]],
  ['反馈', [
    ['/zh/ui/alert', '提示', '图标和 ARIA 角色都跟着颜色走的一条消息。',
      `alert({ color: 'success' }, '已部署。')`],
    ['/zh/ui/empty', '空状态', '列表在还没有内容时的样子。',
      `empty({ title: '这里什么都没有', style: 'padding: 0' })`],
    ['/zh/ui/progress', '进度', '已知进度用进度条，其余用加载转圈。',
      `div({ style: 'width: 100%' }, progress({ value: 62 }))`],
    ['/zh/ui/skeleton', '骨架屏', '照着即将到来的内容形状做的占位。',
      `div({ style: 'width: 100%' }, skeleton({ lines: 3 }))`],
    ['/zh/ui/toast', '轻提示', '由脚本添加的一条转瞬即逝的消息。',
      `stack({ direction: 'row', gap: 'xs' }, chip({ size: 'sm', color: 'success' }, '已保存。'))`],
  ]],
  ['导航', [
    ['/zh/ui/breadcrumbs', '面包屑', '一条以当前页面收尾的层级路径。',
      `breadcrumbs({ items: [{ label: '文档', href: '/zh/docs' }, { label: 'UI' }] })`],
    ['/zh/ui/pagination', '分页', '开窗显示的页码，而且是真正的链接。',
      `pagination({ page: 2, count: 5, href: (page) => '/zh/ui#p' + page })`],
    ['/zh/ui/tabs', '标签页', '链接式，一个标签一个页面——或者就地切换的面板。',
      `tabs({ variant: 'pills', items: [{ label: '一', href: '/zh/ui#t1', active: true }, { label: '二', href: '/zh/ui#t2' }] })`],
    ['/zh/ui/app-bar', '应用栏', '一边是品牌，另一边是导航和操作。',
      `appBar({ brand: 'sitelo', style: 'width: 100%; min-height: 2.5rem' }, appBarSpacer(), appBarActions(chip({ size: 'sm' }, 'v2')))`],
    ['/zh/ui/theme-toggle', '主题切换', '浅色与深色，进页面时不会闪。',
      `themeToggle()`],
  ]],
  ['浮层', [
    ['/zh/ui/modal', '模态框', '基于 popover API 的对话框——全程没有脚本。',
      `button({ size: 'sm', variant: 'outline', color: 'neutral' }, '打开模态框')`],
    ['/zh/ui/drawer', '抽屉', '从边缘滑入的面板，用的是同样的 popover 机制。',
      `button({ size: 'sm', variant: 'outline', color: 'neutral' }, '打开抽屉')`],
    ['/zh/ui/menu', '菜单', '基于 details 的下拉菜单，开合都是白送的。',
      `chip({ color: 'neutral' }, '操作 ▾')`],
    ['/zh/ui/accordion', '手风琴', '可折叠的区块，包括互斥模式。',
      `div({ style: 'width: 100%' }, accordion({ items: [{ title: '一个问题' }] }))`],
    ['/zh/ui/collapsible', '折叠面板', '单独一个「展开更多」，没有手风琴那套外包装。',
      `collapsible({ trigger: '展开更多' }, '不点开就一直藏着。')`],
  ]],
  ['页面区块', [
    ['/zh/ui/hero', '首屏区块', '落地页最上面那块：标题、说明、行动按钮。',
      `stack({ gap: 'xs', align: 'center' }, text({ variant: 'h6', as: 'div' }, '一句标题'), text({ variant: 'caption', tone: 'muted' }, '再来一句说明。'))`],
    ['/zh/ui/footer', '页脚', '几列链接，下面再来一行。',
      `stack({ gap: 'xs', style: 'width: 100%' }, text({ variant: 'overline' }, '文档'), text({ variant: 'caption', tone: 'muted' }, '指南 · 组件'))`],
    ['/zh/ui/stat', '数据指标', '一个值得一看的数字，以及它的含义。',
      `stat({ label: '页面数', value: '204', change: '+8', color: 'success' })`],
    ['/zh/ui/steps', '步骤', '带编号的流程，做完的都会标成已完成。',
      `div({ style: 'width: 100%' }, steps({ direction: 'vertical', current: 1, items: ['安装', '构建'] }))`],
    ['/zh/ui/timeline', '时间线', '沿着一条线依次排开的条目。',
      `div({ style: 'width: 100%' }, timeline({ items: [{ time: 'v2.7', title: '页面区块', color: 'primary' }] }))`],
    ['/zh/ui/mockup', '设备外框', '把截图放进浏览器、窗口、手机或终端里。',
      `mockup({ variant: 'browser', url: 'sitelo.dev', style: 'width: 100%' }, div({ style: 'height: 2.5rem; background: var(--su-surface-2)' }))`],
  ]],
  ['样式', [
    ['/zh/ui/theming', '主题定制', '一次调用改掉每一种颜色、圆角和字体。',
      `stack({ direction: 'row', gap: 'xs' },
        ...['primary', 'success', 'warning', 'danger'].map((color) =>
          div({ style: 'width: 1.5rem; height: 1.5rem; border-radius: 0.3rem; background: var(--su-' + color + ')' })))`],
  ]],
]

/** 一张画廊卡片。预览是惰性的，名字是一条被撑开的链接。 */
const galleryCard = ([href, name, summary, source]) =>
  li(
    /*
     * 这里用 div 而不是锚点：这些预览里有真正的按钮和输入框，而可交互
     * 内容不能嵌在链接里面。改由名字上的锚点撑满整张卡片，`inert` 则把
     * 演示里的控件移出 Tab 顺序和无障碍树。
     */
    div(
      { class: 'ui-gallery-card' },
      div(
        { class: 'ui-gallery-preview', 'data-pagefind-ignore': '', inert: true },
        preview(source),
      ),
      a({ class: 'ui-gallery-name', href }, name),
      span({ class: 'ui-gallery-summary' }, summary),
    ),
  )

export default () =>
  uiLayout({
    title: 'sitelo UI',
    pageTitle: 'sitelo UI —— 给 sitelo 用的组件',
    description:
      '给 sitelo 用的组件库：按钮、卡片、表单、表格和模态框，全都是返回 HTML 的函数。',
    activeHref: '/zh/ui',
    children: [
      p(
        'sitelo-ui 是给 sitelo 用的组件库。每个组件都是一个返回 HTML 字符串的函数，因此可以直接嵌进你正在写的那个页面——没有编译器、没有运行时、也不用水合。',
      ),
      p(
        '本节里的每个示例，都由渲染其外围页面的同一次构建渲染出来。你看到的就是下面那段代码产出的东西；它也会跟着本站的浅色与深色主题走，因为 sitelo-ui 读的是和文档同一个 ',
        code('data-theme'),
        ' 属性。',
      ),

      ...GROUPS.flatMap(([group, components]) => [
        h2(group),
        ul({ class: 'ui-gallery' }, ...components.map(galleryCard)),
      ]),

      h2('接入方式'),
      p(
        '两行：导入组件，再把 ',
        code('styles()'),
        ' 放进 head。',
        a({ href: '/zh/docs/ui' }, '文档里的「组件」页面'),
        '讲了安装、主题、调用约定和可选的客户端运行时，并用一张表列出了全部导出。',
      ),
      p(
        '仓库里的 ',
        code('examples/ui'),
        ' 目录会把整套组件渲染在同一个页面上。',
      ),
    ],
  })
