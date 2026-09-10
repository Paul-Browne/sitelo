import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/zh.js'

export default () =>
  uiLayout({
    title: '标签片',
    description: '一小块紧凑的标记——标签、状态、筛选项或计数。',
    activeHref: '/zh/ui/chip',
    children: [
      p(
        '标签片是些细碎的元信息：博文的标签、构建的状态、页面的分类。它默认是行内元素，所以排成一行时需要配一个带 ',
        code('wrap'),
        ' 的 ',
        code('stack'),
        '。',
      ),

      h2('基础标签片'),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  chip('静态'),
  chip('vite'),
  chip('零运行时'),
)`),

      h2('颜色'),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  chip({ color: 'primary' }, 'primary'),
  chip({ color: 'neutral' }, 'neutral'),
  chip({ color: 'success' }, 'success'),
  chip({ color: 'warning' }, 'warning'),
  chip({ color: 'danger' }, 'danger'),
)`),

      h2('变体'),
      demo(`stack({ gap: 'sm' },
  stack({ direction: 'row', gap: 'sm', wrap: true },
    chip({ variant: 'soft', color: 'primary' }, 'soft'),
    chip({ variant: 'soft', color: 'success' }, 'soft'),
    chip({ variant: 'soft', color: 'danger' }, 'soft'),
  ),
  stack({ direction: 'row', gap: 'sm', wrap: true },
    chip({ variant: 'outline', color: 'primary' }, 'outline'),
    chip({ variant: 'outline', color: 'success' }, 'outline'),
    chip({ variant: 'outline', color: 'danger' }, 'outline'),
  ),
  stack({ direction: 'row', gap: 'sm', wrap: true },
    chip({ variant: 'solid', color: 'primary' }, 'solid'),
    chip({ variant: 'solid', color: 'success' }, 'solid'),
    chip({ variant: 'solid', color: 'danger' }, 'solid'),
  ),
)`, { align: 'start' }),

      h2('尺寸'),
      demo(`stack({ direction: 'row', gap: 'sm', align: 'center', wrap: true },
  chip({ size: 'sm' }, '小'),
  chip({ size: 'md' }, '中'),
  chip({ size: 'lg' }, '大'),
)`),

      h2('状态圆点'),
      p(
        '前面加个圆点，标签片就成了状态标识。光靠颜色传达不了含义，所以文字要留着。',
      ),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  chip({ color: 'success', dot: true }, '构建通过'),
  chip({ color: 'warning', dot: true }, '排队中'),
  chip({ color: 'danger', dot: true }, '失败'),
  chip({ color: 'neutral', dot: true }, '已跳过'),
)`),

      h2('链接'),
      p(
        '给标签片一个 ',
        code('href'),
        '，它就会渲染成锚点——这正是标签列表的常见形态，每个标签对应一个页面。',
      ),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  chip({ href: '/zh/docs/routing', color: 'primary' }, '路由'),
  chip({ href: '/zh/docs/data', color: 'primary' }, '数据'),
  chip({ href: '/zh/docs/islands', color: 'primary' }, '区块'),
)`),

      h2('作为按钮'),
      p(
        code('as'),
        ' 可以换掉元素，用于「切换而非跳转」的筛选项。',
      ),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  chip({ as: 'button', variant: 'solid', color: 'primary', 'aria-pressed': 'true' }, '全部'),
  chip({ as: 'button', variant: 'outline', color: 'neutral', 'aria-pressed': 'false' }, '指南'),
  chip({ as: 'button', variant: 'outline', color: 'neutral', 'aria-pressed': 'false' }, '示例'),
)`),

      h2('在表格里'),
      demo(`table({
  striped: true,
  columns: [
    { key: 'page', header: '页面' },
    { header: '状态', align: 'end', render: (row) =>
      chip({ size: 'sm', dot: true, color: row.ok ? 'success' : 'danger' }, row.ok ? '正常' : '失败') },
  ],
  rows: [
    { page: '/', ok: true },
    { page: '/docs', ok: true },
    { page: '/blog/[slug]', ok: false },
  ],
})`, { align: 'stretch' }),

      h2('属性'),
      propsTable([
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'neutral'", '取用哪一套配色。'],
        ['variant', "'soft' | 'outline' | 'solid'", "'soft'", '标签片的视觉分量。'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", '内边距和文字大小。'],
        ['href', 'string', '', '渲染成锚点。'],
        ['dot', 'boolean', 'false', '在文字前加一个状态圆点。'],
        ['as', 'string', "'span'", '没有 href 时渲染成哪个元素。'],
      ]),
    ],
  })
