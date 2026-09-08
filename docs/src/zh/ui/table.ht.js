import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/zh.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: '表格',
    description: '由数据生成的行与列，外面套一层滚动容器，宽表格就不会把页面撑坏。',
    activeHref: '/zh/ui/table',
    extraHead: uiHead(),
    children: [
      p(
        '传入 ',
        code('columns'),
        ' 和 ',
        code('rows'),
        '，表格连表头一起自己搭好。它被包在一个横向滚动容器里，所以列数超出手机可显示范围的表格会自己滚动，而不是把页面撑开。它以 ',
        code('table'),
        ' 和 ',
        code('dataTable'),
        ' 两个名字导出。',
      ),

      h2('基础表格'),
      demo(`table({
  columns: [
    { key: 'page', header: '页面' },
    { key: 'size', header: '大小' },
    { key: 'time', header: '渲染耗时' },
  ],
  rows: [
    { page: '/', size: '4.1 kB', time: '12 毫秒' },
    { page: '/docs', size: '12.7 kB', time: '31 毫秒' },
    { page: '/examples', size: '9.4 kB', time: '24 毫秒' },
  ],
})`, { align: 'stretch' }),

      h2('对齐'),
      p('数字靠列尾对齐会更好读。'),
      demo(`table({
  columns: [
    { key: 'page', header: '页面' },
    { key: 'bytes', header: '字节', align: 'end' },
    { key: 'gzip', header: 'Gzip', align: 'end' },
  ],
  rows: [
    { page: '/', bytes: '4,112', gzip: '1,204' },
    { page: '/docs', bytes: '12,704', gzip: '3,910' },
    { page: '/examples', bytes: '9,388', gzip: '2,744' },
  ],
})`, { align: 'stretch' }),

      h2('自定义单元格'),
      p(
        '带 ',
        code('render'),
        ' 函数的列会拿到整行数据，并返回单元格里该放的东西——标签片、链接，或者格式化好的数字。',
      ),
      demo(`table({
  columns: [
    { header: '页面', render: (row) => link({ href: row.href }, row.page) },
    { key: 'size', header: '大小', align: 'end' },
    { header: '状态', align: 'end', render: (row) =>
      chip({ size: 'sm', dot: true, color: row.ok ? 'success' : 'danger' }, row.ok ? '正常' : '失败') },
  ],
  rows: [
    { page: '/docs/routing', href: '/zh/docs/routing', size: '18.2 kB', ok: true },
    { page: '/docs/data', href: '/zh/docs/data', size: '21.7 kB', ok: true },
    { page: '/docs/islands', href: '/zh/docs/islands', size: '24.1 kB', ok: false },
  ],
})`, { align: 'stretch' }),

      h2('样式'),
      p(
        code('striped'),
        ' 给行加上隔行底色，',
        code('hover'),
        ' 高亮指针所在的行，',
        code('dense'),
        ' 则收紧内边距，适合行数很多的表格。',
      ),
      demo(`stack({ gap: 'lg' },
  table({
    striped: true,
    caption: '斑马纹',
    columns: [{ key: 'name', header: '名称' }, { key: 'value', header: '数值', align: 'end' }],
    rows: [{ name: '页面', value: '169' }, { name: '资源', value: '208' }, { name: '合计', value: '9.5 MB' }],
  }),
  table({
    hover: true,
    dense: true,
    caption: '悬停高亮 + 紧凑',
    columns: [{ key: 'name', header: '名称' }, { key: 'value', header: '数值', align: 'end' }],
    rows: [{ name: '页面', value: '169' }, { name: '资源', value: '208' }, { name: '合计', value: '9.5 MB' }],
  }),
)`, { align: 'stretch' }),

      h2('表格标题'),
      p(
        '标题会为那些绕过周围文字直接来到表格的人说明这是什么——只要表格不是紧跟在一个已经交代清楚的标题下面，就值得加上。',
      ),
      demo(`table({
  caption: '构建产出，最新在前',
  columns: [
    { key: 'commit', header: '提交' },
    { key: 'when', header: '时间' },
    { key: 'pages', header: '页面数', align: 'end' },
  ],
  rows: [
    { commit: '94a837a', when: '4 分钟前', pages: '169' },
    { commit: 'dcfaaae', when: '2 小时前', pages: '161' },
  ],
})`, { align: 'stretch' }),

      h2('由数据生成'),
      p(
        '行数据就是一个普通数组，所以通常直接就是 ',
        code('data()'),
        ' 已经加载好的东西，中间不需要任何适配层。',
      ),
      demo(`return (() => {
  const posts = [
    { title: '你好，世界', date: '2026-01-14', reads: 1204 },
    { title: '静态优先', date: '2026-02-02', reads: 890 },
    { title: '没有运行时', date: '2026-03-19', reads: 2317 },
  ]

  return table({
    hover: true,
    columns: [
      { key: 'title', header: '文章' },
      { key: 'date', header: '发布于' },
      { header: '阅读量', align: 'end', render: (post) => post.reads.toLocaleString('zh') },
    ],
    rows: posts,
  })
})()`, { align: 'stretch' }),

      h2('自己写标记'),
      p(
        '省略 ',
        code('columns'),
        '，表格就改为渲染它的子元素，于是带汇总行或分组表头的表格可以手写，同时照样享有样式和滚动容器。',
      ),

      h2('属性'),
      propsTable([
        ['columns', 'TableColumn[]', '', '每列一个 { key, header, align, render }。省略它就自己手写各行。'],
        ['rows', 'object[]', '[]', '每行一个对象。'],
        ['caption', 'Child', '', '表格上方的标题。'],
        ['striped', 'boolean', 'false', '隔行加底色。'],
        ['hover', 'boolean', 'false', '高亮指针所在的行。'],
        ['dense', 'boolean', 'false', '更紧凑的单元格内边距。'],
      ]),
    ],
  })
