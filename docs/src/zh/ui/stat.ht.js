import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/zh.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: '数据指标',
    description: '一个值得一看的数字，附上它的含义和变动方向。',
    activeHref: '/zh/ui/stat',
    extraHead: uiHead(),
    children: [
      p(
        '一个指标由标签、数值，以及可选的变动组成。',
        code('statGroup()'),
        ' 会把几个指标拼到同一块面上，中间用分隔线隔开。',
      ),

      h2('基础指标'),
      demo(`statGroup(
  stat({ label: '页面数', value: '204' }),
  stat({ label: '构建耗时', value: '1.1 秒' }),
  stat({ label: '客户端 JS', value: '3.3 kB' }),
)`, { align: 'stretch' }),

      h2('带变动'),
      p(
        '变动的颜色取自 ',
        code('color'),
        '——数字朝好的方向走就用绿色，反之用红色。别只靠颜色说话：正负号或者文字要留着。',
      ),
      demo(`statGroup(
  stat({ label: '页面数', value: '204', change: '本周 +8', color: 'success' }),
  stat({ label: '构建耗时', value: '1.1 秒', change: '−0.3 秒', color: 'success' }),
  stat({ label: '打包体积', value: '9.9 kB', change: '+1.2 kB', color: 'danger' }),
)`, { align: 'stretch' }),

      h2('带图标'),
      demo(`statGroup(
  stat({
    label: '部署次数',
    value: '128',
    color: 'primary',
    icon: icon('zap'),
  }),
  stat({
    label: '贡献者',
    value: '17',
    color: 'primary',
    icon: icon('user'),
  }),
)`, { align: 'stretch' }),

      h2('帮助文本'),
      demo(`statGroup(
  stat({
    label: 'Lighthouse',
    value: '100',
    change: '无障碍',
    color: 'success',
    help: '在 CI 里对每个英文页面测量。',
  }),
  stat({
    label: 'Pagefind 索引',
    value: '204',
    help: '每次构建结束时重建。',
  }),
)`, { align: 'stretch' }),

      h2('单独使用'),
      p('单个指标不需要分组——只是它自己没有一块面而已。'),
      demo(`card(
  cardBody(stat({ label: '页面总数', value: '204', change: '+8', color: 'success' })),
)`, { align: 'stretch' }),

      h2('固定列数'),
      p(
        '指标默认会自动适配列数。当这些数字必须待在同一行时，用 ',
        code('columns'),
        ' 把数量钉死。',
      ),
      demo(`statGroup({ columns: 'repeat(2, 1fr)' },
  stat({ label: '通过', value: '215', color: 'success' }),
  stat({ label: '失败', value: '0', color: 'success' }),
)`, { align: 'stretch' }),

      h2('由数据生成'),
      demo(`return (() => {
  const report = [
    { label: '页面', value: 204 },
    { label: '资源', value: 208 },
    { label: '合计', value: '9.7 MB' },
  ]

  return statGroup(
    report.map((entry) => stat({ label: entry.label, value: String(entry.value) })),
  )
})()`, { align: 'stretch' }),

      h2('属性'),
      propsTable([
        ['label', 'Child', '', '这个数字统计的是什么。'],
        ['value', 'Child', '', '数字本身，用等宽数字排版。'],
        ['change', 'Child', '', '一个增减量，颜色由 color 决定。'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", '', '给变动和图标上色。'],
        ['icon', 'Child', '', '标签上方的装饰性字形。'],
        ['help', 'Child', '', '压在最下方的一行更轻的文字。'],
      ]),
      p(code('statGroup()'), ' 接受 ', code('columns'), '——任意 ', code('grid-template-columns'), ' 值。'),
    ],
  })
